import { Component, OnDestroy, OnInit } from '@angular/core';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription, forkJoin, interval, of, startWith, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DashboardService } from '../../../core/services/dashboard.service';
import { KitchenService } from '../../../core/services/kitchen.service';
import { TableService } from '../../../core/services/table.service';
import { ReportService } from '../../../core/services/report.service';
import { BranchContextService } from '../../../core/services/branch-context.service';
import { DashboardStats, Order, SalesReport, TableInfo, TopItemReport } from '../../../core/models/restaurant.model';

interface KitchenColumn {
  labelKey: string;
  statuses: string[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, NgFor, DecimalPipe, FormsModule, RouterLink, TranslateModule, BaseChartDirective, MatProgressSpinnerModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  loading = true;
  chartYear = new Date().getFullYear();
  stats: DashboardStats = {
    todaySales: 0, todayOrders: 0, activeOrders: 0, lowStockItems: 0, totalCustomers: 0, staffCount: 0
  };
  kitchenOrders: Order[] = [];
  tables: TableInfo[] = [];
  topItems: TopItemReport[] = [];
  private sub?: Subscription;

  readonly kitchenColumns: KitchenColumn[] = [
    { labelKey: 'DASHBOARD.KITCHEN_NEW', statuses: ['PENDING', 'ACCEPTED'] },
    { labelKey: 'DASHBOARD.KITCHEN_PREP', statuses: ['PREPARING'] },
    { labelKey: 'DASHBOARD.KITCHEN_READY', statuses: ['READY'] }
  ];

  staffRoles = [
    { icon: 'supervisor_account', labelKey: 'STAFF.MANAGERS', count: 1 },
    { icon: 'restaurant', labelKey: 'STAFF.CHEFS', count: 2 },
    { icon: 'skillet', labelKey: 'STAFF.COOKS', count: 6 },
    { icon: 'room_service', labelKey: 'STAFF.WAITERS', count: 10 }
  ];

  revenueChart: ChartConfiguration<'line'> = {
    type: 'line',
    data: { labels: [], datasets: [] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a1a28',
          titleColor: '#f8fafc',
          bodyColor: '#94a3b8',
          borderColor: 'rgba(139,92,246,0.3)',
          borderWidth: 1,
          padding: 12,
          displayColors: false
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } }
        }
      }
    }
  };

  constructor(
    private readonly dashboard: DashboardService,
    private readonly kitchen: KitchenService,
    private readonly tablesSvc: TableService,
    private readonly reports: ReportService,
    private readonly branchCtx: BranchContextService,
    private readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    Chart.register(...registerables);
    this.loadRevenueChart();
    this.loadAll();
    this.sub = interval(20000).pipe(
      startWith(0),
      switchMap(() => this.kitchen.getActiveOrders(this.branchCtx.activeBranchId))
    ).subscribe({
      next: (r) => { this.kitchenOrders = r.data ?? []; },
      error: () => {}
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  kitchenTickets(statuses: string[]): Order[] {
    return this.kitchenOrders.filter((o) => statuses.includes(o.status)).slice(0, 2);
  }

  kitchenCount(statuses: string[]): number {
    return this.kitchenOrders.filter((o) => statuses.includes(o.status)).length;
  }

  foodEmoji(index: number): string {
    return ['🥧', '🍲', '🌮', '🍣', '🍰', '☕'][index % 6];
  }

  private loadAll(): void {
    const branchId = this.branchCtx.activeBranchId;
    const today = new Date().toISOString().slice(0, 10);
    const from = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
    let pending = 3;
    const done = () => { if (--pending <= 0) this.loading = false; };

    this.dashboard.getStats(branchId).subscribe({
      next: (r) => {
        this.stats = r.data ?? this.stats;
        this.updateStaffCounts();
        done();
      },
      error: () => done()
    });

    this.tablesSvc.getTables({ branchId }).subscribe({
      next: (r) => { this.tables = r.data ?? []; done(); },
      error: () => { this.tables = []; done(); }
    });

    this.reports.getTopItems(branchId, from, today, 6).subscribe({
      next: (r) => {
        this.topItems = (r.data as TopItemReport[]) ?? [];
        done();
      },
      error: () => { this.topItems = []; done(); }
    });
  }

  private updateStaffCounts(): void {
    const total = this.stats.staffCount ?? 19;
    this.staffRoles = [
      { icon: 'supervisor_account', labelKey: 'STAFF.MANAGERS', count: Math.max(1, Math.round(total * 0.1)) },
      { icon: 'restaurant', labelKey: 'STAFF.CHEFS', count: Math.max(1, Math.round(total * 0.15)) },
      { icon: 'skillet', labelKey: 'STAFF.COOKS', count: Math.max(2, Math.round(total * 0.35)) },
      { icon: 'room_service', labelKey: 'STAFF.WAITERS', count: Math.max(3, total - Math.max(1, Math.round(total * 0.1)) - Math.max(1, Math.round(total * 0.15)) - Math.max(2, Math.round(total * 0.35))) }
    ];
  }

  private loadRevenueChart(): void {
    const branchId = this.branchCtx.activeBranchId;
    const year = this.chartYear;
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const requests = Array.from({ length: 12 }, (_, index) =>
      this.reports.getMonthlySales(branchId, year, index + 1).pipe(
        catchError(() => of({ data: { totalSales: 0 } as SalesReport }))
      )
    );

    forkJoin(requests).subscribe((results) => {
      const values = results.map((r) => Number((r.data as SalesReport)?.totalSales ?? 0));
      this.revenueChart = {
        ...this.revenueChart,
        data: {
          labels,
          datasets: [{
            label: 'Revenue',
            data: values,
            borderColor: '#8b5cf6',
            backgroundColor: (ctx) => {
              const chart = ctx.chart;
              const { ctx: c, chartArea } = chart;
              if (!chartArea) return 'rgba(139,92,246,0.1)';
              const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
              g.addColorStop(0, 'rgba(139, 92, 246, 0.35)');
              g.addColorStop(1, 'rgba(139, 92, 246, 0)');
              return g;
            },
            fill: true,
            tension: 0.45,
            borderWidth: 2.5,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#f97316',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2
          }]
        }
      };
    });
  }
}

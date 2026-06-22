import { Component, OnInit } from '@angular/core';
import { DecimalPipe, NgIf } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { DashboardService } from '../../../core/services/dashboard.service';
import { BranchContextService } from '../../../core/services/branch-context.service';
import { DashboardStats } from '../../../core/models/restaurant.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, DecimalPipe, TranslateModule, PageHeaderComponent, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;

  salesChart: ChartConfiguration<'line'> = {
    type: 'line',
    data: { labels: [], datasets: [{ data: [], label: '', borderColor: '#b48a40', backgroundColor: 'rgba(180,138,64,.15)', fill: true }] },
    options: { responsive: true, maintainAspectRatio: false }
  };

  ordersChart: ChartConfiguration<'doughnut'> = {
    type: 'doughnut',
    data: { labels: [], datasets: [{ data: [], backgroundColor: ['#b8651a', '#3d6290', '#2f6a3a', '#8e6a2b'] }] },
    options: { responsive: true, maintainAspectRatio: false }
  };

  constructor(
    private readonly dashboard: DashboardService,
    private readonly branchCtx: BranchContextService,
    private readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.initChartLabels();
    this.dashboard.getStats(this.branchCtx.activeBranchId).subscribe({
      next: (r) => {
        this.stats = r.data ?? null;
        this.updateChartsFromStats();
      },
      error: () => {
        this.stats = { todaySales: 0, todayOrders: 0, activeOrders: 0, lowStockItems: 0, totalCustomers: 0, staffCount: 0 };
        this.updateChartsFromStats();
      }
    });
  }

  private initChartLabels(): void {
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d) => this.translate.instant(`CHART.${d}`));
    const orderStatuses = ['PENDING', 'PREPARING', 'READY', 'COMPLETED'].map((s) => this.translate.instant(`ORDERS.${s}`));
    this.salesChart = {
      ...this.salesChart,
      data: {
        labels: days,
        datasets: [{
          ...this.salesChart.data.datasets[0],
          label: this.translate.instant('CHART.SALES'),
          data: [0, 0, 0, 0, 0, 0, 0]
        }]
      }
    };
    this.ordersChart = {
      ...this.ordersChart,
      data: {
        labels: orderStatuses,
        datasets: [{ ...this.ordersChart.data.datasets[0], data: [0, 0, 0, 0] }]
      }
    };
  }

  private updateChartsFromStats(): void {
    if (!this.stats) return;
    const sales = this.stats.todaySales ?? 0;
    const salesData = [...(this.salesChart.data.datasets[0].data as number[])];
    salesData[salesData.length - 1] = sales;
    this.salesChart = {
      ...this.salesChart,
      data: {
        ...this.salesChart.data,
        datasets: [{ ...this.salesChart.data.datasets[0], data: salesData }]
      }
    };
    const active = this.stats.activeOrders ?? 0;
    const today = this.stats.todayOrders ?? 0;
    this.ordersChart = {
      ...this.ordersChart,
      data: {
        ...this.ordersChart.data,
        datasets: [{ ...this.ordersChart.data.datasets[0], data: [active, Math.max(today - active, 0), 0, today] }]
      }
    };
  }
}

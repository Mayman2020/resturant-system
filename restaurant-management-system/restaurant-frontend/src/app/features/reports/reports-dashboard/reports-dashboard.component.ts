import { Component, OnInit } from '@angular/core';
import { DecimalPipe, NgIf } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { ReportService } from '../../../core/services/report.service';
import { BranchContextService } from '../../../core/services/branch-context.service';
import { SalesReport, TopItemReport } from '../../../core/models/restaurant.model';

@Component({
  selector: 'app-reports-dashboard',
  standalone: true,
  imports: [NgIf, DecimalPipe, TranslateModule, PageHeaderComponent, BaseChartDirective, MatProgressSpinnerModule],
  templateUrl: './reports-dashboard.component.html',
  styleUrl: './reports-dashboard.component.scss'
})
export class ReportsDashboardComponent implements OnInit {
  dailySales: SalesReport | null = null;
  loading = true;

  salesChart: ChartConfiguration<'bar'> = {
    type: 'bar',
    data: { labels: [], datasets: [{ data: [], label: '', backgroundColor: '#8b5cf6' }] },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      animation: false,
      scales: {
        x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.06)' } },
        y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.06)' } }
      },
      plugins: { legend: { labels: { color: '#e2e8f0' } } }
    }
  };

  topItemsChart: ChartConfiguration<'bar'> = {
    type: 'bar',
    data: { labels: [], datasets: [{ data: [], label: '', backgroundColor: '#38bdf8' }] },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      animation: false,
      indexAxis: 'y',
      scales: {
        x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.06)' } },
        y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.06)' } }
      },
      plugins: { legend: { labels: { color: '#e2e8f0' } } }
    }
  };

  constructor(
    private readonly reports: ReportService,
    private readonly branchCtx: BranchContextService,
    private readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    Chart.register(...registerables);
    const branchId = this.branchCtx.activeBranchId;
    const today = new Date().toISOString().slice(0, 10);
    const from = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

    this.reports.getDailySales(branchId, today).subscribe({
      next: (r) => {
        this.dailySales = (r.data as SalesReport) ?? null;
        this.bindSalesChart();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });

    this.reports.getTopItems(branchId, from, today).subscribe({
      next: (r) => {
        const items = (r.data as TopItemReport[]) ?? [];
        this.bindTopItemsChart(items);
      },
      error: () => {}
    });
  }

  private bindSalesChart(): void {
    const label = this.dailySales?.period ?? this.translate.instant('REPORTS.DAILY');
    const total = Number(this.dailySales?.totalSales ?? 0);
    this.salesChart = {
      ...this.salesChart,
      data: {
        labels: [label],
        datasets: [{
          ...this.salesChart.data.datasets[0],
          label: this.translate.instant('CHART.SALES'),
          data: [total]
        }]
      }
    };
  }

  private bindTopItemsChart(items: TopItemReport[]): void {
    this.topItemsChart = {
      ...this.topItemsChart,
      data: {
        labels: items.map((i) => i.itemName),
        datasets: [{
          ...this.topItemsChart.data.datasets[0],
          label: this.translate.instant('REPORTS.TOP_ITEMS'),
          data: items.map((i) => i.quantitySold)
        }]
      }
    };
  }
}


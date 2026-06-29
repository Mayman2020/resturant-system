import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { RmsIconBtnComponent } from '../../../shared/components/rms-icon-btn/rms-icon-btn.component';
import { TablePagerComponent } from '../../../shared/components/table-pager/table-pager.component';
import { NotificationService } from '../../../core/services/notification.service';
import { NotificationItem } from '../../../core/models/notification.model';
import { RmsDatePipe } from '../../../shared/pipes/rms-date.pipe';
import { I18nService } from '../../../core/i18n/i18n.service';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [NgFor, NgIf, RmsDatePipe, TranslateModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, PageHeaderComponent, RmsIconBtnComponent, TablePagerComponent],
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.scss'
})
export class NotificationsPageComponent implements OnInit {
  loading = false;
  page = 0;
  size = 10;
  total = 0;
  rows: NotificationItem[] = [];

  constructor(
    private readonly svc: NotificationService,
    private readonly i18n: I18nService,
    private readonly router: Router
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.svc.list(this.page, this.size).subscribe({
      next: (r) => {
        this.rows = r.data?.content ?? [];
        this.total = r.data?.totalElements ?? 0;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  get unreadCount(): number {
    return this.rows.filter((n) => !n.read).length;
  }

  text(key: string, n: NotificationItem): string {
    let params: Record<string, string> = {};
    if (n.varsJson) { try { params = JSON.parse(n.varsJson); } catch { /* ignore */ } }
    return this.i18n.instant(key, params);
  }

  onClick(n: NotificationItem): void {
    this.svc.markRead(n.id).subscribe();
    n.read = true;
    if (n.referenceType === 'Order' && n.referenceId) {
      void this.router.navigate(['/admin/orders', n.referenceId]);
    } else if (n.referenceType === 'Inventory') {
      void this.router.navigate(['/admin/inventory']);
    }
  }

  markAllRead(): void {
    this.svc.markAllRead().subscribe({ next: () => this.load() });
  }

  onPageIndexChange(index: number): void {
    this.page = index;
    this.load();
  }
}

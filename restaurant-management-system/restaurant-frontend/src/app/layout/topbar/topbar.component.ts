import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { TranslateModule } from '@ngx-translate/core';
import { I18nService, LangCode } from '../../core/i18n/i18n.service';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';
import { BranchService } from '../../core/services/branch.service';
import { BranchContextService } from '../../core/services/branch-context.service';
import { NotificationService } from '../../core/services/notification.service';
import { Branch } from '../../core/models/restaurant.model';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [NgFor, FormsModule, RouterLink, MatButtonModule, MatIconModule, MatMenuModule, MatSelectModule, MatFormFieldModule, MatTooltipModule, MatBadgeModule, TranslateModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  branches: Branch[] = [];
  selectedBranchId = 1;
  unreadCount = 0;
  searchQuery = '';

  constructor(
    readonly i18n: I18nService,
    readonly theme: ThemeService,
    readonly auth: AuthService,
    private readonly branchService: BranchService,
    private readonly branchContext: BranchContextService,
    private readonly notifications: NotificationService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.selectedBranchId = this.branchContext.activeBranchId;
    this.branchService.getAll().subscribe({
      next: (r) => { this.branches = r.data ?? []; },
      error: () => { this.branches = []; }
    });
    this.refreshUnread();
  }

  get initials(): string {
    const u = this.auth.getCurrentUser();
    return (u?.initials || u?.fullName?.slice(0, 2) || u?.username?.slice(0, 2) || 'U').toUpperCase();
  }

  get languages() {
    return this.i18n.languages;
  }

  get activeLanguage() {
    return this.languages.find((l) => l.code === this.i18n.currentLang) ?? this.languages[0];
  }

  private refreshUnread(): void {
    this.notifications.unreadCount().subscribe({
      next: (r) => { this.unreadCount = r.data?.unreadCount ?? 0; }
    });
  }

  setLang(code: LangCode): void {
    this.i18n.setLang(code).subscribe();
  }

  onBranchChange(id: number): void {
    this.branchContext.setActiveBranchId(id);
  }

  onSearch(): void {
    const q = this.searchQuery.trim();
    if (!q) return;
    this.router.navigate(['/admin/orders'], { queryParams: { q } });
  }

  get themeTooltipKey(): string {
    return this.theme.isDark ? 'TOPBAR.LIGHT_MODE' : 'TOPBAR.DARK_MODE';
  }
}

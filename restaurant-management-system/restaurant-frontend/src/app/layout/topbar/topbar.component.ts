import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { I18nService, LangCode } from '../../core/i18n/i18n.service';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';
import { BranchService } from '../../core/services/branch.service';
import { BranchContextService } from '../../core/services/branch-context.service';
import { Branch } from '../../core/models/restaurant.model';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [NgFor, MatButtonModule, MatIconModule, MatMenuModule, MatSelectModule, MatFormFieldModule, TranslateModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  branches: Branch[] = [];
  selectedBranchId = 1;

  constructor(
    readonly i18n: I18nService,
    readonly theme: ThemeService,
    readonly auth: AuthService,
    private readonly branchService: BranchService,
    private readonly branchContext: BranchContextService
  ) {}

  ngOnInit(): void {
    this.selectedBranchId = this.branchContext.activeBranchId;
    this.branchService.getAll().subscribe({
      next: (r) => { this.branches = r.data ?? []; },
      error: () => { this.branches = [{ id: 1, name: 'Main Branch', code: 'BR-001' }]; }
    });
  }

  setLang(code: LangCode): void {
    this.i18n.setLang(code).subscribe();
  }

  onBranchChange(id: number): void {
    this.branchContext.setActiveBranchId(id);
  }

  get themeTooltipKey(): string {
    return this.theme.isDark ? 'TOPBAR.SWITCH_LIGHT' : 'TOPBAR.SWITCH_DARK';
  }
}

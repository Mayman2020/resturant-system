import { Component, OnInit } from '@angular/core';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { RmsIconBtnComponent } from '../../../shared/components/rms-icon-btn/rms-icon-btn.component';
import { LocalizedNamePipe } from '../../../shared/pipes/localized-name.pipe';
import { MenuService } from '../../../core/services/menu.service';
import { SnackService } from '../../../core/services/snack.service';
import { BranchContextService } from '../../../core/services/branch-context.service';
import { RmsDialogService } from '../../../shared/services/rms-dialog.service';
import { MenuCategoryDialogComponent } from '../../../shared/dialogs/menu-category-dialog.component';
import { MenuItemDialogComponent } from '../../../shared/dialogs/menu-item-dialog.component';
import { MenuCategory, MenuItem } from '../../../core/models/restaurant.model';

@Component({
  selector: 'app-menu-management',
  standalone: true,
  imports: [
    NgFor, NgIf, DecimalPipe, TranslateModule, MatButtonModule,
    PageHeaderComponent, RmsIconBtnComponent, LocalizedNamePipe
  ],
  templateUrl: './menu-management.component.html',
  styleUrl: './menu-management.component.scss'
})
export class MenuManagementComponent implements OnInit {
  categories: MenuCategory[] = [];
  items: MenuItem[] = [];

  constructor(
    private readonly menu: MenuService,
    private readonly branchCtx: BranchContextService,
    private readonly dialogs: RmsDialogService,
    private readonly snack: SnackService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const branchId = this.branchCtx.activeBranchId;
    this.menu.getCategories({ branchId }).subscribe({
      next: (r) => { this.categories = r.data ?? []; },
      error: () => { this.categories = []; }
    });
    this.menu.getItems().subscribe({
      next: (r) => { this.items = r.data ?? []; },
      error: () => { this.items = []; }
    });
  }

  openCategoryDialog(): void {
    this.dialogs.open(MenuCategoryDialogComponent, { width: '520px' }).afterClosed().subscribe((ok) => {
      if (ok) this.load();
    });
  }

  openItemDialog(): void {
    this.dialogs.open(MenuItemDialogComponent, {
      width: '560px',
      data: { categories: this.categories }
    }).afterClosed().subscribe((ok) => {
      if (ok) this.load();
    });
  }

  deleteItem(id: number): void {
    this.dialogs.confirmDelete().subscribe((ok) => {
      if (!ok) return;
      this.menu.deleteItem(id).subscribe({
        next: () => {
          this.snack.successKey('MESSAGES.DELETED');
          this.load();
        },
        error: (err: Error) => this.snack.error(err.message)
      });
    });
  }
}

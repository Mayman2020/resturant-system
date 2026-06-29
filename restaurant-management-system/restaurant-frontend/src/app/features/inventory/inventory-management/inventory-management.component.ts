import { Component, OnInit } from '@angular/core';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { RmsIconBtnComponent } from '../../../shared/components/rms-icon-btn/rms-icon-btn.component';
import { InventoryService } from '../../../core/services/inventory.service';
import { BranchContextService } from '../../../core/services/branch-context.service';
import { RmsDialogService } from '../../../shared/services/rms-dialog.service';
import { InventoryItemDialogComponent } from '../../../shared/dialogs/inventory-item-dialog.component';
import { InventoryAdjustDialogComponent } from '../../../shared/dialogs/inventory-adjust-dialog.component';
import { InventoryItem } from '../../../core/models/restaurant.model';

@Component({
  selector: 'app-inventory-management',
  standalone: true,
  imports: [
    NgFor, NgIf, DecimalPipe, TranslateModule, MatButtonModule,
    PageHeaderComponent, RmsIconBtnComponent
  ],
  templateUrl: './inventory-management.component.html',
  styleUrl: './inventory-management.component.scss'
})
export class InventoryManagementComponent implements OnInit {
  items: InventoryItem[] = [];
  readonly movementTypes = ['STOCK_IN', 'USAGE', 'WASTE'];

  constructor(
    private readonly inventory: InventoryService,
    private readonly branchCtx: BranchContextService,
    private readonly dialogs: RmsDialogService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.inventory.getAll({ branchId: this.branchCtx.activeBranchId }).subscribe({
      next: (r) => { this.items = r.data ?? []; },
      error: () => { this.items = []; }
    });
  }

  openAddDialog(): void {
    this.dialogs.open(InventoryItemDialogComponent, { width: '540px' }).afterClosed().subscribe((ok) => {
      if (ok) this.load();
    });
  }

  openAdjustDialog(): void {
    this.dialogs.open(InventoryAdjustDialogComponent, {
      width: '540px',
      data: { items: this.items, movementTypes: this.movementTypes }
    }).afterClosed().subscribe((ok) => {
      if (ok) this.load();
    });
  }

  isLowStock(item: InventoryItem): boolean {
    const stock = Number(item.currentStock ?? item.quantity ?? 0);
    const min = Number(item.minStock ?? item.reorderLevel ?? 0);
    return stock <= min;
  }

  get lowStockCount(): number {
    return this.items.filter((i) => this.isLowStock(i)).length;
  }

  get activeCount(): number {
    return this.items.filter((i) => !this.isLowStock(i)).length;
  }

  stockLevel(item: InventoryItem): number {
    return Number(item.currentStock ?? item.quantity ?? 0);
  }
}

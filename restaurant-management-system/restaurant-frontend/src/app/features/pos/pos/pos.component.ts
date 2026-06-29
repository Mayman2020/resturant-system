import { Component, OnInit } from '@angular/core';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { LocalizedNamePipe } from '../../../shared/pipes/localized-name.pipe';
import { MenuService } from '../../../core/services/menu.service';
import { OrderService } from '../../../core/services/order.service';
import { TableService } from '../../../core/services/table.service';
import { BranchContextService } from '../../../core/services/branch-context.service';
import { MenuCategory, MenuItem, TableInfo } from '../../../core/models/restaurant.model';
import { SnackService } from '../../../core/services/snack.service';

interface CartLine {
  item: MenuItem;
  qty: number;
}

type OrderType = 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
type PaymentMethod = 'CASH' | 'CARD' | 'WALLET';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [
    NgFor, NgIf, DecimalPipe, TranslateModule, MatButtonModule, MatSelectModule,
    MatFormFieldModule, MatIconModule, PageHeaderComponent, LocalizedNamePipe
  ],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.scss'
})
export class PosComponent implements OnInit {
  categories: MenuCategory[] = [];
  items: MenuItem[] = [];
  tables: TableInfo[] = [];
  selectedCategoryId: number | null = null;
  cart: CartLine[] = [];
  orderType: OrderType = 'DINE_IN';
  selectedTableId: number | null = null;
  paymentMethod: PaymentMethod = 'CASH';
  placing = false;
  readonly orderTypes: OrderType[] = ['DINE_IN', 'TAKEAWAY', 'DELIVERY'];
  readonly paymentMethods: PaymentMethod[] = ['CASH', 'CARD', 'WALLET'];

  constructor(
    private readonly menu: MenuService,
    private readonly orders: OrderService,
    private readonly tablesSvc: TableService,
    private readonly branchCtx: BranchContextService,
    private readonly snack: SnackService
  ) {}

  ngOnInit(): void {
    const branchId = this.branchCtx.activeBranchId;
    this.menu.getCategories({ branchId }).subscribe({
      next: (r) => {
        this.categories = r.data ?? [];
        if (this.categories.length) this.selectCategory(this.categories[0].id);
      },
      error: () => { this.categories = []; }
    });
    this.tablesSvc.getTables({ branchId }).subscribe({
      next: (r) => { this.tables = r.data ?? []; },
      error: () => { this.tables = []; }
    });
  }

  selectCategory(id: number): void {
    this.selectedCategoryId = id;
    this.menu.getItems({ categoryId: id }).subscribe({
      next: (r) => { this.items = r.data ?? []; },
      error: () => { this.items = []; }
    });
  }

  addToCart(item: MenuItem): void {
    const existing = this.cart.find((l) => l.item.id === item.id);
    if (existing) existing.qty += 1;
    else this.cart = [...this.cart, { item, qty: 1 }];
  }

  increaseQty(line: CartLine): void {
    line.qty += 1;
    this.cart = [...this.cart];
  }

  decreaseQty(line: CartLine): void {
    if (line.qty <= 1) this.removeFromCart(line);
    else { line.qty -= 1; this.cart = [...this.cart]; }
  }

  removeFromCart(line: CartLine): void {
    this.cart = this.cart.filter((l) => l !== line);
  }

  clearCart(): void {
    this.cart = [];
  }

  get total(): number {
    return this.cart.reduce((sum, line) => sum + line.item.price * line.qty, 0);
  }

  get canPlaceOrder(): boolean {
    if (!this.cart.length) return false;
    if (this.orderType === 'DINE_IN' && !this.selectedTableId) return false;
    return true;
  }

  productTone(index: number): string {
    const tones = ['orange', 'gold', 'cyan', 'rose', 'green', 'indigo'];
    return tones[index % tones.length];
  }

  placeOrder(): void {
    if (!this.canPlaceOrder || this.placing) return;
    this.placing = true;
    const payload: Record<string, unknown> = {
      branchId: this.branchCtx.activeBranchId,
      orderType: this.orderType,
      items: this.cart.map((l) => ({
        menuItemId: l.item.id,
        quantity: l.qty,
        unitPrice: l.item.price
      }))
    };
    if (this.orderType === 'DINE_IN' && this.selectedTableId) {
      payload['tableId'] = this.selectedTableId;
    }
    this.orders.create(payload).subscribe({
      next: (r) => {
        const orderId = r.data?.id;
        if (!orderId) {
          this.placing = false;
          return;
        }
        this.orders.checkout(orderId, { paymentMethod: this.paymentMethod, amount: this.total }).subscribe({
          next: () => {
            this.cart = [];
            this.placing = false;
            this.snack.successKey('MESSAGES.ORDER_PLACED');
            this.snack.successKey('MESSAGES.CHECKOUT_DONE');
          },
          error: (err: Error) => {
            this.placing = false;
            this.snack.error(err.message);
          }
        });
      },
      error: (err: Error) => {
        this.placing = false;
        this.snack.error(err.message);
      }
    });
  }
}


import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { Subscription, interval, switchMap, startWith } from 'rxjs';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EnumTranslatePipe } from '../../../shared/pipes/enum-translate.pipe';
import { LocalizedNamePipe } from '../../../shared/pipes/localized-name.pipe';
import { KitchenService } from '../../../core/services/kitchen.service';
import { BranchContextService } from '../../../core/services/branch-context.service';
import { Order, OrderItem } from '../../../core/models/restaurant.model';

@Component({
  selector: 'app-kitchen-display',
  standalone: true,
  imports: [NgFor, NgIf, TranslateModule, MatButtonModule, PageHeaderComponent, EnumTranslatePipe, LocalizedNamePipe],
  templateUrl: './kitchen-display.component.html',
  styleUrl: './kitchen-display.component.scss'
})
export class KitchenDisplayComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  private sub?: Subscription;

  readonly newStatuses = ['PENDING', 'ACCEPTED'];
  readonly progressStatuses = ['PREPARING'];
  readonly readyStatuses = ['READY'];

  constructor(
    private readonly kitchen: KitchenService,
    private readonly branchCtx: BranchContextService
  ) {}

  ngOnInit(): void {
    this.sub = interval(15000).pipe(
      startWith(0),
      switchMap(() => this.kitchen.getActiveOrders(this.branchCtx.activeBranchId))
    ).subscribe({
      next: (r) => { this.orders = r.data ?? []; },
      error: () => { this.orders = []; }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ordersByStatuses(statuses: string[]): Order[] {
    return this.orders.filter((o) => statuses.includes(o.status));
  }

  elapsedMinutes(order: Order): number {
    if (!order.createdAt) return 0;
    return Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
  }

  advance(order: Order): void {
    this.kitchen.advanceOrder(order.id).subscribe({
      next: (r) => {
        const updated = r.data;
        if (!updated) return;
        this.orders = this.orders.map((o) => o.id === updated.id ? updated : o)
          .filter((o) => !['COMPLETED', 'DELIVERED', 'CANCELLED'].includes(o.status));
      }
    });
  }

  itemLabel(item: OrderItem): string {
    return item.name;
  }
}

import { Component, OnInit } from '@angular/core';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EnumTranslatePipe } from '../../../shared/pipes/enum-translate.pipe';
import { OrderService } from '../../../core/services/order.service';
import { BranchContextService } from '../../../core/services/branch-context.service';
import { Order } from '../../../core/models/restaurant.model';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [NgFor, NgIf, DecimalPipe, RouterLink, TranslateModule, PageHeaderComponent, EnumTranslatePipe],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.scss'
})
export class OrdersListComponent implements OnInit {
  orders: Order[] = [];
  loading = true;

  constructor(
    private readonly ordersSvc: OrderService,
    private readonly branchCtx: BranchContextService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.ordersSvc.getOrders({ branchId: this.branchCtx.activeBranchId }).subscribe({
      next: (r) => {
        this.orders = r.data ?? [];
        this.loading = false;
      },
      error: () => {
        this.orders = [];
        this.loading = false;
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';

import { DecimalPipe, NgFor, NgIf } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TranslateModule } from '@ngx-translate/core';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

import { RmsIconBtnComponent } from '../../../shared/components/rms-icon-btn/rms-icon-btn.component';

import { TablePagerComponent } from '../../../shared/components/table-pager/table-pager.component';

import { EnumTranslatePipe } from '../../../shared/pipes/enum-translate.pipe';

import { OrderService } from '../../../core/services/order.service';

import { BranchContextService } from '../../../core/services/branch-context.service';

import { Order } from '../../../core/models/restaurant.model';



@Component({

  selector: 'app-orders-list',

  standalone: true,

  imports: [

    NgFor, NgIf, DecimalPipe, FormsModule, RouterLink, MatButtonModule, MatProgressSpinnerModule,

    TranslateModule, PageHeaderComponent, RmsIconBtnComponent, TablePagerComponent, EnumTranslatePipe

  ],

  templateUrl: './orders-list.component.html',

  styleUrl: './orders-list.component.scss'

})

export class OrdersListComponent implements OnInit {

  orders: Order[] = [];

  filteredOrders: Order[] = [];

  loading = true;

  search = '';

  page = 0;

  size = 10;



  constructor(

    private readonly ordersSvc: OrderService,

    private readonly branchCtx: BranchContextService

  ) {}



  ngOnInit(): void {

    this.load();

  }



  get pagedOrders(): Order[] {

    const start = this.page * this.size;

    return this.filteredOrders.slice(start, start + this.size);

  }

  get pendingCount(): number {
    return this.orders.filter((o) => o.status === 'PENDING').length;
  }

  get preparingCount(): number {
    return this.orders.filter((o) => o.status === 'PREPARING' || o.status === 'READY').length;
  }

  get completedCount(): number {
    return this.orders.filter((o) => o.status === 'COMPLETED' || o.status === 'SERVED' || o.status === 'PAID').length;
  }



  load(): void {

    this.loading = true;

    this.ordersSvc.getOrders({ branchId: this.branchCtx.activeBranchId }).subscribe({

      next: (r) => {

        this.orders = r.data ?? [];

        this.applyFilter(false);

        this.loading = false;

      },

      error: () => {

        this.orders = [];

        this.filteredOrders = [];

        this.loading = false;

      }

    });

  }



  applyFilter(resetPage = true): void {

    const q = this.search.trim().toLowerCase();

    this.filteredOrders = q

      ? this.orders.filter((o) => String(o.orderNumber).includes(q) || String(o.status).toLowerCase().includes(q))

      : [...this.orders];

    if (resetPage) this.page = 0;

  }



  onPageChange(index: number): void {

    this.page = index;

  }

}



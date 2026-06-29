import { Component, OnInit } from '@angular/core';

import { DecimalPipe, NgFor, NgIf } from '@angular/common';

import { ActivatedRoute, RouterLink } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { MatButtonModule } from '@angular/material/button';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

import { RmsIconBtnComponent } from '../../../shared/components/rms-icon-btn/rms-icon-btn.component';

import { EnumTranslatePipe } from '../../../shared/pipes/enum-translate.pipe';

import { OrderService } from '../../../core/services/order.service';

import { SnackService } from '../../../core/services/snack.service';

import { Order } from '../../../core/models/restaurant.model';



const STATUS_FLOW = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'DELIVERED', 'COMPLETED'];



@Component({

  selector: 'app-order-detail',

  standalone: true,

  imports: [

    NgFor, NgIf, DecimalPipe, RouterLink, TranslateModule, MatButtonModule,

    MatProgressSpinnerModule, PageHeaderComponent, RmsIconBtnComponent, EnumTranslatePipe

  ],

  templateUrl: './order-detail.component.html',

  styleUrl: './order-detail.component.scss'

})

export class OrderDetailComponent implements OnInit {

  order: Order | null = null;

  loading = true;

  processing = false;



  constructor(

    private readonly route: ActivatedRoute,

    private readonly ordersSvc: OrderService,

    private readonly snack: SnackService

  ) {}



  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {

      this.order = null;

      this.loading = false;

      return;

    }

    this.load(id);

  }



  load(id: number): void {

    this.loading = true;

    this.ordersSvc.getById(id).subscribe({

      next: (r) => {

        this.order = r.data ?? null;

        this.loading = false;

      },

      error: () => {

        this.order = null;

        this.loading = false;

      }

    });

  }



  get nextStatus(): string | null {

    if (!this.order) return null;

    const idx = STATUS_FLOW.indexOf(this.order.status);

    if (idx < 0 || idx >= STATUS_FLOW.length - 1) return null;

    return STATUS_FLOW[idx + 1];

  }



  advanceStatus(): void {

    if (!this.order || !this.nextStatus || this.processing) return;

    this.processing = true;

    this.ordersSvc.updateStatus(this.order.id, this.nextStatus).subscribe({

      next: (r) => {

        this.order = r.data ?? this.order;

        this.processing = false;

        this.snack.successKey('MESSAGES.ORDER_UPDATED');

      },

      error: (err: Error) => {

        this.processing = false;

        this.snack.error(err.message);

      }

    });

  }



  toggleHold(): void {

    if (!this.order || this.processing) return;

    this.processing = true;

    const held = !this.order.held;

    this.ordersSvc.hold(this.order.id, held).subscribe({

      next: (r) => {

        this.order = r.data ?? this.order;

        this.processing = false;

        this.snack.successKey('MESSAGES.ORDER_UPDATED');

      },

      error: (err: Error) => {

        this.processing = false;

        this.snack.error(err.message);

      }

    });

  }



  checkout(): void {

    if (!this.order || this.processing) return;

    this.processing = true;

    this.ordersSvc.checkout(this.order.id, {

      paymentMethod: 'CASH',

      amount: this.order.totalAmount

    }).subscribe({

      next: (r) => {

        this.order = r.data ?? this.order;

        this.processing = false;

        this.snack.successKey('MESSAGES.CHECKOUT_DONE');

      },

      error: (err: Error) => {

        this.processing = false;

        this.snack.error(err.message);

      }

    });

  }

}




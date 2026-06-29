import { Component, OnInit } from '@angular/core';

import { NgFor, NgIf } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { MatButtonModule } from '@angular/material/button';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

import { RmsIconBtnComponent } from '../../../shared/components/rms-icon-btn/rms-icon-btn.component';

import { LoyaltyService } from '../../../core/services/loyalty.service';

import { RmsDialogService } from '../../../shared/services/rms-dialog.service';

import { CouponFormDialogComponent } from '../../../shared/dialogs/coupon-form-dialog.component';

import { Coupon } from '../../../core/models/restaurant.model';



@Component({

  selector: 'app-loyalty-management',

  standalone: true,

  imports: [

    NgFor, NgIf, TranslateModule, MatButtonModule, PageHeaderComponent, RmsIconBtnComponent

  ],

  templateUrl: './loyalty-management.component.html',

  styleUrl: './loyalty-management.component.scss'

})

export class LoyaltyManagementComponent implements OnInit {

  coupons: Coupon[] = [];



  constructor(

    private readonly loyalty: LoyaltyService,

    private readonly dialogs: RmsDialogService

  ) {}



  ngOnInit(): void {

    this.loadCoupons();

  }



  loadCoupons(): void {

    this.loyalty.getCoupons().subscribe({

      next: (r) => { this.coupons = (r.data ?? []) as Coupon[]; },

      error: () => { this.coupons = []; }

    });

  }



  get activeCouponsCount(): number {

    return this.coupons.filter((c) => c.active !== false).length;

  }



  openCouponDialog(): void {

    this.dialogs.open(CouponFormDialogComponent, { width: '520px' }).afterClosed().subscribe((ok) => {

      if (ok) this.loadCoupons();

    });

  }

}




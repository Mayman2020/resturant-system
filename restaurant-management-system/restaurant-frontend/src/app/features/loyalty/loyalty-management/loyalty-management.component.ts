import { Component, OnInit } from '@angular/core';

import { NgFor, NgIf } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { MatTabsModule } from '@angular/material/tabs';

import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

import { LoyaltyService } from '../../../core/services/loyalty.service';

import { SnackService } from '../../../core/services/snack.service';

import { Coupon } from '../../../core/models/restaurant.model';



@Component({

  selector: 'app-loyalty-management',

  standalone: true,

  imports: [

    NgFor, NgIf, ReactiveFormsModule, TranslateModule, MatTabsModule,

    MatButtonModule, MatFormFieldModule, MatInputModule, PageHeaderComponent

  ],

  templateUrl: './loyalty-management.component.html',

  styleUrl: './loyalty-management.component.scss'

})

export class LoyaltyManagementComponent implements OnInit {

  coupons: Coupon[] = [];

  showCouponForm = false;

  couponForm!: FormGroup;

  saving = false;



  constructor(

    private readonly loyalty: LoyaltyService,

    private readonly snack: SnackService,

    private readonly fb: FormBuilder

  ) {}



  ngOnInit(): void {

    this.couponForm = this.fb.group({

      code: ['', Validators.required],

      description: [''],

      discountType: ['PERCENT', Validators.required],
      discountValue: [0, Validators.required]

    });

    this.loadCoupons();

  }



  loadCoupons(): void {

    this.loyalty.getCoupons().subscribe({

      next: (r) => { this.coupons = (r.data ?? []) as Coupon[]; },

      error: () => { this.coupons = []; }

    });

  }



  toggleCouponForm(): void {

    this.showCouponForm = !this.showCouponForm;

  }



  saveCoupon(): void {

    if (this.couponForm.invalid || this.saving) return;

    this.saving = true;

    this.loyalty.createCoupon(this.couponForm.getRawValue()).subscribe({

      next: () => {

        this.saving = false;

        this.showCouponForm = false;

        this.couponForm.reset({ discountType: 'PERCENT', discountValue: 0 });

        this.snack.successKey('MESSAGES.SAVED');

        this.loadCoupons();

      },

      error: (err: Error) => {

        this.saving = false;

        this.snack.error(err.message);

      }

    });

  }

}



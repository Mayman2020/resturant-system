import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AppConstants } from '../constants/app-constants';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class LoyaltyService {
  constructor(private readonly api: ApiService) {}

  getPoints(customerId: number) {
    return this.api.get<ApiResponse<unknown>>(AppConstants.API.LOYALTY_POINTS(customerId));
  }

  adjustPoints(customerId: number, points: number) {
    return this.api.post<ApiResponse<unknown>>(AppConstants.API.LOYALTY_POINTS(customerId), { points });
  }

  getCoupons() {
    return this.api.get<ApiResponse<unknown[]>>(AppConstants.API.LOYALTY_COUPONS);
  }

  createCoupon(body: unknown) {
    return this.api.post<ApiResponse<unknown>>(AppConstants.API.LOYALTY_COUPONS, body);
  }
}

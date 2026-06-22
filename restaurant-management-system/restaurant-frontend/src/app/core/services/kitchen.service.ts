import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AppConstants } from '../constants/app-constants';
import { ApiResponse } from '../models/api-response.model';
import { Order } from '../models/restaurant.model';

@Injectable({ providedIn: 'root' })
export class KitchenService {
  constructor(private readonly api: ApiService) {}

  getActiveOrders(branchId?: number) {
    const params = branchId ? { branchId } : undefined;
    return this.api.get<ApiResponse<Order[]>>(AppConstants.API.KITCHEN_ACTIVE, params);
  }

  advanceOrder(id: number) {
    return this.api.patch<ApiResponse<Order>>(AppConstants.API.KITCHEN_ADVANCE(id), {});
  }
}

import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AppConstants } from '../constants/app-constants';
import { ApiResponse } from '../models/api-response.model';
import { Order } from '../models/restaurant.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private readonly api: ApiService) {}

  getOrders(params?: Record<string, string | number | boolean>) {
    return this.api.get<ApiResponse<Order[]>>(AppConstants.API.ORDERS, params);
  }

  getById(id: number) {
    return this.api.get<ApiResponse<Order>>(AppConstants.API.ORDER_BY_ID(id));
  }

  create(body: unknown) {
    return this.api.post<ApiResponse<Order>>(AppConstants.API.ORDERS, body);
  }

  updateStatus(id: number, status: string) {
    return this.api.patch<ApiResponse<Order>>(AppConstants.API.ORDER_STATUS(id), { status });
  }

  hold(id: number, held = true) {
    return this.api.patch<ApiResponse<Order>>(AppConstants.API.ORDER_HOLD(id), null, { held: String(held) });
  }

  split(id: number, itemIds: number[]) {
    return this.api.post<ApiResponse<Order>>(AppConstants.API.ORDER_SPLIT(id), itemIds);
  }

  merge(orderIds: number[]) {
    return this.api.post<ApiResponse<Order>>(AppConstants.API.ORDER_MERGE, { orderIds });
  }

  checkout(id: number, body: { paymentMethod: string; amount: number; tipAmount?: number; reference?: string }) {
    return this.api.post<ApiResponse<Order>>(AppConstants.API.ORDER_CHECKOUT(id), body);
  }
}

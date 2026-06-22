import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AppConstants } from '../constants/app-constants';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(private readonly api: ApiService) {}

  private params(values: Record<string, string | number | boolean | undefined>) {
    const out: Record<string, string | number | boolean> = {};
    Object.entries(values).forEach(([k, v]) => { if (v != null) out[k] = v; });
    return Object.keys(out).length ? out : undefined;
  }

  getDailySales(branchId?: number, date?: string) {
    return this.api.get<ApiResponse<unknown>>(AppConstants.API.REPORTS_SALES_DAILY, this.params({ branchId, date }));
  }

  getMonthlySales(branchId?: number, year?: number, month?: number) {
    return this.api.get<ApiResponse<unknown>>(AppConstants.API.REPORTS_SALES_MONTHLY, this.params({ branchId, year, month }));
  }

  getTopItems(branchId?: number, from?: string, to?: string, limit = 10) {
    return this.api.get<ApiResponse<unknown>>(AppConstants.API.REPORTS_TOP_ITEMS, this.params({ branchId, from, to, limit }));
  }

  getBranchPerformance() {
    return this.api.get<ApiResponse<unknown>>(AppConstants.API.REPORTS_BRANCH_PERFORMANCE);
  }

  getBusiestHours(branchId?: number) {
    return this.api.get<ApiResponse<unknown>>(AppConstants.API.REPORTS_BUSIEST_HOURS, this.params({ branchId }));
  }

  getWaiterPerformance(branchId?: number) {
    return this.api.get<ApiResponse<unknown>>(AppConstants.API.REPORTS_WAITER_PERFORMANCE, this.params({ branchId }));
  }

  getKitchenPerformance(branchId?: number) {
    return this.api.get<ApiResponse<unknown>>(AppConstants.API.REPORTS_KITCHEN_PERFORMANCE, this.params({ branchId }));
  }

  getDeliveryPerformance(branchId?: number) {
    return this.api.get<ApiResponse<unknown>>(AppConstants.API.REPORTS_DELIVERY_PERFORMANCE, this.params({ branchId }));
  }

  getProfitMargins(branchId?: number) {
    return this.api.get<ApiResponse<unknown>>(AppConstants.API.REPORTS_PROFIT_MARGINS, this.params({ branchId }));
  }
}

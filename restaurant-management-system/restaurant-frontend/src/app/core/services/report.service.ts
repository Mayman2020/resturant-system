import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AppConstants } from '../constants/app-constants';
import { ApiResponse } from '../models/api-response.model';

function defaultRange(days = 30): { from: string; to: string } {
  const to = new Date();
  const from = new Date(Date.now() - days * 86400000);
  return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) };
}

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(private readonly api: ApiService) {}

  private params(values: Record<string, string | number | boolean | undefined>) {
    const out: Record<string, string | number | boolean> = {};
    Object.entries(values).forEach(([k, v]) => { if (v != null) out[k] = v; });
    return Object.keys(out).length ? out : undefined;
  }

  getDailySales(branchId?: number, date?: string) {
    const day = date ?? new Date().toISOString().slice(0, 10);
    return this.api.get<ApiResponse<unknown>>(AppConstants.API.REPORTS_SALES_DAILY, this.params({ branchId, date: day }));
  }

  getMonthlySales(branchId?: number, year?: number, month?: number) {
    const now = new Date();
    return this.api.get<ApiResponse<unknown>>(AppConstants.API.REPORTS_SALES_MONTHLY, this.params({
      branchId,
      year: year ?? now.getFullYear(),
      month: month ?? now.getMonth() + 1
    }));
  }

  getTopItems(branchId?: number, from?: string, to?: string, limit = 10) {
    const range = defaultRange();
    return this.api.get<ApiResponse<unknown>>(AppConstants.API.REPORTS_TOP_ITEMS, this.params({
      branchId, from: from ?? range.from, to: to ?? range.to, limit
    }));
  }

  getBranchPerformance(from?: string, to?: string) {
    const range = defaultRange();
    return this.api.get<ApiResponse<unknown>>(AppConstants.API.REPORTS_BRANCH_PERFORMANCE, this.params({
      from: from ?? range.from,
      to: to ?? range.to
    }));
  }

  getBusiestHours(branchId?: number, from?: string, to?: string) {
    const range = defaultRange();
    return this.api.get<ApiResponse<unknown>>(AppConstants.API.REPORTS_BUSIEST_HOURS, this.params({
      branchId, from: from ?? range.from, to: to ?? range.to
    }));
  }

  getWaiterPerformance(branchId?: number, from?: string, to?: string) {
    const range = defaultRange();
    return this.api.get<ApiResponse<unknown>>(AppConstants.API.REPORTS_WAITER_PERFORMANCE, this.params({
      branchId, from: from ?? range.from, to: to ?? range.to
    }));
  }

  getKitchenPerformance(branchId?: number, from?: string, to?: string) {
    const range = defaultRange();
    return this.api.get<ApiResponse<unknown>>(AppConstants.API.REPORTS_KITCHEN_PERFORMANCE, this.params({
      branchId, from: from ?? range.from, to: to ?? range.to
    }));
  }

  getDeliveryPerformance(branchId?: number, from?: string, to?: string) {
    const range = defaultRange();
    return this.api.get<ApiResponse<unknown>>(AppConstants.API.REPORTS_DELIVERY_PERFORMANCE, this.params({
      branchId, from: from ?? range.from, to: to ?? range.to
    }));
  }

  getProfitMargins(branchId?: number, from?: string, to?: string) {
    const range = defaultRange();
    return this.api.get<ApiResponse<unknown>>(AppConstants.API.REPORTS_PROFIT_MARGINS, this.params({
      branchId, from: from ?? range.from, to: to ?? range.to
    }));
  }
}

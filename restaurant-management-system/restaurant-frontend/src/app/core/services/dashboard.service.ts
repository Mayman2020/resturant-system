import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AppConstants } from '../constants/app-constants';
import { ApiResponse } from '../models/api-response.model';
import { DashboardStats } from '../models/restaurant.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private readonly api: ApiService) {}

  getStats(branchId?: number) {
    const params = branchId ? { branchId } : undefined;
    return this.api.get<ApiResponse<DashboardStats>>(AppConstants.API.DASHBOARD_SUMMARY, params);
  }
}

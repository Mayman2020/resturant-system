import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AppConstants } from '../constants/app-constants';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class DeliveryService {
  constructor(private readonly api: ApiService) {}

  getAll(branchId?: number) {
    const params = branchId ? { branchId } : undefined;
    return this.api.get<ApiResponse<unknown[]>>(AppConstants.API.DELIVERY, params);
  }

  assign(id: number, driverId: number) {
    return this.api.patch<ApiResponse<unknown>>(AppConstants.API.DELIVERY_ASSIGN(id), { driverId });
  }

  updateStatus(id: number, status: string) {
    return this.api.patch<ApiResponse<unknown>>(AppConstants.API.DELIVERY_STATUS(id), { status });
  }
}

import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AppConstants } from '../constants/app-constants';
import { ApiResponse } from '../models/api-response.model';
import { InventoryItem, StockMovement } from '../models/restaurant.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  constructor(private readonly api: ApiService) {}

  getAll(params?: Record<string, string | number | boolean>) {
    return this.api.get<ApiResponse<InventoryItem[]>>(AppConstants.API.INVENTORY, params);
  }

  getLowStock(branchId: number) {
    return this.api.get<ApiResponse<InventoryItem[]>>(AppConstants.API.INVENTORY_LOW_STOCK, { branchId });
  }

  create(body: unknown) {
    return this.api.post<ApiResponse<InventoryItem>>(AppConstants.API.INVENTORY, body);
  }

  update(id: number, body: unknown) {
    return this.api.put<ApiResponse<InventoryItem>>(AppConstants.API.INVENTORY_BY_ID(id), body);
  }

  delete(id: number) {
    return this.api.delete<ApiResponse<void>>(AppConstants.API.INVENTORY_BY_ID(id));
  }

  recordMovement(body: unknown) {
    return this.api.post<ApiResponse<StockMovement>>(AppConstants.API.INVENTORY_MOVEMENTS, body);
  }

  getMovements(id: number) {
    return this.api.get<ApiResponse<StockMovement[]>>(AppConstants.API.INVENTORY_ITEM_MOVEMENTS(id));
  }
}

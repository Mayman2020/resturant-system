import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AppConstants } from '../constants/app-constants';
import { ApiResponse } from '../models/api-response.model';
import { MenuCategory, MenuItem, QrMenu } from '../models/restaurant.model';

@Injectable({ providedIn: 'root' })
export class MenuService {
  constructor(private readonly api: ApiService) {}

  getCategories(params?: Record<string, string | number | boolean>) {
    return this.api.get<ApiResponse<MenuCategory[]>>(AppConstants.API.MENU_CATEGORIES, params);
  }

  getItems(params?: Record<string, string | number | boolean>) {
    return this.api.get<ApiResponse<MenuItem[]>>(AppConstants.API.MENU_ITEMS, params);
  }

  getQrMenu(qrCode: string) {
    return this.api.get<ApiResponse<QrMenu>>(AppConstants.API.MENU_QR(qrCode));
  }

  createCategory(body: Partial<MenuCategory>) {
    return this.api.post<ApiResponse<MenuCategory>>(AppConstants.API.MENU_CATEGORIES, body);
  }

  updateCategory(id: number, body: Partial<MenuCategory>) {
    return this.api.put<ApiResponse<MenuCategory>>(AppConstants.API.MENU_CATEGORY_BY_ID(id), body);
  }

  deleteCategory(id: number) {
    return this.api.delete<ApiResponse<void>>(AppConstants.API.MENU_CATEGORY_BY_ID(id));
  }

  createItem(body: Partial<MenuItem>) {
    return this.api.post<ApiResponse<MenuItem>>(AppConstants.API.MENU_ITEMS, body);
  }

  updateItem(id: number, body: Partial<MenuItem>) {
    return this.api.put<ApiResponse<MenuItem>>(AppConstants.API.MENU_ITEM_BY_ID(id), body);
  }

  deleteItem(id: number) {
    return this.api.delete<ApiResponse<void>>(AppConstants.API.MENU_ITEM_BY_ID(id));
  }
}

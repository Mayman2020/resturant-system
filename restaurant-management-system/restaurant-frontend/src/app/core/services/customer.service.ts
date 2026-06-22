import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AppConstants } from '../constants/app-constants';
import { ApiResponse, PagedResponse } from '../models/api-response.model';
import { Customer } from '../models/restaurant.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  constructor(private readonly api: ApiService) {}

  getAll(params?: Record<string, string | number | boolean>) {
    return this.api.get<ApiResponse<PagedResponse<Customer>>>(AppConstants.API.CUSTOMERS, params);
  }

  getById(id: number) {
    return this.api.get<ApiResponse<Customer>>(AppConstants.API.CUSTOMER_BY_ID(id));
  }

  create(body: unknown) {
    return this.api.post<ApiResponse<Customer>>(AppConstants.API.CUSTOMERS, body);
  }

  update(id: number, body: unknown) {
    return this.api.put<ApiResponse<Customer>>(AppConstants.API.CUSTOMER_BY_ID(id), body);
  }

  delete(id: number) {
    return this.api.delete<ApiResponse<void>>(AppConstants.API.CUSTOMER_BY_ID(id));
  }
}

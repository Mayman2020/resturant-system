import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AppConstants } from '../constants/app-constants';
import { ApiResponse } from '../models/api-response.model';
import { TableInfo, Reservation } from '../models/restaurant.model';

@Injectable({ providedIn: 'root' })
export class TableService {
  constructor(private readonly api: ApiService) {}

  getTables(params?: Record<string, string | number | boolean>) {
    return this.api.get<ApiResponse<TableInfo[]>>(AppConstants.API.TABLES, params);
  }

  getReservations(params?: Record<string, string | number | boolean>) {
    return this.api.get<ApiResponse<Reservation[]>>(AppConstants.API.RESERVATIONS, params);
  }

  createReservation(body: unknown) {
    return this.api.post<ApiResponse<Reservation>>(AppConstants.API.RESERVATIONS, body);
  }

  updateReservation(id: number, body: unknown) {
    return this.api.put<ApiResponse<Reservation>>(`${AppConstants.API.RESERVATIONS}/${id}`, body);
  }

  cancelReservation(id: number) {
    return this.api.delete<ApiResponse<void>>(`${AppConstants.API.RESERVATIONS}/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AppConstants } from '../constants/app-constants';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  constructor(private readonly api: ApiService) {}

  get(branchId?: number) {
    return this.api.get<ApiResponse<unknown[]>>(AppConstants.API.SETTINGS, branchId ? { branchId } : undefined);
  }

  save(body: unknown) {
    return this.api.post<ApiResponse<unknown>>(AppConstants.API.SETTINGS, body);
  }

  delete(id: number) {
    return this.api.delete<ApiResponse<void>>(AppConstants.API.SETTING_BY_ID(id));
  }
}

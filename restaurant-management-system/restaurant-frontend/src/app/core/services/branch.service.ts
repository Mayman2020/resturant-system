import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AppConstants } from '../constants/app-constants';
import { ApiResponse, PagedResponse } from '../models/api-response.model';
import { Branch } from '../models/restaurant.model';

@Injectable({ providedIn: 'root' })
export class BranchService {
  constructor(private readonly api: ApiService) {}
  getAll() { return this.api.get<ApiResponse<Branch[]>>(AppConstants.API.BRANCHES); }
  getById(id: number) { return this.api.get<ApiResponse<Branch>>(AppConstants.API.BRANCH_BY_ID(id)); }
  update(id: number, payload: Partial<Branch>) {
    return this.api.put<ApiResponse<Branch>>(AppConstants.API.BRANCH_BY_ID(id), payload);
  }
}

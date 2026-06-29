import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AppConstants } from '../constants/app-constants';
import { ApiResponse, PagedResponse } from '../models/api-response.model';
import { StaffMember, UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private readonly api: ApiService) {}

  getAll(params?: { q?: string; role?: UserRole; page?: number; size?: number }) {
    const query: Record<string, string | number> = {};
    if (params?.q) query['q'] = params.q;
    if (params?.role) query['role'] = params.role;
    if (params?.page != null) query['page'] = params.page;
    if (params?.size != null) query['size'] = params.size;
    return this.api.get<ApiResponse<PagedResponse<StaffMember>>>(AppConstants.API.USERS, query);
  }

  list(page = 0, size = 20, q = ''): Observable<ApiResponse<PagedResponse<StaffMember>>> {
    return this.getAll({ page, size, q: q || undefined });
  }

  getById(id: number): Observable<ApiResponse<StaffMember>> {
    return this.api.get<ApiResponse<StaffMember>>(AppConstants.API.USER_BY_ID(id));
  }

  create(payload: Partial<StaffMember> & { password?: string }): Observable<ApiResponse<StaffMember>> {
    return this.api.post<ApiResponse<StaffMember>>(AppConstants.API.USERS, payload);
  }

  update(id: number, payload: Partial<StaffMember> & { password?: string }): Observable<ApiResponse<StaffMember>> {
    return this.api.put<ApiResponse<StaffMember>>(AppConstants.API.USER_BY_ID(id), payload);
  }

  toggleActive(id: number): Observable<ApiResponse<StaffMember>> {
    return this.api.patch<ApiResponse<StaffMember>>(AppConstants.API.USERS_TOGGLE_ACTIVE(id));
  }
}

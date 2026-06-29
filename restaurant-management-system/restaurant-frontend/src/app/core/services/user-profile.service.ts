import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AppConstants } from '../constants/app-constants';
import { ApiResponse } from '../models/api-response.model';
import { StaffMember } from '../models/user.model';

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  constructor(private readonly api: ApiService) {}

  getMyProfile(): Observable<ApiResponse<StaffMember>> {
    return this.api.get<ApiResponse<StaffMember>>(AppConstants.API.USERS_ME);
  }

  changeMyPassword(payload: ChangePasswordRequest): Observable<ApiResponse<string>> {
    return this.api.post<ApiResponse<string>>(AppConstants.API.USERS_ME_CHANGE_PASSWORD, payload);
  }
}

import { Injectable } from '@angular/core';
import { Observable, of, tap, catchError } from 'rxjs';
import { ApiService } from './api.service';
import { AppConstants } from '../constants/app-constants';
import { AuthService } from './auth.service';
import { PermissionAction, PermissionMap, UserRole } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';
import { RolePermissionDto } from './role-permission.service';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private permissions: PermissionMap = {};

  constructor(
    private readonly api: ApiService,
    private readonly auth: AuthService
  ) {
    this.permissions = this.auth.getPermissions();
  }

  loadMine(): Observable<ApiResponse<RolePermissionDto> | null> {
    if (!this.auth.isAuthenticated()) return of(null);
    const role = this.auth.getRole();
    if (!role || role === 'ADMIN') {
      this.permissions = this.auth.getPermissions();
      return of(null);
    }
    return this.api.get<ApiResponse<RolePermissionDto>>(AppConstants.API.PERMISSIONS_BY_ROLE(role)).pipe(
      tap((res) => {
        const permissions = res.data?.permissions ?? {};
        this.permissions = permissions;
        this.auth.updateStoredPermissions(permissions);
      }),
      catchError(() => {
        this.permissions = this.auth.getPermissions();
        return of(null);
      })
    );
  }

  can(moduleKey: string, action: PermissionAction = 'view'): boolean {
    if (this.auth.getRole() === 'ADMIN') return true;
    const module = this.permissions[moduleKey];
    if (!module) return false;
    if (module.enabled === false) return false;
    return module[action] === true;
  }

  getPermissions(): PermissionMap {
    return this.permissions;
  }
}

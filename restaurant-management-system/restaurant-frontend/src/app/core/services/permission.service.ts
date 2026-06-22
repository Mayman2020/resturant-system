import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiResponse } from '../models/api-response.model';
import { PermissionAction, PermissionMap, UserRole } from '../models/user.model';

interface RolePermissionDto { role: UserRole; permissions: PermissionMap; }

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private permissions: PermissionMap = {};

  constructor(private readonly auth: AuthService) {
    this.permissions = this.auth.getPermissions();
  }

  loadMine(): Observable<ApiResponse<RolePermissionDto> | null> {
    if (!this.auth.isAuthenticated()) return of(null);
    this.permissions = this.auth.getPermissions();
    const role = this.auth.getRole();
    return of({
      success: true,
      message: 'Success',
      data: { role: role ?? 'ADMIN', permissions: this.permissions },
      timestamp: new Date().toISOString()
    }).pipe(
      tap((res) => {
        this.permissions = res.data?.permissions ?? {};
        this.auth.updateStoredPermissions(this.permissions);
      })
    );
  }

  can(moduleKey: string, action: PermissionAction = 'view'): boolean {
    if (this.auth.getRole() === 'ADMIN') return true;
    const m = this.permissions[moduleKey];
    if (!m || m.enabled === false) return false;
    return m[action] === true;
  }
}

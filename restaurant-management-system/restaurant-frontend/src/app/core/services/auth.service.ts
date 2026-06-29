import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AppConstants } from '../constants/app-constants';
import { TokenStorageService } from '../auth/token-storage.service';
import { JwtUtils } from '../utils/jwt-utils';
import { ApiResponse } from '../models/api-response.model';
import { CurrentUser, LoginRequest, LoginResponse, PermissionMap, UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private readonly api: ApiService,
    private readonly tokenStorage: TokenStorageService,
    private readonly router: Router
  ) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.api.post<ApiResponse<LoginResponse>>(AppConstants.API.AUTH_LOGIN, request).pipe(
      tap((res) => {
        if (res.data?.accessToken) {
          this.tokenStorage.setToken(res.data.accessToken);
          if (res.data.refreshToken) this.tokenStorage.setRefreshToken(res.data.refreshToken);
          const u = res.data.user;
          if (u) {
            const user: CurrentUser = {
              ...u,
              initials: (u.fullName || u.username || 'U').slice(0, 2).toUpperCase()
            };
            this.tokenStorage.setUser(user);
          }
        }
      }),
      map((res) => {
        if (!res.success || !res.data) throw new Error(res.message || 'AUTH.LOGIN_FAILED');
        return res.data;
      })
    );
  }

  logout(): void {
    this.api.post<ApiResponse<void>>(AppConstants.API.AUTH_LOGOUT, {}).subscribe({ error: () => {} });
    this.tokenStorage.clearAll();
    void this.router.navigateByUrl('/auth/login');
  }

  isAuthenticated(): boolean {
    const token = this.tokenStorage.getToken();
    return !!token && !JwtUtils.isExpired(token);
  }

  getCurrentUser(): CurrentUser | null { return this.tokenStorage.getUser<CurrentUser>(); }
  getRole(): UserRole | null { return this.getCurrentUser()?.role ?? null; }
  getPermissions(): PermissionMap { return this.getCurrentUser()?.permissions ?? {}; }
  updateStoredPermissions(p: PermissionMap): void {
    const u = this.getCurrentUser();
    if (u) this.tokenStorage.setUser({ ...u, permissions: p });
  }
  isAdmin(): boolean { return this.getRole() === 'ADMIN' || this.getRole() === 'MANAGER'; }
  getDashboardRoute(): string { return '/admin/dashboard'; }
  mustChangePassword(): boolean { return this.getCurrentUser()?.mustChangePassword === true; }
  clearMustChangePassword(): void {
    const u = this.getCurrentUser();
    if (u) this.tokenStorage.setUser({ ...u, mustChangePassword: false });
  }
  hasRole(role: UserRole): boolean { return this.getRole() === role; }
  clearExpiredTokens(): void {
    const t = this.tokenStorage.getToken();
    if (t && JwtUtils.isExpired(t)) this.tokenStorage.clearAll();
  }
}

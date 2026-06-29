import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { RmsIconBtnComponent } from '../../../shared/components/rms-icon-btn/rms-icon-btn.component';
import { EnumTranslatePipe } from '../../../shared/pipes/enum-translate.pipe';
import { UserService } from '../../../core/services/user.service';
import { StaffMember, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-staff-page',
  standalone: true,
  imports: [
    NgFor, NgIf, FormsModule, RouterLink, MatButtonModule, MatProgressSpinnerModule,
    TranslateModule, PageHeaderComponent, RmsIconBtnComponent, EnumTranslatePipe
  ],
  templateUrl: './staff-page.component.html',
  styleUrl: './staff-page.component.scss'
})
export class StaffPageComponent implements OnInit {
  loading = true;
  staff: StaffMember[] = [];
  filtered: StaffMember[] = [];
  search = '';
  roleFilter = '';
  readonly roleFilters: UserRole[] = ['ADMIN', 'MANAGER', 'KITCHEN_STAFF', 'WAITER', 'CASHIER', 'DELIVERY_DRIVER'];

  constructor(private readonly users: UserService) {}

  ngOnInit(): void {
    this.load();
  }

  get managersCount(): number {
    return this.staff.filter((u) => u.role === 'ADMIN' || u.role === 'MANAGER').length;
  }

  get kitchenCount(): number {
    return this.staff.filter((u) => u.role === 'KITCHEN_STAFF').length;
  }

  get serviceCount(): number {
    return this.staff.filter((u) => ['WAITER', 'CASHIER', 'DELIVERY_DRIVER'].includes(u.role)).length;
  }

  load(): void {
    this.loading = true;
    this.users.getAll({ size: 100 }).subscribe({
      next: (r) => {
        this.staff = r.data?.content ?? [];
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.staff = [];
        this.applyFilter();
        this.loading = false;
      }
    });
  }

  setRole(role: string): void {
    this.roleFilter = role;
    this.applyFilter();
  }

  applyFilter(): void {
    const q = this.search.trim().toLowerCase();
    this.filtered = this.staff.filter((u) => {
      const roleOk = !this.roleFilter || u.role === this.roleFilter;
      const textOk = !q || [u.fullName, u.username, u.email, u.phone].some((v) => (v ?? '').toLowerCase().includes(q));
      return roleOk && textOk;
    });
  }

  displayName(u: StaffMember): string {
    return u.fullName?.trim() || u.username;
  }

  initials(u: StaffMember): string {
    const name = this.displayName(u);
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
}


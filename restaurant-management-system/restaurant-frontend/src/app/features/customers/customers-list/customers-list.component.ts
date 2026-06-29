import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { RmsIconBtnComponent } from '../../../shared/components/rms-icon-btn/rms-icon-btn.component';
import { TablePagerComponent } from '../../../shared/components/table-pager/table-pager.component';
import { CustomerService } from '../../../core/services/customer.service';
import { RmsDialogService } from '../../../shared/services/rms-dialog.service';
import { CustomerFormDialogComponent } from '../../../shared/dialogs/customer-form-dialog.component';
import { Customer } from '../../../core/models/restaurant.model';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [
    NgFor, NgIf, FormsModule, TranslateModule, MatProgressSpinnerModule,
    PageHeaderComponent, RmsIconBtnComponent, TablePagerComponent
  ],
  templateUrl: './customers-list.component.html',
  styleUrl: './customers-list.component.scss'
})
export class CustomersListComponent implements OnInit {
  customers: Customer[] = [];
  filtered: Customer[] = [];
  loading = true;
  search = '';
  page = 0;
  size = 10;

  constructor(
    private readonly customersSvc: CustomerService,
    private readonly dialogs: RmsDialogService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.customersSvc.getAll().subscribe({
      next: (r) => {
        this.customers = r.data?.content ?? [];
        this.applyFilter(false);
        this.loading = false;
      },
      error: () => {
        this.customers = [];
        this.filtered = [];
        this.loading = false;
      }
    });
  }

  get pagedCustomers(): Customer[] {
    const start = this.page * this.size;
    return this.filtered.slice(start, start + this.size);
  }

  get totalLoyalty(): number {
    return this.customers.reduce((sum, c) => sum + (c.loyaltyPoints ?? 0), 0);
  }

  get totalVisits(): number {
    return this.customers.reduce((sum, c) => sum + (c.visits ?? 0), 0);
  }

  applyFilter(resetPage = true): void {
    const q = this.search.trim().toLowerCase();
    this.filtered = q
      ? this.customers.filter((c) => this.customerName(c).toLowerCase().includes(q) || (c.phone ?? '').includes(q))
      : [...this.customers];
    if (resetPage) this.page = 0;
  }

  onPageChange(index: number): void {
    this.page = index;
  }

  openAddDialog(): void {
    this.dialogs.open(CustomerFormDialogComponent, { width: '520px' }).afterClosed().subscribe((ok) => {
      if (ok) this.load();
    });
  }

  customerName(c: Customer): string {
    return c.fullName ?? c.name;
  }
}

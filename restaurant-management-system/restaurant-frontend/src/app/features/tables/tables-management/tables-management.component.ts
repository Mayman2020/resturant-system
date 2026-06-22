import { Component, OnInit } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EnumTranslatePipe } from '../../../shared/pipes/enum-translate.pipe';
import { TableService } from '../../../core/services/table.service';
import { BranchContextService } from '../../../core/services/branch-context.service';
import { SnackService } from '../../../core/services/snack.service';
import { Reservation, TableInfo } from '../../../core/models/restaurant.model';

@Component({
  selector: 'app-tables-management',
  standalone: true,
  imports: [
    NgFor, NgIf, DatePipe, ReactiveFormsModule, TranslateModule, MatTabsModule,
    MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    PageHeaderComponent, EnumTranslatePipe
  ],
  templateUrl: './tables-management.component.html',
  styleUrl: './tables-management.component.scss'
})
export class TablesManagementComponent implements OnInit {
  tables: TableInfo[] = [];
  reservations: Reservation[] = [];
  showReservationForm = false;
  reservationForm!: FormGroup;
  saving = false;

  constructor(
    private readonly tablesSvc: TableService,
    private readonly branchCtx: BranchContextService,
    private readonly snack: SnackService,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.reservationForm = this.fb.group({
      tableId: [null, Validators.required],
      customerName: ['', Validators.required],
      customerPhone: [''],
      partySize: [2, [Validators.required, Validators.min(1)]],
      reservedAt: ['', Validators.required],
      notes: ['']
    });
    this.load();
  }

  load(): void {
    const branchId = this.branchCtx.activeBranchId;
    this.tablesSvc.getTables({ branchId }).subscribe({
      next: (r) => { this.tables = r.data ?? []; },
      error: () => { this.tables = []; }
    });
    this.tablesSvc.getReservations({ branchId }).subscribe({
      next: (r) => { this.reservations = r.data ?? []; },
      error: () => { this.reservations = []; }
    });
  }

  toggleReservationForm(): void {
    this.showReservationForm = !this.showReservationForm;
  }

  saveReservation(): void {
    if (this.reservationForm.invalid || this.saving) return;
    this.saving = true;
    const raw = this.reservationForm.getRawValue();
    const body = {
      ...raw,
      reservedAt: raw.reservedAt ? new Date(raw.reservedAt).toISOString().slice(0, 19) : raw.reservedAt
    };
    this.tablesSvc.createReservation(body).subscribe({
      next: () => {
        this.saving = false;
        this.showReservationForm = false;
        this.reservationForm.reset({ partySize: 2 });
        this.snack.successKey('MESSAGES.RESERVATION_CREATED');
        this.load();
      },
      error: (err: Error) => {
        this.saving = false;
        this.snack.error(err.message);
      }
    });
  }

  cancelReservation(id: number): void {
    this.tablesSvc.cancelReservation(id).subscribe({
      next: () => {
        this.snack.successKey('MESSAGES.RESERVATION_CANCELLED');
        this.load();
      },
      error: (err: Error) => this.snack.error(err.message)
    });
  }

  tableLabel(tableId?: number): string {
    const t = this.tables.find((x) => x.id === tableId);
    return t?.tableNumber ?? String(tableId ?? '');
  }
}

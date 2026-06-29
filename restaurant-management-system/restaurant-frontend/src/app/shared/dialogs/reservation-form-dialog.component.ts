import { NgFor, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { DialogTitleCloseDirective } from '../directives/dialog-title-close.directive';
import { TableService } from '../../core/services/table.service';
import { SnackService } from '../../core/services/snack.service';
import { TableInfo } from '../../core/models/restaurant.model';
import { combineDateAndTime, defaultReservationDate, defaultTimeSlot, toApiLocalDateTime } from '../utils/date-utils';

export interface ReservationFormDialogData {
  tables: TableInfo[];
}

@Component({
  standalone: true,
  imports: [
    NgFor, NgIf, ReactiveFormsModule, TranslateModule, MatDialogModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatProgressSpinnerModule,
    MatDatepickerModule, MatNativeDateModule, DialogTitleCloseDirective
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon class="dialog-title-icon">event</mat-icon>
      {{ 'TABLES.ADD_RESERVATION' | translate }}
    </h2>
    <mat-dialog-content class="dialog-body">
      <form [formGroup]="form" class="rms-dialog-form">
        <mat-form-field appearance="outline" subscriptSizing="dynamic">
          <mat-label>{{ 'TABLES.TABLE_NUMBER' | translate }}</mat-label>
          <mat-select formControlName="tableId">
            <mat-option *ngFor="let t of data.tables" [value]="t.id">{{ t.tableNumber }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" subscriptSizing="dynamic">
          <mat-label>{{ 'TABLES.GUEST_NAME' | translate }}</mat-label>
          <input matInput formControlName="customerName">
        </mat-form-field>
        <mat-form-field appearance="outline" subscriptSizing="dynamic">
          <mat-label>{{ 'COMMON.PHONE' | translate }}</mat-label>
          <input matInput formControlName="customerPhone">
        </mat-form-field>
        <mat-form-field appearance="outline" subscriptSizing="dynamic">
          <mat-label>{{ 'TABLES.PARTY_SIZE' | translate }}</mat-label>
          <input matInput type="number" formControlName="partySize">
        </mat-form-field>
        <mat-form-field appearance="outline" subscriptSizing="dynamic">
          <mat-label>{{ 'COMMON.DATE' | translate }}</mat-label>
          <input matInput [matDatepicker]="reservedDatePicker" formControlName="reservedDate">
          <mat-datepicker-toggle matSuffix [for]="reservedDatePicker"></mat-datepicker-toggle>
          <mat-datepicker #reservedDatePicker></mat-datepicker>
        </mat-form-field>
        <mat-form-field appearance="outline" subscriptSizing="dynamic">
          <mat-label>{{ 'TABLES.RESERVATION_TIME' | translate }}</mat-label>
          <input matInput type="time" formControlName="reservedTime">
        </mat-form-field>
        <mat-form-field appearance="outline" class="full" subscriptSizing="dynamic">
          <mat-label>{{ 'COMMON.NOTES' | translate }}</mat-label>
          <input matInput formControlName="notes">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="app-dialog-actions">
      <button mat-stroked-button type="button" class="btn-dialog-cancel" (click)="ref.close(false)">{{ 'COMMON.CANCEL' | translate }}</button>
      <button mat-flat-button type="button" class="btn-dialog-confirm" (click)="save()" [disabled]="saving || form.invalid">
        <mat-spinner *ngIf="saving" diameter="18"></mat-spinner>
        <span *ngIf="!saving">{{ 'COMMON.SAVE' | translate }}</span>
      </button>
    </mat-dialog-actions>
  `
})
export class ReservationFormDialogComponent {
  saving = false;
  readonly form = this.fb.group({
    tableId: [null as number | null, Validators.required],
    customerName: ['', Validators.required],
    customerPhone: [''],
    partySize: [2, [Validators.required, Validators.min(1)]],
    reservedDate: [defaultReservationDate(), Validators.required],
    reservedTime: [defaultTimeSlot(), Validators.required],
    notes: ['']
  });

  constructor(
    readonly ref: MatDialogRef<ReservationFormDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) readonly data: ReservationFormDialogData,
    private readonly fb: FormBuilder,
    private readonly tablesSvc: TableService,
    private readonly snack: SnackService
  ) {}

  save(): void {
    if (this.form.invalid || this.saving) return;
    const raw = this.form.getRawValue();
    const reservedAtDate = combineDateAndTime(raw.reservedDate, raw.reservedTime ?? '');
    if (!reservedAtDate) {
      this.snack.errorKey('COMMON.INVALID_DATE');
      return;
    }
    this.saving = true;
    const body = {
      tableId: raw.tableId,
      customerName: raw.customerName,
      customerPhone: raw.customerPhone,
      partySize: raw.partySize,
      reservedAt: toApiLocalDateTime(reservedAtDate),
      notes: raw.notes
    };
    this.tablesSvc.createReservation(body).subscribe({
      next: () => {
        this.saving = false;
        this.snack.successKey('MESSAGES.RESERVATION_CREATED');
        this.ref.close(true);
      },
      error: (err: Error) => {
        this.saving = false;
        this.snack.error(err.message);
      }
    });
  }
}

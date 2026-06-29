import { NgFor, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { DialogTitleCloseDirective } from '../directives/dialog-title-close.directive';
import { LocalizedNamePipe } from '../pipes/localized-name.pipe';
import { MenuService } from '../../core/services/menu.service';
import { SnackService } from '../../core/services/snack.service';
import { MenuCategory } from '../../core/models/restaurant.model';

export interface MenuItemDialogData {
  categories: MenuCategory[];
}

@Component({
  standalone: true,
  imports: [
    NgFor, NgIf, ReactiveFormsModule, TranslateModule, MatDialogModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatProgressSpinnerModule,
    DialogTitleCloseDirective, LocalizedNamePipe
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon class="dialog-title-icon">restaurant</mat-icon>
      {{ 'MENU.ADD_ITEM' | translate }}
    </h2>
    <mat-dialog-content class="dialog-body">
      <form [formGroup]="form" class="rms-dialog-form">
        <mat-form-field appearance="outline" subscriptSizing="dynamic">
          <mat-label>{{ 'COMMON.NAME' | translate }}</mat-label>
          <input matInput formControlName="name">
        </mat-form-field>
        <mat-form-field appearance="outline" subscriptSizing="dynamic">
          <mat-label>{{ 'COMMON.NAME' | translate }} (AR)</mat-label>
          <input matInput formControlName="nameAr" dir="rtl">
        </mat-form-field>
        <mat-form-field appearance="outline" class="full" subscriptSizing="dynamic">
          <mat-label>{{ 'MENU.CATEGORY' | translate }}</mat-label>
          <mat-select formControlName="categoryId">
            <mat-option *ngFor="let c of data.categories" [value]="c.id">{{ c | localizedName }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" subscriptSizing="dynamic">
          <mat-label>{{ 'MENU.PRICE' | translate }}</mat-label>
          <input matInput type="number" formControlName="price">
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
export class MenuItemDialogComponent {
  saving = false;
  readonly form = this.fb.group({
    name: ['', Validators.required],
    nameAr: [''],
    categoryId: [null as number | null, Validators.required],
    price: [0, Validators.required]
  });

  constructor(
    readonly ref: MatDialogRef<MenuItemDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) readonly data: MenuItemDialogData,
    private readonly fb: FormBuilder,
    private readonly menu: MenuService,
    private readonly snack: SnackService
  ) {}

  save(): void {
    if (this.form.invalid || this.saving) return;
    this.saving = true;
    this.menu.createItem(this.form.getRawValue() as Partial<import('../../core/models/restaurant.model').MenuItem>).subscribe({
      next: () => {
        this.saving = false;
        this.snack.successKey('MESSAGES.SAVED');
        this.ref.close(true);
      },
      error: (err: Error) => {
        this.saving = false;
        this.snack.error(err.message);
      }
    });
  }
}

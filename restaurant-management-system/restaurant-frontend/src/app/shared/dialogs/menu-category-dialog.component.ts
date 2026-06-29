import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { DialogTitleCloseDirective } from '../directives/dialog-title-close.directive';
import { BranchContextService } from '../../core/services/branch-context.service';
import { MenuService } from '../../core/services/menu.service';
import { SnackService } from '../../core/services/snack.service';

@Component({
  standalone: true,
  imports: [
    NgIf, ReactiveFormsModule, TranslateModule, MatDialogModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatIconModule, MatProgressSpinnerModule, DialogTitleCloseDirective
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon class="dialog-title-icon">category</mat-icon>
      {{ 'MENU.ADD_CATEGORY' | translate }}
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
export class MenuCategoryDialogComponent {
  saving = false;
  readonly form = this.fb.group({
    name: ['', Validators.required],
    nameAr: [''],
    sortOrder: [0]
  });

  constructor(
    readonly ref: MatDialogRef<MenuCategoryDialogComponent, boolean>,
    private readonly fb: FormBuilder,
    private readonly menu: MenuService,
    private readonly branchCtx: BranchContextService,
    private readonly snack: SnackService
  ) {}

  save(): void {
    if (this.form.invalid || this.saving) return;
    this.saving = true;
    const body = { ...this.form.getRawValue(), branchId: this.branchCtx.activeBranchId, categoryType: 'MEALS' } as Partial<import('../../core/models/restaurant.model').MenuCategory>;
    this.menu.createCategory(body).subscribe({
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

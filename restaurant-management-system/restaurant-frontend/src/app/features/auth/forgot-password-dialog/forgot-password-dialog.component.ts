import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { SnackService } from '../../../core/services/snack.service';

@Component({
  selector: 'app-forgot-password-dialog',
  standalone: true,
  imports: [
    NgIf, ReactiveFormsModule, TranslateModule, MatDialogModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>{{ 'LOGIN.FORGOT_PASSWORD' | translate }}</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-dialog-content>
        <p>{{ 'AUTH.FORGOT_PASSWORD_HINT' | translate }}</p>
        <mat-form-field appearance="outline" class="full">
          <mat-label>{{ 'AUTH.USERNAME' | translate }}</mat-label>
          <input matInput formControlName="username" autocomplete="username">
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close>{{ 'COMMON.CANCEL' | translate }}</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || loading">
          <mat-spinner *ngIf="loading" diameter="18"></mat-spinner>
          <span *ngIf="!loading">{{ 'AUTH.SEND_RESET' | translate }}</span>
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`:host .full { width: 100%; } p { margin: 0 0 12px; color: var(--text-muted); }`]
})
export class ForgotPasswordDialogComponent {
  loading = false;
  readonly form = this.fb.group({
    username: ['', Validators.required]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly snack: SnackService,
    private readonly ref: MatDialogRef<ForgotPasswordDialogComponent>
  ) {}

  submit(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    this.auth.forgotPassword(this.form.value.username!.trim()).subscribe({
      next: () => {
        this.loading = false;
        this.snack.successKey('AUTH.RESET_SENT');
        this.ref.close(true);
      },
      error: (err: Error) => {
        this.loading = false;
        this.snack.error(err.message);
      }
    });
  }
}

import { NgClass, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { DialogTitleCloseDirective } from '../../directives/dialog-title-close.directive';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  alertOnly?: boolean;
  icon?: 'help' | 'warning' | 'error' | 'info';
}

@Component({
  selector: 'rms-confirm-dialog',
  standalone: true,
  imports: [NgIf, NgClass, MatDialogModule, MatButtonModule, TranslateModule, DialogTitleCloseDirective],
  template: `
    <h2 mat-dialog-title>{{ data.title | translate }}</h2>
    <mat-dialog-content class="dialog-body confirm-body">
      <div class="dialog-intro">
        <span class="material-icons dialog-type-icon" [ngClass]="introIconClass">{{ introIconName }}</span>
        <p class="dialog-msg">{{ data.message | translate }}</p>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="app-dialog-actions">
      <button *ngIf="!data.alertOnly" mat-stroked-button type="button" class="btn-dialog-cancel" (click)="ref.close(false)">
        {{ (data.cancelLabel || 'COMMON.CANCEL') | translate }}
      </button>
      <button mat-flat-button type="button" class="btn-dialog-confirm" [class.btn-dialog-danger]="data.danger && !data.alertOnly" (click)="ref.close(true)">
        {{ (data.confirmLabel || 'COMMON.CONFIRM') | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .confirm-body { min-width: min(420px, 92vw); }
    .confirm-body .dialog-intro { margin-bottom: 0; }
    .dialog-msg { margin: 0; flex: 1; min-width: 0; line-height: 1.45; white-space: pre-wrap; word-break: break-word; color: var(--ink-700); }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    readonly ref: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) readonly data: ConfirmDialogData
  ) {}

  get introIconName(): string {
    const i = this.data.icon;
    if (i === 'error') return 'error';
    if (i === 'info') return 'info';
    if (this.data.danger) return 'warning';
    return 'help_outline';
  }

  get introIconClass(): string {
    const i = this.data.icon;
    if (i === 'error') return 'is-error';
    if (i === 'info') return 'is-info';
    if (this.data.danger) return 'is-warn';
    return 'is-help';
  }
}

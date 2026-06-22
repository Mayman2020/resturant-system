import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class SnackService {
  constructor(
    private readonly snack: MatSnackBar,
    private readonly translate: TranslateService
  ) {}

  success(msg: string): void {
    this.snack.open(msg, undefined, { duration: 3000, panelClass: ['snack-ok'] });
  }

  error(msg: string): void {
    this.snack.open(msg, undefined, { duration: 5000, panelClass: ['snack-bad'] });
  }

  successKey(key: string, params?: Record<string, unknown>): void {
    this.success(this.translate.instant(key, params));
  }

  errorKey(key: string, params?: Record<string, unknown>): void {
    this.error(this.translate.instant(key, params));
  }
}

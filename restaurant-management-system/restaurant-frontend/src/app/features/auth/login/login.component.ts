import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { PermissionService } from '../../../core/services/permission.service';
import { SnackService } from '../../../core/services/snack.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, TranslateModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loading = false;
  showPassword = false;
  form!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly perms: PermissionService,
    private readonly router: Router,
    private readonly snack: SnackService,
    readonly i18n: I18nService
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    if (this.auth.isAuthenticated()) void this.router.navigateByUrl(this.auth.getDashboardRoute());
  }

  submit(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    this.auth.login(this.form.getRawValue() as { username: string; password: string }).pipe(
      switchMap(() => this.perms.loadMine())
    ).subscribe({
      next: () => {
        this.loading = false;
        void this.router.navigateByUrl(this.auth.getDashboardRoute());
      },
      error: (err: Error & { status?: number }) => {
        this.loading = false;
        const msg = err.status === 401
          ? this.i18n.instant('AUTH.INVALID_CREDENTIALS')
          : this.i18n.instant(err.message) !== err.message
            ? this.i18n.instant(err.message)
            : err.message;
        this.snack.error(msg);
      }
    });
  }
}

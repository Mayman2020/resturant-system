import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { PermissionService } from '../../../core/services/permission.service';
import { SnackService } from '../../../core/services/snack.service';
import { I18nService, LangCode } from '../../../core/i18n/i18n.service';
import { ThemeService } from '../../../core/services/theme.service';
import { switchMap } from 'rxjs';
import { ForgotPasswordDialogComponent } from '../forgot-password-dialog/forgot-password-dialog.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, ReactiveFormsModule, TranslateModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loading = false;
  showPassword = false;
  rememberMe = false;
  form!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly perms: PermissionService,
    private readonly router: Router,
    private readonly snack: SnackService,
    private readonly dialog: MatDialog,
    readonly i18n: I18nService,
    readonly theme: ThemeService
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    if (this.auth.isAuthenticated()) void this.router.navigateByUrl(this.auth.getDashboardRoute());
  }

  get languages() {
    return this.i18n.languages;
  }

  get activeLanguage() {
    return this.languages.find((l) => l.code === this.i18n.currentLang) ?? this.languages[0];
  }

  get themeTooltipKey(): string {
    return this.theme.isDark ? 'TOPBAR.LIGHT_MODE' : 'TOPBAR.DARK_MODE';
  }

  setLang(code: LangCode): void {
    this.i18n.setLang(code).subscribe();
  }

  openForgotPassword(): void {
    this.dialog.open(ForgotPasswordDialogComponent, { width: '420px' });
  }

  submit(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    this.auth.login(this.form.getRawValue() as { username: string; password: string }).pipe(
      switchMap(() => this.perms.loadMine())
    ).subscribe({
      next: () => {
        this.loading = false;
        const target = this.auth.mustChangePassword()
          ? '/admin/profile?changePassword=1'
          : this.auth.getDashboardRoute();
        void this.router.navigateByUrl(target);
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

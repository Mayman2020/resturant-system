import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { UserProfileService } from '../../../core/services/user-profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { SnackService } from '../../../core/services/snack.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    NgIf, ReactiveFormsModule, RouterLink, TranslateModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatProgressSpinnerModule, PageHeaderComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  loading = true;
  changingPassword = false;
  highlightPassword = false;
  username = '';
  fullName = '';
  email = '';
  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly profile: UserProfileService,
    private readonly auth: AuthService,
    private readonly snack: SnackService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('changePassword') === '1') {
      this.highlightPassword = true;
    }
    this.profile.getMyProfile().subscribe({
      next: (r) => {
        const u = r.data;
        this.username = u?.username ?? '';
        this.fullName = u?.fullName ?? '';
        this.email = u?.email ?? '';
        this.loading = false;
      },
      error: (e) => { this.snack.error(e.message); this.loading = false; }
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;
    const v = this.passwordForm.getRawValue();
    if (v.newPassword !== v.confirmPassword) {
      this.snack.errorKey('PROFILE.PASSWORD_MISMATCH');
      return;
    }
    this.changingPassword = true;
    this.profile.changeMyPassword({
      currentPassword: v.currentPassword!,
      newPassword: v.newPassword!
    }).subscribe({
      next: () => {
        this.auth.clearMustChangePassword();
        this.highlightPassword = false;
        this.snack.successKey('PROFILE.PASSWORD_CHANGED');
        this.passwordForm.reset();
        this.changingPassword = false;
      },
      error: (e) => { this.snack.error(e.message); this.changingPassword = false; }
    });
  }
}

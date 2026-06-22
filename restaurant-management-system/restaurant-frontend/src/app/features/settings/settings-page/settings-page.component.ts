import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SettingsService } from '../../../core/services/settings.service';
import { BranchContextService } from '../../../core/services/branch-context.service';
import { SnackService } from '../../../core/services/snack.service';
import { BranchSetting } from '../../../core/models/restaurant.model';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [TranslateModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, PageHeaderComponent],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent implements OnInit {
  form!: FormGroup;
  saving = false;

  private readonly settingKeys = ['restaurantName', 'taxRate', 'serviceCharge', 'currency'] as const;

  constructor(
    private readonly fb: FormBuilder,
    private readonly settings: SettingsService,
    private readonly branchCtx: BranchContextService,
    private readonly snack: SnackService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      restaurantName: [''],
      taxRate: [0],
      serviceCharge: [0],
      currency: ['SAR']
    });
    this.load();
  }

  load(): void {
    this.settings.get(this.branchCtx.activeBranchId).subscribe({
      next: (r) => {
        const list = (r.data ?? []) as BranchSetting[];
        const patch: Record<string, string | number> = {};
        list.forEach((s) => {
          if (this.settingKeys.includes(s.settingKey as typeof this.settingKeys[number])) {
            const val = s.settingKey === 'taxRate' || s.settingKey === 'serviceCharge'
              ? Number(s.settingValue) : s.settingValue;
            patch[s.settingKey] = val;
          }
        });
        this.form.patchValue(patch);
      },
      error: () => {}
    });
  }

  save(): void {
    if (this.saving) return;
    this.saving = true;
    const raw = this.form.getRawValue() as Record<string, string | number>;
    const branchId = this.branchCtx.activeBranchId;
    let pending = this.settingKeys.length;
    let hadError = false;

    this.settingKeys.forEach((key) => {
      this.settings.save({ branchId, settingKey: key, settingValue: String(raw[key] ?? '') }).subscribe({
        next: () => {
          pending -= 1;
          if (pending === 0 && !hadError) {
            this.saving = false;
            this.snack.successKey('MESSAGES.SETTINGS_SAVED');
          }
        },
        error: (err: Error) => {
          hadError = true;
          this.saving = false;
          this.snack.error(err.message);
        }
      });
    });
  }
}

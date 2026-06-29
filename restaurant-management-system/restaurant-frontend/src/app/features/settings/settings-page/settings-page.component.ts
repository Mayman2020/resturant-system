import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import { MatButtonModule } from '@angular/material/button';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

import { SettingsService } from '../../../core/services/settings.service';

import { BranchService } from '../../../core/services/branch.service';

import { BranchContextService } from '../../../core/services/branch-context.service';

import { SnackService } from '../../../core/services/snack.service';

import { BranchSetting } from '../../../core/models/restaurant.model';

import { forkJoin } from 'rxjs';



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

  private branchCode = 'MAIN';



  private readonly settingKeys = ['currency'] as const;



  constructor(

    private readonly fb: FormBuilder,

    private readonly settings: SettingsService,

    private readonly branches: BranchService,

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

    const branchId = this.branchCtx.activeBranchId;

    forkJoin({

      branch: this.branches.getById(branchId),

      settings: this.settings.get(branchId)

    }).subscribe({

      next: ({ branch, settings }) => {

        const b = branch.data;

        if (b) {

          this.branchCode = b.code;

          this.form.patchValue({

            restaurantName: b.name ?? '',

            taxRate: b.taxRate ?? 0,

            serviceCharge: b.serviceCharge ?? 0

          });

        }

        const list = (settings.data ?? []) as BranchSetting[];

        list.forEach((s) => {

          if (s.settingKey === 'currency') {

            this.form.patchValue({ currency: s.settingValue });

          }

        });

      },

      error: () => {}

    });

  }



  save(): void {

    if (this.saving) return;

    this.saving = true;

    const raw = this.form.getRawValue() as Record<string, string | number>;

    const branchId = this.branchCtx.activeBranchId;



    this.branches.update(branchId, {

      name: String(raw['restaurantName'] ?? ''),

      code: this.branchCode,

      taxRate: Number(raw['taxRate'] ?? 0),

      serviceCharge: Number(raw['serviceCharge'] ?? 0)

    }).subscribe({

      next: () => {

        this.settings.save({ branchId, settingKey: 'currency', settingValue: String(raw['currency'] ?? 'SAR') }).subscribe({

          next: () => {

            this.saving = false;

            this.snack.successKey('MESSAGES.SETTINGS_SAVED');

          },

          error: (err: Error) => {

            this.saving = false;

            this.snack.error(err.message);

          }

        });

      },

      error: (err: Error) => {

        this.saving = false;

        this.snack.error(err.message);

      }

    });

  }

}



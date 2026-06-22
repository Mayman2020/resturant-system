import { Component, OnInit } from '@angular/core';

import { DecimalPipe, NgFor, NgIf } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import { MatSelectModule } from '@angular/material/select';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

import { InventoryService } from '../../../core/services/inventory.service';

import { BranchContextService } from '../../../core/services/branch-context.service';

import { SnackService } from '../../../core/services/snack.service';

import { InventoryItem } from '../../../core/models/restaurant.model';



@Component({

  selector: 'app-inventory-management',

  standalone: true,

  imports: [

    NgFor, NgIf, DecimalPipe, ReactiveFormsModule, TranslateModule, MatButtonModule,

    MatFormFieldModule, MatInputModule, MatSelectModule, PageHeaderComponent

  ],

  templateUrl: './inventory-management.component.html',

  styleUrl: './inventory-management.component.scss'

})

export class InventoryManagementComponent implements OnInit {

  items: InventoryItem[] = [];

  showForm = false;

  showAdjustForm = false;

  form!: FormGroup;

  adjustForm!: FormGroup;

  saving = false;

  readonly movementTypes = ['STOCK_IN', 'USAGE', 'WASTE'];



  constructor(

    private readonly inventory: InventoryService,

    private readonly branchCtx: BranchContextService,

    private readonly snack: SnackService,

    private readonly fb: FormBuilder

  ) {}



  ngOnInit(): void {

    this.form = this.fb.group({

      name: ['', Validators.required],

      unit: ['', Validators.required],

      currentStock: [0],

      minStock: [0]

    });

    this.adjustForm = this.fb.group({

      inventoryItemId: [null, Validators.required],

      movementType: ['STOCK_IN', Validators.required],

      quantity: [1, [Validators.required, Validators.min(0.01)]],

      notes: ['']

    });

    this.load();

  }



  load(): void {

    this.inventory.getAll({ branchId: this.branchCtx.activeBranchId }).subscribe({

      next: (r) => { this.items = r.data ?? []; },

      error: () => { this.items = []; }

    });

  }



  toggleForm(): void {

    this.showForm = !this.showForm;

  }



  toggleAdjustForm(): void {

    this.showAdjustForm = !this.showAdjustForm;

  }



  saveItem(): void {

    if (this.form.invalid || this.saving) return;

    this.saving = true;

    const body = { ...this.form.getRawValue(), branchId: this.branchCtx.activeBranchId };

    this.inventory.create(body).subscribe({

      next: () => {

        this.saving = false;

        this.showForm = false;

        this.form.reset({ currentStock: 0, minStock: 0 });

        this.snack.successKey('MESSAGES.SAVED');

        this.load();

      },

      error: (err: Error) => {

        this.saving = false;

        this.snack.error(err.message);

      }

    });

  }



  adjustStock(): void {

    if (this.adjustForm.invalid || this.saving) return;

    this.saving = true;

    this.inventory.recordMovement(this.adjustForm.getRawValue()).subscribe({

      next: () => {

        this.saving = false;

        this.showAdjustForm = false;

        this.adjustForm.reset({ movementType: 'STOCK_IN', quantity: 1 });

        this.snack.successKey('MESSAGES.STOCK_ADJUSTED');

        this.load();

      },

      error: (err: Error) => {

        this.saving = false;

        this.snack.error(err.message);

      }

    });

  }



  isLowStock(item: InventoryItem): boolean {
    const stock = Number(item.currentStock ?? item.quantity ?? 0);
    const min = Number(item.minStock ?? item.reorderLevel ?? 0);
    return stock <= min;
  }

  stockLevel(item: InventoryItem): number {
    return Number(item.currentStock ?? item.quantity ?? 0);
  }



  movementLabel(type: string): string {

    return `INVENTORY.${type}`;

  }

}



import { Component, OnInit } from '@angular/core';

import { DecimalPipe, NgFor, NgIf } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import { MatSelectModule } from '@angular/material/select';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

import { LocalizedNamePipe } from '../../../shared/pipes/localized-name.pipe';

import { MenuService } from '../../../core/services/menu.service';

import { BranchContextService } from '../../../core/services/branch-context.service';

import { SnackService } from '../../../core/services/snack.service';

import { MenuCategory, MenuItem } from '../../../core/models/restaurant.model';



@Component({

  selector: 'app-menu-management',

  standalone: true,

  imports: [

    NgFor, NgIf, DecimalPipe, ReactiveFormsModule, TranslateModule, MatButtonModule,

    MatFormFieldModule, MatInputModule, MatSelectModule, PageHeaderComponent, LocalizedNamePipe

  ],

  templateUrl: './menu-management.component.html',

  styleUrl: './menu-management.component.scss'

})

export class MenuManagementComponent implements OnInit {

  categories: MenuCategory[] = [];

  items: MenuItem[] = [];

  showCategoryForm = false;

  showItemForm = false;

  categoryForm!: FormGroup;

  itemForm!: FormGroup;

  saving = false;



  constructor(

    private readonly menu: MenuService,

    private readonly branchCtx: BranchContextService,

    private readonly snack: SnackService,

    private readonly fb: FormBuilder

  ) {}



  ngOnInit(): void {

    this.categoryForm = this.fb.group({

      name: ['', Validators.required],

      nameAr: [''],

      sortOrder: [0]

    });

    this.itemForm = this.fb.group({

      name: ['', Validators.required],

      nameAr: [''],

      categoryId: [null, Validators.required],

      price: [0, Validators.required]

    });

    this.load();

  }



  load(): void {

    const branchId = this.branchCtx.activeBranchId;

    this.menu.getCategories({ branchId }).subscribe({

      next: (r) => { this.categories = r.data ?? []; },

      error: () => { this.categories = []; }

    });

    this.menu.getItems().subscribe({

      next: (r) => { this.items = r.data ?? []; },

      error: () => { this.items = []; }

    });

  }



  toggleCategoryForm(): void {

    this.showCategoryForm = !this.showCategoryForm;

  }



  toggleItemForm(): void {

    this.showItemForm = !this.showItemForm;

  }



  saveCategory(): void {

    if (this.categoryForm.invalid || this.saving) return;

    this.saving = true;

    const body = { ...this.categoryForm.getRawValue(), branchId: this.branchCtx.activeBranchId, categoryType: 'MEALS' };

    this.menu.createCategory(body).subscribe({

      next: () => {

        this.saving = false;

        this.showCategoryForm = false;

        this.categoryForm.reset({ sortOrder: 0 });

        this.snack.successKey('MESSAGES.SAVED');

        this.load();

      },

      error: (err: Error) => {

        this.saving = false;

        this.snack.error(err.message);

      }

    });

  }



  saveItem(): void {

    if (this.itemForm.invalid || this.saving) return;

    this.saving = true;

    this.menu.createItem(this.itemForm.getRawValue()).subscribe({

      next: () => {

        this.saving = false;

        this.showItemForm = false;

        this.itemForm.reset({ price: 0 });

        this.snack.successKey('MESSAGES.SAVED');

        this.load();

      },

      error: (err: Error) => {

        this.saving = false;

        this.snack.error(err.message);

      }

    });

  }



  deleteItem(id: number): void {

    this.menu.deleteItem(id).subscribe({

      next: () => {

        this.snack.successKey('MESSAGES.DELETED');

        this.load();

      },

      error: (err: Error) => this.snack.error(err.message)

    });

  }

}



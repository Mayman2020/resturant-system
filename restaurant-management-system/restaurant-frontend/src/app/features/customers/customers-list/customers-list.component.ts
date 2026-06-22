import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { CustomerService } from '../../../core/services/customer.service';
import { SnackService } from '../../../core/services/snack.service';
import { Customer } from '../../../core/models/restaurant.model';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [
    NgFor, NgIf, ReactiveFormsModule, TranslateModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, PageHeaderComponent
  ],
  templateUrl: './customers-list.component.html',
  styleUrl: './customers-list.component.scss'
})
export class CustomersListComponent implements OnInit {
  customers: Customer[] = [];
  showForm = false;
  form!: FormGroup;
  saving = false;

  constructor(
    private readonly customersSvc: CustomerService,
    private readonly snack: SnackService,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      phone: [''],
      email: ['']
    });
    this.load();
  }

  load(): void {
    this.customersSvc.getAll().subscribe({
      next: (r) => { this.customers = r.data?.content ?? []; },
      error: () => { this.customers = []; }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  save(): void {
    if (this.form.invalid || this.saving) return;
    this.saving = true;
    this.customersSvc.create(this.form.getRawValue()).subscribe({
      next: () => {
        this.saving = false;
        this.showForm = false;
        this.form.reset();
        this.snack.successKey('MESSAGES.CUSTOMER_CREATED');
        this.load();
      },
      error: (err: Error) => {
        this.saving = false;
        this.snack.error(err.message);
      }
    });
  }

  customerName(c: Customer): string {
    return c.fullName ?? c.name;
  }
}

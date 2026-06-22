import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EnumTranslatePipe } from '../../../shared/pipes/enum-translate.pipe';
import { DeliveryService } from '../../../core/services/delivery.service';
import { BranchContextService } from '../../../core/services/branch-context.service';
import { SnackService } from '../../../core/services/snack.service';
import { DeliveryOrder } from '../../../core/models/restaurant.model';

const DELIVERY_STATUSES = ['PENDING', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'];

@Component({
  selector: 'app-delivery-tracking',
  standalone: true,
  imports: [NgFor, NgIf, TranslateModule, MatButtonModule, MatSelectModule, MatFormFieldModule, PageHeaderComponent, EnumTranslatePipe],
  templateUrl: './delivery-tracking.component.html',
  styleUrl: './delivery-tracking.component.scss'
})
export class DeliveryTrackingComponent implements OnInit {
  deliveries: DeliveryOrder[] = [];

  constructor(
    private readonly delivery: DeliveryService,
    private readonly branchCtx: BranchContextService,
    private readonly snack: SnackService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.delivery.getAll(this.branchCtx.activeBranchId).subscribe({
      next: (r) => { this.deliveries = (r.data ?? []) as DeliveryOrder[]; },
      error: () => { this.deliveries = []; }
    });
  }

  nextStatus(current: string): string | null {
    const idx = DELIVERY_STATUSES.indexOf(current);
    if (idx < 0 || idx >= DELIVERY_STATUSES.length - 1) return null;
    return DELIVERY_STATUSES[idx + 1];
  }

  advanceStatus(d: DeliveryOrder): void {
    const next = this.nextStatus(d.status);
    if (!next) return;
    this.delivery.updateStatus(d.id, next).subscribe({
      next: () => this.load(),
      error: (err: Error) => this.snack.error(err.message)
    });
  }
}

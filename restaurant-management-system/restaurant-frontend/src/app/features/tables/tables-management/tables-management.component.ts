import { Component, OnInit } from '@angular/core';

import { NgFor, NgIf } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { MatTabsModule } from '@angular/material/tabs';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

import { RmsIconBtnComponent } from '../../../shared/components/rms-icon-btn/rms-icon-btn.component';

import { EnumTranslatePipe } from '../../../shared/pipes/enum-translate.pipe';

import { TableService } from '../../../core/services/table.service';

import { BranchContextService } from '../../../core/services/branch-context.service';

import { SnackService } from '../../../core/services/snack.service';

import { RmsDialogService } from '../../../shared/services/rms-dialog.service';

import { RmsDatePipe } from '../../../shared/pipes/rms-date.pipe';

import { ReservationFormDialogComponent } from '../../../shared/dialogs/reservation-form-dialog.component';

import { Reservation, TableInfo } from '../../../core/models/restaurant.model';



@Component({

  selector: 'app-tables-management',

  standalone: true,

  imports: [

    NgFor, NgIf, RmsDatePipe, TranslateModule, MatTabsModule,

    PageHeaderComponent, RmsIconBtnComponent, EnumTranslatePipe

  ],

  templateUrl: './tables-management.component.html',

  styleUrl: './tables-management.component.scss'

})

export class TablesManagementComponent implements OnInit {

  tables: TableInfo[] = [];

  reservations: Reservation[] = [];



  constructor(

    private readonly tablesSvc: TableService,

    private readonly branchCtx: BranchContextService,

    private readonly snack: SnackService,

    private readonly dialogs: RmsDialogService

  ) {}



  ngOnInit(): void {

    this.load();

  }



  load(): void {

    const branchId = this.branchCtx.activeBranchId;

    this.tablesSvc.getTables({ branchId }).subscribe({

      next: (r) => { this.tables = r.data ?? []; },

      error: () => { this.tables = []; }

    });

    this.tablesSvc.getReservations({ branchId }).subscribe({

      next: (r) => { this.reservations = r.data ?? []; },

      error: () => { this.reservations = []; }

    });

  }



  get availableCount(): number {

    return this.tables.filter((t) => t.status === 'AVAILABLE').length;

  }



  get occupiedCount(): number {

    return this.tables.filter((t) => t.status === 'OCCUPIED').length;

  }



  openReservationDialog(): void {

    this.dialogs.open(ReservationFormDialogComponent, {

      width: '580px',

      data: { tables: this.tables }

    }).afterClosed().subscribe((ok) => {

      if (ok) this.load();

    });

  }



  cancelReservation(id: number): void {

    this.dialogs.confirm({

      title: 'DIALOG.CANCEL_RESERVATION_TITLE',

      message: 'DIALOG.CANCEL_RESERVATION_MESSAGE',

      confirmLabel: 'TABLES.CANCEL_RESERVATION',

      danger: true,

      icon: 'warning'

    }).subscribe((ok) => {

      if (!ok) return;

      this.tablesSvc.cancelReservation(id).subscribe({

        next: () => {

          this.snack.successKey('MESSAGES.RESERVATION_CANCELLED');

          this.load();

        },

        error: (err: Error) => this.snack.error(err.message)

      });

    });

  }



  tableLabel(tableId?: number): string {

    const t = this.tables.find((x) => x.id === tableId);

    return t?.tableNumber ?? String(tableId ?? '');

  }

}




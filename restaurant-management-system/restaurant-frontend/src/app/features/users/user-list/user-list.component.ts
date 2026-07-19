import { Component, OnInit } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { RmsIconBtnComponent } from '../../../shared/components/rms-icon-btn/rms-icon-btn.component';
import { TablePagerComponent } from '../../../shared/components/table-pager/table-pager.component';
import { TableExportToolbarComponent } from '../../../shared/components/table-export-toolbar/table-export-toolbar.component';
import { EstateLovSelectComponent } from '../../../shared/components/estate-lov-select/estate-lov-select.component';
import { HasPermissionDirective } from '../../../shared/directives/has-permission.directive';
import { EnumTranslatePipe } from '../../../shared/pipes/enum-translate.pipe';
import { RmsDialogService } from '../../../shared/services/rms-dialog.service';
import { ListLoadController } from '../../../shared/utils/list-load.util';
import { UserService } from '../../../core/services/user.service';
import { StaffMember, USER_ROLE_VALUES, UserRole } from '../../../core/models/user.model';
import { SnackService } from '../../../core/services/snack.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [MatTooltipModule, 
    NgFor, NgIf, FormsModule, TranslateModule, MatTableModule, MatButtonModule, MatIconModule,
    MatInputModule, MatFormFieldModule, MatProgressSpinnerModule, MatDialogModule,
    PageHeaderComponent, RmsIconBtnComponent, TablePagerComponent, TableExportToolbarComponent,
    EstateLovSelectComponent, HasPermissionDirective, EnumTranslatePipe
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  listLoad = new ListLoadController();
  page = 0;
  size = 10;
  total = 0;
  search = '';
  readonly roleFilterValues = USER_ROLE_VALUES;
  roleFilter: UserRole | null = null;
  rows: StaffMember[] = [];
  displayedColumns = ['username', 'email', 'role', 'actions'];
  columns = [
    { key: 'username', labelKey: 'USERS.USERNAME' },
    { key: 'email', labelKey: 'AUTH.EMAIL' },
    { key: 'role', labelKey: 'USERS.ROLE' }
  ];

  constructor(
    private readonly svc: UserService,
    private readonly snack: SnackService,
    private readonly dialogs: RmsDialogService,
    private readonly i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  get roleOptions() {
    return this.roleFilterValues.map((role) => ({
      value: role,
      label: this.i18n.instant(`ROLE.${role}`)
    }));
  }

  get exportColumns() {
    return [
      { header: this.i18n.instant('USERS.USERNAME'), value: 'username' as const },
      { header: this.i18n.instant('AUTH.EMAIL'), value: 'email' as const },
      { header: this.i18n.instant('USERS.ROLE'), value: (row: StaffMember) => this.i18n.instant(`ROLE.${row.role}`) },
      { header: this.i18n.instant('COMMON.STATUS'), value: (row: StaffMember) => this.i18n.instant(row.active ? 'COMMON.ACTIVE' : 'COMMON.INACTIVE') }
    ];
  }

  load(): void {
    this.listLoad.begin();
    this.svc.getAll({
      page: this.page,
      size: this.size,
      q: this.search || undefined,
      role: this.roleFilter ?? undefined
    }).subscribe({
      next: (res) => {
        this.rows = res.data?.content ?? [];
        this.total = res.data?.totalElements ?? 0;
        this.listLoad.end();
      },
      error: (err) => {
        this.snack.error(err.message);
        this.listLoad.end();
      }
    });
  }

  onRoleFilterChange(role: unknown): void {
    this.roleFilter = (role as UserRole | null) ?? null;
    this.page = 0;
    this.load();
  }

  onCreate(): void {
    this.dialogs.open(UserDialogComponent, { width: '520px' }).afterClosed().subscribe((saved) => {
      if (saved) this.load();
    });
  }

  onEdit(row: StaffMember): void {
    this.dialogs.open(UserDialogComponent, { width: '520px', data: row }).afterClosed().subscribe((saved) => {
      if (saved) this.load();
    });
  }

  onToggle(row: StaffMember): void {
    const messageKey = row.active ? 'USERS.DEACTIVATE_CONFIRM' : 'USERS.ACTIVATE_CONFIRM';
    const confirmLabelKey = row.active ? 'USERS.DEACTIVATE' : 'USERS.ACTIVATE';
    this.dialogs.confirm({
      title: 'DIALOG.DELETE_TITLE',
      message: messageKey,
      confirmLabel: confirmLabelKey,
      cancelLabel: 'COMMON.CANCEL',
      danger: true,
      icon: 'warning'
    }).subscribe((ok) => {
      if (!ok) return;
      this.svc.toggleActive(row.id).subscribe({
        next: () => { this.snack.successKey('MESSAGES.STATUS_UPDATED'); this.load(); },
        error: (e) => this.snack.error(e.message)
      });
    });
  }

  onPageIndexChange(index: number): void {
    this.page = index;
    this.load();
  }

  loadAllRows = (): Promise<StaffMember[]> =>
    firstValueFrom(this.svc.getAll({
      page: 0,
      size: Math.max(this.total, 1000),
      q: this.search || undefined,
      role: this.roleFilter ?? undefined
    })).then((res) => res.data?.content ?? []);
}

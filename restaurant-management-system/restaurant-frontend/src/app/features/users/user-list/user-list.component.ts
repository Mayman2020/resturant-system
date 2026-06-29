import { Component, OnInit } from '@angular/core';
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
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { RmsIconBtnComponent } from '../../../shared/components/rms-icon-btn/rms-icon-btn.component';
import { TablePagerComponent } from '../../../shared/components/table-pager/table-pager.component';
import { HasPermissionDirective } from '../../../shared/directives/has-permission.directive';
import { EnumTranslatePipe } from '../../../shared/pipes/enum-translate.pipe';
import { RmsDialogService } from '../../../shared/services/rms-dialog.service';
import { UserService } from '../../../core/services/user.service';
import { StaffMember } from '../../../core/models/user.model';
import { SnackService } from '../../../core/services/snack.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    NgFor, NgIf, FormsModule, TranslateModule, MatTableModule, MatButtonModule, MatIconModule,
    MatInputModule, MatFormFieldModule, MatProgressSpinnerModule, MatDialogModule,
    PageHeaderComponent, RmsIconBtnComponent, TablePagerComponent, HasPermissionDirective, EnumTranslatePipe
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  loading = false;
  page = 0;
  size = 10;
  total = 0;
  search = '';
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
    private readonly dialogs: RmsDialogService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.svc.list(this.page, this.size, this.search).subscribe({
      next: (res) => {
        this.rows = res.data?.content ?? [];
        this.total = res.data?.totalElements ?? 0;
        this.loading = false;
      },
      error: (err) => { this.snack.error(err.message); this.loading = false; }
    });
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
    this.svc.toggleActive(row.id).subscribe({
      next: () => { this.snack.successKey('MESSAGES.STATUS_UPDATED'); this.load(); },
      error: (e) => this.snack.error(e.message)
    });
  }

  onPageIndexChange(index: number): void {
    this.page = index;
    this.load();
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { PermissionService } from '../../core/services/permission.service';
import { NavigationHistoryService } from '../../core/services/navigation-history.service';
import { UserRole } from '../../core/models/user.model';

interface NavItem {
  icon: string;
  labelKey: string;
  route: string;
  permissionKey: string;
  roles: UserRole[];
  tone: string;
  section?: 'NAV_SECTION.OVERVIEW' | 'NAV_SECTION.OPERATIONS' | 'NAV_SECTION.ADMIN';
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, RouterLinkActive, MatIconModule, MatTooltipModule, TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  @Input() collapsed = false;
  @Output() collapseToggle = new EventEmitter<void>();

  items: NavItem[] = [];
  sectionExpanded: Record<string, boolean> = {
    'NAV_SECTION.OVERVIEW': true,
    'NAV_SECTION.OPERATIONS': true,
    'NAV_SECTION.ADMIN': true
  };

  private readonly navItems: NavItem[] = [
    { icon: 'dashboard', labelKey: 'NAV.DASHBOARD', route: '/admin/dashboard', permissionKey: 'dashboard', roles: ['ADMIN', 'MANAGER', 'CASHIER'], tone: 'purple', section: 'NAV_SECTION.OVERVIEW' },
    { icon: 'point_of_sale', labelKey: 'NAV.POS', route: '/admin/pos', permissionKey: 'pos', roles: ['ADMIN', 'MANAGER', 'CASHIER'], tone: 'orange' },
    { icon: 'receipt_long', labelKey: 'NAV.ORDERS', route: '/admin/orders', permissionKey: 'orders', roles: ['ADMIN', 'MANAGER', 'CASHIER', 'WAITER'], tone: 'cyan' },
    { icon: 'skillet', labelKey: 'NAV.KITCHEN', route: '/admin/kitchen', permissionKey: 'kitchen', roles: ['ADMIN', 'MANAGER', 'KITCHEN_STAFF'], tone: 'rose' },
    { icon: 'table_restaurant', labelKey: 'NAV.TABLES', route: '/admin/tables', permissionKey: 'tables', roles: ['ADMIN', 'MANAGER', 'WAITER'], tone: 'green' },
    { icon: 'local_shipping', labelKey: 'NAV.DELIVERY', route: '/admin/delivery', permissionKey: 'delivery', roles: ['ADMIN', 'MANAGER', 'CASHIER'], tone: 'cyan' },
    { icon: 'groups', labelKey: 'NAV.CUSTOMERS', route: '/admin/customers', permissionKey: 'customers', roles: ['ADMIN', 'MANAGER', 'CASHIER'], tone: 'indigo' },
    { icon: 'card_giftcard', labelKey: 'NAV.LOYALTY', route: '/admin/loyalty', permissionKey: 'loyalty', roles: ['ADMIN', 'MANAGER'], tone: 'pink' },
    { icon: 'restaurant_menu', labelKey: 'NAV.MENU', route: '/admin/menu', permissionKey: 'menu', roles: ['ADMIN', 'MANAGER', 'WAITER'], tone: 'gold' },
    { icon: 'inventory_2', labelKey: 'NAV.INVENTORY', route: '/admin/inventory', permissionKey: 'inventory', roles: ['ADMIN', 'MANAGER'], tone: 'teal' },
    { icon: 'badge', labelKey: 'NAV.USERS', route: '/admin/users', permissionKey: 'users', roles: ['ADMIN', 'MANAGER'], tone: 'slate' },
    { icon: 'admin_panel_settings', labelKey: 'NAV.PERMISSIONS', route: '/admin/permissions', permissionKey: 'settings', roles: ['ADMIN'], tone: 'gold' },
    { icon: 'analytics', labelKey: 'NAV.ANALYTICS', route: '/admin/reports', permissionKey: 'reports', roles: ['ADMIN', 'MANAGER'], tone: 'purple' },
    { icon: 'notifications', labelKey: 'NAV.NOTIFICATIONS', route: '/admin/notifications', permissionKey: 'dashboard', roles: ['ADMIN', 'MANAGER', 'CASHIER', 'WAITER', 'KITCHEN_STAFF'], tone: 'rose' },
    { icon: 'settings', labelKey: 'NAV.SETTINGS', route: '/admin/settings', permissionKey: 'settings', roles: ['ADMIN', 'MANAGER'], tone: 'slate' },
    { icon: 'list_alt', labelKey: 'NAV.LOOKUPS', route: '/admin/lookups', permissionKey: 'settings', roles: ['ADMIN', 'MANAGER'], tone: 'gold' }
  ];

  constructor(
    readonly auth: AuthService,
    private readonly perms: PermissionService,
    private readonly navHistory: NavigationHistoryService
  ) {}

  ngOnInit(): void {
    const role = this.auth.getRole();
    this.items = role
      ? this.navItems.filter((i) => i.roles.includes(role) && this.perms.can(i.permissionKey, 'view'))
      : [];
  }

  trackItem(_index: number, item: NavItem): string {
    return item.route;
  }

  get sections(): { key: string; items: NavItem[] }[] {
    const overview = new Set(['/admin/dashboard', '/admin/pos', '/admin/orders', '/admin/reports']);
    const admin = new Set(['/admin/users', '/admin/permissions', '/admin/notifications', '/admin/settings', '/admin/lookups']);
    return [
      { key: 'NAV_SECTION.OVERVIEW', items: this.items.filter((item) => item.section === 'NAV_SECTION.OVERVIEW' || overview.has(item.route)) },
      { key: 'NAV_SECTION.OPERATIONS', items: this.items.filter((item) => !overview.has(item.route) && !admin.has(item.route) && !item.section) },
      { key: 'NAV_SECTION.ADMIN', items: this.items.filter((item) => admin.has(item.route)) }
    ].filter((section) => section.items.length > 0);
  }

  toggleSection(key: string): void {
    this.sectionExpanded[key] = !this.sectionExpanded[key];
  }

  get userName(): string {
    const user = this.auth.getCurrentUser();
    return user?.fullName || user?.username || '';
  }

  get roleKey(): string {
    const role = this.auth.getRole();
    return role ? `ROLE.${role}` : '';
  }

  logout(): void {
    this.auth.logout();
  }

  onMenuNav(): void {
    this.navHistory.markFromMenu();
  }
}

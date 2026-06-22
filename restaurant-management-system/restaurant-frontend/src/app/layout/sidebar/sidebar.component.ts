import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { PermissionService } from '../../core/services/permission.service';
import { UserRole } from '../../core/models/user.model';

interface NavItem {
  icon: string;
  labelKey: string;
  route: string;
  permissionKey: string;
  roles: UserRole[];
}

interface NavSection {
  labelKey: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, RouterLinkActive, MatIconModule, MatTooltipModule, TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Input() lang: 'ar' | 'en' = 'ar';
  @Output() collapseToggle = new EventEmitter<void>();

  private readonly navItems: NavItem[] = [
    { icon: 'dashboard', labelKey: 'NAV.DASHBOARD', route: '/admin/dashboard', permissionKey: 'dashboard', roles: ['ADMIN', 'MANAGER', 'CASHIER'] },
    { icon: 'point_of_sale', labelKey: 'NAV.POS', route: '/admin/pos', permissionKey: 'pos', roles: ['ADMIN', 'MANAGER', 'CASHIER'] },
    { icon: 'restaurant_menu', labelKey: 'NAV.MENU', route: '/admin/menu', permissionKey: 'menu', roles: ['ADMIN', 'MANAGER', 'WAITER'] },
    { icon: 'receipt_long', labelKey: 'NAV.ORDERS', route: '/admin/orders', permissionKey: 'orders', roles: ['ADMIN', 'MANAGER', 'CASHIER', 'WAITER'] },
    { icon: 'skillet', labelKey: 'NAV.KITCHEN', route: '/admin/kitchen', permissionKey: 'kitchen', roles: ['ADMIN', 'MANAGER', 'KITCHEN_STAFF'] },
    { icon: 'table_restaurant', labelKey: 'NAV.TABLES', route: '/admin/tables', permissionKey: 'tables', roles: ['ADMIN', 'MANAGER', 'WAITER'] },
    { icon: 'delivery_dining', labelKey: 'NAV.DELIVERY', route: '/admin/delivery', permissionKey: 'delivery', roles: ['ADMIN', 'MANAGER', 'DELIVERY_DRIVER'] },
    { icon: 'groups', labelKey: 'NAV.CUSTOMERS', route: '/admin/customers', permissionKey: 'customers', roles: ['ADMIN', 'MANAGER', 'CASHIER'] },
    { icon: 'loyalty', labelKey: 'NAV.LOYALTY', route: '/admin/loyalty', permissionKey: 'loyalty', roles: ['ADMIN', 'MANAGER'] },
    { icon: 'inventory_2', labelKey: 'NAV.INVENTORY', route: '/admin/inventory', permissionKey: 'inventory', roles: ['ADMIN', 'MANAGER'] },
    { icon: 'bar_chart', labelKey: 'NAV.REPORTS', route: '/admin/reports', permissionKey: 'reports', roles: ['ADMIN', 'MANAGER'] },
    { icon: 'settings', labelKey: 'NAV.SETTINGS', route: '/admin/settings', permissionKey: 'settings', roles: ['ADMIN', 'MANAGER'] }
  ];

  private readonly sectionMap: Record<string, string> = {
    dashboard: 'NAV_SECTION.OVERVIEW',
    pos: 'NAV_SECTION.OPERATIONS',
    menu: 'NAV_SECTION.OPERATIONS',
    orders: 'NAV_SECTION.OPERATIONS',
    kitchen: 'NAV_SECTION.OPERATIONS',
    tables: 'NAV_SECTION.OPERATIONS',
    delivery: 'NAV_SECTION.OPERATIONS',
    customers: 'NAV_SECTION.MANAGEMENT',
    loyalty: 'NAV_SECTION.MANAGEMENT',
    inventory: 'NAV_SECTION.MANAGEMENT',
    reports: 'NAV_SECTION.ANALYTICS',
    settings: 'NAV_SECTION.SYSTEM'
  };

  constructor(readonly auth: AuthService, private readonly perms: PermissionService) {}

  get visibleItems(): NavItem[] {
    const role = this.auth.getRole();
    return role ? this.navItems.filter(i => i.roles.includes(role) && this.perms.can(i.permissionKey, 'view')) : [];
  }

  get sections(): NavSection[] {
    const items = this.visibleItems;
    const grouped = new Map<string, NavItem[]>();
    for (const item of items) {
      const key = this.sectionMap[item.permissionKey] ?? 'NAV_SECTION.OPERATIONS';
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(item);
    }
    return Array.from(grouped.entries()).map(([labelKey, sectionItems]) => ({ labelKey, items: sectionItems }));
  }

  logout(): void {
    this.auth.logout();
  }
}

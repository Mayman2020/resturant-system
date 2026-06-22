import { Routes } from '@angular/router';
import { MainLayoutComponent } from '../../layout/main-layout/main-layout.component';
import { adminGuard, permissionGuard } from '../../core/guards/auth.guard';
export const ADMIN_ROUTES: Routes = [
  { path: '', component: MainLayoutComponent, canActivate: [adminGuard], children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', canActivate: [permissionGuard], data: { permission: 'dashboard' }, loadComponent: () => import('../dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent) },
    { path: 'pos', canActivate: [permissionGuard], data: { permission: 'pos' }, loadComponent: () => import('../pos/pos/pos.component').then(m => m.PosComponent) },
    { path: 'menu', canActivate: [permissionGuard], data: { permission: 'menu' }, loadComponent: () => import('../menu/menu-management/menu-management.component').then(m => m.MenuManagementComponent) },
    { path: 'orders', canActivate: [permissionGuard], data: { permission: 'orders' }, loadComponent: () => import('../orders/orders-list/orders-list.component').then(m => m.OrdersListComponent) },
    { path: 'orders/:id', canActivate: [permissionGuard], data: { permission: 'orders' }, loadComponent: () => import('../orders/order-detail/order-detail.component').then(m => m.OrderDetailComponent) },
    { path: 'kitchen', canActivate: [permissionGuard], data: { permission: 'kitchen' }, loadComponent: () => import('../kitchen/kitchen-display/kitchen-display.component').then(m => m.KitchenDisplayComponent) },
    { path: 'tables', canActivate: [permissionGuard], data: { permission: 'tables' }, loadComponent: () => import('../tables/tables-management/tables-management.component').then(m => m.TablesManagementComponent) },
    { path: 'delivery', canActivate: [permissionGuard], data: { permission: 'delivery' }, loadComponent: () => import('../delivery/delivery-tracking/delivery-tracking.component').then(m => m.DeliveryTrackingComponent) },
    { path: 'customers', canActivate: [permissionGuard], data: { permission: 'customers' }, loadComponent: () => import('../customers/customers-list/customers-list.component').then(m => m.CustomersListComponent) },
    { path: 'loyalty', canActivate: [permissionGuard], data: { permission: 'loyalty' }, loadComponent: () => import('../loyalty/loyalty-management/loyalty-management.component').then(m => m.LoyaltyManagementComponent) },
    { path: 'inventory', canActivate: [permissionGuard], data: { permission: 'inventory' }, loadComponent: () => import('../inventory/inventory-management/inventory-management.component').then(m => m.InventoryManagementComponent) },
    { path: 'reports', canActivate: [permissionGuard], data: { permission: 'reports' }, loadComponent: () => import('../reports/reports-dashboard/reports-dashboard.component').then(m => m.ReportsDashboardComponent) },
    { path: 'settings', canActivate: [permissionGuard], data: { permission: 'settings' }, loadComponent: () => import('../settings/settings-page/settings-page.component').then(m => m.SettingsPageComponent) }
  ]}
];

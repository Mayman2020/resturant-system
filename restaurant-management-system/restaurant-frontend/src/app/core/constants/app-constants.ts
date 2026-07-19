import { environment } from '../../../environments/environment';

type RuntimeWindow = Window & { __RMS_API_URL__?: string };

function getRuntimeApiBaseUrl(): string {
  const runtimeApiUrl = typeof window !== 'undefined'
    ? (window as RuntimeWindow).__RMS_API_URL__
    : undefined;
  return runtimeApiUrl?.trim() || environment.apiUrl;
}

export const HTTP_HEADERS = {
  ACTIVE_BRANCH_ID: 'X-Active-Branch-Id',
} as const;

export const AppConstants = {
  PERSISTED_KEYS: {
    ACCESS_TOKEN: 'rms_access_token',
    REFRESH_TOKEN: 'rms_refresh_token',
    CURRENT_USER: 'rms_current_user',
    LANG: 'rms_lang',
    THEME: 'rms_theme',
    ACTIVE_BRANCH_ID: 'rms_active_branch_id',
  },

  API: {
    baseURL: getRuntimeApiBaseUrl(),

    AUTH_LOGIN: '/auth/login',
    AUTH_LOGOUT: '/auth/logout',
    AUTH_REFRESH: '/auth/refresh',
    AUTH_FORGOT_PASSWORD: '/auth/forgot-password',
    AUTH_RESET_PASSWORD: '/auth/reset-password',

    USERS: '/users',
    USER_BY_ID: (id: number) => `/users/${id}`,
    USERS_TOGGLE_ACTIVE: (id: number) => `/users/${id}/toggle-active`,
    USERS_ME: '/users/me',
    USERS_ME_CHANGE_PASSWORD: '/users/me/change-password',

    BRANCHES: '/branches',
    BRANCH_BY_ID: (id: number) => `/branches/${id}`,

    TABLES: '/tables',
    TABLE_BY_ID: (id: number) => `/tables/${id}`,
    RESERVATIONS: '/tables/reservations',

    MENU_CATEGORIES: '/menu/categories',
    MENU_CATEGORY_BY_ID: (id: number) => `/menu/categories/${id}`,
    MENU_ITEMS: '/menu/items',
    MENU_ITEM_BY_ID: (id: number) => `/menu/items/${id}`,
    MENU_MODIFIERS: '/menu/modifiers',
    MENU_QR: (qrCode: string) => `/menu/qr/${qrCode}`,

    ORDERS: '/orders',
    ORDER_BY_ID: (id: number) => `/orders/${id}`,
    ORDER_STATUS: (id: number) => `/orders/${id}/status`,
    ORDER_HOLD: (id: number) => `/orders/${id}/hold`,
    ORDER_SPLIT: (id: number) => `/orders/${id}/split`,
    ORDER_MERGE: '/orders/merge',
    ORDER_CHECKOUT: (id: number) => `/orders/${id}/checkout`,

    KITCHEN_ACTIVE: '/kitchen/active',
    KITCHEN_ADVANCE: (id: number) => `/kitchen/orders/${id}/advance`,

    DELIVERY: '/delivery',
    DELIVERY_BY_ORDER: (orderId: number) => `/delivery/order/${orderId}`,
    DELIVERY_ASSIGN: (id: number) => `/delivery/${id}/assign`,
    DELIVERY_STATUS: (id: number) => `/delivery/${id}/status`,

    CUSTOMERS: '/customers',
    CUSTOMER_BY_ID: (id: number) => `/customers/${id}`,

    LOYALTY_POINTS: (customerId: number) => `/loyalty/customers/${customerId}/points`,
    LOYALTY_COUPONS: '/loyalty/coupons',

    INVENTORY: '/inventory',
    INVENTORY_BY_ID: (id: number) => `/inventory/${id}`,
    INVENTORY_LOW_STOCK: '/inventory/low-stock',
    INVENTORY_MOVEMENTS: '/inventory/movements',
    INVENTORY_ITEM_MOVEMENTS: (id: number) => `/inventory/${id}/movements`,

    BILLING_RECEIPTS: '/billing/receipts',
    BILLING_RECEIPT_BY_ID: (id: number) => `/billing/receipts/${id}`,
    BILLING_GENERATE_RECEIPT: (orderId: number) => `/billing/orders/${orderId}/receipt`,

    REPORTS_SALES_DAILY: '/reports/sales/daily',
    REPORTS_SALES_MONTHLY: '/reports/sales/monthly',
    REPORTS_TOP_ITEMS: '/reports/top-items',
    REPORTS_BRANCH_PERFORMANCE: '/reports/branch-performance',
    REPORTS_BUSIEST_HOURS: '/reports/busiest-hours',
    REPORTS_WAITER_PERFORMANCE: '/reports/performance/waiters',
    REPORTS_KITCHEN_PERFORMANCE: '/reports/performance/kitchen',
    REPORTS_DELIVERY_PERFORMANCE: '/reports/performance/delivery',
    REPORTS_PROFIT_MARGINS: '/reports/profit-margins',

    DASHBOARD_SUMMARY: '/dashboard/summary',

    SETTINGS: '/settings',
    SETTING_BY_ID: (id: number) => `/settings/${id}`,

    PERMISSIONS: '/permissions',
    PERMISSIONS_BY_ROLE: (role: string) => `/permissions/${role}`,

    LOOKUPS_BY_TYPE: '/lookups/by-type',
    LOOKUPS_ADMIN_BY_TYPE: '/lookups/admin/by-type',
    LOOKUPS: '/lookups',
    LOOKUP_BY_ID: (id: number) => `/lookups/${id}`,
  },
} as const;

export function shouldSkipGlobalLoaderForUpload(url: string, method: string): boolean {
  const u = url ?? '';
  const m = (method ?? '').toUpperCase();
  return m === 'POST' && (u.includes('/files') || u.includes('/upload'));
}

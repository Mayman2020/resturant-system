export interface Branch {
  id: number;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  timezone?: string;
  taxRate?: number;
  serviceCharge?: number;
  active?: boolean;
  isActive?: boolean;
}



export interface MenuCategory {

  id: number;

  name: string;

  nameAr?: string;

  sortOrder?: number;

  categoryType?: string;

  active?: boolean;

}



export interface MenuItem {

  id: number;

  name: string;

  nameAr?: string;

  price: number;

  categoryId: number;

  sku?: string;

  isActive?: boolean;

  available?: boolean;

}



export interface QrMenu {

  tableNumber?: string;

  branchId?: number;

  categories: MenuCategory[];

  items: MenuItem[];

}



export interface OrderItem {

  id?: number;

  menuItemId: number;

  name: string;

  quantity: number;

  unitPrice: number;

  notes?: string;

}



export interface Order {

  id: number;

  orderNumber: string;

  status: string;

  orderType: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';

  totalAmount: number;

  subtotal?: number;

  taxAmount?: number;

  discountAmount?: number;

  serviceCharge?: number;

  tipAmount?: number;

  tableId?: number;

  customerId?: number;

  items?: OrderItem[];

  held?: boolean;

  createdAt?: string;

}



export interface TableInfo {

  id: number;

  tableNumber: string;

  capacity: number;

  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'CLEANING';

}



export interface Reservation {

  id: number;

  customerName: string;

  customerPhone?: string;

  partySize: number;

  reservedAt: string;

  tableId?: number;

  status?: string;

  notes?: string;

}



export interface Customer {

  id: number;

  name: string;

  fullName?: string;

  phone?: string;

  email?: string;

  loyaltyPoints?: number;

  visits?: number;

}



export interface InventoryItem {

  id: number;

  name: string;

  sku?: string;

  quantity?: number;

  currentStock?: number;

  reorderLevel?: number;

  minStock?: number;

  unit?: string;

}



export interface StockMovement {

  id: number;

  inventoryItemId: number;

  movementType: string;

  quantity: number;

  reference?: string;

  notes?: string;

  createdAt?: string;

}



export interface DeliveryOrder {

  id: number;

  orderId: number;

  driverId?: number;

  deliveryAddress?: string;

  deliveryFee?: number;

  estimatedMinutes?: number;

  status: string;

}



export interface Coupon {

  id: number;

  code: string;

  description?: string;

  discountValue?: number;

  validUntil?: string;

  active?: boolean;

}



export interface DashboardStats {

  branchId?: number;

  todayOrders?: number;

  todaySales?: number;

  activeOrders?: number;

  lowStockItems?: number;

  totalCustomers?: number;

  staffCount?: number;

}



export interface SalesReport {

  branchId?: number;

  period?: string;

  orderCount?: number;

  totalSales?: number;

}



export interface TopItemReport {

  itemName: string;

  quantitySold: number;

}



export interface BranchSetting {

  id?: number;

  branchId?: number;

  settingKey: string;

  settingValue: string;

}


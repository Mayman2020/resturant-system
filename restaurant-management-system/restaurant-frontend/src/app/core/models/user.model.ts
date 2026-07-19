export type UserRole = 'ADMIN' | 'MANAGER' | 'CASHIER' | 'WAITER' | 'KITCHEN_STAFF' | 'DELIVERY_DRIVER';
export const USER_ROLE_VALUES: UserRole[] = ['ADMIN', 'MANAGER', 'CASHIER', 'WAITER', 'KITCHEN_STAFF', 'DELIVERY_DRIVER'];
export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'menu' | 'export';
export interface ModulePermission {
  enabled?: boolean;
  view?: boolean;
  create?: boolean;
  edit?: boolean;
  delete?: boolean;
  menu?: boolean;
  export?: boolean;
}

export type PermissionMap = Record<string, ModulePermission>;

export interface UserDto {
  id: number;
  username: string;
  email?: string;
  fullName?: string;
  role: UserRole;
  branchId?: number;
  permissions?: PermissionMap;
  mustChangePassword?: boolean;
}

export interface StaffMember extends UserDto {
  phone?: string;
  active?: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CurrentUser extends UserDto {
  initials?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: UserDto;
}

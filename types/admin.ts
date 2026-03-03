import { UserRole, UserStatus } from './common';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  phone?: string;
  department?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface AdminPermission {
  id: string;
  name: string;
  description: string;
  action: string;
  resource: string;
}

export interface AdminRole {
  id: string;
  name: UserRole;
  permissions: AdminPermission[];
  description: string;
}

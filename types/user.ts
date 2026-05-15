export type UserRole = 'CLIENT' | 'PRO' | 'ADMIN';
export type UserStatus = 'active' | 'suspended' | 'banned' | 'inactive';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  status: UserStatus;
  city?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
  role?: UserRole;
}

export interface UpdateUserInput {
  email?: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  status?: UserStatus;
  city?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface SignupResponse {
  message: string;
  user: User;
  tokens: AuthTokens;
}

export interface LoginResponse {
  message: string;
  user: User;
  tokens: AuthTokens;
}

export interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  bannedUsers: number;
  clientUsers: number;
  proUsers: number;
  adminUsers: number;
}

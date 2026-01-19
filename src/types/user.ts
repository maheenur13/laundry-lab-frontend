/**
 * User role enum - must match backend.
 */
export enum UserRole {
  CUSTOMER = 'customer',
  DELIVERY = 'delivery',
  ADMIN = 'admin',
}

/**
 * User profile interface.
 */
export interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Auth state interface.
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isNewUser: boolean;
}

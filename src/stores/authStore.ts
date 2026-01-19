import { create } from 'zustand';
import { storage } from '../lib/storage';
import { User, UserRole } from '../types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isNewUser: boolean;
  phoneNumber: string | null;

  // Actions
  initialize: () => Promise<void>;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  setIsNewUser: (isNew: boolean) => void;
  setPhoneNumber: (phone: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  isNewUser: false,
  phoneNumber: null,

  /**
   * Initialize auth state from storage.
   */
  initialize: async () => {
    try {
      const [token, user] = await Promise.all([
        storage.getToken(),
        storage.getUser<User>(),
      ]);

      if (token && user) {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      set({ isLoading: false });
    }
  },

  /**
   * Set authenticated user and token.
   */
  setAuth: (user, token) => {
    set({
      user,
      token,
      isAuthenticated: true,
    });
  },

  /**
   * Update user data.
   */
  setUser: (user) => {
    set({ user });
  },

  /**
   * Set new user flag.
   */
  setIsNewUser: (isNew) => {
    set({ isNewUser: isNew });
  },

  /**
   * Set phone number for OTP flow.
   */
  setPhoneNumber: (phone) => {
    set({ phoneNumber: phone });
  },

  /**
   * Clear auth state.
   */
  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isNewUser: false,
      phoneNumber: null,
    });
  },
}));

/**
 * Helper to check if user has a specific role.
 */
export function useHasRole(role: UserRole): boolean {
  const user = useAuthStore((state) => state.user);
  return user?.role === role;
}

/**
 * Helper to get current user role.
 */
export function useUserRole(): UserRole | null {
  const user = useAuthStore((state) => state.user);
  return user?.role ?? null;
}

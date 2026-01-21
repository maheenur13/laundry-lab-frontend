import { create } from "zustand";
import { storage } from "../lib/storage";
import { User, UserRole } from "../types/user";
import { decodeJwt, getRoleFromToken } from "../lib/jwt";
import { fetchUserProfile } from "../hooks/useAuth";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isNewUser: boolean;
  phoneNumber: string | null;

  // Actions
  initialize: () => Promise<void>;
  setAuth: (user: User, token: string) => Promise<void>;
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
   * Validates role consistency between stored user data and JWT token.
   * If mismatch detected, fetches fresh user data from backend.
   */
  initialize: async () => {
    try {
      const [token, user] = await Promise.all([
        storage.getToken(),
        storage.getUser<User>(),
      ]);

      if (!token || !user) {
        set({ isLoading: false });
        return;
      }

      // Decode JWT to extract role from token
      const tokenRole = getRoleFromToken(token);

      if (!tokenRole) {
        console.warn("Failed to decode role from token, clearing auth state");
        await storage.clearAll();
        set({ isLoading: false });
        return;
      }

      // Check if stored user role matches token role
      const roleMismatch = user.role !== tokenRole;

      if (roleMismatch) {
        console.warn(
          `Role mismatch detected: stored role="${user.role}", token role="${tokenRole}". Fetching fresh user data.`,
        );

        // Fetch fresh user data from backend to ensure consistency
        try {
          const freshUser = await fetchUserProfile();

          if (freshUser) {
            // Update stored user data with fresh data from backend
            await storage.saveUser(freshUser);

            // Verify the fresh user role matches token role
            if (freshUser.role !== tokenRole) {
              console.error(
                `Critical: Fresh user role="${freshUser.role}" still doesn't match token role="${tokenRole}". Using token role.`,
              );
              // Use role from token as source of truth
              freshUser.role = tokenRole as UserRole;
              await storage.saveUser(freshUser);
            }

            set({
              user: freshUser,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // If fetch fails, update stored user with role from token
            console.warn(
              "Failed to fetch fresh user data, updating role from token",
            );
            const correctedUser = { ...user, role: tokenRole as UserRole };
            await storage.saveUser(correctedUser);

            set({
              user: correctedUser,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error("Error fetching fresh user data:", error);
          // Fallback: update stored user with role from token
          const correctedUser = { ...user, role: tokenRole as UserRole };
          await storage.saveUser(correctedUser);

          set({
            user: correctedUser,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        }
      } else {
        // Roles match, proceed normally
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      set({ isLoading: false });
    }
  },

  /**
   * Set authenticated user and token.
   * Also persists to storage to ensure data is saved.
   */
  setAuth: async (user, token) => {
    // Persist to storage
    await storage.saveToken(token);
    await storage.saveUser(user);

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
   * Clear auth state and storage.
   */
  logout: async () => {
    // Clear storage
    await storage.clearAll();

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

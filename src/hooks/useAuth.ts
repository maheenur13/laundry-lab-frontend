import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { storage } from '../lib/storage';
import { API_ENDPOINTS } from '../constants/api';
import { User } from '../types/user';
import { useAuthStore } from '../stores/authStore';

// Request OTP types
interface RequestOtpRequest {
  phoneNumber: string;
}

interface RequestOtpResponse {
  message: string;
  otp?: string; // Only in dev mode
}

// Verify OTP types
interface VerifyOtpRequest {
  phoneNumber: string;
  otpCode: string;
}

interface VerifyOtpResponse {
  accessToken: string;
  user: User;
  isNewUser: boolean;
}

// Complete signup types
interface CompleteSignupRequest {
  phoneNumber: string;
  fullName: string;
  address: string;
}

interface CompleteSignupResponse {
  accessToken: string;
  user: User;
}

// Update profile types
interface UpdateProfileRequest {
  fullName?: string;
  address?: string;
}

/**
 * Hook for requesting OTP.
 */
export function useRequestOtp() {
  const setPhoneNumber = useAuthStore((state) => state.setPhoneNumber);

  return useMutation({
    mutationFn: async (data: RequestOtpRequest) => {
      const response = await api.post<RequestOtpResponse>(
        API_ENDPOINTS.REQUEST_OTP,
        data,
      );
      return response;
    },
    onSuccess: (_, variables) => {
      setPhoneNumber(variables.phoneNumber);
    },
  });
}

/**
 * Hook for verifying OTP.
 */
export function useVerifyOtp() {
  const { setAuth, setIsNewUser } = useAuthStore();

  return useMutation({
    mutationFn: async (data: VerifyOtpRequest) => {
      const response = await api.post<VerifyOtpResponse>(
        API_ENDPOINTS.VERIFY_OTP,
        data,
      );
      return response;
    },
    onSuccess: async (data) => {
      // Update auth store (this also saves to storage)
      await setAuth(data.user, data.accessToken);
      setIsNewUser(data.isNewUser);
    },
  });
}

/**
 * Hook for completing signup.
 */
export function useCompleteSignup() {
  const { setAuth, setIsNewUser } = useAuthStore();

  return useMutation({
    mutationFn: async (data: CompleteSignupRequest) => {
      const response = await api.post<CompleteSignupResponse>(
        API_ENDPOINTS.COMPLETE_SIGNUP,
        data,
      );
      return response;
    },
    onSuccess: async (data) => {
      // Update auth store (this also saves to storage)
      await setAuth(data.user, data.accessToken);
      setIsNewUser(false);
    },
  });
}

/**
 * Hook for updating profile.
 */
export function useUpdateProfile() {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      const user = await api.patch<User>(API_ENDPOINTS.UPDATE_PROFILE, data);
      return user;
    },
    onSuccess: async (user) => {
      await storage.saveUser(user);
      setUser(user);
    },
  });
}

/**
 * Hook for fetching current user profile from backend.
 */
export function useGetProfile() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: () => api.get<User>(API_ENDPOINTS.GET_PROFILE),
    enabled: isAuthenticated,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for fetching current user profile (non-hook version for use in stores).
 * This is a utility function that can be called outside of React components.
 */
export async function fetchUserProfile(): Promise<User | null> {
  try {
    const user = await api.get<User>(API_ENDPOINTS.GET_PROFILE);
    return user;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return null;
  }
}

/**
 * Hook for logout.
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: async () => {
      await storage.clearAll();
    },
    onSuccess: () => {
      logout();
      // Clear all cached queries
      queryClient.clear();
    },
  });
}

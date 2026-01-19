import { Redirect } from 'expo-router';
import { useAuthStore } from '../stores/authStore';
import { UserRole } from '../types/user';

/**
 * Entry point - redirects based on auth state and role.
 */
export default function Index() {
  const { isAuthenticated, user, isNewUser } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  if (isNewUser) {
    return <Redirect href="/(auth)/complete-profile" />;
  }

  // Route by role
  switch (user?.role) {
    case UserRole.CUSTOMER:
      return <Redirect href="/(customer)/home" />;
    case UserRole.DELIVERY:
      return <Redirect href="/(delivery)/dashboard" />;
    case UserRole.ADMIN:
      return <Redirect href="/(admin)/dashboard" />;
    default:
      return <Redirect href="/(auth)/login" />;
  }
}

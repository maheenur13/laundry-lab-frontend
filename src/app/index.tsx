import { Redirect } from 'expo-router';

/**
 * Entry point - redirects to login.
 * RoleGuard will handle proper routing based on auth state.
 */
export default function Index() {
  return <Redirect href="/(auth)/login" />;
}

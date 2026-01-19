import { Stack } from 'expo-router';

/**
 * Auth group layout - login, OTP, signup screens.
 */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="complete-profile" />
    </Stack>
  );
}

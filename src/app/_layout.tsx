import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme, View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { queryClient } from '../lib/queryClient';
import { useAuthStore } from '../stores/authStore';
import { UserRole } from '../types/user';
import { colors, layout, shadows } from '../constants/theme';
import '../i18n';

// Inject CSS for proper mobile viewport height on web
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    html, body {
      height: 100% !important;
      height: 100dvh !important;
      min-height: 100% !important;
      min-height: 100dvh !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    #root {
      height: 100% !important;
      min-height: 100% !important;
      min-height: 100dvh !important;
      display: flex !important;
      flex-direction: column !important;
    }
    #root > div {
      flex: 1 !important;
      display: flex !important;
      flex-direction: column !important;
      min-height: 100% !important;
      min-height: 100dvh !important;
    }
    /* Fix tab bar - prevent shrinking */
    [role="tablist"] {
      flex-shrink: 0 !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Root layout - handles providers and auth navigation.
 */
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();

  const { isAuthenticated, isLoading, user, isNewUser, initialize } = useAuthStore();

  // Initialize auth on mount
  useEffect(() => {
    initialize();
  }, []);

  // Handle navigation based on auth state
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inCustomerGroup = segments[0] === '(customer)';
    const inDeliveryGroup = segments[0] === '(delivery)';
    const inAdminGroup = segments[0] === '(admin)';

    if (!isAuthenticated) {
      // Not authenticated - go to login
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
    } else if (isNewUser) {
      // Authenticated but needs to complete profile
      router.replace('/(auth)/complete-profile');
    } else if (user) {
      // Authenticated with complete profile - route by role
      if (inAuthGroup) {
        switch (user.role) {
          case UserRole.CUSTOMER:
            router.replace('/(customer)/home');
            break;
          case UserRole.DELIVERY:
            router.replace('/(delivery)/dashboard');
            break;
          case UserRole.ADMIN:
            router.replace('/(admin)/dashboard');
            break;
          default:
            router.replace('/(customer)/home');
        }
      }
    }
  }, [isAuthenticated, isLoading, isNewUser, user, segments]);

  const isWeb = Platform.OS === 'web';

  // Show loading screen while initializing
  if (isLoading) {
    if (isWeb) {
      return (
        <View style={styles.webWrapper}>
          <View style={[styles.webContent, styles.loadingContainer]}>
            <ActivityIndicator size="large" color={colors.primary[600]} />
          </View>
        </View>
      );
    }
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <GluestackUIProvider config={config} colorMode={colorScheme === 'dark' ? 'dark' : 'light'}>
          <StatusBar style={colorScheme === 'dark' ? 'dark' : 'dark'} />
          {isWeb ? (
            <View style={styles.webWrapper}>
              <View style={styles.webContent}>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                  }}
                >
                  <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                  <Stack.Screen name="(customer)" options={{ headerShown: false }} />
                  <Stack.Screen name="(delivery)" options={{ headerShown: false }} />
                  <Stack.Screen name="(admin)" options={{ headerShown: false }} />
                </Stack>
              </View>
            </View>
          ) : (
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(customer)" options={{ headerShown: false }} />
              <Stack.Screen name="(delivery)" options={{ headerShown: false }} />
              <Stack.Screen name="(admin)" options={{ headerShown: false }} />
            </Stack>
          )}
        </GluestackUIProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  webWrapper: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.gray[100],
  },
  webContent: {
    flex: 1,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    backgroundColor: colors.background.primary,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.gray[200],
    paddingBottom: 12,
    ...shadows.xl,
  },
});

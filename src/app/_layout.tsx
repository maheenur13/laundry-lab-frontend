import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme, View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { queryClient } from '../lib/queryClient';
import { useAuthStore } from '../stores/authStore';
import { RoleGuard } from '../components/common/RoleGuard';
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
 * Root layout with role-based route protection.
 * RoleGuard handles authentication and role-based redirects.
 */
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { initialize } = useAuthStore();

  // Initialize auth on mount
  useEffect(() => {
    initialize();
  }, []);

  const isWeb = Platform.OS === 'web';

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <GluestackUIProvider config={config} colorMode={colorScheme === 'dark' ? 'dark' : 'light'}>
          <StatusBar style={colorScheme === 'dark' ? 'dark' : 'dark'} />
          <RoleGuard>
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
          </RoleGuard>
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

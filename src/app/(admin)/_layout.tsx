import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  IconLayoutDashboard,
  IconPackage,
  IconCurrencyTaka,
  IconUser,
} from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { colors, fontSize } from '../../constants/theme';

/**
 * Admin tabs layout.
 */
export default function AdminLayout() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  // Calculate bottom padding based on platform and safe area
  const bottomPadding = Platform.OS === 'web' ? Math.max(insets.bottom, 0) : Math.max(insets.bottom, 8);
  const tabBarHeight = Platform.OS === 'web' ? 68 + bottomPadding : 49 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: {
          backgroundColor: colors.background.primary,
          borderTopWidth: 1,
          borderTopColor: colors.gray[100],
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
        },
        tabBarLabelStyle: {
          fontSize: fontSize.xs,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: t('admin.dashboard'),
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <IconLayoutDashboard size={24} color={color} strokeWidth={focused ? 2 : 1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: t('admin.allOrders'),
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color, focused }) => (
            <IconPackage size={24} color={color} strokeWidth={focused ? 2 : 1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="pricing"
        options={{
          title: t('admin.managePricing'),
          tabBarLabel: 'Pricing',
          tabBarIcon: ({ color, focused }) => (
            <IconCurrencyTaka size={24} color={color} strokeWidth={focused ? 2 : 1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile.profile'),
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <IconUser size={24} color={color} strokeWidth={focused ? 2 : 1.5} />
          ),
        }}
      />
      {/* Hidden screens */}
      <Tabs.Screen name="order-details" options={{ href: null }} />
    </Tabs>
  );
}

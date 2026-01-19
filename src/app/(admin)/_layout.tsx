import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
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
          // Extra padding on web for mobile browser safe area
          paddingBottom: Platform.OS === 'web' ? 20 : 8,
          height: Platform.OS === 'web' ? 75 : 65,
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

import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  IconHome,
  IconHanger,
  IconPackage,
  IconUser,
} from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { colors, fontSize } from '../../constants/theme';

/**
 * Customer tabs layout.
 */
export default function CustomerLayout() {
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
          shadowColor: 'transparent',
          // shadowOpacity: 0,
          boxShadow: 'none',
          backgroundColor: colors.background.primary,
          borderTopWidth: 1,
          borderTopColor: colors.gray[100],
          paddingTop: 8,
          marginBottom: bottomPadding,
          height: tabBarHeight,
        },
        tabBarLabelStyle: {
          fontSize: fontSize.xs,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('home.greeting', { name: '' }).replace(', !', ''),
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <IconHome size={24} color={color} strokeWidth={focused ? 2 : 1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: t('home.ourServices'),
          tabBarLabel: 'Services',
          tabBarIcon: ({ color, focused }) => (
            <IconHanger size={24} color={color} strokeWidth={focused ? 2 : 1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: t('orders.myOrders'),
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color, focused }) => (
            <IconPackage size={24} color={color} strokeWidth={focused ? 2 : 1.5} />
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
      <Tabs.Screen name="cart" options={{ href: null }} />
      <Tabs.Screen name="checkout" options={{ href: null }} />
      <Tabs.Screen name="order-details" options={{ href: null }} />
      <Tabs.Screen name="select-items" options={{ href: null }} />
    </Tabs>
  );
}

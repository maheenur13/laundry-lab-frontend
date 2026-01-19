import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  IconPackage,
  IconClock,
  IconCircleCheck,
  IconTruck,
  IconCurrencyTaka,
  IconTrendingUp,
} from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { Card, StatusBadge } from '../../components/ui';
import { useAuthStore } from '../../stores/authStore';
import { useAllOrders, useOrderStats, useUnassignedOrders } from '../../hooks';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../constants/theme';

/**
 * Admin dashboard screen - Professional design.
 */
export default function AdminDashboardScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: ordersData } = useAllOrders();
  const { data: stats } = useOrderStats();
  const { data: unassignedOrders } = useUnassignedOrders();

  const orders = ordersData?.orders || [];

  const statCards = [
    {
      icon: IconPackage,
      label: t('admin.totalOrders'),
      value: stats?.totalOrders || 0,
      color: colors.primary[600],
      bgColor: colors.primary[50],
    },
    {
      icon: IconClock,
      label: t('admin.pendingOrders'),
      value: stats?.pendingOrders || 0,
      color: colors.warning,
      bgColor: colors.warningLight,
    },
    {
      icon: IconTruck,
      label: 'In Progress',
      value: stats?.inProgressOrders || 0,
      color: colors.info,
      bgColor: colors.infoLight,
    },
    {
      icon: IconCircleCheck,
      label: t('admin.completedOrders'),
      value: stats?.completedOrders || 0,
      color: colors.success,
      bgColor: colors.successLight,
    },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {t('home.greeting', { name: user?.fullName?.split(' ')[0] || '' })} 👋
            </Text>
            <Text style={styles.subtitle}>{t('admin.dashboard')}</Text>
          </View>
        </View>

        {/* Revenue Card */}
        <View style={styles.revenueSection}>
          <Card style={styles.revenueCard}>
            <View style={styles.revenueHeader}>
              <View style={styles.revenueIconContainer}>
                <IconCurrencyTaka size={24} color="#FFFFFF" strokeWidth={1.5} />
              </View>
              <Text style={styles.revenueLabel}>{t('admin.todayRevenue')}</Text>
            </View>
            <Text style={styles.revenueValue}>
              ৳{stats?.todayRevenue?.toLocaleString() || 0}
            </Text>
            <View style={styles.revenueFooter}>
              <IconTrendingUp size={16} color="rgba(255,255,255,0.8)" strokeWidth={1.5} />
              <Text style={styles.revenueSubtext}>
                {stats?.todayOrders || 0} orders today
              </Text>
            </View>
          </Card>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {statCards.map((stat) => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: stat.bgColor }]}>
              <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                <stat.icon size={20} color={stat.color} strokeWidth={1.5} />
              </View>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Unassigned Orders */}
        {unassignedOrders && unassignedOrders.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Unassigned Orders ({unassignedOrders.length})
            </Text>
            {unassignedOrders.slice(0, 3).map((order) => (
              <Card
                key={order.id}
                style={[styles.orderCard, styles.unassignedOrderCard]}
                onPress={() =>
                  router.push({
                    pathname: '/(admin)/order-details',
                    params: { id: order.id },
                  })
                }
              >
                <View style={styles.orderHeader}>
                  <View style={styles.orderInfo}>
                    <View style={[styles.orderIconContainer, styles.unassignedIcon]}>
                      <IconPackage size={18} color={colors.warning} strokeWidth={1.5} />
                    </View>
                    <Text style={styles.orderId}>#{order.id.slice(-8)}</Text>
                  </View>
                  <StatusBadge status={order.status} size="sm" />
                </View>
                <View style={styles.orderDetails}>
                  <Text style={styles.orderItems}>
                    {order.items.length} item(s) • Needs assignment
                  </Text>
                  <Text style={styles.orderTotal}>
                    ৳{order.pricing.grandTotal}
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* Recent Orders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          {recentOrders.map((order) => (
            <Card
              key={order.id}
              style={styles.orderCard}
              onPress={() =>
                router.push({
                  pathname: '/(admin)/order-details',
                  params: { id: order.id },
                })
              }
            >
              <View style={styles.orderHeader}>
                <View style={styles.orderInfo}>
                  <View style={styles.orderIconContainer}>
                    <IconPackage size={18} color={colors.primary[600]} strokeWidth={1.5} />
                  </View>
                  <Text style={styles.orderId}>#{order.id.slice(-8)}</Text>
                </View>
                <StatusBadge status={order.status} size="sm" />
              </View>
              <View style={styles.orderDetails}>
                <Text style={styles.orderItems}>
                  {order.items.length} item(s)
                </Text>
                <Text style={styles.orderTotal}>
                  ৳{order.pricing.grandTotal}
                </Text>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  scrollContent: {
    paddingBottom: spacing['3xl'],
  },
  header: {
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing.lg,
    paddingBottom: spacing['2xl'],
    backgroundColor: colors.background.primary,
  },
  greeting: {
    fontSize: fontSize['2xl'],
    fontWeight: '700',
    color: colors.gray[900],
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.gray[500],
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  revenueSection: {
    paddingHorizontal: spacing['2xl'],
    marginTop: -spacing.lg,
  },
  revenueCard: {
    backgroundColor: colors.success,
    padding: spacing.xl,
    ...shadows.lg,
  },
  revenueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  revenueIconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  revenueLabel: {
    fontSize: fontSize.md,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  revenueValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: spacing.md,
    letterSpacing: -0.5,
  },
  revenueFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  revenueSubtext: {
    fontSize: fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
  statCard: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.xl,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: fontSize['2xl'],
    fontWeight: '700',
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.gray[600],
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['2xl'],
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: spacing.lg,
    letterSpacing: -0.2,
  },
  orderCard: {
    marginBottom: spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  orderIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderId: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.gray[900],
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  orderItems: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
    fontWeight: '500',
  },
  orderTotal: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.primary[600],
  },
  unassignedOrderCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  unassignedIcon: {
    backgroundColor: colors.warningLight,
  },
});

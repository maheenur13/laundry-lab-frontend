import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  IconPackage,
  IconTruck,
  IconClock,
  IconMapPin,
} from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { Card, StatusBadge } from '../../components/ui';
import { useAuthStore } from '../../stores/authStore';
import { useAssignedOrders } from '../../hooks';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../constants/theme';
import { OrderStatus } from '../../constants/orderStatus';

/**
 * Delivery dashboard screen - Professional design.
 */
export default function DeliveryDashboardScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: orders = [] } = useAssignedOrders();

  const pendingPickups = orders.filter(
    (o) => o.status === OrderStatus.REQUESTED,
  ).length;
  const inProgress = orders.filter(
    (o) =>
      o.status === OrderStatus.PICKED_UP ||
      o.status === OrderStatus.IN_LAUNDRY ||
      o.status === OrderStatus.OUT_FOR_DELIVERY,
  ).length;
  const todayDeliveries = orders.filter(
    (o) => o.status === OrderStatus.OUT_FOR_DELIVERY,
  ).length;

  const stats = [
    {
      icon: IconClock,
      label: 'Pending Pickups',
      value: pendingPickups,
      color: colors.warning,
      bgColor: colors.warningLight,
    },
    {
      icon: IconTruck,
      label: 'In Progress',
      value: inProgress,
      color: colors.info,
      bgColor: colors.infoLight,
    },
    {
      icon: IconPackage,
      label: 'Deliveries',
      value: todayDeliveries,
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
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>
              {t('home.greeting', { name: user?.fullName?.split(' ')[0] || '' })} 👋
            </Text>
            <Text style={styles.subtitle}>{t('delivery.dashboard')}</Text>
          </View>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <IconTruck size={22} color={colors.primary[600]} strokeWidth={1.5} />
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: stat.bgColor }]}>
              <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                <stat.icon size={22} color={stat.color} strokeWidth={1.5} />
              </View>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('delivery.assignedOrders')}</Text>
          {recentOrders.length === 0 ? (
            <Card style={styles.emptyCard}>
              <IconPackage size={40} color={colors.gray[300]} strokeWidth={1.5} />
              <Text style={styles.emptyText}>{t('delivery.noAssignedOrders')}</Text>
            </Card>
          ) : (
            recentOrders.map((order) => (
              <Card
                key={order.id}
                style={styles.orderCard}
                onPress={() =>
                  router.push({
                    pathname: '/(delivery)/order-details',
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
                <View style={styles.orderAddress}>
                  <IconMapPin size={14} color={colors.gray[400]} strokeWidth={1.5} />
                  <Text style={styles.orderAddressText} numberOfLines={1}>
                    {order.pickupAddress.fullAddress}
                  </Text>
                </View>
              </Card>
            ))
          )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing.lg,
    paddingBottom: spacing['2xl'],
    backgroundColor: colors.background.primary,
  },
  headerContent: {
    flex: 1,
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
  avatarContainer: {
    marginLeft: spacing.lg,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing.lg,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
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
    marginTop: 2,
    fontWeight: '500',
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
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
    gap: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.gray[500],
    fontWeight: '500',
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
  orderAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  orderAddressText: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
    flex: 1,
  },
});

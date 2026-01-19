import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { IconPackage, IconCalendar } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { Card, StatusBadge, LoadingState, EmptyState } from '../../components/ui';
import { useMyOrders } from '../../hooks';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { Order } from '../../types/order';

/**
 * Customer orders list screen - Professional design.
 */
export default function OrdersScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: orders = [], isLoading } = useMyOrders();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <Card
      style={styles.orderCard}
      onPress={() => router.push({
        pathname: '/(customer)/order-details',
        params: { id: item.id },
      })}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <View style={styles.orderIconContainer}>
            <IconPackage size={20} color={colors.primary[600]} strokeWidth={1.5} />
          </View>
          <View>
            <Text style={styles.orderId}>Order #{item.id.slice(-8)}</Text>
            <View style={styles.dateRow}>
              <IconCalendar size={14} color={colors.gray[400]} strokeWidth={1.5} />
              <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
            </View>
          </View>
        </View>
        <StatusBadge status={item.status} size="sm" />
      </View>
      <View style={styles.orderFooter}>
        <Text style={styles.orderItems}>
          {item.items.length} item(s)
        </Text>
        <Text style={styles.orderTotal}>৳{item.pricing.grandTotal}</Text>
      </View>
    </Card>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('orders.myOrders')}</Text>
        </View>
        <LoadingState />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('orders.myOrders')}</Text>
        <Text style={styles.subtitle}>{orders.length} order(s)</Text>
      </View>

      {orders.length === 0 ? (
        <EmptyState
          title={t('orders.noOrders')}
          description="Place your first order to see it here"
          actionLabel={t('home.orderNow')}
          onAction={() => router.push('/(customer)/services')}
        />
      ) : (
        <FlashList
          data={orders}
          renderItem={renderOrder}
          estimatedItemSize={120}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  header: {
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing.lg,
    paddingBottom: spacing['2xl'],
    backgroundColor: colors.background.primary,
  },
  title: {
    fontSize: fontSize['2xl'],
    fontWeight: '700',
    color: colors.gray[900],
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  listContent: {
    padding: spacing['2xl'],
  },
  orderCard: {
    marginBottom: spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  orderIconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderId: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[900],
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  orderDate: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
});

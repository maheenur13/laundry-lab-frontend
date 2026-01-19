import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { IconPackage } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { Card, StatusBadge, LoadingState, EmptyState } from '../../components/ui';
import { useAllOrders } from '../../hooks';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { Order } from '../../types/order';
import { OrderStatus } from '../../constants/orderStatus';

/**
 * Admin all orders screen - Professional design.
 */
export default function AdminOrdersScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | undefined>(undefined);

  const { data: ordersData, isLoading } = useAllOrders(selectedStatus);
  const orders = ordersData?.orders || [];

  const statusFilters = [
    { key: undefined, label: 'All' },
    { key: OrderStatus.REQUESTED, label: 'Pending' },
    { key: OrderStatus.PICKED_UP, label: 'Picked Up' },
    { key: OrderStatus.IN_LAUNDRY, label: 'In Laundry' },
    { key: OrderStatus.OUT_FOR_DELIVERY, label: 'Delivery' },
    { key: OrderStatus.DELIVERED, label: 'Completed' },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    });
  };

  const renderOrder = ({ item }: { item: Order }) => {
    const customer =
      typeof item.customer === 'object' ? item.customer : null;

    return (
      <Card
        style={styles.orderCard}
        onPress={() =>
          router.push({
            pathname: '/(admin)/order-details',
            params: { id: item.id },
          })
        }
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <View style={styles.orderIconContainer}>
              <IconPackage size={18} color={colors.primary[600]} strokeWidth={1.5} />
            </View>
            <Text style={styles.orderId}>#{item.id.slice(-8)}</Text>
          </View>
          <StatusBadge status={item.status} size="sm" />
        </View>
        {customer && (
          <Text style={styles.customerName}>{customer.fullName}</Text>
        )}
        <View style={styles.orderFooter}>
          <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
          <Text style={styles.orderTotal}>৳{item.pricing.grandTotal}</Text>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('admin.allOrders')}</Text>
        <Text style={styles.subtitle}>{orders.length} order(s)</Text>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <FlashList
          data={statusFilters}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.filterChip,
                selectedStatus === item.key && styles.filterChipActive,
              ]}
              onPress={() => setSelectedStatus(item.key)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedStatus === item.key && styles.filterChipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          )}
          contentContainerStyle={styles.filtersContent}
        />
      </View>

      {isLoading ? (
        <LoadingState />
      ) : orders.length === 0 ? (
        <EmptyState
          title="No orders found"
          description="Orders will appear here"
        />
      ) : (
        <FlashList
          data={orders}
          renderItem={renderOrder}
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
  filtersContainer: {
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
    height: 56,
  },
  filtersContent: {
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.md,
  },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
    marginRight: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.primary[600],
  },
  filterChipText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray[600],
  },
  filterChipTextActive: {
    color: '#FFFFFF',
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
    alignItems: 'center',
    marginBottom: spacing.sm,
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
  customerName: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    marginBottom: spacing.md,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  orderDate: {
    fontSize: fontSize.sm,
    color: colors.gray[400],
    fontWeight: '500',
  },
  orderTotal: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.primary[600],
  },
});

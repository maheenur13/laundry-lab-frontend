import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { IconPackage, IconMapPin, IconPhone } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { Card, StatusBadge, LoadingState, EmptyState } from '../../components/ui';
import { useAssignedOrders } from '../../hooks';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { Order } from '../../types/order';

/**
 * Delivery orders list screen - Professional design.
 */
export default function DeliveryOrdersScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: orders = [], isLoading } = useAssignedOrders();

  const renderOrder = ({ item }: { item: Order }) => {
    const customer = typeof item.customer === 'object' ? item.customer : null;

    return (
      <Card
        style={styles.orderCard}
        onPress={() =>
          router.push({
            pathname: '/(delivery)/order-details',
            params: { id: item.id },
          })
        }
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <View style={styles.orderIconContainer}>
              <IconPackage size={20} color={colors.primary[600]} strokeWidth={1.5} />
            </View>
            <Text style={styles.orderId}>#{item.id.slice(-8)}</Text>
          </View>
          <StatusBadge status={item.status} size="sm" />
        </View>

        {customer && (
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{customer.fullName}</Text>
            <View style={styles.contactRow}>
              <IconPhone size={14} color={colors.gray[400]} strokeWidth={1.5} />
              <Text style={styles.contactText}>{customer.phoneNumber}</Text>
            </View>
          </View>
        )}

        <View style={styles.addressRow}>
          <IconMapPin size={14} color={colors.gray[400]} strokeWidth={1.5} />
          <Text style={styles.addressText} numberOfLines={1}>
            {item.pickupAddress.fullAddress}
          </Text>
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.itemCount}>{item.items.length} item(s)</Text>
          <Text style={styles.orderTotal}>৳{item.pricing.grandTotal}</Text>
        </View>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('delivery.assignedOrders')}</Text>
        </View>
        <LoadingState />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('delivery.assignedOrders')}</Text>
        <Text style={styles.subtitle}>{orders.length} order(s)</Text>
      </View>

      {orders.length === 0 ? (
        <EmptyState
          title={t('delivery.noAssignedOrders')}
          description="You will see assigned orders here"
        />
      ) : (
        <FlashList
          data={orders}
          renderItem={renderOrder}
          estimatedItemSize={180}
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
    alignItems: 'center',
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
    fontWeight: '700',
    color: colors.gray[900],
  },
  customerInfo: {
    marginBottom: spacing.md,
  },
  customerName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[900],
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  contactText: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  addressText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.gray[500],
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  itemCount: {
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

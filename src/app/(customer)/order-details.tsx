import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  IconArrowLeft,
  IconMapPin,
  IconPhone,
  IconCircleCheck,
} from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { Card, StatusBadge, LoadingState } from '../../components/ui';
import { useOrder } from '../../hooks';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { ORDER_STATUS_CONFIG, OrderStatus } from '../../constants/orderStatus';
import { ServiceType } from '../../types/clothing';

/**
 * Order details screen - Professional design.
 */
export default function OrderDetailsScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: currentOrder, isLoading } = useOrder(id || '');
  const lang = i18n.language as 'en' | 'bn';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading || !currentOrder) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <IconArrowLeft size={24} color={colors.gray[800]} strokeWidth={1.5} />
          </Pressable>
          <Text style={styles.title}>{t('orders.orderDetails')}</Text>
          <View style={{ width: 44 }} />
        </View>
        <LoadingState />
      </SafeAreaView>
    );
  }

  const statusSteps = [
    OrderStatus.REQUESTED,
    OrderStatus.PICKED_UP,
    OrderStatus.IN_LAUNDRY,
    OrderStatus.OUT_FOR_DELIVERY,
    OrderStatus.DELIVERED,
  ];

  const currentStepIndex = statusSteps.indexOf(currentOrder.status);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <IconArrowLeft size={24} color={colors.gray[800]} strokeWidth={1.5} />
        </Pressable>
        <Text style={styles.title}>#{currentOrder.id.slice(-8)}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Status */}
        <Card style={styles.section}>
          <View style={styles.statusHeader}>
            <StatusBadge status={currentOrder.status} size="md" />
            <Text style={styles.orderDate}>
              {formatDate(currentOrder.createdAt)}
            </Text>
          </View>

          {/* Status timeline */}
          <View style={styles.timeline}>
            {statusSteps.map((status, index) => {
              const config = ORDER_STATUS_CONFIG[status];
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <View key={status} style={styles.timelineStep}>
                  <View style={styles.timelineIndicator}>
                    <View
                      style={[
                        styles.timelineDot,
                        isCompleted && { backgroundColor: config.color },
                        isCurrent && styles.timelineDotCurrent,
                      ]}
                    >
                      {isCompleted && (
                        <IconCircleCheck
                          size={16}
                          color="#FFFFFF"
                          strokeWidth={2}
                          style={{ margin: -2 }}
                        />
                      )}
                    </View>
                    {index < statusSteps.length - 1 && (
                      <View
                        style={[
                          styles.timelineLine,
                          isCompleted && { backgroundColor: config.color },
                        ]}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.timelineLabel,
                      isCompleted && { color: colors.gray[900] },
                      isCurrent && { fontWeight: '700' },
                    ]}
                  >
                    {config.label[lang]}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Items */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {currentOrder.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>
                  {item.clothingItemName} x{item.quantity}
                </Text>
                <View style={styles.servicesRow}>
                  {item.services.map((service) => (
                    <View key={service} style={styles.serviceBadge}>
                      <Text style={styles.serviceBadgeText}>
                        {service === ServiceType.WASHING
                          ? t('services.washing')
                          : t('services.ironing')}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
              <Text style={styles.itemPrice}>৳{item.subtotal}</Text>
            </View>
          ))}
        </Card>

        {/* Address */}
        <Card style={styles.section}>
          <View style={styles.addressHeader}>
            <View style={styles.addressIconContainer}>
              <IconMapPin size={20} color={colors.primary[600]} strokeWidth={1.5} />
            </View>
            <Text style={styles.sectionTitle}>{t('checkout.pickupAddress')}</Text>
          </View>
          <Text style={styles.addressText}>
            {currentOrder.pickupAddress.fullAddress}
          </Text>
          {currentOrder.pickupAddress.contactPhone && (
            <View style={styles.phoneRow}>
              <IconPhone size={14} color={colors.gray[400]} strokeWidth={1.5} />
              <Text style={styles.phoneText}>
                {currentOrder.pickupAddress.contactPhone}
              </Text>
            </View>
          )}
        </Card>

        {/* Pricing */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>{t('cart.itemTotal')}</Text>
            <Text style={styles.pricingValue}>
              ৳{currentOrder.pricing.itemsTotal}
            </Text>
          </View>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>{t('cart.deliveryCharge')}</Text>
            <Text style={styles.pricingValue}>
              ৳{currentOrder.pricing.deliveryCharge}
            </Text>
          </View>
          <View style={[styles.pricingRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>{t('cart.grandTotal')}</Text>
            <Text style={styles.totalValue}>
              ৳{currentOrder.pricing.grandTotal}
            </Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.gray[900],
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing['2xl'],
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: spacing.lg,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  orderDate: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
  },
  timeline: {
    paddingLeft: spacing.sm,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  timelineIndicator: {
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.gray[300],
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineDotCurrent: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: colors.primary[200],
  },
  timelineLine: {
    width: 2,
    height: 24,
    backgroundColor: colors.gray[200],
    marginTop: spacing.xs,
  },
  timelineLabel: {
    fontSize: fontSize.sm,
    color: colors.gray[400],
    paddingTop: 2,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[900],
  },
  servicesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  serviceBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.sm,
  },
  serviceBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.primary[700],
  },
  itemPrice: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.gray[800],
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  addressIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressText: {
    fontSize: fontSize.md,
    color: colors.gray[700],
    lineHeight: 22,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  phoneText: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  pricingLabel: {
    fontSize: fontSize.md,
    color: colors.gray[500],
  },
  pricingValue: {
    fontSize: fontSize.md,
    color: colors.gray[800],
    fontWeight: '500',
  },
  totalRow: {
    paddingTop: spacing.md,
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  totalLabel: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.gray[900],
  },
  totalValue: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.primary[600],
  },
});

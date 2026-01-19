import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  IconArrowLeft,
  IconMapPin,
  IconPhone,
  IconPackage,
  IconUser,
  IconTruck,
  IconUserPlus,
} from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { Card, StatusBadge, LoadingState, Button, AssignDeliveryModal } from '../../components/ui';
import { useOrder } from '../../hooks';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { ServiceType } from '../../types/clothing';

/**
 * Admin order details screen - Professional design.
 */
export default function AdminOrderDetailsScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showAssignModal, setShowAssignModal] = useState(false);

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

  const customer =
    typeof currentOrder.customer === 'object' ? currentOrder.customer : null;

  const deliveryPerson =
    typeof currentOrder.deliveryPerson === 'object' ? currentOrder.deliveryPerson : null;

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
          <View style={styles.statusRow}>
            <StatusBadge status={currentOrder.status} size="md" />
            <Text style={styles.orderDate}>
              {formatDate(currentOrder.createdAt)}
            </Text>
          </View>
        </Card>

        {/* Customer */}
        {customer && (
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <IconUser size={20} color={colors.primary[600]} strokeWidth={1.5} />
              </View>
              <Text style={styles.sectionTitle}>Customer</Text>
            </View>
            <Text style={styles.customerName}>{customer.fullName}</Text>
            <View style={styles.phoneRow}>
              <IconPhone size={14} color={colors.gray[400]} strokeWidth={1.5} />
              <Text style={styles.phoneText}>{customer.phoneNumber}</Text>
            </View>
          </Card>
        )}

        {/* Delivery Person */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <IconTruck size={20} color={colors.primary[600]} strokeWidth={1.5} />
            </View>
            <Text style={styles.sectionTitle}>Delivery Person</Text>
          </View>
          {deliveryPerson ? (
            <View>
              <Text style={styles.customerName}>{deliveryPerson.fullName}</Text>
              <View style={styles.phoneRow}>
                <IconPhone size={14} color={colors.gray[400]} strokeWidth={1.5} />
                <Text style={styles.phoneText}>{deliveryPerson.phoneNumber}</Text>
              </View>
              <Button
                title="Change Assignment"
                variant="outline"
                size="sm"
                onPress={() => setShowAssignModal(true)}
                style={styles.assignButton}
                icon={<IconUserPlus size={16} color={colors.primary[600]} strokeWidth={1.5} />}
              />
            </View>
          ) : (
            <View>
              <Text style={styles.unassignedText}>No delivery person assigned</Text>
              <Button
                title="Assign Delivery Person"
                variant="primary"
                size="sm"
                onPress={() => setShowAssignModal(true)}
                style={styles.assignButton}
                icon={<IconUserPlus size={16} color="#FFFFFF" strokeWidth={1.5} />}
              />
            </View>
          )}
        </Card>

        {/* Address */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <IconMapPin size={20} color={colors.primary[600]} strokeWidth={1.5} />
            </View>
            <Text style={styles.sectionTitle}>{t('checkout.pickupAddress')}</Text>
          </View>
          <Text style={styles.addressText}>
            {currentOrder.pickupAddress.fullAddress}
          </Text>
        </Card>

        {/* Items */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>
            Order Items ({currentOrder.items.length})
          </Text>
          {currentOrder.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <View style={styles.itemIconContainer}>
                  <IconPackage size={16} color={colors.gray[500]} strokeWidth={1.5} />
                </View>
                <View>
                  <Text style={styles.itemName}>
                    {item.clothingItemName}
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
              </View>
              <Text style={styles.itemPrice}>x{item.quantity}</Text>
            </View>
          ))}
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

        {/* Notes */}
        {currentOrder.notes && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{currentOrder.notes}</Text>
          </Card>
        )}
      </ScrollView>

      {/* Assignment Modal */}
      <AssignDeliveryModal
        visible={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        orderId={currentOrder.id}
        currentDeliveryPerson={currentOrder.deliveryPerson}
      />
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
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDate: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.gray[900],
  },
  customerName: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  phoneText: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  addressText: {
    fontSize: fontSize.md,
    color: colors.gray[700],
    lineHeight: 22,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  itemIconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[900],
  },
  servicesRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
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
    fontWeight: '600',
    color: colors.gray[600],
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
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
  notesText: {
    fontSize: fontSize.md,
    color: colors.gray[600],
    fontStyle: 'italic',
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  unassignedText: {
    fontSize: fontSize.md,
    color: colors.gray[500],
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  assignButton: {
    marginTop: spacing.md,
    alignSelf: 'flex-start',
  },
});

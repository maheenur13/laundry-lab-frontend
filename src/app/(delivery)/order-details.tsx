import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  IconArrowLeft,
  IconMapPin,
  IconPhone,
  IconPackage,
} from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { Card, Button, StatusBadge, LoadingState } from '../../components/ui';
import { useOrder, useUpdateOrderStatus } from '../../hooks';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../constants/theme';
import {
  ORDER_STATUS_CONFIG,
  getNextDeliveryStatus,
} from '../../constants/orderStatus';

/**
 * Delivery order details screen - Professional design.
 */
export default function DeliveryOrderDetailsScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Debug logging to check if ID is being received
  console.log('🔍 Order Details Debug:');
  console.log('- id from params:', id);
  console.log('- typeof id:', typeof id);
  console.log('- id length:', id?.length);

  const { data: currentOrder, isLoading, error } = useOrder(id || '');
  const updateStatusMutation = useUpdateOrderStatus();

  // Debug logging for order data
  console.log('- currentOrder:', currentOrder);
  console.log('- isLoading:', isLoading);
  console.log('- error:', error);

  const lang = i18n.language as 'en' | 'bn';

  const handleUpdateStatus = async () => {
    if (!currentOrder) return;

    const nextStatus = getNextDeliveryStatus(currentOrder.status);
    if (!nextStatus) {
      Alert.alert('Info', 'Order is already completed');
      return;
    }

    const statusLabel = ORDER_STATUS_CONFIG[nextStatus].label[lang];

    Alert.alert(
      t('delivery.updateStatus'),
      `Mark order as "${statusLabel}"?`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          onPress: () => {
            updateStatusMutation.mutate(
              { orderId: currentOrder.id, status: nextStatus },
              {
                onSuccess: () => {
                  Alert.alert('Success', 'Status updated successfully');
                },
                onError: (error) => {
                  Alert.alert(
                    'Error',
                    error instanceof Error
                      ? error.message
                      : 'Failed to update status',
                  );
                },
              },
            );
          },
        },
      ],
    );
  };

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
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
  const nextStatus = getNextDeliveryStatus(currentOrder.status);
  const nextStatusLabel = nextStatus
    ? ORDER_STATUS_CONFIG[nextStatus].label[lang]
    : null;

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
          <StatusBadge status={currentOrder.status} size="md" />
        </Card>

        {/* Customer Info */}
        {customer && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>{t('delivery.customerInfo')}</Text>
            <Text style={styles.customerName}>{customer.fullName}</Text>
            <Pressable
              style={styles.phoneButton}
              onPress={() => handleCall(customer.phoneNumber)}
            >
              <IconPhone size={18} color={colors.primary[600]} strokeWidth={1.5} />
              <Text style={styles.phoneText}>{customer.phoneNumber}</Text>
            </Pressable>
          </Card>
        )}

        {/* Pickup Address */}
        <Card style={styles.section}>
          <View style={styles.addressHeader}>
            <View style={styles.addressIconContainer}>
              <IconMapPin size={20} color={colors.primary[600]} strokeWidth={1.5} />
            </View>
            <Text style={styles.sectionTitle}>{t('delivery.pickupDetails')}</Text>
          </View>
          <Text style={styles.addressText}>
            {currentOrder.pickupAddress.fullAddress}
          </Text>
          {currentOrder.pickupAddress.landmark && (
            <Text style={styles.landmark}>
              Landmark: {currentOrder.pickupAddress.landmark}
            </Text>
          )}
        </Card>

        {/* Items */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>
            Order Items ({currentOrder.items.length})
          </Text>
          {currentOrder.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemIconContainer}>
                <IconPackage size={16} color={colors.gray[500]} strokeWidth={1.5} />
              </View>
              <Text style={styles.itemName}>
                {item.clothingItemName} x{item.quantity}
              </Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
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

      {/* Update Status Button */}
      {nextStatusLabel && (
        <View style={styles.bottomBar}>
          <Button
            title={`Mark as ${nextStatusLabel}`}
            onPress={handleUpdateStatus}
            loading={updateStatusMutation.isPending}
            fullWidth
            size="lg"
          />
        </View>
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
    marginBottom: spacing.md,
  },
  customerName: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary[50],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    alignSelf: 'flex-start',
  },
  phoneText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.primary[600],
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
  landmark: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
    marginTop: spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  itemIconContainer: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemName: {
    fontSize: fontSize.md,
    color: colors.gray[800],
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  totalLabel: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.gray[900],
  },
  totalValue: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.primary[600],
  },
  notesText: {
    fontSize: fontSize.md,
    color: colors.gray[600],
    fontStyle: 'italic',
    lineHeight: 22,
  },
  bottomBar: {
    padding: spacing['2xl'],
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    ...shadows.lg,
  },
});

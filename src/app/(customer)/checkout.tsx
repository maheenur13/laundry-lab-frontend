import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  IconArrowLeft,
  IconMapPin,
  IconFileText,
  IconCheck,
} from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { Card, Button, Input } from '../../components/ui';
import { useCartStore } from '../../stores/cartStore';
import { useCreateOrder } from '../../hooks';
import { useAuthStore } from '../../stores/authStore';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../constants/theme';

/**
 * Checkout screen - Professional design.
 */
export default function CheckoutScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { items, itemsTotal, deliveryCharge, grandTotal, clearCart } = useCartStore();
  const createOrderMutation = useCreateOrder();
  const { user } = useAuthStore();

  const [pickupAddress, setPickupAddress] = useState(user?.address || '');
  const [sameAsPickup, setSameAsPickup] = useState(true);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');

  const handlePlaceOrder = async () => {
    if (!pickupAddress.trim()) {
      Alert.alert('Error', 'Please enter a pickup address');
      return;
    }

    const orderData = {
      items: items.map((item) => ({
        clothingItemId: item.clothingItem.id,
        category: item.category,
        services: item.services,
        quantity: item.quantity,
      })),
      pickupAddress: {
        fullAddress: pickupAddress,
        contactPhone: user?.phoneNumber,
      },
      deliveryAddress: sameAsPickup
        ? undefined
        : { fullAddress: deliveryAddress },
      notes: notes || undefined,
    };

    createOrderMutation.mutate(orderData, {
      onSuccess: () => {
        clearCart();
        Alert.alert(
          t('checkout.orderSuccess'),
          'Your order has been placed successfully!',
          [
            {
              text: 'View Order',
              onPress: () => router.replace('/(customer)/orders'),
            },
          ],
        );
      },
      onError: (error) => {
        Alert.alert(
          'Error',
          error instanceof Error ? error.message : 'Failed to place order',
        );
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <IconArrowLeft size={24} color={colors.gray[800]} strokeWidth={1.5} />
        </Pressable>
        <Text style={styles.title}>{t('checkout.checkout')}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Pickup Address */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <IconMapPin size={20} color={colors.primary[600]} strokeWidth={1.5} />
            </View>
            <Text style={styles.sectionTitle}>{t('checkout.pickupAddress')}</Text>
          </View>
          <Input
            value={pickupAddress}
            onChangeText={setPickupAddress}
            placeholder="Enter your pickup address"
            multiline
            numberOfLines={3}
            containerStyle={styles.inputContainer}
          />
        </Card>

        {/* Delivery Address */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <IconMapPin size={20} color={colors.primary[600]} strokeWidth={1.5} />
            </View>
            <Text style={styles.sectionTitle}>{t('checkout.deliveryAddress')}</Text>
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>{t('checkout.sameAsPickup')}</Text>
            <Switch
              value={sameAsPickup}
              onValueChange={setSameAsPickup}
              trackColor={{ true: colors.primary[600], false: colors.gray[300] }}
              thumbColor="#FFFFFF"
            />
          </View>
          {!sameAsPickup && (
            <Input
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
              placeholder="Enter delivery address"
              multiline
              numberOfLines={3}
              containerStyle={styles.inputContainer}
            />
          )}
        </Card>

        {/* Notes */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <IconFileText size={20} color={colors.primary[600]} strokeWidth={1.5} />
            </View>
            <Text style={styles.sectionTitle}>{t('checkout.addNote')}</Text>
          </View>
          <Input
            value={notes}
            onChangeText={setNotes}
            placeholder="Any special instructions?"
            multiline
            numberOfLines={2}
            containerStyle={styles.inputContainer}
          />
        </Card>

        {/* Order Summary */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryItems}>
            {items.map((item) => (
              <View key={item.id} style={styles.summaryItem}>
                <View style={styles.summaryItemInfo}>
                  <IconCheck size={14} color={colors.success} strokeWidth={2} />
                  <Text style={styles.summaryItemName}>
                    {item.clothingItem.name.en} x{item.quantity}
                  </Text>
                </View>
                <Text style={styles.summaryItemPrice}>
                  ৳{item.unitPrice * item.quantity}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('cart.itemTotal')}</Text>
            <Text style={styles.summaryValue}>৳{itemsTotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('cart.deliveryCharge')}</Text>
            <Text style={styles.summaryValue}>৳{deliveryCharge}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>{t('cart.grandTotal')}</Text>
            <Text style={styles.totalValue}>৳{grandTotal}</Text>
          </View>
        </Card>
      </ScrollView>

      {/* Place Order */}
      <View style={styles.bottomBar}>
        <View style={styles.totalInfo}>
          <Text style={styles.bottomLabel}>Total Amount</Text>
          <Text style={styles.bottomTotal}>৳{grandTotal}</Text>
        </View>
        <Button
          title={t('checkout.placeOrder')}
          onPress={handlePlaceOrder}
          loading={createOrderMutation.isPending}
          size="lg"
        />
      </View>
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
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
  inputContainer: {
    marginBottom: 0,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
  },
  switchLabel: {
    fontSize: fontSize.md,
    color: colors.gray[700],
    fontWeight: '500',
  },
  summaryItems: {
    marginTop: spacing.md,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  summaryItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  summaryItemName: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  summaryItemPrice: {
    fontSize: fontSize.sm,
    color: colors.gray[800],
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: fontSize.md,
    color: colors.gray[500],
  },
  summaryValue: {
    fontSize: fontSize.md,
    color: colors.gray[800],
    fontWeight: '500',
  },
  totalRow: {
    paddingTop: spacing.md,
    marginTop: spacing.sm,
    marginBottom: 0,
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
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing['2xl'],
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    ...shadows.lg,
  },
  totalInfo: {},
  bottomLabel: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
    fontWeight: '500',
  },
  bottomTotal: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.gray[900],
  },
});

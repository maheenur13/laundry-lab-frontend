import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  IconArrowLeft,
  IconMinus,
  IconPlus,
  IconTrash,
  IconShoppingBag,
} from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { Card, Button, EmptyState } from '../../components/ui';
import { useCartStore } from '../../stores/cartStore';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../constants/theme';
import { ServiceType } from '../../types/clothing';

/**
 * Cart screen - Professional design.
 */
export default function CartScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const {
    items,
    itemsTotal,
    deliveryCharge,
    grandTotal,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCartStore();

  const lang = i18n.language as 'en' | 'bn';

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <IconArrowLeft size={24} color={colors.gray[800]} strokeWidth={1.5} />
          </Pressable>
          <Text style={styles.title}>{t('cart.cart')}</Text>
          <View style={{ width: 44 }} />
        </View>
        <EmptyState
          icon={<IconShoppingBag size={56} color={colors.gray[300]} strokeWidth={1.5} />}
          title={t('cart.emptyCart')}
          description={t('cart.startShopping')}
          actionLabel={t('home.orderNow')}
          onAction={() => router.push('/(customer)/services')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <IconArrowLeft size={24} color={colors.gray[800]} strokeWidth={1.5} />
        </Pressable>
        <Text style={styles.title}>{t('cart.cart')}</Text>
        <Pressable style={styles.clearButton} onPress={clearCart}>
          <IconTrash size={20} color={colors.error} strokeWidth={1.5} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cart items */}
        {items.map((item) => (
          <Card key={item.id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <View>
                <Text style={styles.itemName}>
                  {item.clothingItem.name[lang]}
                </Text>
                <Text style={styles.itemCategory}>
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </Text>
              </View>
              <Pressable
                style={styles.deleteButton}
                onPress={() => removeItem(item.id)}
              >
                <IconTrash size={18} color={colors.error} strokeWidth={1.5} />
              </Pressable>
            </View>

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

            <View style={styles.itemFooter}>
              <View style={styles.quantityControls}>
                <Pressable
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <IconMinus size={14} color={colors.gray[600]} strokeWidth={2} />
                </Pressable>
                <Text style={styles.quantityValue}>{item.quantity}</Text>
                <Pressable
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <IconPlus size={14} color={colors.gray[600]} strokeWidth={2} />
                </Pressable>
              </View>
              <Text style={styles.itemPrice}>
                ৳{item.unitPrice * item.quantity}
              </Text>
            </View>
          </Card>
        ))}

        {/* Pricing summary */}
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
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

      {/* Checkout button */}
      <View style={styles.bottomBar}>
        <View style={styles.totalInfo}>
          <Text style={styles.bottomLabel}>Total</Text>
          <Text style={styles.bottomTotal}>৳{grandTotal}</Text>
        </View>
        <Button
          title={t('cart.checkout')}
          onPress={() => router.push('/(customer)/checkout')}
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
  clearButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.errorLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing['2xl'],
  },
  itemCard: {
    marginBottom: spacing.md,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  itemName: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.gray[900],
  },
  itemCategory: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
    marginTop: 2,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.errorLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  servicesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  serviceBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.md,
  },
  serviceBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.primary[700],
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityValue: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.gray[900],
    minWidth: 24,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.gray[900],
  },
  summaryCard: {
    marginTop: spacing.md,
  },
  summaryTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: spacing.lg,
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

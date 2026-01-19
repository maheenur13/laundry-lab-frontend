import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  IconArrowLeft,
  IconMinus,
  IconPlus,
  IconShoppingCart,
  IconSparkles,
  IconIroning3,
  IconCheck,
  IconMan,
  IconWoman,
  IconMoodKid,
} from '@tabler/icons-react-native';
import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import { Button, LoadingState, EmptyState } from '../../components/ui';
import { useClothingItems, useGetPrice } from '../../hooks';
import { useCartStore } from '../../stores/cartStore';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../constants/theme';
import { ClothingItem, ClothingCategory, ServiceType } from '../../types/clothing';

export default function SelectItemsScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category: ClothingCategory }>();

  const { data: clothingItems = [], isLoading } = useClothingItems(category);
  const getPrice = useGetPrice();
  const { addItem, itemCount } = useCartStore();

  const [selectedItems, setSelectedItems] = useState<Record<string, {
    quantity: number;
    services: ServiceType[];
  }>>({});

  const lang = i18n.language as 'en' | 'bn';
  const filteredItems = clothingItems.filter((item) => item.category === category);

  const getCategoryInfo = () => {
    switch (category) {
      case ClothingCategory.MEN:
        return { label: t('categories.men'), icon: IconMan, color: '#0D9488', bgColor: '#F0FDFA' };
      case ClothingCategory.WOMEN:
        return { label: t('categories.women'), icon: IconWoman, color: '#DB2777', bgColor: '#FDF2F8' };
      case ClothingCategory.CHILDREN:
        return { label: t('categories.children'), icon: IconMoodKid, color: '#D97706', bgColor: '#FFFBEB' };
      default:
        return { label: '', icon: IconMan, color: colors.primary[600], bgColor: colors.primary[50] };
    }
  };

  const categoryInfo = getCategoryInfo();
  const CategoryIcon = categoryInfo.icon;

  const toggleService = (itemId: string, service: ServiceType) => {
    setSelectedItems((prev) => {
      const item = prev[itemId] || { quantity: 1, services: [] };
      const services = item.services.includes(service)
        ? item.services.filter((s) => s !== service)
        : [...item.services, service];

      if (services.length === 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }

      return { ...prev, [itemId]: { ...item, services } };
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setSelectedItems((prev) => {
      const item = prev[itemId];
      if (!item) return prev;
      const quantity = Math.max(1, item.quantity + delta);
      return { ...prev, [itemId]: { ...item, quantity } };
    });
  };

  const getItemPrice = (item: ClothingItem, services: ServiceType[]) => {
    return services.reduce((sum, service) => {
      return sum + getPrice(item.id, service, category as ClothingCategory);
    }, 0);
  };

  const handleAddToCart = () => {
    Object.entries(selectedItems).forEach(([itemId, { quantity, services }]) => {
      const item = clothingItems.find((i) => i.id === itemId);
      if (item && services.length > 0) {
        const unitPrice = getItemPrice(item, services);
        addItem({
          clothingItem: item,
          category: category as ClothingCategory,
          services,
          quantity,
          unitPrice,
        });
      }
    });
    router.push('/(customer)/cart');
  };

  const selectedCount = Object.keys(selectedItems).length;
  const totalItems = Object.values(selectedItems).reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = Object.entries(selectedItems).reduce((sum, [itemId, { quantity, services }]) => {
    const item = clothingItems.find((i) => i.id === itemId);
    if (!item) return sum;
    return sum + getItemPrice(item, services) * quantity;
  }, 0);

  const renderItem = ({ item }: { item: ClothingItem }) => {
    const selected = selectedItems[item.id];
    const isSelected = !!selected;
    const itemTotal = isSelected ? getItemPrice(item, selected.services) * selected.quantity : 0;

    return (
      <View style={[styles.itemCard, isSelected && styles.itemCardSelected]}>
        {/* Item Header */}
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.name[lang]}</Text>
          {isSelected && (
            <View style={styles.itemTotalBadge}>
              <Text style={styles.itemTotalText}>৳{itemTotal}</Text>
            </View>
          )}
        </View>

        {/* Services */}
        <View style={styles.servicesRow}>
          {item.availableServices.map((service) => {
            const price = getPrice(item.id, service, category as ClothingCategory);
            const isServiceSelected = selected?.services.includes(service);
            const isWashing = service === ServiceType.WASHING;

            return (
              <Pressable
                key={service}
                style={[
                  styles.serviceBtn,
                  isServiceSelected && (isWashing ? styles.serviceBtnWashing : styles.serviceBtnIroning),
                ]}
                onPress={() => toggleService(item.id, service)}
              >
                {isWashing ? (
                  <IconSparkles size={16} color={isServiceSelected ? '#FFF' : colors.primary[600]} strokeWidth={1.5} />
                ) : (
                  <IconIroning3 size={16} color={isServiceSelected ? '#FFF' : '#8B5CF6'} strokeWidth={1.5} />
                )}
                <Text style={[styles.serviceBtnText, isServiceSelected && styles.serviceBtnTextSelected]}>
                  {isWashing ? t('services.washing') : t('services.ironing')}
                </Text>
                <Text style={[styles.serviceBtnPrice, isServiceSelected && styles.serviceBtnPriceSelected]}>
                  ৳{price}
                </Text>
                {isServiceSelected && (
                  <IconCheck size={14} color="#FFF" strokeWidth={2.5} />
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Quantity */}
        {isSelected && (
          <View style={styles.quantityRow}>
            <Text style={styles.qtyLabel}>Qty</Text>
            <View style={styles.qtyControls}>
              <Pressable
                style={[styles.qtyBtn, selected.quantity <= 1 && styles.qtyBtnDisabled]}
                onPress={() => updateQuantity(item.id, -1)}
                disabled={selected.quantity <= 1}
              >
                <IconMinus size={16} color={selected.quantity <= 1 ? colors.gray[300] : colors.gray[700]} strokeWidth={2} />
              </Pressable>
              <Text style={styles.qtyValue}>{selected.quantity}</Text>
              <Pressable style={styles.qtyBtn} onPress={() => updateQuantity(item.id, 1)}>
                <IconPlus size={16} color={colors.gray[700]} strokeWidth={2} />
              </Pressable>
            </View>
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <IconArrowLeft size={22} color={colors.gray[800]} strokeWidth={1.5} />
          </Pressable>
          <Text style={styles.headerTitle}>{categoryInfo.label}</Text>
          <View style={{ width: 40 }} />
        </View>
        <LoadingState />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconArrowLeft size={22} color={colors.gray[800]} strokeWidth={1.5} />
        </Pressable>
        <View style={styles.headerCenter}>
          <View style={[styles.headerIconContainer, { backgroundColor: categoryInfo.bgColor }]}>
            <CategoryIcon size={18} color={categoryInfo.color} strokeWidth={1.5} />
          </View>
          <Text style={styles.headerTitle}>{categoryInfo.label}</Text>
          <Text style={styles.headerCount}>({filteredItems.length})</Text>
        </View>
        <Pressable style={styles.cartBtn} onPress={() => router.push('/(customer)/cart')}>
          <IconShoppingCart size={20} color={colors.gray[800]} strokeWidth={1.5} />
          {itemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{itemCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Items list */}
      {filteredItems.length === 0 ? (
        <EmptyState title="No items available" description="Items will appear here" />
      ) : (
        <FlashList
          data={filteredItems}
          renderItem={renderItem}
          estimatedItemSize={140}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Bottom bar */}
      {selectedCount > 0 && (
        <View style={styles.bottomBar}>
          <View style={styles.bottomLeft}>
            <Text style={styles.bottomCount}>{totalItems} items</Text>
            <Text style={styles.bottomTotal}>৳{totalAmount}</Text>
          </View>
          <Button
            title={t('cart.addToCart')}
            onPress={handleAddToCart}
            icon={<IconShoppingCart size={18} color="#FFFFFF" strokeWidth={2} />}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerIconContainer: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.gray[900],
  },
  headerCount: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
  },
  cartBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.primary[600],
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing['4xl'],
  },
  itemCard: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.gray[200],
  },
  itemCardSelected: {
    borderColor: colors.primary[500],
    backgroundColor: '#F0FDFA',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  itemName: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.gray[900],
    flex: 1,
  },
  itemTotalBadge: {
    backgroundColor: colors.primary[600],
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.md,
  },
  itemTotalText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  servicesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  serviceBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.gray[200],
    backgroundColor: colors.gray[50],
    gap: 4,
  },
  serviceBtnWashing: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[600],
  },
  serviceBtnIroning: {
    borderColor: '#8B5CF6',
    backgroundColor: '#8B5CF6',
  },
  serviceBtnText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.gray[700],
  },
  serviceBtnTextSelected: {
    color: '#FFFFFF',
  },
  serviceBtnPrice: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.gray[800],
  },
  serviceBtnPriceSelected: {
    color: '#FFFFFF',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  qtyLabel: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    fontWeight: '500',
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnDisabled: {
    backgroundColor: colors.gray[50],
  },
  qtyValue: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.gray[900],
    minWidth: 24,
    textAlign: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    ...shadows.md,
  },
  bottomLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  bottomCount: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
    fontWeight: '500',
  },
  bottomTotal: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.primary[600],
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSparkles, IconIroning3 } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui';
import { useClothingItems, usePricing, useGetPrice } from '../../hooks';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { ClothingCategory, ServiceType, ClothingItem } from '../../types/clothing';

/**
 * Admin pricing screen - Professional design.
 */
export default function AdminPricingScreen() {
  const { t, i18n } = useTranslation();
  const { data: clothingItems = [] } = useClothingItems();
  const { data: pricing = [] } = usePricing();
  const getPrice = useGetPrice();

  const lang = i18n.language as 'en' | 'bn';

  const groupedItems = clothingItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<ClothingCategory, ClothingItem[]>);

  const sections = Object.entries(groupedItems).map(([category, items]) => ({
    title: t(`categories.${category}`),
    data: items,
    category: category as ClothingCategory,
  }));

  const renderItem = ({ item, section }: { item: ClothingItem; section: typeof sections[0] }) => {
    const washPrice = getPrice(item.id, ServiceType.WASHING, section.category);
    const ironPrice = getPrice(item.id, ServiceType.IRONING, section.category);

    return (
      <Card style={styles.itemCard}>
        <Text style={styles.itemName}>{item.name[lang]}</Text>
        <View style={styles.pricesRow}>
          {item.availableServices.includes(ServiceType.WASHING) && (
            <View style={styles.priceTag}>
              <View style={[styles.priceIcon, { backgroundColor: colors.primary[50] }]}>
                <IconSparkles size={14} color={colors.primary[600]} strokeWidth={1.5} />
              </View>
              <Text style={styles.priceValue}>৳{washPrice}</Text>
            </View>
          )}
          {item.availableServices.includes(ServiceType.IRONING) && (
            <View style={styles.priceTag}>
              <View style={[styles.priceIcon, { backgroundColor: '#F3E8FF' }]}>
                <IconIroning3 size={14} color="#8B5CF6" strokeWidth={1.5} />
              </View>
              <Text style={styles.priceValue}>৳{ironPrice}</Text>
            </View>
          )}
        </View>
      </Card>
    );
  };

  const renderSectionHeader = ({ section }: { section: typeof sections[0] }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionBadge}>
        <Text style={styles.sectionBadgeText}>{section.data.length} items</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('admin.pricing')}</Text>
        <Text style={styles.subtitle}>Manage your service prices</Text>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendIcon, { backgroundColor: colors.primary[50] }]}>
            <IconSparkles size={14} color={colors.primary[600]} strokeWidth={1.5} />
          </View>
          <Text style={styles.legendText}>{t('services.washing')}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendIcon, { backgroundColor: '#F3E8FF' }]}>
            <IconIroning3 size={14} color="#8B5CF6" strokeWidth={1.5} />
          </View>
          <Text style={styles.legendText}>{t('services.ironing')}</Text>
        </View>
      </View>

      <SectionList
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
  legend: {
    flexDirection: 'row',
    gap: spacing.xl,
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.lg,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legendIcon: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legendText: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    fontWeight: '500',
  },
  listContent: {
    padding: spacing['2xl'],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.gray[900],
    letterSpacing: -0.2,
  },
  sectionBadge: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  sectionBadgeText: {
    fontSize: fontSize.xs,
    color: colors.gray[600],
    fontWeight: '600',
  },
  itemCard: {
    marginBottom: spacing.sm,
  },
  itemName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  pricesRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.gray[50],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  priceIcon: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceValue: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.gray[800],
  },
});

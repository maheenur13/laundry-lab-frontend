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
  IconSparkles,
  IconIroning3,
  IconChevronRight,
  IconHanger,
  IconMan,
  IconWoman,
  IconMoodKid,
} from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../constants/theme';
import { ClothingCategory } from '../../types/clothing';

/**
 * Services selection screen - Professional design.
 */
export default function ServicesScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const categories = [
    {
      id: ClothingCategory.MEN,
      label: t('categories.men'),
      icon: IconMan,
      description: 'Shirts, Pants, Suits, Panjabi & more',
      color: '#0D9488',
      bgColor: '#F0FDFA',
      items: '15+ items',
    },
    {
      id: ClothingCategory.WOMEN,
      label: t('categories.women'),
      icon: IconWoman,
      description: 'Shirts, Pants, Kameez, Saree & more',
      color: '#DB2777',
      bgColor: '#FDF2F8',
      items: '20+ items',
    },
    {
      id: ClothingCategory.CHILDREN,
      label: t('categories.children'),
      icon: IconMoodKid,
      description: 'Shirts, Pants, Dresses & more',
      color: '#D97706',
      bgColor: '#FFFBEB',
      items: '10+ items',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <IconHanger size={28} color={colors.primary[600]} strokeWidth={1.5} />
          </View>
          <Text style={styles.title}>{t('home.ourServices')}</Text>
          <Text style={styles.subtitle}>
            Select a category to add items to your order
          </Text>
        </View>

        {/* Service info cards */}
        <View style={styles.serviceInfo}>
          <View style={[styles.serviceCard, { backgroundColor: colors.primary[50] }]}>
            <View style={[styles.serviceIconContainer, { backgroundColor: colors.primary[100] }]}>
              <IconSparkles size={22} color={colors.primary[600]} strokeWidth={1.5} />
            </View>
            <View style={styles.serviceTextContainer}>
              <Text style={styles.serviceName}>{t('services.washing')}</Text>
              <Text style={styles.serviceDesc}>Deep clean & fresh</Text>
            </View>
          </View>
          <View style={[styles.serviceCard, { backgroundColor: '#F3E8FF' }]}>
            <View style={[styles.serviceIconContainer, { backgroundColor: '#E9D5FF' }]}>
              <IconIroning3 size={22} color="#8B5CF6" strokeWidth={1.5} />
            </View>
            <View style={styles.serviceTextContainer}>
              <Text style={styles.serviceName}>{t('services.ironing')}</Text>
              <Text style={styles.serviceDesc}>Crisp & wrinkle-free</Text>
            </View>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Choose Category</Text>
          
          {categories.map((category) => (
            <Pressable
              key={category.id}
              style={({ pressed }) => [
                styles.categoryCard,
                { borderColor: category.color + '30' },
                pressed && styles.categoryCardPressed,
              ]}
              onPress={() => router.push({
                pathname: '/(customer)/select-items',
                params: { category: category.id },
              })}
            >
              {/* Icon Container */}
              <View style={[styles.categoryIconWrapper, { backgroundColor: category.bgColor }]}>
                <category.icon size={32} color={category.color} strokeWidth={1.5} />
              </View>

              {/* Content */}
              <View style={styles.categoryContent}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryLabel}>{category.label}</Text>
                  <View style={[styles.itemsBadge, { backgroundColor: category.bgColor }]}>
                    <Text style={[styles.itemsBadgeText, { color: category.color }]}>
                      {category.items}
                    </Text>
                  </View>
                </View>
                <Text style={styles.categoryDescription}>{category.description}</Text>
              </View>

              {/* Arrow */}
              <View style={[styles.categoryArrow, { backgroundColor: category.bgColor }]}>
                <IconChevronRight size={18} color={category.color} strokeWidth={2.5} />
              </View>
            </Pressable>
          ))}
        </View>

        {/* Bottom info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            💡 You can select multiple items and services
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  scrollContent: {
    paddingBottom: spacing['4xl'],
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['2xl'],
    paddingBottom: spacing['3xl'],
    backgroundColor: colors.background.primary,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize['2xl'],
    fontWeight: '700',
    color: colors.gray[900],
    letterSpacing: -0.3,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.gray[500],
    textAlign: 'center',
  },
  serviceInfo: {
    flexDirection: 'row',
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.xl,
    gap: spacing.md,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  serviceCard: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    gap: spacing.md,
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceTextContainer: {
    alignItems: 'center',
  },
  serviceName: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.gray[900],
    textAlign: 'center',
  },
  serviceDesc: {
    fontSize: fontSize.xs,
    color: colors.gray[500],
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  categoriesSection: {
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['2xl'],
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: spacing.lg,
    letterSpacing: -0.2,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius['2xl'],
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    ...shadows.md,
  },
  categoryCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  categoryIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  categoryContent: {
    flex: 1,
    marginRight: spacing.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  categoryLabel: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.gray[900],
  },
  itemsBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  itemsBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  categoryDescription: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
    lineHeight: 20,
  },
  categoryArrow: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoSection: {
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing.xl,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
    textAlign: 'center',
    backgroundColor: colors.gray[50],
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  IconSparkles,
  IconIroning3,
  IconPackage,
  IconChevronRight,
  IconUser,
  IconTruck,
  IconMan,
  IconWoman,
  IconMoodKid,
} from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { Card, StatusBadge } from '../../components/ui';
import { useAuthStore } from '../../stores/authStore';
import { useMyOrders, useSeedCatalog, usePrefetchCatalog } from '../../hooks';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../constants/theme';
import { ClothingCategory } from '../../types/clothing';

/**
 * Customer home screen - Professional dashboard design.
 */
export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuthStore();

  // Use TanStack Query for data fetching
  const { data: orders = [] } = useMyOrders();
  const seedCatalogMutation = useSeedCatalog();
  const prefetchCatalog = usePrefetchCatalog();

  // Prefetch catalog data on mount
  React.useEffect(() => {
    prefetchCatalog();
  }, []);

  const categories = [
    { id: ClothingCategory.MEN, label: t('categories.men'), icon: IconMan, color: '#0D9488', bgColor: '#F0FDFA' },
    { id: ClothingCategory.WOMEN, label: t('categories.women'), icon: IconWoman, color: '#DB2777', bgColor: '#FDF2F8' },
    { id: ClothingCategory.CHILDREN, label: t('categories.children'), icon: IconMoodKid, color: '#D97706', bgColor: '#FFFBEB' },
  ];

  const services = [
    { id: 'washing', label: t('services.washing'), icon: IconSparkles, color: colors.primary[500], bgColor: colors.primary[50] },
    { id: 'ironing', label: t('services.ironing'), icon: IconIroning3, color: '#8B5CF6', bgColor: '#F3E8FF' },
  ];

  const recentOrders = orders.slice(0, 3);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>
              {t('home.greeting', { name: user?.fullName?.split(' ')[0] || '' })} 👋
            </Text>
            <Text style={styles.subtitle}>{t('home.whatService')}</Text>
          </View>
          <Pressable
            style={styles.avatar}
            onPress={() => router.push('/(customer)/profile')}
          >
            <IconUser size={22} color={colors.primary[600]} strokeWidth={1.5} />
          </Pressable>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.primary[50] }]}>
            <IconPackage size={22} color={colors.primary[600]} strokeWidth={1.5} />
            <Text style={styles.statValue}>{orders.length}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.secondary[50] }]}>
            <IconTruck size={22} color={colors.secondary[600]} strokeWidth={1.5} />
            <Text style={styles.statValue}>
              {orders.filter(o => o.status !== 'delivered').length}
            </Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.ourServices')}</Text>
          <View style={styles.servicesGrid}>
            {services.map((service) => (
              <Pressable
                key={service.id}
                style={({ pressed }) => [
                  styles.serviceCard,
                  pressed && styles.serviceCardPressed,
                ]}
                onPress={() => router.push('/(customer)/services')}
              >
                <View style={[styles.serviceIconContainer, { backgroundColor: service.bgColor }]}>
                  <service.icon size={28} color={service.color} strokeWidth={1.5} />
                </View>
                <Text style={styles.serviceLabel}>{service.label}</Text>
                <Text style={styles.serviceSubtext}>Professional care</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.categories')}</Text>
          <View style={styles.categoriesRow}>
            {categories.map((category) => (
              <Pressable
                key={category.id}
                style={({ pressed }) => [
                  styles.categoryCard,
                  pressed && styles.categoryCardPressed,
                ]}
                onPress={() => router.push({
                  pathname: '/(customer)/select-items',
                  params: { category: category.id },
                })}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.bgColor }]}>
                  <category.icon size={28} color={category.color} strokeWidth={1.5} />
                </View>
                <Text style={styles.categoryLabel}>{category.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('home.recentOrders')}</Text>
              <Pressable
                style={styles.viewAllButton}
                onPress={() => router.push('/(customer)/orders')}
              >
                <Text style={styles.viewAll}>{t('home.viewAll')}</Text>
                <IconChevronRight size={16} color={colors.primary[600]} strokeWidth={2} />
              </Pressable>
            </View>
            {recentOrders.map((order) => (
              <Card
                key={order.id}
                style={styles.orderCard}
                onPress={() => router.push({
                  pathname: '/(customer)/order-details',
                  params: { id: order.id },
                })}
              >
                <View style={styles.orderHeader}>
                  <View style={styles.orderInfo}>
                    <View style={styles.orderIconContainer}>
                      <IconPackage size={18} color={colors.gray[500]} strokeWidth={1.5} />
                    </View>
                    <View>
                      <Text style={styles.orderId}>#{order.id.slice(-8)}</Text>
                      <Text style={styles.orderItems}>
                        {order.items.length} item(s) • ৳{order.pricing.grandTotal}
                      </Text>
                    </View>
                  </View>
                  <StatusBadge status={order.status} size="sm" />
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* Order Now CTA */}
        <Pressable
          style={({ pressed }) => [
            styles.ctaCard,
            pressed && styles.ctaCardPressed,
          ]}
          onPress={() => router.push('/(customer)/services')}
        >
          <View style={styles.ctaContent}>
            <Text style={styles.ctaTitle}>{t('home.orderNow')}</Text>
            <Text style={styles.ctaSubtitle}>
              Fresh and clean clothes delivered to your door
            </Text>
          </View>
          <View style={styles.ctaButton}>
            <IconChevronRight size={24} color="#FFFFFF" strokeWidth={2} />
          </View>
        </Pressable>

        {/* Dev: Seed data button */}
        {__DEV__ && (
          <TouchableOpacity
            style={styles.devButton}
            onPress={() => seedCatalogMutation.mutate()}
          >
            <Text style={styles.devButtonText}>
              {seedCatalogMutation.isPending ? 'Seeding...' : 'Seed Catalog Data (Dev)'}
            </Text>
          </TouchableOpacity>
        )}
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
    paddingBottom: spacing['3xl'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing.lg,
    paddingBottom: spacing['2xl'],
    backgroundColor: colors.background.primary,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: fontSize['2xl'],
    fontWeight: '700',
    color: colors.gray[900],
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.gray[500],
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing['2xl'],
    marginTop: -spacing.lg,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    ...shadows.md,
  },
  statValue: {
    fontSize: fontSize['2xl'],
    fontWeight: '700',
    color: colors.gray[900],
    marginTop: spacing.sm,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.gray[500],
    fontWeight: '500',
    marginTop: spacing.xs,
  },
  section: {
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['2xl'],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.gray[900],
    letterSpacing: -0.2,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  viewAll: {
    fontSize: fontSize.sm,
    color: colors.primary[600],
    fontWeight: '600',
  },
  servicesGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  serviceCard: {
    flex: 1,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.md,
  },
  serviceCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  serviceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  serviceLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[900],
  },
  serviceSubtext: {
    fontSize: fontSize.xs,
    color: colors.gray[400],
    marginTop: spacing.xs,
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  categoryCard: {
    alignItems: 'center',
    flex: 1,
  },
  categoryCardPressed: {
    opacity: 0.8,
  },
  categoryIcon: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray[700],
  },
  orderCard: {
    marginBottom: spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    backgroundColor: colors.gray[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderId: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[900],
  },
  orderItems: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
    marginTop: 2,
  },
  ctaCard: {
    marginHorizontal: spacing['2xl'],
    marginTop: spacing['2xl'],
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.lg,
  },
  ctaCardPressed: {
    opacity: 0.95,
  },
  ctaContent: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  ctaSubtitle: {
    fontSize: fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  ctaButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  devButton: {
    margin: spacing['2xl'],
    padding: spacing.md,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  devButtonText: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    fontWeight: '500',
  },
});

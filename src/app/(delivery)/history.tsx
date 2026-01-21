import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    IconArrowLeft,
    IconPackage,
    IconTrendingUp,
    IconClock,
    IconCalendar,
    IconCurrencyTaka,
    IconTruck,
} from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { Card, StatusBadge, LoadingState } from '../../components/ui';
import { useDeliveryHistory, useDeliveryStats } from '../../hooks';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../constants/theme';
import { formatDate, formatCurrency } from '../../lib/utils';

/**
 * Delivery history and statistics screen.
 */
export default function DeliveryHistoryScreen() {
    const { t } = useTranslation();
    const router = useRouter();

    const { data: history = [], isLoading: historyLoading } = useDeliveryHistory();
    const { data: stats, isLoading: statsLoading } = useDeliveryStats();

    const handleGoBack = () => {
        if (Platform.OS === 'web') {
            const referrer = document.referrer;
            const currentDomain = window.location.origin;

            if (referrer && referrer.startsWith(currentDomain)) {
                router.back();
            } else {
                router.replace('/(delivery)/dashboard');
            }
        } else {
            router.back();
        }
    };

    const handleOrderPress = (orderId: string) => {
        router.push(`/(delivery)/order-details?id=${orderId}`);
    };

    if (historyLoading || statsLoading) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <Pressable style={styles.backButton} onPress={handleGoBack}>
                        <IconArrowLeft size={24} color={colors.gray[800]} strokeWidth={1.5} />
                    </Pressable>
                    <Text style={styles.title}>{t('delivery.history')}</Text>
                    <View style={{ width: 44 }} />
                </View>
                <LoadingState />
            </SafeAreaView>
        );
    }

    const statCards = [
        {
            icon: IconPackage,
            label: t('delivery.totalDeliveries'),
            value: stats?.totalDeliveries || 0,
            color: colors.primary[600],
            bgColor: colors.primary[50],
        },
        {
            icon: IconTrendingUp,
            label: t('delivery.completedDeliveries'),
            value: stats?.completedDeliveries || 0,
            color: colors.success,
            bgColor: colors.successLight,
        },
        {
            icon: IconCurrencyTaka,
            label: t('delivery.totalRevenue'),
            value: `৳${formatCurrency(stats?.totalRevenue || 0)}`,
            color: colors.warning,
            bgColor: colors.warningLight,
        },
        {
            icon: IconClock,
            label: t('delivery.avgDeliveryTime'),
            value: `${stats?.averageDeliveryTime || 0}h`,
            color: colors.info,
            bgColor: colors.infoLight,
        },
    ];

    const periodStats = [
        {
            label: t('delivery.todayDeliveries'),
            value: stats?.todayDeliveries || 0,
        },
        {
            label: t('delivery.thisWeekDeliveries'),
            value: stats?.thisWeekDeliveries || 0,
        },
        {
            label: t('delivery.thisMonthDeliveries'),
            value: stats?.thisMonthDeliveries || 0,
        },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={handleGoBack}>
                    <IconArrowLeft size={24} color={colors.gray[800]} strokeWidth={1.5} />
                </Pressable>
                <Text style={styles.title}>{t('delivery.history')}</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Statistics Cards */}
                <View style={styles.statsGrid}>
                    {statCards.map((stat, index) => (
                        <Card key={index} style={styles.statCard}>
                            <View style={[styles.statIconContainer, { backgroundColor: stat.bgColor }]}>
                                <stat.icon size={24} color={stat.color} strokeWidth={1.5} />
                            </View>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </Card>
                    ))}
                </View>

                {/* Period Statistics */}
                <Card style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('delivery.periodStats')}</Text>
                    {periodStats.map((stat, index) => (
                        <View key={index} style={styles.periodStatRow}>
                            <Text style={styles.periodStatLabel}>{stat.label}</Text>
                            <Text style={styles.periodStatValue}>{stat.value}</Text>
                        </View>
                    ))}
                </Card>

                {/* Delivery History */}
                <Card style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <IconTruck size={20} color={colors.primary[600]} strokeWidth={1.5} />
                        <Text style={styles.sectionTitle}>{t('delivery.deliveryHistory')}</Text>
                    </View>

                    {history.length === 0 ? (
                        <View style={styles.emptyState}>
                            <IconPackage size={48} color={colors.gray[400]} strokeWidth={1} />
                            <Text style={styles.emptyText}>{t('delivery.noHistoryYet')}</Text>
                        </View>
                    ) : (
                        history.map((order) => (
                            <Pressable
                                key={order.id}
                                style={styles.historyItem}
                                onPress={() => handleOrderPress(order.id)}
                            >
                                <View style={styles.historyHeader}>
                                    <Text style={styles.orderId}>#{order.id.slice(-8)}</Text>
                                    <StatusBadge status={order.status} size="sm" />
                                </View>

                                <View style={styles.historyDetails}>
                                    <View style={styles.historyRow}>
                                        <IconCalendar size={16} color={colors.gray[500]} strokeWidth={1.5} />
                                        <Text style={styles.historyText}>
                                            {formatDate(order.createdAt)}
                                        </Text>
                                    </View>

                                    <View style={styles.historyRow}>
                                        <IconCurrencyTaka size={16} color={colors.gray[500]} strokeWidth={1.5} />
                                        <Text style={styles.historyText}>
                                            ৳{formatCurrency(order.pricing.grandTotal)}
                                        </Text>
                                    </View>
                                </View>

                                {order.customer && typeof order.customer === 'object' && (
                                    <Text style={styles.customerName}>
                                        {order.customer.fullName}
                                    </Text>
                                )}
                            </Pressable>
                        ))
                    )}
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
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.lg,
        marginBottom: spacing.lg,
    },
    statCard: {
        flex: 1,
        minWidth: '45%',
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    statIconContainer: {
        width: 56,
        height: 56,
        borderRadius: borderRadius.xl,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    statValue: {
        fontSize: fontSize.xl,
        fontWeight: '700',
        color: colors.gray[900],
        marginBottom: spacing.xs,
    },
    statLabel: {
        fontSize: fontSize.sm,
        color: colors.gray[600],
        textAlign: 'center',
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
    sectionTitle: {
        fontSize: fontSize.md,
        fontWeight: '700',
        color: colors.gray[900],
    },
    periodStatRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[100],
    },
    periodStatLabel: {
        fontSize: fontSize.md,
        color: colors.gray[700],
    },
    periodStatValue: {
        fontSize: fontSize.md,
        fontWeight: '600',
        color: colors.primary[600],
    },
    historyItem: {
        paddingVertical: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[100],
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    orderId: {
        fontSize: fontSize.md,
        fontWeight: '600',
        color: colors.gray[900],
    },
    historyDetails: {
        flexDirection: 'row',
        gap: spacing.xl,
        marginBottom: spacing.sm,
    },
    historyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    historyText: {
        fontSize: fontSize.sm,
        color: colors.gray[600],
    },
    customerName: {
        fontSize: fontSize.sm,
        color: colors.gray[500],
        fontStyle: 'italic',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: spacing['3xl'],
    },
    emptyText: {
        fontSize: fontSize.md,
        color: colors.gray[500],
        marginTop: spacing.lg,
        textAlign: 'center',
    },
});
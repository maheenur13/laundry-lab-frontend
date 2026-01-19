import React from 'react';
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
import { useRouter } from 'expo-router';
import {
  IconPhone,
  IconWorld,
  IconLogout,
  IconChevronRight,
  IconInfoCircle,
  IconTruck,
} from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui';
import { useAuthStore } from '../../stores/authStore';
import { useLogout } from '../../hooks';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../constants/theme';

/**
 * Delivery profile screen - Professional design.
 */
export default function DeliveryProfileScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { user } = useAuthStore();
  const logoutMutation = useLogout();

  const handleLanguageToggle = () => {
    const newLang = i18n.language === 'en' ? 'bn' : 'en';
    i18n.changeLanguage(newLang);
  };

  const performLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.replace('/(auth)/login');
      },
    });
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to logout?');
      if (confirmed) {
        performLogout();
      }
    } else {
      Alert.alert(t('auth.logout'), 'Are you sure you want to logout?', [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('auth.logout'), style: 'destructive', onPress: performLogout },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('profile.profile')}</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User info */}
        <Card style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <IconTruck size={32} color={colors.primary[600]} strokeWidth={1.5} />
            </View>
          </View>
          <Text style={styles.userName}>{user?.fullName}</Text>
          <View style={styles.roleTag}>
            <Text style={styles.roleText}>Delivery Partner</Text>
          </View>
          <View style={styles.infoRow}>
            <IconPhone size={16} color={colors.gray[400]} strokeWidth={1.5} />
            <Text style={styles.infoText}>{user?.phoneNumber}</Text>
          </View>
        </Card>

        {/* Menu */}
        <Card style={styles.menuCard} padding="none">
          <Pressable
            style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
            onPress={handleLanguageToggle}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIconContainer}>
                <IconWorld size={20} color={colors.gray[600]} strokeWidth={1.5} />
              </View>
              <Text style={styles.menuItemLabel}>{t('profile.language')}</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>
                {i18n.language === 'en' ? 'English' : 'বাংলা'}
              </Text>
              <IconChevronRight size={20} color={colors.gray[400]} strokeWidth={1.5} />
            </View>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              styles.menuItemLast,
              pressed && styles.menuItemPressed,
            ]}
            onPress={() => {
              if (Platform.OS === 'web') {
                window.alert('LaundryBD - Version 1.0.0');
              } else {
                Alert.alert('LaundryBD', 'Version 1.0.0');
              }
            }}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIconContainer}>
                <IconInfoCircle size={20} color={colors.gray[600]} strokeWidth={1.5} />
              </View>
              <Text style={styles.menuItemLabel}>{t('profile.about')}</Text>
            </View>
            <IconChevronRight size={20} color={colors.gray[400]} strokeWidth={1.5} />
          </Pressable>
        </Card>

        {/* Logout */}
        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutButtonPressed,
          ]}
          onPress={handleLogout}
        >
          <IconLogout size={20} color={colors.error} strokeWidth={1.5} />
          <Text style={styles.logoutText}>{t('auth.logout')}</Text>
        </Pressable>

        <Text style={styles.versionText}>Version 1.0.0</Text>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing['2xl'],
    paddingBottom: spacing['4xl'],
  },
  userCard: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  userName: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  roleTag: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginBottom: spacing.lg,
  },
  roleText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.primary[700],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoText: {
    fontSize: fontSize.md,
    color: colors.gray[600],
  },
  menuCard: {
    marginBottom: spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemPressed: {
    backgroundColor: colors.gray[50],
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemLabel: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.gray[800],
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  menuItemValue: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    backgroundColor: colors.errorLight,
    borderRadius: borderRadius.xl,
  },
  logoutButtonPressed: {
    opacity: 0.8,
  },
  logoutText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.error,
  },
  versionText: {
    fontSize: fontSize.sm,
    color: colors.gray[400],
    textAlign: 'center',
    marginTop: spacing['2xl'],
  },
});

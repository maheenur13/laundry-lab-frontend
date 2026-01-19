import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconUser, IconMapPin, IconSparkles } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '../../components/ui';
import { useAuthStore } from '../../stores/authStore';
import { useCompleteSignup } from '../../hooks';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../constants/theme';

/**
 * Complete profile screen - Professional design for new users.
 */
export default function CompleteProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const phoneNumber = useAuthStore((state) => state.phoneNumber);
  const completeSignupMutation = useCompleteSignup();

  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<{ fullName?: string; address?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = t('validation.required');
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = t('validation.minLength', { count: 2 });
    }

    if (!address.trim()) {
      newErrors.address = t('validation.required');
    } else if (address.trim().length < 5) {
      newErrors.address = t('validation.minLength', { count: 5 });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    if (!phoneNumber) {
      setErrors({ fullName: 'Phone number not found' });
      return;
    }

    completeSignupMutation.mutate(
      {
        phoneNumber,
        fullName: fullName.trim(),
        address: address.trim(),
      },
      {
        onSuccess: () => {
          // New signups are always customers
          router.replace('/(customer)/home');
        },
        onError: (err) => {
          setErrors({
            fullName: err instanceof Error ? err.message : 'Failed to complete signup',
          });
        },
      },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Illustration */}
          <View style={styles.headerSection}>
            <View style={styles.illustrationContainer}>
              <View style={styles.illustrationCircle}>
                <IconSparkles size={32} color={colors.primary[600]} strokeWidth={1.5} />
              </View>
            </View>
            <Text style={styles.title}>{t('auth.completeProfile')}</Text>
            <Text style={styles.subtitle}>
              Tell us a bit about yourself to personalize your experience
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            <Input
              label={t('auth.fullName')}
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
              autoComplete="name"
              error={errors.fullName}
              leftIcon={<IconUser size={20} color={colors.gray[400]} strokeWidth={1.5} />}
            />

            <Input
              label={t('auth.address')}
              placeholder="Enter your delivery address"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
              error={errors.address}
              leftIcon={<IconMapPin size={20} color={colors.gray[400]} strokeWidth={1.5} />}
            />

            <View style={styles.buttonContainer}>
              <Button
                title={t('auth.signUp')}
                onPress={handleSubmit}
                loading={completeSignupMutation.isPending}
                fullWidth
                size="lg"
              />
            </View>
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Why we need this info?</Text>
            <Text style={styles.infoText}>
              Your name helps us personalize your experience, and your address is needed for pickup and delivery of your laundry.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing['3xl'],
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: spacing['4xl'],
    paddingHorizontal: spacing['2xl'],
    paddingBottom: spacing['3xl'],
  },
  illustrationContainer: {
    marginBottom: spacing['2xl'],
  },
  illustrationCircle: {
    width: 80,
    height: 80,
    borderRadius: borderRadius['2xl'],
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },
  title: {
    fontSize: fontSize['3xl'],
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: spacing.sm,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.gray[500],
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  formSection: {
    paddingHorizontal: spacing['2xl'],
  },
  buttonContainer: {
    marginTop: spacing.lg,
  },
  infoCard: {
    marginHorizontal: spacing['2xl'],
    marginTop: spacing['3xl'],
    padding: spacing.lg,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  infoTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
    lineHeight: 20,
  },
});

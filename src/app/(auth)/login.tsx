import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconPhone, IconSparkles, IconWashMachine } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '../../components/ui';
import { useRequestOtp } from '../../hooks';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../constants/theme';

/**
 * Login screen - Professional phone number input for OTP.
 */
export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const requestOtpMutation = useRequestOtp();

  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const validatePhone = (value: string) => {
    // Bangladesh phone number format
    const phoneRegex = /^(\+880|0)?1[3-9]\d{8}$/;
    return phoneRegex.test(value);
  };

  const handleSendOtp = async () => {
    setError('');

    if (!phone.trim()) {
      setError(t('validation.required'));
      return;
    }

    if (!validatePhone(phone)) {
      setError(t('validation.invalidPhone'));
      return;
    }

    requestOtpMutation.mutate(
      { phoneNumber: phone },
      {
        onSuccess: (result) => {
          // In development, show the OTP for testing
          if (result.otp) {
            Alert.alert('Development OTP', `Your OTP is: ${result.otp}`, [
              { text: 'OK', onPress: () => router.push('/(auth)/otp') },
            ]);
          } else {
            router.push('/(auth)/otp');
          }
        },
        onError: (err) => {
          setError(err instanceof Error ? err.message : 'Failed to send OTP');
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
          {/* Decorative Background */}
          <View style={styles.decorativeTop}>
            <View style={styles.circle1} />
            <View style={styles.circle2} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <IconWashMachine size={40} color={colors.primary[600]} strokeWidth={1.5} />
            </View>
            <Text style={styles.title}>{t('common.appName')}</Text>
            <Text style={styles.subtitle}>{t('common.welcome')}</Text>
          </View>

          {/* Features */}
          <View style={styles.features}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <IconSparkles size={20} color={colors.primary[600]} strokeWidth={1.5} />
              </View>
              <Text style={styles.featureText}>Professional Laundry Service</Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.form}>
              <Input
                label={t('auth.phoneNumber')}
                placeholder={t('auth.enterPhone')}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoComplete="tel"
                error={error}
                hint={!error ? t('auth.phoneHint') : undefined}
                leftIcon={<IconPhone size={20} color={colors.gray[400]} strokeWidth={1.5} />}
              />

              <Button
                title={t('auth.sendOtp')}
                onPress={handleSendOtp}
                loading={requestOtpMutation.isPending}
                fullWidth
                size="lg"
              />
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our Terms of Service
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
  decorativeTop: {
    position: 'absolute',
    top: -100,
    right: -50,
    width: 300,
    height: 300,
  },
  circle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primary[50],
    top: 0,
    right: 0,
  },
  circle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.primary[100],
    top: 80,
    right: 80,
    opacity: 0.5,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing['6xl'],
    paddingHorizontal: spacing['2xl'],
  },
  logoContainer: {
    width: 88,
    height: 88,
    borderRadius: borderRadius['2xl'],
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing['2xl'],
    ...shadows.lg,
  },
  title: {
    fontSize: fontSize['4xl'],
    fontWeight: '800',
    color: colors.primary[700],
    letterSpacing: -0.5,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.gray[500],
    fontWeight: '500',
  },
  features: {
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['3xl'],
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    fontSize: fontSize.md,
    color: colors.gray[600],
    fontWeight: '500',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: spacing['4xl'],
  },
  form: {
    paddingHorizontal: spacing['2xl'],
  },
  footer: {
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['2xl'],
    alignItems: 'center',
  },
  footerText: {
    fontSize: fontSize.sm,
    color: colors.gray[400],
    textAlign: 'center',
  },
});

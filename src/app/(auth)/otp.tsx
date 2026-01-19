import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconArrowLeft, IconRefresh } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui';
import { useAuthStore } from '../../stores/authStore';
import { useVerifyOtp, useRequestOtp } from '../../hooks';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../constants/theme';
import { UserRole } from '../../types/user';

const OTP_LENGTH = 6;
const RESEND_TIMER = 60;

/**
 * OTP verification screen - Professional design.
 */
export default function OtpScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const phoneNumber = useAuthStore((state) => state.phoneNumber);

  const verifyOtpMutation = useVerifyOtp();
  const requestOtpMutation = useRequestOtp();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(RESEND_TIMER);

  const inputRefs = useRef<TextInput[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      // Handle paste
      const pasted = value.slice(0, OTP_LENGTH).split('');
      const newOtp = [...otp];
      pasted.forEach((char, i) => {
        if (index + i < OTP_LENGTH) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + pasted.length, OTP_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
    } else {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input
      if (value && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
    setError('');
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');

    if (otpString.length !== OTP_LENGTH) {
      setError(t('validation.invalidOtp'));
      return;
    }

    if (!phoneNumber) {
      setError('Phone number not found');
      return;
    }

    setError('');

    verifyOtpMutation.mutate(
      { phoneNumber, otpCode: otpString },
      {
        onSuccess: (data) => {
          if (data.isNewUser) {
            router.replace('/(auth)/complete-profile');
          } else {
            // Navigate based on user role
            switch (data.user.role) {
              case UserRole.CUSTOMER:
                router.replace('/(customer)/home');
                break;
              case UserRole.DELIVERY:
                router.replace('/(delivery)/dashboard');
                break;
              case UserRole.ADMIN:
                router.replace('/(admin)/dashboard');
                break;
              default:
                router.replace('/(customer)/home');
            }
          }
        },
        onError: (err) => {
          setError(err instanceof Error ? err.message : t('auth.invalidOtp'));
        },
      },
    );
  };

  const handleResend = async () => {
    if (resendTimer > 0 || !phoneNumber) return;

    requestOtpMutation.mutate(
      { phoneNumber },
      {
        onSuccess: (result) => {
          setResendTimer(RESEND_TIMER);
          setOtp(Array(OTP_LENGTH).fill(''));

          if (result.otp) {
            Alert.alert('Development OTP', `Your new OTP is: ${result.otp}`);
          }
        },
        onError: () => {
          Alert.alert('Error', 'Failed to resend OTP');
        },
      },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <IconArrowLeft size={24} color={colors.gray[800]} strokeWidth={1.5} />
        </Pressable>
      </View>

      <View style={styles.content}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{t('auth.verifyOtp')}</Text>
          <Text style={styles.subtitle}>{t('auth.enterOtp')}</Text>
          {phoneNumber && (
            <View style={styles.phoneContainer}>
              <Text style={styles.phoneText}>{phoneNumber}</Text>
            </View>
          )}
        </View>

        {/* OTP inputs */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) inputRefs.current[index] = ref;
              }}
              style={[
                styles.otpInput,
                digit && styles.otpInputFilled,
                error && styles.otpInputError,
              ]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={index === 0 ? OTP_LENGTH : 1}
              selectTextOnFocus
            />
          ))}
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Button
          title={t('auth.verifyOtp')}
          onPress={handleVerify}
          loading={verifyOtpMutation.isPending}
          fullWidth
          size="lg"
        />

        {/* Resend */}
        <View style={styles.resendContainer}>
          {resendTimer > 0 ? (
            <Text style={styles.resendText}>
              {t('auth.resendIn', { seconds: resendTimer })}
            </Text>
          ) : (
            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResend}
              disabled={requestOtpMutation.isPending}
            >
              <IconRefresh size={18} color={colors.primary[600]} strokeWidth={1.5} />
              <Text style={styles.resendLink}>{t('auth.resendOtp')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing.xl,
  },
  titleSection: {
    marginBottom: spacing['3xl'],
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
    lineHeight: 22,
  },
  phoneContainer: {
    marginTop: spacing.md,
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    alignSelf: 'flex-start',
  },
  phoneText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.primary[700],
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing['2xl'],
    gap: spacing.sm,
  },
  otpInput: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 52,
    maxHeight: 60,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.gray[200],
    backgroundColor: colors.gray[50],
    textAlign: 'center',
    fontSize: fontSize['2xl'],
    fontWeight: '700',
    color: colors.gray[900],
  },
  otpInputFilled: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  otpInputError: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontWeight: '500',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: spacing['3xl'],
  },
  resendText: {
    fontSize: fontSize.md,
    color: colors.gray[500],
    fontWeight: '500',
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.lg,
  },
  resendLink: {
    fontSize: fontSize.md,
    color: colors.primary[600],
    fontWeight: '600',
  },
});

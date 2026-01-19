import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize } from '../../constants/theme';
import { useTranslation } from 'react-i18next';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

export function LoadingState({
  message,
  size = 'large',
  fullScreen = true,
}: LoadingStateProps) {
  const { t } = useTranslation();

  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <View style={styles.loaderContainer}>
        <ActivityIndicator size={size} color={colors.primary[600]} />
      </View>
      {message !== '' && (
        <Text style={styles.text}>{message || t('common.loading')}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['3xl'],
  },
  fullScreen: {
    flex: 1,
  },
  loaderContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: spacing.lg,
    fontSize: fontSize.md,
    color: colors.gray[600],
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});

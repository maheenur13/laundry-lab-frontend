import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconPackage } from '@tabler/icons-react-native';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {icon || <IconPackage size={56} color={colors.gray[300]} strokeWidth={1.5} />}
      </View>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {actionLabel && onAction && (
        <View style={styles.buttonContainer}>
          <Button title={actionLabel} onPress={onAction} variant="primary" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['3xl'],
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: borderRadius['2xl'],
    backgroundColor: colors.gray[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.gray[900],
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  description: {
    fontSize: fontSize.md,
    color: colors.gray[500],
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 22,
    maxWidth: 280,
  },
  buttonContainer: {
    marginTop: spacing['2xl'],
  },
});

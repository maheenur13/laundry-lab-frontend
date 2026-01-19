import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity, Pressable } from 'react-native';
import { colors, borderRadius, spacing, shadows } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined' | 'filled' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  style,
  onPress,
  variant = 'elevated',
  padding = 'md',
}: CardProps) {
  const paddingStyles = {
    none: undefined,
    sm: styles.paddingSM,
    md: styles.paddingMD,
    lg: styles.paddingLG,
  };

  const cardStyles = [
    styles.base,
    styles[variant],
    paddingStyles[padding],
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [
          cardStyles,
          pressed && styles.pressed,
        ]}
        onPress={onPress}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.95,
    transform: [{ scale: 0.995 }],
  },

  // Variants
  elevated: {
    backgroundColor: '#FFFFFF',
    ...shadows.lg,
  },
  outlined: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  filled: {
    backgroundColor: colors.gray[50],
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    ...shadows.md,
  },

  // Padding
  paddingSM: {
    padding: spacing.md,
  },
  paddingMD: {
    padding: spacing.lg,
  },
  paddingLG: {
    padding: spacing['2xl'],
  },
});

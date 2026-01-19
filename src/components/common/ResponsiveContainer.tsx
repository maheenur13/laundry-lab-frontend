import React from 'react';
import { View, StyleSheet, Platform, ViewStyle } from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';
import { colors, layout, shadows } from '../../constants/theme';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  showCard?: boolean; // Show card wrapper on desktop
}

/**
 * Responsive container that centers and constrains content on larger screens.
 * On mobile: full width
 * On tablet: centered with max width
 * On desktop: centered card layout with max width
 */
export function ResponsiveContainer({ 
  children, 
  style,
  showCard = true,
}: ResponsiveContainerProps) {
  const { isWeb, isDesktop, isTablet, contentWidth } = useResponsive();

  // On native mobile, just render children
  if (!isWeb) {
    return <View style={[styles.nativeContainer, style]}>{children}</View>;
  }

  // On web, center content with max width
  return (
    <View style={styles.webWrapper}>
      <View style={styles.webBackground} />
      <View 
        style={[
          styles.webContent,
          {
            maxWidth: isDesktop ? layout.maxContentWidth : layout.maxTabletWidth,
            width: isDesktop ? layout.maxContentWidth : '100%',
          },
          showCard && (isDesktop || isTablet) && styles.webCard,
          style,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nativeContainer: {
    flex: 1,
  },
  webWrapper: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    minHeight: '100%',
  },
  webBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.gray[100],
  },
  webContent: {
    flex: 1,
    backgroundColor: colors.background.primary,
    minHeight: '100%',
  },
  webCard: {
    ...shadows.xl,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.gray[200],
  },
});

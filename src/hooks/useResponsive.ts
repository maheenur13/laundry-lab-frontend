import { useState, useEffect } from 'react';
import { Dimensions, Platform, ScaledSize } from 'react-native';
import { breakpoints, layout } from '../constants/theme';

type ScreenSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface ResponsiveInfo {
  width: number;
  height: number;
  isWeb: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenSize: ScreenSize;
  contentWidth: number;
  shouldShowSidebar: boolean;
}

/**
 * Hook for responsive design.
 * Returns screen dimensions and breakpoint information.
 */
export function useResponsive(): ResponsiveInfo {
  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const { width, height } = dimensions;
  const isWeb = Platform.OS === 'web';

  // Determine screen size based on breakpoints
  let screenSize: ScreenSize = 'sm';
  if (width >= breakpoints['2xl']) {
    screenSize = '2xl';
  } else if (width >= breakpoints.xl) {
    screenSize = 'xl';
  } else if (width >= breakpoints.lg) {
    screenSize = 'lg';
  } else if (width >= breakpoints.md) {
    screenSize = 'md';
  }

  // Device type detection
  const isMobile = screenSize === 'sm';
  const isTablet = screenSize === 'md';
  const isDesktop = screenSize === 'lg' || screenSize === 'xl' || screenSize === '2xl';

  // Calculate content width based on screen size
  let contentWidth = width;
  if (isWeb) {
    if (isDesktop) {
      contentWidth = layout.maxContentWidth;
    } else if (isTablet) {
      contentWidth = Math.min(width - 64, layout.maxTabletWidth);
    }
  }

  // Show sidebar only on desktop web
  const shouldShowSidebar = isWeb && isDesktop;

  return {
    width,
    height,
    isWeb,
    isMobile,
    isTablet,
    isDesktop,
    screenSize,
    contentWidth,
    shouldShowSidebar,
  };
}

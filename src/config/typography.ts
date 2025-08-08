/**
 * Typography Configuration File
 * 
 * Centralized typography system for the ReteamNow Employee Engagement App.
 * This file provides consistent font sizes, weights, and line heights that can be
 * easily modified across the entire application.
 */

import { TextStyle } from 'react-native';

/**
 * Font family configurations
 * You can update these to use custom fonts if needed
 */
export const fontFamilies = {
  regular: 'System', // Default system font
  medium: 'System',  // System medium weight
  bold: 'System',    // System bold weight
  light: 'System',   // System light weight
};

/**
 * Font weights - standardized across the app
 */
export const fontWeights = {
  light: '300' as const,
  normal: 'normal' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: 'bold' as const,
  extraBold: '800' as const,
};

/**
 * Font sizes - consistent scale across the app
 */
export const fontSizes = {
  xs: 10,   // Extra small text
  sm: 12,   // Small text, captions
  md: 14,   // Body text, default
  lg: 16,   // Large body text
  xl: 18,   // Subtitle, h6
  xxl: 20,  // h5
  h4: 22,   // h4
  h3: 24,   // h3
  h2: 28,   // h2
  h1: 32,   // h1
  display: 36, // Large display text
};

/**
 * Line heights - calculated for optimal readability
 */
export const lineHeights = {
  xs: 14,   // For 10px font
  sm: 16,   // For 12px font
  md: 20,   // For 14px font
  lg: 22,   // For 16px font
  xl: 24,   // For 18px font
  xxl: 28,  // For 20px font
  h4: 30,   // For 22px font
  h3: 32,   // For 24px font
  h2: 36,   // For 28px font
  h1: 40,   // For 32px font
  display: 44, // For 36px font
};

/**
 * Typography styles - ready-to-use text styles
 */
export const typography: Record<string, TextStyle> = {
  // Heading styles
  h1: {
    fontSize: fontSizes.h1,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.h1,
    fontFamily: fontFamilies.bold,
  },
  h2: {
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.h2,
    fontFamily: fontFamilies.bold,
  },
  h3: {
    fontSize: fontSizes.h3,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.h3,
    fontFamily: fontFamilies.bold,
  },
  h4: {
    fontSize: fontSizes.h4,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.h4,
    fontFamily: fontFamilies.bold,
  },
  h5: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semiBold,
    lineHeight: lineHeights.xl,
    fontFamily: fontFamilies.medium,
  },
  h6: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semiBold,
    lineHeight: lineHeights.lg,
    fontFamily: fontFamilies.medium,
  },

  // Body text styles
  body: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.md,
    fontFamily: fontFamilies.regular,
  },
  bodyLarge: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.lg,
    fontFamily: fontFamilies.regular,
  },
  bodySmall: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.sm,
    fontFamily: fontFamilies.regular,
  },

  // Subtitle styles
  subtitle1: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.lg,
    fontFamily: fontFamilies.medium,
  },
  subtitle2: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.md,
    fontFamily: fontFamilies.medium,
  },

  // Caption and helper text
  caption: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.sm,
    fontFamily: fontFamilies.regular,
  },
  overline: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.xs,
    fontFamily: fontFamilies.medium,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },

  // Button text styles
  buttonLarge: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semiBold,
    lineHeight: lineHeights.lg,
    fontFamily: fontFamilies.medium,
  },
  buttonMedium: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semiBold,
    lineHeight: lineHeights.md,
    fontFamily: fontFamilies.medium,
  },
  buttonSmall: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
    lineHeight: lineHeights.sm,
    fontFamily: fontFamilies.medium,
  },

  // Special text styles
  display: {
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.display,
    fontFamily: fontFamilies.bold,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.sm,
    fontFamily: fontFamilies.medium,
  },
  error: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.sm,
    fontFamily: fontFamilies.regular,
  },
};

/**
 * Header text styles - commonly used in app headers
 */
export const headerStyles = {
  title: {
    fontSize: fontSizes.h3,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.h3,
    fontFamily: fontFamilies.bold,
  },
  subtitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.md,
    fontFamily: fontFamilies.regular,
  },
};

/**
 * Card text styles - commonly used in cards
 */
export const cardStyles = {
  title: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semiBold,
    lineHeight: lineHeights.lg,
    fontFamily: fontFamilies.medium,
  },
  subtitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.md,
    fontFamily: fontFamilies.regular,
  },
  caption: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.sm,
    fontFamily: fontFamilies.regular,
  },
};

export default typography;

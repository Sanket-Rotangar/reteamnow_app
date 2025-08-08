/**
 * Theme Configuration File
 * 
 * Centralized theme system for the ReteamNow Employee Engagement App.
 * This file combines colors, typography, spacing, shadows, and other design tokens
 * to provide a consistent design system across the entire application.
 * 
 * Import this file in your components to access all theme values:
 * import { theme } from '../config/theme';
 */

import { ViewStyle, TextStyle } from 'react-native';
import colors from './colors';
import typography from './typography';

/**
 * Spacing scale - consistent spacing values across the app
 */
export const spacing = {
  xs: 4,    // Extra small spacing
  sm: 8,    // Small spacing
  md: 16,   // Medium spacing (default)
  lg: 24,   // Large spacing
  xl: 32,   // Extra large spacing
  xxl: 48,  // Double extra large spacing
  xxxl: 64, // Triple extra large spacing
};

/**
 * Border radius scale - consistent corner radius values
 */
export const borderRadius = {
  xs: 2,    // Very small radius
  sm: 4,    // Small radius
  md: 8,    // Medium radius (default)
  lg: 12,   // Large radius
  xl: 16,   // Extra large radius
  xxl: 24,  // Double extra large radius
  full: 9999, // Fully rounded (pill shape)
};

/**
 * Shadow presets - consistent shadow styles
 */
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

/**
 * Common component styles - reusable style objects
 */
export const commonStyles = {
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
  } as ViewStyle,

  // Card styles
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.md,
  } as ViewStyle,

  cardSmall: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    ...shadows.sm,
  } as ViewStyle,

  // Header styles
  header: {
    backgroundColor: colors.primary,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  } as ViewStyle,

  headerTitle: {
    ...typography.h3,
    color: colors.surface,
    marginBottom: 4,
  } as TextStyle,

  headerSubtitle: {
    ...typography.body,
    color: `${colors.surface}CC`, // 80% opacity
  } as TextStyle,

  // Button styles
  buttonPrimary: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  } as ViewStyle,

  buttonSecondary: {
    backgroundColor: colors.secondary,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  } as ViewStyle,

  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  buttonText: {
    ...typography.buttonMedium,
    color: colors.surface,
  } as TextStyle,

  buttonTextOutline: {
    ...typography.buttonMedium,
    color: colors.primary,
  } as TextStyle,

  // Input styles
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.sm + 4,
    fontSize: typography.body.fontSize,
    color: colors.text,
    backgroundColor: colors.surface,
  } as ViewStyle,

  inputFocused: {
    borderColor: colors.primary,
    ...shadows.sm,
  } as ViewStyle,

  // Section styles
  section: {
    marginTop: spacing.lg,
  } as ViewStyle,

  sectionTitle: {
    ...typography.h5,
    color: colors.text,
    marginBottom: spacing.sm + 4,
  } as TextStyle,

  // Divider styles
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  } as ViewStyle,

  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  } as ViewStyle,

  // Error styles
  errorContainer: {
    backgroundColor: colors.dangerLight,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginVertical: spacing.sm,
  } as ViewStyle,

  errorText: {
    ...typography.error,
    color: colors.danger,
  } as TextStyle,

  // Success styles
  successContainer: {
    backgroundColor: colors.successLight,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginVertical: spacing.sm,
  } as ViewStyle,

  successText: {
    ...typography.body,
    color: colors.success,
  } as TextStyle,
};

/**
 * Screen-specific styles - common patterns for different screen types
 */
export const screenStyles = {
  // Tab screen styles
  tabScreen: {
    flex: 1,
    backgroundColor: colors.background,
  } as ViewStyle,

  tabScrollContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
  } as ViewStyle,

  // Modal screen styles
  modalScreen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: spacing.lg,
  } as ViewStyle,

  // Settings screen styles
  settingsSection: {
    marginTop: spacing.lg,
  } as ViewStyle,

  settingsItem: {
    backgroundColor: colors.surface,
    marginBottom: 2,
    borderRadius: borderRadius.md,
    ...shadows.xs,
  } as ViewStyle,

  settingsItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  } as ViewStyle,
};

/**
 * Main theme object - combines all design tokens
 */
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  commonStyles,
  screenStyles,
};

/**
 * Utility functions for theme-related operations
 */
export const themeUtils = {
  /**
   * Get spacing value by key
   */
  getSpacing: (key: keyof typeof spacing): number => spacing[key],

  /**
   * Get border radius value by key
   */
  getBorderRadius: (key: keyof typeof borderRadius): number => borderRadius[key],

  /**
   * Get shadow style by key
   */
  getShadow: (key: keyof typeof shadows): ViewStyle => shadows[key],

  /**
   * Create a custom shadow with specified parameters
   */
  createShadow: (
    elevation: number,
    opacity: number = 0.1,
    radius: number = elevation * 2
  ): ViewStyle => ({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: elevation },
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation,
  }),

  /**
   * Add opacity to a color
   */
  withOpacity: (color: string, opacity: number): string => {
    const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
    return `${color}${alpha}`;
  },
};

export default theme;

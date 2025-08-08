/**
 * Theme Usage Examples
 * 
 * This file demonstrates how to use the centralized theme system
 * across different components in the ReteamNow app.
 * 
 * The theme system provides:
 * - Consistent colors
 * - Typography styles
 * - Spacing values
 * - Border radius values
 * - Shadow presets
 * - Common component styles
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../config/theme';

// Extract theme values for easier access
const { colors, typography, spacing, borderRadius, shadows, commonStyles } = theme;

/**
 * Example: Basic Component using theme
 */
const ExampleCard = () => {
  return (
    <View style={styles.exampleCard}>
      <Text style={styles.cardTitle}>Example Card</Text>
      <Text style={styles.cardDescription}>
        This card uses the centralized theme system for consistent styling.
      </Text>
      <TouchableOpacity style={styles.cardButton}>
        <Text style={styles.cardButtonText}>Action Button</Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * Example: Using common styles directly
 */
const ExampleWithCommonStyles = () => {
  return (
    <View style={commonStyles.container}>
      {/* Header using common header styles */}
      <View style={commonStyles.header}>
        <Text style={commonStyles.headerTitle}>Screen Title</Text>
        <Text style={commonStyles.headerSubtitle}>Screen subtitle</Text>
      </View>
      
      {/* Card using common card styles */}
      <View style={commonStyles.card}>
        <Text style={[typography.h6, { color: colors.text }]}>
          Card with Common Styles
        </Text>
        <Text style={[typography.body, { color: colors.textSecondary }]}>
          This uses the pre-defined common styles from the theme.
        </Text>
      </View>
      
      {/* Buttons using common button styles */}
      <TouchableOpacity style={commonStyles.buttonPrimary}>
        <Text style={commonStyles.buttonText}>Primary Button</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={commonStyles.buttonSecondary}>
        <Text style={commonStyles.buttonText}>Secondary Button</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={commonStyles.buttonOutline}>
        <Text style={commonStyles.buttonTextOutline}>Outline Button</Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * Example styles using theme values
 */
const styles = StyleSheet.create({
  // Using individual theme values
  exampleCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.sm,
    ...shadows.md, // Spread shadow preset
  },
  
  cardTitle: {
    ...typography.h6, // Spread typography preset
    color: colors.text,
    marginBottom: spacing.sm,
  },
  
  cardDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  
  cardButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  
  cardButtonText: {
    ...typography.buttonMedium,
    color: colors.surface,
  },
  
  // Example of custom styles with theme values
  customContainer: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  
  customText: {
    fontSize: typography.h5.fontSize,
    fontWeight: typography.h5.fontWeight,
    color: colors.primary,
    marginBottom: spacing.xl,
  },
  
  // Example of responsive spacing
  responsiveSection: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  
  // Example of combining multiple theme values
  specialCard: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.lg,
  },
});

/**
 * HOW TO USE THE THEME SYSTEM:
 * 
 * 1. Import the theme in your component:
 *    import { theme } from '../config/theme';
 * 
 * 2. Extract values you need:
 *    const { colors, typography, spacing } = theme;
 * 
 * 3. Use in your styles:
 *    - Colors: backgroundColor: colors.primary
 *    - Typography: ...typography.h1
 *    - Spacing: padding: spacing.md
 *    - Shadows: ...shadows.md
 *    - Common styles: ...commonStyles.card
 * 
 * 4. For quick access to common patterns:
 *    - Use commonStyles for frequently used component styles
 *    - Use screenStyles for screen-level layouts
 * 
 * 5. To modify app-wide appearance:
 *    - Edit colors in src/config/colors.ts
 *    - Edit typography in src/config/typography.ts
 *    - Edit spacing/shadows in src/config/theme.ts
 * 
 * BENEFITS:
 * - Consistent design across the app
 * - Easy to maintain and update
 * - Quick to implement new components
 * - Supports design system principles
 * - Easy to implement dark mode or theme switching
 */

export { ExampleCard, ExampleWithCommonStyles };

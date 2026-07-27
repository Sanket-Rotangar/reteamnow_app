// src/components/RegisterIllustration.tsx
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../config/colors';

const { width } = Dimensions.get('window');

interface RegisterIllustrationProps {
  step?: 1 | 2;
}

const RegisterIllustration: React.FC<RegisterIllustrationProps> = ({ step = 1 }) => {
  const scaleAnimation = useRef(new Animated.Value(0.8)).current;
  const progressAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Scale in animation
    Animated.timing(scaleAnimation, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Progress animation
    Animated.timing(progressAnimation, {
      toValue: step === 1 ? 0.5 : 1,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [step, scaleAnimation, progressAnimation]);
  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          {
            transform: [{ scale: scaleAnimation }]
          }
        ]}
      >
        {/* Background Elements */}
        <View style={styles.backgroundShape1}>
          <LinearGradient
            colors={[`${colors.primary}12`, `${colors.secondary}08`]}
            style={styles.shapeGradient}
          />
        </View>
        
        <View style={styles.backgroundShape2}>
          <LinearGradient
            colors={[`${colors.success}10`, `${colors.warning}06`]}
            style={styles.shapeGradient}
          />
        </View>

      {/* Main Document/Form */}
      <View style={styles.documentContainer}>
        <LinearGradient
          colors={[colors.surface, '#F8FAFC', colors.surface]}
          style={styles.document}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
        >
          {/* Document Header */}
          <View style={styles.documentHeader}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.headerGradient}
            />
          </View>

          {/* Form Fields */}
          <View style={styles.formFields}>
            {step === 1 ? (
              // Step 1 - Basic Info Fields
              <>
                <View style={[styles.field, styles.fieldActive]} />
                <View style={[styles.field, styles.fieldActive]} />
                <View style={[styles.field, styles.fieldActive]} />
                <View style={styles.field} />
              </>
            ) : (
              // Step 2 - Professional Info Fields
              <>
                <View style={[styles.field, styles.fieldCompleted]} />
                <View style={[styles.field, styles.fieldCompleted]} />
                <View style={[styles.field, styles.fieldActive]} />
                <View style={[styles.field, styles.fieldActive]} />
              </>
            )}
          </View>

          {/* Submit Button Mockup */}
          <View style={styles.submitButton}>
            <LinearGradient
              colors={step === 1 ? [colors.primary, colors.secondary] : [colors.success, colors.primary]}
              style={styles.buttonGradient}
            />
          </View>
        </LinearGradient>
        
        {/* Document Shadow */}
        <View style={styles.documentShadow} />
      </View>

      {/* User Avatar Circle */}
      <View style={styles.avatarContainer}>
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.avatar}
        >
          <View style={styles.avatarInner}>
            <LinearGradient
              colors={[colors.surface, '#E2E8F0']}
              style={styles.avatarCore}
            />
          </View>
        </LinearGradient>
        <View style={styles.avatarShadow} />
      </View>

      {/* Floating Icons */}
      <View style={[styles.floatingIcon, styles.icon1]}>
        <LinearGradient
          colors={[colors.success, `${colors.success}80`]}
          style={styles.iconGradient}
        >
          <View style={styles.checkmark} />
        </LinearGradient>
      </View>

      <View style={[styles.floatingIcon, styles.icon2]}>
        <LinearGradient
          colors={[colors.warning, `${colors.warning}80`]}
          style={styles.iconGradient}
        >
          <View style={styles.star} />
        </LinearGradient>
      </View>

      <View style={[styles.floatingIcon, styles.icon3]}>
        <LinearGradient
          colors={[colors.info, `${colors.info}80`]}
          style={styles.iconGradient}
        >
          <View style={styles.diamond} />
        </LinearGradient>
      </View>

      {/* Briefcase Icon (for professional step) */}
      {step === 2 && (
        <View style={styles.briefcaseContainer}>
          <LinearGradient
            colors={[colors.secondary, colors.primary]}
            style={styles.briefcase}
          >
            <View style={styles.briefcaseHandle} />
            <View style={styles.briefcaseLock} />
          </LinearGradient>
        </View>
      )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  backgroundShape1: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 35,
    top: 5,
    left: 10,
    transform: [{ rotate: '15deg' }],
  },
  backgroundShape2: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    bottom: 10,
    right: 15,
    transform: [{ rotate: '-20deg' }],
  },
  shapeGradient: {
    flex: 1,
    borderRadius: 35,
  },
  documentContainer: {
    width: 140,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  document: {
    width: 140,
    height: 160,
    borderRadius: 16,
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  documentShadow: {
    position: 'absolute',
    bottom: -8,
    width: 130,
    height: 20,
    borderRadius: 65,
    backgroundColor: 'rgba(0,0,0,0.1)',
    zIndex: -1,
  },
  documentHeader: {
    height: 24,
    borderRadius: 8,
    marginBottom: 16,
  },
  headerGradient: {
    flex: 1,
    borderRadius: 8,
  },
  formFields: {
    flex: 1,
    gap: 8,
    marginBottom: 16,
  },
  field: {
    height: 12,
    backgroundColor: colors.border,
    borderRadius: 6,
  },
  fieldActive: {
    backgroundColor: `${colors.primary}30`,
  },
  fieldCompleted: {
    backgroundColor: `${colors.success}40`,
  },
  submitButton: {
    height: 20,
    borderRadius: 10,
  },
  buttonGradient: {
    flex: 1,
    borderRadius: 10,
  },
  avatarContainer: {
    position: 'absolute',
    top: -10,
    right: 20,
    width: 50,
    height: 50,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  avatarInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarCore: {
    flex: 1,
    borderRadius: 18,
  },
  avatarShadow: {
    position: 'absolute',
    bottom: -6,
    width: 45,
    height: 12,
    borderRadius: 22.5,
    backgroundColor: `${colors.primary}20`,
    left: 2.5,
  },
  progressContainer: {
    position: 'absolute',
    bottom: -30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  progressLine: {
    width: 30,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  progressActive: {
    backgroundColor: colors.success,
  },
  progressLineActive: {
    backgroundColor: colors.success,
  },
  floatingIcon: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  icon1: {
    top: 20,
    left: 15,
    transform: [{ rotate: '12deg' }],
  },
  icon2: {
    top: 35,
    right: 25,
    transform: [{ rotate: '-18deg' }],
  },
  icon3: {
    bottom: 40,
    left: 10,
    width: 20,
    height: 20,
    borderRadius: 4,
    transform: [{ rotate: '45deg' }],
  },
  iconGradient: {
    flex: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 8,
    height: 4,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.surface,
    transform: [{ rotate: '-45deg' }],
    marginTop: -2,
    marginLeft: 2,
  },
  star: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 4,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.surface,
  },
  diamond: {
    width: 10,
    height: 10,
    backgroundColor: colors.surface,
    transform: [{ rotate: '45deg' }],
  },
  briefcaseContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 36,
    height: 28,
  },
  briefcase: {
    width: 36,
    height: 24,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  briefcaseHandle: {
    position: 'absolute',
    top: -6,
    width: 16,
    height: 6,
    borderWidth: 2,
    borderColor: colors.secondary,
    borderRadius: 3,
    borderBottomColor: 'transparent',
  },
  briefcaseLock: {
    width: 4,
    height: 4,
    backgroundColor: colors.surface,
    borderRadius: 2,
  },
});

export default RegisterIllustration;

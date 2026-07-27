// src/components/LoginIllustration.tsx
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../config/colors';

const { width } = Dimensions.get('window');

const LoginIllustration: React.FC = () => {
  const floatAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnimation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnimation, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Scale in animation
    Animated.timing(scaleAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [floatAnimation, scaleAnimation]);

  const floatTranslateY = floatAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });
  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          {
            transform: [
              { scale: scaleAnimation },
              { translateY: floatTranslateY }
            ]
          }
        ]}
      >
        {/* Background Circle */}
        <View style={styles.backgroundCircle}>
          <LinearGradient
            colors={[`${colors.primary}15`, `${colors.secondary}10`, 'transparent']}
            style={styles.backgroundGradient}
          />
        </View>

      {/* Main Phone/Device */}
      <View style={styles.phoneContainer}>
        <LinearGradient
          colors={[colors.surface, '#F8FAFC', colors.surface]}
          style={styles.phoneBody}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
        >
          {/* Screen */}
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.screen}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
          >
            {/* Screen content - login form mockup */}
            <View style={styles.screenContent}>
              <View style={styles.mockInput} />
              <View style={styles.mockInput} />
              <View style={styles.mockButton}>
                <LinearGradient
                  colors={[colors.surface, '#F1F5F9']}
                  style={styles.buttonGradient}
                />
              </View>
            </View>
          </LinearGradient>
        </LinearGradient>
        
        {/* Phone shadow */}
        <View style={styles.phoneShadow} />
      </View>

      {/* Floating Elements */}
      <View style={[styles.floatingElement, styles.element1]}>
        <LinearGradient
          colors={[colors.success, `${colors.success}80`]}
          style={styles.elementGradient}
        />
      </View>

      <View style={[styles.floatingElement, styles.element2]}>
        <LinearGradient
          colors={[colors.warning, `${colors.warning}80`]}
          style={styles.elementGradient}
        />
      </View>

      <View style={[styles.floatingElement, styles.element3]}>
        <LinearGradient
          colors={[colors.info, `${colors.info}80`]}
          style={styles.elementGradient}
        />
      </View>

      {/* Security Shield */}
      <View style={styles.shieldContainer}>
        <LinearGradient
          colors={[colors.success, `${colors.success}90`]}
          style={styles.shield}
        >
          <View style={styles.shieldInner}>
            <LinearGradient
              colors={[colors.surface, '#E2E8F0']}
              style={styles.shieldCore}
            />
          </View>
        </LinearGradient>
        <View style={styles.shieldShadow} />
      </View>

      {/* Lock Icon */}
      <View style={styles.lockContainer}>
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.lockBody}
        >
          <View style={styles.lockHole} />
        </LinearGradient>
        <View style={styles.lockShackle} />
      </View>
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
  backgroundCircle: {
    position: 'absolute',
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: (width * 0.85) / 2,
    top: -70,
  },
  backgroundGradient: {
    flex: 1,
    borderRadius: (width * 0.85) / 2,
  },
  phoneContainer: {
    width: 120,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneBody: {
    width: 120,
    height: 160,
    borderRadius: 20,
    padding: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  phoneShadow: {
    position: 'absolute',
    bottom: -8,
    width: 110,
    height: 20,
    borderRadius: 55,
    backgroundColor: 'rgba(0,0,0,0.1)',
    zIndex: -1,
  },
  screen: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    justifyContent: 'center',
  },
  screenContent: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  mockInput: {
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 8,
    marginBottom: 6,
  },
  mockButton: {
    height: 20,
    borderRadius: 10,
    marginTop: 4,
  },
  buttonGradient: {
    flex: 1,
    borderRadius: 10,
  },
  floatingElement: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  element1: {
    top: 15,
    left: 20,
    transform: [{ rotate: '15deg' }],
  },
  element2: {
    top: 30,
    right: 15,
    width: 20,
    height: 20,
    borderRadius: 6,
    transform: [{ rotate: '-20deg' }],
  },
  element3: {
    bottom: 20,
    left: 10,
    width: 18,
    height: 18,
    borderRadius: 9,
    transform: [{ rotate: '25deg' }],
  },
  elementGradient: {
    flex: 1,
    borderRadius: 12,
  },
  shieldContainer: {
    position: 'absolute',
    top: 5,
    right: 10,
    width: 40,
    height: 45,
  },
  shield: {
    width: 40,
    height: 45,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  shieldInner: {
    width: 28,
    height: 32,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  shieldCore: {
    flex: 1,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  shieldShadow: {
    position: 'absolute',
    bottom: -4,
    width: 36,
    height: 8,
    borderRadius: 18,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    left: 2,
  },
  lockContainer: {
    position: 'absolute',
    bottom: 15,
    right: 25,
    width: 30,
    height: 35,
  },
  lockBody: {
    width: 30,
    height: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  lockHole: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surface,
  },
  lockShackle: {
    position: 'absolute',
    top: 0,
    left: 6,
    width: 18,
    height: 18,
    borderWidth: 3,
    borderColor: colors.primary,
    borderRadius: 9,
    borderBottomColor: 'transparent',
  },
});

export default LoginIllustration;

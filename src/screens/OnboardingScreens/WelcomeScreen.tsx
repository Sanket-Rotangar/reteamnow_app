import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { colors } from '../../config/colors';
import { fontSizes, fontWeights } from '../../config/typography';

const { width, height } = Dimensions.get('window');

const WelcomeScreen: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <View style={styles.backgroundPattern}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        
        {/* Illustration Container */}
        <Animated.View 
          style={[
            styles.illustrationContainer,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          {/* 3D Style Character Illustration */}
          <View style={styles.characterContainer}>
            {/* Main Character */}
            <View style={styles.character}>
              {/* Head */}
              <View style={styles.head}>
                <View style={styles.face}>
                  <View style={[styles.eye, styles.leftEye]} />
                  <View style={[styles.eye, styles.rightEye]} />
                  <View style={styles.smile} />
                </View>
              </View>
              
              {/* Body */}
              <View style={styles.body}>
                <View style={styles.shirt}>
                  <View style={styles.logo}>
                    <Text style={styles.logoText}>R</Text>
                  </View>
                </View>
              </View>
              
              {/* Arms */}
              <View style={styles.leftArm}>
                <View style={styles.hand}>
                  {/* Trophy/Achievement icon */}
                  <View style={styles.trophy}>
                    <Text style={styles.trophyIcon}>🏆</Text>
                  </View>
                </View>
              </View>
              <View style={styles.rightArm} />
            </View>

            {/* Platform/Base */}
            <View style={styles.platform}>
              <View style={styles.platformTop} />
              <View style={styles.platformSide} />
            </View>

            {/* Floating Elements */}
            <View style={styles.floatingElements}>
              <View style={[styles.floatingIcon, styles.float1]}>
                <Text style={styles.iconText}>⚡</Text>
              </View>
              <View style={[styles.floatingIcon, styles.float2]}>
                <Text style={styles.iconText}>🎯</Text>
              </View>
              <View style={[styles.floatingIcon, styles.float3]}>
                <Text style={styles.iconText}>💪</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Text Content */}
        <Animated.View 
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.title}>Engage. Compete. Achieve.</Text>
          <Text style={styles.subtitle}>
            Transform your workplace into an exciting arena where teams compete, 
            collaborate and celebrate success together.
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    position: 'relative',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: 200,
    opacity: 0.06,
  },
  circle1: {
    width: 300,
    height: 300,
    backgroundColor: colors.primary,
    top: -100,
    right: -100,
  },
  circle2: {
    width: 200,
    height: 200,
    backgroundColor: colors.secondary,
    bottom: -50,
    left: -50,
  },
  circle3: {
    width: 150,
    height: 150,
    backgroundColor: colors.success,
    top: height * 0.3,
    left: -75,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: height * 0.12,
    paddingBottom: 40,
  },
  illustrationContainer: {
    flex: 0.65,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  characterContainer: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  character: {
    position: 'relative',
    zIndex: 2,
  },
  head: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFB088',
    marginBottom: -5,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  face: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  eye: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.text,
    position: 'absolute',
    top: 20,
  },
  leftEye: {
    left: 18,
  },
  rightEye: {
    right: 18,
  },
  smile: {
    width: 20,
    height: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.text,
    borderTopColor: 'transparent',
    position: 'absolute',
    bottom: 18,
  },
  body: {
    width: 90,
    height: 100,
    backgroundColor: colors.primary,
    borderRadius: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 15,
    position: 'relative',
  },
  shirt: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoText: {
    fontSize: 16,
    fontWeight: fontWeights.bold,
    color: colors.primary,
  },
  leftArm: {
    position: 'absolute',
    top: 80,
    left: -25,
    width: 40,
    height: 15,
    backgroundColor: colors.primary,
    borderRadius: 8,
    transform: [{ rotate: '-30deg' }],
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  rightArm: {
    position: 'absolute',
    top: 80,
    right: -25,
    width: 40,
    height: 15,
    backgroundColor: colors.primary,
    borderRadius: 8,
    transform: [{ rotate: '30deg' }],
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  hand: {
    position: 'absolute',
    top: -8,
    left: -15,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: '#FFB088',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trophy: {
    transform: [{ rotate: '30deg' }],
  },
  trophyIcon: {
    fontSize: 14,
  },
  platform: {
    position: 'absolute',
    bottom: -20,
    width: 160,
    height: 40,
    zIndex: 1,
  },
  platformTop: {
    width: '100%',
    height: 25,
    backgroundColor: colors.success,
    borderRadius: 80,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  platformSide: {
    width: '95%',
    height: 15,
    backgroundColor: '#0D9468',
    borderRadius: 60,
    alignSelf: 'center',
    marginTop: -5,
  },
  floatingElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  floatingIcon: {
    position: 'absolute',
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  float1: {
    top: 20,
    right: 30,
    backgroundColor: colors.warningLight,
  },
  float2: {
    bottom: 80,
    right: 20,
    backgroundColor: colors.primaryLight,
  },
  float3: {
    top: 100,
    left: 20,
    backgroundColor: colors.successLight,
  },
  iconText: {
    fontSize: 16,
  },
  textContainer: {
    flex: 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: fontSizes.h1,
    fontWeight: fontWeights.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
    lineHeight: fontSizes.h1 * 1.2,
  },
  subtitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.normal,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: width - 80,
  },
});

export default WelcomeScreen;

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Animated,
  PanResponder,
} from 'react-native';
import { colors } from '../../config/colors';
import { fontSizes, fontWeights } from '../../config/typography';
import { onboardingUtils } from './utils/onboardingUtils';
import WelcomeScreen from './screens/WelcomeScreen';
import FeaturesScreen from './screens/FeaturesScreen';
import FitnessScreen from './screens/FitnessScreen';
import PrivacyScreen from './screens/PrivacyScreen';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  navigation: any;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const screens = [
    { id: 1, component: WelcomeScreen },
    { id: 2, component: FeaturesScreen },
    { id: 3, component: FitnessScreen },
    { id: 4, component: PrivacyScreen },
  ];

  const handleNext = () => {
    if (currentIndex < screens.length - 1) {
      const nextIndex = currentIndex + 1;
      
      // Smooth fade transition
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scrollX, {
          toValue: nextIndex * width,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      
      setCurrentIndex(nextIndex);
    } else {
      handleGetStarted();
    }
  };

  const handleGetStarted = async () => {
    try {
      await onboardingUtils.completeOnboarding();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      navigation.navigate('Login');
    }
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
    },
    onPanResponderGrant: () => {
      scrollX.stopAnimation();
      fadeAnim.stopAnimation();
    },
    onPanResponderMove: (evt, gestureState) => {
      // Create smooth fade effect during swipe
      const progress = Math.abs(gestureState.dx) / (width * 0.3);
      const opacity = Math.max(0.3, 1 - Math.min(progress, 0.7));
      fadeAnim.setValue(opacity);
    },
    onPanResponderRelease: (evt, gestureState) => {
      const threshold = width * 0.2;
      
      if (gestureState.dx > threshold && currentIndex > 0) {
        // Swipe right - go to previous
        const prevIndex = currentIndex - 1;
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
        setCurrentIndex(prevIndex);
      } else if (gestureState.dx < -threshold && currentIndex < screens.length - 1) {
        // Swipe left - go to next
        const nextIndex = currentIndex + 1;
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
        setCurrentIndex(nextIndex);
      } else {
        // Snap back to full opacity
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {screens.map((_, index) => {
          const isActive = index === currentIndex;
          
          return (
            <View
              key={index}
              style={[
                styles.dot,
                isActive && styles.activeDot,
                !isActive && styles.inactiveDot,
                {
                  transform: [{ scale: isActive ? 1.2 : 0.8 }],
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  const isLastScreen = currentIndex === screens.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <View style={styles.screenContainer} {...panResponder.panHandlers}>
        <Animated.View
          style={[
            styles.screensWrapper,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <View key={screens[currentIndex].id} style={styles.screen}>
            {React.createElement(screens[currentIndex].component)}
          </View>
        </Animated.View>
      </View>

      {/* Skip Button - Top Right */}
      {!isLastScreen && (
        <View style={styles.skipButtonContainer}>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleGetStarted}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Floating Dots Indicator */}
      <View style={styles.floatingDotsContainer}>
        <View style={styles.dotsWrapper}>
          {renderDots()}
        </View>
      </View>

      {/* Floating Bottom Button */}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            isLastScreen && styles.getStartedButton
          ]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.buttonText,
            isLastScreen && styles.getStartedText
          ]}>
            {isLastScreen ? '🚀 Get Started' : 'Next →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  screensWrapper: {
    flexDirection: 'row',
    width: width * 4, // 4 screens
    height: '100%',
  },
  screen: {
    width: width,
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 140, // Reduced space for floating elements
  },
  
  // Skip Button Container - Top Right
  skipButtonContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 20,
  },
  skipButton: {
    backgroundColor: `${colors.surface}E0`,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: `${colors.border}40`,
  },
  skipText: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
  },
  
  // Floating Dots Container
  floatingDotsContainer: {
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  dotsWrapper: {
     backgroundColor: `${colors.surface}00`,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 25,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 12,
    height: 8,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginHorizontal: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  inactiveDot: {
    width: 8,
    height: 8,
    borderRadius: 6,
    backgroundColor: `${colors.primary}40`,
    marginHorizontal: 4,
  },
  
  // Floating Button Container - No White Background
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 12,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
    minHeight: 56,
  },
  getStartedButton: {
    backgroundColor: colors.success,
    shadowColor: colors.success,
    borderColor: `${colors.success}30`,
  },
  buttonText: {
    color: colors.surface,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semiBold,
    letterSpacing: 0.8,
  },
  getStartedText: {
    fontSize: fontSizes.lg + 2,
    fontWeight: fontWeights.bold,
  },
});

export default OnboardingScreen;

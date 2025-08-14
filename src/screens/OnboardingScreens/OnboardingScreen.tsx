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
import WelcomeScreen from './WelcomeScreen';
import FitnessScreen from './FitnessScreen';
import FunZoneScreen from './FunZoneScreen';
import PrivacyScreen from './PrivacyScreen';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  navigation: any;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const screens = [
    { id: 1, component: WelcomeScreen },
    { id: 2, component: FitnessScreen },
    { id: 3, component: FunZoneScreen },
    { id: 4, component: PrivacyScreen },
  ];

  const handleNext = () => {
    if (currentIndex < screens.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      Animated.timing(scrollX, {
        toValue: nextIndex * width,
        duration: 300,
        useNativeDriver: false,
      }).start();
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
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
    },
    onPanResponderMove: (evt, gestureState) => {
      const newValue = currentIndex * width - gestureState.dx;
      scrollX.setValue(newValue);
    },
    onPanResponderRelease: (evt, gestureState) => {
      const threshold = width * 0.3;
      
      if (gestureState.dx > threshold && currentIndex > 0) {
        // Swipe right - go to previous
        const prevIndex = currentIndex - 1;
        setCurrentIndex(prevIndex);
        Animated.timing(scrollX, {
          toValue: prevIndex * width,
          duration: 200,
          useNativeDriver: false,
        }).start();
      } else if (gestureState.dx < -threshold && currentIndex < screens.length - 1) {
        // Swipe left - go to next
        handleNext();
      } else {
        // Snap back to current
        Animated.timing(scrollX, {
          toValue: currentIndex * width,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {screens.map((_, index) => {
          const opacity = scrollX.interpolate({
            inputRange: [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          const scale = scrollX.interpolate({
            inputRange: [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ],
            outputRange: [0.8, 1.2, 0.8],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  opacity,
                  transform: [{ scale }],
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
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <View style={styles.screenContainer} {...panResponder.panHandlers}>
        <Animated.View
          style={[
            styles.screensWrapper,
            {
              transform: [
                {
                  translateX: scrollX.interpolate({
                    inputRange: [0, width * (screens.length - 1)],
                    outputRange: [0, -width * (screens.length - 1)],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}
        >
          {screens.map((screen, _index) => (
            <View key={screen.id} style={styles.screen}>
              <screen.component />
            </View>
          ))}
        </Animated.View>
      </View>

      {renderDots()}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {isLastScreen ? 'Get Started' : 'Next'}
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginHorizontal: 4,
  },
  buttonContainer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
    paddingTop: 10,
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: colors.surface,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semiBold,
  },
});

export default OnboardingScreen;

import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Animated,
  FlatList,
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

interface ScreenData {
  id: number;
  component: React.ComponentType<any>;
  key: string;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  // Memoized screens data to prevent re-creation
  const screens = useMemo<ScreenData[]>(() => [
    { id: 1, component: WelcomeScreen, key: 'welcome' },
    { id: 2, component: FeaturesScreen, key: 'features' },
    { id: 3, component: FitnessScreen, key: 'fitness' },
    { id: 4, component: PrivacyScreen, key: 'privacy' },
  ], []);

  const isLastScreen = currentIndex === screens.length - 1;

  const handleNext = () => {
    if (!isLastScreen) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
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

  // Handle viewable items change
  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index ?? 0;
      setCurrentIndex(newIndex);
    }
  }, []);

  // Scroll event handler
  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  // Memoized screen renderer
  const renderScreen = useCallback(({ item }: { item: ScreenData }) => {
    const Component = item.component;
    return (
      <View style={styles.screen}>
        <Component />
      </View>
    );
  }, []);

  // Get item layout for better performance
  const getItemLayout = useCallback((_: any, index: number) => ({
    length: width,
    offset: width * index,
    index,
  }), []);

  // Viewability config
  const viewabilityConfig = useMemo(() => ({
    itemVisiblePercentThreshold: 50,
  }), []);

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {screens.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.2, 0.8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  transform: [{ scale }],
                  opacity,
                  backgroundColor: index === currentIndex ? colors.primary : `${colors.primary}40`,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Optimized FlatList for smooth scrolling */}
      <FlatList
        ref={flatListRef}
        data={screens}
        renderItem={renderScreen}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={getItemLayout}
        scrollEventThrottle={16}
        decelerationRate="fast"
        bounces={false}
        removeClippedSubviews={false}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={4}
        style={styles.flatList}
      />

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

      {/* Floating Dots Indicator with Smooth Animation */}
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
  flatList: {
    flex: 1,
  },
  screen: {
    width: width,
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 140, // Space for floating elements
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
  
  // Floating Dots Container with Smooth Animation
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
    paddingVertical: 8,
    borderRadius: 25,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 5,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: colors.primary,
  },
  
  // Floating Button Container
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

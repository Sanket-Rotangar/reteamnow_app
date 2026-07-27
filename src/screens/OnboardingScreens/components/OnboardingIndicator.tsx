import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { colors } from '../../../config/colors';
import { fontSizes, fontWeights } from '../../../config/typography';

interface OnboardingIndicatorProps {
  totalScreens: number;
  currentIndex: number;
  onDotPress?: (index: number) => void;
  scrollX: any; // Animated.Value
  dotStyle?: 'minimal' | 'elegant' | 'playful';
}

const OnboardingIndicator: React.FC<OnboardingIndicatorProps> = memo(({
  totalScreens,
  currentIndex,
  onDotPress,
  scrollX,
  dotStyle = 'elegant'
}) => {
  const renderMinimalDots = () => (
    <View style={styles.dotsContainer}>
      {Array.from({ length: totalScreens }).map((_, index) => {
        const isActive = index === currentIndex;
        return (
          <TouchableOpacity
            key={index}
            onPress={() => onDotPress?.(index)}
            activeOpacity={0.7}
            style={[
              styles.dot,
              styles.minimalDot,
              isActive && styles.activeDot,
            ]}
          />
        );
      })}
    </View>
  );

  const renderElegantDots = () => (
    <View style={styles.dotsContainer}>
      {Array.from({ length: totalScreens }).map((_, index) => {
        const inputRange = [(index - 1) * 375, index * 375, (index + 1) * 375]; // Assuming width 375
        
        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0.8, 1.3, 0.8],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.4, 1, 0.4],
          extrapolate: 'clamp',
        });

        return (
          <TouchableOpacity
            key={index}
            onPress={() => onDotPress?.(index)}
            activeOpacity={0.7}
            style={styles.dotTouchable}
          >
            <Animated.View
              style={[
                styles.dot,
                styles.elegantDot,
                {
                  transform: [{ scale }],
                  opacity,
                },
              ]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderPlayfulDots = () => (
    <View style={styles.dotsContainer}>
      {Array.from({ length: totalScreens }).map((_, index) => {
        const isActive = index === currentIndex;
        const emoji = ['🚀', '⭐', '🎯', '🏆'][index] || '✨';
        
        return (
          <TouchableOpacity
            key={index}
            onPress={() => onDotPress?.(index)}
            activeOpacity={0.7}
            style={[
              styles.playfulDot,
              isActive && styles.activePlayfulDot,
            ]}
          >
            <Text style={[
              styles.playfulEmoji,
              isActive && styles.activePlayfulEmoji,
            ]}>
              {isActive ? emoji : '○'}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderProgressLine = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBackground} />
      <View 
        style={[
          styles.progressForeground,
          { width: `${((currentIndex + 1) / totalScreens) * 100}%` }
        ]} 
      />
      <Text style={styles.progressText}>
        {currentIndex + 1} of {totalScreens}
      </Text>
    </View>
  );

  switch (dotStyle) {
    case 'minimal':
      return (
        <View style={styles.container}>
          {renderMinimalDots()}
          {renderProgressLine()}
        </View>
      );
    case 'playful':
      return renderPlayfulDots();
    case 'elegant':
    default:
      return renderElegantDots();
  }
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dot: {
    borderRadius: 4,
    marginHorizontal: 4,
  },
  minimalDot: {
    width: 8,
    height: 8,
    backgroundColor: `${colors.primary}40`,
  },
  elegantDot: {
    width: 8,
    height: 8,
    backgroundColor: colors.primary,
  },
  activeDot: {
    width: 12,
    height: 8,
    backgroundColor: colors.primary,
  },
  dotTouchable: {
    padding: 8, // Increased touch area
  },
  playfulDot: {
    padding: 8,
    marginHorizontal: 2,
  },
  activePlayfulDot: {
    transform: [{ scale: 1.2 }],
  },
  playfulEmoji: {
    fontSize: 20,
    opacity: 0.5,
  },
  activePlayfulEmoji: {
    opacity: 1,
  },
  progressContainer: {
    width: '60%',
    height: 4,
    backgroundColor: `${colors.primary}20`,
    borderRadius: 2,
    marginTop: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  progressBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: `${colors.primary}20`,
  },
  progressForeground: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressText: {
    position: 'absolute',
    top: 8,
    left: '50%',
    transform: [{ translateX: -20 }],
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    fontWeight: fontWeights.medium,
  },
});

export default OnboardingIndicator;

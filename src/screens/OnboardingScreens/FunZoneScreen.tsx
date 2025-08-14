import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../../config/colors';
import { fontSizes, fontWeights } from '../../config/typography';

const FunZoneScreen: React.FC = () => {
  const bounceAnim1 = useRef(new Animated.Value(1)).current;
  const bounceAnim2 = useRef(new Animated.Value(1)).current;
  const bounceAnim3 = useRef(new Animated.Value(1)).current;
  const bounceAnim4 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const createBounceAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animations = [
      createBounceAnimation(bounceAnim1, 0),
      createBounceAnimation(bounceAnim2, 150),
      createBounceAnimation(bounceAnim3, 300),
      createBounceAnimation(bounceAnim4, 450),
    ];

    animations.forEach(anim => anim.start());

    return () => {
      animations.forEach(anim => anim.stop());
    };
  }, [bounceAnim1, bounceAnim2, bounceAnim3, bounceAnim4]);

  return (
    <View style={styles.container}>
      <View style={styles.illustrationContainer}>
        <View style={styles.illustration}>
          <View style={styles.eventsGrid}>
            <Animated.View 
              style={[
                styles.eventIcon, 
                styles.gameIcon,
                { transform: [{ scale: bounceAnim1 }] }
              ]}
            >
              <Text style={styles.iconText}>🎮</Text>
              <Text style={styles.iconLabel}>Games</Text>
            </Animated.View>
            
            <Animated.View 
              style={[
                styles.eventIcon, 
                styles.partyIcon,
                { transform: [{ scale: bounceAnim2 }] }
              ]}
            >
              <Text style={styles.iconText}>🎉</Text>
              <Text style={styles.iconLabel}>Events</Text>
            </Animated.View>
            
            <Animated.View 
              style={[
                styles.eventIcon, 
                styles.giftIcon,
                { transform: [{ scale: bounceAnim3 }] }
              ]}
            >
              <Text style={styles.iconText}>🎁</Text>
              <Text style={styles.iconLabel}>Rewards</Text>
            </Animated.View>
            
            <Animated.View 
              style={[
                styles.eventIcon, 
                styles.musicIcon,
                { transform: [{ scale: bounceAnim4 }] }
              ]}
            >
              <Text style={styles.iconText}>🎵</Text>
              <Text style={styles.iconLabel}>Activities</Text>
            </Animated.View>
          </View>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Join the Fun</Text>
        <Text style={styles.subtitle}>Play, participate, and win rewards.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  illustrationContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  illustration: {
    width: 280,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  eventIcon: {
    width: 120,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gameIcon: {
    backgroundColor: colors.primary,
  },
  partyIcon: {
    backgroundColor: colors.secondary,
  },
  giftIcon: {
    backgroundColor: colors.success,
  },
  musicIcon: {
    backgroundColor: colors.warning,
  },
  iconText: {
    fontSize: 24,
    marginBottom: 4,
  },
  iconLabel: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.surface,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.normal,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
});

export default FunZoneScreen;

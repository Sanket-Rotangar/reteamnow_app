import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../../config/colors';
import { fontSizes, fontWeights } from '../../../config/typography';


const FeaturesScreen: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const slideDownAnim = useRef(new Animated.Value(-30)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  // Premium floating animations
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;
  const floatAnim4 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Orchestrated entrance sequence
    const startSequence = () => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(slideUpAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(slideDownAnim, {
            toValue: 0,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    };

    // Start entrance sequence
    const entranceTimer = setTimeout(startSequence, 300);

    // Continuous animations
    const continuousTimer = setTimeout(() => {
      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Rotation animation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 25000,
          useNativeDriver: true,
        })
      ).start();

      // Floating animations
      [floatAnim1, floatAnim2, floatAnim3, floatAnim4].forEach((anim, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: -8 + (index * 2),
              duration: 2000 + (index * 300),
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 8 - (index * 2),
              duration: 2000 + (index * 300),
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    }, 1000);

    return () => {
      clearTimeout(entranceTimer);
      clearTimeout(continuousTimer);
    };
  }, [fadeAnim, slideUpAnim, slideDownAnim, scaleAnim, pulseAnim, rotateAnim, floatAnim1, floatAnim2, floatAnim3, floatAnim4]);

  return (
    <View style={styles.container}>
      {/* Premium Background with Gradient Overlay */}
      <View style={styles.backgroundContainer}>
        <View style={styles.backgroundPattern}>
          <Animated.View 
            style={[
              styles.gradientOrb,
              styles.orb1,
              {
                transform: [
                  {
                    rotate: rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                  { scale: pulseAnim },
                ],
              },
            ]}
          />
          <Animated.View 
            style={[
              styles.gradientOrb,
              styles.orb2,
              {
                transform: [
                  {
                    rotate: rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['360deg', '0deg'],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View 
            style={[
              styles.gradientOrb,
              styles.orb3,
              {
                transform: [
                  { scale: pulseAnim.interpolate({
                    inputRange: [1, 1.08],
                    outputRange: [1, 0.95],
                  }) },
                ],
              },
            ]}
          />
        </View>
        
        <LinearGradient
          colors={[
            `${colors.background}95`,
            `${colors.background}85`,
            `${colors.background}95`,
          ]}
          style={styles.gradientOverlay}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
        />
      </View>

      {/* Premium Center Piece */}
      <Animated.View 
        style={[
          styles.centerPiece,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        <View style={styles.premiumIllustration}>
          {/* Central Trophy with Glow Effects */}
          <Animated.View 
            style={[
              styles.centralHub,
              {
                transform: [{ scale: pulseAnim }],
              }
            ]}
          >
            <LinearGradient
              colors={[colors.warning, `${colors.warning}80`, colors.warning]}
              style={styles.hubGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
            />
            <View style={styles.hubCore}>
              <Text style={styles.hubIcon}>🏆</Text>
            </View>
          </Animated.View>

          {/* Floating Game Icons */}
          <View style={styles.connectionNetwork}>
            {[
              { icon: '🎮', position: styles.node1 },
              { icon: '🎯', position: styles.node2 },
              { icon: '⚡', position: styles.node3 },
              { icon: '🚀', position: styles.node4 },
              { icon: '🏅', position: styles.node5 },
            ].map((node, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.connectionNode,
                  node.position,
                  {
                    transform: [
                      {
                        scale: pulseAnim.interpolate({
                          inputRange: [0.8, 1],
                          outputRange: [0.95 + (index * 0.01), 1.05 + (index * 0.01)],
                        }),
                      },
                    ],
                    opacity: pulseAnim.interpolate({
                      inputRange: [0.8, 1],
                      outputRange: [0.85, 1],
                    }),
                  },
                ]}
              >
                <LinearGradient
                  colors={[colors.surface, `${colors.surface}90`]}
                  style={styles.nodeGradient}
                />
                <Text style={styles.nodeIcon}>{node.icon}</Text>
              </Animated.View>
            ))}
          </View>
        </View>
      </Animated.View>

      {/* Premium Content Section */}
      <Animated.View 
        style={[
          styles.contentSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }],
          }
        ]}
      >
        <Animated.View 
          style={[
            styles.taglineContainer,
            {
              transform: [{ scale: scaleAnim }],
            }
          ]}
        >
          <Text style={styles.primaryTagline}>Compete & Achieve</Text>
          <View style={styles.taglineDivider} />
          <Text style={styles.secondaryTagline}>
            Challenge yourself with exciting competitions and climb the leaderboards
          </Text>
        </Animated.View>

        {/* Feature Highlights */}
        <View style={styles.featureHighlights}>
          <View style={styles.featureGrid}>
            {[
              { 
                icon: '🎯', 
                title: 'Smart Challenges',
                subtitle: 'AI-powered goals',
                color: colors.warning,
                gradient: [colors.warning, `${colors.warning}70`]
              },
              { 
                icon: '📊', 
                title: 'Live Analytics',
                subtitle: 'Real-time insights',
                color: colors.info,
                gradient: [colors.info, `${colors.info}70`]
              },
              { 
                icon: '🏅', 
                title: 'Achievements',
                subtitle: 'Unlock rewards',
                color: colors.success,
                gradient: [colors.success, `${colors.success}70`]
              },
            ].map((feature, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.featureCard,
                  {
                    transform: [
                      { 
                        translateY: slideUpAnim.interpolate({
                          inputRange: [0, 50],
                          outputRange: [0, 30 + (index * 12)],
                        })
                      },
                      {
                        scale: scaleAnim.interpolate({
                          inputRange: [0.8, 1],
                          outputRange: [0.88, 1],
                        })
                      }
                    ],
                    opacity: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1 - (index * 0.08)],
                    })
                  }
                ]}
              >
                {/* Card Background System */}
                <View style={styles.cardBackgroundSystem}>
                  <LinearGradient
                    colors={[colors.surface, `${colors.surface}F8`, colors.surface]}
                    style={styles.cardPrimaryBackground}
                  />
                  <LinearGradient
                    colors={[`${feature.color}08`, 'transparent', `${feature.color}05`]}
                    style={styles.cardAccentGlow}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                  />
                </View>

                {/* Feature Icon Section */}
                <View style={styles.featureIconSection}>
                  <Animated.View 
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor: `${feature.color}15`,
                        transform: [{ 
                          scale: pulseAnim.interpolate({
                            inputRange: [1, 1.08],
                            outputRange: [1, 1.04],
                          })
                        }]
                      }
                    ]}
                  >
                    <LinearGradient
                      colors={feature.gradient}
                      style={styles.iconGradientBg}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 1}}
                    />
                    <Text style={styles.featureIcon}>{feature.icon}</Text>
                  </Animated.View>
                </View>

                {/* Content Section */}
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={[styles.featureSubtitle, { color: `${feature.color}C0` }]}>
                    {feature.subtitle}
                  </Text>
                </View>

                {/* Interactive Elements */}
                <View style={styles.cardInteractiveElements}>
                  {/* Right Border Accent */}
                  <LinearGradient
                    colors={feature.gradient}
                    style={styles.cardRightBorder}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                  />
                  
                  {/* Pulse Indicator */}
                  <Animated.View 
                    style={[
                      styles.cardPulseIndicator,
                      {
                        backgroundColor: feature.color,
                        transform: [{ 
                          scale: pulseAnim.interpolate({
                            inputRange: [1, 1.08],
                            outputRange: [0.8, 1],
                          })
                        }],
                        opacity: pulseAnim.interpolate({
                          inputRange: [1, 1.08],
                          outputRange: [0.3, 0.6],
                        })
                      }
                    ]} 
                  />
                </View>
              </Animated.View>
            ))}
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Premium Background System
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientOrb: {
    position: 'absolute',
    borderRadius: 1000,
  },
  orb1: {
    width: 400,
    height: 400,
    backgroundColor: `${colors.warning}08`,
    top: -100,
    right: -100,
    shadowColor: colors.warning,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 50,
    elevation: 5,
  },
  orb2: {
    width: 300,
    height: 300,
    backgroundColor: `${colors.primary}06`,
    bottom: -50,
    left: -80,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 40,
    elevation: 3,
  },
  orb3: {
    width: 250,
    height: 250,
    backgroundColor: `${colors.success}05`,
    top: '40%',
    right: -60,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 35,
    elevation: 2,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // Premium Center Piece
  centerPiece: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 180,
    zIndex: 5,
  },
  premiumIllustration: {
    position: 'relative',
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centralHub: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 10,
  },
  hubGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 60,
  },
  hubCore: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 20,
    borderWidth: 5,
    borderColor: colors.warning,
  },
  hubIcon: {
    fontSize: 48,
  },

  // Connection Network
  connectionNetwork: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  connectionNode: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 30,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 2,
    borderColor: `${colors.warning}15`,
  },
  nodeIcon: {
    fontSize: 24,
    zIndex: 2,
  },
  
  // Node Positions (arranged in perfect pentagon with better spacing)
  node1: { top: 15, left: '50%', marginLeft: -30 },
  node2: { top: 70, right: 20 },
  node3: { bottom: 50, right: 33 },
  node4: { bottom: 50, left: 33 },
  node5: { top: 70, left: 20 },

  // Premium Content Section
  contentSection: {
    paddingHorizontal: 20,
    alignItems: 'center',
    zIndex: 10,
  },
  taglineContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
    marginTop: 120,
  },
  primaryTagline: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 1,
    lineHeight: fontSizes.xl * 1.3,
  },
  taglineDivider: {
    width: 60,
    height: 3,
    backgroundColor: colors.warning,
    borderRadius: 2,
    marginBottom: 15,
  },
  secondaryTagline: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: fontSizes.md * 1.5,
    letterSpacing: 0.5,
  },

  // Feature Highlights - Horizontal Compact Cards
  featureHighlights: {
    width: '100%',
    alignItems: 'center',
  },
  featureGrid: {
    width: '100%',
    gap: 12,
  },
  featureCard: {
    position: 'relative',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: `${colors.border}15`,
  },
  
  // Card Background System
  cardBackgroundSystem: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardPrimaryBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  cardAccentGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  
  // Icon System - Compact Horizontal
  featureIconSection: {
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconGradientBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    opacity: 0.9,
  },
  featureIcon: {
    fontSize: 24,
    zIndex: 2,
  },
  
  // Content System - Horizontal Compact
  featureContent: {
    flex: 1,
    justifyContent: 'center',
    zIndex: 2,
  },
  featureTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: 4,
    letterSpacing: 0.2,
    lineHeight: fontSizes.md * 1.1,
  },
  featureSubtitle: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    letterSpacing: 0.1,
    lineHeight: fontSizes.sm * 1.2,
    opacity: 0.9,
  },
  
  // Interactive Elements - Horizontal
  cardInteractiveElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  cardRightBorder: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  cardPulseIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});

export default FeaturesScreen;

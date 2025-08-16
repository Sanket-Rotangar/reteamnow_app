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

const PrivacyScreen: React.FC = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Only icon pulse animation
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
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      {/* Premium Background with Gradient Overlay */}
      <View style={styles.backgroundContainer}>
        <View style={styles.backgroundPattern}>
          <View style={[styles.gradientOrb, styles.orb1]} />
          <View style={[styles.gradientOrb, styles.orb2]} />
          <View style={[styles.gradientOrb, styles.orb3]} />
        </View>

        <LinearGradient
          colors={[
            'rgba(52, 152, 219, 0.08)',
            'rgba(155, 89, 182, 0.05)',
            'transparent',
          ]}
          style={styles.gradientOverlay}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
        />
      </View>

      {/* Premium Center Piece */}
      <View style={styles.centerPiece}>
        <View style={styles.premiumIllustration}>
          {/* Central Security Hub */}
          <View style={styles.centralHub}>
            <LinearGradient
              colors={[colors.info, `${colors.info}70`]}
              style={styles.hubGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
            />
            <View style={styles.hubCore}>
              <Text style={styles.hubIcon}>🔒</Text>
            </View>
          </View>

          {/* Floating Security Icons */}
          <View style={styles.connectionNetwork}>
            {[
              { icon: '🛡️', position: styles.node2 },
              { icon: '🔐', position: styles.node3 },
              { icon: '🔑', position: styles.node4 },
              { icon: '👁️', position: styles.node5 },
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
                          inputRange: [1, 1.08],
                          outputRange: [0.95 + (index * 0.01), 1.05 + (index * 0.01)],
                        }),
                      },
                    ],
                    opacity: pulseAnim.interpolate({
                      inputRange: [1, 1.08],
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
      </View>

      {/* Premium Content Section */}
      <View style={styles.contentSection}>
        <View style={styles.taglineContainer}>
          <Text style={styles.primaryTagline}>Security & Privacy</Text>
          <View style={styles.taglineDivider} />
          <Text style={styles.secondaryTagline}>
            Your data is protected with enterprise-grade security measures
          </Text>
        </View>

        {/* Feature Highlights */}
        <View style={styles.featureHighlights}>
          <View style={styles.featureGrid}>
            {[
              { 
                icon: '🔐', 
                title: 'End-to-End Encryption',
                subtitle: 'Military-grade security',
                color: colors.info,
                gradient: [colors.info, `${colors.info}70`]
              },
              { 
                icon: '🛡️', 
                title: 'Data Protection',
                subtitle: 'GDPR compliant',
                color: colors.primary,
                gradient: [colors.primary, `${colors.primary}70`]
              },
              { 
                icon: '🔒', 
                title: 'Secure Storage',
                subtitle: 'Zero-knowledge policy',
                color: colors.warning,
                gradient: [colors.warning, `${colors.warning}70`]
              },
            ].map((feature, index) => (
              <View
                key={index}
                style={styles.featureCard}
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
              </View>
            ))}
          </View>
        </View>
      </View>
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
    backgroundColor: `${colors.info}08`,
    top: -100,
    right: -100,
    shadowColor: colors.info,
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
    backgroundColor: `${colors.warning}05`,
    top: '40%',
    right: -60,
    shadowColor: colors.warning,
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
    borderColor: colors.info,
    zIndex: 4,
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
    borderColor: `${colors.info}15`,
  },
  nodeIcon: {
    fontSize: 24,
    zIndex: 2,
  },
  
  // Node Positions
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
    backgroundColor: colors.info,
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

export default PrivacyScreen;

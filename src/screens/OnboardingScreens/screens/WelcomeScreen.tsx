import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../../config/colors';
import { fontSizes, fontWeights } from '../../../config/typography';

const { height } = Dimensions.get('window');
const WelcomeScreen: React.FC = () => {
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
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    };

    // Premium continuous animations
    const startFloatingAnimations = () => {
      // Sophisticated pulse animation
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

      // Elegant rotation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 25000,
          useNativeDriver: true,
        })
      ).start();

      // Premium floating patterns
      [floatAnim1, floatAnim2, floatAnim3, floatAnim4].forEach((anim, index) => {
        const delay = index * 800;
        const duration = 3000 + (index * 500);
        const range = 12 + (index * 3);
        
        setTimeout(() => {
          Animated.loop(
            Animated.sequence([
              Animated.timing(anim, {
                toValue: -range,
                duration: duration,
                useNativeDriver: true,
              }),
              Animated.timing(anim, {
                toValue: range,
                duration: duration,
                useNativeDriver: true,
              }),
            ])
          ).start();
        }, delay);
      });
    };

    const timer1 = setTimeout(startSequence, 300);
    const timer2 = setTimeout(startFloatingAnimations, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [fadeAnim, slideUpAnim, slideDownAnim, scaleAnim, pulseAnim, rotateAnim, floatAnim1, floatAnim2, floatAnim3, floatAnim4]);

  return (
    <View style={styles.container}>
      {/* Premium Background with Gradient Overlay */}
      <View style={styles.backgroundContainer}>
        {/* Simulated high-quality background pattern */}
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
        
        {/* Premium gradient overlay */}
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

      {/* Hero Section with Premium Typography */}
      <Animated.View 
        style={[
          styles.heroSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideDownAnim }],
          }
        ]}
      >
        <Animated.View 
          style={[
            styles.brandContainer,
            {
              transform: [{ scale: scaleAnim }],
            }
          ]}
        >
          <Text style={styles.brandName}>ReteamNow</Text>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.brandUnderline}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
          />
        </Animated.View>
      </Animated.View>

      {/* Premium Visual Center Piece */}
      <Animated.View 
        style={[
          styles.centerPiece,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideUpAnim },
            ],
          }
        ]}
      >
        <View style={styles.premiumIllustration}>
          {/* Central Hub Design */}
          <Animated.View 
            style={[
              styles.centralHub,
              {
                transform: [{ scale: pulseAnim }],
              }
            ]}
          >
            <LinearGradient
              colors={[`${colors.primary}20`, `${colors.primary}05`]}
              style={styles.hubGradient}
            />
            <View style={styles.hubCore}>
              <Text style={styles.hubIcon}>🤝</Text>
            </View>
          </Animated.View>

          {/* Premium Connection Nodes */}
          <View style={styles.connectionNetwork}>
            {[
              { icon: '👥', position: styles.node1 },
              { icon: '💡', position: styles.node2 },
              { icon: '🎯', position: styles.node3 },
              { icon: '⚡', position: styles.node4 },
              { icon: '🌟', position: styles.node5 },
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

          {/* Connection Lines */}
          <View style={styles.connectionLines}>
            {Array.from({ length: 6 }, (_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.connectionLine,
                  {
                    transform: [
                      { rotate: `${i * 60}deg` },
                      {
                        scaleX: pulseAnim.interpolate({
                          inputRange: [1, 1.08],
                          outputRange: [1, 1.1],
                        }),
                      },
                    ],
                  },
                ]}
              />
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
          <Text style={styles.primaryTagline}>Connect. Collaborate. Thrive.</Text>
          <View style={styles.taglineDivider} />
          <Text style={styles.secondaryTagline}>
            Where workplace relationships flourish and teams achieve extraordinary results together.
          </Text>
        </Animated.View>

        {/* Premium Feature Highlights */}
        <View style={styles.featureHighlights}>
          {[
            { icon: '🎊', text: 'Team Building', color: colors.primary },
            { icon: '📈', text: 'Growth Focus', color: colors.success },
            { icon: '🏆', text: 'Recognition', color: colors.warning },
          ].map((feature, index) => (
            <View
              key={index}
              style={styles.featureHighlight}
            >
              <LinearGradient
                colors={[`${feature.color}12`, `${feature.color}08`]}
                style={styles.featureGradient}
              />
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
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
    // overflow: 'hidden',
  },
  gradientOrb: {
    position: 'absolute',
    borderRadius: 1000,
  },
  orb1: {
    width: 400,
    height: 400,
    backgroundColor: `${colors.primary}08`,
    top: -100,
    right: -100,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 50,
    elevation: 5,
  },
  orb2: {
    width: 300,
    height: 300,
    backgroundColor: `${colors.secondary}06`,
    bottom: -50,
    left: -80,
    shadowColor: colors.secondary,
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

  // Hero Section
  heroSection: {
    paddingTop: height * 0.145,
    paddingHorizontal: 30,
    alignItems: 'center',
    zIndex: 10,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 100,
  },
  brandName: {
    fontSize: fontSizes.xxl + 16,
    fontWeight: fontWeights.bold,
    color: colors.text,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 10,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  brandUnderline: {
    width: 100,
    height: 4,
    borderRadius: 2,
  },

  // Premium Center Piece
  centerPiece: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
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
    borderWidth: 3,
    borderColor: `${colors.primary}20`,
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
    borderColor: `${colors.primary}15`,
  },
  nodeIcon: {
    fontSize: 24,
    zIndex: 2,
  },
  
  // Node Positions (arranged in perfect pentagon with better spacing)
  node1: { top: 15, left: '50%', marginLeft: -30 },
  node2: { top: 70, right: 20 },
  node3: { bottom: 50, right: 43 },
  node4: { bottom: 50, left: 43 },
  node5: { top: 70, left: 20 },

  // Connection Lines
  connectionLines: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectionLine: {
    position: 'absolute',
    width: 100,
    height: 2,
    backgroundColor: `${colors.primary}15`,
    borderRadius: 1,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },

  // Premium Content Section
  contentSection: {
    paddingHorizontal: 30,
    paddingBottom: 50,
    alignItems: 'center',
    zIndex: 10,
  },
  taglineContainer: {
    alignItems: 'center',
    marginTop: 85,
    marginBottom:  15,
    paddingHorizontal: 10,
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
    backgroundColor: colors.primary,
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

  // Feature Highlights
  featureHighlights: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  featureHighlight: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 20,
    position: 'relative',
  },
  featureGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
    color: colors.text,
    textAlign: 'center',
  },
});

export default WelcomeScreen;

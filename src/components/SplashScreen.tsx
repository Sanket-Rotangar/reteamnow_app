/**
 * Enhanced Splash Screen Component
 * 
 * Features:
 * - Animated logo with spring effect
 * - Typewriter effect for app title
 * - Fade-in taglines and branding
 * - Loading indicators
 * - Smooth transitions
 * - Professional branding
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // Animation references
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const loadingOpacity = useRef(new Animated.Value(0)).current;
  const backgroundOpacity = useRef(new Animated.Value(0)).current;

  // State for typewriter effect
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  
  const fullTitle = 'ReteamNow';
  
  useEffect(() => {
    startAnimationSequence();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startAnimationSequence = () => {
    // Background fade in
    Animated.timing(backgroundOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Logo animation with spring effect
    setTimeout(() => {
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Start typewriter effect for title
        startTypewriterEffect();
      });
    }, 300);
  };

  const startTypewriterEffect = () => {
    // Show title container
    Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Typewriter effect
    let currentIndex = 0;
    const typewriterInterval = setInterval(() => {
      if (currentIndex <= fullTitle.length) {
        setDisplayedTitle(fullTitle.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typewriterInterval);
        // Hide cursor after typing is complete
        setTimeout(() => {
          setShowCursor(false);
          showTaglines();
        }, 500);
      }
    }, 100);

    // Cursor blinking effect
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    // Clean up cursor interval when typewriter is done
    setTimeout(() => {
      clearInterval(cursorInterval);
    }, fullTitle.length * 100 + 1000);
  };

  const showTaglines = () => {
    // Show taglines
    Animated.timing(taglineOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      // Show loading indicator
      setTimeout(() => {
        Animated.timing(loadingOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start(() => {
          // Complete splash after loading animation
          setTimeout(() => {
            finishSplash();
          }, 2000);
        });
      }, 800);
    });
  };

  const finishSplash = () => {
    // Fade out animation
    Animated.parallel([
      Animated.timing(backgroundOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(titleOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(taglineOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(loadingOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish();
    });
  };

  return (
    <>
      <StatusBar 
        backgroundColor="#0F0F23" 
        barStyle="light-content" 
        translucent={false}
      />
      <Animated.View 
        style={[
          styles.container,
          {
            opacity: backgroundOpacity,
          }
        ]}
      >
        {/* Background Gradient Effect */}
        <View style={styles.backgroundGradient} />
        
        {/* Logo Section */}
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
            }
          ]}
        >
          <Image
            source={require('../../assets/bootsplash/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Title Section with Typewriter Effect */}
        <Animated.View 
          style={[
            styles.titleContainer,
            {
              opacity: titleOpacity,
            }
          ]}
        >
          <Text style={styles.title}>
            {displayedTitle}
            {showCursor && <Text style={styles.cursor}>|</Text>}
          </Text>
        </Animated.View>

        {/* Tagline Section */}
        <Animated.View 
          style={[
            styles.taglineContainer,
            {
              opacity: taglineOpacity,
            }
          ]}
        >
          <Text style={styles.primaryTagline}>
            Empowering Teams, Enhancing Engagement
          </Text>
          <Text style={styles.secondaryTagline}>
            Where productivity meets happiness
          </Text>
        </Animated.View>

        {/* Loading Section */}
        <Animated.View 
          style={[
            styles.loadingContainer,
            {
              opacity: loadingOpacity,
            }
          ]}
        >
          <ActivityIndicator 
            size="small" 
            color="#8B9FFF" 
            style={styles.loadingSpinner}
          />
          <Text style={styles.loadingText}>
            Preparing your workspace...
          </Text>
        </Animated.View>

        {/* Version Info */}
        <Animated.View 
          style={[
            styles.versionContainer,
            {
              opacity: taglineOpacity,
            }
          ]}
        >
          <Text style={styles.versionText}>v1.0.0</Text>
        </Animated.View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F23',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0F0F23',
    opacity: 0.95,
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  titleContainer: {
    marginBottom: 30,
    alignItems: 'center',
    minHeight: 60,
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1,
    fontFamily: 'System',
  },
  cursor: {
    color: '#6366F1',
    fontSize: 36,
    fontWeight: '300',
  },
  taglineContainer: {
    marginBottom: 60,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  primaryTagline: {
    fontSize: 18,
    color: '#8B9FFF',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  secondaryTagline: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '400',
    letterSpacing: 0.3,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  loadingSpinner: {
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    fontWeight: '400',
  },
  versionContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '300',
  },
});

export default SplashScreen;

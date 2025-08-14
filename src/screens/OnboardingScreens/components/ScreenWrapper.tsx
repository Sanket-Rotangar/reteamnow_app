import React from 'react';
import { StyleSheet, Animated } from 'react-native';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: any;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, style }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, style, { opacity: fadeAnim }]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScreenWrapper;

import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

interface OptimizedScreenWrapperProps {
  children: React.ReactNode;
  screenKey: string;
}

// This wrapper prevents child components from re-mounting
// when scrolling between screens in the FlatList
const OptimizedScreenWrapper: React.FC<OptimizedScreenWrapperProps> = memo(
  ({ children }) => {
    return (
      <View style={styles.wrapper}>
        {children}
      </View>
    );
  },
  // Custom comparison to prevent re-renders unless screenKey changes
  (prevProps, nextProps) => prevProps.screenKey === nextProps.screenKey
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});

export default OptimizedScreenWrapper;

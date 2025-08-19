import { useRef, useMemo, useCallback, useState } from 'react';
import { Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const useOnboardingNavigation = (totalScreens: number) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<any>(null);
  const isScrolling = useRef(false);

  // Optimized viewability config for smooth transitions
  const viewabilityConfig = useMemo(() => ({
    itemVisiblePercentThreshold: 50,
    waitForInteraction: true,
  }), []);

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0 && !isScrolling.current) {
      const newIndex = viewableItems[0].index ?? 0;
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    }
  }, [currentIndex]);

  const onScroll = useMemo(() => 
    Animated.event(
      [{ nativeEvent: { contentOffset: { x: scrollX } } }],
      { useNativeDriver: false }
    ), [scrollX]
  );

  const onScrollBeginDrag = useCallback(() => {
    isScrolling.current = true;
  }, []);

  const onScrollEndDrag = useCallback(() => {
    // Small delay to prevent race conditions
    setTimeout(() => {
      isScrolling.current = false;
    }, 100);
  }, []);

  const navigateToScreen = useCallback((index: number) => {
    if (index >= 0 && index < totalScreens) {
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
      });
    }
  }, [totalScreens]);

  const navigateNext = useCallback(() => {
    if (currentIndex < totalScreens - 1) {
      navigateToScreen(currentIndex + 1);
    }
  }, [currentIndex, totalScreens, navigateToScreen]);

  const navigatePrevious = useCallback(() => {
    if (currentIndex > 0) {
      navigateToScreen(currentIndex - 1);
    }
  }, [currentIndex, navigateToScreen]);

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: width,
    offset: width * index,
    index,
  }), []);

  return {
    currentIndex,
    scrollX,
    flatListRef,
    viewabilityConfig,
    onViewableItemsChanged,
    onScroll,
    onScrollBeginDrag,
    onScrollEndDrag,
    navigateToScreen,
    navigateNext,
    navigatePrevious,
    getItemLayout,
    isLastScreen: currentIndex === totalScreens - 1,
    isFirstScreen: currentIndex === 0,
  };
};

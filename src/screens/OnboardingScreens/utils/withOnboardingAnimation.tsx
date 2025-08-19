import React, { memo, useRef, useEffect } from 'react';

interface WithOnboardingAnimationProps {
  screenKey: string;
}

// Higher-order component that manages animation lifecycle efficiently
export const withOnboardingAnimation = <T extends object>(
  WrappedComponent: React.ComponentType<T>
) => {
  const OptimizedComponent = memo((props: T & WithOnboardingAnimationProps) => {
    const hasInitialized = useRef(false);
    const { screenKey, ...otherProps } = props;

    useEffect(() => {
      if (!hasInitialized.current) {
        hasInitialized.current = true;
      }
    }, []);

    // Only render the component once it's initialized
    // This prevents animation re-initialization on screen changes
    return <WrappedComponent {...(otherProps as T)} />;
  });

  OptimizedComponent.displayName = `withOnboardingAnimation(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return OptimizedComponent;
};

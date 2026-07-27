// src/navigation/AuthStack.tsx
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onboardingUtils } from '../screens/OnboardingScreens/utils/onboardingUtils';
import LoginScreen from '../screens/AuthScreens/LoginScreen';
import RegisterScreen from '../screens/AuthScreens/RegisterScreen';
import RegisterStep2Screen from '../screens/AuthScreens/RegisterStep2Screen';
import OnboardingScreen from '../screens/OnboardingScreens/OnboardingScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const completed = await onboardingUtils.hasCompletedOnboarding();
        setHasCompletedOnboarding(completed);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setHasCompletedOnboarding(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  if (hasCompletedOnboarding === null) {
    // Still loading, don't render anything yet
    return null;
  }

  return (
    <Stack.Navigator 
      id={undefined}
      initialRouteName={hasCompletedOnboarding ? 'Login' : 'Onboarding'}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="RegisterStep2Screen" component={RegisterStep2Screen} />
    </Stack.Navigator>
  );
};

export default AuthStack;

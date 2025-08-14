import AsyncStorage from '@react-native-async-storage/async-storage';

export const ONBOARDING_KEY = 'hasCompletedOnboarding';

export const onboardingUtils = {
  /**
   * Check if user has completed onboarding
   */
  hasCompletedOnboarding: async (): Promise<boolean> => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      return value === 'true';
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  },

  /**
   * Mark onboarding as completed
   */
  completeOnboarding: async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (error) {
      console.error('Error setting onboarding status:', error);
      throw error;
    }
  },

  /**
   * Reset onboarding status (useful for testing)
   */
  resetOnboarding: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
    } catch (error) {
      console.error('Error resetting onboarding status:', error);
      throw error;
    }
  },
};

export default onboardingUtils;

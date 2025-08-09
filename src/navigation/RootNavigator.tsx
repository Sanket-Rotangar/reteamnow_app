import React, { useEffect, useState } from 'react';
import { initialize } from 'react-native-health-connect';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import { ActivityIndicator, View } from 'react-native';

const RootNavigator = () => {
  const [healthConnectInitialized, setHealthConnectInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Your auth state

  useEffect(() => {
    const initApp = async () => {
      try {
        await initialize();
        setHealthConnectInitialized(true);
        console.log("Health Connect client initialized successfully.");
      } catch (e) {
        console.error("Failed to initialize Health Connect client:", e);
        // You might want to set an error state here
        setHealthConnectInitialized(true); // Still proceed, but with an error flag
      }
      // You can also add your authentication logic here
      setIsAuthenticated(true); // Or get it from a token/storage
    };
    initApp();
  }, []);

  if (!healthConnectInitialized) {
    // Show a loading spinner until the client is initialized
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Once initialized, render the rest of your app based on authentication state
  return isAuthenticated ? <AppStack /> : <AuthStack />;
};

export default RootNavigator;
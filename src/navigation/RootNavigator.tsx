import React, { useEffect, useState, useContext } from 'react';
import { initialize } from 'react-native-health-connect';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { AuthContext } from '../context/authContext';
import { HealthProvider } from '../context/healthContext';

const RootNavigator = () => {
  const [healthConnectInitialized, setHealthConnectInitialized] =
    useState(false);
  var { userToken } = useContext(AuthContext);
  useEffect(() => {
    const initApp = async () => {
      try {
        await initialize();
        setHealthConnectInitialized(true);
        console.log('Health Connect client initialized successfully.');
      } catch (e) {
        console.error('Failed to initialize Health Connect client:', e);
        // You might want to set an error state here
        setHealthConnectInitialized(true); // Still proceed, but with an error flag
      }
    };
    initApp();
  }, []);

  if (!healthConnectInitialized) {
    // Show a loading spinner until the client is initialized
    return (
      <View style={styles.view}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Once initialized, render the rest of your app based on authentication state
  // Use userToken directly - if it exists, user is authenticated
  return userToken ?
  <HealthProvider>
   <AppStack />
   </HealthProvider>
   : <AuthStack />;
};

export default RootNavigator;

const styles = StyleSheet.create({
  view: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

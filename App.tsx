/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/authContext';
import BootSplash from 'react-native-bootsplash';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

function App() {
  useEffect(() => {
    const init = async () => {
      // Optional: Add any initialization logic here (e.g. auth check)
      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate loading

      // 👇 Hide bootsplash after app is ready
      BootSplash.hide({ fade: true });
    };

    init();
  }, []);
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </NavigationContainer>
      <Toast />
    </SafeAreaProvider>
  );
}

export default App;

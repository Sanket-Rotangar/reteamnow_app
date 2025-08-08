/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/context/authContext';
import BootSplash from 'react-native-bootsplash';
// import { TamaguiProvider, View } from '@tamagui/core';
// import config from './tamagui.config';
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
    // <TamaguiProvider config={config}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    // </TamaguiProvider>
  );
}

export default App;

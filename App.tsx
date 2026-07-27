import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import BootSplash from 'react-native-bootsplash';

import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/context/authContext';

function App() {
  useEffect(() => {
    const init = async () => {
      // Allow app to settle then hide the boot splash with a fade transition
      await new Promise(resolve => setTimeout(resolve, 1000));
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

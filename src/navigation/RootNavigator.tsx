import React, { useEffect, useState, useContext } from 'react';
import { initialize } from 'react-native-health-connect';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import { AuthContext } from '../context/authContext';
import { HealthProvider } from '../context/healthContext';
import { colors } from '../config/colors';

const RootNavigator = () => {
  const [healthConnectInitialized, setHealthConnectInitialized] = useState(false);
  const [healthConnectError, setHealthConnectError] = useState<string | null>(null);
  const { userToken } = useContext(AuthContext);

  useEffect(() => {
    const initApp = async () => {
      try {
        await initialize();
        setHealthConnectInitialized(true);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        console.warn('Failed to initialize Health Connect client:', e);
        setHealthConnectError(message);
        setHealthConnectInitialized(true); // Proceed without health features
      }
    };
    initApp();
  }, []);

  if (!healthConnectInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const appContent = userToken ? (
    <HealthProvider>
      <AppStack />
    </HealthProvider>
  ) : (
    <AuthStack />
  );

  return (
    <>
      {appContent}
      {healthConnectError && (
        <View style={styles.errorOverlay}>
          <Text style={styles.errorText}>
            ⚠️ Health features unavailable: {healthConnectError}
          </Text>
        </View>
      )}
    </>
  );
};

export default RootNavigator;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
});

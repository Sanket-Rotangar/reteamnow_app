import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { colors } from '../../config/colors';
import { fontSizes, fontWeights } from '../../config/typography';

const PrivacyScreen: React.FC = () => {
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.illustrationContainer}>
        <View style={styles.illustration}>
          {/* Lock/Shield icon */}
          <View style={styles.shieldContainer}>
            <View style={styles.shield}>
              <Text style={styles.lockIcon}>🔒</Text>
            </View>
            <View style={styles.shieldGlow} />
          </View>
          
          {/* Permission toggles */}
          <View style={styles.permissionsContainer}>
            <View style={styles.permissionItem}>
              <View style={styles.permissionInfo}>
                <Text style={styles.permissionTitle}>Allow Tracking</Text>
                <Text style={styles.permissionDesc}>Help improve your experience</Text>
              </View>
              <Switch
                value={trackingEnabled}
                onValueChange={setTrackingEnabled}
                trackColor={{ 
                  false: colors.borderDark, 
                  true: colors.primaryLight 
                }}
                thumbColor={trackingEnabled ? colors.primary : colors.inactive}
                ios_backgroundColor={colors.borderDark}
              />
            </View>
            
            <View style={styles.permissionItem}>
              <View style={styles.permissionInfo}>
                <Text style={styles.permissionTitle}>Enable Notifications</Text>
                <Text style={styles.permissionDesc}>Stay updated with team activities</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ 
                  false: colors.borderDark, 
                  true: colors.primaryLight 
                }}
                thumbColor={notificationsEnabled ? colors.primary : colors.inactive}
                ios_backgroundColor={colors.borderDark}
              />
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Your Data, Your Control</Text>
        <Text style={styles.subtitle}>Secure. Private. Used only for your experience.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  illustrationContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  illustration: {
    width: 300,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldContainer: {
    position: 'relative',
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shield: {
    width: 80,
    height: 90,
    backgroundColor: colors.primary,
    borderRadius: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 2,
  },
  shieldGlow: {
    position: 'absolute',
    width: 100,
    height: 110,
    backgroundColor: colors.primaryLight,
    borderRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    zIndex: 1,
  },
  lockIcon: {
    fontSize: 32,
    color: colors.surface,
  },
  permissionsContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  permissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginVertical: 6,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  permissionInfo: {
    flex: 1,
    marginRight: 15,
  },
  permissionTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text,
    marginBottom: 2,
  },
  permissionDesc: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    color: colors.textSecondary,
  },
  contentContainer: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.normal,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
});

export default PrivacyScreen;

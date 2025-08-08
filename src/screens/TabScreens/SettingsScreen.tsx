/**
 * Settings Screen Component - Profile & Settings Module
 * 
 * This screen implements the Profile & Settings features as per requirements:
 * - View/Edit Profile Info
 * - Change Password
 * - App Preferences (Theme, Notifications, etc.)
 * - Logout
 * 
 * Features modern settings interface with organized sections
 */

import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Alert,
  Switch,
} from 'react-native';
import { AuthContext } from '../../context/authContext';
import { theme } from '../../config/theme';

// Extract colors and other theme values for easier access
const { colors, typography, spacing, borderRadius, shadows, commonStyles } = theme;

/**
 * Interface for user profile
 */
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  employeeId: string;
  joinDate: string;
  phone: string;
}

/**
 * Interface for app preferences
 */
interface AppPreferences {
  darkMode: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  soundEnabled: boolean;
  autoSync: boolean;
}

const SettingsScreen = () => {
  const { logout, userInfo } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  
  // Sample user profile - in real app this would come from API
  const [userProfile] = useState<UserProfile>({
    firstName: userInfo?.fname || 'User',
    lastName: userInfo?.lname || 'Doe',
    email: userInfo?.email || 'john.doe@company.com',
    role: 'Software Developer',
    department: 'Engineering',
    employeeId: 'EMP001',
    joinDate: 'January 15, 2023',
    phone: userInfo?.fname || '+1 (555) 123-4567',
  });

  // App preferences state
  const [preferences, setPreferences] = useState<AppPreferences>({
    darkMode: false,
    pushNotifications: true,
    emailNotifications: true,
    soundEnabled: true,
    autoSync: true,
  });

  /**
   * Handle refresh action
   */
  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call to refresh profile data
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  /**
   * Handle edit profile
   */
  const handleEditProfile = () => {
    Alert.alert(
      'Edit Profile',
      'Profile editing form will be implemented in the next iteration.',
      [{ text: 'OK' }]
    );
  };

  /**
   * Handle change password
   */
  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'Password change form will be implemented in the next iteration.',
      [{ text: 'OK' }]
    );
  };

  /**
   * Handle notification settings
   */
  const handleNotificationSettings = () => {
    Alert.alert(
      'Notification Settings',
      'Detailed notification preferences will be implemented in the next iteration.',
      [{ text: 'OK' }]
    );
  };

  /**
   * Handle privacy settings
   */
  const handlePrivacySettings = () => {
    Alert.alert(
      'Privacy Settings',
      'Privacy and security settings will be implemented in the next iteration.',
      [{ text: 'OK' }]
    );
  };

  /**
   * Handle help & support
   */
  const handleHelpSupport = () => {
    Alert.alert(
      'Help & Support',
      'Contact support or browse FAQ section.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Contact Support' },
        { text: 'View FAQ' },
      ]
    );
  };

  /**
   * Handle about app
   */
  const handleAboutApp = () => {
    Alert.alert(
      'About Employee Hub',
      'Version 1.0.0\n\nDeveloped for employee engagement and productivity.\n\n© 2024 Company Name',
      [{ text: 'OK' }]
    );
  };

  /**
   * Handle logout with confirmation
   */
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  /**
   * Toggle preference setting
   */
  const togglePreference = (key: keyof AppPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile & Settings</Text>
        <Text style={styles.headerSubtitle}>
          Manage your profile and app preferences
        </Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.section}>
          <View style={styles.profileCard}>
            {/* Profile Avatar */}
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {userProfile.firstName.charAt(0)}{userProfile.lastName.charAt(0)}
                </Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  {userProfile.firstName} {userProfile.lastName}
                </Text>
                <Text style={styles.profileRole}>{userProfile.role}</Text>
                <Text style={styles.profileDepartment}>{userProfile.department}</Text>
              </View>
              <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                <Text style={styles.editButtonText}>✏️</Text>
              </TouchableOpacity>
            </View>

            {/* Profile Details */}
            <View style={styles.profileDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email:</Text>
                <Text style={styles.detailValue}>{userProfile.email}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Employee ID:</Text>
                <Text style={styles.detailValue}>{userProfile.employeeId}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Join Date:</Text>
                <Text style={styles.detailValue}>{userProfile.joinDate}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text style={styles.detailValue}>{userProfile.phone}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Account Settings</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleEditProfile}>
            <View style={styles.settingContent}>
              <Text style={styles.settingIcon}>✏️</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Edit Profile</Text>
                <Text style={styles.settingDescription}>Update your personal information</Text>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleChangePassword}>
            <View style={styles.settingContent}>
              <Text style={styles.settingIcon}>🔒</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Change Password</Text>
                <Text style={styles.settingDescription}>Update your account password</Text>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* App Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ App Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingIcon}>🌙</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Dark Mode</Text>
                <Text style={styles.settingDescription}>Enable dark theme</Text>
              </View>
              <Switch
                value={preferences.darkMode}
                onValueChange={() => togglePreference('darkMode')}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingIcon}>🔔</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingDescription}>Receive app notifications</Text>
              </View>
              <Switch
                value={preferences.pushNotifications}
                onValueChange={() => togglePreference('pushNotifications')}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingIcon}>📧</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Email Notifications</Text>
                <Text style={styles.settingDescription}>Receive email updates</Text>
              </View>
              <Switch
                value={preferences.emailNotifications}
                onValueChange={() => togglePreference('emailNotifications')}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingIcon}>🔊</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Sound Effects</Text>
                <Text style={styles.settingDescription}>Enable app sounds</Text>
              </View>
              <Switch
                value={preferences.soundEnabled}
                onValueChange={() => togglePreference('soundEnabled')}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingIcon}>🔄</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Auto Sync</Text>
                <Text style={styles.settingDescription}>Automatically sync data</Text>
              </View>
              <Switch
                value={preferences.autoSync}
                onValueChange={() => togglePreference('autoSync')}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.settingItem} onPress={handleNotificationSettings}>
            <View style={styles.settingContent}>
              <Text style={styles.settingIcon}>⚙️</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Advanced Notifications</Text>
                <Text style={styles.settingDescription}>Customize notification preferences</Text>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Privacy & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔐 Privacy & Security</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handlePrivacySettings}>
            <View style={styles.settingContent}>
              <Text style={styles.settingIcon}>🛡️</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Privacy Settings</Text>
                <Text style={styles.settingDescription}>Manage your privacy preferences</Text>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>❓ Support</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleHelpSupport}>
            <View style={styles.settingContent}>
              <Text style={styles.settingIcon}>📞</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Help & Support</Text>
                <Text style={styles.settingDescription}>Get help or contact support</Text>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleAboutApp}>
            <View style={styles.settingContent}>
              <Text style={styles.settingIcon}>ℹ️</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>About App</Text>
                <Text style={styles.settingDescription}>App version and information</Text>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>🚪 Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

/**
 * Styles for the Settings screen using theme system
 */
const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  header: {
    ...commonStyles.header,
  },
  headerTitle: {
    ...commonStyles.headerTitle,
  },
  headerSubtitle: {
    ...commonStyles.headerSubtitle,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  section: {
    ...commonStyles.section,
  },
  sectionTitle: {
    ...commonStyles.sectionTitle,
  },
  profileCard: {
    ...commonStyles.card,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    ...typography.h4,
    color: colors.surface,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...typography.h5,
    color: colors.text,
    marginBottom: 2,
  },
  profileRole: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: 1,
  },
  profileDepartment: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  editButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent,
  },
  editButtonText: {
    fontSize: 16,
  },
  profileDetails: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  detailLabel: {
    ...typography.subtitle2,
    color: colors.textSecondary,
  },
  detailValue: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    textAlign: 'right',
  },
  settingItem: {
    ...commonStyles.cardSmall,
    marginBottom: 2,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: spacing.md,
    width: 24,
    textAlign: 'center',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    ...typography.subtitle1,
    color: colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  settingArrow: {
    fontSize: 18,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  logoutButton: {
    backgroundColor: colors.error,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  logoutButtonText: {
    ...typography.buttonMedium,
    color: colors.surface,
  },
});

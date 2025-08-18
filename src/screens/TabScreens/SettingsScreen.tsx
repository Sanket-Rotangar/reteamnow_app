/**
 * Settings Screen - Professional Light Theme
 *
 * Following the same 10-30-60 design rule with consistent UI
 * Features: Profile settings, app preferences, security options
 * Modern card-based layout with organized sections
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Switch,
  SafeAreaView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

// Interface for user profile
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  employeeId: string;
  joinDate: string;
  phone: string;
  avatar: string;
}

// Interface for app preferences
interface AppPreferences {
  darkMode: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  soundEnabled: boolean;
  autoSync: boolean;
}

const SettingsScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  
  // Mock user profile data
  const [userProfile] = useState<UserProfile>({
    firstName: 'Sanket',
    lastName: 'Rotangar',
    email: 'sanket.rotangar@company.com',
    role: 'Senior Developer',
    department: 'Engineering',
    employeeId: 'EMP001',
    joinDate: 'Jan 15, 2023',
    phone: '+1 (555) 123-4567',
    avatar: 'https://img.freepik.com/premium-photo/hooded-hacker-logo-mascot_941097-24659.jpg',
  });

  // App preferences state
  const [preferences, setPreferences] = useState<AppPreferences>({
    darkMode: false,
    pushNotifications: true,
    emailNotifications: true,
    soundEnabled: true,
    autoSync: true,
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Toast.show({
        type: 'success',
        text1: 'Settings Updated!',
        text2: 'All preferences synced ✅',
      });
    }, 1000);
  };

  const handleTogglePreference = (key: keyof AppPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
    
    Toast.show({
      type: 'success',
      text1: 'Setting Updated',
      text2: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${!preferences[key] ? 'enabled' : 'disabled'}`,
    });
  };

  const handleEditProfile = () => {
    Toast.show({
      type: 'success',
      text1: 'Edit Profile',
      text2: 'Opening profile editor... ✏️',
    });
  };

  const handleChangePassword = () => {
    Toast.show({
      type: 'success',
      text1: 'Change Password',
      text2: 'Opening security settings... 🔒',
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            Toast.show({
              type: 'success',
              text1: 'Logged Out',
              text2: 'See you soon! 👋',
            });
          },
        },
      ],
    );
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    subtitle: string,
    onPress: () => void,
    rightElement?: React.ReactNode
  ) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Icon name={icon} size={20} color="#007AFF" />
        </View>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightElement || <Icon name="chevron-forward" size={16} color="#8E8E93" />}
      </View>
    </TouchableOpacity>
  );

  const renderPreferenceItem = (
    icon: string,
    title: string,
    subtitle: string,
    preferenceKey: keyof AppPreferences
  ) => (
    <View key={preferenceKey} style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Icon name={icon} size={20} color="#007AFF" />
        </View>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.settingRight}>
        <Switch
          value={preferences[preferenceKey]}
          onValueChange={() => handleTogglePreference(preferenceKey)}
          trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
          thumbColor="#FFFFFF"
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.screenTitle}>Settings</Text>
          <Text style={styles.screenSubtitle}>Profile & Preferences</Text>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => Toast.show({ type: 'success', text1: 'Settings notifications!' })}>
          <Icon name="settings" size={20} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>

        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Profile Information</Text>
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <Image source={{ uri: userProfile.avatar }} style={styles.profileImage} />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  {userProfile.firstName} {userProfile.lastName}
                </Text>
                <Text style={styles.profileRole}>{userProfile.role}</Text>
                <Text style={styles.profileDepartment}>{userProfile.department}</Text>
              </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={handleEditProfile}>
                <Icon name="pencil" size={16} color="#007AFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.profileDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Employee ID</Text>
                <Text style={styles.detailValue}>{userProfile.employeeId}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue}>{userProfile.email}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone</Text>
                <Text style={styles.detailValue}>{userProfile.phone}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Join Date</Text>
                <Text style={styles.detailValue}>{userProfile.joinDate}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔐 Account & Security</Text>
          <View style={styles.settingsCard}>
            {renderSettingItem(
              'key',
              'Change Password',
              'Update your account password',
              handleChangePassword
            )}
            {renderSettingItem(
              'shield-checkmark',
              'Two-Factor Authentication',
              'Enhanced security for your account',
              () => Toast.show({ type: 'success', text1: '2FA Settings', text2: 'Opening security options...' })
            )}
            {renderSettingItem(
              'finger-print',
              'Biometric Login',
              'Use fingerprint or face ID',
              () => Toast.show({ type: 'success', text1: 'Biometric Settings', text2: 'Configure biometric login...' })
            )}
          </View>
        </View>

        {/* App Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎛️ App Preferences</Text>
          <View style={styles.settingsCard}>
            {renderPreferenceItem(
              'moon',
              'Dark Mode',
              'Switch to dark theme',
              'darkMode'
            )}
            {renderPreferenceItem(
              'notifications',
              'Push Notifications',
              'Receive push notifications',
              'pushNotifications'
            )}
            {renderPreferenceItem(
              'mail',
              'Email Notifications',
              'Receive email updates',
              'emailNotifications'
            )}
            {renderPreferenceItem(
              'volume-high',
              'Sound Effects',
              'Enable app sound effects',
              'soundEnabled'
            )}
            {renderPreferenceItem(
              'sync',
              'Auto Sync',
              'Automatically sync data',
              'autoSync'
            )}
          </View>
        </View>

        {/* General Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ General</Text>
          <View style={styles.settingsCard}>
            {renderSettingItem(
              'language',
              'Language',
              'App display language',
              () => Toast.show({ type: 'success', text1: 'Language Settings', text2: 'Select your preferred language...' })
            )}
            {renderSettingItem(
              'time',
              'Time Zone',
              'Set your time zone',
              () => Toast.show({ type: 'success', text1: 'Time Zone', text2: 'Update time zone settings...' })
            )}
            {renderSettingItem(
              'download',
              'Data Usage',
              'Manage data consumption',
              () => Toast.show({ type: 'success', text1: 'Data Usage', text2: 'View data usage statistics...' })
            )}
            {renderSettingItem(
              'trash',
              'Clear Cache',
              'Free up storage space',
              () => Toast.show({ type: 'success', text1: 'Cache Cleared', text2: 'App cache has been cleared!' })
            )}
          </View>
        </View>

        {/* Support & About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📞 Support & About</Text>
          <View style={styles.settingsCard}>
            {renderSettingItem(
              'help-circle',
              'Help Center',
              'Get help and support',
              () => Toast.show({ type: 'success', text1: 'Help Center', text2: 'Opening support resources...' })
            )}
            {renderSettingItem(
              'chatbubble',
              'Contact Support',
              'Reach out to our team',
              () => Toast.show({ type: 'success', text1: 'Contact Support', text2: 'Opening support chat...' })
            )}
            {renderSettingItem(
              'star',
              'Rate the App',
              'Share your feedback',
              () => Toast.show({ type: 'success', text1: 'Rate App', text2: 'Opening app store...' })
            )}
            {renderSettingItem(
              'information-circle',
              'About',
              'App version and information',
              () => Toast.show({ type: 'success', text1: 'About', text2: 'Version 1.0.0 - Built with ❤️' })
            )}
          </View>
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}>
            <Icon name="log-out" size={20} color="#FF3B30" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

/**
 * Styles following the same 10-30-60 design pattern
 */
const styles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  headerLeft: {
    flexDirection: 'column',
  },

  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
  },

  screenSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Content
  content: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  section: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 15,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
    marginBottom: 15,
  },

  // Profile Card
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
  },

  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },

  profileInfo: {
    flex: 1,
  },

  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
    marginBottom: 4,
  },

  profileRole: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    fontFamily: 'SF Pro Text',
    marginBottom: 2,
  },

  profileDepartment: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    paddingTop: 16,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },

  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Text',
  },

  // Settings Card
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
  },

  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },

  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  settingInfo: {
    flex: 1,
  },

  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
    marginBottom: 2,
  },

  settingSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  settingRight: {
    marginLeft: 12,
  },

  // Logout Button
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    gap: 8,
  },

  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    fontFamily: 'SF Pro Display',
  },
});

export default SettingsScreen;

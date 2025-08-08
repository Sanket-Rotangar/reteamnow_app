/**
 * Admin Panel Screen Component
 * 
 * This screen provides admin-only functionality as per requirements:
 * - Post Announcements
 * - Add Picnic Poll Options  
 * - View tagged employees in "Employee of the Month"
 * - Moderate FunZone content
 * 
 * Only visible to admin users with role-based access control
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  RefreshControl,
} from 'react-native';

/**
 * Modern Color Palette
 */
const colors = {
  primary: '#6366F1',
  secondary: '#EC4899',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  accent: '#F3F4F6',
};

/**
 * Interface for admin stats
 */
interface AdminStats {
  totalEmployees: number;
  pendingAnnouncements: number;
  activePollOptions: number;
  pendingModeration: number;
  employeeOfMonth: number;
}

const AdminPanelScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  
  // Sample admin stats - in real app this would come from API
  const [adminStats] = useState<AdminStats>({
    totalEmployees: 156,
    pendingAnnouncements: 3,
    activePollOptions: 4,
    pendingModeration: 7,
    employeeOfMonth: 5,
  });

  /**
   * Handle refresh action
   */
  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call to refresh admin data
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  /**
   * Handle posting new announcement
   */
  const handlePostAnnouncement = () => {
    Alert.alert(
      'Post Announcement',
      'Announcement creation form will be implemented in the next iteration.',
      [{ text: 'OK' }]
    );
  };

  /**
   * Handle adding picnic poll option
   */
  const handleAddPollOption = () => {
    Alert.alert(
      'Add Poll Option',
      'Poll option creation form will be implemented in the next iteration.',
      [{ text: 'OK' }]
    );
  };

  /**
   * Handle viewing employee of the month
   */
  const handleEmployeeOfMonth = () => {
    Alert.alert(
      'Employee of the Month',
      'Employee management interface will be implemented in the next iteration.',
      [{ text: 'OK' }]
    );
  };

  /**
   * Handle FunZone moderation
   */
  const handleFunZoneModeration = () => {
    Alert.alert(
      'FunZone Moderation',
      'Content moderation interface will be implemented in the next iteration.',
      [{ text: 'OK' }]
    );
  };

  /**
   * Handle user management
   */
  const handleUserManagement = () => {
    Alert.alert(
      'User Management',
      'User management interface will be implemented in the next iteration.',
      [{ text: 'OK' }]
    );
  };

  /**
   * Handle app settings
   */
  const handleAppSettings = () => {
    Alert.alert(
      'App Settings',
      'Application settings interface will be implemented in the next iteration.',
      [{ text: 'OK' }]
    );
  };

  /**
   * Handle viewing analytics
   */
  const handleAnalytics = () => {
    Alert.alert(
      'Analytics',
      'Analytics dashboard will be implemented in the next iteration.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <Text style={styles.headerSubtitle}>
          Manage app content and employee engagement
        </Text>
        <View style={styles.adminBadge}>
          <Text style={styles.adminBadgeText}>⚙️ ADMINISTRATOR</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Stats Dashboard */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>📊 Dashboard Overview</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{adminStats.totalEmployees}</Text>
              <Text style={styles.statLabel}>Total Employees</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: colors.warning }]}>
                {adminStats.pendingAnnouncements}
              </Text>
              <Text style={styles.statLabel}>Pending Announcements</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: colors.success }]}>
                {adminStats.activePollOptions}
              </Text>
              <Text style={styles.statLabel}>Active Poll Options</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: colors.error }]}>
                {adminStats.pendingModeration}
              </Text>
              <Text style={styles.statLabel}>Pending Moderation</Text>
            </View>
          </View>
        </View>

        {/* Content Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Content Management</Text>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={handlePostAnnouncement}
          >
            <View style={styles.actionHeader}>
              <Text style={styles.actionIcon}>📢</Text>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Post Announcements</Text>
                <Text style={styles.actionDescription}>
                  Create and publish company-wide announcements
                </Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={handleAddPollOption}
          >
            <View style={styles.actionHeader}>
              <Text style={styles.actionIcon}>🗳️</Text>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Add Picnic Poll Options</Text>
                <Text style={styles.actionDescription}>
                  Add new locations to the picnic voting poll
                </Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={handleFunZoneModeration}
          >
            <View style={styles.actionHeader}>
              <Text style={styles.actionIcon}>🎯</Text>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Moderate FunZone Content</Text>
                <Text style={styles.actionDescription}>
                  Review and moderate employee posts and activities
                </Text>
              </View>
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>
                  {adminStats.pendingModeration}
                </Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Employee Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👥 Employee Management</Text>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={handleEmployeeOfMonth}
          >
            <View style={styles.actionHeader}>
              <Text style={styles.actionIcon}>🏆</Text>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Employee of the Month</Text>
                <Text style={styles.actionDescription}>
                  View tagged employees and manage nominations
                </Text>
              </View>
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>
                  {adminStats.employeeOfMonth}
                </Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={handleUserManagement}
          >
            <View style={styles.actionHeader}>
              <Text style={styles.actionIcon}>👤</Text>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>User Management</Text>
                <Text style={styles.actionDescription}>
                  Manage user accounts, roles, and permissions
                </Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* System Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ System Management</Text>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={handleAnalytics}
          >
            <View style={styles.actionHeader}>
              <Text style={styles.actionIcon}>📈</Text>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Analytics & Reports</Text>
                <Text style={styles.actionDescription}>
                  View app usage statistics and engagement metrics
                </Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={handleAppSettings}
          >
            <View style={styles.actionHeader}>
              <Text style={styles.actionIcon}>🔧</Text>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>App Settings</Text>
                <Text style={styles.actionDescription}>
                  Configure app settings and preferences
                </Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionIcon}>📊</Text>
              <Text style={styles.quickActionText}>View Reports</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionIcon}>💬</Text>
              <Text style={styles.quickActionText}>Send Notification</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionIcon}>🎯</Text>
              <Text style={styles.quickActionText}>Create Event</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionIcon}>📝</Text>
              <Text style={styles.quickActionText}>Backup Data</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

/**
 * Styles for the Admin Panel screen
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.surface,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: `${colors.surface}CC`,
    marginBottom: 12,
  },
  adminBadge: {
    backgroundColor: `${colors.surface}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  adminBadgeText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statsContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  statCard: {
    backgroundColor: colors.surface,
    width: '47%',
    marginHorizontal: '1.5%',
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginTop: 24,
  },
  actionCard: {
    backgroundColor: colors.surface,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  actionArrow: {
    fontSize: 20,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  notificationBadge: {
    backgroundColor: colors.error,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  notificationText: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: 'bold',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 20,
  },
  quickActionButton: {
    backgroundColor: colors.surface,
    width: '47%',
    marginHorizontal: '1.5%',
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AdminPanelScreen;

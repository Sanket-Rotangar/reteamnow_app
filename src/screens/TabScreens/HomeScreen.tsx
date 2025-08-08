/**
 * Home Screen Component - Central Dashboard
 *
 * This screen implements the Dashboard module as per requirements:
 * - Central hub for quick access to Attendance and Announcements
 * - Drawer button and greeting section
 * - Modern UI with card-based layout
 * - Quick actions and highlights
 *
 * Features modern dashboard design with employee engagement elements
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../../config/colors';
import { AuthContext } from '../../context/authContext';
/**
 * Interface for dashboard stats
 */
interface DashboardStats {
  attendanceStatus: 'checked-in' | 'checked-out';
  todayHours: string;
  unreadAnnouncements: number;
  leaveBalance: number;
}

const HomeScreen = () => {
  const { userInfo } = React.useContext(AuthContext);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Sample dashboard data - in real app this would come from API
  const [dashboardStats] = useState<DashboardStats>({
    attendanceStatus: 'checked-out',
    todayHours: '0h 0m',
    unreadAnnouncements: 3,
    leaveBalance: 12,
  });

  /**
   * Update current time every minute
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  /**
   * Get greeting based on time of day
   */
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  /**
   * Get user name from token (in real app, this would come from user profile)
   */
  const getUserName = () => {
    const fullname = userInfo?.fname + ' ' + userInfo?.lname;
    if (userInfo) return fullname.toUpperCase();
    return 'User';
  };

  /**
   * Handle refresh action
   */
  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call to refresh dashboard data
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  /**
   * Handle opening drawer
   */
  const handleOpenDrawer = () => {
    (navigation as any).openDrawer?.();
  };

  /**
   * Format current date
   */
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  /**
   * Format current time
   */
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      {/* Header Section with Drawer Button and Greeting */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {/* Drawer Button */}
          <TouchableOpacity
            style={styles.drawerButton}
            onPress={handleOpenDrawer}
          >
            <Text style={styles.drawerIcon}>☰</Text>
          </TouchableOpacity>
            {/* <Text style={styles.currentTime}>Reteam Now</Text> */}
          {/* Current Time */}
          <Text style={styles.currentTime}>{formatTime(currentTime)}</Text>
        </View>

        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.userName}>{getUserName()}! 👋</Text>
          <Text style={styles.currentDate}>{formatDate(currentTime)}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >

        
        {/* Today's Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Today's Summary</Text>

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Attendance Status</Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        dashboardStats.attendanceStatus === 'checked-in'
                          ? colors.success
                          : colors.warning,
                    },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {dashboardStats.attendanceStatus === 'checked-in'
                      ? 'Checked In'
                      : 'Not Checked In'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Hours Today</Text>
                <Text style={styles.summaryValue}>
                  {dashboardStats.todayHours}
                </Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Leave Balance</Text>
                <Text style={styles.summaryValue}>
                  {dashboardStats.leaveBalance} days
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Highlights Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Highlights</Text>

          <TouchableOpacity
            style={styles.highlightCard}
            onPress={() => navigation.navigate('Announcements' as never)}
          >
            <View style={styles.highlightHeader}>
              <Text style={styles.highlightIcon}>📢</Text>
              <View style={styles.highlightContent}>
                <Text style={styles.highlightTitle}>New Announcements</Text>
                <Text style={styles.highlightDescription}>
                  You have {dashboardStats.unreadAnnouncements} unread
                  announcements
                </Text>
              </View>
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>
                  {dashboardStats.unreadAnnouncements}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.highlightCard}
            onPress={() => navigation.navigate('Leaderboard' as never)}
          >
            <View style={styles.highlightHeader}>
              <Text style={styles.highlightIcon}>�</Text>
              <View style={styles.highlightContent}>
                <Text style={styles.highlightTitle}>Leaderboard</Text>
                <Text style={styles.highlightDescription}>
                  Check your ranking and achievements
                </Text>
              </View>
              <Text style={styles.highlightArrow}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Welcome Message */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>🎉 Welcome to Employee Hub!</Text>
          <Text style={styles.welcomeText}>
            Your central place for attendance, announcements, team activities,
            and more. Stay connected with your colleagues and never miss
            important updates.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

/**
 * Styles for the Home Dashboard screen
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  drawerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.surface}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerIcon: {
    fontSize: 18,
    color: colors.surface,
    fontWeight: 'bold',
  },
  currentTime: {
    fontSize: 16,
    color: colors.surface,
    fontWeight: '600',
  },
  greetingSection: {
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 16,
    color: `${colors.surface}CC`,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.surface,
    marginBottom: 4,
  },
  currentDate: {
    fontSize: 14,
    color: `${colors.surface}99`,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  quickActionCard: {
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
    fontSize: 28,
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  summaryItem: {
    flex: 1,
    marginRight: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.surface,
  },
  highlightCard: {
    backgroundColor: colors.surface,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  highlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  highlightIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  highlightContent: {
    flex: 1,
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  highlightDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  highlightArrow: {
    fontSize: 20,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  notificationBadge: {
    backgroundColor: colors.secondary,
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
  welcomeCard: {
    backgroundColor: colors.surface,
    margin: 0,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

export default HomeScreen;

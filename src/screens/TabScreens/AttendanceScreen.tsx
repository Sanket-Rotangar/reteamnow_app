/**
 * Attendance Screen Component
 *
 * This screen handles all attendance-related functionality as per requirements:
 * - Mark Daily Attendance (single-tap check-in/check-out system)
 * - Leave Application (form to apply for leave with different types)
 * - Leave History (displays all applied leaves with status)
 *
 * Features modern UI with card-based layout and intuitive interactions
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import colors from '../../config/colors'

/**
 * Modern Color Palette
 */
/**
 * Interface for attendance status
 */
interface AttendanceStatus {
  isCheckedIn: boolean;
  checkInTime?: string;
  checkOutTime?: string;
  totalHours?: string;
  date: string;
}

/**
 * Interface for leave application
 */
interface LeaveApplication {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
}

const AttendanceScreen = () => {
  // State management for attendance functionality
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>({
    isCheckedIn: false,
    date: new Date().toDateString(),
  });

  const [refreshing, setRefreshing] = useState(false);
  const [leaveHistory] = useState<LeaveApplication[]>([
    // Sample data - hardcoded leave history
    {
      id: '1',
      type: 'Sick Leave',
      startDate: '2024-01-15',
      endDate: '2024-01-16',
      reason: 'Fever and cold',
      status: 'approved',
      appliedDate: '2024-01-14',
    },
    {
      id: '2',
      type: 'Casual Leave',
      startDate: '2024-01-10',
      endDate: '2024-01-10',
      reason: 'Personal work',
      status: 'pending',
      appliedDate: '2024-01-08',
    },
  ]);

  /**
   * Handle check-in/check-out attendance action - local state only
   */
  const handleAttendanceAction = () => {
    const currentTime = new Date().toLocaleTimeString();

    if (!attendanceStatus.isCheckedIn) {
      // Check-in action
      setAttendanceStatus(prev => ({
        ...prev,
        isCheckedIn: true,
        checkInTime: currentTime,
      }));

      Toast.show({
        type: 'success',
        text1: 'Check in Successful',
        text2: 'Welcome back! 🎉',
        position: 'top',
        visibilityTime: 1000,
        topOffset: 105,
      });
    } else {
      // Check-out action
      const totalHours = calculateWorkHours(
        attendanceStatus.checkInTime!,
        currentTime,
      );
      setAttendanceStatus(prev => ({
        ...prev,
        isCheckedIn: false,
        checkOutTime: currentTime,
        totalHours: totalHours,
      }));

      Toast.show({
        type: 'success',
        text1: 'Check out Successful',
        text2: `You checked out at ${currentTime}`,
        position: 'top',
        visibilityTime: 1000,
        topOffset: 105,
      });
    }
  };

  /**
   * Calculate total work hours between check-in and check-out
   */
  const calculateWorkHours = (checkIn: string, checkOut: string): string => {
    try {
      const checkInDate = new Date(`2024-01-01 ${checkIn}`);
      const checkOutDate = new Date(`2024-01-01 ${checkOut}`);
      const diffMs = checkOutDate.getTime() - checkInDate.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${diffHours}h ${diffMinutes}m`;
    } catch {
      return '0h 0m';
    }
  };

  /**
   * Handle leave application - placeholder
   */
  const handleLeaveApplication = () => {
    Toast.show({
      type: 'error',
      text1: 'Feature Coming Soon.....',
      position: 'top',
      visibilityTime: 1000,
      topOffset: 105,
    });
  };

  /**
   * Handle refresh action - placeholder
   */
  const onRefresh = () => {
    setRefreshing(true);
    // Just reset to default state
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  /**
   * Get status color based on leave application status
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return colors.success;
      case 'rejected':
        return colors.error;
      case 'pending':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  /**
   * Get status text styling
   */
  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={true}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Attendance & Leave</Text>
          <Text style={styles.headerSubtitle}>
            Track your work hours and manage leaves
          </Text>
        </View>
        <View style={styles.container}>
          {/* Current Date Display */}
          <View style={styles.dateCard}>
            <Text style={styles.dateText}>📅 {attendanceStatus.date}</Text>
          </View>

          {/* Attendance Status Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Daily Attendance</Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: attendanceStatus.isCheckedIn
                      ? colors.success
                      : colors.error,
                  },
                ]}
              >
                <Text style={styles.statusBadgeText}>
                  {attendanceStatus.isCheckedIn
                    ? 'Checked In'
                    : 'Not Checked In'}
                </Text>
              </View>
            </View>

            {/* Attendance Details */}
            <View style={styles.attendanceDetails}>
              {attendanceStatus.checkInTime && (
                <View style={styles.timeRow}>
                  <Text style={styles.timeLabel}>Check-in Time:</Text>
                  <Text style={styles.timeValue}>
                    {attendanceStatus.checkInTime}
                  </Text>
                </View>
              )}

              {attendanceStatus.checkOutTime && (
                <View style={styles.timeRow}>
                  <Text style={styles.timeLabel}>Check-out Time:</Text>
                  <Text style={styles.timeValue}>
                    {attendanceStatus.checkOutTime}
                  </Text>
                </View>
              )}

              {attendanceStatus.totalHours && (
                <View style={styles.timeRow}>
                  <Text style={styles.timeLabel}>Total Hours:</Text>
                  <Text style={[styles.timeValue, styles.totalHoursText]}>
                    {attendanceStatus.totalHours}
                  </Text>
                </View>
              )}
            </View>

            {/* Attendance Action Button */}
            <TouchableOpacity
              style={[
                styles.attendanceButton,
                {
                  backgroundColor: attendanceStatus.isCheckedIn
                    ? colors.error
                    : colors.success,
                },
              ]}
              onPress={handleAttendanceAction}
            >
              <Text style={styles.attendanceButtonText}>
                {attendanceStatus.isCheckedIn ? '🚪 Check Out' : '🕘 Check In'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Leave Management Section */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Leave Management</Text>

            {/* Apply for Leave Button */}
            <TouchableOpacity
              style={styles.leaveButton}
              onPress={handleLeaveApplication}
            >
              <Text style={styles.leaveButtonText}>📝 Apply for Leave</Text>
            </TouchableOpacity>
          </View>

          {/* Leave History Section */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Leave History</Text>

            {leaveHistory.length > 0 ? (
              leaveHistory.map(leave => (
                <View key={leave.id} style={styles.leaveItem}>
                  <View style={styles.leaveHeader}>
                    <Text style={styles.leaveType}>{leave.type}</Text>
                    <View
                      style={[
                        styles.leaveStatus,
                        {
                          backgroundColor: `${getStatusColor(leave.status)}20`,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.leaveStatusText,
                          { color: getStatusColor(leave.status) },
                        ]}
                      >
                        {getStatusText(leave.status)}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.leaveDates}>
                    📅 {leave.startDate} to {leave.endDate}
                  </Text>

                  <Text style={styles.leaveReason}>💭 {leave.reason}</Text>

                  <Text style={styles.leaveAppliedDate}>
                    Applied on: {leave.appliedDate}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  📋 No leave applications found
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

/**
 * Styles for modern attendance screen
 */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
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
  },
  scrollContainer: {
    flex: 1,
  },
  dateCard: {
    backgroundColor: colors.surface,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  card: {
    backgroundColor: colors.surface,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.surface,
  },
  attendanceDetails: {
    marginBottom: 20,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  totalHoursText: {
    color: colors.success,
    fontWeight: 'bold',
  },
  attendanceButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  attendanceButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.surface,
  },
  leaveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  leaveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.surface,
  },
  leaveItem: {
    backgroundColor: colors.accent,
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  leaveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  leaveType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  leaveStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  leaveStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  leaveDates: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  leaveReason: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  leaveAppliedDate: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default AttendanceScreen;

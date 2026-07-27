/**
 * Attendance Screen - Professional Light Theme
 *
 * Following the same 10-30-60 design rule with consistent UI
 * Features: Daily attendance, leave application, attendance history
 * Modern card-based layout with intuitive interactions
 */

import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../../context/authContext';
import {
  checkInUser,
  checkOutUser,
  getTodayAttendance,
  getAttendanceHistory,
} from '../../services/attendanceService';
import { checkUnreadRequiredAnnouncements } from '../../services/announcementService';
// Interface for attendance status
interface AttendanceStatus {
  isCheckedIn: boolean;
  checkInTime?: string;
  checkOutTime?: string;
  totalHours?: string;
  date: string;
}

// Interface for leave application
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
  const { userInfo } = useContext(AuthContext);
  const userId = userInfo?._id ?? '';

  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>({
    isCheckedIn: false,
    date: new Date().toDateString(),
  });

  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('today');
  const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);
  const [monthlyPercentage, setMonthlyPercentage] = useState<string>('0%');
  const [daysWorkedThisMonth, setDaysWorkedThisMonth] = useState<number>(0);

  // Load today's attendance on component mount
  useEffect(() => {
    onRefresh();
  }, []);

  // Load attendance history when history tab is selected
  useEffect(() => {
    if (selectedTab === 'history') {
      loadAttendanceHistory();
    }
  }, [selectedTab]);

  // Calculate days worked this month
  const calculateDaysWorkedThisMonth = (history: any[]) => {
    if (!history || history.length === 0) return 0;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthRecords = history.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === currentMonth && 
             recordDate.getFullYear() === currentYear &&
             record.status === 'present' &&
             record.checkInTime;
    });
    
    return currentMonthRecords.length;
  };

  // Calculate monthly attendance percentage
  const calculateMonthlyPercentage = (history: any[]) => {
    if (!history || history.length === 0) return '0%';
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthRecords = history.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === currentMonth && 
             recordDate.getFullYear() === currentYear;
    });
    
    if (currentMonthRecords.length === 0) return '0%';
    
    const presentDays = currentMonthRecords.filter(record => 
      record.status === 'present' && record.checkInTime
    ).length;
    
    const workingDaysInMonth = getCurrentMonthWorkingDays();
    const attendedDays = Math.min(presentDays, workingDaysInMonth);
    const percentage = Math.round((attendedDays / workingDaysInMonth) * 100);
    
    return `${percentage}%`;
  };

  // Calculate working days in current month (excluding weekends)
  const getCurrentMonthWorkingDays = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();
    
    let workingDays = 0;
    for (let day = 1; day <= today; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
        workingDays++;
      }
    }
    
    return Math.max(workingDays, 1); // At least 1 to avoid division by zero
  };

  const loadAttendanceHistory = async () => {
    try {
      const response = await getAttendanceHistory();
      if (response && Array.isArray(response)) {
        setAttendanceHistory(response);
        // Calculate and update monthly percentage
        const percentage = calculateMonthlyPercentage(response);
        setMonthlyPercentage(percentage);
        // Calculate days worked this month
        const daysWorked = calculateDaysWorkedThisMonth(response);
        setDaysWorkedThisMonth(daysWorked);
      }
    } catch (error) {
      console.error('Load history error:', error);
      Toast.show({ 
        type: 'error', 
        text1: 'Failed to load attendance history' 
      });
    }
  };

  const handleAttendanceAction = async () => {
    try {
      if (!attendanceStatus.isCheckedIn) {
        // First check for unread required announcements before allowing check-in
        const unreadCheck = await checkUnreadRequiredAnnouncements(userId);
        
        if (unreadCheck.hasUnreadRequired) {
          Toast.show({
            type: 'error',
            text1: 'Announcements Required',
            text2: `Please read ${unreadCheck.count} required announcement(s) before checking in`,
          });
          // Optionally, navigate to announcements screen
          // navigation.navigate('AnnouncementScreen');
          return;
        }

        const response = await checkInUser();
        if (response && response.attendance) {
          setAttendanceStatus({
            ...attendanceStatus,
            isCheckedIn: true,
            checkInTime: response.attendance.checkInTimeDisplay || response.attendance.checkInTime,
          });
          Toast.show({ type: 'success', text1: 'Checked In Successfully!' });
        }
      } else {
        const response = await checkOutUser();
        if (response && response.attendance) {
          setAttendanceStatus({
            ...attendanceStatus,
            isCheckedIn: false,
            checkOutTime: response.attendance.checkOutTimeDisplay || response.attendance.checkOutTime,
            totalHours: response.attendance.totalHours,
          });
          Toast.show({ type: 'success', text1: 'Checked Out Successfully!' });
        }
      }
    } catch (err: any) {
      // Handle specific error for unread announcements from backend
      if (err.response?.data?.code === 'UNREAD_ANNOUNCEMENTS') {
        Toast.show({
          type: 'error',
          text1: 'Announcements Required',
          text2: err.response?.data?.message || 'Please read required announcements first',
        });
        return;
      }
      
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.response?.data?.message || err.message,
      });
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const response = await getTodayAttendance();
      
      if (response && response.message !== "No record for today") {
        setAttendanceStatus({
          isCheckedIn: !!response.checkInTime && !response.checkOutTime,
          checkInTime: response.checkInTimeDisplay || response.checkInTime,
          checkOutTime: response.checkOutTimeDisplay || response.checkOutTime,
          totalHours: response.totalHours,
          date: response.date || new Date().toDateString(),
        });
      } else {
        // No record for today - reset state
        setAttendanceStatus({
          isCheckedIn: false,
          date: new Date().toDateString(),
        });
      }

      // Also load attendance history for monthly percentage calculation
      try {
        const historyResponse = await getAttendanceHistory();
        if (historyResponse && Array.isArray(historyResponse)) {
          setAttendanceHistory(historyResponse);
          const percentage = calculateMonthlyPercentage(historyResponse);
          setMonthlyPercentage(percentage);
          const daysWorked = calculateDaysWorkedThisMonth(historyResponse);
          setDaysWorkedThisMonth(daysWorked);
        }
      } catch (historyError) {
        console.error('Failed to load attendance history:', historyError);
      }

    } catch (error) {
      console.error('Refresh error:', error);
      Toast.show({ type: 'error', text1: 'Failed to refresh attendance data' });
    } finally {
      setRefreshing(false);
    }
  };

  // Mock leave history data
  const [leaveHistory] = useState<LeaveApplication[]>([
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
    {
      id: '3',
      type: 'Annual Leave',
      startDate: '2023-12-25',
      endDate: '2023-12-26',
      reason: 'Holiday vacation',
      status: 'approved',
      appliedDate: '2023-12-20',
    },
  ]);

  // Format attendance history for display
  const formatAttendanceHistory = (data: any[]) => {
    return data.map(record => ({
      date: new Date(record.date).toLocaleDateString(),
      checkIn: record.checkInTimeDisplay || record.checkInTime || '-',
      checkOut: record.checkOutTimeDisplay || record.checkOutTime || '-',
      hours: record.totalHours || '0h',
      status: record.status || 'absent',
    }));
  };

  const handleApplyLeave = () => {
    Toast.show({
      type: 'success',
      text1: 'Leave Application',
      text2: 'Opening leave form... 📝',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#34C759';
      case 'rejected':
        return '#FF3B30';
      case 'pending':
        return '#FF9500';
      case 'present':
        return '#34C759';
      case 'absent':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  const renderLeaveItem = (leave: LeaveApplication) => (
    <TouchableOpacity
      key={leave.id}
      style={styles.leaveItem}
      activeOpacity={0.8}
    >
      <View style={styles.leaveHeader}>
        <Text style={styles.leaveType}>{leave.type}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(leave.status) },
          ]}
        >
          <Text style={styles.statusText}>{leave.status.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.leaveReason}>{leave.reason}</Text>
      <View style={styles.leaveDetails}>
        <View style={styles.leaveDate}>
          <Icon name="calendar" size={12} color="#8E8E93" />
          <Text style={styles.leaveDateText}>
            {leave.startDate} - {leave.endDate}
          </Text>
        </View>
        <Text style={styles.appliedDate}>Applied: {leave.appliedDate}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderAttendanceItem = (item: any) => (
    <View key={item.date} style={styles.attendanceHistoryItem}>
      <View style={styles.historyLeft}>
        <Text style={styles.historyDate}>{item.date}</Text>
        <View
          style={[
            styles.historyStatusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.historyStatusText}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>
      <View style={styles.historyRight}>
        <View style={styles.timeRow}>
          <Text style={styles.timeLabel}>In:</Text>
          <Text style={styles.timeValue}>{item.checkIn}</Text>
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeLabel}>Out:</Text>
          <Text style={styles.timeValue}>{item.checkOut}</Text>
        </View>
        <Text style={styles.hoursText}>{item.hours}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.screenTitle}>Attendance</Text>
          <Text style={styles.screenSubtitle}>Track your daily presence</Text>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() =>
            Toast.show({ type: 'success', text1: 'Attendance notifications!' })
          }
        >
          <Icon name="calendar" size={20} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Today's Attendance Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Today's Attendance</Text>
          <View style={styles.attendanceCard}>
            <View style={styles.attendanceStatus}>
              <View style={styles.statusInfo}>
                <Text style={styles.statusTitle}>
                  {attendanceStatus.isCheckedIn
                    ? 'Checked In'
                    : 'Not Checked In'}
                </Text>
                <Text style={styles.statusDate}>
                  {new Date().toDateString()}
                </Text>
                {attendanceStatus.checkInTime && (
                  <Text style={styles.checkInTime}>
                    Check-in: {attendanceStatus.checkInTime}
                  </Text>
                )}
                {attendanceStatus.checkOutTime && (
                  <Text style={styles.checkOutTime}>
                    Check-out: {attendanceStatus.checkOutTime}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.attendanceButton,
                  {
                    backgroundColor: attendanceStatus.isCheckedIn
                      ? '#FF3B30'
                      : '#34C759',
                  },
                ]}
                onPress={handleAttendanceAction}
              >
                <Icon
                  name={attendanceStatus.isCheckedIn ? 'exit' : 'enter'}
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.attendanceButtonText}>
                  {attendanceStatus.isCheckedIn ? 'Check Out' : 'Check In'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Today's Summary */}
            <View style={styles.todaySummary}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{daysWorkedThisMonth}</Text>
                <Text style={styles.summaryLabel}>Days This Month</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {attendanceStatus.totalHours || '0h'}
                </Text>
                <Text style={styles.summaryLabel}>Worked Today</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{monthlyPercentage}</Text>
                <Text style={styles.summaryLabel}>Monthly</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleApplyLeave}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#007AFF' }]}>
                <Icon name="calendar-outline" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.actionTitle}>Apply Leave</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() =>
                Toast.show({
                  type: 'success',
                  text1: 'View Schedule',
                  text2: 'Opening calendar...',
                })
              }
              activeOpacity={0.8}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#34C759' }]}>
                <Icon name="time-outline" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.actionTitle}>View Schedule</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() =>
                Toast.show({
                  type: 'success',
                  text1: 'Reports',
                  text2: 'Opening reports...',
                })
              }
              activeOpacity={0.8}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#FF9500' }]}>
                <Icon name="bar-chart-outline" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.actionTitle}>Reports</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() =>
                Toast.show({
                  type: 'success',
                  text1: 'Settings',
                  text2: 'Opening settings...',
                })
              }
              activeOpacity={0.8}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#AF52DE' }]}>
                <Icon name="settings-outline" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.actionTitle}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* History Tabs */}
        <View style={styles.section}>
          <View style={styles.tabContainer}>
            {['today', 'history', 'leaves'].map(tab => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, selectedTab === tab && styles.activeTab]}
                onPress={() => setSelectedTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {selectedTab === 'today' && (
              <View>
                <Text style={styles.tabContentTitle}>📊 Today's Details</Text>
                <View style={styles.todayDetails}>
                  <Text style={styles.detailText}>
                    Track your daily attendance and monitor your work patterns.
                    Your consistency helps maintain team productivity.
                  </Text>
                </View>
              </View>
            )}

            {selectedTab === 'history' && (
              <View>
                <Text style={styles.tabContentTitle}>
                  📈 Attendance History
                </Text>
                {attendanceHistory.length > 0 ? (
                  formatAttendanceHistory(attendanceHistory).map(renderAttendanceItem)
                ) : (
                  <View style={styles.todayDetails}>
                    <Text style={styles.detailText}>
                      No attendance history found. Start marking your attendance to see records here.
                    </Text>
                  </View>
                )}
              </View>
            )}

            {selectedTab === 'leaves' && (
              <View>
                <Text style={styles.tabContentTitle}>📋 Leave History</Text>
                {leaveHistory.map(renderLeaveItem)}
              </View>
            )}
          </View>
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

  // Attendance Card
  attendanceCard: {
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

  attendanceStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },

  statusInfo: {
    flex: 1,
  },

  statusTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
    marginBottom: 4,
  },

  statusDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
    marginBottom: 8,
  },

  checkInTime: {
    fontSize: 13,
    fontWeight: '500',
    color: '#34C759',
    fontFamily: 'SF Pro Text',
  },

  checkOutTime: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FF3B30',
    fontFamily: 'SF Pro Text',
  },

  attendanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },

  attendanceButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'SF Pro Text',
  },

  // Today's Summary
  todaySummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },

  summaryItem: {
    alignItems: 'center',
  },

  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
    marginBottom: 4,
  },

  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  // Actions Grid
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 0.22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
  },

  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  actionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Text',
    textAlign: 'center',
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },

  activeTab: {
    backgroundColor: '#007AFF',
  },

  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  activeTabText: {
    color: '#FFFFFF',
  },

  // Tab Content
  tabContent: {
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

  tabContentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
    marginBottom: 15,
  },

  todayDetails: {
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },

  detailText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
    lineHeight: 20,
  },

  // Leave Items
  leaveItem: {
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 12,
  },

  leaveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  leaveType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'SF Pro Text',
  },

  leaveReason: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
    marginBottom: 8,
  },

  leaveDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  leaveDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  leaveDateText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  appliedDate: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  // Attendance History
  attendanceHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 12,
  },

  historyLeft: {
    flex: 1,
  },

  historyDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
    marginBottom: 4,
  },

  historyStatusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  historyStatusText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'SF Pro Text',
  },

  historyRight: {
    alignItems: 'flex-end',
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  timeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  timeValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Text',
  },

  hoursText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#007AFF',
    fontFamily: 'SF Pro Display',
    marginTop: 4,
  },
});

export default AttendanceScreen;

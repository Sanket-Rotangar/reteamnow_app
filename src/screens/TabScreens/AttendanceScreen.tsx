/**
 * Attendance Screen - Professional Light Theme
 *
 * Following the same 10-30-60 design rule with consistent UI
 * Features: Daily attendance, leave application, attendance history
 * Modern card-based layout with intuitive interactions
 */

import React, { useState } from 'react';
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
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>({
    isCheckedIn: false,
    date: new Date().toDateString(),
  });

  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('today');
  
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

  // Mock attendance history
  const attendanceHistory = [
    { date: 'Aug 16, 2025', checkIn: '9:15 AM', checkOut: '6:30 PM', hours: '8.5h', status: 'present' },
    { date: 'Aug 15, 2025', checkIn: '9:05 AM', checkOut: '6:15 PM', hours: '8.2h', status: 'present' },
    { date: 'Aug 14, 2025', checkIn: '-', checkOut: '-', hours: '0h', status: 'absent' },
    { date: 'Aug 13, 2025', checkIn: '9:00 AM', checkOut: '6:00 PM', hours: '8h', status: 'present' },
  ];

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
        text1: 'Check In Successful!',
        text2: 'Welcome back! 🎯',
      });
    } else {
      // Check-out action
      setAttendanceStatus(prev => ({
        ...prev,
        isCheckedIn: false,
        checkOutTime: currentTime,
        totalHours: '8.5h',
      }));

      Toast.show({
        type: 'success',
        text1: 'Check Out Successful!',
        text2: 'Have a great day! 👋',
      });
    }
  };

  const handleApplyLeave = () => {
    Toast.show({
      type: 'success',
      text1: 'Leave Application',
      text2: 'Opening leave form... 📝',
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Toast.show({
        type: 'success',
        text1: 'Refreshed!',
        text2: 'Attendance data updated ✅',
      });
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return '#34C759';
      case 'rejected': return '#FF3B30';
      case 'pending': return '#FF9500';
      case 'present': return '#34C759';
      case 'absent': return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  const renderLeaveItem = (leave: LeaveApplication) => (
    <TouchableOpacity key={leave.id} style={styles.leaveItem} activeOpacity={0.8}>
      <View style={styles.leaveHeader}>
        <Text style={styles.leaveType}>{leave.type}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(leave.status) }]}>
          <Text style={styles.statusText}>{leave.status.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.leaveReason}>{leave.reason}</Text>
      <View style={styles.leaveDetails}>
        <View style={styles.leaveDate}>
          <Icon name="calendar" size={12} color="#8E8E93" />
          <Text style={styles.leaveDateText}>{leave.startDate} - {leave.endDate}</Text>
        </View>
        <Text style={styles.appliedDate}>Applied: {leave.appliedDate}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderAttendanceItem = (item: any) => (
    <View key={item.date} style={styles.attendanceHistoryItem}>
      <View style={styles.historyLeft}>
        <Text style={styles.historyDate}>{item.date}</Text>
        <View style={[styles.historyStatusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.historyStatusText}>{item.status.toUpperCase()}</Text>
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
          onPress={() => Toast.show({ type: 'success', text1: 'Attendance notifications!' })}>
          <Icon name="calendar" size={20} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>

        {/* Today's Attendance Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Today's Attendance</Text>
          <View style={styles.attendanceCard}>
            <View style={styles.attendanceStatus}>
              <View style={styles.statusInfo}>
                <Text style={styles.statusTitle}>
                  {attendanceStatus.isCheckedIn ? 'Checked In' : 'Not Checked In'}
                </Text>
                <Text style={styles.statusDate}>{new Date().toDateString()}</Text>
                {attendanceStatus.checkInTime && (
                  <Text style={styles.checkInTime}>Check-in: {attendanceStatus.checkInTime}</Text>
                )}
                {attendanceStatus.checkOutTime && (
                  <Text style={styles.checkOutTime}>Check-out: {attendanceStatus.checkOutTime}</Text>
                )}
              </View>
              
              <TouchableOpacity
                style={[
                  styles.attendanceButton,
                  { backgroundColor: attendanceStatus.isCheckedIn ? '#FF3B30' : '#34C759' }
                ]}
                onPress={handleAttendanceAction}>
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
                <Text style={styles.summaryValue}>8.5h</Text>
                <Text style={styles.summaryLabel}>Expected</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{attendanceStatus.totalHours || '0h'}</Text>
                <Text style={styles.summaryLabel}>Worked</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>98%</Text>
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
              activeOpacity={0.8}>
              <View style={[styles.actionIcon, { backgroundColor: '#007AFF' }]}>
                <Icon name="calendar-outline" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.actionTitle}>Apply Leave</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => Toast.show({ type: 'success', text1: 'View Schedule', text2: 'Opening calendar...' })}
              activeOpacity={0.8}>
              <View style={[styles.actionIcon, { backgroundColor: '#34C759' }]}>
                <Icon name="time-outline" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.actionTitle}>View Schedule</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => Toast.show({ type: 'success', text1: 'Reports', text2: 'Opening reports...' })}
              activeOpacity={0.8}>
              <View style={[styles.actionIcon, { backgroundColor: '#FF9500' }]}>
                <Icon name="bar-chart-outline" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.actionTitle}>Reports</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => Toast.show({ type: 'success', text1: 'Settings', text2: 'Opening settings...' })}
              activeOpacity={0.8}>
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
            {['today', 'history', 'leaves'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, selectedTab === tab && styles.activeTab]}
                onPress={() => setSelectedTab(tab)}>
                <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
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
                <Text style={styles.tabContentTitle}>📈 Attendance History</Text>
                {attendanceHistory.map(renderAttendanceItem)}
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

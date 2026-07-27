import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Button,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BarChart } from 'react-native-gifted-charts';
import ProgressRings from '../../components/ProgressRings';
import {
  requestHealthPermissions,
  checkAvailability,
} from '../../services/healthConnectService';
import Toast from 'react-native-toast-message';
import { HealthContext } from '../../context/healthContext';

// Define the types for the props and state
type DailyGoal = {
  day: string;
  achieved: boolean;
};

// A functional component for a single daily goal item
const DailyGoalItem: React.FC<{ goal: DailyGoal }> = ({ goal }) => (
  <View style={styles.dailyGoalItem}>
    <View
      style={[
        styles.dailyGoalCircle,
        goal.achieved && styles.dailyGoalCircleAchieved,
      ]}
    >
      <Text
        style={[
          styles.dailyGoalText,
          goal.achieved && styles.dailyGoalTextAchieved,
        ]}
      >
        {goal.day}
      </Text>
    </View>
  </View>
);

// New reusable component for displaying a single activity value
const ActivityValue: React.FC<{
  color: string;
  loading: boolean;
  value: number;
  label: string;
  unit?: string;
}> = ({ color, loading, value, label, unit }) => (
  <View style={styles.valueRow}>
    <View style={[styles.valueLine, { backgroundColor: color }]} />
    <View style={styles.valueContent}>
      <Text style={styles.activityValueText}>
        {loading ? '...' : value.toLocaleString() || '0'}{' '}
        {unit && <Text style={styles.screenSubtitle}>{unit}</Text>}
      </Text>
      <Text style={styles.activityCategoryText}>{label}</Text>
    </View>
  </View>
);

// New reusable component for a chart card
const ModernChartCard: React.FC<{
  title: string;
  subtitle: string;
  value: number;
  valueColor: string;
  onPress: () => void;
  chartData: any[];
  chartMaxValue: number;
}> = ({
  title,
  subtitle,
  value,
  valueColor,
  onPress,
  chartData,
  chartMaxValue,
}) => (
  <View style={styles.modernChartCard}>
    <TouchableOpacity style={styles.modernCardHeader} onPress={onPress}>
      <View>
        <Text style={styles.modernCardTitle}>{title}</Text>
        <Text style={styles.modernCardSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
    </TouchableOpacity>
    <View style={styles.modernChartContainer}>
      <View style={styles.modernValueSection}>
        <Text style={[styles.modernMainValue, { color: valueColor }]}>
          {value.toLocaleString() || '0'}
        </Text>
        <Text style={[styles.modernValueLabel, { color: valueColor }]}>
          points today
        </Text>
      </View>
      <View style={styles.modernChartSection}>
        <BarChart
          data={chartData}
          height={60}
          barWidth={10}
          spacing={5}
          roundedTop
          hideAxesAndRules
          frontColor={valueColor}
          maxValue={chartMaxValue}
          disableScroll={true}
        />
      </View>
    </View>
  </View>
);

// Centralized data generation function using stable seeded-like values
const generateChartData = (
  days: string[],
  baseValue: number,
  variance: number,
  frontColor: string
) => {
  return days.map((day, index) => ({
    label: day,
    value: baseValue + ((index * 137 + 50) % (variance * 2) - variance),
    frontColor: frontColor,
  }));
};

// Dummy data for charts (last 7 days)
const days = ['T', 'F', 'S', 'S', 'M', 'T', 'W'];
const dailyGoalsData: DailyGoal[] = [
  { day: 'S', achieved: true },
  { day: 'M', achieved: false },
  { day: 'T', achieved: false },
  { day: 'W', achieved: true },
  { day: 'T', achieved: false },
  { day: 'F', achieved: true },
  { day: 'S', achieved: false },
];

// --- Main Component ---
const GoogleFit: React.FC<{ navigation: any }> = ({ navigation }) => {
  const healthContext = useContext(HealthContext);
  const [isAvailable, setIsAvailable] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Use health context data
  const { healthData, loading, refreshHealthData } = healthContext || {
    healthData: { steps: 0, heartRate: 0, calories: 0, distance: 0 },
    loading: false,
    refreshHealthData: async () => {},
  };

  const { steps, heartRate, calories, distance } = healthData;

  const fetchHealthData = useCallback(async () => {
    setRefreshing(true);
    try {
      const startTime = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
      const endTime = new Date().toISOString();

      // Use the health context to refresh data
      await refreshHealthData(startTime, endTime);
    } catch (error) {
      console.error('Error fetching health data:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch health data. Please try again.',
      });
    } finally {
      setRefreshing(false);
    }
  }, [refreshHealthData]);

  // Check for Health Connect availability and fetch data
  useEffect(() => {
    const checkStatus = async () => {
      const available = await checkAvailability();
      setIsAvailable(available);
      if (available) {
        fetchHealthData();
      }
    };
    checkStatus();
  }, [fetchHealthData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHealthData();
  }, [fetchHealthData]);

  const handlePermissionRequest = async () => {
    const granted = await requestHealthPermissions();
    if (granted.length > 0) {
      Toast.show({
        type: 'success',
        text1: 'Permissions granted!',
        text2: 'Fetching health data...',
      });
      fetchHealthData();
    } else {
      Toast.show({
        type: 'error',
        text1: 'Permissions Denied',
        text2: 'Unable to access health data without permissions.',
      });
    }
  };

  if (!isAvailable) {
    return (
      <View style={styles.modalContainer}>
        <Text>Health Connect is not available</Text>
        <Text>Please contact your admin</Text>
        <Button title="Open Health Connect" onPress={checkAvailability} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressViewOffset={20}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.screenTitle}>Fitness Tracker</Text>
            <Text style={styles.screenSubtitle}>Health & Activity</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={handlePermissionRequest}
          >
            <Ionicons name="person" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Today's Activity Card */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <Text style={styles.overviewTitle}>Today's Activity</Text>
            <Text style={styles.overviewDate}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </View>
          <View style={styles.activityLayoutContainer}>
            <View style={styles.activityValuesSection}>
              <ActivityValue
                color="#FF3B30"
                loading={loading}
                value={heartRate}
                label="Heart rate"
                unit="bpm"
              />
              <ActivityValue
                color="#30D158"
                loading={loading}
                value={steps}
                label="Steps"
              />
              <ActivityValue
                color="#007AFF"
                loading={loading}
                value={calories}
                label="Calories burnt"
                unit="kcal"
              />
            </View>
            <View style={styles.progressRingsSection}>
              <ProgressRings
                move={heartRate}
                exercise={steps}
                stand={calories}
                size={150}
              />
            </View>
          </View>
        </View>

        {/* Compact Activity Metrics */}
        <View style={styles.compactMetrics}>
          <View style={styles.compactMetricItem}>
            <View style={[styles.compactMetricIcon, styles.compactMetricIconGreen]}>
              <Ionicons name="walk" size={20} color="#30D158" />
            </View>
            <Text style={styles.compactMetricValue}>
              {loading ? '...' : distance.toFixed(2)}
            </Text>
            <Text style={styles.compactMetricLabel}>km</Text>
          </View>
          <View style={styles.compactMetricItem}>
            <View style={[styles.compactMetricIcon, styles.compactMetricIconBlue]}>
              <Ionicons name="time" size={20} color="#007AFF" />
            </View>
            <Text style={styles.compactMetricValue}>
              {loading ? '...' : '45'}
            </Text>
            <Text style={styles.compactMetricLabel}>min</Text>
          </View>
          <View style={styles.compactMetricItem}>
            <View style={[styles.compactMetricIcon, styles.compactMetricIconOrange]}>
              <Ionicons name="footsteps" size={20} color="#FF9500" />
            </View>
            <Text style={styles.compactMetricValue}>
              {loading ? '...' : steps.toLocaleString()}
            </Text>
            <Text style={styles.compactMetricLabel}>steps</Text>
          </View>
        </View>

        {/* Daily Goals Card */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Your daily goals</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
          <Text style={styles.cardSubtitle}>Last 7 days</Text>
          <View style={styles.dailyGoalsContainer}>
            <View style={styles.goalsProgressText}>
              <Text style={styles.goalsProgressValue}>3/7</Text>
              <Text>Achieved</Text>
            </View>
            <View style={styles.goalsList}>
              {dailyGoalsData.map((goal, index) => (
                <DailyGoalItem key={index} goal={goal} />
              ))}
            </View>
          </View>
        </View>

        {/* Dynamic Chart Cards */}
        <ModernChartCard
          title="Heart Points"
          subtitle="Last 7 days"
          value={heartRate}
          valueColor="#30D158"
          onPress={() => navigation.navigate('HeartPointsDetail')}
          chartData={generateChartData(days, 25, 15, '#30D158')}
          chartMaxValue={40}
        />

        <ModernChartCard
          title="Steps"
          subtitle="Last 7 days"
          value={steps}
          valueColor="#007AFF"
          onPress={() => navigation.navigate('StepsDetail')}
          chartData={generateChartData(days, 10000, 5000, '#007AFF')}
          chartMaxValue={20000}
        />

        <ModernChartCard
          title="Energy Expended"
          subtitle="Last 7 days"
          value={calories}
          valueColor="#FF3B30"
          onPress={() => navigation.navigate('EnergyDetail')}
          chartData={generateChartData(days, 400, 200, '#FF3B30')}
          chartMaxValue={800}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
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
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  overviewCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  overviewTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    fontFamily: 'SF Pro Display',
  },
  overviewDate: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
    fontFamily: 'SF Pro Text',
  },
  activityLayoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activityValuesSection: {
    flex: 1,
    paddingRight: 20,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  valueLine: {
    width: 3,
    height: 24,
    borderRadius: 1.5,
    marginRight: 12,
  },
  valueContent: {
    flex: 1,
  },
  activityValueText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    fontFamily: 'SF Pro Display',
    marginBottom: 2,
  },
  activityCategoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    fontFamily: 'SF Pro Text',
  },
  progressRingsSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactMetrics: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  compactMetricItem: {
    alignItems: 'center',
    flex: 1,
  },
  compactMetricIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  compactMetricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    fontFamily: 'SF Pro Display',
    marginBottom: 2,
  },
  compactMetricLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    fontFamily: 'SF Pro Text',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 15,
    marginBottom: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  modernChartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 12,
    marginBottom: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 0.5,
    borderColor: '#EFEFEF',
  },
  modernCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modernCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
    marginBottom: 2,
  },
  modernCardSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
    fontFamily: 'SF Pro Text',
  },
  modernChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 0,
  },
  modernValueSection: {
    flex: 1,
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  modernChartSection: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginBottom: -6,
    paddingTop: 10,
  },
  modernMainValue: {
    fontSize: 32,
    fontWeight: '800',
    fontFamily: 'SF Pro Display',
    lineHeight: 36,
  },
  modernValueLabel: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'SF Pro Text',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
    marginLeft: 2,
  },
  dailyGoalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  goalsProgressText: {
    flexDirection: 'column',
    fontSize: 16,
    color: '#888',
  },
  goalsProgressValue: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4285F4',
  },
  goalsList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dailyGoalItem: {
    marginHorizontal: 3,
  },
  dailyGoalCircle: {
    width: 25,
    height: 25,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dailyGoalCircleAchieved: {
    backgroundColor: '#e8f5e9',
    borderColor: '#a5d6a7',
  },
  dailyGoalText: {
    fontSize: 14,
    color: '#888',
  },
  dailyGoalTextAchieved: {
    color: '#4caf50',
  },

  // Style constants for inline styles
  compactMetricIconGreen: {
    backgroundColor: '#e9f6eb',
  },
  compactMetricIconBlue: {
    backgroundColor: '#e6f0ff',
  },
  compactMetricIconOrange: {
    backgroundColor: '#fff4e6',
  },
});

export default GoogleFit;
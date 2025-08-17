import React, { useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Button,
  Alert,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProgressRings from '../../components/ProgressRings';
import {
  requestHealthPermissions,
  readSteps,
  // readHeartRate,
  // readExerciseSessions, // Updated function import
  // readActiveCaloriesBurned, // Updated function import
  checkAvailability,
} from '../../services/healthConnectService';

// Define the types for the props and state
type DailyGoal = {
  day: string;
  achieved: boolean;
};

// Dummy data to populate the UI
const dailyGoalsData: DailyGoal[] = [
  { day: 'S', achieved: true },
  { day: 'M', achieved: false },
  { day: 'T', achieved: false },
  { day: 'W', achieved: true },
  { day: 'T', achieved: false },
  { day: 'F', achieved: true },
  { day: 'S', achieved: false },
];

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
const GoogleFit: React.FC = () => {
  const [steps, setSteps] = useState(0);
  // const [heartRate, setHeartRate] = useState(0);
  // const [distance, setDistance] = useState(0);
  // const [speed, setSpeed] = useState(0);
  // const [activeCalories, setActiveCalories] = useState(0); // Renamed state variable
  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      // Check for Health Connect availability
      const available = await checkAvailability();
      setIsAvailable(available);
    };
    checkStatus();
  }, []);

  // Function to fetch health data
  const fetchHealthData = async () => {
    setLoading(true);
    try {
      const timeRange = {
        operator: 'between',
        startTime: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
        endTime: new Date().toISOString(),
      };

      // Steps
      const stepsData = await readSteps(timeRange);
      setSteps(
        (stepsData?.records ?? []).reduce((sum, cur) => sum + cur.count, 0),
      );

      // Heart Rate
      // const heartRateData = await readHeartRate(timeRange);
      // setHeartRate(
      //   (heartRateData?.records ?? []).reduce((sum, cur) => sum + cur.value, 0),
      // );

      // Exercise Sessions (distance & speed)
      // const exerciseSessions = await readExerciseSessions(timeRange);
      // setDistance((exerciseSessions?.records ?? []).reduce((sum, cur) => sum + (cur.distance?.value || 0), 0));
      // setSpeed((exerciseSessions?.records ?? []).reduce((sum, cur) => sum + (cur.speed?.average || 0), 0));

      // Active Calories
      // const activeCaloriesData = await readActiveCaloriesBurned(timeRange);
      // setActiveCalories((activeCaloriesData?.records ?? []).reduce((sum, cur) => sum + cur.value, 0));
    } catch (error) {
      console.error('Error fetching health data:', error);
      Alert.alert('Error', 'Failed to fetch health data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHealthData();

    setTimeout(() => {
      setRefreshing(false);
    }, 100);
  }, []);


  const handlePermissionRequest = async () => {
    const granted = await requestHealthPermissions();
    if (granted.length > 0) {
      Alert.alert('Success', 'Permissions granted! Fetching data...');
      fetchHealthData(); // Call data fetch after permissions are granted
    } else {
      Alert.alert(
        'Permissions Denied',
        'Unable to access health data without permissions.',
      );
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
            progressViewOffset={20} // lowers where the spinner appears
            // distanceToRefresh={30} // only works with some RN versions
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

        {/* Today's Activity Card with New Layout */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <Text style={styles.overviewTitle}>Today's Activity</Text>
            <Text style={styles.overviewDate}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </Text>
          </View>

          {/* Progress Section with Values on Left and Rings on Right */}
          <View style={styles.activityLayoutContainer}>
            <View style={styles.activityValuesSection}>
              <View style={styles.valueRow}>
                <View style={styles.valueLineRed} />
                <View style={styles.valueContent}>
                  <Text style={styles.activityValueText}>
                    {loading ? '...' : (Math.random() * 500 + 200).toFixed(0)}
                  </Text>
                  <Text style={styles.activityCategoryText}>calories</Text>
                </View>
              </View>
              
              <View style={styles.valueRow}>
                <View style={styles.valueLineGreen} />
                <View style={styles.valueContent}>
                  <Text style={styles.activityValueText}>
                    {loading ? '...' : (Math.random() * 60 + 30).toFixed(0)}
                  </Text>
                  <Text style={styles.activityCategoryText}>exercise mins</Text>
                </View>
              </View>
              
              <View style={styles.valueRow}>
                <View style={styles.valueLineBlue} />
                <View style={styles.valueContent}>
                  <Text style={styles.activityValueText}>
                    {loading ? '...' : (Math.random() * 12 + 6).toFixed(0)}
                  </Text>
                  <Text style={styles.activityCategoryText}>stand hours</Text>
                </View>
              </View>
            </View>

            <View style={styles.progressRingsSection}>
              <ProgressRings 
                move={steps / 10000} // Assuming 10k steps goal
                exercise={0.65} // Heart points progress
                stand={0.85} // Move minutes progress
                size={120}
              />
            </View>
          </View>
        </View>

        {/* Compact Activity Metrics */}
        <View style={styles.compactMetrics}>
          <View style={styles.compactMetricItem}>
            <View style={styles.compactMetricIcon}>
              <Ionicons name="walk" size={20} color="#30D158" />
            </View>
            <Text style={styles.compactMetricValue}>
              {loading ? '...' : (Math.random() * 5 + 1).toFixed(1)}
            </Text>
            <Text style={styles.compactMetricLabel}>km</Text>
          </View>

          <View style={styles.compactMetricItem}>
            <View style={styles.compactMetricIcon}>
              <Ionicons name="time" size={20} color="#007AFF" />
            </View>
            <Text style={styles.compactMetricValue}>
              {loading ? '...' : (Math.random() * 60 + 30).toFixed(0)}
            </Text>
            <Text style={styles.compactMetricLabel}>min</Text>
          </View>

          <View style={styles.compactMetricItem}>
            <View style={styles.compactMetricIcon}>
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
            <Text style={styles.chevron}>&gt;</Text>
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

        {/* Weekly Target Card */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Your weekly target</Text>
            <Text style={styles.chevron}>&gt;</Text>
          </TouchableOpacity>
          <Text style={styles.cardSubtitle}>4 - 10 Aug</Text>
          {/* Placeholder for the weekly progress bar */}
          <Text style={styles.goalsProgressValue}>4 of 150</Text>
          <View style={styles.weeklyProgressBarContainer}>
            <View style={styles.weeklyProgressBar} />
          </View>
          <Text style={styles.cardText}>
            Scoring 150 Heart Points a week can...
          </Text>
        </View>
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
  // Consistent Header Styles (matching other screens)
  consistentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  consistentHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    fontFamily: 'SF Pro Display',
  },
  consistentHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  consistentIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  consistentProfileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Overview Card Styles
  overviewCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
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
  // New Activity Layout Container
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
  valueLineRed: {
    width: 3,
    height: 24,
    backgroundColor: '#FF3B30',
    borderRadius: 1.5,
    marginRight: 12,
  },
  valueLineGreen: {
    width: 3,
    height: 24,
    backgroundColor: '#30D158',
    borderRadius: 1.5,
    marginRight: 12,
  },
  valueLineBlue: {
    width: 3,
    height: 24,
    backgroundColor: '#007AFF',
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
  // Compact Metrics Styles
  compactMetrics: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
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
    backgroundColor: '#f8f9fa',
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
  // Modern Header Styles (kept for reference but not used)
  modernHeader: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    fontFamily: 'SF Pro Display',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 2,
    fontFamily: 'SF Pro Text',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modernIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modernProfileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  profileIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Progress Rings Container (legacy)
  progressRingsContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  progressRingsWrapper: {
    marginBottom: 20,
  },
  progressLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    fontFamily: 'SF Pro Text',
  },
  // Quick Stats (legacy)
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
    fontFamily: 'SF Pro Display',
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    fontFamily: 'SF Pro Text',
  },
  // Activity Summary
  activitySummary: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityDetails: {
    flex: 1,
  },
  activityValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
    fontFamily: 'SF Pro Display',
  },
  activityLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    fontFamily: 'SF Pro Text',
  },
  activityProgress: {
    width: 60,
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    marginLeft: 16,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#30D158',
    borderRadius: 2,
  },
  // Keep existing styles for the rest of the screen
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
  timeText: {
    fontSize: 16,
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  progressTextContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  heartPtsValue: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#26a69a',
  },
  stepsValue: {
    fontSize: 20,
    color: '#479aff',
    fontWeight: 'bold',
  },
  statsIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  statsIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  statsIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  statsLabel: {
    fontSize: 16,
    color: '#333',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    marginBottom: 20,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#479aff',
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#888',
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
  chevron: {
    fontSize: 24,
    color: '#888',
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
  weeklyProgressBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginTop: 5,
  },
  weeklyProgressBar: {
    width: '40%', // Dummy progress
    height: '100%',
    backgroundColor: '#4285F4',
    borderRadius: 5,
  },
  cardText: {
    fontSize: 14,
    color: '#888',
    marginTop: 10,
  },
});

export default GoogleFit;

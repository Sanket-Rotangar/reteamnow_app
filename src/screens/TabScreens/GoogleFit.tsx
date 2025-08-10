import React, { useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Button,
  Alert,
  RefreshControl,
} from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import {
  requestHealthPermissions,
  readSteps,
  readHeartRate,
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

const mainCircleProgress = {
  radius: 80,
  strokeWidth: 10,
  progress: 75, // Assuming 75% progress for the inner circle
};

const mainCircleSteps = {
  radius: 90,
  strokeWidth: 10,
  progress: 50, // Assuming 50% progress for the outer circle
};

const { radius, strokeWidth } = mainCircleProgress;
const circumference = 2 * Math.PI * radius;
const strokeDashoffset =
  circumference - (mainCircleProgress.progress / 100) * circumference;

const stepsRadius = mainCircleSteps.radius;
const stepsCircumference = 2 * Math.PI * stepsRadius;
const stepsStrokeDashoffset =
  stepsCircumference - (mainCircleSteps.progress / 100) * stepsCircumference;

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
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
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
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={styles.timeText}>Fitness Connect</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Text style={{ fontSize: 24 }}>ⓘ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profilePic}
              onPress={handlePermissionRequest}
            >
              <Text style={{ fontSize: 24, marginLeft: 6, marginTop: 3 }}>
                👤
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Progress Circle Section */}
        <View style={styles.progressContainer}>
          <Svg height={220} width={220} viewBox="0 0 220 220">
            <G rotation="-90" origin="110, 110">
              {/* Outer circle (steps) */}
              <Circle
                cx="110"
                cy="110"
                r={stepsRadius}
                stroke="#c3e8ff"
                strokeWidth={mainCircleSteps.strokeWidth}
                fill="transparent"
              />
              <Circle
                cx="110"
                cy="110"
                r={stepsRadius}
                stroke="#479aff"
                strokeWidth={mainCircleSteps.strokeWidth}
                fill="transparent"
                strokeDasharray={stepsCircumference}
                strokeDashoffset={stepsStrokeDashoffset}
                strokeLinecap="round"
              />

              {/* Inner circle (heart pts) */}
              <Circle
                cx="110"
                cy="110"
                r={radius}
                stroke="#e0f2f1"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <Circle
                cx="110"
                cy="110"
                r={radius}
                stroke="#26a69a"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </G>
          </Svg>
          <View style={styles.progressTextContainer}>
            <Text style={styles.heartPtsValue}>
              {loading ? '...' : (Math.random() * 100 + 1).toFixed(0)}
            </Text>
            <Text style={styles.stepsValue}>{loading ? '...' : steps}</Text>
          </View>
        </View>

        {/* Heart Points and Steps Icons */}
        <View style={styles.statsIconsContainer}>
          <View style={styles.statsIconRow}>
            <Text style={styles.statsIcon}>💙</Text>
            <Text style={styles.statsLabel}>Heart Pts</Text>
          </View>
          <View style={styles.statsIconRow}>
            <Text style={styles.statsIcon}>👟</Text>
            <Text style={styles.statsLabel}>Steps</Text>
          </View>
        </View>

        {/* Cal, km, Move Min */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>
              {loading ? '...' : Math.random().toFixed(2)}
            </Text>
            <Text style={styles.metricLabel}>Cal</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>
              {loading ? '...' : Math.random().toFixed(2)}
            </Text>
            <Text style={styles.metricLabel}>km</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>
              {loading ? '...' : Math.random().toFixed(2)}
            </Text>
            <Text style={styles.metricLabel}>Move Min</Text>
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
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
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

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BarChart } from 'react-native-gifted-charts';

type TimeRange = 'weekly' | 'monthly';

const StepsDetailScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('weekly');

  const weeklyData = [
    { label: 'Mon', value: 8420, frontColor: '#007AFF' },
    { label: 'Tue', value: 12350, frontColor: '#007AFF' },
    { label: 'Wed', value: 6780, frontColor: '#007AFF' },
    { label: 'Thu', value: 15240, frontColor: '#007AFF' },
    { label: 'Fri', value: 9870, frontColor: '#007AFF' },
    { label: 'Sat', value: 11560, frontColor: '#007AFF' },
    { label: 'Sun', value: 932, frontColor: '#007AFF' },
  ];

  const monthlyData = [
    { label: 'Week 1', value: 68420, frontColor: '#007AFF' },
    { label: 'Week 2', value: 75350, frontColor: '#007AFF' },
    { label: 'Week 3', value: 62180, frontColor: '#007AFF' },
    { label: 'Week 4', value: 81240, frontColor: '#007AFF' },
  ];

  const currentData = selectedRange === 'weekly' ? weeklyData : monthlyData;
  const currentValue = selectedRange === 'weekly' ? 932 : 81240;
  const currentLabel = selectedRange === 'weekly' ? 'Today' : 'This Week';
  const goal = selectedRange === 'weekly' ? 10000 : 70000;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Steps</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Current Value Section */}
        <View style={styles.valueCard}>
          <Text style={styles.currentValue}>{currentValue.toLocaleString()}</Text>
          <Text style={styles.currentValueLabel}>steps</Text>
          <Text style={styles.currentValueSubtitle}>{currentLabel}</Text>
        </View>

        {/* Time Range Selector */}
        <View style={styles.rangeSelector}>
          <TouchableOpacity
            style={[
              styles.rangeButton,
              selectedRange === 'weekly' && styles.rangeButtonActive,
            ]}
            onPress={() => setSelectedRange('weekly')}
          >
            <Text
              style={[
                styles.rangeButtonText,
                selectedRange === 'weekly' && styles.rangeButtonTextActive,
              ]}
            >
              Weekly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.rangeButton,
              selectedRange === 'monthly' && styles.rangeButtonActive,
            ]}
            onPress={() => setSelectedRange('monthly')}
          >
            <Text
              style={[
                styles.rangeButtonText,
                selectedRange === 'monthly' && styles.rangeButtonTextActive,
              ]}
            >
              Monthly
            </Text>
          </TouchableOpacity>
        </View>

        {/* Chart Section */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>
            Steps - {selectedRange === 'weekly' ? 'Last 7 Days' : 'Last 4 Weeks'}
          </Text>
          <View style={styles.chartContainer}>
            <BarChart
              data={currentData}
              width={320}
              height={200}
              barWidth={selectedRange === 'weekly' ? 35 : 60}
              spacing={selectedRange === 'weekly' ? 15 : 20}
              roundedTop
              roundedBottom
              frontColor="#007AFF"
              yAxisThickness={1}
              xAxisThickness={1}
              yAxisColor="#E5E5EA"
              xAxisColor="#E5E5EA"
              yAxisTextStyle={styles.axisText}
              xAxisLabelTextStyle={styles.axisText}
              maxValue={selectedRange === 'weekly' ? 16000 : 85000}
              noOfSections={4}
              yAxisLabelWidth={50}
            />
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsCard}>
          <View style={styles.tipHeader}>
            <Ionicons name="walk" size={24} color="#007AFF" />
            <Text style={styles.tipsTitle}>Steps Tips</Text>
          </View>
          <Text style={styles.tipText}>
            Walking is one of the easiest ways to stay active. Aim for 10,000 steps per day to maintain good health and fitness.
          </Text>
          <Text style={styles.tipText}>
            Every step counts! Even short walks throughout the day can add up to significant health benefits.
          </Text>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#007AFF" />
            <Text style={styles.tipItemText}>Park farther away from entrances</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#007AFF" />
            <Text style={styles.tipItemText}>Take walking meetings when possible</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#007AFF" />
            <Text style={styles.tipItemText}>Use a standing desk periodically</Text>
          </View>
        </View>

        {/* Goal Section */}
        <View style={styles.goalCard}>
          <Text style={styles.goalTitle}>Daily Goal</Text>
          <Text style={styles.goalSubtitle}>Current Progress</Text>
          <View style={styles.goalProgress}>
            <View style={styles.goalProgressBar}>
              <View style={[styles.goalProgressFill, { width: `${(currentValue / goal) * 100}%` }]} />
            </View>
            <Text style={styles.goalProgressText}>
              {currentValue.toLocaleString()} / {goal.toLocaleString()} steps
            </Text>
          </View>
          <Text style={styles.goalMessage}>
            {currentValue >= goal 
              ? "Congratulations! You've reached your daily goal!" 
              : `${(goal - currentValue).toLocaleString()} more steps to reach your goal!`}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    fontFamily: 'SF Pro Display',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  valueCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  currentValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#007AFF',
    fontFamily: 'SF Pro Display',
  },
  currentValueLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    fontFamily: 'SF Pro Text',
    marginTop: -4,
  },
  currentValueSubtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    fontFamily: 'SF Pro Text',
    marginTop: 8,
  },
  rangeSelector: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  rangeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  rangeButtonActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  rangeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    fontFamily: 'SF Pro Text',
  },
  rangeButtonTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 20,
    fontFamily: 'SF Pro Display',
  },
  chartContainer: {
    alignItems: 'center',
  },
  axisText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'SF Pro Text',
  },
  tipsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: 12,
    fontFamily: 'SF Pro Display',
  },
  tipText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 12,
    fontFamily: 'SF Pro Text',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  tipItemText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
    fontFamily: 'SF Pro Text',
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
    fontFamily: 'SF Pro Display',
  },
  goalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontFamily: 'SF Pro Text',
  },
  goalProgress: {
    marginBottom: 12,
  },
  goalProgressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 8,
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  goalProgressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
    fontFamily: 'SF Pro Display',
  },
  goalMessage: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'SF Pro Text',
  },
});

export default StepsDetailScreen;

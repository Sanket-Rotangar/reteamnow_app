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

const EnergyDetailScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('weekly');

  const weeklyData = [
    { label: 'Mon', value: 280, frontColor: '#007AFF' },
    { label: 'Tue', value: 350, frontColor: '#007AFF' },
    { label: 'Wed', value: 180, frontColor: '#007AFF' },
    { label: 'Thu', value: 420, frontColor: '#007AFF' },
    { label: 'Fri', value: 310, frontColor: '#007AFF' },
    { label: 'Sat', value: 380, frontColor: '#007AFF' },
    { label: 'Sun', value: 225, frontColor: '#007AFF' },
  ];

  const monthlyData = [
    { label: 'Week 1', value: 2100, frontColor: '#007AFF' },
    { label: 'Week 2', value: 2450, frontColor: '#007AFF' },
    { label: 'Week 3', value: 1980, frontColor: '#007AFF' },
    { label: 'Week 4', value: 2680, frontColor: '#007AFF' },
  ];

  const currentData = selectedRange === 'weekly' ? weeklyData : monthlyData;
  const currentValue = selectedRange === 'weekly' ? 225 : 2680;
  const currentLabel = selectedRange === 'weekly' ? 'Today' : 'This Week';
  const goal = selectedRange === 'weekly' ? 300 : 2000;

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
        <Text style={styles.headerTitle}>Energy Expended</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Current Value Section */}
        <View style={styles.valueCard}>
          <Text style={styles.currentValue}>{currentValue.toLocaleString()}</Text>
          <Text style={styles.currentValueLabel}>cal</Text>
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
            Calories Burned - {selectedRange === 'weekly' ? 'Last 7 Days' : 'Last 4 Weeks'}
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
              maxValue={selectedRange === 'weekly' ? 500 : 3000}
              noOfSections={4}
              yAxisLabelWidth={50}
            />
          </View>
        </View>

        {/* Activity Breakdown */}
        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Activity Breakdown</Text>
          <View style={styles.breakdownItem}>
            <View style={styles.breakdownIcon}>
              <Ionicons name="walk" size={20} color="#30D158" />
            </View>
            <View style={styles.breakdownContent}>
              <Text style={styles.breakdownLabel}>Walking</Text>
              <Text style={styles.breakdownValue}>120 cal</Text>
            </View>
            <Text style={styles.breakdownPercentage}>53%</Text>
          </View>
          <View style={styles.breakdownItem}>
            <View style={styles.breakdownIcon}>
              <Ionicons name="bicycle" size={20} color="#007AFF" />
            </View>
            <View style={styles.breakdownContent}>
              <Text style={styles.breakdownLabel}>Cycling</Text>
              <Text style={styles.breakdownValue}>85 cal</Text>
            </View>
            <Text style={styles.breakdownPercentage}>38%</Text>
          </View>
          <View style={styles.breakdownItem}>
            <View style={styles.breakdownIcon}>
              <Ionicons name="fitness" size={20} color="#FF6B35" />
            </View>
            <View style={styles.breakdownContent}>
              <Text style={styles.breakdownLabel}>Exercise</Text>
              <Text style={styles.breakdownValue}>20 cal</Text>
            </View>
            <Text style={styles.breakdownPercentage}>9%</Text>
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsCard}>
          <View style={styles.tipHeader}>
            <Ionicons name="flash" size={24} color="#FF9500" />
            <Text style={styles.tipsTitle}>Energy Tips</Text>
          </View>
          <Text style={styles.tipText}>
            Burning calories through physical activity helps maintain a healthy weight and improves cardiovascular health.
          </Text>
          <Text style={styles.tipText}>
            The more intense the activity, the more calories you burn. Mix different types of activities for best results.
          </Text>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#30D158" />
            <Text style={styles.tipItemText}>Try high-intensity interval training (HIIT)</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#30D158" />
            <Text style={styles.tipItemText}>Add strength training 2-3 times per week</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#30D158" />
            <Text style={styles.tipItemText}>Stay consistent with daily movement</Text>
          </View>
        </View>

        {/* Goal Section */}
        <View style={styles.goalCard}>
          <Text style={styles.goalTitle}>Calorie Goal</Text>
          <Text style={styles.goalSubtitle}>Current Progress</Text>
          <View style={styles.goalProgress}>
            <View style={styles.goalProgressBar}>
              <View style={[styles.goalProgressFill, { width: `${Math.min((currentValue / goal) * 100, 100)}%` }]} />
            </View>
            <Text style={styles.goalProgressText}>
              {currentValue.toLocaleString()} / {goal.toLocaleString()} cal
            </Text>
          </View>
          <Text style={styles.goalMessage}>
            {currentValue >= goal 
              ? "Excellent! You've exceeded your calorie goal!" 
              : `${(goal - currentValue).toLocaleString()} more calories to reach your goal!`}
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
  breakdownCard: {
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
  breakdownTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
    fontFamily: 'SF Pro Display',
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  breakdownIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  breakdownContent: {
    flex: 1,
  },
  breakdownLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    fontFamily: 'SF Pro Text',
  },
  breakdownValue: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'SF Pro Text',
  },
  breakdownPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    fontFamily: 'SF Pro Display',
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

export default EnergyDetailScreen;

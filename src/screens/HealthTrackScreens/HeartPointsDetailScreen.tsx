import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BarChart } from 'react-native-gifted-charts';

// Define the types for the component's state
type TimeRange = 'weekly' | 'monthly';

// Mock data for the charts. In a real app, this would be fetched from a service.
const weeklyData = [
  { label: 'Mon', value: 12, frontColor: '#30D158' },
  { label: 'Tue', value: 8, frontColor: '#30D158' },
  { label: 'Wed', value: 15, frontColor: '#30D158' },
  { label: 'Thu', value: 22, frontColor: '#30D158' },
  { label: 'Fri', value: 18, frontColor: '#30D158' },
  { label: 'Sat', value: 25, frontColor: '#30D158' },
  { label: 'Sun', value: 19, frontColor: '#30D158' },
];

const monthlyData = [
  { label: 'Week 1', value: 95, frontColor: '#30D158' },
  { label: 'Week 2', value: 112, frontColor: '#30D158' },
  { label: 'Week 3', value: 88, frontColor: '#30D158' },
  { label: 'Week 4', value: 134, frontColor: '#30D158' },
];

// const SCREEN_WIDTH = Dimensions.get('window').width;

// Reusable component for the slider-style tab selector
const TabSelector: React.FC<{
  selectedRange: TimeRange;
  onSelect: (range: TimeRange) => void;
}> = ({ selectedRange, onSelect }) => (
  <View style={styles.tabSelectorContainer}>
    <TouchableOpacity
      style={[
        styles.tabButton,
        selectedRange === 'weekly' && styles.tabButtonActive,
      ]}
      onPress={() => onSelect('weekly')}
    >
      <Text style={[
        styles.tabText,
        selectedRange === 'weekly' && styles.tabTextActive,
      ]}>
        Weekly
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[
        styles.tabButton,
        selectedRange === 'monthly' && styles.tabButtonActive,
      ]}
      onPress={() => onSelect('monthly')}
    >
      <Text style={[
        styles.tabText,
        selectedRange === 'monthly' && styles.tabTextActive,
      ]}>
        Monthly
      </Text>
    </TouchableOpacity>
  </View>
);

const HeartPointsDetailScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('weekly');
  // New state to store the chart's dynamic width
  const [chartWidth, setChartWidth] = useState(0);

  // Logic to determine which data and values to display
  const currentData = selectedRange === 'weekly' ? weeklyData : monthlyData;
  const totalValue = currentData.reduce((sum, item) => sum + item.value, 0);

  // Dynamic props for the BarChart
  const chartProps =
    selectedRange === 'weekly'
      ? {
          barWidth: 20,
          spacing: 20,
          maxValue: 30,
        }
      : {
          barWidth: 40,
          spacing: 30,
          maxValue: 150,
        };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header and Tab Selector */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Heart Points</Text>
        {/* Placeholder to balance the header layout */}
        <View style={styles.headerRightPlaceholder} /> 
      </View>
      
      {/* Tab Selector placed directly below the header */}
      <View style={styles.tabContainer}>
        <TabSelector
          selectedRange={selectedRange}
          onSelect={setSelectedRange}
        />
      </View>

      <ScrollView style={styles.content}>
        {/* Main Chart Card */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>
              {selectedRange === 'weekly' ? 'Last 7 Days' : 'Last 4 Weeks'}
            </Text>
            <View style={styles.chartValueContainer}>
              <Text style={styles.totalValueText}>
                {totalValue}
                <Text style={styles.totalValueUnit}> pts</Text>
              </Text>
            </View>
          </View>
          <View 
            style={styles.chart}
            // Use onLayout to dynamically set the chart's width
            onLayout={(event) => setChartWidth(event.nativeEvent.layout.width)}
          >
            {/* Only render the chart when the width has been measured */}
            {chartWidth > 0 && (
              <BarChart
                data={currentData}
                width={chartWidth}
                height={220}
                {...chartProps}
                roundedTop
                roundedBottom
                frontColor="#30D158"
                yAxisThickness={1}
                xAxisThickness={1}
                yAxisColor="#E5E5EA"
                xAxisColor="#E5E5EA"
                yAxisTextStyle={styles.axisText}
                xAxisLabelTextStyle={styles.axisText}
                noOfSections={4}
                yAxisLabelWidth={30}
              />
            )}
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsCard}>
          <View style={styles.tipHeader}>
            <Ionicons name="bulb" size={24} color="#FF9500" />
            <Text style={styles.tipsTitle}>Heart Points Tips</Text>
          </View>
          <Text style={styles.tipText}>
            Earn Heart Points for any activity that gets your heart pumping. You
            get one point for each minute of moderate activity like a brisk
            walk, and two points for more vigorous activities like running.
          </Text>
          <Text style={styles.tipText}>
            Aim for at least 150 Heart Points per week, as recommended by the
            World Health Organization, to stay healthy.
          </Text>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#30D158" />
            <Text style={styles.tipItemText}>
              Take the stairs instead of the elevator
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#30D158" />
            <Text style={styles.tipItemText}>
              Go for a 10-minute walk after meals
            </Text>
          </View>
        </View>

        {/* Weekly Goal Section */}
        <View style={styles.goalCard}>
          <Text style={styles.goalTitle}>Weekly Goal</Text>
          <Text style={styles.goalSubtitle}>Current Progress</Text>
          <View style={styles.goalProgress}>
            <View style={styles.goalProgressBar}>
              <View style={styles.goalProgressFillCurrent} />
            </View>
            <Text style={styles.goalProgressText}>
              {weeklyData.reduce((sum, item) => sum + item.value, 0)} / 150 pts
            </Text>
          </View>
          <Text style={styles.goalMessage}>
            You're doing great! Keep up the activity to reach your weekly goal.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'SF Pro Display',
  },
  headerRightPlaceholder: {
    width: 40,
  },
  tabContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  tabSelectorContainer: {
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },
  tabTextActive: {
    fontWeight: '600',
    color: '#1D1D1F',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
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
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    fontFamily: 'SF Pro Display',
  },
  chartValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalValueText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#30D158',
    fontFamily: 'SF Pro Display',
  },
  totalValueUnit: {
    fontSize: 14,
    fontWeight: '500',
    color: '#30D158',
    fontFamily: 'SF Pro Text',
  },
  chart: {
    alignItems: 'center',
  },
  axisText: {
    fontSize: 12,
    color: '#8E8E93',
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
    backgroundColor: '#EFEFEF',
    borderRadius: 4,
    marginBottom: 8,
  },
  goalProgressFillCurrent: {
    height: '100%',
    backgroundColor: '#30D158',
    borderRadius: 4,
    // Calculate progress based on the weekly data
    width: `${(weeklyData.reduce((sum, item) => sum + item.value, 0) / 150) * 100}%`,
  },
  goalProgressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#30D158',
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

export default HeartPointsDetailScreen;

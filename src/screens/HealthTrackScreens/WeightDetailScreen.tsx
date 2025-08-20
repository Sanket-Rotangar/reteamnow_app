import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LineChart } from 'react-native-gifted-charts';

type TimeRange = 'monthly' | 'yearly';

const WeightDetailScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('monthly');
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [newWeight, setNewWeight] = useState('');

  const monthlyData = [
    { value: 75.2, label: 'Jun 1' },
    { value: 74.8, label: 'Jun 15' },
    { value: 74.5, label: 'Jul 1' },
    { value: 74.0, label: 'Jul 15' },
    { value: 73.8, label: 'Aug 1' },
    { value: 73.5, label: 'Aug 15' },
  ];

  const yearlyData = [
    { value: 76.5, label: 'Jan' },
    { value: 75.8, label: 'Feb' },
    { value: 75.2, label: 'Mar' },
    { value: 74.9, label: 'Apr' },
    { value: 74.5, label: 'May' },
    { value: 74.0, label: 'Jun' },
    { value: 73.8, label: 'Jul' },
    { value: 73.5, label: 'Aug' },
  ];

  const currentData = selectedRange === 'monthly' ? monthlyData : yearlyData;
  const currentValue = 73.5;
  const currentLabel = '8 Aug';

  const handleAddWeight = () => {
    if (newWeight && !isNaN(Number(newWeight))) {
      Alert.alert('Success', `Weight ${newWeight} kg recorded for today`);
      setNewWeight('');
      setShowAddWeight(false);
    } else {
      Alert.alert('Error', 'Please enter a valid weight');
    }
  };

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
        <Text style={styles.headerTitle}>Weight</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddWeight(!showAddWeight)}
        >
          <Ionicons name="add" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Current Value Section */}
        <View style={styles.valueCard}>
          <Text style={styles.currentValue}>{currentValue}</Text>
          <Text style={styles.currentValueLabel}>kg</Text>
          <Text style={styles.currentValueSubtitle}>{currentLabel}</Text>
        </View>

        {/* Add Weight Section */}
        {showAddWeight && (
          <View style={styles.addWeightCard}>
            <Text style={styles.addWeightTitle}>Add New Weight</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.weightInput}
                value={newWeight}
                onChangeText={setNewWeight}
                placeholder="Enter weight"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              <Text style={styles.inputUnit}>kg</Text>
            </View>
            <View style={styles.addWeightActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddWeight(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddWeight}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Time Range Selector */}
        <View style={styles.rangeSelector}>
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
              3 Months
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.rangeButton,
              selectedRange === 'yearly' && styles.rangeButtonActive,
            ]}
            onPress={() => setSelectedRange('yearly')}
          >
            <Text
              style={[
                styles.rangeButtonText,
                selectedRange === 'yearly' && styles.rangeButtonTextActive,
              ]}
            >
              1 Year
            </Text>
          </TouchableOpacity>
        </View>

        {/* Chart Section */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>
            Weight Trend - {selectedRange === 'monthly' ? 'Last 3 Months' : 'Last Year'}
          </Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={currentData}
              width={320}
              height={200}
              color="#007AFF"
              thickness={3}
              curved
              areaChart
              startFillColor="#007AFF"
              startOpacity={0.1}
              endFillColor="#007AFF"
              endOpacity={0.01}
              yAxisThickness={1}
              xAxisThickness={1}
              yAxisColor="#E5E5EA"
              xAxisColor="#E5E5EA"
              yAxisTextStyle={styles.axisText}
              xAxisLabelTextStyle={styles.axisText}
              noOfSections={4}
              yAxisLabelWidth={40}
              spacing={selectedRange === 'monthly' ? 45 : 35}
            />
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsCard}>
          <View style={styles.tipHeader}>
            <Ionicons name="fitness" size={24} color="#FF6B35" />
            <Text style={styles.tipsTitle}>Weight Management Tips</Text>
          </View>
          <Text style={styles.tipText}>
            Maintaining a healthy weight is about balance. Focus on sustainable habits rather than quick fixes.
          </Text>
          <Text style={styles.tipText}>
            Track your weight consistently, but don't obsess over daily fluctuations. Weekly trends are more meaningful.
          </Text>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#30D158" />
            <Text style={styles.tipItemText}>Weigh yourself at the same time daily</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#30D158" />
            <Text style={styles.tipItemText}>Stay hydrated throughout the day</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#30D158" />
            <Text style={styles.tipItemText}>Focus on whole, unprocessed foods</Text>
          </View>
        </View>

        {/* BMI Section */}
        <View style={styles.goalCard}>
          <Text style={styles.goalTitle}>Body Mass Index (BMI)</Text>
          <Text style={styles.goalSubtitle}>Based on current weight</Text>
          <View style={styles.bmiContainer}>
            <Text style={styles.bmiValue}>22.8</Text>
            <Text style={styles.bmiStatus}>Normal Weight</Text>
          </View>
          <Text style={styles.goalMessage}>
            Your BMI is in the normal range. Keep maintaining your healthy lifestyle!
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 64,
    fontWeight: '700',
    color: '#007AFF',
    fontFamily: 'SF Pro Display',
  },
  currentValueLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007AFF',
    fontFamily: 'SF Pro Text',
    marginTop: -8,
  },
  currentValueSubtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    fontFamily: 'SF Pro Text',
    marginTop: 8,
  },
  addWeightCard: {
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
  addWeightTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
    fontFamily: 'SF Pro Display',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  weightInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#1a1a1a',
    paddingVertical: 16,
    fontFamily: 'SF Pro Text',
  },
  inputUnit: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginLeft: 8,
    fontFamily: 'SF Pro Text',
  },
  addWeightActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    fontFamily: 'SF Pro Text',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'SF Pro Text',
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
  bmiContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  bmiValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#30D158',
    fontFamily: 'SF Pro Display',
  },
  bmiStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#30D158',
    fontFamily: 'SF Pro Text',
    marginTop: 4,
  },
  goalMessage: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'SF Pro Text',
  },
});

export default WeightDetailScreen;

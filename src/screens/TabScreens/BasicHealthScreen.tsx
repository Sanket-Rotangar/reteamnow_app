import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import {
  requestHealthPermissions,
  readSteps,
  checkAvailability,
} from '../../services/healthConnectService';

const BasicHealthScreen = () => {
  const [steps, setSteps] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      // Check for Health Connect availability
      const available = await checkAvailability();
      setIsAvailable(available);
    };
    checkStatus();
  }, []);

  const fetchHealthData = async () => {
    setLoading(true);
    try {
      const timeRange = {
        operator: 'between',
        startTime: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
        endTime: new Date().toISOString(),
      };
      const stepsData = await readSteps(timeRange);
      const totalSteps = stepsData.records.reduce((sum, cur) => sum + cur.count, 0);
      setSteps(totalSteps);
    } catch (error) {
      console.error('Error fetching health data:', error);
      Alert.alert('Error', 'Failed to fetch health data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionRequest = async () => {
    const granted = await requestHealthPermissions();
    if (granted.length > 0) {
      Alert.alert('Success', 'Permissions granted! Fetching data...');
      fetchHealthData(); // Call data fetch after permissions are granted
    } else {
      Alert.alert('Permissions Denied', 'Unable to access health data without permissions.');
    }
  };

  if (!isAvailable) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Health Connect is not available or requires an update.</Text>
        <Button title="Open Health Connect" onPress={checkAvailability} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>Health Connect Integration</Text>
      <Text style={{ fontSize: 20, marginTop: 20 }}>Today's Steps: {loading ? '...' : steps}</Text>
      <Button title="Request Permissions" onPress={handlePermissionRequest} />
      <Button title="Fetch Steps" onPress={fetchHealthData} disabled={loading} />
    </View>
  );
};

export default BasicHealthScreen;
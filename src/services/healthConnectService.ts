import {
  requestPermission,
  readRecords,
  getSdkStatus,
  SdkAvailabilityStatus,
  openHealthConnectSettings,
} from 'react-native-health-connect';

// Define the permissions needed by your app
const PERMISSIONS = [
  { accessType: 'read', recordType: 'Steps' },
  { accessType: 'write', recordType: 'Steps' },
  { accessType: 'read', recordType: 'HeartRate' },
  { accessType: 'write', recordType: 'HeartRate' },
  { accessType: 'read', recordType: 'ExerciseSession' },
  { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
];

// Function to request permissions from the user
export const requestHealthPermissions = async () => {
  try {
    const grantedPermissions = await requestPermission(PERMISSIONS);
    return grantedPermissions;
  } catch (error) {
    console.error('Error requesting Health Connect permissions:', error);
    return [];
  }
};

// Function to check Health Connect app availability
export const checkAvailability = async () => {
  const status = await getSdkStatus();
  if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED) {
    await openHealthConnectSettings();
  }
  return status === SdkAvailabilityStatus.SDK_AVAILABLE;
};

// Function to read step data
export const readSteps = async (timeRange) => {
  try {
    const records = await readRecords('Steps', { timeRangeFilter: timeRange });
    return records;
  } catch (error) {
    console.error('Error reading steps data:', error);
    return [];
  }
};

// Function to read heart rate data
export const readHeartRate = async (timeRange) => {
  try {
    const records = await readRecords('HeartRate', { timeRangeFilter: timeRange });
    return records;
  } catch (error) {
    console.error('Error reading heart rate data:', error);
    return [];
  }
};

// Function to read exercise sessions. Distance and speed data will be available within these records.
export const readExerciseSessions = async (timeRange) => {
  try {
    const records = await readRecords('ExerciseSession', { timeRangeFilter: timeRange });
    return records;
  } catch (error) {
    console.error('Error reading exercise session data:', error);
    return [];
  }
};

// Function to read active calories burned data.
// The correct record type is 'ActiveCaloriesBurned', not 'TotalCaloriesBurned'.
export const readActiveCaloriesBurned = async (timeRange) => {
  try {
    const records = await readRecords('ActiveCaloriesBurned', { timeRangeFilter: timeRange });
    return records;
  } catch (error) {
    console.error('Error reading active calories burned data:', error);
    return [];
  }
};

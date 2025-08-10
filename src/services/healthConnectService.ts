import {
  requestPermission,
  readRecords,
  getSdkStatus,
  SdkAvailabilityStatus,
  openHealthConnectSettings,
} from 'react-native-health-connect';

// Permissions based on current AndroidManifest.xml
// If a recordType is not accessible right now (missing in manifest), keep it commented out for future use
const PERMISSIONS = [
  // ✅ Available now
  { accessType: 'read', recordType: 'Steps' },
  { accessType: 'write', recordType: 'Steps' },

  { accessType: 'read', recordType: 'HeartRate' },
  { accessType: 'write', recordType: 'HeartRate' },

  { accessType: 'read', recordType: 'Distance' },
  { accessType: 'write', recordType: 'Distance' },

  { accessType: 'read', recordType: 'Height' },
  { accessType: 'write', recordType: 'Height' },

  { accessType: 'read', recordType: 'Weight' },
  { accessType: 'write', recordType: 'Weight' },

  { accessType: 'read', recordType: 'Speed' },
  { accessType: 'write', recordType: 'Speed' },

  { accessType: 'read', recordType: 'TotalCaloriesBurned' },
  { accessType: 'write', recordType: 'TotalCaloriesBurned' },

  // ⏳ Not available yet — manifest permissions missing
  // { accessType: 'read', recordType: 'ExerciseSession' },
  // { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
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
  if (
    status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED
  ) {
    await openHealthConnectSettings();
  }
  return status === SdkAvailabilityStatus.SDK_AVAILABLE;
};

// Function to read step data
export const readSteps = async timeRange => {
  try {
    const records = await readRecords('Steps', { timeRangeFilter: timeRange });
    return records ?? [];
  } catch (error) {
    console.error('Error reading steps data:', error);
    return [];
  }
};

// Function to read heart rate data
export const readHeartRate = async timeRange => {
  try {
    const records = await readRecords('HeartRate', {
      timeRangeFilter: timeRange,
    });
    return records ?? [];
  } catch (error) {
    console.error('Error reading heart rate data:', error);
    return [];
  }
};

// Function to read distance data
export const readDistance = async timeRange => {
  try {
    const records = await readRecords('Distance', {
      timeRangeFilter: timeRange,
    });
    return records ?? [];
  } catch (error) {
    console.error('Error reading distance data:', error);
    return [];
  }
};

// Function to read height data
export const readHeight = async timeRange => {
  try {
    const records = await readRecords('Height', { timeRangeFilter: timeRange });
    return records ?? [];
  } catch (error) {
    console.error('Error reading height data:', error);
    return [];
  }
};

// Function to read weight data
export const readWeight = async timeRange => {
  try {
    const records = await readRecords('Weight', { timeRangeFilter: timeRange });
    return records ?? [];
  } catch (error) {
    console.error('Error reading weight data:', error);
    return [];
  }
};

// Function to read speed data
export const readSpeed = async timeRange => {
  try {
    const records = await readRecords('Speed', { timeRangeFilter: timeRange });
    return records ?? [];
  } catch (error) {
    console.error('Error reading speed data:', error);
    return [];
  }
};

// Function to read total calories burned data
export const readTotalCaloriesBurned = async timeRange => {
  try {
    const records = await readRecords('TotalCaloriesBurned', {
      timeRangeFilter: timeRange,
    });
    return records ?? [];
  } catch (error) {
    console.error('Error reading total calories burned data:', error);
    return [];
  }
};

// Function to read exercise sessions (future use)
export const readExerciseSessions = async timeRange => {
  try {
    const records = await readRecords('ExerciseSession', {
      timeRangeFilter: timeRange,
    });
    return records ?? [];
  } catch (error) {
    console.error('Error reading exercise session data:', error);
    return [];
  }
};

// Function to read active calories burned (future use)
export const readActiveCaloriesBurned = async timeRange => {
  try {
    const records = await readRecords('ActiveCaloriesBurned', {
      timeRangeFilter: timeRange,
    });
    return records ?? [];
  } catch (error) {
    console.error('Error reading active calories burned data:', error);
    return [];
  }
};

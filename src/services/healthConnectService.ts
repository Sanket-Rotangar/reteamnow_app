import {
  initialize,
  requestPermission,
  aggregateRecord,
  getSdkStatus,
  SdkAvailabilityStatus,
  openHealthConnectSettings,
} from 'react-native-health-connect';

// Permissions based on current AndroidManifest.xml
const PERMISSIONS = [
  { accessType: 'read' as const, recordType: 'Steps' as const },
  { accessType: 'read' as const, recordType: 'HeartRate' as const },
  { accessType: 'read' as const, recordType: 'Distance' as const },
  { accessType: 'read' as const, recordType: 'TotalCaloriesBurned' as const },
  { accessType: 'read' as const, recordType: 'Height' as const },
  { accessType: 'write' as const, recordType: 'Height' as const },
  { accessType: 'read' as const, recordType: 'Weight' as const },
  { accessType: 'write' as const, recordType: 'Weight' as const },
];

// Initialize Health Connect
export const initializeHealthConnect = async () => {
  try {
    const isInitialized = await initialize();
    if (!isInitialized) {
      throw new Error('Failed to initialize Health Connect');
    }
    return true;
  } catch (error) {
    console.warn('Error initializing Health Connect:', error);
    return false;
  }
};

// Function to request permissions from the user
export const requestHealthPermissions = async () => {
  try {
    const grantedPermissions = await requestPermission(PERMISSIONS);
    return grantedPermissions;
  } catch (error) {
    console.warn('Error requesting Health Connect permissions:', error);
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
    return false;
  }
  return status === SdkAvailabilityStatus.SDK_AVAILABLE;
};

/**
 * 📌 Steps — total step count in the given time range
 */
export const readSteps = async (startTime: string, endTime: string) => {
  try {
    const result = await aggregateRecord({
      recordType: 'Steps',
      timeRangeFilter: {
        operator: 'between',
        startTime,
        endTime,
      },
    });

    // Extract steps count from COUNT_TOTAL
    const stepsCount = (result as any)?.COUNT_TOTAL || 0;
    return stepsCount;
  } catch (error) {
    console.warn('Error aggregating steps data:', error);
    return 0;
  }
};

/**
 * 📌 Heart Rate — average bpm in the given time range
 */
export const readHeartRate = async (startTime: string, endTime: string) => {
  try {
    const result = await aggregateRecord({
      recordType: 'HeartRate',
      timeRangeFilter: {
        operator: 'between',
        startTime,
        endTime,
      },
    });

    // Extract average heart rate from BPM_AVG
    const avgHeartRate = (result as any)?.BPM_AVG || 75;
    return avgHeartRate;
  } catch (error) {
    console.warn('Error aggregating heart rate data:', error);
    return 0;
  }
};

/**
 * 📌 Calories — total calories burned in the given time range
 */
export const readTotalCaloriesBurned = async (
  startTime: string,
  endTime: string,
) => {
  try {
    const result = await aggregateRecord({
      recordType: 'TotalCaloriesBurned',
      timeRangeFilter: {
        operator: 'between',
        startTime,
        endTime,
      },
    });

    // Extract calories from ENERGY_TOTAL.inKilocalories
    const totalCalories = (result as any)?.ENERGY_TOTAL?.inKilocalories || 0;
    const roundedCalories = Math.round(totalCalories);
    return roundedCalories; // Round to whole number
  } catch (error) {
    console.warn('Error aggregating total calories data:', error);
    return 0;
  }
};

/**
 * 📌 Distance — total distance in the given time range
 */
export const readDistance = async (startTime: string, endTime: string) => {
  try {
    const result = await aggregateRecord({
      recordType: 'Distance',
      timeRangeFilter: {
        operator: 'between',
        startTime,
        endTime,
      },
    });

    // Extract distance from DISTANCE_TOTAL
    const totalDistance = (result as any)?.DISTANCE.inKilometers || 0;
    return totalDistance;
  } catch (error) {
    console.warn('Error aggregating distance data:', error);
    return 0;
  }
};

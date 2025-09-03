import React, { createContext, useState, useCallback, ReactNode } from 'react';
import {
  readSteps,
  readHeartRate,
  readTotalCaloriesBurned,
  readDistance,
} from '../services/healthConnectService.ts';

// 1️⃣ Types
export interface HealthData {
  steps: number;
  heartRate: number;
  calories: number;
  distance: number;
}

export interface HealthContextType {
  healthData: HealthData;
  loading: boolean;
  refreshHealthData: (startTime: string, endTime: string) => Promise<void>;
}

// 1️⃣ Create Context
export const HealthContext = createContext<HealthContextType | null>(null);

// 2️⃣ Provider Component
export const HealthProvider = ({ children }: { children: ReactNode }) => {
  // ---- State: Stores health-related data
  const [healthData, setHealthData] = useState<HealthData>({
    steps: 0,
    heartRate: 0,
    calories: 0,
    distance: 0,
  });

  // ---- State: Loading & error handling
  const [loading, setLoading] = useState(false);

  // ---- Function: Refresh data (to be filled with service calls later)
  const refreshHealthData = useCallback(async (startTime: string, endTime: string) => {
    try {
      setLoading(true);

      //   ⬇️ here we’ll call your service functions (readSteps, readHeartRate, etc.)
      const steps = await readSteps(startTime, endTime);
      const heartRate = await readHeartRate(startTime, endTime);
      const calories = await readTotalCaloriesBurned(startTime, endTime);
      const distance = await readDistance(startTime, endTime);

      // Update state with the fetched data
      setHealthData({ steps, heartRate, calories, distance });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 3️⃣ Provide state + actions
  return (
    <HealthContext.Provider value={{ healthData, loading, refreshHealthData }}>
      {children}
    </HealthContext.Provider>
  );
};

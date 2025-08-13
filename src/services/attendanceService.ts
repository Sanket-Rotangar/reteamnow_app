import axios from 'axios';
import { API_BASE_URL } from './authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkInUser = async () => {
  try {
    const userInfo = JSON.parse(await AsyncStorage.getItem('userInfo') || '{}');
    
    const res = await axios.post(`${API_BASE_URL}/attendance/checkin`, {
      employee: userInfo.id,
      workType: 'remote',
      notes: "Check-in via mobile app"
    });
    
    console.log('Check-in response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Check-in error:', error);
    throw error;
  }
};

export const checkOutUser = async () => {
  try {
    const userInfo = JSON.parse(await AsyncStorage.getItem('userInfo') || '{}');
    
    const res = await axios.post(`${API_BASE_URL}/attendance/checkout`, {
      employee: userInfo.id
    });
    
    console.log('Check-out response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Check-out error:', error);
    throw error;
  }
};

export const getTodayAttendance = async () => {
  try {
    const userInfo = JSON.parse(await AsyncStorage.getItem('userInfo') || '{}');
    
    const res = await axios.get(`${API_BASE_URL}/attendance/today`, {
      params: {
        employee: userInfo.id
      }
    });
    
    console.log('Today attendance response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Get today attendance error:', error);
    throw error;
  }
};
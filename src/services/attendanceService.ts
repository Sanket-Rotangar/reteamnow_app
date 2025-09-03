import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';
// import { API_BASE_URL } from './authService';

export const checkInUser = async () => {
  try {
    const userInfo = JSON.parse((await AsyncStorage.getItem('userInfo')) || '{}');
    const res = await axios.post(`${API_BASE_URL}/attendance/checkin`, {
      userId: userInfo.id,
      workType: 'remote',
      notes: "Check-in via mobile app"
    });
    console.log('Check-in response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Check-in error:', error.response?.data || error.message);
    throw error;
  }
};

export const checkOutUser = async () => {
  try {
    const userInfo = JSON.parse((await AsyncStorage.getItem('userInfo')) || '{}');
    const res = await axios.post(`${API_BASE_URL}/attendance/checkout`, {
      userId: userInfo.id
    });
    console.log('Check-out response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Check-out error:', error.response?.data || error.message);
    throw error;
  }
};

export const getTodayAttendance = async () => {
  try {
    const userInfo = JSON.parse((await AsyncStorage.getItem('userInfo')) || '{}');
    const res = await axios.get(`${API_BASE_URL}/attendance/today/${userInfo.id}`);
    console.log('Today attendance response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Get today attendance error:', error.response?.data || error.message);
    throw error;
  }
};

export const getAttendanceHistory = async () => {
  try {
    const userInfo = JSON.parse((await AsyncStorage.getItem('userInfo')) || '{}');
    const res = await axios.get(`${API_BASE_URL}/attendance/history/${userInfo.id}`);
    console.log('Attendance history response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Get attendance history error:', error.response?.data || error.message);
    throw error;
  }
};

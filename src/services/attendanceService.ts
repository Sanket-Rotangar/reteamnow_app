import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { getStoredUserInfo } from '../utils/asyncStorage';

export const checkInUser = async () => {
  try {
    const userInfo = await getStoredUserInfo<{ id: string }>();
    const res = await axios.post(`${API_BASE_URL}/attendance/checkin`, {
      userId: userInfo.id,
      workType: 'remote',
      notes: "Check-in via mobile app"
    });
    return res.data;
  } catch (error) {
    console.error('Check-in error:', error.response?.data || error.message);
    throw error;
  }
};

export const checkOutUser = async () => {
  try {
    const userInfo = await getStoredUserInfo<{ id: string }>();
    const res = await axios.post(`${API_BASE_URL}/attendance/checkout`, {
      userId: userInfo.id
    });
    return res.data;
  } catch (error) {
    console.error('Check-out error:', error.response?.data || error.message);
    throw error;
  }
};

export const getTodayAttendance = async () => {
  try {
    const userInfo = await getStoredUserInfo<{ id: string }>();
    const res = await axios.get(`${API_BASE_URL}/attendance/today/${userInfo.id}`);
    return res.data;
  } catch (error) {
    console.error('Get today attendance error:', error.response?.data || error.message);
    throw error;
  }
};

export const getAttendanceHistory = async () => {
  try {
    const userInfo = await getStoredUserInfo<{ id: string }>();
    const res = await axios.get(`${API_BASE_URL}/attendance/history/${userInfo.id}`);
    return res.data;
  } catch (error) {
    console.error('Get attendance history error:', error.response?.data || error.message);
    throw error;
  }
};

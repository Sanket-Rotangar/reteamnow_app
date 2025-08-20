// src/services/eventService.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE_URL = 'https://app-backend-production-31a4.up.railway.app/api';

// Types for Event data structure
export interface Event {
  _id: string;
  id?: string;
  title: string;
  description: string;
  location?: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  startDate?: string;
  endDate?: string;
  registeredCount?: number;
  userAssigned?: Array<{
    _id: string;
    fname: string;
    lname: string;
    userLogo?: string;
  }>;
  sessions: Array<{
    title: string;
    startTime: string;
    endTime: string;
  }>;
}

// Helper function to get auth headers
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('userToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Get all events
export const getAllEvents = async (status?: string) => {
  const headers = await getAuthHeaders();
  const url = status ? `${API_BASE_URL}/event?status=${status}` : `${API_BASE_URL}/event`;
  const res = await axios.get(url, { headers });
  
  // Handle backend response format
  const backendEvents = res.data?.data?.events || res.data?.events || res.data || [];
  
  // Transform backend format to frontend format
  const transformedEvents = backendEvents.map((event: any) => ({
    ...event,
    _id: event.id || event._id,
    userAssigned: event.userAssigned || [],
  }));
  
  return transformedEvents;
};

// Get single event by ID
export const getEventById = async (eventId: string) => {
  const headers = await getAuthHeaders();
  const res = await axios.get(`${API_BASE_URL}/event/${eventId}`, { headers });
  
  // Handle backend response format
  const event = res.data?.data || res.data;
  
  // Transform backend format to frontend format
  return {
    ...event,
    _id: event.id || event._id,
    userAssigned: event.userAssigned || [],
  };
};

// Create new event (Admin only)
export const createEvent = async (eventData: any) => {
  const headers = await getAuthHeaders();
  const res = await axios.post(`${API_BASE_URL}/event`, eventData, { headers });
  return res.data;
};

// Update event (Admin only)
export const updateEvent = async (eventId: string, eventData: any) => {
  const headers = await getAuthHeaders();
  const res = await axios.put(`${API_BASE_URL}/event/${eventId}`, eventData, { headers });
  return res.data;
};

// Delete event (Admin only)
export const deleteEvent = async (eventId: string) => {
  const headers = await getAuthHeaders();
  const res = await axios.delete(`${API_BASE_URL}/event/${eventId}`, { headers });
  return res.data;
};

// Join an event
export const joinEvent = async (eventId: string) => {
  const headers = await getAuthHeaders();
  const res = await axios.post(`${API_BASE_URL}/event/${eventId}/join`, {}, { headers });
  return res.data;
};

// Leave an event
export const leaveEvent = async (eventId: string) => {
  const headers = await getAuthHeaders();
  const res = await axios.post(`${API_BASE_URL}/event/${eventId}/leave`, {}, { headers });
  return res.data;
};

// Get user's events
export const getUserEvents = async () => {
  const headers = await getAuthHeaders();
  const res = await axios.get(`${API_BASE_URL}/event/my-events`, { headers });
  return res.data;
};

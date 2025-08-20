// src/services/eventPhotosService.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE_URL = 'https://app-backend-production-31a4.up.railway.app/api';

// Types for Event Photos data structure
export interface EventPhoto {
  _id: string;
  eventId: string;
  user: {
    _id: string;
    fname: string;
    lname: string;
    userLogo?: string;
  };
  imageUrl: string;
  caption: string;
  likes: string[];
  reactions: Array<{
    user: string;
    emoji: string;
    createdAt: string;
  }>;
  likeCount: number;
  reactionCounts: { [key: string]: number };
  totalEngagement: number;
  createdAt: string;
  updatedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: {
    _id: string;
    fname: string;
    lname: string;
    userLogo?: string;
  };
  stats: {
    totalPhotos: number;
    totalLikes: number;
    totalReactions: number;
    totalEngagement: number;
  };
}

// Helper function to get auth headers
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('userToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Get event photos
export const getEventPhotos = async (eventId: string) => {
  const headers = await getAuthHeaders();
  const res = await axios.get(`${API_BASE_URL}/event-photo/${eventId}/photos`, { headers });
  
  // Handle backend response format
  const photos = res.data?.data?.photos || res.data?.photos || res.data || [];
  
  return photos;
};

// Get event details with photos
export const getEventDetails = async (eventId: string) => {
  const headers = await getAuthHeaders();
  const res = await axios.get(`${API_BASE_URL}/event-photo/${eventId}/details`, { headers });
  
  // Handle backend response format
  return res.data?.data || res.data;
};

// Get leaderboard for event
export const getEventLeaderboard = async (eventId: string) => {
  const headers = await getAuthHeaders();
  const res = await axios.get(`${API_BASE_URL}/event-photo/${eventId}/leaderboard`, { headers });
  
  // Handle backend response format
  const leaderboard = res.data?.data || res.data || [];
  
  return leaderboard;
};

// Upload photo to event
export const uploadEventPhoto = async (eventId: string, photoData: FormData) => {
  const token = await AsyncStorage.getItem('userToken');
  const headers = {
    'Content-Type': 'multipart/form-data',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
  
  const res = await axios.post(`${API_BASE_URL}/event-photo/${eventId}/upload`, photoData, { headers });
  
  return res.data?.data || res.data;
};

// Like/Unlike a photo
export const togglePhotoLike = async (photoId: string) => {
  const headers = await getAuthHeaders();
  const res = await axios.post(`${API_BASE_URL}/event-photo/photo/${photoId}/like`, {}, { headers });
  
  return res.data?.data || res.data;
};

// Add reaction to photo
export const addPhotoReaction = async (photoId: string, emoji: string) => {
  const headers = await getAuthHeaders();
  const res = await axios.post(`${API_BASE_URL}/event-photo/photo/${photoId}/reaction`, { emoji }, { headers });
  
  return res.data?.data || res.data;
};

// Delete photo (user can delete their own photos)
export const deleteEventPhoto = async (photoId: string) => {
  const headers = await getAuthHeaders();
  const res = await axios.delete(`${API_BASE_URL}/event-photo/photo/${photoId}`, { headers });
  
  return res.data?.data || res.data;
};

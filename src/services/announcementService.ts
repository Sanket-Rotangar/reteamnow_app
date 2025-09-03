// src/services/announcementService.ts
import axios from "axios";
import { API_BASE_URL } from '../config/api';
// import { API_BASE_URL } from './authService';
// export const API_BASE_URL = "http://192.168.1.7:8062/api";

// types
export type Announcement = {
  _id: string;
  title: string;
  subtitle?: string;
  message: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  likes: string[];
  readBy: string[];
  createdAt: string;
  // convenience from API:
  likedByUser?: boolean;
  readByUser?: boolean;
  likesCount?: number;
};

// services
export const getAnnouncements = async (filter: 'all'|'unread' = 'all', userId: string) => {
  const res = await axios.get(`${API_BASE_URL}/announcements`, {
    params: { filter, userId }
  });
  return res.data; // includes likedByUser, readByUser, likesCount
};
export const likeAnnouncement = async (id: string, userId: string) => {
  const res = await axios.patch(`${API_BASE_URL}/announcements/${id}/like`, { userId });
  return res.data; // { likes: ObjectId[], likedByUser: boolean, likesCount: number }
};

export const markAsRead = async (id: string, userId: string) => {
  const res = await axios.patch(`${API_BASE_URL}/announcements/${id}/mark-read`, { userId });
  return res.data; // { readBy: ObjectId[], readByCount: number, readByUser: boolean }
};

export const checkUnreadRequiredAnnouncements = async (userId: string) => {
  const res = await axios.get(`${API_BASE_URL}/announcements/check-unread-required`, {
    params: { userId }
  });
  return res.data; // { hasUnreadRequired: boolean, count: number, announcements: [...] }
};

// (for admin dashboard later)
export const createAnnouncement = async (data: {
  title: string;
  subtitle?: string;
  message: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
}) => {
  const res = await axios.post(`${API_BASE_URL}/announcements`, data);
  return res.data;
};

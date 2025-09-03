import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';
// import { API_BASE_URL } from './authService';
export interface User {
  _id: string;
  username: string;
  profile_picture: string;
}

export interface Comment {
  _id: string;
  user: User;
  text: string;
  created_at: string | Date;
}

export interface Post {
  _id: string;
  competition_id: string;
  user: User;
  media_url: string;
  caption: string;
  likes_count: number;
  comments_count: number;
  created_at: string | Date;
  has_liked?: boolean;
}

export interface Competition {
  _id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'cancelled';
  start_date: string | Date;
}

export const getAllCompetitions = async (status?: string) => {
  try {
    const url = status && status !== 'all' 
      ? `/event/competitions?status=${status}`
      : '/event/competitions';
    
    const res = await axios.get(`${API_BASE_URL}${url}`);
    console.log('Get competitions response:', res.data);
    return res.data.data || [];
  } catch (error) {
    console.error('Get competitions error:', error.response?.data || error.message);
    return [];
  }
};

export const getCompetitionById = async (competitionId: string) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/event/competitions/${competitionId}`);
    console.log('Get competition response:', res.data);
    return res.data.data || null;
  } catch (error) {
    console.error('Get competition error:', error.response?.data || error.message);
    return null;
  }
};

export const getPostsForCompetition = async (competitionId: string) => {
  try {
    console.log('Fetching posts for competition:', competitionId);
    const res = await axios.get(`${API_BASE_URL}/event/competitions/${competitionId}/posts`);
    console.log('Get posts response:', res.data);
    return res.data.data || [];
  } catch (error) {
    console.error('Get posts error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: `${API_BASE_URL}/event/competitions/${competitionId}/posts`,
      competitionId
    });
    return [];
  }
};

export const createPost = async (competitionId: string, postData: {
  media_url: string;
  caption?: string;
  user_id?: string;
}) => {
  try {
    const userInfo = JSON.parse((await AsyncStorage.getItem('userInfo')) || '{}');
    
    // Use the first available user ID as fallback for testing
    const fallbackUserId = '6891e8690184a10635d216a3';
    const finalUserId = postData.user_id || userInfo._id || fallbackUserId;
    
    console.log('Creating post with data:', {
      ...postData,
      user_id: finalUserId,
      competitionId,
      userFromStorage: userInfo
    });
    
    const res = await axios.post(`${API_BASE_URL}/event/competitions/${competitionId}/posts`, {
      ...postData,
      user_id: finalUserId
    });
    
    console.log('Create post response:', res.data);
    return res.data.data || null;
  } catch (error) {
    console.error('Create post error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });
    return null;
  }
};

export const reactToPost = async (postId: string, userId?: string) => {
  try {
    const userInfo = JSON.parse((await AsyncStorage.getItem('userInfo')) || '{}');
    const fallbackUserId = '6891e8690184a10635d216a3';
    const finalUserId = userId || userInfo._id || fallbackUserId;
    
    const res = await axios.post(`${API_BASE_URL}/event/posts/${postId}/react`, {
      userId: finalUserId
    });
    console.log('React to post response:', res.data);
    return res.data.data || null;
  } catch (error) {
    console.error('React to post error:', error.response?.data || error.message);
    return null;
  }
};

export const addCommentToPost = async (postId: string, text: string, userId?: string) => {
  try {
    const userInfo = JSON.parse((await AsyncStorage.getItem('userInfo')) || '{}');
    const fallbackUserId = '6891e8690184a10635d216a3';
    const finalUserId = userId || userInfo._id || fallbackUserId;
    
    const res = await axios.post(`${API_BASE_URL}/event/posts/${postId}/comments`, {
      userId: finalUserId,
      text
    });
    console.log('Add comment response:', res.data);
    return res.data.data || null;
  } catch (error) {
    console.error('Add comment error:', error.response?.data || error.message);
    return null;
  }
};

export const getCommentsForPost = async (postId: string) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/event/posts/${postId}/comments`);
    console.log('Get comments response:', res.data);
    return res.data.data || [];
  } catch (error) {
    console.error('Get comments error:', error.response?.data || error.message);
    return [];
  }
};

export const createCompetition = async (competitionData: {
  name: string;
  description: string;
  status?: 'active' | 'completed' | 'cancelled';
  location?: string;
  maxCapacity?: number;
}) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/event/admin/competitions`, competitionData);
    console.log('Create competition response:', res.data);
    return res.data.data || null;
  } catch (error) {
    console.error('Create competition error:', error.response?.data || error.message);
    return null;
  }
};

import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { getStoredUserInfo } from '../utils/asyncStorage';
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
    return res.data.data || [];
  } catch (error) {
    console.error('Get competitions error:', error);
    return [];
  }
};

export const getCompetitionById = async (competitionId: string) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/event/competitions/${competitionId}`);
    return res.data.data || null;
  } catch (error) {
    console.error('Get competition error:', error);
    return null;
  }
};

export const getPostsForCompetition = async (competitionId: string) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/event/competitions/${competitionId}/posts`);
    return res.data.data || [];
  } catch (error) {
    console.error('Get posts error:', error);
    return [];
  }
};

export const createPost = async (competitionId: string, postData: {
  media_url: string;
  caption?: string;
  user_id?: string;
}) => {
  try {
    const userInfo = await getStoredUserInfo<{ _id: string }>();
    const finalUserId = postData.user_id || userInfo._id;
    
    if (!finalUserId) {
      console.warn('No user ID available for creating post');
      return null;
    }
    
    const res = await axios.post(`${API_BASE_URL}/event/competitions/${competitionId}/posts`, {
      ...postData,
      user_id: finalUserId
    });
    
    return res.data.data || null;
  } catch (error) {
    console.error('Create post error:', error);
    return null;
  }
};

export const reactToPost = async (postId: string, userId?: string) => {
  try {
    const userInfo = await getStoredUserInfo<{ _id: string }>();
    const finalUserId = userId || userInfo._id;
    
    if (!finalUserId) {
      console.warn('No user ID available for reacting to post');
      return null;
    }
    
    const res = await axios.post(`${API_BASE_URL}/event/posts/${postId}/react`, {
      userId: finalUserId
    });
    return res.data.data || null;
  } catch (error) {
    console.error('React to post error:', error);
    return null;
  }
};

export const addCommentToPost = async (postId: string, text: string, userId?: string) => {
  try {
    const userInfo = await getStoredUserInfo<{ _id: string }>();
    const finalUserId = userId || userInfo._id;
    
    if (!finalUserId) {
      console.warn('No user ID available for adding comment');
      return null;
    }
    
    const res = await axios.post(`${API_BASE_URL}/event/posts/${postId}/comments`, {
      userId: finalUserId,
      text
    });
    return res.data.data || null;
  } catch (error) {
    console.error('Add comment error:', error);
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
    return res.data.data || null;
  } catch (error) {
    console.error('Create competition error:', error);
    return null;
  }
};

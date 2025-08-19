/**
 * Event Photos API Service
 * 
 * Handles all API calls related to event photo functionality
 * including event management, photo uploads, likes, reactions, and leaderboards
 */

const API_BASE_URL = 'http://localhost:3000/api'; // Replace with your actual API URL

// Helper function to get auth token from storage
const getAuthToken = async (): Promise<string | null> => {
  // Replace with your actual token storage method
  // Example: 
  // try {
  //   return await AsyncStorage.getItem('authToken');
  // } catch (error) {
  //   console.error('Error getting auth token:', error);
  //   return null;
  // }
  
  // For development/testing, return a placeholder token
  // In production, implement proper token storage retrieval
  return 'your-auth-token';
};

// Helper function to create headers
const createHeaders = async (isMultipart: boolean = false): Promise<HeadersInit> => {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    'Authorization': `Bearer ${token}`,
  };

  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};

// Event API functions
export const eventPhotosAPI = {
  // Get all events
  getEvents: async (status: 'active' | 'completed' | 'all' = 'active') => {
    try {
      const headers = await createHeaders();
      const response = await fetch(`${API_BASE_URL}/event-photos?status=${status}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get events error:', error);
      throw error;
    }
  },

  // Get event details with photos
  getEventDetails: async (eventId: string) => {
    try {
      const headers = await createHeaders();
      const response = await fetch(`${API_BASE_URL}/event-photos/${eventId}/details`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get event details error:', error);
      throw error;
    }
  },

  // Upload event photo
  uploadPhoto: async (eventId: string, photoData: { uri: string; type: string; name: string }, caption?: string) => {
    try {
      const formData = new FormData();
      
      // Append the photo file
      formData.append('photo', {
        uri: photoData.uri,
        type: photoData.type,
        name: photoData.name,
      } as any);

      // Append caption if provided
      if (caption && caption.trim()) {
        formData.append('caption', caption.trim());
      }

      const headers = await createHeaders(true); // multipart form data
      const response = await fetch(`${API_BASE_URL}/event-photos/${eventId}/photos`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Upload photo error:', error);
      throw error;
    }
  },

  // Toggle like on photo
  toggleLike: async (photoId: string) => {
    try {
      const headers = await createHeaders();
      const response = await fetch(`${API_BASE_URL}/event-photos/photos/${photoId}/like`, {
        method: 'POST',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Toggle like error:', error);
      throw error;
    }
  },

  // Add emoji reaction to photo
  addReaction: async (photoId: string, emoji: string) => {
    try {
      const headers = await createHeaders();
      const response = await fetch(`${API_BASE_URL}/event-photos/photos/${photoId}/reaction`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ emoji }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Add reaction error:', error);
      throw error;
    }
  },

  // Get event leaderboard
  getLeaderboard: async (eventId: string, page: number = 1, limit: number = 10) => {
    try {
      const headers = await createHeaders();
      const response = await fetch(`${API_BASE_URL}/event-photos/${eventId}/leaderboard?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get leaderboard error:', error);
      throw error;
    }
  },

  // Admin only functions
  admin: {
    // Create new event
    createEvent: async (eventData: {
      title: string;
      description: string;
      location?: string;
      reminder?: string;
      userAssigned?: string[];
      sessions?: Array<{
        title: string;
        startTime: string;
        endTime: string;
      }>;
    }) => {
      try {
        const headers = await createHeaders();
        const response = await fetch(`${API_BASE_URL}/event-photos`, {
          method: 'POST',
          headers,
          body: JSON.stringify(eventData),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Create event error:', error);
        throw error;
      }
    },

    // Update event
    updateEvent: async (eventId: string, eventData: {
      title?: string;
      description?: string;
      location?: string;
      reminder?: string;
      userAssigned?: string[];
      sessions?: Array<{
        title: string;
        startTime: string;
        endTime: string;
      }>;
      status?: 'active' | 'completed' | 'cancelled';
    }) => {
      try {
        const headers = await createHeaders();
        const response = await fetch(`${API_BASE_URL}/event-photos/${eventId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(eventData),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Update event error:', error);
        throw error;
      }
    },

    // Delete event
    deleteEvent: async (eventId: string) => {
      try {
        const headers = await createHeaders();
        const response = await fetch(`${API_BASE_URL}/event-photos/${eventId}`, {
          method: 'DELETE',
          headers,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Delete event error:', error);
        throw error;
      }
    },
  },
};

// Export individual functions for convenience
export const {
  getEvents,
  getEventDetails,
  uploadPhoto,
  toggleLike,
  addReaction,
  getLeaderboard,
  admin: { createEvent, updateEvent, deleteEvent },
} = eventPhotosAPI;

// Export types for use in components
export interface EventPhoto {
  _id: string;
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

export interface Event {
  _id: string;
  title: string;
  description: string;
  location?: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  userAssigned: Array<{
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

/**
 * Event Photos Screen - Interactive Photo Sharing & Competition
 *
 * Following the same design principles as FunZoneScreen and AttendanceScreen
 * Features: Event photo gallery, camera integration, likes, reactions, leaderboard
 * Role-based access: Regular users can participate, view, and interact
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Modal,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';
// import { launchCamera, launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

const { width: screenWidth } = Dimensions.get('window');

// Types
interface EventPhoto {
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

interface LeaderboardEntry {
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

interface Event {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

interface Props {
  route: {
    params: {
      eventId: string;
      eventTitle: string;
    };
  };
  navigation: any;
}

const EMOJI_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡', '🔥', '✨', '🎉', '💯'];

const EventPhotosScreen: React.FC<Props> = ({ route, navigation }) => {
  const { eventId, eventTitle } = route.params;

  // State management
  const [activeTab, setActiveTab] = useState<'photos' | 'leaderboard'>('photos');
  const [photos, setPhotos] = useState<EventPhoto[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [_event, setEvent] = useState<Event | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Modal states
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showReactionModal, setShowReactionModal] = useState(false);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string>('');
  const [captionText, setCaptionText] = useState('');

  // Fetch event details and photos
  const fetchEventData = useCallback(async () => {
    try {
      // Replace with your API endpoint
      const response = await fetch(`/api/event-photos/${eventId}/details`, {
        headers: {
          'Authorization': `Bearer ${await getAuthToken()}`, // Implement getAuthToken()
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEvent(data.data.event);
        setPhotos(data.data.photos);
      } else {
        throw new Error('Failed to fetch event data');
      }
    } catch (error) {
      console.error('Fetch event data error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load event data',
      });
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  // Fetch leaderboard
  const fetchLeaderboard = useCallback(async () => {
    try {
      const response = await fetch(`/api/event-photos/${eventId}/leaderboard`, {
        headers: {
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.data);
      }
    } catch (error) {
      console.error('Fetch leaderboard error:', error);
    }
  }, [eventId]);

  // Helper function to get auth token (implement based on your auth system)
  const getAuthToken = async (): Promise<string> => {
    // Implementation depends on your auth system
    // This is a placeholder
    return 'your-auth-token';
  };

  useEffect(() => {
    fetchEventData();
    if (activeTab === 'leaderboard') {
      fetchLeaderboard();
    }
  }, [fetchEventData, fetchLeaderboard, activeTab]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEventData();
    if (activeTab === 'leaderboard') {
      await fetchLeaderboard();
    }
    setRefreshing(false);
  }, [fetchEventData, fetchLeaderboard, activeTab]);

  // Camera functionality
  const openCamera = () => {
    setShowCameraModal(true);
  };

  const handleCameraOption = (option: 'camera' | 'gallery') => {
    setShowCameraModal(false);
    
    // Placeholder for camera/gallery integration
    // You'll need to install react-native-image-picker or react-native-image-crop-picker
    // and implement proper image selection here
    
    Toast.show({
      type: 'info',
      text1: 'Camera Feature',
      text2: `${option} functionality will be implemented with proper image picker library`,
    });

    // For demo purposes, create a mock upload
    // uploadPhoto({ uri: 'placeholder', type: 'image/jpeg', name: 'photo.jpg' });
  };

  const uploadPhoto = async (asset: any) => {
    setUploading(true);
    
    const formData = new FormData();
    formData.append('photo', {
      uri: asset.uri,
      type: asset.type,
      name: asset.fileName || 'photo.jpg',
    } as any);
    
    if (captionText.trim()) {
      formData.append('caption', captionText.trim());
    }

    try {
      const response = await fetch(`/api/event-photos/${eventId}/photos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await getAuthToken()}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPhotos(prev => [data.data, ...prev]);
        setCaptionText('');
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Photo uploaded successfully! 📸',
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to upload photo',
      });
    } finally {
      setUploading(false);
    }
  };

  // Like functionality
  const toggleLike = async (photoId: string) => {
    try {
      const response = await fetch(`/api/event-photos/photos/${photoId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        setPhotos(prev => prev.map(photo => 
          photo._id === photoId 
            ? { 
                ...photo, 
                likeCount: data.data.likeCount,
                totalEngagement: data.data.totalEngagement
              }
            : photo
        ));

        Toast.show({
          type: 'success',
          text1: data.data.action === 'liked' ? '👍 Liked!' : '👎 Unliked',
          text2: '',
        });
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  // Reaction functionality
  const addReaction = async (emoji: string) => {
    if (!selectedPhotoId) return;

    try {
      const response = await fetch(`/api/event-photos/photos/${selectedPhotoId}/reaction`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await getAuthToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emoji }),
      });

      if (response.ok) {
        const data = await response.json();
        
        setPhotos(prev => prev.map(photo => 
          photo._id === selectedPhotoId 
            ? { 
                ...photo, 
                reactionCounts: data.data.reactionCounts,
                totalEngagement: data.data.totalEngagement
              }
            : photo
        ));

        setShowReactionModal(false);
        setSelectedPhotoId('');

        Toast.show({
          type: 'success',
          text1: `${emoji} Reaction added!`,
          text2: '',
        });
      }
    } catch (error) {
      console.error('Reaction error:', error);
    }
  };

  const openReactionModal = (photoId: string) => {
    setSelectedPhotoId(photoId);
    setShowReactionModal(true);
  };

  // Render functions
  const renderPhotoItem = ({ item }: { item: EventPhoto }) => (
    <View style={styles.photoCard}>
      <View style={styles.photoHeader}>
        <View style={styles.userInfo}>
          {item.user.userLogo ? (
            <Image
              source={{ uri: item.user.userLogo }}
              style={styles.userAvatar}
            />
          ) : (
            <View style={[styles.userAvatar, styles.defaultAvatar]}>
              <Text style={styles.avatarText}>
                {item.user.fname.charAt(0)}{item.user.lname.charAt(0)}
              </Text>
            </View>
          )}
          <View style={styles.userDetails}>
            <Text style={styles.userName}>
              {item.user.fname} {item.user.lname}
            </Text>
            <Text style={styles.uploadTime}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <View style={styles.engagementBadge}>
          <Icon name="flame" size={12} color="#FF9500" />
          <Text style={styles.engagementText}>{item.totalEngagement}</Text>
        </View>
      </View>

      <Image
        source={{ uri: item.imageUrl }}
        style={styles.photoImage}
        resizeMode="cover"
      />

      {item.caption ? (
        <Text style={styles.photoCaption}>{item.caption}</Text>
      ) : null}

      <View style={styles.photoActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => toggleLike(item._id)}>
          <Icon name="heart" size={20} color="#FF3B30" />
          <Text style={styles.actionText}>{item.likeCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openReactionModal(item._id)}>
          <Icon name="happy" size={20} color="#007AFF" />
          <Text style={styles.actionText}>React</Text>
        </TouchableOpacity>

        <View style={styles.reactionDisplay}>
          {Object.entries(item.reactionCounts).map(([emoji, count]) => (
            <View key={emoji} style={styles.reactionItem}>
              <Text style={styles.reactionEmoji}>{emoji}</Text>
              <Text style={styles.reactionCount}>{count}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderLeaderboardItem = ({ item }: { item: LeaderboardEntry }) => (
    <View style={styles.leaderboardCard}>
      <View style={styles.rankSection}>
        <View style={[
          styles.rankBadge,
          { backgroundColor: item.rank <= 3 ? '#FFD700' : '#8E8E93' }
        ]}>
          <Text style={styles.rankText}>{item.rank}</Text>
        </View>
      </View>

      {item.user.userLogo ? (
        <Image
          source={{ uri: item.user.userLogo }}
          style={styles.leaderboardAvatar}
        />
      ) : (
        <View style={[styles.leaderboardAvatar, styles.defaultAvatar]}>
          <Text style={styles.avatarText}>
            {item.user.fname.charAt(0)}{item.user.lname.charAt(0)}
          </Text>
        </View>
      )}

      <View style={styles.leaderboardInfo}>
        <Text style={styles.leaderboardName}>
          {item.user.fname} {item.user.lname}
        </Text>
        <Text style={styles.leaderboardStats}>
          {item.stats.totalPhotos} photos • {item.stats.totalLikes} likes
        </Text>
      </View>

      <View style={styles.leaderboardScore}>
        <Text style={styles.scoreText}>{item.stats.totalEngagement}</Text>
        <Text style={styles.scoreLabel}>points</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading event...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{eventTitle}</Text>
          <Text style={styles.headerSubtitle}>Photo Competition</Text>
        </View>
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={openCamera}
          disabled={uploading}>
          {uploading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Icon name="camera" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'photos' && styles.activeTab]}
          onPress={() => setActiveTab('photos')}>
          <Icon
            name="images"
            size={16}
            color={activeTab === 'photos' ? '#FFFFFF' : '#8E8E93'}
          />
          <Text style={[
            styles.tabText,
            activeTab === 'photos' && styles.activeTabText
          ]}>
            Photos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'leaderboard' && styles.activeTab]}
          onPress={() => setActiveTab('leaderboard')}>
          <Icon
            name="trophy"
            size={16}
            color={activeTab === 'leaderboard' ? '#FFFFFF' : '#8E8E93'}
          />
          <Text style={[
            styles.tabText,
            activeTab === 'leaderboard' && styles.activeTabText
          ]}>
            Leaderboard
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'photos' ? (
        <FlatList<EventPhoto>
          data={photos}
          renderItem={renderPhotoItem}
          keyExtractor={(item) => item._id}
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="camera-outline" size={48} color="#8E8E93" />
              <Text style={styles.emptyTitle}>No Photos Yet</Text>
              <Text style={styles.emptySubtitle}>
                Be the first to share an event photo!
              </Text>
            </View>
          }
        />
      ) : (
        <FlatList<LeaderboardEntry>
          data={leaderboard}
          renderItem={renderLeaderboardItem}
          keyExtractor={(item) => item.user._id}
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="trophy-outline" size={48} color="#8E8E93" />
              <Text style={styles.emptyTitle}>No Participants Yet</Text>
              <Text style={styles.emptySubtitle}>
                Upload photos to appear on the leaderboard
              </Text>
            </View>
          }
        />
      )}

      {/* Camera Options Modal */}
      <Modal
        visible={showCameraModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCameraModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Event Photo</Text>
            
            <TextInput
              style={styles.captionInput}
              placeholder="Add a caption (optional)..."
              value={captionText}
              onChangeText={setCaptionText}
              multiline
              maxLength={500}
            />

            <View style={styles.cameraOptions}>
              <TouchableOpacity
                style={styles.cameraOptionButton}
                onPress={() => handleCameraOption('camera')}>
                <Icon name="camera" size={32} color="#007AFF" />
                <Text style={styles.cameraOptionText}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cameraOptionButton}
                onPress={() => handleCameraOption('gallery')}>
                <Icon name="images" size={32} color="#007AFF" />
                <Text style={styles.cameraOptionText}>Gallery</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCameraModal(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Reaction Modal */}
      <Modal
        visible={showReactionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReactionModal(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowReactionModal(false)}>
          <View style={styles.reactionModal}>
            <Text style={styles.reactionModalTitle}>React to this photo</Text>
            <View style={styles.emojiGrid}>
              {EMOJI_REACTIONS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={styles.emojiButton}
                  onPress={() => addReaction(emoji)}>
                  <Text style={styles.emojiText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

// Styles following the same design pattern as other screens
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
  },

  headerContent: {
    flex: 1,
    marginLeft: 12,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
  },

  headerSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  cameraButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Tab Navigation
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },

  activeTab: {
    backgroundColor: '#007AFF',
  },

  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  activeTabText: {
    color: '#FFFFFF',
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
  },

  // Photo Card
  photoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },

  photoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  defaultAvatar: {
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'SF Pro Display',
  },

  userDetails: {
    marginLeft: 12,
  },

  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
  },

  uploadTime: {
    fontSize: 12,
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  engagementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF950020',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },

  engagementText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF9500',
    fontFamily: 'SF Pro Text',
  },

  photoImage: {
    width: '100%',
    height: screenWidth - 32, // Square aspect ratio
  },

  photoCaption: {
    fontSize: 14,
    color: '#1D1D1F',
    fontFamily: 'SF Pro Text',
    lineHeight: 20,
    padding: 16,
    paddingBottom: 8,
  },

  photoActions: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
    gap: 16,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Text',
  },

  reactionDisplay: {
    flexDirection: 'row',
    marginLeft: 'auto',
    gap: 8,
  },

  reactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 2,
  },

  reactionEmoji: {
    fontSize: 14,
  },

  reactionCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Text',
  },

  // Leaderboard
  leaderboardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  rankSection: {
    marginRight: 12,
  },

  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rankText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'SF Pro Display',
  },

  leaderboardAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },

  leaderboardInfo: {
    flex: 1,
  },

  leaderboardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
    marginBottom: 4,
  },

  leaderboardStats: {
    fontSize: 13,
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  leaderboardScore: {
    alignItems: 'flex-end',
  },

  scoreText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
  },

  scoreLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  // Empty States
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8E8E93',
    fontFamily: 'SF Pro Display',
    marginTop: 16,
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 32,
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
    textAlign: 'center',
    marginBottom: 20,
  },

  captionInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'SF Pro Text',
    marginBottom: 24,
    maxHeight: 80,
  },

  cameraOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },

  cameraOptionButton: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    minWidth: 100,
  },

  cameraOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    fontFamily: 'SF Pro Text',
    marginTop: 8,
  },

  cancelButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },

  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'SF Pro Text',
  },

  // Reaction Modal
  reactionModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 40,
    marginTop: 'auto',
    marginBottom: 'auto',
  },

  reactionModalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
    textAlign: 'center',
    marginBottom: 20,
  },

  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  emojiButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 25,
    marginBottom: 12,
  },

  emojiText: {
    fontSize: 24,
  },
});

export default EventPhotosScreen;

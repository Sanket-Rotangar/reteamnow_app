import React, { useEffect, useState, useCallback, useContext } from 'react';
import {
  FlatList,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  LayoutAnimation,
  UIManager,
  Platform,
  Share,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../context/authContext';
import { getAnnouncements, likeAnnouncement, markAsRead } from '../../services/announcementService';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

// ---- Components ----
const DividerComponent = () => <View style={styles.divider} />;

// ---- Types ----
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

// ---- Inner Card ----
const AnnouncementCard = ({ item, onLike, onToggleRead, onShare }: { 
  item: Announcement; 
  onLike: (id: string) => void; 
  onToggleRead: (id: string) => void;
  onShare: (item: Announcement) => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.easeInEaseOut();
    setExpanded(!expanded);
  };

  const getBadgeColors = () => {
    if (item.readByUser) {
      return { backgroundColor: '#F1F3F4', textColor: '#5F6368' };
    }
    return { backgroundColor: '#E3F2FD', textColor: '#1976D2' };
  };

  const badgeColors = getBadgeColors();

  return (
    <View style={styles.card}>
      {/* Title + Badge */}
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          {item.subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>{item.subtitle}</Text>
          )}
        </View>
        <View style={[styles.badge, { backgroundColor: badgeColors.backgroundColor }]}>
          <Text style={[styles.badgeText, { color: badgeColors.textColor }]}>
            {item.readByUser ? 'Read' : 'New'}
          </Text>
        </View>
      </View>

      {/* Timestamp */}
      <View style={styles.timestampContainer}>
        <Icon name="time-outline" size={14} color="#8E8E93" />
        <Text style={styles.timestamp}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>

      {/* Message */}
      <View style={styles.messageContainer}>
        <Text numberOfLines={expanded ? undefined : 3} style={styles.message}>
          {item.message}
        </Text>
        {item.message.length > 120 && (
          <TouchableOpacity onPress={toggleExpand} style={styles.readMoreBtn}>
            <Text style={styles.readMore}>{expanded ? 'Show Less' : 'Read More'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Media */}
      {item.mediaUrl && (
        <View style={styles.mediaContainer}>
          <Image 
            source={{ uri: item.mediaUrl }} 
            style={{ width: '100%', height: 200, borderRadius: 6 } as any}
            resizeMode="cover" 
          />
          {item.mediaType === 'video' && (
            <View style={styles.playOverlay}>
              <Icon name="play-circle" size={50} color="white" />
            </View>
          )}
        </View>
      )}

      {/* Footer Actions */}
      <View style={styles.footer}>
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={() => onLike(item._id)} style={styles.actionBtn}>
            <Icon
              name={item.likedByUser ? 'heart' : 'heart-outline'}
              size={20}
              color={item.likedByUser ? '#FF3B30' : '#8E8E93'}
            />
            <Text style={[
              styles.actionText, 
              { color: item.likedByUser ? '#FF3B30' : '#8E8E93' }
            ] as any}>
              {item.likesCount || item.likes.length}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onShare(item)} style={styles.actionBtn}>
            <Icon name="share-outline" size={20} color="#8E8E93" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>

        {!item.readByUser && (
          <TouchableOpacity
            onPress={() => onToggleRead(item._id)}
            style={styles.markReadBtn}>
            <Text style={styles.markReadText}>Mark as Read</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// ---- Main Screen ----
const AnnouncementScreen = () => {
  const { userInfo } = useContext(AuthContext);
  const userId = userInfo?._id ?? '';
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'All' | 'Unread'>('All');

  const fetchData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const filterParam = filter.toLowerCase() as 'all' | 'unread';
      const data = await getAnnouncements(filterParam, userId);
      setAnnouncements(data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, userId]);

  const handleLike = async (id: string) => {
    if (!userId) return;
    try {
      const result = await likeAnnouncement(id, userId);
      setAnnouncements(prev =>
        prev.map(item =>
          item._id === id
            ? {
                ...item,
                likes: result.likes,
                likedByUser: result.likedByUser,
                likesCount: result.likesCount,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error('Error liking announcement:', error);
    }
  };

  const handleToggleRead = async (id: string) => {
    if (!userId) return;
    try {
      const result = await markAsRead(id, userId);
      setAnnouncements(prev =>
        prev.map(item =>
          item._id === id
            ? { 
                ...item, 
                readBy: result.readBy,
                readByUser: result.readByUser
              }
            : item,
        ),
      );
    } catch (error) {
      console.error('Error marking announcement as read:', error);
    }
  };

  const handleShare = async (item: Announcement) => {
    try {
      const message = `${item.title}\n\n${item.message}`;
      const shareOptions: any = {
        message: message,
        title: item.title,
      };
      
      if (item.mediaUrl) {
        shareOptions.url = item.mediaUrl;
      }

      const result = await Share.share(shareOptions);
      
      if (result.action === Share.sharedAction) {
        console.log('Content shared successfully');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing announcement:', error);
      Alert.alert('Error', 'Failed to share announcement');
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter, fetchData]);

  const filteredAnnouncements = announcements.filter(item => {
    if (filter === 'Unread') return !item.readByUser;
    return true;
  });

  if (loading && announcements.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1976D2" />
          <Text style={styles.loadingText}>Loading announcements...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Modern Header - Consistent with other screens */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.screenTitle}>Announcements</Text>
          <Text style={styles.screenSubtitle}>Company Updates & News</Text>
        </View>
        <TouchableOpacity style={styles.headerAction}>
          <Icon name="notifications-outline" size={22} color="#007AFF" />
          {announcements.filter(item => !item.readByUser).length > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>
                {announcements.filter(item => !item.readByUser).length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* List with Tabs as Sticky Header */}
      <FlatList
        data={filteredAnnouncements}
        keyExtractor={item => item._id}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <View style={styles.tabs}>
            {['All', 'Unread'].map(tab => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, filter === tab && styles.activeTab]}
                onPress={() => setFilter(tab as any)}>
                <Text style={[styles.tabText, filter === tab && styles.activeTabText]}>
                  {tab}
                </Text>
                {tab === 'Unread' && announcements.filter(item => !item.readByUser).length > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>
                      {announcements.filter(item => !item.readByUser).length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        }
        renderItem={({ item }) => (
          <AnnouncementCard 
            item={item} 
            onLike={handleLike} 
            onToggleRead={handleToggleRead}
            onShare={handleShare}
          />
        )}
        ItemSeparatorComponent={DividerComponent}
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={fetchData}
            colors={['#1976D2']}
            tintColor="#1976D2"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          filteredAnnouncements.length === 0 ? styles.emptyContainer : styles.listContent
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <Icon name="notifications-outline" size={64} color="#BDC1C6" />
              <Text style={styles.emptyTitle}>
                {filter === 'Unread' ? 'No unread announcements' : 'No announcements yet'}
              </Text>
              <Text style={styles.emptyMessage}>
                {filter === 'Unread' 
                  ? 'All caught up! Check back later for new updates.' 
                  : 'New announcements will appear here when they are posted.'
                }
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default AnnouncementScreen;

// ---- Styles ----
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F7FA' 
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
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
  headerContent: {
    flex: 1,
  },
  screenTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#1D1D1F' 
  },
  screenSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  headerAction: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
  },
  headerBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },

  // Tabs
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    gap: 20,
    marginBottom: 8,
  },
  tab: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6, 
    paddingHorizontal: 12, 
    borderRadius: 6,
    backgroundColor: 'transparent',
    gap: 6,
  },
  activeTab: { 
    backgroundColor: '#E3F2FD' 
  },
  tabText: { 
    fontSize: 16, 
    color: '#8E8E93',
    fontWeight: '500',
  },
  activeTabText: { 
    color: '#1976D2', 
    fontWeight: '600' 
  },
  unreadBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Card
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 4,
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  // Card Header
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1D1D1F',
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
    marginTop: 2,
  },
  badge: { 
    paddingVertical: 3, 
    paddingHorizontal: 8, 
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgeText: { 
    fontSize: 12, 
    fontWeight: '600' 
  },

  // Timestamp
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  timestamp: { 
    fontSize: 13, 
    color: '#8E8E93',
    fontWeight: '500',
  },

  // Message
  messageContainer: {
    marginBottom: 12,
  },
  message: { 
    fontSize: 15, 
    color: '#333333',
    lineHeight: 22,
    marginBottom: 6,
  },
  readMoreBtn: {
    alignSelf: 'flex-start',
  },
  readMore: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#1976D2' 
  },

  // Media
  mediaContainer: { 
    position: 'relative', 
    marginBottom: 16,
    borderRadius: 6,
    overflow: 'hidden',
  },
  image: { 
    width: '100%', 
    height: 200, 
    borderRadius: 6,
  } as any,
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F4',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  actionBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6,
  },
  actionText: { 
    fontSize: 15, 
    color: '#8E8E93',
    fontWeight: '500',
  },
  markReadBtn: {
    backgroundColor: '#1976D2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  markReadText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Divider
  divider: { 
    height: 1, 
    backgroundColor: 'transparent', 
  },

  // List Content
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#5F6368',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  
  // Legacy loading style for compatibility
  loading: { 
    marginTop: 40 
  },
});

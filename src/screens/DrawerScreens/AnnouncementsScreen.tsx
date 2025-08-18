/**
 * Team Communication Hub - Slack-Inspired Interface
 * 
 * Modern workplace communication platform with:
 * - Channel-based messaging system
 * - Direct messages and group chats
 * - File sharing and media support
 * - Real-time notifications and presence
 * - Thread-based conversations
 * 
 * UI Design: Professional, clean, and intuitive
 * Following company design system consistency
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

/**
 * Color Palette - Consistent with app design
 */
const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#30D158',
  warning: '#FF9500',
  error: '#FF3B30',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#1D1D1F',
  textSecondary: '#8E8E93',
  border: '#E5E5EA',
  accent: '#F2F2F7',
  online: '#30D158',
  away: '#FF9500',
  offline: '#8E8E93',
};

/**
 * Interface Definitions
 */
interface Channel {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'direct';
  memberCount?: number;
  lastMessage?: string;
  lastActivity: string;
  unreadCount: number;
  isActive?: boolean;
  avatar?: string;
  onlineStatus?: 'online' | 'away' | 'offline';
}

interface Message {
  id: string;
  channelId: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'image' | 'announcement';
  reactions?: Array<{
    emoji: string;
    count: number;
    users: string[];
  }>;
  threadCount?: number;
  isEdited?: boolean;
}

const AnnouncementsScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<string>('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');
  const [currentView, setCurrentView] = useState<'channels' | 'dms' | 'threads'>('channels');
  const [showChannels, setShowChannels] = useState(false);

  // Mock data for channels
  const [channels] = useState<Channel[]>([
    {
      id: 'general',
      name: 'general',
      description: 'Company-wide announcements and updates',
      type: 'public',
      memberCount: 124,
      lastMessage: 'Welcome to our new team members! 🎉',
      lastActivity: '2 min ago',
      unreadCount: 3,
      isActive: true,
    },
    {
      id: 'development',
      name: 'development',
      description: 'Tech discussions and project updates',
      type: 'public',
      memberCount: 28,
      lastMessage: 'New feature deployment scheduled for...',
      lastActivity: '15 min ago',
      unreadCount: 0,
    },
    {
      id: 'design',
      name: 'design',
      description: 'Design reviews and creative discussions',
      type: 'public',
      memberCount: 15,
      lastMessage: 'Updated the design system documentation',
      lastActivity: '1 hour ago',
      unreadCount: 1,
    },
    {
      id: 'random',
      name: 'random',
      description: 'Casual conversations and fun stuff',
      type: 'public',
      memberCount: 98,
      lastMessage: 'Anyone up for coffee? ☕',
      lastActivity: '3 hours ago',
      unreadCount: 0,
    },
  ]);

  // Mock data for direct messages
  const [directMessages] = useState<Channel[]>([
    {
      id: 'dm_sarah',
      name: 'Sarah Johnson',
      type: 'direct',
      lastMessage: 'Thanks for the project update!',
      lastActivity: '5 min ago',
      unreadCount: 2,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9e48644?w=100',
      onlineStatus: 'online',
    },
    {
      id: 'dm_mike',
      name: 'Mike Chen',
      type: 'direct',
      lastMessage: 'Can we discuss the budget proposal?',
      lastActivity: '1 hour ago',
      unreadCount: 0,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      onlineStatus: 'away',
    },
    {
      id: 'dm_team_lead',
      name: 'Alex Wilson',
      type: 'direct',
      lastMessage: 'Great work on the presentation!',
      lastActivity: '2 hours ago',
      unreadCount: 1,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      onlineStatus: 'offline',
    },
  ]);

  // Mock data for messages
  const [messages] = useState<Message[]>([
    {
      id: '1',
      channelId: 'general',
      sender: {
        id: 'admin',
        name: 'Admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        role: 'Administrator',
      },
      content: '🎉 Welcome to our new team communication platform! This is where we\'ll share updates, collaborate on projects, and stay connected as a team.',
      timestamp: '10:30 AM',
      type: 'announcement',
      reactions: [
        { emoji: '👍', count: 12, users: [] },
        { emoji: '❤️', count: 8, users: [] },
        { emoji: '🎉', count: 15, users: [] },
      ],
    },
    {
      id: '2',
      channelId: 'general',
      sender: {
        id: 'sarah',
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9e48644?w=100',
        role: 'Project Manager',
      },
      content: 'This looks great! Love the clean interface. 📱✨',
      timestamp: '10:35 AM',
      type: 'text',
      reactions: [
        { emoji: '👍', count: 5, users: [] },
      ],
    },
    {
      id: '3',
      channelId: 'general',
      sender: {
        id: 'mike',
        name: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        role: 'Developer',
      },
      content: 'Quick reminder: Team standup at 2 PM today. We\'ll be discussing the Q3 roadmap and sprint planning. 🚀',
      timestamp: '11:15 AM',
      type: 'text',
      threadCount: 3,
    },
  ]);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      Toast.show({
        type: 'success',
        text1: 'Refreshed',
        text2: 'Latest messages loaded',
      });
    }, 1500);
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      Toast.show({
        type: 'success',
        text1: 'Message Sent',
        text2: 'Your message has been delivered',
      });
      setMessageText('');
    }
  };

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannel(channelId);
    setShowChannels(false);
  };

  const renderChannelItem = ({ item }: { item: Channel }) => (
    <TouchableOpacity
      style={[
        styles.channelItem,
        selectedChannel === item.id && styles.selectedChannel,
      ]}
      onPress={() => handleChannelSelect(item.id)}
    >
      <View style={styles.channelLeft}>
        {item.type === 'direct' ? (
          <View style={styles.avatarContainer}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={[styles.statusDot, { backgroundColor: colors[item.onlineStatus || 'offline'] }]} />
          </View>
        ) : (
          <View style={[styles.channelIcon, item.type === 'private' && styles.privateChannel]}>
            <Icon 
              name={item.type === 'private' ? 'lock-closed' : 'hashtag'} 
              size={16} 
              color={colors.textSecondary} 
            />
          </View>
        )}
        <View style={styles.channelContent}>
          <View style={styles.channelHeader}>
            <Text style={[styles.channelName, selectedChannel === item.id && styles.selectedChannelName]}>
              {item.name}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
      </View>
      <Text style={styles.lastActivity}>{item.lastActivity}</Text>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.type === 'announcement' && styles.announcementMessage]}>
      <Image source={{ uri: item.sender.avatar }} style={styles.messageAvatar} />
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.senderName}>{item.sender.name}</Text>
          <Text style={styles.senderRole}>{item.sender.role}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <Text style={styles.messageText}>{item.content}</Text>
        
        {/* Reactions */}
        {item.reactions && item.reactions.length > 0 && (
          <View style={styles.reactionsContainer}>
            {item.reactions.map((reaction, index) => (
              <TouchableOpacity key={index} style={styles.reactionPill}>
                <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
                <Text style={styles.reactionCount}>{reaction.count}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Thread indicator */}
        {item.threadCount && (
          <TouchableOpacity style={styles.threadIndicator}>
            <Icon name="chatbubbles-outline" size={14} color={colors.primary} />
            <Text style={styles.threadCount}>{item.threadCount} replies</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderSidebar = () => (
    <View style={styles.channelModal}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Team Communication</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setShowChannels(false)}
        >
          <Icon name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={18} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabContainer}>
        {[
          { key: 'channels', label: 'Channels', icon: 'hashtag' },
          { key: 'dms', label: 'Direct Messages', icon: 'person' },
          { key: 'threads', label: 'Threads', icon: 'chatbubbles' },
        ].map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, currentView === tab.key && styles.activeTab]}
            onPress={() => setCurrentView(tab.key as any)}
          >
            <Icon 
              name={tab.icon} 
              size={16} 
              color={currentView === tab.key ? colors.primary : colors.textSecondary} 
            />
            <Text style={[styles.tabLabel, currentView === tab.key && styles.activeTabLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Channel/DM List */}
      <FlatList
        data={currentView === 'channels' ? channels : directMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderChannelItem}
        style={styles.channelList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.surface} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.channelButton}
            onPress={() => setShowChannels(true)}
          >
            <Icon name="menu" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.headerTitle}>Team Hub</Text>
            <Text style={styles.headerSubtitle}>
              #{channels.find(c => c.id === selectedChannel)?.name || 'general'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.headerAction}>
          <Icon name="notifications-outline" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        style={styles.messagesContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <FlatList
          data={messages.filter(m => m.channelId === selectedChannel)}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          scrollEnabled={false}
          contentContainerStyle={styles.messagesList}
        />
      </ScrollView>

      {/* Message Input */}
      <View style={styles.messageInput}>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Icon name="attach" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder={`Message #${channels.find(c => c.id === selectedChannel)?.name || 'general'}`}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            placeholderTextColor={colors.textSecondary}
          />
          <TouchableOpacity style={styles.emojiButton}>
            <Icon name="happy-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sendButton, messageText.trim() && styles.sendButtonActive]}
            onPress={handleSendMessage}
          >
            <Icon 
              name="send" 
              size={18} 
              color={messageText.trim() ? colors.surface : colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Channel Modal */}
      {showChannels && (
        <View style={styles.modalOverlay}>
          {renderSidebar()}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  channelButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitles: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'SF Pro Display',
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'SF Pro Text',
    marginTop: 2,
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Modal for channels
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  channelModal: {
    backgroundColor: colors.surface,
    height: '80%',
    marginTop: 60,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'SF Pro Display',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
    fontFamily: 'SF Pro Text',
  },

  // Tabs
  tabContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  activeTab: {
    backgroundColor: colors.accent,
  },
  tabLabel: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    fontFamily: 'SF Pro Text',
  },
  activeTabLabel: {
    color: colors.primary,
  },

  // Channel List
  channelList: {
    flex: 1,
  },
  channelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedChannel: {
    backgroundColor: colors.accent,
  },
  channelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  channelIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  privateChannel: {
    backgroundColor: colors.warning + '20',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  channelContent: {
    flex: 1,
  },
  channelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  channelName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'SF Pro Display',
  },
  selectedChannelName: {
    color: colors.primary,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.surface,
    fontFamily: 'SF Pro Text',
  },
  lastMessage: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'SF Pro Text',
  },
  lastActivity: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: 'SF Pro Text',
  },

  // Messages
  messagesContainer: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  messagesList: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    marginBottom: 8,
  },
  announcementMessage: {
    backgroundColor: colors.accent,
    marginHorizontal: -20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  messageAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'SF Pro Display',
  },
  senderRole: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
    fontFamily: 'SF Pro Text',
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 'auto',
    fontFamily: 'SF Pro Text',
  },
  messageText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 20,
    fontFamily: 'SF Pro Text',
  },
  reactionsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  reactionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  reactionEmoji: {
    fontSize: 14,
  },
  reactionCount: {
    fontSize: 12,
    color: colors.text,
    marginLeft: 4,
    fontFamily: 'SF Pro Text',
  },
  threadIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  threadCount: {
    fontSize: 13,
    color: colors.primary,
    marginLeft: 6,
    fontFamily: 'SF Pro Text',
  },

  // Message Input
  messageInput: {
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.accent,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 44,
  },
  attachButton: {
    padding: 8,
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    fontSize: 16,
    color: colors.text,
    fontFamily: 'SF Pro Text',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  emojiButton: {
    padding: 8,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.textSecondary,
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: colors.primary,
  },
});

export default AnnouncementsScreen;

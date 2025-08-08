/**
 * Announcements Screen Component
 * 
 * This screen displays company announcements as per requirements:
 * - Admin creates announcements via the web panel
 * - Mobile app shows all announcements under this section  
 * - Optional: Notifications for new announcements
 * 
 * Features modern announcement feed with categorization
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  RefreshControl,
} from 'react-native';

/**
 * Modern Color Palette
 */
const colors = {
  primary: '#6366F1',
  secondary: '#EC4899',
  success: '#10B981',
  warning: '#F59E0B',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  accent: '#F3F4F6',
};

/**
 * Interface for announcements
 */
interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  isRead: boolean;
}

const AnnouncementsScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  
  // Sample announcements - in real app this would come from API
  const [announcements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Company Picnic Planning',
      content: 'We are excited to announce our annual company picnic! Please vote for your preferred location in the Fun Zone poll.',
      author: 'HR Team',
      date: '2024-01-20',
      priority: 'high',
      category: 'Events',
      isRead: false,
    },
    {
      id: '2',
      title: 'New Health Benefits',
      content: 'Starting next month, we are expanding our health benefits package to include dental and vision coverage.',
      author: 'Management',
      date: '2024-01-18',
      priority: 'medium',
      category: 'Benefits',
      isRead: true,
    },
    {
      id: '3',
      title: 'Office WiFi Maintenance',
      content: 'Scheduled maintenance on office WiFi network this Friday from 2-4 PM. Please plan accordingly.',
      author: 'IT Department',
      date: '2024-01-15',
      priority: 'low',
      category: 'IT',
      isRead: true,
    },
  ]);

  /**
   * Handle refresh action
   */
  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  /**
   * Get priority color
   */
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return colors.warning;
      case 'medium':
        return colors.primary;
      case 'low':
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Announcements</Text>
        <Text style={styles.headerSubtitle}>
          Stay updated with company news and updates
        </Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Announcements List */}
        {announcements.map((announcement) => (
          <View key={announcement.id} style={styles.announcementCard}>
            {/* Announcement Header */}
            <View style={styles.announcementHeader}>
              <View style={styles.titleSection}>
                <Text style={styles.announcementTitle}>{announcement.title}</Text>
                {!announcement.isRead && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>New</Text>
                  </View>
                )}
              </View>
              
              <View style={[
                styles.priorityBadge,
                { backgroundColor: `${getPriorityColor(announcement.priority)}20` }
              ]}>
                <Text style={[
                  styles.priorityText,
                  { color: getPriorityColor(announcement.priority) }
                ]}>
                  {announcement.priority.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Announcement Meta */}
            <View style={styles.announcementMeta}>
              <Text style={styles.authorText}>By {announcement.author}</Text>
              <Text style={styles.dateText}>{announcement.date}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{announcement.category}</Text>
              </View>
            </View>

            {/* Announcement Content */}
            <Text style={styles.announcementContent}>
              {announcement.content}
            </Text>
          </View>
        ))}

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📢 About Announcements</Text>
          <Text style={styles.infoText}>
            Important company updates and announcements will appear here. 
            Make sure to check regularly for new information!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AnnouncementsScreen;

/**
 * Styles for the Announcements screen
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.surface,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: `${colors.surface}CC`,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  announcementCard: {
    backgroundColor: colors.surface,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  unreadText: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: 'bold',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  announcementMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 8,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 8,
  },
  categoryBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    color: colors.text,
    fontWeight: '600',
  },
  announcementContent: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: colors.surface,
    margin: 0,
    marginTop: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

/**
 * Events List Screen - Browse and Access Event Photo Competitions
 * Following the same design principles as other screens
 * Features: List of active events, navigation to event details
 * Role-based access: All users can view and participate in events
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { getAllEvents } from '../../services/eventService';

// Types
interface Event {
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

interface Props {
  navigation: any;
}

const EventsListScreen: React.FC<Props> = ({ navigation }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    'active' | 'completed' | 'all'
  >('active');

  // Fetch events from API
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      
      // Use the event service to fetch events
      const apiEvents = await getAllEvents(
        activeFilter === 'all' ? undefined : activeFilter,
      );
      
      // Ensure we have an array
      const eventsArray = Array.isArray(apiEvents) ? apiEvents : [];
      setEvents(eventsArray);
    } catch (error) {
      console.error('Fetch events error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load events. Please check your connection.',
      });

    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  }, [fetchEvents]);

  const handleEventPress = (event: Event) => {
    navigation.navigate('EventPhotos', {
      eventId: event._id,
      eventTitle: event.title,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#34C759';
      case 'completed':
        return '#8E8E93';
      case 'cancelled':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderEventCard = (event: Event) => (
    <TouchableOpacity
      key={event._id}
      style={styles.eventCard}
      activeOpacity={0.8}
      onPress={() => handleEventPress(event)}
    >
      <View style={styles.eventHeader}>
        <View style={styles.eventTitleSection}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <View style={styles.eventMeta}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(event.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusText(event.status)}
              </Text>
            </View>
            <Text style={styles.eventDate}>{formatDate(event.createdAt)}</Text>
          </View>
        </View>
        <Icon name="chevron-forward" size={20} color="#8E8E93" />
      </View>

      <Text style={styles.eventDescription} numberOfLines={2}>
        {event.description}
      </Text>

      {event.location && (
        <View style={styles.locationContainer}>
          <Icon name="location" size={14} color="#8E8E93" />
          <Text style={styles.locationText}>{event.location}</Text>
        </View>
      )}

      <View style={styles.eventFooter}>
        <View style={styles.participantInfo}>
          <Icon name="camera" size={16} color="#007AFF" />
          <Text style={styles.participantText}>Photo Competition</Text>
        </View>
        <View style={styles.eventActions}>
          <Icon name="images" size={16} color="#8E8E93" />
          <Icon name="trophy" size={16} color="#FFD700" />
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading events...</Text>
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
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Event Photos</Text>
          <Text style={styles.headerSubtitle}>Photo Competitions</Text>
        </View>
        <View style={styles.headerActions}>
          <Icon name="camera" size={20} color="#007AFF" />
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {(['active', 'completed', 'all'] as const).map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterTab,
              activeFilter === filter && styles.activeFilterTab,
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === filter && styles.activeFilterTabText,
              ]}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Events List */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {events.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="calendar-outline" size={48} color="#8E8E93" />
            <Text style={styles.emptyTitle}>No Events Found</Text>
            <Text style={styles.emptySubtitle}>
              {activeFilter === 'active'
                ? 'No active events at the moment'
                : `No ${activeFilter} events found`}
            </Text>
          </View>
        ) : (
          <View style={styles.eventsContainer}>
            {events.map(renderEventCard)}
          </View>
        )}

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Icon name="camera" size={32} color="#007AFF" />
            <Text style={styles.infoTitle}>How it works</Text>
            <Text style={styles.infoText}>
              Participate in photo competitions by uploading event photos. Get
              likes and reactions from colleagues, and compete on the
              leaderboard!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles following the same design pattern
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

  headerActions: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
  },

  // Filter Tabs
  filterContainer: {
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

  filterTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  activeFilterTab: {
    backgroundColor: '#007AFF',
  },

  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  activeFilterTabText: {
    color: '#FFFFFF',
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },

  eventsContainer: {
    paddingTop: 8,
  },

  // Event Card
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
  },

  eventHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  eventTitleSection: {
    flex: 1,
    marginRight: 12,
  },

  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
    marginBottom: 8,
  },

  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'SF Pro Text',
  },

  eventDate: {
    fontSize: 12,
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  eventDescription: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
    lineHeight: 20,
    marginBottom: 12,
  },

  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },

  locationText: {
    fontSize: 13,
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  eventFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  participantText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#007AFF',
    fontFamily: 'SF Pro Text',
  },

  eventActions: {
    flexDirection: 'row',
    gap: 12,
  },

  // Empty State
  emptyContainer: {
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

  // Info Section
  infoSection: {
    paddingVertical: 24,
  },

  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
    marginTop: 12,
    marginBottom: 8,
  },

  infoText: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default EventsListScreen;

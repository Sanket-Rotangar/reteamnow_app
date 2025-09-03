import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { getAllCompetitions, Competition } from '../../services/eventService';

// --- Reusable Component for a single competition card ---
interface CompetitionCardProps {
  competition: Competition;
  onPress: (competition: Competition) => void;
}

const CompetitionCard: React.FC<CompetitionCardProps> = ({ competition, onPress }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#34C759';
      case 'completed': return '#8E8E93';
      case 'cancelled': return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      style={styles.competitionCard}
      activeOpacity={0.8}
      onPress={() => onPress(competition)}
    >
      {/* Competition Header */}
      <View style={styles.competitionHeader}>
        <View style={styles.competitionTitleSection}>
          <Text style={styles.competitionTitle}>{competition.name}</Text>
          <View style={styles.competitionMeta}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(competition.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusText(competition.status)}
              </Text>
            </View>
            <Text style={styles.competitionDate}>{formatDate(competition.start_date)}</Text>
          </View>
        </View>
        <Icon name="chevron-forward" size={20} color="#8E8E93" />
      </View>

      {/* Competition Description */}
      <Text style={styles.competitionDescription} numberOfLines={2}>
        {competition.description}
      </Text>

      {/* Competition Footer */}
      <View style={styles.competitionFooter}>
        <View style={styles.participantInfo}>
          <Icon name="camera" size={16} color="#007AFF" />
          <Text style={styles.participantText}>Photo Competition</Text>
        </View>
        <View style={styles.competitionActions}>
          <Icon name="images" size={16} color="#8E8E93" />
          <Icon name="trophy" size={16} color="#FFD700" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

// --- List Header, Footer, and Empty Components (Moved out of render) ---
const ListEmptyComponent = ({ activeFilter }: { activeFilter: 'active' | 'completed' | 'all' }) => (
  <View style={styles.emptyContainer}>
    <Icon name="calendar-outline" size={48} color="#8E8E93" />
    <Text style={styles.emptyTitle}>No Competitions Found</Text>
    <Text style={styles.emptySubtitle}>
      {activeFilter === 'active'
        ? 'No active competitions at the moment'
        : `No ${activeFilter} competitions found`}
    </Text>
  </View>
);

const ListHeaderComponent = ({ activeFilter, setActiveFilter }: { activeFilter: 'active' | 'completed' | 'all', setActiveFilter: (filter: 'active' | 'completed' | 'all') => void }) => (
  <View>
    <View style={styles.infoCard}>
      <Icon name="camera" size={32} color="#007AFF" />
      <Text style={styles.infoTitle}>How it works</Text>
      <Text style={styles.infoText}>
        Participate in photo competitions by uploading event photos. Get
        likes and reactions from colleagues, and compete on the
        leaderboard!
      </Text>
    </View>
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
  </View>
);

// --- Main Screen Component ---
interface Props {
  navigation: any;
}

const CompetitionsListScreen: React.FC<Props> = ({ navigation }) => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'active' | 'completed' | 'all'>('active');

  const fetchCompetitions = useCallback(async () => {
    try {
      const apiCompetitions = await getAllCompetitions(
        activeFilter === 'all' ? undefined : activeFilter,
      );
      const competitionsArray = Array.isArray(apiCompetitions) ? apiCompetitions : [];
      setCompetitions(competitionsArray);
    } catch (error) {
      console.error('Fetch competitions error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load competitions. Please check your connection.',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeFilter]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCompetitions();
  }, [fetchCompetitions]);

  useEffect(() => {
    fetchCompetitions();
  }, [fetchCompetitions]);

  const handleCompetitionPress = (competition: Competition) => {
    navigation.navigate('CompetitionDetails', {
      competitionId: competition._id,
      competitionTitle: competition.name,
    });
  };
  
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
          <Text style={styles.headerTitle}>Competitions</Text>
          <Text style={styles.headerSubtitle}>Photo Competitions</Text>
        </View>
        <View style={styles.headerActions}>
          <Icon name="camera" size={20} color="#007AFF" />
        </View>
      </View>

      {/* Main Content using FlatList */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading competitions...</Text>
        </View>
      ) : (
        <FlatList
          data={competitions}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <CompetitionCard competition={item} onPress={handleCompetitionPress} />
          )}
          contentContainerStyle={styles.eventsContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListHeaderComponent={() => <ListHeaderComponent activeFilter={activeFilter} setActiveFilter={setActiveFilter} />}
          ListEmptyComponent={() => <ListEmptyComponent activeFilter={activeFilter} />}
        />
      )}
    </SafeAreaView>
  );
};

// Styles
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
  },
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
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  headerActions: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 8,
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
  },
  activeFilterTabText: {
    color: '#FFFFFF',
  },
  eventsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  competitionCard: {
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
  competitionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  competitionTitleSection: {
    flex: 1,
    marginRight: 12,
  },
  competitionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  competitionMeta: {
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
  },
  competitionDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  competitionDescription: {
    fontSize: 14,
    color: '#8E8E93',
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
  },
  competitionFooter: {
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
  },
  competitionActions: {
    flexDirection: 'row',
    gap: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 32,
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
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginTop: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default CompetitionsListScreen;

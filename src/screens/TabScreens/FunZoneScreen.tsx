/**
 * Interactive Fun Zone Screen - Gaming & Social Features
 *
 * Following the same 10-30-60 design rule with professional light theme
 * Features: Detailed leaderboard, ongoing games, completed games, upcoming events
 * Interactive elements for employee engagement and team building
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

// Mock data for leaderboard
const leaderboardData = [
  { id: '1', name: 'Sarah Johnson', points: 2840, avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9e48644?w=150', rank: 1, badge: 'Champion', streak: 12 },
  { id: '2', name: 'Mike Chen', points: 2650, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', rank: 2, badge: 'Expert', streak: 8 },
  { id: '3', name: 'Emily Davis', points: 2420, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', rank: 3, badge: 'Pro', streak: 15 },
  { id: '4', name: 'Alex Wilson', points: 2180, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', rank: 4, badge: 'Rising', streak: 5 },
  { id: '5', name: 'Lisa Brown', points: 1950, avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150', rank: 5, badge: 'Talented', streak: 7 },
];

// Mock data for games
const ongoingGames = [
  { id: '1', title: 'Office Trivia Challenge', participants: 24, timeLeft: '2h 15m', category: 'Knowledge', difficulty: 'Medium' },
  { id: '2', title: 'Step Counter Competition', participants: 18, timeLeft: '5d 3h', category: 'Fitness', difficulty: 'Easy' },
  { id: '3', title: 'Creative Photo Contest', participants: 31, timeLeft: '1d 8h', category: 'Creative', difficulty: 'Hard' },
];

const recentGames = [
  { id: '1', title: 'Monday Mood Quiz', winner: 'Sarah J.', points: 150, completed: '2 days ago', participants: 45 },
  { id: '2', title: 'Team Building Puzzle', winner: 'Team Alpha', points: 300, completed: '1 week ago', participants: 32 },
  { id: '3', title: 'Coffee Knowledge Test', winner: 'Mike C.', points: 200, completed: '1 week ago', participants: 28 },
];

const upcomingEvents = [
  { id: '1', title: 'Monthly Gaming Tournament', date: 'Aug 25, 2025', time: '2:00 PM', participants: 0, maxParticipants: 50 },
  { id: '2', title: 'Wellness Challenge Kickoff', date: 'Sep 1, 2025', time: '10:00 AM', participants: 12, maxParticipants: 30 },
  { id: '3', title: 'Innovation Hackathon', date: 'Sep 15, 2025', time: '9:00 AM', participants: 8, maxParticipants: 40 },
];

const FunZoneScreen = () => {
  const [selectedTab, setSelectedTab] = useState('ongoing');

  const showToast = (message: string) => {
    Toast.show({
      type: 'success',
      text1: 'Fun Zone',
      text2: message,
    });
  };

  const handleJoinGame = (gameTitle: string) => {
    showToast(`Joined ${gameTitle}! 🎮`);
  };

  const handleViewGame = (gameTitle: string) => {
    showToast(`Viewing ${gameTitle} details 👀`);
  };

  const renderLeaderboardItem = ({ item, index: _index }: { item: any; index: number }) => {
    const getRankColor = (rank: number) => {
      switch(rank) {
        case 1: return '#FFD700'; // Gold
        case 2: return '#C0C0C0'; // Silver  
        case 3: return '#CD7F32'; // Bronze
        default: return '#8E8E93';
      }
    };

    const getBadgeColor = (badge: string) => {
      switch(badge) {
        case 'Champion': return '#FF6B6B';
        case 'Expert': return '#4ECDC4';
        case 'Pro': return '#45B7D1';
        case 'Rising': return '#96CEB4';
        default: return '#8E8E93';
      }
    };

    return (
      <TouchableOpacity 
        style={styles.leaderboardItem}
        activeOpacity={0.8}
        onPress={() => showToast(`Viewing ${item.name}'s profile`)}>
        
        <View style={styles.rankSection}>
          <View style={[styles.rankBadge, { backgroundColor: getRankColor(item.rank) }]}>
            <Text style={styles.rankText}>{item.rank}</Text>
          </View>
        </View>

        <Image source={{ uri: item.avatar }} style={styles.avatarImage} />
        
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{item.name}</Text>
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, { backgroundColor: getBadgeColor(item.badge) }]}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.pointsText}>{item.points.toLocaleString()}</Text>
          <Text style={styles.pointsLabel}>points</Text>
          <View style={styles.streakInfo}>
            <Icon name="flame" size={12} color="#FF9500" />
            <Text style={styles.streakText}>{item.streak}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderGameCard = (game: any, type: 'ongoing' | 'recent' | 'upcoming') => {
    return (
      <TouchableOpacity
        key={game.id}
        style={styles.gameCard}
        activeOpacity={0.8}
        onPress={() => handleViewGame(game.title)}>
        
        <View style={styles.gameHeader}>
          <View style={styles.gameTitleSection}>
            <Text style={styles.gameTitle}>{game.title}</Text>
            {type === 'ongoing' && (
              <Text style={styles.gameCategory}>{game.category} • {game.difficulty}</Text>
            )}
            {type === 'recent' && (
              <Text style={styles.gameCategory}>Winner: {game.winner}</Text>
            )}
            {type === 'upcoming' && (
              <Text style={styles.gameCategory}>{game.date} at {game.time}</Text>
            )}
          </View>
          
          {type === 'ongoing' && (
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => handleJoinGame(game.title)}>
              <Text style={styles.joinButtonText}>Join</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.gameStats}>
          <View style={styles.statItem}>
            <Icon name="people" size={14} color="#8E8E93" />
            <Text style={styles.statText}>
              {type === 'upcoming' 
                ? `${game.participants}/${game.maxParticipants}`
                : game.participants
              } players
            </Text>
          </View>
          
          {type === 'ongoing' && (
            <View style={styles.statItem}>
              <Icon name="time" size={14} color="#FF9500" />
              <Text style={styles.statText}>{game.timeLeft} left</Text>
            </View>
          )}
          
          {type === 'recent' && (
            <View style={styles.statItem}>
              <Icon name="trophy" size={14} color="#FFD700" />
              <Text style={styles.statText}>{game.points} pts</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.screenTitle}>Fun Zone</Text>
          <Text style={styles.screenSubtitle}>Games & Leaderboard</Text>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => showToast('Fun Zone notifications!')}>
          <Icon name="trophy" size={20} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Leaderboard Section - Full Width Card */}
        <View style={styles.leaderboardSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🏆 Leaderboard</Text>
            <Text style={styles.sectionSubtitle}>Top performers this month</Text>
          </View>

          <View style={styles.leaderboardCard}>
            <FlatList
              data={leaderboardData}
              renderItem={renderLeaderboardItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>

        {/* Games Section Tabs */}
        <View style={styles.gamesSection}>
          <View style={styles.tabContainer}>
            {['ongoing', 'recent', 'upcoming'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, selectedTab === tab && styles.activeTab]}
                onPress={() => setSelectedTab(tab as any)}>
                <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.gamesContent}>
            {selectedTab === 'ongoing' && (
              <View>
                <Text style={styles.gamesTitle}>🎮 Ongoing Games</Text>
                {ongoingGames.map(game => renderGameCard(game, 'ongoing'))}
              </View>
            )}
            
            {selectedTab === 'recent' && (
              <View>
                <Text style={styles.gamesTitle}>🏁 Recently Completed</Text>
                {recentGames.map(game => renderGameCard(game, 'recent'))}
              </View>
            )}
            
            {selectedTab === 'upcoming' && (
              <View>
                <Text style={styles.gamesTitle}>📅 Upcoming Events</Text>
                {upcomingEvents.map(game => renderGameCard(game, 'upcoming'))}
              </View>
            )}
          </View>
        </View>

        {/* Interactive Features */}
        <View style={styles.interactiveSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {[
              { icon: 'add-circle', title: 'Create\nGame', color: '#007AFF' },
              { icon: 'stats-chart', title: 'My Stats', color: '#34C759' },
              { icon: 'people', title: 'Find\nTeam', color: '#FF3B30' },
              { icon: 'gift', title: 'Rewards', color: '#AF52DE' },
            ].map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                activeOpacity={0.8}
                onPress={() => showToast(`Opening ${action.title.replace('\n', ' ')}`)}>
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <Icon name={action.icon} size={18} color="#FFFFFF" />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

/**
 * Styles following the same 10-30-60 design pattern as HomeScreen
 */
const styles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  headerLeft: {
    flexDirection: 'column',
  },

  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
  },

  screenSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Content
  content: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  // Leaderboard Section
  leaderboardSection: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 15,
  },

  sectionHeader: {
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
    marginBottom: 4,
  },

  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  leaderboardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
  },

  // Leaderboard Items
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },

  rankSection: {
    marginRight: 12,
  },

  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rankText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'SF Pro Display',
  },

  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },

  playerInfo: {
    flex: 1,
  },

  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
    marginBottom: 4,
  },

  badgeContainer: {
    flexDirection: 'row',
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'SF Pro Text',
  },

  statsSection: {
    alignItems: 'flex-end',
  },

  pointsText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
  },

  pointsLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  streakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },

  streakText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF9500',
    fontFamily: 'SF Pro Text',
    marginLeft: 2,
  },

  // Games Section
  gamesSection: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
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

  gamesContent: {
    gap: 10,
  },

  gamesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
    marginBottom: 15,
  },

  // Game Cards
  gameCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
  },

  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  gameTitleSection: {
    flex: 1,
  },

  gameTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
    marginBottom: 4,
  },

  gameCategory: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  joinButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },

  joinButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'SF Pro Text',
  },

  gameStats: {
    flexDirection: 'row',
    gap: 16,
  },

  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  statText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  // Interactive Section
  interactiveSection: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },

  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },

  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 0.22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
  },

  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  actionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Text',
    textAlign: 'center',
    lineHeight: 14,
  },
});

export default FunZoneScreen;

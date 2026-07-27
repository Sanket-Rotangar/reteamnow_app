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
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../config/colors';

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
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('ongoing');

  const showToast = (message: string) => {
    Toast.show({
      type: 'success',
      text1: 'Fun Zone',
      text2: message,
    });
  };

  const handleQuickAction = (actionType: string) => {
    switch(actionType) {
      case 'events':
        // Navigate to Events list
        if (navigation) {
          navigation.navigate('EventsList');
        } else {
          showToast('Opening Event Photos! 📸');
        }
        break;
      case 'create':
        showToast('Opening Create Game! 🎮');
        break;
      case 'stats':
        showToast('Opening My Stats! 📊');
        break;
      case 'team':
        showToast('Opening Find Team! 👥');
        break;
      case 'rewards':
        showToast('Opening Rewards! 🎁');
        break;
    }
  };

  const handleJoinGame = (gameTitle: string) => {
    showToast(`Joined ${gameTitle}! 🎮`);
  };

  const handleViewGame = (gameTitle: string) => {
    showToast(`Viewing ${gameTitle} details 👀`);
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
        
        {/* Fun Zone Description */}
        <View style={styles.descriptionSection}>
          <View style={styles.descriptionCard}>
            <View style={styles.iconRow}>
              <Icon name="game-controller" size={24} color={colors.primary} />
              <Text style={styles.descriptionTitle}>Welcome to Fun Zone!</Text>
            </View>
            <Text style={styles.descriptionText}>
              Engage with your team through exciting activities, competitions, and entertainment. 
              Participate in challenges, compete on leaderboards, and build stronger team connections.
            </Text>
          </View>
        </View>

        {/* Navigation Options */}
        <View style={styles.navigationSection}>
          <Text style={styles.sectionTitle}>🎯 Activities</Text>
          <View style={styles.navigationGrid}>
            <TouchableOpacity style={styles.navCard} onPress={() => handleQuickAction('events')}>
              <View style={[styles.navIcon, { backgroundColor: `${colors.secondary}15` }]}>
                <Icon name="camera" size={20} color={colors.secondary} />
              </View>
              <Text style={styles.navTitle}>Event Photos</Text>
              <Text style={styles.navSubtitle}>Browse memories</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.navCard} onPress={() => showToast('Opening Leaderboard! 🏆')}>
              <View style={[styles.navIcon, { backgroundColor: `${colors.warning}15` }]}>
                <Icon name="trophy" size={20} color={colors.warning} />
              </View>
              <Text style={styles.navTitle}>Leaderboard</Text>
              <Text style={styles.navSubtitle}>Top performers</Text>
            </TouchableOpacity>
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
              { icon: 'camera', title: 'Event\nPhotos', color: '#FF3B30', action: 'events' },
              { icon: 'add-circle', title: 'Create\nGame', color: '#007AFF', action: 'create' },
              { icon: 'stats-chart', title: 'My Stats', color: '#34C759', action: 'stats' },
              { icon: 'people', title: 'Find\nTeam', color: '#AF52DE', action: 'team' },
            ].map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                activeOpacity={0.8}
                onPress={() => handleQuickAction(action.action)}>
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
    paddingTop: 10,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
    marginBottom: 4,
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

  // New Styles for Enhanced Fun Zone
  descriptionSection: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },

  descriptionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: colors.border,
  },

  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  descriptionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 12,
  },

  descriptionText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },

  navigationSection: {
    paddingHorizontal: 15,
    marginBottom: 25,
  },

  navigationGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },

  navCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    flex: 0.48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: colors.border,
  },

  navIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  navTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },

  navSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
  },

});

export default FunZoneScreen;

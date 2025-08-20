/**
 * Modern Home Screen - Professional Dashboard
 *
 * Following the 10-30-60 design rule with proper spacing and light theme
 * Structure inspired by GoogleFit.tsx with enhanced typography and layout
 * Balance between dashboard functionality and good UI design
 */

import React, { useState, useContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import Icon from 'react-native-vector-icons/Ionicons';
// import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import ProgressRings from '../../components/ProgressRings';
import { AuthContext } from '../../context/authContext';

// Enhanced data structure for the analytics cards
const cardsData = [
  { id: '1', type: 'fitness', title: 'Health Analytics', subtitle: 'Today\'s Progress' },
  { id: '2', type: 'productivity', title: 'Performance Insights', subtitle: 'Weekly Summary' },
  { id: '3', type: 'attendance', title: 'Attendance Overview', subtitle: 'Monthly Stats' },
  { id: '4', type: 'achievements', title: 'Goal Achievement', subtitle: 'Current Streak' },
];

const HomeScreen = () => {
  var { userInfo } = useContext(AuthContext);
  // const navigation = useNavigation();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Welcome!',
      text2: 'Dashboard ready 🎯',
    });
  };

  const handleCardPress = (cardType: string) => {
    console.log(`Opening ${cardType} details...`);
    // Add navigation logic here
  };

  const renderCard = (card: any, _index: number) => {
    return (
      <TouchableOpacity
        key={card.id}
        activeOpacity={0.92}
        onPress={() => handleCardPress(card.type)}
        style={styles.dataCard}>
        
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleSection}>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
          </View>
          <TouchableOpacity style={styles.cardMenuButton}>
            <Icon name="ellipsis-horizontal" size={16} color="#8B9DC3" />
          </TouchableOpacity>
        </View>

        {/* Card Content - Dynamic based on type */}
        {card.type === 'fitness' && (
          <View style={styles.fitnessCardContent}>
            <View style={styles.activityValuesSection}>
              <View style={styles.valueRow}>
                <View style={styles.valueLineRed} />
                <View style={styles.valueContent}>
                  <Text style={styles.activityValueText}>412</Text>
                  <Text style={styles.activityCategoryText}>calories</Text>
                </View>
              </View>
              
              <View style={styles.valueRow}>
                <View style={styles.valueLineGreen} />
                <View style={styles.valueContent}>
                  <Text style={styles.activityValueText}>23</Text>
                  <Text style={styles.activityCategoryText}>exercise mins</Text>
                </View>
              </View>
              
              <View style={styles.valueRow}>
                <View style={styles.valueLineBlue} />
                <View style={styles.valueContent}>
                  <Text style={styles.activityValueText}>8/12</Text>
                  <Text style={styles.activityCategoryText}>stand hours</Text>
                </View>
              </View>
            </View>

            <View style={styles.progressRingsSection}>
              <ProgressRings 
                move={0.75}
                exercise={0.65} 
                stand={0.85}
                size={160}
              />
            </View>
          </View>
        )}

        {card.type === 'productivity' && (
          <View style={styles.dataCardContent}>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>94%</Text>
                <Text style={styles.statLabel}>Efficiency</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>47</Text>
                <Text style={styles.statLabel}>Tasks</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>8.2h</Text>
                <Text style={styles.statLabel}>Focus</Text>
              </View>
            </View>
            <View style={styles.trendIndicator}>
              <Icon name="trending-up" size={14} color="#4CAF50" />
              <Text style={styles.trendText}>+12% this week</Text>
            </View>
          </View>
        )}

        {card.type === 'attendance' && (
          <View style={styles.dataCardContent}>
            <View style={styles.attendanceDisplay}>
              <View style={styles.attendanceMain}>
                <Text style={styles.attendancePercent}>98%</Text>
                <Text style={styles.attendanceLabel}>This Month</Text>
              </View>
              <View style={styles.attendanceSecondary}>
                <View style={styles.attendanceStat}>
                  <Text style={styles.attendanceNumber}>23</Text>
                  <Text style={styles.attendanceText}>Present</Text>
                </View>
                <View style={styles.attendanceStat}>
                  <Text style={styles.attendanceNumber}>1</Text>
                  <Text style={styles.attendanceText}>Absent</Text>
                </View>
              </View>
            </View>
            <View style={styles.streakBadge}>
              <Icon name="flame" size={14} color="#FF9500" />
              <Text style={styles.streakText}>15 day streak</Text>
            </View>
          </View>
        )}

        {card.type === 'achievements' && (
          <View style={styles.dataCardContent}>
            <View style={styles.achievementDisplay}>
              <View style={styles.achievementMain}>
                <Text style={styles.achievementScore}>12/15</Text>
                <Text style={styles.achievementLabel}>Goals Completed</Text>
              </View>
              <View style={styles.achievementProgress}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, styles.progressFill80]} />
                </View>
                <Text style={styles.progressText}>80% completion</Text>
              </View>
            </View>
            <View style={styles.achievementBadge}>
              <Icon name="trophy" size={14} color="#FFD700" />
              <Text style={styles.badgeText}>Top Performer</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Clean Header - Following GoogleFit structure */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={{
              uri: 'https://img.freepik.com/premium-photo/hooded-hacker-logo-mascot_941097-24659.jpg',
            }}
            style={styles.profileImage}
          />
          <View style={styles.welcomeSection}>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.userName}>Sanket</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={showToast}>
          <Icon name="notifications-outline" size={20} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}>
        
        {/* Today's Overview */}
        <View style={styles.overviewSection}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <Text style={styles.sectionSubtitle}>Your performance at a glance</Text>
        </View>

        {/* Data Visualization Cards */}
        <View style={styles.cardsContainer}>
          <PagerView
            style={styles.pager}
            initialPage={0}
            onPageSelected={(e) => setCurrentCardIndex(e.nativeEvent.position)}>
            {cardsData.map((card, index) => (
              <View key={card.id} style={styles.pageWrapper}>
                {renderCard(card, index)}
              </View>
            ))}
          </PagerView>

          {/* Page Indicators */}
          <View style={styles.indicators}>
            {cardsData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentCardIndex && styles.activeIndicator,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {[
              { icon: 'person-add-outline', title: 'Team', color: '#007AFF' },
              { icon: 'bar-chart-outline', title: 'Analytics', color: '#34C759' },
              { icon: 'calendar-outline', title: 'Schedule', color: '#FF3B30' },
              { icon: 'settings-outline', title: 'Settings', color: '#AF52DE' },
            ].map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                activeOpacity={0.8}>
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
 * Professional Light Theme Styles
 * Following the 10-30-60 design rule:
 * - 10% accent colors (buttons, highlights)
 * - 30% secondary colors (text, borders)
 * - 60% neutral colors (backgrounds, cards)
 */
const styles = StyleSheet.create({
  // Main Container (60% - Primary neutral)
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Light neutral background
  },

  // Header Section - Following GoogleFit minimal approach
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15, // GoogleFit uses 15px
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },

  welcomeSection: {
    flexDirection: 'column',
  },

  greeting: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8E8E93', // 30% - Secondary text color
    fontFamily: 'SF Pro Text', // Better typography
  },

  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D1D1F', // Strong primary text
    fontFamily: 'SF Pro Display', // Professional font
  },

  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Content Area
  content: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  // Overview Section
  overviewSection: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 15,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
    marginBottom: 4,
  },

  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  // Cards Container
  cardsContainer: {
    paddingBottom: 20, // Reduced bottom padding
  },

  pager: {
    height: 300, // Consistent height for all cards
    marginBottom: 8, // Minimal space with indicators
  },

  pageWrapper: {
    paddingHorizontal: 15,
  },

  // Data Cards - 60% neutral background
  dataCard: {
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

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  cardTitleSection: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
    marginBottom: 2,
  },

  cardSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  cardMenuButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Fitness Card Content
  fitnessCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 180, // Fixed height for consistency
  },

  activityValuesSection: {
    flex: 1,
    paddingRight: 20,
  },

  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  valueLineRed: {
    width: 3,
    height: 24,
    backgroundColor: '#FF3B30',
    borderRadius: 1.5,
    marginRight: 12,
  },

  valueLineGreen: {
    width: 3,
    height: 24,
    backgroundColor: '#30D158',
    borderRadius: 1.5,
    marginRight: 12,
  },

  valueLineBlue: {
    width: 3,
    height: 24,
    backgroundColor: '#007AFF',
    borderRadius: 1.5,
    marginRight: 12,
  },

  valueContent: {
    flex: 1,
  },

  activityValueText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    fontFamily: 'SF Pro Display',
    marginBottom: 2,
  },

  activityCategoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    fontFamily: 'SF Pro Text',
  },

  progressRingsSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Generic Data Card Content
  dataCardContent: {
    paddingTop: 10,
    height: 180, // Same fixed height as fitness card
    justifyContent: 'space-between',
  },

  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  statItem: {
    alignItems: 'center',
    flex: 1,
  },

  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F9FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  trendText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4CAF50',
    fontFamily: 'SF Pro Text',
    marginLeft: 4,
  },

  // Attendance Card
  attendanceDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  attendanceMain: {
    flex: 1,
    alignItems: 'center',
  },

  attendancePercent: {
    fontSize: 28,
    fontWeight: '700',
    color: '#007AFF', // 10% - Accent color
    fontFamily: 'SF Pro Display',
    marginBottom: 4,
  },

  attendanceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  attendanceSecondary: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  attendanceStat: {
    alignItems: 'center',
  },

  attendanceNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
    marginBottom: 2,
  },

  attendanceText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF7E6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  streakText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF9500',
    fontFamily: 'SF Pro Text',
    marginLeft: 4,
  },

  // Achievement Card
  achievementDisplay: {
    marginBottom: 16,
  },

  achievementMain: {
    alignItems: 'center',
    marginBottom: 12,
  },

  achievementScore: {
    fontSize: 32,
    fontWeight: '700',
    color: '#34C759', // Success green
    fontFamily: 'SF Pro Display',
    marginBottom: 4,
  },

  achievementLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  achievementProgress: {
    alignItems: 'center',
  },

  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#F2F2F7',
    borderRadius: 3,
    marginBottom: 8,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 3,
  },

  // Dynamic progress width
  progressFill80: {
    width: '80%',
  },

  progressText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFBF0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFD700',
    fontFamily: 'SF Pro Text',
    marginLeft: 4,
  },

  // Page Indicators
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8, // Minimal space from cards
  },

  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D1D6',
    marginHorizontal: 2, // Reduced margin between dots
  },

  activeIndicator: {
    backgroundColor: '#007AFF', // 10% - Primary accent
    width: 18, // Slightly smaller active indicator
  },

  // Quick Actions Section
  actionsSection: {
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
    fontSize: 12,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Text',
    textAlign: 'center',
  },
});

export default HomeScreen;

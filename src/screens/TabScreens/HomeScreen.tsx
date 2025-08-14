/**
 * Revised Home Screen Component - Central Dashboard
 *
 * This screen has been updated to be more interactive and visually
 * appealing, addressing the spacing issue and improving the overall layout.
 * It uses a combination of PagerView for swipeable cards and a grid
 * for quick actions to create a modern, engaging user experience.
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
} from 'react-native';
import colors from '../../config/colors';
import PagerView from 'react-native-pager-view';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
// import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import ProgressRings from '../../components/ProgressRings';

// A simple data structure for the swipeable cards
const cardsData = [
  { id: '1', type: 'routes', title: 'My Routes' },
  { id: '2', type: 'attendance', title: 'Attendance Status' },
  { id: '3', type: 'leaderboard', title: 'Leaderboard' },
];

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState('All routes');
  const [pagerIndex, setPagerIndex] = useState(0);
  // const navigation = useNavigation();

  const currentTime = new Date();
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  /**
   * Function to render the different swipeable cards based on their type.
   * Each card is now a TouchableOpacity to enable interaction.
   */
  const renderCard = (cardType: string) => {
    switch (cardType) {
      case 'routes':
        return (
          <View style={styles.cardWrapper}>
            <LinearGradient
              colors={['#8E2DE2', '#4A00E0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardContainer}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>My Routes</Text>
                <View style={styles.cardHeaderIcons}>
                  <Icon
                    name="stats-chart-outline"
                    size={18}
                    color="#fff"
                    style={{ marginRight: 10 }}
                  />
                  <Icon name="pencil-outline" size={18} color="#fff" />
                </View>
              </View>
              <View style={styles.cardBody}>
                <View style={styles.cardSection}>
                  <Text style={styles.cardSectionTitle}>Distance</Text>
                  <Text style={styles.cardValue}>8,920 km</Text>
                </View>
                <View style={styles.cardSection}>
                  <Text style={styles.cardSectionTitle}>Location</Text>
                  <Text style={styles.cardValue}>356</Text>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <View style={styles.cardFooterItem}>
                  <Icon name="walk-outline" size={16} color="#fff" />
                  <Text style={styles.cardFooterText}>224</Text>
                </View>
                <View style={styles.cardFooterItem}>
                  <Icon name="bicycle-outline" size={16} color="#fff" />
                  <Text style={styles.cardFooterText}>80</Text>
                </View>
                <View style={styles.cardFooterItem}>
                  <Icon name="car-outline" size={16} color="#fff" />
                  <Text style={styles.cardFooterText}>26</Text>
                </View>
                <View style={styles.cardFooterItem}>
                  <Icon name="flag-outline" size={16} color="#fff" />
                  <Text style={styles.cardFooterText}>26</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        );
      case 'attendance':
        return (
          <View style={styles.cardWrapper}>
            <LinearGradient
              colors={['#FF6B6B', '#EE9F9F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardContainer}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Attendance Status</Text>
                <Icon name="calendar-outline" size={20} color="#fff" />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.attendanceText}>Present Today</Text>
                <Text style={styles.attendanceTime}>10:00 AM</Text>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.cardFooterText}>
                  Total days present: 25/30
                </Text>
              </View>
            </LinearGradient>
          </View>
        );
      case 'leaderboard':
        return (
          <View style={styles.cardWrapper}>
            <LinearGradient
              colors={['#20BDFF', '#A5FECB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardContainer}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Leaderboard</Text>
                <Icon name="trophy-outline" size={20} color="#fff" />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.leaderboardText}>You are currently</Text>
                <Text style={styles.leaderboardRank}>#5</Text>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.cardFooterText}>View full leaderboard</Text>
              </View>
            </LinearGradient>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.profileInfo}>
              <Image
                source={{
                  uri: 'https://img.freepik.com/premium-photo/profile-icon-white-background_941097-162649.jpg',
                }}
                style={styles.profileImage}
              />
              <View>
                <Text style={styles.greetingText}>Welcome back</Text>
                <Text style={styles.userName}>John Vane</Text>
                <Text style={styles.currentDate}>
                  {formatDate(currentTime)}
                </Text>
              </View>
            </View>
            <View>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() =>
                  Toast.show({
                    type: 'info',
                    text1: 'Notifications',
                    text2: 'You have new notifications',
                  })
                }
              >
                <Icon name="notifications-outline" size={24} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Swipeable Card Section */}
          <Text style={styles.sectionTitle}>Quick Insights</Text>
          <PagerView
            style={styles.pagerView}
            initialPage={pagerIndex}
            onPageSelected={e => setPagerIndex(e.nativeEvent.position)}
          >
            {cardsData.map(card => (
              <View key={card.id}>{renderCard(card.type)}</View>
            ))}
          </PagerView>

          {/* Pagination dots for the swipeable cards */}
          <View style={styles.paginationContainer}>
            {cardsData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  {
                    backgroundColor:
                      pagerIndex === index ? '#4A00E0' : '#E0E0E0',
                  },
                ]}
              />
            ))}
          </View>

          {/* Quick Actions Section */}
          <View style={styles.quickActionsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <TouchableOpacity onPress={() => console.log('View all actions')}>
                <Text style={styles.viewAllText}>View All ›</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => console.log('Check-in/out')}
              >
                <Icon name="timer-outline" size={30} color="#fff" />
                <Text style={styles.quickActionText}>Check In/Out</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => console.log('View Announcements')}
              >
                <Icon name="megaphone-outline" size={30} color="#fff" />
                <Text style={styles.quickActionText}>Announcements</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => console.log('Request Leave')}
              >
                <Icon name="calendar-outline" size={30} color="#fff" />
                <Text style={styles.quickActionText}>Request Leave</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => console.log('View Dashboard')}
              >
                <Icon name="bar-chart-outline" size={30} color="#fff" />
                <Text style={styles.quickActionText}>Dashboard</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Route Filters */}
          <View style={styles.filterContainer}>
            {['All routes', 'In planning', 'Completed'].map(tab => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.filterButton,
                  activeTab === tab && styles.activeFilterButton,
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeTab === tab && styles.activeFilterText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* This space can be used for a list of routes or other dynamic content */}
          <View style={styles.emptyContentCard}>
            <Text style={styles.emptyContentText}>
              Content based on filter will appear here...

            </Text>
                <ProgressRings move={350} exercise={520} stand={20} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 4,
  },
  greetingText: {
    fontSize: 14,
    color: '#6B7280',
    letterSpacing: 0.3,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  currentDate: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  iconButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  pagerView: {
    height: 200,
    marginBottom: 10,
    marginHorizontal: -12,
  },
  cardWrapper: {
    flex: 1,
    paddingHorizontal: 5,
  },
  cardContainer: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardHeaderIcons: {
    flexDirection: 'row',
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  cardSection: {
    flex: 1,
  },
  cardSectionTitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  cardFooterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  cardFooterText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 4,
  },
  attendanceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  attendanceTime: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  leaderboardText: {
    fontSize: 20,
    color: '#fff',
  },
  leaderboardRank: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  viewAllText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  quickActionsContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    backgroundColor: colors.surface,
    width: '48%',
    height: 100,
    marginBottom: 15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#EAEAEA',
    borderRadius: 15,
    padding: 5,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeFilterButton: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  filterText: {
    fontSize: 14,
    color: '#888',
  },
  activeFilterText: {
    color: '#000',
    fontWeight: 'bold',
  },
  emptyContentCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  emptyContentText: {
    color: '#888',
    fontSize: 16,
  },
});

export default HomeScreen;

/**
 * Bottom Tab Navigator Component
 * 
 * This component implements the main bottom tab navigation as per requirements:
 * - HomeTab: Central dashboard and quick access features
 * - AttendanceTab: Daily attendance and leave management
 * - FunZoneTab: Employee engagement activities and social features
 * - SettingsTab: Profile, preferences, and app settings
 * 
 * Features modern UI with custom tab bar styling and icons
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';

// Import screens according to requirements
import HomeScreen from '../screens/TabScreens/HomeScreen';
import AttendanceScreen from '../screens/TabScreens/AttendanceScreen';
import FunZoneScreen from '../screens/TabScreens/FunZoneScreen';
import SettingsScreen from '../screens/TabScreens/SettingsScreen';

const Tab = createBottomTabNavigator();

/**
 * Modern Color Palette for the app
 */
const colors = {
  primary: '#6366F1',      // Indigo - main brand color
  secondary: '#EC4899',    // Pink - accent color
  success: '#10B981',      // Green - success states
  warning: '#F59E0B',      // Amber - warning states
  background: '#F8FAFC',   // Light gray - background
  surface: '#FFFFFF',      // White - cards and surfaces
  text: '#1F2937',         // Dark gray - primary text
  textSecondary: '#6B7280', // Medium gray - secondary text
  border: '#E5E7EB',       // Light gray - borders
  inactive: '#9CA3AF',     // Gray - inactive elements
};

/**
 * Custom Tab Icon Component
 * Renders appropriate icons for each tab with focus states
 */
const TabIcon = ({ route, focused, color, size }: any) => {
  let iconText: string;
  
  switch (route.name) {
    case 'HomeTab':
      iconText = '🏠';
      break;
    case 'AttendanceTab':
      iconText = '⏰';
      break;
    case 'FunZoneTab':
      iconText = '🎉';
      break;
    case 'SettingsTab':
      iconText = '⚙️';
      break;
    default:
      iconText = '❓';
  }
  
  return (
    <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
      <Text style={[styles.iconText, { color, fontSize: focused ? size + 2 : size }]}>
        {iconText}
      </Text>
    </View>
  );
};

/**
 * Tab icon renderer function factory
 * Creates tab icon component outside render cycle
 */
const createTabIcon = (routeName: string) => ({ focused, color, size }: any) => {
  const route = { name: routeName };
  return <TabIcon route={route} focused={focused} color={color} size={size} />;
};

// Pre-create tab icon components outside render cycle
const tabIcons = {
  HomeTab: createTabIcon('HomeTab'),
  AttendanceTab: createTabIcon('AttendanceTab'),
  FunZoneTab: createTabIcon('FunZoneTab'),
  SettingsTab: createTabIcon('SettingsTab'),
};

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Remove default header since we'll implement custom ones in each screen
        headerShown: false,
        
        // Custom tab bar styling for modern look
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inactive,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
        
        // Custom tab bar icons using pre-created components
        tabBarIcon: (tabIcons as any)[route.name] || tabIcons.HomeTab,
      })}
    >
      {/* Home Tab - Central dashboard and quick access */}
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarAccessibilityLabel: 'Navigate to Home dashboard'
        }}
      />
      
      {/* Attendance Tab - Daily attendance and leave management */}
      <Tab.Screen 
        name="AttendanceTab" 
        component={AttendanceScreen}
        options={{
          tabBarLabel: 'Attendance',
          tabBarAccessibilityLabel: 'Navigate to Attendance tracking'
        }}
      />
      
      {/* Fun Zone Tab - Employee engagement activities */}
      <Tab.Screen 
        name="FunZoneTab" 
        component={FunZoneScreen}
        options={{
          tabBarLabel: 'Fun Zone',
          tabBarAccessibilityLabel: 'Navigate to Fun Zone activities'
        }}
      />
      
      {/* Settings Tab - Profile and app preferences */}
      <Tab.Screen 
        name="SettingsTab" 
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarAccessibilityLabel: 'Navigate to Settings and Profile'
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * Styles for modern bottom tab navigation
 */
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    paddingBottom: 8,
    height: 70,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  tabBarIcon: {
    marginBottom: -4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  activeIconContainer: {
    backgroundColor: `${colors.primary}15`, // 15% opacity
  },
  iconText: {
    fontWeight: '600',
  },
});

export default BottomTabs;

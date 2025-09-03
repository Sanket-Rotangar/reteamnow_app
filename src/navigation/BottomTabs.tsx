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
import { StyleSheet, Text, View, Platform } from 'react-native';

// Import screens according to requirements
import HomeScreen from '../screens/TabScreens/HomeScreen';
import AttendanceScreen from '../screens/TabScreens/AttendanceScreen';
import FunZoneStack from '../navigation/FunZoneStack';
import SettingsStack from '../navigation/SettingsStack';
import HealthStack from './HealthStack';
import { colors } from '../config/colors'
import Icon from 'react-native-vector-icons/Ionicons';
const Tab = createBottomTabNavigator();

const TabIcon = ({ route, focused }: any) => {
  // Enhanced icon mapping with better design
  const getIconConfig = () => {
    switch (route.name) {
      case 'HomeTab':
        return {
          name: focused ? 'home' : 'home-outline',
          color: focused ? colors.primary : colors.inactive,
          bgColor: focused ? `${colors.primary}15` : 'transparent',
        };
      case 'AttendanceTab':
        return {
          name: focused ? 'time' : 'time-outline',
          color: focused ? colors.primary : colors.inactive,
          bgColor: focused ? `${colors.primary}15` : 'transparent',
        };
      case 'HealthTab':
        return {
          name: focused ? 'fitness' : 'fitness-outline',
          color: focused ? colors.primary : colors.inactive,
          bgColor: focused ? `${colors.primary}15` : 'transparent',
        };
      case 'FunZoneTab':
        return {
          name: focused ? 'game-controller' : 'game-controller-outline',
          color: focused ? colors.primary : colors.inactive,
          bgColor: focused ? `${colors.primary}15` : 'transparent',
        };
      case 'SettingsTab':
        return {
          name: focused ? 'person-circle' : 'person-circle-outline',
          color: focused ? colors.primary : colors.inactive,
          bgColor: focused ? `${colors.primary}15` : 'transparent',
        };
      default:
        return {
          name: 'help-outline',
          color: colors.inactive,
          bgColor: 'transparent',
        };
    }
  };

  const iconConfig = getIconConfig();

  return (
    <View style={[styles.iconContainer, { backgroundColor: iconConfig.bgColor }]}>
      <Icon name={iconConfig.name} size={24} color={iconConfig.color} />
    </View>
  );
};

/**
 * Tab icon renderer function factory
 * Creates tab icon component outside render cycle
 */
const createTabIcon = (routeName: string) => ({ focused }: any) => {
  const route = { name: routeName };
  return <TabIcon route={route} focused={focused} />;
};

// Pre-create tab icon components outside render cycle
const tabIcons = {
  HomeTab: createTabIcon('HomeTab'),
  AttendanceTab: createTabIcon('AttendanceTab'),
  HealthTab: createTabIcon('HealthTab'),
  FunZoneTab: createTabIcon('FunZoneTab'),
  SettingsTab: createTabIcon('SettingsTab'),
};

const BottomTabs = () => {
  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={({ route }) => ({
        // Remove default header since we'll implement custom ones in each screen
        headerShown: false,
        
        // Enhanced tab bar styling for professional look
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inactive,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
        
        // Enhanced animations and interactions
        tabBarHideOnKeyboard: true,
        tabBarAllowFontScaling: false,
        
        // Custom tab bar icons with pre-created components
        tabBarIcon: (tabIcons as any)[route.name] || tabIcons.HomeTab,
      })}
    >
      {/* Home Tab - Central dashboard and quick access */}
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Dashboard',
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
      
      {/* Health Tab - Fitness tracking */}
      <Tab.Screen 
        name="HealthTab" 
        component={HealthStack}
        options={{
          tabBarLabel: 'Fitness',
          tabBarAccessibilityLabel: 'Navigate to Fitness tracking'
        }}
      />

      {/* Fun Zone Tab - Employee engagement activities */}
      <Tab.Screen 
        name="FunZoneTab" 
        component={FunZoneStack}
        options={{
          tabBarLabel: 'Fun Zone',
          tabBarAccessibilityLabel: 'Navigate to Fun Zone activities'
        }}
      />
      
      {/* Settings Tab - Profile and app preferences */}
      <Tab.Screen 
        name="SettingsTab" 
        component={SettingsStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarAccessibilityLabel: 'Navigate to Settings and Profile'
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * Enhanced styles for professional bottom tab navigation
 */
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 8,
    height: 85,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 12,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
    letterSpacing: 0.2,
  },
  tabBarIcon: {
    marginBottom: -2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 2,
  },
  activeIconContainer: {
    backgroundColor: `${colors.primary}15`, // 15% opacity
  },
  iconText: {
    fontWeight: '600',
  },
});

export default BottomTabs;

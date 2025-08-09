/**
 * App Stack Component - Main Navigation for Authenticated Users
 *
 * This component implements the drawer navigation as per requirements:
 * - Dashboard (Bottom Tabs)
 * - Profile
 * - Leaderboard
 * - Admin Panel (if user is admin)
 * - Logout
 *
 * Features modern drawer design with role-based access control
 */

import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AdminPanelScreen from '../screens/DrawerScreens/AdminPanelScreen';
import { Text } from 'react-native';

// Import navigation components
import BottomTabs from './BottomTabs';

// Import drawer screens
import AnnouncementsScreen from '../screens/DrawerScreens/AnnouncementsScreen';
import GoogleFit from '../screens/DrawerScreens/GoogleFit';
import ProfileScreen from '../screens/DrawerScreens/ProfileScreen';

// Import context
import { AuthContext } from '../context/authContext';

const Drawer = createDrawerNavigator();

const AppStack = () => {
  const { userToken } = useContext(AuthContext);

  // Check if user is admin (in real app, this would come from user data)
  // For demo purposes, we'll assume admin if token contains 'admin'
  const isAdmin = userToken?.includes('admin') || false;

  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        drawerStyle: {
          backgroundColor: '#FFFFFF',
          width: 280,
        },
        drawerActiveTintColor: '#6366F1',
        drawerInactiveTintColor: '#6B7280',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '700',
        },
      }}
    >
      {/* Main Dashboard with Bottom Tabs */}
      <Drawer.Screen
        name="Dashboard"
        component={BottomTabs}
        options={{
          drawerLabel: 'Dashboard',
          title: 'Employee Hub',
          drawerIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text>,
        }}
      />

      {/* Profile Screen */}
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerLabel: 'Profile',
          title: 'My Profile',
          drawerIcon: () => <Text style={{ fontSize: 20 }}>👤</Text>,
        }}
      />

      {/* Announcements Screen */}
      <Drawer.Screen
        name="Announcements"
        component={AnnouncementsScreen}
        options={{
          drawerLabel: 'Announcements',
          title: 'Announcements',
          drawerIcon: () => <Text style={{ fontSize: 20 }}>📢</Text>,
        }}
      />

      {/* Leaderboard Screen */}
      <Drawer.Screen
        name="GoogleFit"
        component={GoogleFit}
        options={{
          drawerLabel: 'GoogleFit',
          title: 'GoogleFit',
          drawerIcon: () => <Text style={{ fontSize: 20 }}>🏆</Text>,
        }}
      />

      {/* Admin Panel - Only visible to admin users */}
      {isAdmin && (
        <Drawer.Screen
          name="AdminPanel"
          component={AdminPanelScreen}
          options={{
            drawerLabel: 'Admin Panel',
            title: 'Admin Dashboard',
            drawerIcon: () => <Text style={{ fontSize: 20 }}>⚙️</Text>,
          }}
        />
      )}
    </Drawer.Navigator>
  );
};

export default AppStack;

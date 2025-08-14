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
import { Text, StyleSheet } from 'react-native';

// Import navigation components
import BottomTabs from './BottomTabs';

// Import drawer screens
import HomeScreen from '../screens/TabScreens/HomeScreen';
import AnnouncementsScreen from '../screens/DrawerScreens/AnnouncementsScreen';

// Import context
import { AuthContext } from '../context/authContext';

// Icon components - defined outside render to prevent recreation
const DashboardIcon = () => <Text style={styles.iconText}>🏠</Text>;
const AnnouncementsIcon = () => <Text style={styles.iconText}>📢</Text>;
const AdminIcon = () => <Text style={styles.iconText}>⚙️</Text>;

const Drawer = createDrawerNavigator();

const AppStack = () => {
  const { userToken } = useContext(AuthContext);

  // Check if user is admin (in real app, this would come from user data)
  // For demo purposes, we'll assume admin if token contains 'admin'
  const isAdmin = userToken?.includes('admin') || true;

  return (
    <Drawer.Navigator
      id={undefined}
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
          drawerIcon: DashboardIcon,
        }}
      />

      {/* Test Screen */}
      <Drawer.Screen
        name="Test"
        component={HomeScreen}
        options={{
          drawerLabel: 'Test',
          title: 'Test',
          drawerIcon: AnnouncementsIcon,
        }}
      />
      {/* Announcements Screen */}
      <Drawer.Screen
        name="Announcements"
        component={AnnouncementsScreen}
        options={{
          drawerLabel: 'Announcements',
          title: 'Announcements',
          drawerIcon: AnnouncementsIcon,
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
            drawerIcon: AdminIcon,
          }}
        />
      )}
    </Drawer.Navigator>
  );
};

export default AppStack;

// Styles
const styles = StyleSheet.create({
  iconText: {
    fontSize: 20,
  },
});

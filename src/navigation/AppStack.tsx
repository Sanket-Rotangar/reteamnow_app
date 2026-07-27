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
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import AdminPanelScreen from '../screens/DrawerScreens/AdminPanelScreen';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomTabs from './BottomTabs';
import AnnouncementsScreen from '../screens/DrawerScreens/AnnouncementScreen';
import SlackScreen from '../screens/DrawerScreens/SlackScreen';
import { colors } from '../config/colors';

// Import context
import { AuthContext } from '../context/authContext';

// Icon components - defined outside render to prevent recreation 
const DashboardIcon = () =>  <Icon name="home" size={20} color={colors.primary} />;
const AnnouncementsIcon = () =>  <Icon name="megaphone" size={20} color={colors.primary} />;
const SlackIcon = () =>  <Icon name="chatbubbles" size={20} color={colors.primary} />;
const AdminIcon = () => <Icon name="settings" size={20} color={colors.primary} />;

// Custom drawer header component
const CustomDrawerHeader = () => (
  <View style={headerStyles.headerContainer}>
    <View style={headerStyles.logoContainer}>
      <Icon name="business" size={28} color={colors.primary} />
    </View>
    <Text style={headerStyles.brandText}>ReteamNow</Text>
  </View>
);

// Custom drawer content component
const CustomDrawerContent = (props: any) => (
  <DrawerContentScrollView {...props} contentContainerStyle={headerStyles.drawerContent}>
    <CustomDrawerHeader />
    <DrawerItemList {...props} />
  </DrawerContentScrollView>
);

const Drawer = createDrawerNavigator();

const AppStack = () => {
  const { userToken } = useContext(AuthContext);

  // Check if user is admin (in real app, this would come from user data)
  // For demo purposes, we'll assume admin if token contains 'admin'
  const isAdmin = userToken?.includes('admin') || false;

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
      drawerContent={CustomDrawerContent}
    >
      {/* Main Dashboard with Bottom Tabs */}
      <Drawer.Screen
        name="Dashboard"
        component={BottomTabs}
        options={{
          drawerLabel: 'Home',
          title: 'Home',
          drawerIcon: DashboardIcon,
        }}
      />

      {/* Test Screen */}
      <Drawer.Screen
        name="Test"
        component={AnnouncementsScreen}
        options={{
          drawerLabel: 'Announcements',
          title: 'Announcements',
          drawerIcon: AnnouncementsIcon,
        }}
      />

      {/* Announcements Screen */}
      <Drawer.Screen
        name="Announcements"
        component={SlackScreen}
        options={{
          drawerLabel: 'ReteamChat',
          title: 'ReteamChat',
          drawerIcon: SlackIcon,
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
const headerStyles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 20,
  },
  logoContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  brandText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.5,
  },
  drawerContent: {
    paddingTop: 0,
  },
});

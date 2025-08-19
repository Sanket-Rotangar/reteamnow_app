/**
 * Fun Zone Stack Navigator
 * 
 * Handles navigation within the Fun Zone tab including:
 * - FunZoneScreen (main tab screen)
 * - EventsListScreen (browse events)
 * - EventPhotosScreen (photo gallery and leaderboard)
 * - AdminEventCreation (admin event creation)
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FunZoneScreen from '../screens/TabScreens/FunZoneScreen';
import EventsListScreen from '../screens/StackScreens/EventsListScreen';
import EventPhotosScreen from '../screens/StackScreens/EventPhotosScreen';
import AdminEventCreation from '../screens/StackScreens/AdminEventCreation';

const Stack = createNativeStackNavigator();

export default function FunZoneStack() {
  return (
    <Stack.Navigator
      id={undefined}
      initialRouteName="FunZoneHome"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="FunZoneHome"
        component={FunZoneScreen}
        options={{ title: 'Fun Zone' }}
      />
      <Stack.Screen
        name="EventsList"
        component={EventsListScreen}
        options={{ 
          title: 'Event Photos',
          headerShown: false 
        }}
      />
      <Stack.Screen
        name="EventPhotos"
        component={EventPhotosScreen}
        options={{ 
          title: 'Photo Competition',
          headerShown: false 
        }}
      />
      <Stack.Screen
        name="AdminEventCreation"
        component={AdminEventCreation}
        options={{ 
          title: 'Create Event',
          headerShown: false 
        }}
      />
    </Stack.Navigator>
  );
}

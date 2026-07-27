/**
 * Fun Zone Stack Navigator
 * 
 * Handles navigation within the Fun Zone tab including:
 * - FunZoneScreen (main tab screen)
 * - EventsListScreen (browse competitions)
 * - EventPhotosScreen (competition details/photo gallery)
 * - CreatePostScreen (create new posts)
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FunZoneScreen from '../screens/TabScreens/FunZoneScreen';
import EventsListScreen from '../screens/FunZoneScreens/EventsListScreen';
import EventPhotosScreen from '../screens/FunZoneScreens/EventPhotosScreen';
import CreatePostScreen from '../screens/FunZoneScreens/CreatePostScreen';

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
          title: 'Competitions',
          headerShown: false 
        }}
      />
      <Stack.Screen
        name="CompetitionDetails"
        component={EventPhotosScreen}
        options={{ 
          title: 'Competition Details',
          headerShown: false 
        }}
      />
      <Stack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{ 
          title: 'Create Post',
          headerShown: false 
        }}
      />
    </Stack.Navigator>
  );
}

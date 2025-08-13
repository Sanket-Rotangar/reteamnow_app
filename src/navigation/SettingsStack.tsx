// navigation/SettingsStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from '../screens/TabScreens/SettingsScreen';
import ProfileScreen from '../screens/StackScreens/ProfileScreen';
import EditProfileScreen from '../screens/StackScreens/EditProfileScreen';

const Stack = createNativeStackNavigator();

export default function SettingsStack() {
  return (
    <Stack.Navigator
      id={undefined}
      initialRouteName="SettingsHome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="SettingsHome"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen
        name="ProfileDetails"
        component={ProfileScreen}
        options={{ title: 'Profile Details' }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }}
      />
    </Stack.Navigator>
  );
}

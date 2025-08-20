import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import GoogleFit from '../screens/TabScreens/GoogleFit';
import HeartPointsDetailScreen from '../screens/HealthTrackScreens/HeartPointsDetailScreen';
import StepsDetailScreen from '../screens/HealthTrackScreens/StepsDetailScreen';
import WeightDetailScreen from '../screens/HealthTrackScreens/WeightDetailScreen';
import EnergyDetailScreen from '../screens/HealthTrackScreens/EnergyDetailScreen';

const Stack = createNativeStackNavigator();

const HealthStack = () => {
  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="GoogleFit" 
        component={GoogleFit}
        options={{
          title: 'Health & Fitness'
        }}
      />
      <Stack.Screen 
        name="HeartPointsDetail" 
        component={HeartPointsDetailScreen}
        options={{
          title: 'Heart Points'
        }}
      />
      <Stack.Screen 
        name="StepsDetail" 
        component={StepsDetailScreen}
        options={{
          title: 'Steps'
        }}
      />
      <Stack.Screen 
        name="WeightDetail" 
        component={WeightDetailScreen}
        options={{
          title: 'Weight'
        }}
      />
      <Stack.Screen 
        name="EnergyDetail" 
        component={EnergyDetailScreen}
        options={{
          title: 'Energy Expended'
        }}
      />
    </Stack.Navigator>
  );
};

export default HealthStack;

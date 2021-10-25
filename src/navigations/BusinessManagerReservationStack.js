import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import BusinessManagerReservationScreen from '../screens/businessScreens/BusinessManagerReservationScreen';
import BusinessManagerMakeReservationScreen from '../screens/businessScreens/BusinessManagerMakeReservationScreen';

// Stacks

const Stack = createStackNavigator();

const BusinessManagerReservationStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ 
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="Business" 
        component={BusinessManagerReservationScreen}
      />
      <Stack.Screen 
        name="BusinessManagerMakeReservation" 
        component={BusinessManagerMakeReservationScreen}
      />
    </Stack.Navigator>
  );
}

export default BusinessManagerReservationStack;
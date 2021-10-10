import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import BusinessAnalyticsScreen from '../screens/businessScreens/businessAnalyticsStack/BusinessAnalyticsScreen';
import BusinessReservationAnalyticsScreen from '../screens/businessScreens/businessAnalyticsStack/BusinessReservationAnalyticsScreen';

// Stacks

const Stack = createStackNavigator();

const BusinessHomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Analytics" 
        component={BusinessAnalyticsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="ReservationAnalytics" 
        component={BusinessReservationAnalyticsScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default BusinessHomeStack;
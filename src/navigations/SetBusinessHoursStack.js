import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
// business hours
import SetBusinessHoursScreen from '../screens/setBusinessHoursStack/SetBusinessHoursScreen';
import SetHoursScreen from '../screens/setBusinessHoursStack/SetHoursScreen';

const Stack = createStackNavigator();

const SetBusinessHoursStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ 
        headerShown: false,
        animationEnabled: false 
      }}
    >
      <Stack.Screen 
        name="SetBusinessHours" 
        component={SetBusinessHoursScreen}
        initialParams={{ 
          newHours: null,
          dayType: null
        }}
      />
      <Stack.Screen 
        name="SetHours" 
        component={SetHoursScreen}
      />
    </Stack.Navigator>
  )
};

export default SetBusinessHoursStack;
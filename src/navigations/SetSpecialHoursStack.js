import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
// business hours
import SetAnotherDayScreen from '../screens/setBusinessHoursStack/SetAnotherDayScreen';
import SetHoursScreen from '../screens/setBusinessHoursStack/SetHoursScreen';
import SetSpecialHoursScreen from '../screens/setBusinessHoursStack/SetSpecialHoursScreen';

const Stack = createStackNavigator();

const SetSpecialHoursStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ 
        headerShown: false,
        animationEnabled: false 
      }}
    >
      <Stack.Screen 
        name="SetSpecialHours" 
        component={SetSpecialHoursScreen}
        initialParams={{ 
          newHours: null,
          dayType: null
        }}
      />
      <Stack.Screen 
        name="SetHours" 
        component={SetHoursScreen}
      />
      <Stack.Screen 
        name="SetAnotherDay" 
        component={SetAnotherDayScreen}
      />
    </Stack.Navigator>
  )
};

export default SetSpecialHoursStack;
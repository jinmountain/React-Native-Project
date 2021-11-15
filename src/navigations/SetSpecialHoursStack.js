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
          userType: null,
          newSpecialDateId: null,
          newSpecialDate: null,
          newSpecialDateStatus: null,
          newHours: null,
          specialDateIndex: null,
          // for tech
          techId: null,
        }}
      />
      <Stack.Screen 
        name="SetHours" 
        component={SetHoursScreen}
        initialParams={{ 
          businessDay: null,
          specialDateIndex: null,
          userType: null,
          techId: null,
          busId: null
        }}
      />
      <Stack.Screen 
        name="SetAnotherDay" 
        component={SetAnotherDayScreen}
        initialParams={{ 
          businessDay: null,
          specialDateIndex: null,
          userType: null,
          techId: null,
          busId: null
        }}
      />
    </Stack.Navigator>
  )
};

export default SetSpecialHoursStack;
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
// business hours
import UBSetBusinessHoursScreen from '../screens/accountManagerFlow/UBSetBusinessHoursScreen';
import UBSetHoursScreen from '../screens/accountManagerFlow/UBSetHoursScreen';

const Stack = createStackNavigator();

const UBSetBusinessHoursStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ 
        headerShown: false,
        animationEnabled: false 
      }}
    >
      <Stack.Screen 
        name="UBSetBusinessHours" 
        component={UBSetBusinessHoursScreen}
      />
      <Stack.Screen 
        name="UBSetHours" 
        component={UBSetHoursScreen}
      />
    </Stack.Navigator>
  )
};

export default UBSetBusinessHoursStack;
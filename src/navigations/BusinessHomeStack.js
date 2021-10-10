import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import BusinessHomeScreen from '../screens/businessScreens/BusinessHomeScreen';

// Stacks

const Stack = createStackNavigator();

const BusinessHomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={BusinessHomeScreen}
        options={{
       		title: "Home",
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}

export default BusinessHomeStack;
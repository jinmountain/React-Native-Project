import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import UpdateProfileScreen from '../screens/updateProfileScreens/UpdateProfileScreen';
import UpdateProfileInputScreen from '../screens/updateProfileScreens/UpdateProfileInputScreen';

const Stack = createStackNavigator();

const UpdateProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ 
        headerShown: false,
        animationEnabled: false 
      }}
    >
      <Stack.Screen 
        name="UpdateProfile" 
        component={UpdateProfileScreen} 
      />
      <Stack.Screen 
        name="UpdateProfileInput" 
        component={UpdateProfileInputScreen} 
      />
    </Stack.Navigator>
  );
};

export default UpdateProfileStack;
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
        initialParams={{ 
          returnedInputType: null,
          returnedInputValue: null
        }}
      />
      <Stack.Screen 
        name="UpdateProfileInput" 
        component={UpdateProfileInputScreen} 
        initialParams={{ 
          inputType: null,
          inputValue: null
        }}
      />
    </Stack.Navigator>
  );
};

export default UpdateProfileStack;
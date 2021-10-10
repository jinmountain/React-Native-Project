import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import UserNotiScreen from '../screens/UserNotiScreen';


// stacks
import UserAccountStack from './UserAccountStack';

const Stack = createStackNavigator();

const UserNotiStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ 
        headerShown: false,
        animationEnabled: false 
      }}
    >
      <Stack.Screen 
        name="UserNoti" 
        component={UserNotiScreen}
      />
    </Stack.Navigator>
  );
}

export default UserNotiStack;
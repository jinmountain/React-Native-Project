import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import UserAccountScreen from '../screens/userAccountStack/UserAccountScreen';
import BusinessScheduleScreen from '../screens/businessScreens/BusinessScheduleScreen';
import ChatScreen from '../screens/ChatScreen';

// Stacks
import PostsSwipeStack from './PostsSwipeStack';
import ShopStack from './ShopStack';

const Stack = createStackNavigator();

const UserAccountStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ 
        headerShown: false,
        animationEnabled: false 
      }}
    >
      <Stack.Screen 
        name="UserAccount" 
        component={UserAccountScreen} 
        initialParams={{ 
          targetUser: null
        }}
      />
      <Stack.Screen  
        name="PostsSwipeStack" 
        component={PostsSwipeStack}
      />
      <Stack.Screen 
        name="ShopStack" 
        component={ShopStack} 
      />
    </Stack.Navigator>
  );
};

export default UserAccountStack;
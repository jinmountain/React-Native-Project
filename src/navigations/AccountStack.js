import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import AccountScreen from '../screens/AccountScreen';
import ImageZoominScreen from '../screens/ImageZoominScreen';
import ChatScreen from '../screens/ChatScreen';
import ChatListScreen from '../screens/ChatListScreen';
import PostDetailScreen from '../screens/PostDetailScreen';

// Stacks
import PostsSwipeStack from './PostsSwipeStack';
import UpdateProfileStack from './UpdateProfileStack';
import AccountManagerStack from './AccountManagerStack';
import UserAccountStack from './UserAccountStack';

const Stack = createStackNavigator();

const AccountStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ 
        headerShown: false,
        animationEnabled: false 
      }}
    >
      <Stack.Screen 
        name="Account" 
        component={AccountScreen} 
      />
      <Stack.Screen 
        name="PostDetail" 
        component={PostDetailScreen} 
      />
      <Stack.Screen 
        name="UserAccountStack" 
        component={UserAccountStack} 
      />
      <Stack.Screen  
        name="PostsSwipeStack" 
        component={PostsSwipeStack}
      />
      <Stack.Screen 
        name="ChatList" 
        component={ChatListScreen} 
      />
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen} 
      />
      <Stack.Screen 
        name="UpdateProfileStack" 
        component={UpdateProfileStack} 
      />
      <Stack.Screen 
        name="ImageZoomin" 
        component={ImageZoominScreen} 
      />
      <Stack.Screen 
        name="AccountManagerStack" 
        component={AccountManagerStack}
      />
    </Stack.Navigator>
  );
};

export default AccountStack;
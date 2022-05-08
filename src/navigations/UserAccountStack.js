import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import UserAccountScreen from '../screens/UserAccountScreen';

import PostsSwipeScreen from '../screens/PostsSwipeScreen';
import PostManagerScreen from '../screens/PostManagerScreen';
import PostDeleteConfirmationScreen from '../screens/PostDeleteConfirmationScreen';
import PostDetailScreen from '../screens/PostDetailScreen';

import CommentScreen from '../screens/comment/CommentScreen';
import CommentManagerScreen from '../screens/comment/CommentManagerScreen';
import CommentEditScreen from '../screens/comment/CommentEditScreen';

import ReplyScreen from '../screens/reply/ReplyScreen';
import ReplyManagerScreen from '../screens/reply/ReplyManagerScreen';
import ReplyEditScreen from '../screens/reply/ReplyEditScreen';

import BusinessScheduleScreen from '../screens/businessScreens/BusinessScheduleScreen';
import ChatScreen from '../screens/ChatScreen';

// Stacks
import ShopStack from './ShopStack';
import PostsSwipeStack from './PostsSwipeStack';


const Stack = createStackNavigator();

const UserAccountStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ 
        headerShown: false,
        animationEnabled: true, 
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
        name={"UserAccountPostsSwipeStack"}
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
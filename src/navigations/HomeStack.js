import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import HomeScreen from '../screens/home/HomeScreen';
import ImageZoominScreen from '../screens/ImageZoominScreen';
import ReservationRequestScreen from '../screens/businessScreens/ReservationRequestScreen';

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

// Stacks
import PostsSwipeStack from './PostsSwipeStack';
import UserAccountStack from './UserAccountStack';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ 
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
      />
      <Stack.Screen
        name="ReservationRequest"
        component={ReservationRequestScreen}
        options={{ 
          presentation: 'transparentModal',
          headerShown: false,
        }}
      />
      
      
      <Stack.Screen 
        name="PostDetail" 
        component={PostDetailScreen} 
        options={{ 
          headerShown: false,
          cardStyle: {
            backgroundColor: 'transparent',
          },
          animationEnabled: true,
          presentation: 'transparentModal'
        }}
      />
      <Stack.Screen
        name="HomePostsSwipeStack"
        component={PostsSwipeStack}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
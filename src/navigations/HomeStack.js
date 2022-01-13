import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import HomeScreen from '../screens/homeStackScreens/HomeScreen';
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
        gestureEnabled: false,
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
        screenOtions={{ 
          headerShown: false,
        }}
      />
      
      <Stack.Screen 
        name="PostsSwipe" 
        component={PostsSwipeScreen}
        initialParams={{ 
          cardIndex: 0, 
          postSource: 'default',

          posts: [],
          postState: false,
          postFetchSwitch: true,
          postLast: null,

          accountUserId: null,
          businessUserId: null,
        }}
        options={{ 
          cardStyle: {
            backgroundColor: 'transparent',
          },
          animationEnabled: true,
          presentation: 'transparentModal'
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
        name="Comment" 
        component={CommentScreen} 
        options={{ 
          cardStyle: {
            backgroundColor: 'transparent',
          },
          animationEnabled: true,
          presentation: 'transparentModal'
        }}
      />
      <Stack.Screen 
        name="CommentManager" 
        component={CommentManagerScreen} 
        options={{
          cardStyle: {
            backgroundColor: 'transparent',
          },
          animationEnabled: true,
          presentation: 'transparentModal'
        }}
      />
      <Stack.Screen 
        name="CommentEdit" 
        component={CommentEditScreen} 
        options={{
          cardStyle: {
            backgroundColor: 'transparent',
          },
          animationEnabled: true,
          presentation: 'transparentModal'
        }}
      />
      <Stack.Screen 
        name="Reply" 
        component={ReplyScreen} 
        options={{ 
          cardStyle: {
            backgroundColor: 'transparent',
          },
          animationEnabled: true,
          presentation: 'transparentModal'
        }}
      />
      <Stack.Screen 
        name="ReplyManager" 
        component={ReplyManagerScreen} 
        options={{ 
          cardStyle: {
            backgroundColor: 'transparent',
          },
          animationEnabled: true,
          presentation: 'transparentModal'
        }}
      />
      <Stack.Screen 
        name="ReplyEdit" 
        component={ReplyEditScreen} 
        options={{ 
          cardStyle: {
            backgroundColor: 'transparent',
          },
          animationEnabled: true,
          presentation: 'transparentModal'
        }}
      />
      <Stack.Screen 
        name="PostManager" 
        component={PostManagerScreen} 
        options={{
          cardStyle: {
            backgroundColor: 'transparent',
          },
          animationEnabled: true,
          presentation: 'transparentModal'
        }}
      />
      <Stack.Screen 
        name="PostDeleteConfirmationScreen" 
        component={PostDeleteConfirmationScreen} 
        options={{
          cardStyle: {
            backgroundColor: 'transparent',
          },
          animationEnabled: true,
          presentation: 'transparentModal'
        }}
        initialParams={{
          requestType: null,
          // post deletion
          postId: null,
          postData: null,

          // rsv deletion
          rsvId: null,
          busId: null,
          busLocationType: null,
          busLocality: null,
          cusId: null,
          postServiceType: null
        }}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
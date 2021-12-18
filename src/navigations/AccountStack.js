import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import AccountScreen from '../screens/AccountScreen';

import PostsSwipeScreen from '../screens/PostsSwipeScreen';
import PostManagerScreen from '../screens/PostManagerScreen';
import DeletionConfirmationScreen from '../screens/DeletionConfirmationScreen';
import PostDetailScreen from '../screens/PostDetailScreen';

import CommentScreen from '../screens/comment/CommentScreen';
import CommentManagerScreen from '../screens/comment/CommentManagerScreen';
import CommentEditScreen from '../screens/comment/CommentEditScreen';
import CommentDeleteConfirmationScreen from '../screens/comment/CommentDeleteConfirmationScreen';

import ReplyScreen from '../screens/reply/ReplyScreen';
import ReplyManagerScreen from '../screens/reply/ReplyManagerScreen';
import ReplyEditScreen from '../screens/reply/ReplyEditScreen';
import ReplyDeleteConfirmationScreen from '../screens/reply/ReplyDeleteConfirmationScreen';

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
        name="UpdateProfileStack" 
        component={UpdateProfileStack} 
      />
      <Stack.Screen 
        name="AccountManagerStack" 
        component={AccountManagerStack}
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
        name="CommentDeleteConfirmation" 
        component={CommentDeleteConfirmationScreen} 
        options={{
          cardStyle: {
            backgroundColor: 'transparent',
          },
          animationEnabled: true,
          presentation: 'transparentModal'
        }}
        initialParams={{

        }}
      />
      <Stack.Screen 
        name="ReplyDeleteConfirmation" 
        component={ReplyDeleteConfirmationScreen} 
        options={{
          cardStyle: {
            backgroundColor: 'transparent',
          },
          animationEnabled: true,
          presentation: 'transparentModal'
        }}
        initialParams={{

        }}
      />
    </Stack.Navigator>
  );
};

export default AccountStack;
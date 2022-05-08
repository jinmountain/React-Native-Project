import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import AccountScreen from '../screens/AccountScreen';
import DisplayPostTwoColumnScreen from '../screens/DisplayPostTwoColumnScreen';

import PostsSwipeScreen from '../screens/PostsSwipeScreen';
import PostManagerScreen from '../screens/PostManagerScreen';
import PostDeleteConfirmationScreen from '../screens/PostDeleteConfirmationScreen';
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
      }}
    >
      <Stack.Screen 
        name="Account" 
        component={AccountScreen}
        initialParams={{
          newPost: null,
        }}
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
        name={"AccountPostsSwipeStack"}
        component={PostsSwipeStack}
      />
      <Stack.Screen
        name={"DisplayPostTwoColumn"}
        component={DisplayPostTwoColumnScreen}
        initialParams={{
          posts: [],
          postState: false,
          postFetchSwitch: true,
          postLast: null,

          currentUserId: null,
          displayPostUserId: null
        }}
      />
    </Stack.Navigator>
  );
};

export default AccountStack;
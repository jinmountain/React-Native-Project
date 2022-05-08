import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import PostsSwipeScreen from '../screens/PostsSwipeScreen';
import PostManagerScreen from '../screens/PostManagerScreen';
import PostDeleteConfirmationScreen from '../screens/PostDeleteConfirmationScreen';
import PostDetailScreen from '../screens/PostDetailScreen';

import CommentScreen from '../screens/comment/CommentScreen';
import CommentManagerScreen from '../screens/comment/CommentManagerScreen';
import CommentEditScreen from '../screens/comment/CommentEditScreen';
import CommentDeleteConfirmationScreen from '../screens/comment/CommentDeleteConfirmationScreen';
import CommentTextInputScreen from '../screens/comment/CommentTextInputScreen';

import ReplyScreen from '../screens/reply/ReplyScreen';
import ReplyManagerScreen from '../screens/reply/ReplyManagerScreen';
import ReplyEditScreen from '../screens/reply/ReplyEditScreen';
import ReplyDeleteConfirmationScreen from '../screens/reply/ReplyDeleteConfirmationScreen';
import ReplyTextInputScreen from '../screens/reply/ReplyTextInputScreen';

// Stacks
// import UserAccountStack from './UserAccountStack';

const Stack = createStackNavigator();

const PostsSwipeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ 
        headerShown: false,
      }}
    >
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
      />
      <Stack.Screen 
        name="PostDetail" 
        component={PostDetailScreen} 
      />
      <Stack.Screen 
        name="Comment" 
        component={CommentScreen} 
        options={{ 
          cardStyle: {
            backgroundColor: 'transparent',
          },
          animationEnabled: true,
          presentation: 'transparentModal',
          gestureEnabled: false
        }}
      />
      <Stack.Screen 
        name="CommentTextInput" 
        component={CommentTextInputScreen} 
        options={{ 
          cardStyle: {
            backgroundColor: 'transparent',
          },
          animationEnabled: true,
          presentation: 'transparentModal',
          gestureEnabled: false
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
        name="ReplyTextInput" 
        component={ReplyTextInputScreen} 
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
      />
    </Stack.Navigator>
  );
};

export default PostsSwipeStack;
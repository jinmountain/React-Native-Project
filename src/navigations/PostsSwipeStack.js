import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import PostsSwipeScreen from '../screens/PostsSwipeScreen';
import PostManagerScreen from '../screens/PostManagerScreen';
import DeletionConfirmationScreen from '../screens/DeletionConfirmationScreen';
import PostDetailScreen from '../screens/PostDetailScreen';

// Stacks
import UserAccountStack from './UserAccountStack';

const Stack = createStackNavigator();

const PostsSwipeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ 
        headerShown: false,
        animationEnabled: false,
        // cardStyle: { backgroundColor: 'transparent' },
        // cardStyleInterpolator: ({ current: { progress } }) => ({
        //   // screen
        //   cardStyle: {
        //     opacity: progress.interpolate({
        //       inputRange: [0, 0.5, 0.9, 1],
        //       outputRange: [0, 0.25, 0.7, 1],
        //     }),
        //   },
        //   // screen background
        //   overlayStyle: {
        //     opacity: progress.interpolate({
        //       inputRange: [0, 1],
        //       outputRange: [0, 0.5],
        //       extrapolate: 'clamp',
        //     }),
        //   },
        // }),
      }}
    >
      <Stack.Screen 
        name="PostsSwipe" 
        component={PostsSwipeScreen}
        initialParams={{ 
          cardIndex: 0, 
          targetUser: null,
          postSource: 'default',
          targetUser: null,
          posts: [],
          postState: false,
          postFetchSwitch: true,
          postLast: null,
          businessUserSearch: null,
        }}
      />
      <Stack.Screen 
        name="PostDetail" 
        component={PostDetailScreen} 
        options={{ 
          headerShown: false,
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
        name="DeletionConfirmationScreen" 
        component={DeletionConfirmationScreen} 
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
};

export default PostsSwipeStack;
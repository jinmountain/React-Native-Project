import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import AccountScreen from '../screens/AccountScreen';
import ChatScreen from '../screens/ChatScreen';
import ChatListScreen from '../screens/ChatListScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import PostManagerScreen from '../screens/PostManagerScreen';
import DeletionConfirmationScreen from '../screens/DeletionConfirmationScreen';

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
        name="UpdateProfileStack" 
        component={UpdateProfileStack} 
      />
      <Stack.Screen 
        name="AccountManagerStack" 
        component={AccountManagerStack}
      />
    </Stack.Navigator>
  );
};

export default AccountStack;
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import UserRsvScreen from '../screens/UserRsvScreen';
import RsvDetailScreen from '../screens/RsvDetailScreen';
import RsvDetailManagerScreen from '../screens/RsvDetailManagerScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import DeletionConfirmationScreen from '../screens/DeletionConfirmationScreen';

// stacks
import UserAccountStack from './UserAccountStack';

const Stack = createStackNavigator();

const UserRsvStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ 
        headerShown: false,
        animationEnabled: false 
      }}
    >
      <Stack.Screen 
        name="UserRsv" 
        component={UserRsvScreen}
        initialParams={{
          screenRefresh: null,
          showAlertBoxRequest: false,
          showAlertBoxRequestText: null
        }}
      />
      <Stack.Screen
        name="RsvDetail"
        component={RsvDetailScreen}
      />
      <Stack.Screen
        name="RsvDetailManager"
        component={RsvDetailManagerScreen}
        options={{
          cardStyle: {
            backgroundColor: 'transparent',
          },
          gestureDirection: 'vertical',
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
          // type
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
        name="PostDetail" 
        component={PostDetailScreen} 
      />
      <Stack.Screen  
        name="UserAccountStack" 
        component={UserAccountStack}
        options={{ 
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default UserRsvStack;
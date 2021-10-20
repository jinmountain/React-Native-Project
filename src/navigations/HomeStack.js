import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import HomeScreen from '../screens/homeStackScreens/HomeScreen';
import ImageZoominScreen from '../screens/ImageZoominScreen';
import ReservationRequestScreen from '../screens/businessScreens/ReservationRequestScreen';
import PostsSwipeScreen from '../screens/PostsSwipeScreen';
import PostDetailScreen from '../screens/PostDetailScreen';

// Stacks
import PostsSwipeStack from './PostsSwipeStack';
import UserAccountStack from './UserAccountStack';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ 
        gestureEnabled: false
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        screenOtions={{ 
          headerShown: true,
        }}
        options={{ title: 'Snail' }}
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
        name="PostsSwipeStack" 
        component={PostsSwipeStack}
        options={{ 
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
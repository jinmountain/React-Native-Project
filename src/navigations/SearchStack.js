import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import MapSearchScreen from '../screens/MapSearchScreen';
import MapSearchPostsScreen from '../screens/MapSearchPostsScreen';
import ChatScreen from '../screens/ChatScreen';
// Stacks
import PostsSwipeStack from './PostsSwipeStack';
import UserAccountStack from './UserAccountStack';

const Stack = createStackNavigator();

const SearchStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ 
        headerShown: false,
        animationEnabled: false 
      }}
    >
      <Stack.Screen 
        name="MapSearch" 
        component={MapSearchScreen} 
      />
      <Stack.Screen 
        name="MapSearchPosts" 
        component={MapSearchPostsScreen} 
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
        name="Chat" 
        component={ChatScreen} 
      />
    </Stack.Navigator>
  );
};

export default SearchStack;
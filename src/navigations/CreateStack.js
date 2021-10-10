import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import SearchUsersScreen from '../screens/SearchUsersScreen';
import ContentCreateScreen from '../screens/ContentCreateScreen';
import ImageZoominScreen from '../screens/ImageZoominScreen';

const Stack = createStackNavigator();

const CreateStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ 
        headerShown: false,
        animationEnabled: false 
      }}
    >
      <Stack.Screen 
        name="ContentCreate" 
        component={ContentCreateScreen}
      />
      <Stack.Screen 
        name="SearchUsers" 
        component={SearchUsersScreen}
      />
      <Stack.Screen 
        name="ImageZoomin" 
        component={ImageZoominScreen}
      />
    </Stack.Navigator>
  );
};

export default CreateStack;

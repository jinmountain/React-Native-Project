import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import ContentCreateScreen from '../screens/ContentCreateScreen';

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
    </Stack.Navigator>
  );
};

export default CreateStack;

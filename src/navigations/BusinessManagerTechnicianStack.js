import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import BusinessManagerTechnicianScreen from '../screens/businessScreens/BusinessManagerTechnicianScreen';
import BusinessManagerManageTechnicianScreen from '../screens/businessScreens/BusinessManagerManageTechnicianScreen';
import BusinessManagerTechApplicationScreen from '../screens/businessScreens/BusinessManagerTechApplicationScreen';

// Stacks

const Stack = createStackNavigator();

const BusinessManagerTechnicianStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ 
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="BusinessManagerTechnician" 
        component={BusinessManagerTechnicianScreen}
      />
      <Stack.Screen 
        name="BusinessManagerTechApplication" 
        component={BusinessManagerTechApplicationScreen}
      />
      <Stack.Screen 
        name="BusinessManagerManageTechnician" 
        component={BusinessManagerManageTechnicianScreen}
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
}

export default BusinessManagerTechnicianStack;
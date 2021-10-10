import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import AccountManagerScreen from '../screens/accountManagerFlow/AccountManagerScreen';
import RegisterBusinessScreen from '../screens/accountManagerFlow/RegisterBusinessScreen';
import DeregisterBusinessScreen from '../screens/accountManagerFlow/DeregisterBusinessScreen';
import RegisterTechnicianScreen from '../screens/accountManagerFlow/RegisterTechnicianScreen';
import DeregisterTechnicianScreen from '../screens/accountManagerFlow/DeregisterTechnicianScreen';

// Stacks
import UpdateBusinessStack from './UpdateBusinessStack';

const Stack = createStackNavigator();

const AccountManagerStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ 
        headerShown: false,
        animationEnabled: false 
      }}
    >
      <Stack.Screen 
        name="AccountManager" 
        component={AccountManagerScreen}
      />
      <Stack.Screen 
        name="UpdateBusinessStack" 
        component={UpdateBusinessStack}
      />
      <Stack.Screen 
        name="RegisterBusiness" 
        component={RegisterBusinessScreen} 
        options={{
          cardStyle: {
            backgroundColor: 'transparent',
          },
        }}
      />
      <Stack.Screen 
        name="DeregisterBusiness" 
        component={DeregisterBusinessScreen} 
        options={{
          cardStyle: {
            backgroundColor: 'transparent',
          },
        }}
      />
      <Stack.Screen 
        name="RegisterTechnician" 
        component={RegisterTechnicianScreen} 
        options={{
          cardStyle: {
            backgroundColor: 'transparent',
          },
        }}
      />
      <Stack.Screen 
        name="DeregisterTechnician" 
        component={DeregisterTechnicianScreen} 
        options={{
          cardStyle: {
            backgroundColor: 'transparent',
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default AccountManagerStack;
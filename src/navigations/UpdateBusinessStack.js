import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import UpdateBusinessScreen from '../screens/accountManagerFlow/UpdateBusinessScreen';
import UBLocationAddressScreen from '../screens/accountManagerFlow/UBLocationAddressScreen';
import UBMobileLocationScreen from '../screens/accountManagerFlow/UBMobileLocationScreen';
import UBInStoreMobileScreen from '../screens/accountManagerFlow/UBInStoreMobileScreen';
import UBInStoreLocationAddressScreen from '../screens/accountManagerFlow/UBInStoreLocationAddressScreen';

const Stack = createStackNavigator();

const UpdateBusinessStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ 
        headerShown: false,
        animationEnabled: false 
      }}
    >
      <Stack.Screen 
        name="UpdateBusiness" 
        component={UpdateBusinessScreen}
      />
      <Stack.Screen 
        name="UBLocationAddress" 
        component={UBLocationAddressScreen}
      />
      <Stack.Screen 
        name="UBInStoreMobile" 
        component={UBInStoreMobileScreen}
      />
      <Stack.Screen 
        name="UBInStoreLocationAddress" 
        component={UBInStoreLocationAddressScreen}
      />
      <Stack.Screen 
        name="UBMobileLocation" 
        component={UBMobileLocationScreen}
      />
    </Stack.Navigator>
  )
};

export default UpdateBusinessStack;
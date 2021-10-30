import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// stacks
import UBSetBusinessHoursStack from './UBSetBusinessHoursStack';

// Screens
import UpdateBusinessScreen from '../screens/accountManagerFlow/UpdateBusinessScreen';
// location
import UBLocationAddressScreen from '../screens/accountManagerFlow/UBLocationAddressScreen';
import UBMobileLocationScreen from '../screens/accountManagerFlow/UBMobileLocationScreen';
import UBInStoreMobileScreen from '../screens/accountManagerFlow/UBInStoreMobileScreen';
import UBInStoreLocationAddressScreen from '../screens/accountManagerFlow/UBInStoreLocationAddressScreen';
// business hours
import UBSetBusinessHoursScreen from '../screens/accountManagerFlow/UBSetBusinessHoursScreen';

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
      <Stack.Screen 
        name="UBSetBusinessHoursStack" 
        component={UBSetBusinessHoursStack}
      />
    </Stack.Navigator>
  )
};

export default UpdateBusinessStack;
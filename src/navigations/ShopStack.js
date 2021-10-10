import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import BusinessScheduleScreen from '../screens/businessScreens/BusinessScheduleScreen';
import ReservationRequestScreen from '../screens/businessScreens/ReservationRequestScreen';
// Stacks

const Stack = createStackNavigator();

const ShopStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ 
        headerShown: false,
        // // animationEnabled: false,
        // cardStyle: { backgroundColor: 'transparent' },
        // cardStyleInterpolator: ({ current: { progress } }) => ({
        //   // screen
        //   cardStyle: {
        //     opacity: progress.interpolate({
        //       inputRange: [0, 0.5, 0.9, 1],
        //       outputRange: [0, 0.25, 0.7, 1],
        //     }),
        //   },
        //   // screen background
        //   overlayStyle: {
        //     opacity: progress.interpolate({
        //       inputRange: [0, 1],
        //       outputRange: [0, 0.5],
        //       extrapolate: 'clamp',
        //     }),
        //   },
        // }),
        // presentation: 'transparentModal'
      }}
    >
      <Stack.Screen 
        name="BusinessSchedule" 
        component={BusinessScheduleScreen} 
        // initialParams={{ 
        //   alertBoxtTextFromAnotherScreen: null
        // }}
      />
      <Stack.Screen
        name="ReservationRequest"
        component={ReservationRequestScreen}
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

export default ShopStack;
import React, { useContext, useEffect, useState } from 'react';
import { 
  View,
  StyleSheet, 
  Image,
  Text,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Screen
import SnailScreen from '../screens/SnailScreen';

// Stacks
import HomeStack from './HomeStack';
import SearchStack from './SearchStack';
import CreateStack from './CreateStack';
import AccountStack from './AccountStack';
import UserAccountStack from './UserAccountStack';
import ActivityTopTab from './ActivityTopTab';

// Designs
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';

// Contexts
import { Context as AuthContext } from '../context/AuthContext';

// Color
import color from '../color';

const BottomTab = createBottomTabNavigator();

const MainBottomTab = () => {
  const { 
    state: { 
      user,
      // userLogin,
      // homeTab,
      // searchTab,
      // activityTab,
      // accountTab,
    }, 
    // tabHome,
  } = useContext(AuthContext);

  // useEffect(() => {
  //   tabHome()
  // }, []);

  return (
  // -- original bottom tab
    <BottomTab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        backBehavior: "history"
      }}
    >
      <BottomTab.Screen 
        name="HomeTab" 
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            focused
            ? <Foundation name="home" size={RFValue(24)} color={color.black1} />
            : <Feather name="home" size={RFValue(24)} color={color.black1} />
          ),
        }}
      />
      <BottomTab.Screen 
        name="SearchTab" 
        component={SearchStack}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            focused
            ? <FontAwesome name="search" size={RFValue(24)} color={color.black1} />
            :<Ionicons name="ios-search" size={RFValue(24)} color={color.black1} />
          ),
        }} 
      />
      <BottomTab.Screen 
        name="SnailTab" 
        component={SnailScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            focused
            ? <Text style={[
              styles.sText,
              {
                fontWeight: 'bold',
                color: '#E44753'
              }
            ]}>S</Text>
            : <Text style={styles.sText}>S</Text>
          ),
        }}
      />
      <BottomTab.Screen 
        name="ActivityTab" 
        component={ActivityTopTab}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            focused
            ? <Octicons name="pulse" size={RFValue(24)} color={color.black1} />
            : <MaterialCommunityIcons name="pulse" size={RFValue(24)} color={color.black1} />
          ),
          tabBarBadge: "2",
          tabBarBadgeStyle: {

            backgroundColor: color.red2
          },
          tabBarStyle: { height: 50 }
        }}
      />
      <BottomTab.Screen 
        name="AccountTab" 
        component={AccountStack} 
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            focused && user && user.photoURL
            ? 
            <Image 
              style={{ ...styles.userPhoto, ...{ borderRadius: RFValue(100) }}} 
              source={{uri: user.photoURL}} 
            />
            : user && user.photoURL
            ? 
            <Image 
              style={{ ...styles.userPhoto, ...{ borderRadius: RFValue(5) }}} 
              source={{uri: user.photoURL}} 
            />
            :
            <Feather name="user" size={RFValue(24)} color={color.black1} />
          ),
        }}
      />
    </BottomTab.Navigator>

  // flexible mainBottomTab
    // homeTab
    // ? <HomeStack />
    // : searchTab
    // ? <SearchStack />
    // : activityTab
    // ? <ActivityTopTab />
    // : accountTab
    // ? <AccountStack />
    // : <HomeStack />
  )
};

const styles = StyleSheet.create({
  userPhoto: {
    justifyContent: 'center',
    alignItems: 'center',
    width: RFValue(33),
    height: RFValue(33),
  },
  sText: {
    fontSize: RFValue(20),
    color: color.black1
  }
});

export default MainBottomTab;
import React, { useContext } from 'react';
import { 
  View,
  StyleSheet, 
  Image, 
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Stacks
import HomeStack from './HomeStack';
import SearchStack from './SearchStack';
import CreateStack from './CreateStack';
import AccountStack from './AccountStack';
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
    }
  } = useContext(AuthContext);
  return (
    <BottomTab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false
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
        name="ContentCreateTab" 
        component={CreateStack}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            focused
            ? <MaterialCommunityIcons name="alpha-s-box" size={RFValue(31)} color={color.black1} />
            : <MaterialCommunityIcons name="alpha-s" size={RFValue(31)} color={color.black1} />
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
          tabBarBadge: "",
          tabBarBadgeStyle: {
            backgroundColor: color.red2
          }
        }}
      />
      <BottomTab.Screen 
        name="AccountTab" 
        component={AccountStack} 
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            focused && user.photoURL
            ? 
            <Image 
              style={{ ...styles.userPhoto, ...{ borderRadius: RFValue(100) }}} 
              source={{uri: user.photoURL}} 
            />
            : user.photoURL
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
  )
};

const styles = StyleSheet.create({
  userPhoto: {
    justifyContent: 'center',
    alignItems: 'center',
    width: RFValue(33),
    height: RFValue(33),
  }
});

export default MainBottomTab;
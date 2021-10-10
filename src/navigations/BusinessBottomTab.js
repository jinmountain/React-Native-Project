import React, { useContext } from 'react';
import { 
  View,
  StyleSheet, 
  Image, 
} from 'react-native';

// Bottom Tab
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Material Bottom Tab
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Stacks
import BusinessHomeStack from './BusinessHomeStack'
import BusinessAnalyticsStack from './BusinessAnalyticsStack'

// Screens
import BusinessManagerScreen from '../screens/businessScreens/BusinessManagerScreen';

// Tabs
import BusinessManagerTopTab from './BusinessManagerTopTab';

// Designs
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

// Contexts
import { Context as AuthContext } from '../context/AuthContext';

// Color
import color from '../color';

const BottomTab = createMaterialBottomTabNavigator();

const BusinessBottomTab = () => {
  const { 
    state: { 
      user,
    }
  } = useContext(AuthContext);
  return (
    <BottomTab.Navigator
      backBehavior="history"
      barStyle={{ backgroundColor: '#fff' }}
      activeColor={color.blue1}
      option={{
        tabBarColor: color.gray1
      }}
    >
      <BottomTab.Screen 
        name="HomeStack"
        component={BusinessHomeStack}
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
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
      <BottomTab.Screen 
        name="Manage" 
        component={BusinessManagerTopTab}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            focused
            ? <Entypo name="shop" size={RFValue(23)} color={color.blue1} />
            : <Entypo name="shop" size={RFValue(23)} color={color.black1} />
          ),
        }} 
      />
      <BottomTab.Screen 
        name="AnalyticsStack" 
        component={BusinessAnalyticsStack} 
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            focused
            ? <AntDesign name="areachart" size={RFValue(23)} color={color.blue1} />
            : <AntDesign name="linechart" size={RFValue(23)} color={color.black1} />
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
    width: RFValue(23),
    height: RFValue(23),
  }
});

export default BusinessBottomTab;
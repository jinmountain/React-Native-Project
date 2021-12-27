import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import MainTemplate from '../components/MainTemplate';
import HeaderBottomLine from '../components/HeaderBottomLine';
import { HeaderForm } from '../components/HeaderForm';

// Design

// Hooks

// color
import color from '../color';

// icon
import expoIcons from '../expoIcons';

const InnerScroll = () => {
  return (
    <View style={{ flex: 1, width: 300, height: 100 }}>
      <ScrollView
        horizontal
      >
        <View style={{ width: 300, height: 100, backgroundColor: 'red' }}/>
        <View style={{ width: 300, height: 100, backgroundColor: 'green' }}/>
        <View style={{ width: 300, height: 100, backgroundColor: 'red' }}/>
        <View style={{ width: 300, height: 100, backgroundColor: 'green' }}/>
      </ScrollView>
    </View>
  )
}

const UserLikeScreen = ({ navigation }) => {

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        horizontal
      >
        <InnerScroll/>
        <View style={{ width: 300, height: 100, backgroundColor: 'blue' }}/>
        <View style={{ width: 300, height: 100, backgroundColor: 'blue' }}/>
        <View style={{ width: 300, height: 100, backgroundColor: 'blue' }}/>

      </ScrollView>
    </View>
  )
};

const styles = StyleSheet.create({

});

export default UserLikeScreen;
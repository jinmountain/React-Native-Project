import React, { useState, useEffect, useRef } from 'react';
import {
  FlatList,
  Animated,
  View, 
  Text, 
  StyleSheet, 
  TouchableHighlight,
  // TouchableOpacity,
} from "react-native";
// TouchableOpacity from rngh works on both ios and android
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components

// Designs
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

// Color
import color from '../color';

// window height
// max value among elements

const BarGraphBar = ({ maxCount, count, height }) => {
  const barHeightAnim = useRef(new Animated.Value(0)).current;

  const increaseBarHeight = (maxCount, count) => {
    const countRatio = count / maxCount;
    const adjustedHeight = height * countRatio;
    Animated.timing(barHeightAnim, {
      toValue: adjustedHeight > 0 ? adjustedHeight : 0,
      duration: 3000,
      useNativeDriver: false
    }).start();
  };

  useEffect(() => {
    increaseBarHeight(maxCount, count)
  }, []);

  return (
    count
    ?
    <View>

      <Animated.View style={{ 
        width: RFValue(17), 
        backgroundColor: color.blue1, 
        height: barHeightAnim, 
        opacity: 0.3,
        borderTopLeftRadius: RFValue(7),
        borderTopRightRadius: RFValue(7), 
      }}>
        
      </Animated.View>
      <View style={{ position: 'absolute', backgroundColor: color.blue1, borderRadius: RFValue(7), width: RFValue(17), height: RFValue(27) }}>
      </View>
    </View>
    : null
  )
};

export default BarGraphBar;
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  Pressable,
  Animated,
  TouchableWithoutFeedback
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Hooks

import color from '../../color';

const AnimHighlight = ({ content, customStyles, onPressOutAction }) => {

  const backgroundColorAnim = useRef(new Animated.Value(0)).current;

  const dimBackground = Animated.timing(backgroundColorAnim, {
    toValue: 100,
    duration: 150,
    useNativeDriver: false,
  });

  const lightBackground = Animated.timing(backgroundColorAnim, {
    toValue: 0,
    duration: 300,
    useNativeDriver: false,
  });

  const borderColorAnim = useRef(new Animated.Value(0)).current;

  const dimBorderColor = Animated.timing(borderColorAnim, {
    toValue: 100,
    duration: 50,
    useNativeDriver: false,
  });

  const lightBorderColor = Animated.timing(borderColorAnim, {
    toValue: 0,
    duration: 500,
    useNativeDriver: false,
  });

  return (
    <Pressable
      onPressIn={() => {
        dimBackground.start();
        dimBorderColor.start();
      }}
      onPressOut={() => {
        lightBackground.start();
        lightBorderColor.start();
      }}
      onPress={() => {
        onPressOutAction()
      }}
    >
      <Animated.View 
        style={[
          customStyles,
          {
            backgroundColor: backgroundColorAnim.interpolate({
              inputRange: [0, 100],
              outputRange: [color.white2, color.grey4],
            }),
            borderWidth: 1,
            borderColor: borderColorAnim.interpolate({
              inputRange: [0, 100],
              outputRange: [color.white2, color.grey4],
            })
          }
        ]}
      >
        {content}
      </Animated.View>
    </Pressable>
  )
};

const styles = StyleSheet.create({

});

export default AnimHighlight;
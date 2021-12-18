import React, { useState, useRef, useCallback } from 'react';
import { 
  StyleSheet, 
  View,  
  PanResponder,
  Animated
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components

// Design

// Hooks

// color
import color from '../color';

// icon
import expoIcons from '../expoIcons';

const PanX = ({ panXAction, content }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (gesture) => {
      if (gesture.nativeEvent.pageX > 35 ) { // don't use locationX it means a location of container
        return false;
      }
      // console.log(gesture.nativeEvent);
      return true;
    },
    onPanResponderMove: Animated.event([
      null,
      { dx: pan.x }
    ],{
      useNativeDriver: false,
    }),
    onPanResponderRelease: (e, gs) => {
      // console.log("gs.vx: ", gs.vx);
      // console.log("gs.dx: ", gs.dx);
      if (gs.dx > 50) {
        panXAction();
      }
      // console.log(typeof(pan.x));
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
    }
  });

  return (
    <Animated.View 
      style={{ 
        flex: 1,
        transform: [
          { translateX: pan.x },
          { translateY: pan.y }
        ] 
      }}
      { ...panResponder.panHandlers }
    >
      {content}
    </Animated.View>
  )
};

const styles = StyleSheet.create({

});

export default PanX;
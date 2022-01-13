import React, { useState, useRef, useCallback } from 'react';
import { 
  StyleSheet, 
  View,  
  PanResponder,
  Dimensions,
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

const windowWidth = Dimensions.get("window").width;

const PanXYPinch = ({ content, cropImage }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const panScale = useRef(new Animated.Value(1)).current;
  const [ panPinchPoints, setPanPinchPoints ] = useState(null);
  const [ panX, setPanX ] = useState(null);
  const [ panY, setPanY ] = useState(null);
  const [ panScalee, setPanScalee ] = useState(null);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (event, gesture) => {
      const touches = event.nativeEvent.touches;
      console.log("onMoveSet: ", event.nativeEvent);
      if (touches.length >= 2) { 
        setPanPinchPoints(event.nativeEvent);
      }
      return (
        true
      );
    },
    onPanResponderMove: (event, gesture) => {
      // console.log("event: ", event.nativeEvent);
      const e = event.nativeEvent;
      const touches = e.touches;
      if (touches.length === 2) {
        const rootFirstTouchX = panPinchPoints.identifier === 1
        ? panPinchPoints.locationX
        : panPinchPoints.touches[0].locationX
        const rootFirstTouchY = panPinchPoints.identifier === 1
        ? panPinchPoints.locationY
        : panPinchPoints.touches[0].locationY
        const rootSecondTouchX = panPinchPoints.identifier === 2
        ? panPinchPoints.locationX
        : panPinchPoints.touches[1].locationX
        const rootSecondTouchY = panPinchPoints.identifier === 2
        ? panPinchPoints.locationY
        : panPinchPoints.touches[1].locationY

        // first identifier 1 second is at 1
        // first identifier 2 second is at 0 
        const firstTouchX = e.identifier === 1
        ? e.locationX
        : e.touches[0].locationX
        const firstTouchY = e.identifier === 1
        ? e.locationY
        : e.touches[0].locationY
        const secondTouchX = e.identifier === 2
        ? e.locationX
        : e.touches[1].locationX
        const secondTouchY = e.identifier === 2
        ? e.locationY
        : e.touches[1].locationY

        const avgTouchX = (-1 * ((firstTouchX + secondTouchX)/2)) + windowWidth/2;
        const avgTouchY = (-1 * ((firstTouchY + secondTouchY)/2)) + windowWidth/2;

        // console.log("avgTouchX: ", avgTouchX, "avgTouchY: ", avgTouchY);

        // -- right left top bottom
        let rightTouch;
        let leftTouch;
        let topTouch;
        let bottomTouch;

        let rightTouchX;
        let leftTouchX;
        let topTouchY;
        let bottomTouchY;

        if (firstTouchX > secondTouchX) {
          rightTouch = 1;
          rightTouchX = firstTouchX;
          leftTouch = 2;
          leftTouchX = secondTouchX;
        } else {
          rightTouch = 2;
          rightTouchX = secondTouchX;
          leftTouch = 1;
          leftTouchX = firstTouchX;
        }

        if (firstTouchY > secondTouchY) {
          topTouch = 2;
          topTouchY = secondTouchY;
          bottomTouch = 1;
          bottomTouchY = firstTouchY;
        } else {
          topTouch = 1;
          topTouchY = firstTouchY;
          bottomTouch = 2;
          bottomTouchY = secondTouchY;
        }

        let avgXChange;
        if (rightTouch === 1) {
          const rightXChange = (rightTouchX - rootFirstTouchX) / windowWidth;
          const leftXChange = (rootSecondTouchX - leftTouchX) / windowWidth;
          avgXChange = (rightXChange + leftXChange) / 2;
        } else {
          const rightXChange = (rightTouchX - rootSecondTouchX) / windowWidth;
          const leftXChange = (rootFirstTouchX - leftTouchX) / windowWidth;
          avgXChange = (rightXChange + leftXChange) / 2;
        }
        
        let avgYChange;
        if (topTouch === 1) {
          const topYChange = (rootFirstTouchY - topTouchY) / windowWidth;
          const bottomYChange = (bottomTouchY - rootSecondTouchY) / windowWidth;
          avgYChange = (topYChange + bottomYChange) / 2;
        } else {
          const topYChange = (rootSecondTouchY - topTouchY) / windowWidth;
          const bottomYChange = (bottomTouchY - rootFirstTouchY) / windowWidth;
          avgYChange = (topYChange + bottomYChange) / 2;
        }

        const avgXYChange = (avgXChange + avgYChange) / 2

        // console.log(avgXChange, avgYChange);
        // console.log("avg xy change", avgXYChange);
        const scaleChangeAmp = 1.1;
        const scaleChange = 1 + avgXYChange * scaleChangeAmp;

        // console.log("scaleChange: ", scaleChange);

        panScale.setValue(scaleChange);
        return (
          Animated.event([
            null,
            { dx: pan.x, dy: pan.y }
          ],{
            useNativeDriver: false,
          })(event, gesture)
        )
      } else {
        console.log(gesture.dx, gesture.dy);
        return (
          Animated.event([
            null,
            { dx: pan.x, dy: pan.y }
          ],{
            useNativeDriver: false,
          })(event, gesture)
        )
      }
    },
    onPanResponderRelease: (event, gs) => {
      const e = event.nativeEvent;
      const touches = e.touches;
      if (touches.length === 2) {
        Animated.spring(pan, {
          toValue: { x: gs.dx, y: gs.dy },
          useNativeDriver: false,
        }).start();
        panScale.setValue(1);
      } else {
        Animated.spring(pan, {
          toValue: { x: gs.dx, y: gs.dy },
          useNativeDriver: false,
        }).start();
      }
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
      <Animated.View
        style={{
          flex: 1,
          transform: [
            {
              scale: panScale
            }
          ]
        }}
      >
        {content}
      </Animated.View>
    </Animated.View>
  )
};

const styles = StyleSheet.create({

});

export default PanXYPinch;
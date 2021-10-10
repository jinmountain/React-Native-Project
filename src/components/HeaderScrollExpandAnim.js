import React, { useEffect } from 'react';
import { StyleSheet, View, Animated, Text } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const HeaderScrollExpandAnim = ({ 
  animValue, 
  headerTitle,
  maxHeaderHeight,
  minHeaderHeight,
  maxHeaderTitleSize,
  minHeaderTitleSize,
  backgroundColor
}) => {
  const headerHeight = animValue.interpolate({
    inputRange: [0, maxHeaderHeight],   // input ( speed? ) | input is from 0 to 200
    outputRange: [maxHeaderHeight, minHeaderHeight], // output 200 to 44 | and output is from 200 to 44
    extrapolate: 'clamp'
  });

  const fontSizeAnim = animValue.interpolate({
    inputRange: [0, maxHeaderHeight],
    outputRange: [maxHeaderTitleSize, minHeaderTitleSize],
    extrapolate: "clamp"
  });

  return (
    <Animated.View
      style={{
        top: 0,
        left: 0,
        right: 0,
        zIndex: 5,
        height: headerHeight,
        backgroundColor: backgroundColor,
        justifyContent: 'center',
        paddingLeft: RFValue(15)
      }}
    >
      <Animated.Text style={[styles.titleText, { fontSize: fontSizeAnim }]}>
        {headerTitle}
      </Animated.Text>
    </Animated.View>
  )
};

const styles = StyleSheet.create({
  // titleContainer: {
  //   height: 200,
  //   borderWidth: 1,
  //   justifyContent: 'center',
  // },
  titleText: {
    fontSize: RFValue(17),
    fontWeight: 'bold'
  }
});

export default HeaderScrollExpandAnim;

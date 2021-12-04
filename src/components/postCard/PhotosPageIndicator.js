import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Color
import color from '../../color';

// hooks
import { wait } from '../../hooks/wait';

const indicatorHeight = RFValue(25);

const PhotosPageIndicator = ({ currentIndex, imageLength, marginTop }) => {

  return (
    <View style={
      marginTop
      ?
      // 
      [ styles.imagePageIndicatorContainer, { marginTop: marginTop - indicatorHeight - RFValue(10) }]
      : styles.imagePageIndicatorContainer
    }>
      <View style={styles.paddingRight}>
        <View style={styles.pageBackground}/>
        <View style={styles.pageContainer}>
          <Text
            style={styles.pageText}
          >
            {currentIndex + 1} / {imageLength}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({ 
  imagePageIndicatorContainer: {
    elevation: 1,
    position: 'absolute',
    width: RFValue(50),
    height: indicatorHeight,
    borderRadius: RFValue(15),
    alignSelf: 'center',
  },
  pageContainer: {
    width: RFValue(50),
    height: RFValue(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageText: {
    color: "white",
    fontSize: RFValue(15),
    fontWeight: 'bold',
  },
  pageBackground: {
    position: 'absolute',
    width: RFValue(50),
    height: RFValue(25),
    borderRadius: RFValue(15),
    backgroundColor: color.grey8,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.75,
  },
  paddingRight: {
    paddingRight: RFValue(15),
  },
});

export default PhotosPageIndicator;

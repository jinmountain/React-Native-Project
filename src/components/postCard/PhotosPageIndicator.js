import React from 'react';
import { StyleSheet, View, Text} from 'react-native';

const PhotosPageIndicator = ({ currentIndex, imageLength }) => {
  return (
    <View style={styles.imagePageIndicatorContainer}>
      <Text
        style={styles.imagePageIndicatorText}
      >
        {currentIndex + 1} / {imageLength}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({ 
  imagePageIndicatorContainer: {
    elevation: 6,
    position: 'absolute',
    width: 50,
    backgroundColor: "#5A646A",
    opacity: 0.68,
    alignSelf: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 13,
  },
  imagePageIndicatorText: {
    color: "white",
  },
});

export default PhotosPageIndicator;

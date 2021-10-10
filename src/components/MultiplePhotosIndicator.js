import React from 'react';
import { StyleSheet, View, Text, Dimensions,} from 'react-native';

// Designs
import { FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get("window");

const MultiplePhotosIndicator = ({size}) => {
  return (
    <View style={styles.paddingContainer}>
      <View
        style={styles.multiplePhotosSymbolContainer}
      >
        <FontAwesome5 
          style={styles.multiplePhotosSymbol}
          name="images" 
          size={size} 
          color="white" 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  paddingContainer: {
    paddingRight: 8,
    position: 'absolute',
    alignSelf: 'flex-end',
    marginTop: 8,
    opacity: 0.68,
  } ,
  multiplePhotosSymbolContainer: {
    backgroundColor: "#5A646A",
    borderRadius: 5,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  multiplePhotosSymbol: {
    opacity: 1,
  },
});

export default MultiplePhotosIndicator;

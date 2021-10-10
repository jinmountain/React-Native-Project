import React from 'react'
import { 
  Text,
  View, 
  StyleSheet,
} from 'react-native';

// Componenets
import SpinnerFromActivityIndicator from '../ActivityIndicator';

// NPMs
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Color
import color from '../../color';

const SimpleSpinnerTopMargin = ({ customColor }) => {
  return (
    <View style={styles.loadingSpinnerContainer}>
      <SpinnerFromActivityIndicator
        customColor={customColor}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  loadingSpinnerContainer: {
    position: 'absolute',
    alignSelf: 'center',
    marginTop: '17%',
  },
});

export default SimpleSpinnerTopMargin;


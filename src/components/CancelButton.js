import React from 'react';
import { 
  Text,
  StyleSheet,
  Dimensions, 
  View,
  TouchableOpacity
} from 'react-native';

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const WINDOW_HEIGHT = Dimensions.get("window").height;
const closeButtonSize = Math.floor(WINDOW_HEIGHT * 0.04);

// color
import  color from '../color'

const CancelButton = ({onPressFunction}) => {
  
	return (
		<TouchableOpacity onPress={onPressFunction} style={styles.closeButton}>
			<View 
				style={[styles.closeCross, { transform: [{ rotate: "45deg" }] }]} 
			/>
			<View
				style={[styles.closeCross, { transform: [{ rotate: "-45deg" }] }]}
			/>
		</TouchableOpacity>
	)
};

const styles = StyleSheet.create({
	closeButton: {
		position: 'absolute',
		justifyContent: "center",
		alignItems: "center",
    height: closeButtonSize,
    width: closeButtonSize,
    borderRadius: Math.floor(closeButtonSize / 2),
    backgroundColor: color.white2,
    opacity: 0.7,
    zIndex: 2,
  },
  closeCross: {
  	position: "absolute",
    width: RFPercentage(2.5),
    height: RFValue(2.5),
    backgroundColor: "black",
  },
});

export default CancelButton;
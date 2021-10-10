import React from 'react';
import { 
	Text, 
	View, 
	TextInput, 
	StyleSheet, 
	TouchableHighlight
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import color from '../color';

// Designs
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CheckBox = ({ value, onValueChange }) => {
	return (
		<TouchableHighlight
			style={styles.buttonContainer}
			onPress={onValueChange}
    	underlayColor={color.gray4}
		>
			{ 
				value
				? <MaterialCommunityIcons name="checkbox-marked" size={RFValue(23)} color={color.blue1} />
				: <MaterialCommunityIcons name="checkbox-blank-outline" size={RFValue(23)} color={color.black1}/>
			}
		</TouchableHighlight>
	)
}

const styles = StyleSheet.create({
  buttonContainer: {
  	justifyContent: 'center',
  	alignItems: 'center',
  	padding: RFValue(11),
    borderRadius: RFValue(100),
  },
});

export default CheckBox;
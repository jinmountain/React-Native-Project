import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import color from '../color';

const ButtonA = ({customStyles, text, icon}) => {
	return (
		<View style={styles.buttonAContainer}>
			{icon}
			<Text style={[styles.buttonAText, customStyles]}>
				{text}
			</Text>
		</View>
	)
};

const styles = StyleSheet.create({
	buttonAContainer: {
		backgroundColor: '#fff',
		flexDirection: 'row',
		borderWidth: 0.5,
		borderColor: color.gray3,
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: RFValue(5),
	},
	buttonAText: {
		paddingVertical: RFValue(7),
		paddingHorizontal: RFValue(3),
	}
});

export default ButtonA;
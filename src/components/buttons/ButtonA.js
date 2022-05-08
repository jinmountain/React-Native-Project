import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import color from '../../color';

const ButtonA = ({customButtonContainerStyle, customTextStyle, text, icon}) => {
	return (
		<View style={
			customButtonContainerStyle
			?
			[styles.buttonAContainer, customButtonContainerStyle]
			:
			styles.buttonAContainer
		}>
			{icon}
			<Text style={[styles.buttonAText, customTextStyle]}>
				{text}
			</Text>
		</View>
	)
};

const styles = StyleSheet.create({
	buttonAContainer: {
		backgroundColor: color.white2,
		flexDirection: 'row',
		borderWidth: 0.5,
		borderColor: color.grey3,
		borderRadius: RFValue(5),
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
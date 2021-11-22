import React from 'react';
import { View, StyleSheet, ActivityIndicator, } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import color from '../color';

const SpinnerFromActivityIndicator = ({containerCustomStyle, customSize, customColor}) => {
	return (
		<View style={
			containerCustomStyle
			?
			styles.container
			:
			[styles.container, containerCustomStyle]
		}>
			<ActivityIndicator 
				size={ customSize ? customSize : "large" } 
				color={ customColor ? customColor : color.black2 } 
			/>
		</View>
	)
};

const styles = StyleSheet.create({ 
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
	} 
});

export default SpinnerFromActivityIndicator;
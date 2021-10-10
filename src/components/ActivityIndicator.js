import React from 'react';
import { View, StyleSheet, ActivityIndicator, } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import color from '../color';

const SpinnerFromActivityIndicator = ({customSize, customColor}) => {
	return (
		<View style={styles.container}>
			<ActivityIndicator 
				size={ customSize ? customSize : "large" } 
				color={ customColor ? customColor : color.blue1 } 
			/>
		</View>
	)
};

const styles = StyleSheet.create({ 
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		elevation: 10,
	} 
});

export default SpinnerFromActivityIndicator;
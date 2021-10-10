import React from 'react';
import { StyleSheet, View, Text, } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import SpinnerFromActivityIndicator from '../components/ActivityIndicator';
import color from '../color';

// Designs
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LoadingAlert = ({ progress }) => {
	return (
		<View style={styles.container}>
			<View style={styles.loadingAlertContainer}>
				<View style={styles.iconContainer}>
					<MaterialCommunityIcons name="alpha-l" size={RFValue(23)} color={color.gray3} />
					<MaterialCommunityIcons name="alpha-o" size={RFValue(23)} color={color.gray3} />
					<MaterialCommunityIcons name="alpha-a" size={RFValue(23)} color={color.gray3} />
					<MaterialCommunityIcons name="alpha-d" size={RFValue(23)} color={color.gray3} />
					<MaterialCommunityIcons name="alpha-i" size={RFValue(23)} color={color.gray3} />
					<MaterialCommunityIcons name="alpha-n" size={RFValue(23)} color={color.gray3} />
					<MaterialCommunityIcons name="alpha-g" size={RFValue(23)} color={color.gray3} />
				</View>
				{
					progress
					?
					<View>
						<Text style={styles.progressText}>{progress} %</Text>
					</View>
					:
					null
				}
				
				<SpinnerFromActivityIndicator />
			</View>
		</View>
	)
}

const styles = StyleSheet.create({ 
	container: {
		zIndex: 2, // This covers the buttons on the screen and block from pressing
		position: 'absolute',
		width: "100%",
		height: "100%",
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingAlertContainer: {
		zIndex: 3,
		alignSelf: 'center',
		position: 'absolute',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: "white",
		shadowColor: "#000",
		shadowOffset: { x: 1, y: 1 },
    shadowRadius: 5,
    shadowOpacity: 0.4,
    elevation: 5, // for android
    borderRadius: 10,
    padding: RFValue(7),
    paddingBottom: RFValue(10),
	},
	iconContainer: {
		padding: RFValue(7),
		flexDirection: 'row',
	},
	text: {
		fontSize: RFValue(15),
		color: color.black1,
		padding: RFValue(7),
	},
	progressText: {
		fontSize: RFValue(15),
		fontWeight: 'bold',
	},
});

export default LoadingAlert;
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
				{
					progress
					?
					<View style={styles.progressBarContainer}>
						<View style={[ styles.progressbar, { width: `${progress}%` }]}>
						</View>
						<Text style={styles.progressText}>{progress} %</Text>
					</View>
					:
					null
				}
				<View style={styles.iconContainer}>
					<View style={styles.letterContainer}>
						<Text style={styles.letterText}>W</Text>
					</View>
					<View style={styles.letterContainer}>
						<Text style={styles.letterText}>O</Text>
					</View>
					<View style={styles.letterContainer}>
						<Text style={styles.letterText}>N</Text>
					</View>
					<View style={styles.letterContainer}>
						<Text style={styles.letterText}>D</Text>
					</View>
					<View style={styles.letterContainer}>
						<Text style={styles.letterText}>E</Text>
					</View>
					<View style={styles.letterContainer}>
						<Text style={styles.letterText}>R</Text>
					</View>
					{/*<MaterialCommunityIcons name="alpha-l" size={RFValue(23)} color={color.grey3} />
					<MaterialCommunityIcons name="alpha-o" size={RFValue(23)} color={color.grey3} />
					<MaterialCommunityIcons name="alpha-a" size={RFValue(23)} color={color.grey3} />
					<MaterialCommunityIcons name="alpha-d" size={RFValue(23)} color={color.grey3} />
					<MaterialCommunityIcons name="alpha-i" size={RFValue(23)} color={color.grey3} />
					<MaterialCommunityIcons name="alpha-n" size={RFValue(23)} color={color.grey3} />
					<MaterialCommunityIcons name="alpha-g" size={RFValue(23)} color={color.grey3} />*/}
				</View>
				<View style={styles.spinnerContainer}>
					<SpinnerFromActivityIndicator customColor={color.red2}/>
				</View>
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
		backgroundColor: color.white2,
		shadowColor: "#000",
		shadowOffset: { x: 1, y: 1 },
    shadowRadius: 5,
    shadowOpacity: 0.4,
    elevation: 5, // for android
    borderRadius: RFValue(7),
    width: RFValue(170),
    height: RFValue(170),
	},
	iconContainer: {
		flex: 1,
		flexDirection: 'row',
		paddingHorizontal: RFValue(15),
		paddingTop: RFValue(10),
	},
	letterContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	letterText: {
		fontSize: RFValue(17),
		color: color.black2,
	},

	progressBarContainer: {
		height: RFValue(30),
		justifyContent: 'center',
		alignItems: 'center',
	},
	progressbar: {
		position: 'absolute',
		height: RFValue(30),
		backgroundColor: color.red2,
		borderRadius: RFValue(100),
	},
	progressText: {
		color: color.white2,
		fontSize: RFValue(15),
		fontWeight: 'bold',
	},

	spinnerContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: RFValue(7),
		paddingBottom: RFValue(10),
	},
});

export default LoadingAlert;
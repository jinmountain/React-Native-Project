import React from 'react';
import { 
	View, 
	StyleSheet, 
	Text,
	Pressable,
	TouchableOpacity, 
	TouchableHighlight 
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import color from '../color';

const TwoButtonAlert = ({
	title, 
	message, 
	buttonOneText, 
	buttonTwoText, 
	buttonOneAction, 
	buttonTwoAction 
}) => {
	return (
		<View style={styles.container}>
			<Pressable
				onPress={buttonTwoAction}
				style={styles.backgroundShadow}>
			</Pressable>
			<View style={styles.alertContainer}>
				<View style={styles.titleContainer}>
					<Text style={styles.titleText}>
						{title}
					</Text>
				</View>
				<View style={styles.messageContainer}>
					<Text style={styles.messageText}>
						{message}
					</Text>
				</View>
				<View style={styles.actionContainer}>
					<TouchableHighlight
						style={{ ...styles.buttonContainer, ...{borderBottomLeftRadius: RFValue(7), backgroundColor: color.red2} }}
						onPress={buttonOneAction}
						underlayColor={color.red3}
					>
						<View style={styles.buttonInner}>
							<Text style={[ styles.buttonText, { color: color.white2 } ]}>
								{buttonOneText}
							</Text>
						</View>
					</TouchableHighlight>
					<TouchableHighlight
						style={{ ...styles.buttonContainer, ...{borderBottomRightRadius: RFValue(7)} }}
						onPress={buttonTwoAction}
						underlayColor={color.grey4}
					>
						<View style={styles.buttonInner}>
							<Text style={styles.buttonText}>
								{buttonTwoText}
							</Text>
						</View>
					</TouchableHighlight>
				</View>
			</View>
		</View>
	)
};

const styles = StyleSheet.create({ 
	container: {
		zIndex: 6,
		height: '100%',
		width: '100%',
		position: 'absolute',
		justifyContent: 'center',
		alignItems: 'center',
	},
	backgroundShadow: {
		height: '100%',
		width: '100%',
		position: 'absolute',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	alertContainer: {
		borderRadius: RFValue(7),
		width: '70%',
		minHeight: RFValue(250),
		backgroundColor: '#fff',
		// shadow alert box
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3,
		// elevation for android
		elevation: 5,
	},
	
	titleContainer: {
		flex: 0.7,
		justifyContent: 'center',
		alignItems: 'center',
	},
	titleText: {
		fontSize: RFValue(23),
		fontWeight: 'bold'
	},
	messageContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: RFValue(7),
	},
	messageText: {
		fontSize: RFValue(17)
	},
	actionContainer: {
		flex: 1,
		flexDirection: 'row',
	},
	buttonContainer: {
		flex: 1,
		backgroundColor: color.grey1,
	},
	buttonInner: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonText: {
		fontSize: RFValue(19),
		fontWeight: 'bold',
	},
});

export default TwoButtonAlert;
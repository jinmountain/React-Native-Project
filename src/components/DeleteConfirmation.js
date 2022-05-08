import React from 'react';
import { 
	Text, 
	View,
	Animated, 
	StyleSheet,
	TouchableOpacity,
	TouchableHighlight,
	Dimensions,
	Pressable,
} from 'react-native';
import { SafeAreaView, } from 'react-native-safe-area-context';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '@react-navigation/native';
import { useCardAnimation } from '@react-navigation/stack';

// components
import HeaderBottomLine from '../components/HeaderBottomLine';

// Color
import color from '../color';

// icon
import expoIcons from '../expoIcons';

const { width, height } = Dimensions.get("window");

const DeleteConfirmation = ({ headerText, messageText, deleteAction }) => {
	const navigation = useNavigation();

	const { current } = useCardAnimation();

	return (
		<View 
			style={styles.postConfirmDeletionContainer}
		>
			<Pressable 
				style={[
					StyleSheet.absoluteFill,
					{ backgroundColor: 'rgba(0, 0, 0, 0.5)' },
				]}
				onPress={() => navigation.goBack()}
			>

			</Pressable>
			<Animated.View 
				style={[styles.confirmationContainer, {
					transform: [
						{
							scale: current.progress.interpolate({
								inputRange: [0, 1],
								outputRange: [0.9, 1],
								extrapolate: 'clamp',
							}),
						},
					],
				}]}
			>
				<View style={styles.headerContainer}>
					{
						headerText
						?
						<Text style={styles.headerText}>
							{headerText}
						</Text>
						:
						<Text style={styles.headerText}>
							404
						</Text>
					}
				</View>
				<View style={styles.messageContainer}>
					{
						messageText
						?
						<Text style={styles.messageText}>
							This can’t be undone and it will be removed from your account and Wonder search results.
						</Text>
						:
						<Text style={styles.messageText}>
							Sometimes, things don't go as planned
						</Text>
					}
				</View>
				<HeaderBottomLine />
				<View style={styles.buttonContainer}>
					<TouchableHighlight 
						style={[ styles.button, { borderColor: color.grey4, borderWidth: RFValue(1) }]}
						onPress={deleteAction}
						underlayColor={color.grey4}
					>
						<Text style={styles.deleteText}>Delete</Text>
					</TouchableHighlight>
				</View>
				<HeaderBottomLine />
				<View style={styles.buttonContainer}>
					<TouchableHighlight 
						style={[ styles.button, { backgroundColor: color.red1 }]}
						onPress={() => {
							navigation.goBack();
						}}
						underlayColor={color.grey4}
					>
						<Text style={[ styles.dontDeleteText, { color: color.white1 }]}>No</Text>
					</TouchableHighlight>
				</View>
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	postConfirmDeletionContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	confirmationContainer: {
		position: 'absolute',
		width: width * 0.7,
		height: height * 0.5,
		backgroundColor: '#fff',
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	headerContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: RFValue(10),
		paddingHorizontal: RFValue(10),
	},
	headerText: {
		fontSize: RFValue(22),
		fontWeight: 'bold',
	},
	buttonContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: RFValue(90),
		paddingHorizontal: RFValue(30),
		paddingVertical: RFValue(10),
	},
	deleteText: {
		color: color.black1,
		fontSize: RFValue(20),
		fontWeight: 'bold',
	},
	dontDeleteText: {
		fontSize: RFValue(20),
		fontWeight: 'bold',
	},
	button: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '100%',
		borderRadius: RFValue(50),
	},
	line: {
		width: '100%',
		borderWidth: 0.5,
		borderColor: color.grey1,
	},

	messageContainer: {
		paddingHorizontal: RFValue(10),
		paddingVertical: RFValue(10),
	},
	messageText: {
		color: color.grey3,
		fontSize: RFValue(15)
	},
});

export default DeleteConfirmation;
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

import { useTheme } from '@react-navigation/native';
import { useCardAnimation } from '@react-navigation/stack';

// components
import HeaderBottomLine from '../components/HeaderBottomLine';

// Firebase
// delete post
import postDeleteFire from '../firebase/post/postDeleteFire';
// cancel rsv
import rsvPostFire from '../firebase/rsvPostFire';

// Color
import color from '../color';

// icon
import expoIcons from '../expoIcons';

const { width, height } = Dimensions.get("window");

const DeletionConfirmationScreen = ({ route, navigation }) => {
	const { 
		headerText,
		messageText,
		requestAction,
	} = route.params;
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
						// onPress={() => {
							// if (requestType === 'post') {
							// 	const deletePost = contentDeleteFire.deletePostFire(postId, postData);
							// 	deletePost
							// 	.then(() => {
							// 		navigation.goBack();
							// 	})
							// 	.catch((error) => {
							// 		console.log("error occured: deletePost: ", error);
							// 	})
							// }
							// else if (requestType === 'rsv') {
							// 	const cancelRsv = rsvPostFire.cancelRsv(
							// 		rsvId,
							// 		busId,
							// 		busLocationType,
							// 		busLocality,
							// 		cusId,
							// 		postServiceType,
							// 	);
							// 	cancelRsv
							// 	.then((result) => {
							// 		if (result === true) {
							// 			console.log("deleted the rsv");
							// 			navigation.navigate('UserRsv', {
							// 				screenRefresh: true,
							// 				showAlertBoxRequest: true,
							// 				showAlertBoxRequestText: "Your Reservation is Cancelled"
							// 			});
							// 		} 
							// 		if (result === "rsvNotFound") {
							// 			console.log("cannot delete. the rsv is not found");
							// 			navigation.navigate('UserRsv', {
							// 				screenRefresh: true,
							// 				showAlertBoxRequest: true,
							// 				showAlertBoxRequestText: "Reservation Not Found."
							// 			});
							// 		}
							// 	})
							// 	.catch((error) => {
							// 		console.log("error occured: cancelRsv: ", error);
							// 		navigation.navigate('UserRsv', {
							// 			screenRefresh: true,
							// 			showAlertBoxRequest: true,
							// 			showAlertBoxRequestText: "Something went wrong. Try Again Later."
							// 		});
							// 	})
							// }
						// }}
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

export default DeletionConfirmationScreen;
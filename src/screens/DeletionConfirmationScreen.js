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
import contentDeleteFire from '../firebase/contentDeleteFire';
// cancel rsv
import rsvPostFire from '../firebase/rsvPostFire';

// Color
import color from '../color';

// icon
import expoIcons from '../expoIcons';

const { width, height } = Dimensions.get("window");

const DeletionConfirmationScreen = ({ route, navigation }) => {
	const { 
		requestType,

		postId, 
		postData,

		rsvId,
    busId,
    busLocationType,
    busLocality,
    cusId,
    postServiceType,
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
						requestType === 'post'
						?
						<Text style={styles.headerText}>
							Delete Post?
						</Text>
						:
						requestType === 'rsv'
						?
						<Text style={styles.headerText}>
							Cancel Reservation?
						</Text>
						:
						<Text style={styles.headerText}>
							Unrecognized Request Type
						</Text>
					}
				</View>
				<View style={styles.messageContainer}>
					{
						requestType === 'post' || requestType === 'rsv'
						?
						<Text style={styles.messageText}>
							This can’t be undone and it will be removed from your account and Wonder search results.
						</Text>
						:
						<Text style={styles.messageText}>
							request type is not matched.
						</Text>
					}
				</View>
				<HeaderBottomLine />
				<View style={styles.buttonContainer}>
					<TouchableHighlight 
						style={[ styles.button, { backgroundColor: color.red1 } ]}
						onPress={() => {
							if (requestType === 'post') {
								const deletePost = contentDeleteFire.deletePostFire(postId, postData);
								deletePost
								.then(() => {
									navigation.goBack();
								})
								.catch((error) => {
									console.log("error occured: deletePost: ", error);
								})
							}
							else if (requestType === 'rsv') {
								const cancelRsv = rsvPostFire.cancelRsv(
									rsvId,
									busId,
									busLocationType,
									busLocality,
									cusId,
									postServiceType,
								);
								cancelRsv
								.then((result) => {
									if (result === true) {
										navigation.navigate('UserRsv', {
											screenRefresh: true,
											showAlertBoxRequest: true,
											showAlertBoxRequestText: "Your Reservation is Cancelled"
										});
									} 
									if (result === "rsvNotFound") {
										navigation.navigate('UserRsv', {
											screenRefresh: true,
											showAlertBoxRequest: true,
											showAlertBoxRequestText: "Reservation Not Found."
										});
									}
								})
								.catch((error) => {
									console.log("error occured: cancelRsv: ", error);
									navigation.navigate('UserRsv', {
										screenRefresh: true,
										showAlertBoxRequest: true,
										showAlertBoxRequestText: "Something went wrong. Try Again Later."
									});
								})
							}
							
						}}
						underlayColor={color.grey4}
					>
						{	
							requestType === 'post' || requestType === 'rsv'
							?
							<Text style={[ styles.deleteText, { color: color.white1 }]}>Delete</Text>
							:
							<Text style={[ styles.deleteText, { color: color.white1 }]}>...</Text>
						}
					</TouchableHighlight>
				</View>
				<HeaderBottomLine />
				<View style={styles.buttonContainer}>
					<TouchableHighlight 
						style={[ styles.button, {borderColor: color.grey4, borderWidth: RFValue(1)}]}
						onPress={() => {
							navigation.goBack();
						}}
						underlayColor={color.grey4}
					>
						{
							requestType === 'post' || requestType === 'rsv'
							?
							<Text style={styles.dontDeleteText}>No</Text>
							:
							<Text style={styles.dontDeleteText}>...</Text>
						}
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
		color: color.blue1,
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
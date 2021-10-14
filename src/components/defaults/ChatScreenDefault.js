import React from 'react'
import { 
	View, 
	StyleSheet,
} from 'react-native';

// NPMs
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Color
import color from '../../color';

// Components
import SpinnerFromActivityIndicator from '../ActivityIndicator';

const ChatScreenDefault = () => {
	return (
		<View style={styles.container}>
			<View style={styles.messageContainer}>
				<View style={styles.messageEmpty}>
					<SpinnerFromActivityIndicator customColor={color.grey4}/>
				</View>
				<View style={styles.message}>
					<View style={styles.headContainer}>
						<View style={styles.head}>
						</View>
					</View>
					<View style={styles.contentContainer}>
						<View style={styles.content}>
						</View>
					</View>
				</View>
				<View style={styles.message}>
					<View style={styles.headContainer}>
						<View style={styles.head}>
						</View>
					</View>
					<View style={styles.contentContainer}>
						<View style={styles.content}>
						</View>
					</View>
				</View>
				<View style={styles.message}>
					<View style={styles.headContainer}>
						<View style={styles.head}>
						</View>
					</View>
					<View style={styles.contentContainer}>
						<View style={styles.content}>
						</View>
					</View>
				</View>
				<View style={styles.userMessage}>
					<View style={styles.userContentContainer}>
						<View style={styles.content}>
						</View>
					</View>
				</View>
				<View style={styles.userMessage}>
					<View style={styles.userContentContainer}>
						<View style={styles.content}>
						</View>
					</View>
				</View>
				<View style={styles.userMessage}>
					<View style={styles.userContentContainer}>
						<View style={styles.content}>
						</View>
					</View>
				</View>

				<View style={styles.actionBarContainer}>
					<View style={styles.actionBar}>
					</View>
				</View>
			</View>
		</View>
	)
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		flex: 1,
	},
	actionBarContainer: {
		flex: 1,
		padding: RFValue(17)
	},
	actionBar: {
		height: RFValue(57),
		borderRadius: RFValue(7),
		backgroundColor: color.grey4,
	},
	messageContainer: {
		flex: 9,
	},
	message: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	headContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: RFValue(7),
	},
	head: {
		height: RFValue(37),
		width: RFValue(37),
		backgroundColor: color.grey4,
		borderRadius: RFValue(100),
	},
	contentContainer: {
		flex: 1,
		paddingHorizontal: RFValue(7),
	},
	content: {
		height: RFValue(37),
		width: RFValue(77),
		backgroundColor: color.grey4,
		borderRadius: RFValue(7),
	},
	messageEmpty: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	},

	userMessage: {
		flex: 1,
		width: '100%',
	},
	userContentContainer: {
		paddingHorizontal: RFValue(7),
		alignSelf: 'flex-end',
	},
});

export default ChatScreenDefault;
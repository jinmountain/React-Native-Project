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

const ChatListDefault = () => {
	return (
		<View style={styles.container}>
			<View style={styles.actionBarContainer}>
				<View style={styles.actionBar}>
				</View>
			</View>
			<View style={styles.chatContainer}>
				<View style={styles.chatEmpty}>
					<SpinnerFromActivityIndicator customColor={color.gray4}/>
				</View>
				<View style={styles.chat}>
					<View style={styles.headContainer}>
						<View style={styles.head}>
						</View>
					</View>
					<View style={styles.contentContainer}>
						<View style={styles.content}>
						</View>
					</View>
				</View>
				<View style={styles.chat}>
					<View style={styles.headContainer}>
						<View style={styles.head}>
						</View>
					</View>
					<View style={styles.contentContainer}>
						<View style={styles.content}>
						</View>
					</View>
				</View>
				<View style={styles.chat}>
					<View style={styles.headContainer}>
						<View style={styles.head}>
						</View>
					</View>
					<View style={styles.contentContainer}>
						<View style={styles.content}>
						</View>
					</View>
				</View>
				
				<View style={styles.chatEmpty}>
					
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
		padding: RFValue(20)
	},
	actionBar: {
		height: RFValue(57),
		borderRadius: RFValue(13),
		backgroundColor: color.gray4,
	},
	chatContainer: {
		flex: 9,
	},
	chat: {
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
		height: RFValue(57),
		width: RFValue(57),
		backgroundColor: color.gray4,
		borderRadius: 100,
	},
	contentContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: RFValue(7),
	},
	content: {
		height: RFValue(77),
		width: '100%',
		backgroundColor: color.gray4,
		borderRadius: RFValue(7),
	},
	chatEmpty: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	},
});

export default ChatListDefault;
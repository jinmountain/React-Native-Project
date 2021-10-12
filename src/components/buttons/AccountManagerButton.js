import React from 'react';
import { 
	Text, 
	View, 
	StyleSheet,
	TouchableHighlight,
	Dimensions
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Color
import color from '../../color';

// Designs
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

const { width, height } = Dimensions.get("window");
const buttonSize = width/3 - 8; // borderWidth + marginHorizontal * 2 = 8

const AccountManagerButton = ({ onPress, icon, textTop, textBottom }) => {
	return (
		<TouchableHighlight 
			style={styles.menuButton}
			onPress={onPress}
			underlayColor={color.grey4}
		>
			<View style={styles.textContainer}>
				{icon}
				<Text style={styles.buttonText}>
					{textTop}
				</Text>
				<Text style={styles.buttonText}>
					{textBottom}
				</Text>
			</View>
		</TouchableHighlight>
	)
}

const styles = StyleSheet.create({
	menuButton: {
		marginVertical: RFValue(6),
		marginHorizontal: RFValue(3),
		width: buttonSize,
		height: buttonSize,
		borderRadius: RFValue(15),
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: color.white1,
	},
	textContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonText: {
		fontSize: RFValue(13),
	}
});

export default AccountManagerButton;


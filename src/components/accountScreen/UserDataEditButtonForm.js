import React from 'react';
import { 
	Text, 
	StyleSheet, 
	View,
	TouchableOpacity, 
} from 'react-native';

// NPMs
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from '@react-navigation/native';

// Components
import { InputFormBottomLine } from '../InputFormBottomLine';

// Color
import color from '../../color';

const UserDataEditButtonForm = ({ 
	inputValue,
	currentValue, 
	dataType, 
	allowUsernameChange, 
	setUsernameTimeLimitWarning 
}) => {
	const navigation = useNavigation();
	// console.log(dataType + ' new input value: ' + inputValue);

	const dataTypeLabel = (dataType) => {
		if (dataType === 'name') {
			return "Name"
		} 
		else if (dataType === 'username') {
			return "Username"
		}
		else if (dataType === "website") {
			return "Website"
		}
		else if (dataType === "sign") {
			return "Sign"
		}
		else if (dataType === "phoneNumber") {
			return "Phone Number"
		}
		else {
			"undefined"
		}
	};

	return (
		<TouchableOpacity
			onPress={() => {
				const existingInputValue = inputValue ? inputValue : currentValue ? currentValue : null

				dataType === 'Username' && allowUsernameChange === false
				? setUsernameTimeLimitWarning(true)
				: navigation.navigate(
						"UpdateProfileInput", 
						{ 
							inputType: dataType,
							inputValue: existingInputValue,
						}
					)
			}}
			style={styles.buttonContainer}
		>
			{ inputValue
				? 
				<View style={styles.textInputLabelContainer}>
					<Text style={styles.textInputLabel}>{dataTypeLabel(dataType)}</Text>
				</View>
				: currentValue 
				? 
				<View style={styles.textInputLabelContainer}>
					<Text style={styles.textInputLabel}>{dataTypeLabel(dataType)}</Text>
				</View>
				: null
			}
			<View
				style={styles.inputContainer}
			>
				{
					inputValue
					// New Input
					? <Text style={styles.blackText}>{inputValue}</Text>
					// User data
					: currentValue
					? <Text style={styles.blackText}>{currentValue}</Text>
					// placeholder
					: <Text style={styles.usernameInput}>{dataTypeLabel(dataType)}</Text>
				}
			</View>
		</TouchableOpacity>
	)
};

const styles = StyleSheet.create({
	buttonContainer: {
		borderRadius: RFValue(15),
		backgroundColor: color.grey4,
		padding: RFValue(7),
		marginBottom: RFValue(7),
		backgroundColor: color.white2,
		height: RFValue(75),
		justifyContent: 'center'
	},
	textInputLabelContainer: {
		minHeight: RFValue(25),
	},
	textInputLabel: {
		fontSize: RFValue(12),
		marginTop: RFValue(8),
		color: color.grey3,
	},
	inputContainer: {
		paddingLeft: RFValue(10),
		justifyContent: 'center',
		minHeight: RFValue(35),
		paddingBottom: RFValue(7),
	},
	blackText: {
		color: color.black1,
		fontSize: RFValue(17),
	},
	greyaaaaaaText: {
		color: color.grey3,
		fontSize: RFValue(17),
	},
	usernameInput: {
		fontSize: RFValue(17),
		color: color.grey3,
	},
});

export default UserDataEditButtonForm;
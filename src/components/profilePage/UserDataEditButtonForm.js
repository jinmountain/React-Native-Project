import React from 'react';
import { 
	Text, 
	StyleSheet, 
	View,
	TouchableOpacity, 
} from 'react-native';

// NPMs
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import { InputFormBottomLine } from '../InputFormBottomLine';

// Color
import color from '../../color';

const UserDataEditButtonForm = ({ navigate, newInput, currentValue, dataType, allowUsernameChange, setUsernameTimeLimitWarning }) => {
	console.log(dataType + ' new input: ' + newInput);
	return (
		<TouchableOpacity
			onPress={() => {
				dataType === 'Username' && allowUsernameChange === false
				? setUsernameTimeLimitWarning(true)
				: navigate(
						"UpdateProfileInput", 
						{ 
							inputType: dataType,
						}
					)
			}}
		>
			<View style={styles.textInputLabelContainer}>
			{ newInput
				? <Text style={styles.textInputLabel}>{dataType}</Text>
				: {currentValue} && <Text style={styles.textInputLabel}>{dataType}</Text>
			}
			</View>
			<View
				style={styles.inputContainer}
			>
				{
					newInput
					// New Input
					? <Text style={styles.blackText}>{newInput}</Text>
					// User data
					: {currentValue} 
					? <Text style={styles.blackText}>{currentValue}</Text>
					// placeholder
					: <Text style={styles.usernameInput}>{dataType}</Text>
				}
			</View>
			<InputFormBottomLine />
		</TouchableOpacity>
	)
};

const styles = StyleSheet.create({
	textInputLabelContainer: {
		minHeight: RFValue(25),
	},
	textInputLabel: {
		fontSize: RFValue(12),
		marginTop: RFValue(8),
		color: color.grey3,
	},
	inputContainer: {
		minHeight: RFValue(35),
		paddingLeft: RFValue(10),
		justifyContent: 'center',
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
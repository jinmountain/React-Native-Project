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
			style={styles.buttonContainer}
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
		</TouchableOpacity>
	)
};

const styles = StyleSheet.create({
	buttonContainer: {
		borderRadius: RFValue(30),
		backgroundColor: color.grey4,
		padding: RFValue(7),
		marginBottom: RFValue(7),
		backgroundColor: color.white2
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
import React, { useEffect, useState, } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { InputFormBottomLine } from '../components/InputFormBottomLine';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Color
import color from '../color';

const ProfileInputForm = (
	{
		setInputCheck,
		assignedValue, 
		currentValue, 
		maxLength, 
		placeholderValue, 
		multiline,
		numberOfLines,
		customHeight,
	}) => {

	const [ input, setInput ] = useState('');

	useEffect(() => {
		if (assignedValue) {
			setInput(assignedValue);
		}
		else if (currentValue) {
			setInput(currentValue);
		}

		// if there is currentValue add that to inputCheck 
		// or only new input will be updated
		if (currentValue) {
			setInputCheck(currentValue);
		}
	}, [])

	return (
		<View style={styles.profileInputFormContainer}>
			<View style={styles.textInputLabelContainer}>
				{ assignedValue
					? <Text style={styles.textInputLabel}>{placeholderValue}</Text>
					: currentValue ? <Text style={styles.textInputLabel}>{placeholderValue}</Text>
					: null
				}
			</View>
			<View style={styles.textInputContainer}>
				<TextInput
					style={[styles.input, { height: customHeight }]}
					placeholder={ currentValue
						? currentValue
						: placeholderValue
					}
					placeholderTextColor={color.grey3}
					onChangeText={(text) => {
						setInputCheck(text)
						setInput(text)
					}}
					value={input}
					maxLength={maxLength}
					multiline={multiline}
					underlineColorAndroid="transparent"
					autoCapitalize="none"
					numberOfLines={numberOfLines}
				/>
			</View>
			<InputFormBottomLine customStyles={{borderColor: color.grey1}} />
		</View>
	)
};

const styles = StyleSheet.create({
	profileInputFormContainer: {
		zIndex: 1,
	},
	textInputContainer: {
		paddingBottom: RFValue(7)
	},
	textInputLabel: {
		fontSize: RFValue(12),
		marginTop: RFValue(8),
		color: color.grey3
	},
	textInputLabelContainer: {
		minHeight: RFValue(25),
	},
	input: {
		color: color.black1,
		fontSize: RFValue(17),
		height: RFValue(35),
		overflow: 'hidden',
		// don't put margin or padding bottom 
		// it increase the gap between the placeholder and the bottom line
	},
});

export { ProfileInputForm };
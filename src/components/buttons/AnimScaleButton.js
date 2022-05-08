import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import color from '../../color';

const ButtonA = ({
	customButtonContainerStyle, 
	customTextStyle, 
	customScaleValue,
	text, 
	icon,
	onPress
}) => {

	const animScaleValue = useRef(new Animated.Value(1)).current;

	const upScale = () => {
		Animated.timing(animScaleValue, {
			toValue: customScaleValue ? customScaleValue : 1.05,
			duration: 100,
			useNativeDriver: false
		}).start();
	};

	const downScale = () => {
		Animated.timing(animScaleValue, {
			toValue: 1.0,
			duration: 300,
			useNativeDriver: false
		}).start();
	};

	return (
		<Pressable
			onPressIn={() => {
				upScale();
			}}
			onPressOut={() => {
				downScale();
			}}
			onPress={() => {
				onPress();
			}}
		>
			<Animated.View style={
				customButtonContainerStyle
				?
				[
					styles.buttonContainer, 
					customButtonContainerStyle, 
					{
						transform: [
							{scale: animScaleValue}
						]
					}
				]
				:
				[ 
					styles.buttonContainer,
					{
						transform: [
							{scale: animScaleValue}
						]
					}
				]
			}>
				<View style={styles.iconContainer}>
					{icon}
				</View>
				<Text style={[styles.buttonText, customTextStyle]}>
					{text}
				</Text>
			</Animated.View>
		</Pressable>
	)
};

const styles = StyleSheet.create({
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonText: {
		paddingVertical: RFValue(7),
		paddingHorizontal: RFValue(3),
	}
});

export default ButtonA;
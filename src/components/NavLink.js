import React from 'react';
import { Text, TouchableHighlight, StyleSheet } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// components
import Spacer from './Spacer';
import { useNavigation } from '@react-navigation/native';

// color
import color from '../color';

const NavLink = ({ text, routeName}) => {
	const navigation = useNavigation();
	return (
		<TouchableHighlight
			style={styles.navLinkContainer}
			onPress={() => navigation.navigate(routeName)}
			underlayColor={color.grey4}
		>
			<Text style={styles.link}>{text}</Text>
		</TouchableHighlight>
	);
};

const styles = StyleSheet.create({
	link: {
		color: color.blue1,
	},
	navLinkContainer: {
		marginTop: 10,
		paddingVertical: RFValue(5),
		paddingHorizontal: RFValue(7),
		borderRadius: RFValue(10),
	},
});

export default NavLink;
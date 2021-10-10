import React from 'react';
import { 
	View, 
	StyleSheet,
	Text,
	Dimensions,
} from 'react-native';

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components

// Color
import color from '../color';

// Designs
import { AntDesign } from '@expo/vector-icons';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const DisplayPostEndSign = () => {
	return (
		<View style={styles.postEndSignContainer}>
			<AntDesign name="cloudo" size={RFValue(37)} color={color.black1} />
			<Text style={styles.guidText}></Text>
		</View>
	);
};

const styles = StyleSheet.create({
	postEndSignContainer: {
		backgroundColor: '#fff',
		justifyContent: 'center', 
		alignItems: 'center',
		height: windowWidth/2 + RFValue(30),
		width: windowWidth/2,
		marginRight: 2,
	},
	guidText: {
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: RFValue(17),
		fontWeight: 'bold',
	},
});

export default DisplayPostEndSign;
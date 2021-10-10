import React from 'react';
import { 
	View, 
	StyleSheet,
	Text,
} from 'react-native';

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components

// Color
import color from '../color';

// Designs
import { AntDesign } from '@expo/vector-icons';

const PostEndSign = () => {
	return (
		<View style={styles.postEndSignContainer}>
			<AntDesign name="minuscircleo" size={RFValue(37)} color={color.black1} />
			<Text style={styles.guidText}></Text>
		</View>
	);
};

const styles = StyleSheet.create({
	postEndSignContainer: {
		justifyContent: 'center', 
		alignItems: 'center',
		marginVertical: RFValue(17),
		width: "100%",
	},
	guidText: {
		paddingVertical: RFValue(7),
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: RFValue(17),
		fontWeight: 'bold',
	},
});

export default PostEndSign;
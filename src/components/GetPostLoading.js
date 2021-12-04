import React from 'react';
import { 
	View, 
	StyleSheet,
} from 'react-native';

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import SpinnerFromActivityIndicator from '../components/ActivityIndicator';

// Color
import color from '../color';

const GetPostLoading = () => {
	return (
		<View style={styles.postsLoadingContainer}>
			<SpinnerFromActivityIndicator customColor={color.grey1}/>
			<View style={styles.background}/>
		</View>
	);
};

const styles = StyleSheet.create({
	postsLoadingContainer: {
		// position: "absolute",
		justifyContent: 'center', 
		alignItems: 'center',
		width: "100%",
	},
	background: {
		position: "absolute",
		opacity: 0.7,
		width: "100%",
		height: "100%",
		backgroundColor: color.white2,
	},
});

export default GetPostLoading;
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
			<SpinnerFromActivityIndicator customColor={color.gray1}/>
		</View>
	);
};

const styles = StyleSheet.create({
	postsLoadingContainer: {
		justifyContent: 'center', 
		alignItems: 'center',
		marginVertical: RFValue(17),
		width: "100%",
	},
});

export default GetPostLoading;
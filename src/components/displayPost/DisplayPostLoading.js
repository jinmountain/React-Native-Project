import React from 'react';
import { 
	View, 
	StyleSheet,
} from 'react-native';

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import SpinnerFromActivityIndicator from '../../components/ActivityIndicator';

// Color
import color from '../../color';

const DisplayPostLoading = ({customColor}) => {
	return (
		<View style={styles.displayPostsLoadingContainer}>
			<SpinnerFromActivityIndicator customColor={customColor ? customColor : color.gray1}/>
		</View>
	);
};

const styles = StyleSheet.create({
	displayPostsLoadingContainer: {
		justifyContent: 'center', 
		alignItems: 'center',
		marginVertical: RFValue(7),
	}
});


export default DisplayPostLoading;
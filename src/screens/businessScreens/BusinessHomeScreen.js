import React, { } from 'react';
import { Text, View, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView, } from 'react-native-safe-area-context';

// Designs

// Contexts

// Hooks

// Components
import MainTemplate from '../../components/MainTemplate';
import { HeaderForm } from '../../components/HeaderForm';

const BusinessHomeScreen = ({ navigation, isFocused }) => {

	return (
		<View style={styles.mainContainer}>
			<View style={styles.easyToUseContainer}>
				<Text>
					Business Home
				</Text>
			</View>
		</View>
  );
};

const styles = StyleSheet.create({
	businessHomeScreenContainer: {
		flex: 1,
		backgroundColor: 'white',
	},
	easyToUseContainer: {

	},
	mainContainer: {
		flex: 1,
	},
	navBarContainer: {
		flex: 1,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'white',
	},
});

export default BusinessHomeScreen;
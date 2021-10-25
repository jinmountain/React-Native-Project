import React, { } from 'react';
import { Text, View, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView, } from 'react-native-safe-area-context';

// Designs

// Contexts

// Hooks

// Components
import MainTemplate from '../../components/MainTemplate';
import { HeaderForm } from '../../components/HeaderForm';

const BusinessManagerMakeReservationScreen = ({ navigation, isFocused }) => {

	return (
		<View style={styles.mainContainer}>
			<Text>
				Make Reservation
			</Text>
		</View>
  );
};

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},
});

export default BusinessManagerMakeReservationScreen;
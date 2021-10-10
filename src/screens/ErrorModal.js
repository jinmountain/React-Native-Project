import React, { useState, useContext } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { NavigationBar, currentUser } from '../components/NavigationBar';

const ErrorModal = ({ navigation }) => {
	const errorMessage = navigation.getParam('message');

	return (
		<SafeAreaView style={styles.errorModalContainer}>
			<View style={styles.mainContainer}>
				<View style={styles.errorMessageContainer}>
					<TouchableOpacity
						style={styles.errorMessage} 
						onPress={() => navigation.goBack()}
					>
						<Text> :) {errorMessage} </Text>
					</TouchableOpacity>
				</View>
				<View style={styles.modalScreenEmpty}>
					<TouchableOpacity 
						style={styles.modalScreenEmptyGoBack} 
						onPress={() => navigation.goBack()}
					/>
				</View>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	errorModalContainer: {
		flex: 1,
		flexDirection: 'column',
	},
	mainContainer: {
		flex: 1,
		justifyContent: 'flex-start',
		borderWidth: 2,
		borderColor: 'red',
	},
	errorMessageContainer: {
		borderWidth: 2,
		marginTop: '10%',
		width: '100%',
		backgroundColor:"#FFFFFF",
	},
	errorMessage: {
		alignItems: 'center',
		borderWidth: 1,
		paddingHorizontal: 7,
		paddingVertical: 7,
		borderRadius: 5,
		backgroundColor: 'orange',
	},
	modalScreenEmpty: {
    flex: 1,
  },
  modalScreenEmptyGoBack: {
    flex: 1,
  },
});

ErrorModal.navigationOptions = {
  cardStyle: {
    backgroundColor: 'transparent',
    opacity: 1
  },
};

export default ErrorModal;
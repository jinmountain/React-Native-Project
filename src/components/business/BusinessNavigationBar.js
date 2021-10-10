import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, AsyncStorage } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from '@react-navigation/native';

const BusinessNavigationBar = () => {
	const navigation = useNavigation();
	return (
		<View style={styles.navBar}>
		  <TouchableOpacity style={styles.navBarElement} onPress={() => navigation.navigate("Home")}><Text>Snail</Text></TouchableOpacity>
		  <TouchableOpacity style={styles.navBarElement} onPress={() => navigation.navigate("BusinessHome")}><Text>Home</Text></TouchableOpacity>
		  <TouchableOpacity style={styles.navBarElement} onPress={() => navigation.navigate("BusinessManager")}><Text>Manage</Text></TouchableOpacity>
		  <TouchableOpacity style={styles.navBarElement} onPress={() => navigation.navigate("BusinessAnalytics")}><Text>Analytics</Text></TouchableOpacity>
		</View>
	)
};

const styles = StyleSheet.create({
	navBar: {
		flexDirection: "row", 
		height: RFValue(50),
		backgroundColor: 'white',
		justifyContent: "space-evenly", 
		alignItems: "center", 
		width: "100%",
	},
	navBarElement: {
		borderWidth: 1,
		flex: 1, 
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	}
})

export { BusinessNavigationBar };
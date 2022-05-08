import React, { useState, useContext } from 'react';
import { 
	View, 
	StyleSheet, 
	TouchableOpacity, 
	Text, 
	AsyncStorage,
	Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import { navigate } from '../navigationRef';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Hooks
import useImage from '../hooks/useImage';

// Contexts
import { Context as AuthContext } from '../context/AuthContext';
import { Context as PostContext } from '../context/PostContext';

// Designs
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

// color
import color from '../color';

// expo icons
import {
	octiconsPulse, 
	matPulse
} from '../expoIcons';

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


const NavigationBar = ({ tab }) => {
	const { 
		state: { 
			user,
			homeTab,
			searchTab,
			activityTab,
			accountTab,
		},
		tabHome,
		tabSearch,
		tabActivity,
		tabAccount,
	} = useContext(AuthContext);

	const navigation = useNavigation();
	const [pickImage] = useImage();

	return (
		<View style={styles.navBar}>
		  <TouchableOpacity 
		  	style={styles.navBarElement} 
		  	onPress={() => {
		  		// navigation.navigate("HomeTab");
		  		tabHome();
		  	}}
		  >
		  	{
		  		tab === "home" 
		  		? <Foundation name="home" size={RFValue(24)} color="black" />
		  		: <Feather name="home" size={RFValue(24)} color="black" />
		  	}
		  </TouchableOpacity>
		  <TouchableOpacity 
		  	style={styles.navBarElement} 
		  	onPress={() => {
		  		// navigation.navigate("SearchTab");
		  		tabSearch();
		  	}}
		  >
		  	{ 
		  		tab === "search"
		  		? <FontAwesome name="search" size={RFValue(24)} color="black" />
		  		:<Ionicons name="ios-search" size={RFValue(24)} color="black" />
		  	}
		  </TouchableOpacity>
		  <TouchableOpacity 
		  	style={styles.navBarElement} 
		  	onPress={() => { 
					navigation.navigate("ContentCreate");
		  	}}
		  	onLongPress={() => {
		  		navigation.navigate("Snail");
		  	}}
		  >
		  	<Text style={styles.sText}>S</Text>
		  </TouchableOpacity>
		  <TouchableOpacity 
		  	style={styles.navBarElement} 
		  	onPress={() => {
		  		// navigation.navigate("ActivityTab");
		  		tabActivity();
		  	}}
		  >
		  	{
		  		tab === "activity"
		  		? octiconsPulse(RFValue(24), color.black1)
		  		: matPulse(RFValue(24), color.black1)
		  	}
		  </TouchableOpacity>
		  <TouchableOpacity 
		  	style={styles.navBarElement} 
		  	onPress={() => {
		  		// navigation.navigate("AccountTab", {
		  		// 	screen: "Account"
		  		// });
		  		tabAccount();
		  	}}
		  >
		  	{ user.photoURL
		  		? <Image 
		  				style={
		  					tab === "account"
		  					? { ...styles.userPhoto, ...{ borderWidth: 2, borderColor: color.red2 }}
		  					: styles.userPhoto
		  				} 
		  				source={{uri: user.photoURL}} 
		  			/>
		  		: <Feather name="user" size={RFValue(24)} color="black" />
		  	}
		  </TouchableOpacity>
		</View>
	)
};

const styles = StyleSheet.create({
	navBar: {
		height: RFValue(55),
		flexDirection: "row", 
		backgroundColor: 'white',
		justifyContent: "center", 
		alignItems: "center", 
		width: "100%",
		borderWidth: 1,
	},
	navBarElement: {
		flex: 1, 
		justifyContent: 'center',
		alignItems: 'center',
	},
	sText: {
		fontWeight: 'bold',
		fontSize: RFValue(20),
	},
	userPhoto: {
  	justifyContent: 'center',
  	alignItems: 'center',
  	width: RFValue(40),
  	height: RFValue(40),
  	borderRadius: 100,
	}
})

export default NavigationBar;

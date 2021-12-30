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

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


const NavigationBar = () => {
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

	const {
		state: {
			files
		}
	} = useContext(PostContext);

	const navigation = useNavigation();
	const [pickImage] = useImage();

	return (
		<View style={styles.navBar}>
		  <TouchableOpacity 
		  	style={styles.navBarElement} 
		  	onPress={() => {
		  		navigation.navigate("Home");
		  		tabHome();
		  	}}
		  >
		  	{
		  		homeTab 
		  		? <Foundation name="home" size={RFValue(24)} color="black" />
		  		: <Feather name="home" size={RFValue(24)} color="black" />
		  	}
		  </TouchableOpacity>
		  <TouchableOpacity 
		  	style={styles.navBarElement} 
		  	onPress={() => {
		  		navigation.navigate("Search");
		  		tabSearch();
		  	}}
		  >
		  	{ 
		  		searchTab
		  		? <FontAwesome name="search" size={RFValue(24)} color="black" />
		  		:<Ionicons name="ios-search" size={RFValue(24)} color="black" />
		  	}
		  </TouchableOpacity>
		  <TouchableOpacity 
		  	style={styles.navBarElement} 
		  	onPress={() => { 
		  		files.length > 0
		  		? navigation.navigate("ContentCreate")
		  		: pickImage('nav')
		  	}}
		  >
		  	<Text style={styles.sText}>S</Text>
		  </TouchableOpacity>
		  <TouchableOpacity 
		  	style={styles.navBarElement} 
		  	onPress={() => {
		  		navigation.navigate("Activity");
		  		tabActivity();
		  	}}
		  >
		  	<Text>44</Text>
		  </TouchableOpacity>
		  <TouchableOpacity 
		  	style={styles.navBarElement} 
		  	onPress={() => {
		  		navigation.navigate("AccountTab", {
		  			screen: "Account"
		  		});
		  		tabAccount();
		  	}}
		  >
		  	{ user.photoURL
		  		? <Image 
		  				style={
		  					accountTab
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

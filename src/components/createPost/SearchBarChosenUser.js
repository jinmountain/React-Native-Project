import React from 'react';
import {
  Image,
  View, 
  Text, 
  StyleSheet, 
  TouchableHighlight,
  // TouchableOpacity,
} from "react-native";
// TouchableOpacity from rngh works on both ios and android
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
// Color
import color from '../../color';

// Components

// Hooks

// Designs
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const SearchBarChosenUser = ({
	chosenUser, 
	setChosenUser, 
	setRating,
	ResetRatingProcess
}) => {
	return (
		<TouchableOpacity 
		  style={styles.chosenUserContainer}
		  onPress={() => {
		    ResetRatingProcess();
		  }}
		>
			<View style={styles.chosenUserInner}>
			  <View style={styles.userPhotoContainer}>
			    { chosenUser.photoURL 
			      ? <Image 
			          style={styles.userPhoto}
			          source={{ uri: chosenUser.photoURL }}
			        />
			      : <Feather name="user" size={RFValue(24)} color={color.black1} />
			    }
			    
			  </View>
			  <View style={styles.userInfoContainer}>
			    <Text style={styles.usernameText}>{chosenUser.username}</Text>
			  </View>
			</View>
			<View style={styles.closeButtonContainer}>
				<AntDesign name="close" size={RFValue(21)} color={color.black1} />
			</View>
		</TouchableOpacity>
	)
};

const styles = StyleSheet.create({
	chosenUserContainer:{
    flexDirection: 'row',
    width: '100%',
    height: RFValue(57),
    backgroundColor: color.white1,
    marginHorizontal: RFValue(7),
    justifyContent: 'space-between',
  },
  chosenUserInner: {
  	flexDirection: 'row',
  },
	userPhotoContainer:{
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    paddingHorizontal: 5,
  },
	userPhoto: {
    width: RFValue(37),
    height: RFValue(37),
    borderRadius: 100,
  },
  userInfoContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  usernameText: {
    fontSize: RFValue(18),
  },
  closeButtonContainer: {
  	padding: RFValue(3),
  	justifyContent: 'center',
  	alignItems: 'center',
  	marginRight: RFValue(17),
  },
});

export { SearchBarChosenUser };
import React, { useContext, useEffect, useState } from 'react';
import { 
	View, 
	StyleSheet,
	Image, 
	Text,  
	TouchableOpacity,
	Dimensions,
	Linking, 
	ScrollView, 
} from 'react-native';

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Designs
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

// Color
import color from '../../color';

const ProfileCardBottom = ({ locationType, address, googleMapUrl, sign, websiteAddress, }) => {
	return (
		<View style={styles.profileCardBottomContainer}>
			{
				locationType === "inStore" && address && googleMapUrl
				?
				<TouchableOpacity 
					style={styles.locationContainer}
					onPress={() => {
						Linking.openURL(googleMapUrl);
					}}
				>
					<View style={styles.locationIcon}>
						<Feather name="map-pin" size={RFValue(17)} color={color.black1} />
					</View>
					<View style={styles.textContainer}>
						<Text style={styles.locationText}>{address}</Text>
					</View>
				</TouchableOpacity>
				: locationType === "mobile"
				?
				<View style={styles.locationContainer}>
					<View style={styles.locationIcon}>
						<AntDesign name="rocket1" size={RFValue(15)} color={color.black1} />
					</View>
					<View style={styles.textContainer}>
						<Text style={styles.locationText}>Mobile Business</Text>
					</View>
				</View>
				: null
			}
			{ 
				websiteAddress
				?
				<View style={styles.websiteAddressContainer}>
					<Text 
						style={styles.websiteAddressText}
		      	onPress={() => 
		      		Linking.openURL(websiteAddress)
		      	}
		      >
		      	{websiteAddress}
					</Text>
				</View>
				: null
			}
			{
				sign
				?
				<View style={styles.signContainer}>
					<Text style={styles.signText}>
						{sign}
					</Text>
				</View>
				: null
			}
		</View>
	)
};

const styles = StyleSheet.create({
  profileCardBottomContainer: {
  	backgroundColor: '#fff',
  	paddingVertical: RFValue(3),
  	paddingHorizontal: RFValue(20),
  },
  locationContainer: {
  	flexDirection: 'row',
  },
  locationIcon: {
  	paddingRight: RFValue(3),
  },
  textContainer: {
  	justifyContent: 'center',
  },
  locationText: {
  	fontSize: RFValue(15),
  },
  signContainer: {
  	paddingVertical: RFValue(3),
  }, 
  signText: {
  	fontSize: RFValue(15),
  },
  websiteAddressContainer: {
  	paddingVertical: RFValue(3),
  },
  websiteAddressText: {
  	color: 'blue',
  	fontSize: RFValue(15)
  },
});

export default ProfileCardBottom;
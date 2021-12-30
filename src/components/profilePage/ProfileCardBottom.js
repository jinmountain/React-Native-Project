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
	Animated,
} from 'react-native';

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// components
import AnimHighlight from '../buttons/AnimHighlight';

// hooks
import useConvertTime from '../../hooks/useConvertTime';

// Designs
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

// Color
import color from '../../color';

const ProfileCardBottom = ({ locationType, address, googleMapUrl, sign, websiteAddress, businessHours }) => {
	const renderBusHourItem = ({ item, index }) => {
		return (
			<View style={{ height: RFValue(30), flexDirection: 'row' }}>
				<View style={{ backgroundColor: color.white2 }}>
					<Text>{useConvertTime.convertMilitaryToStandard(item.opens.hour, item.opens.min)}</Text>
				</View>
				<Text> to </Text>
				<Text>{useConvertTime.convertMilitaryToStandard(item.closes.hour, item.closes.min)}</Text>
			</View>
		)
	};

	const DayHours = ({ dayText, hours, status }) => {
		return (
			<View style={{ flexDirection: 'row' }}>
				<View>
					<Text>
						{dayText}
					</Text>
				</View>
				<View>
					{
						hours.length > 0 && status
						?
						<FlatList
							data={hours}
							renderItem={renderBusHourItem}
							keyExtractor={(item, index) => index.toString()}
						/>
						:
						<Text>ClOSED</Text>
					}
				</View>
			</View>
		)
	};

	const RenderBusHours = () => {
		return (
			<View style={{ backgroundColor: color.red3 }}>
				<AnimHighlight
					content={
						<View style={{ backgroundColor color.red3 }}>
							<Text style={{ color: color.white2 }}>Show Business Hours</Text>
						</View>
					}
				/>
				<View>
					<DayHours
						dayText={"Mon."}
						hours={mon_hours}
						status={mon_open}
					/>
					<DayHours
						dayText={"Mon."}
						hours={mon_hours}
						status={mon_open}
					/>
				</View>
			</View>
		)
	} 

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
					<View style={styles.textContainer}>
						<Text style={styles.locationText}><Feather name="map-pin" size={RFValue(13)} color={color.black1} /> {address}</Text>
					</View>
				</TouchableOpacity>
				: locationType === "mobile"
				?
				<View style={styles.locationContainer}>
					<View style={styles.textContainer}>
						<Text style={styles.locationText}><AntDesign name="rocket1" size={RFValue(13)} color={color.black1} /> Mobile Business</Text>
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
			{
				businessHours &&

			}
		</View>
	)
};

const styles = StyleSheet.create({
  profileCardBottomContainer: {
  	backgroundColor: '#fff',
  	paddingVertical: RFValue(5),
  	paddingHorizontal: RFValue(20),
  },
  locationContainer: {
  	justifyContent: 'center',
  	paddingVertical: RFValue(3),
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
import React, { useContext, useEffect, useState } from 'react';
import { 
	View, 
	StyleSheet,
	Image,
	FlatList,
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

// expo icons
import {
	entypoDot,
	evilIconsChevronDown
} from '../../expoIcons';

const ProfileCardBottom = ({ 
	locationType, 
	address, 
	googleMapUrl, 
	sign, 
	websiteAddress,
	businessHours,
	busHoursExist, 
	busHoursVisibleSwitch
}) => {
	// get user's today
	const [ currentDayIndex, setCurrnetDayIndex ] = useState(null);
	const [ currentHours, setCurrentHours ] = useState(null);

	useEffect(() => {
		if (busHoursExist && businessHours) {
			console.log(useConvertTime.convertToTime(Date.now()).dayIndex);
			setCurrnetDayIndex(useConvertTime.convertToTime(Date.now()).dayIndex);
			if (currentDayIndex) {
				const currHrs = getHours(currentDayIndex);
				console.log('currhrs: ', currHrs.hours);
				setCurrentHours(currHrs);
			}
		}
	}, [currentDayIndex])

	const getHours = (currentDayIndex) => {
		if (currentDayIndex === 0) {
			const status = businessHours.sun_open;
			const hours = businessHours.sun_hours;
			return {
				status: status,
				hours: hours
			}
		}
		if (currentDayIndex === 1) {
			const status = businessHours.mon_open;
			const hours = businessHours.mon_hours;
			return {
				status: status,
				hours: hours
			}
		}
		if (currentDayIndex === 2) {
			const status = businessHours.tue_open;
			const hours = businessHours.tue_hours;
			return {
				status: status,
				hours: hours
			}
		}
		if (currentDayIndex === 3) {
			const status = businessHours.wed_open;
			const hours = businessHours.wed_hours;
			return {
				status: status,
				hours: hours
			}
		}
		if (currentDayIndex === 4) {
			const status = businessHours.thu_open;
			const hours = businessHours.thu_hours;
			return {
				status: status,
				hours: hours
			}
		}
		if (currentDayIndex === 5) {
			const status = businessHours.fri_open;
			const hours = businessHours.fri_hours;
			return {
				status: status,
				hours: hours
			}
		}
		if (currentDayIndex === 6) {
			const status = businessHours.sat_open;
			const hours = businessHours.sat_hours;
			return {
				status: status,
				hours: hours
			}
		}
	}

	const ShowBusHoursButton = () => {
		return (
			<AnimHighlight
				content={
					<View style={styles.todayHoursContainer}>
						<View>
							{
								currentHours.status
								?
								<Text style={[styles.hourText, { color: color.green1 }]}>Open</Text>
								:
								<Text style={[styles.hourText, { color: color.red1 }]}>Closed</Text>
							}
						</View>
						{entypoDot(RFValue(15), color.grey1)}
						{ currentHours.hours &&
							<FlatList 
								data={currentHours.hours}
								renderItem={({item, index}) => {
									return (
										<View style={{ flexDirection: 'row'}}>
											<View style={styles.hourContainer}>
												{
													item.opens &&
													<Text style={styles.hourText}>
														{useConvertTime.convertMilitaryToStandard(item.opens.hour, item.opens.min)}
													</Text>
												}
											</View>
											<Text> 
												{" - "}
											</Text>
											<View style={styles.hourContainer}>
												{
													item.closes &&
													<Text style={styles.hourText}>
														{useConvertTime.convertMilitaryToStandard(item.closes.hour, item.closes.min)}
													</Text>
												}
											</View>
										</View>
									)
								}}
								keyExtractor={(item, index) => index.toString()}
							/>
						}
						{
							evilIconsChevronDown(RFValue(25), color.grey3)
						}
					</View>
				}
				onPressOutAction={() => {
					busHoursVisibleSwitch();
				}}
			/>
		)
	} 

	return (
		<View style={styles.profileCardBottomContainer}>
			{
				locationType === "inStore" && address && googleMapUrl
				?
				<AnimHighlight 
					customStyles={styles.locationContainer}
					onPressOutAction={() => {
						Linking.openURL(googleMapUrl);
					}}
					content={
						<View style={styles.textContainer}>
							<Text style={styles.locationText}><Feather name="map-pin" size={RFValue(13)} color={color.black1} /> {address}</Text>
						</View>
					}
				/>
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
				busHoursExist && currentHours
				?
				<ShowBusHoursButton />
				: null
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

  todayHoursContainer: {
  	flexDirection: 'row', 
  	paddingVertical: RFValue(3)
  },
  hourContainer: {

  },
  hourText: {
  	fontSize: RFValue(15),
  }
});

export default ProfileCardBottom;
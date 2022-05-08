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
import { Menu, Divider } from 'react-native-paper';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// components
import AnimHighlight from '../buttons/AnimHighlight';
import VerticalSeperatorLine from '../VerticalSeperatorLine';

// hooks
import {
	convertToTime,
	convertMilitaryToStandard
} from '../../hooks/useConvertTime';

// Designs
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

// Color
import color from '../../color';

// expo icons
import {
	entypoDot,
	evilIconsChevronDown,
	featherMapPin,
	antdesignRocketOne,
	antdesignPhone,
	featherAlertCircle
} from '../../expoIcons';

const ProfileCardBottom = ({ 
	phoneNumber,
	locationType, 
	address, 
	googleMapUrl, 
	sign, 
	websiteAddress,
	businessHours,
	specialHour,
	busHoursExist, 
	busHoursVisibleSwitch
}) => {
	const [ cardBottomReady, setCardBottomReady ] = useState(false);

	// get user's today
	const [ currentDayIndex, setCurrnetDayIndex ] = useState(null);
	const [ currentHours, setCurrentHours ] = useState(null);
	const [ currentStatus, setCurrentStatus ] = useState(null);

	const [ showSpecialHourGuide, setShowSpecialHourGuide ] = useState(false);

	useEffect(() => {
		// console.log(busHoursExist, businessHours)
		if (busHoursExist && businessHours) {
			const timeNow = convertToTime(Date.now());
			const timeNowHour = timeNow.hour;
			const timeNowMin = timeNow.min;
			const dayIndex = timeNow.dayIndex;

			// check business is open or closed
			// set the business hours 
			// if there are special hours then or regular business hours
			let busHours = [];
			let busStatus = null;

			if (specialHour) {
				busStatus = specialHour.status;
				busHours = specialHour.hours;
			} else {
				const todayBusHours = getHours(dayIndex);
				busStatus = todayBusHours.status;
				busHours = todayBusHours.hours;
			}

			setCurrentHours(busHours);
			console.log("busHours: ", busHours)

			// when the status is open / true then check the time to finalize the status
			if (busStatus) {
				// check if the business is open or closed based on the current time
				let status = null;
				const checkBusStatus = new Promise ((res, rej) => {
					const busHoursLen = busHours.length;
					let checkStatusIndex = 0;
					for (checkStatusIndex; checkStatusIndex < busHoursLen; checkStatusIndex++) {
						const hour = busHours[checkStatusIndex];
						if (hour.opens.hour < timeNowHour && hour.closes.hour > timeNowHour) {
							res(true);
						}
						else if (hour.opens.hour === timeNowHour) {
							if (hour.opens.min < timeNowMin) {
								res(true);
							}
							else {
								res(false);
							}
						}
						else if (hour.closes.hour === timeNowHour) {
							if (hour.closes.min > timeNowMin) {
								res(true);
							}
							else {
								res(false);
							}
						}
						else {
							res(false);
						}
					}
				});

				checkBusStatus
				.then((result) => {
					status = result;
					setCurrentStatus(status);
				});
			} else {
				setCurrentStatus(false);
			};
		}
	}, [specialHour])

	// with the day index get the hours of the day
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
					<View style={styles.todayBusHoursContainer}>
						<View style={styles.todayStatusContainer}>
							{
								currentStatus
								?
								<Text style={[styles.hourText, { color: color.green1 }]}>Open</Text>
								:
								<Text style={[styles.hourText, { color: color.red1 }]}>Closed</Text>
							}
						</View>
						<VerticalSeperatorLine />
						{ currentHours &&
							<View style={styles.todayHoursContainer}>
								<FlatList 
									data={currentHours}
									renderItem={({item, index}) => {
										return (
											<View style={{ flexDirection: 'row'}}>
												<View style={styles.hourContainer}>
													{
														item.opens &&
														<Text style={styles.hourText}>
															{convertMilitaryToStandard(item.opens.hour, item.opens.min)}
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
															{convertMilitaryToStandard(item.closes.hour, item.closes.min)}
														</Text>
													}
												</View>
											</View>
										)
									}}
									keyExtractor={(item, index) => index.toString()}
								/>
							</View>
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

	if (
		!address && 
		!googleMapUrl && 
		!websiteAddress && 
		!sign && 
		!busHoursExist && 
		!currentHours &&
		!phoneNumber
	) return null

	return (
		<View style={styles.profileCardBottomContainer}>
			{
				phoneNumber &&
				<View style={styles.phoneNumberContainer}>
					<Text 
						style={styles.phoneNumberText}
						onPress={()=>{Linking.openURL(`tel:${phoneNumber}`)}}
					>
						{antdesignPhone(RFValue(13), color.black1)} {phoneNumber}
					</Text>
				</View>
			}
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
							<Text style={styles.locationText}>{featherMapPin(RFValue(13), color.black1)} {address}</Text>
						</View>
					}
				/>
				: locationType === "mobile"
				?
				<View style={styles.locationContainer}>
					<View style={styles.textContainer}>
						<Text style={styles.locationText}>
							{antdesignRocketOne(RFValue(13), color.black1)} Mobile Business
						</Text>
					</View>
				</View>
				: null
			}
			{ 
				websiteAddress &&
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
			}
			{
				sign &&
				<View style={styles.signContainer}>
					<Text style={styles.signText}>
						{sign}
					</Text>
				</View>
			}
			{
				busHoursExist && currentHours &&
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					{
						specialHour &&
						<View style={styles.specialHourIconContainer}>
							<Menu
		            visible={showSpecialHourGuide}
		            onDismiss={() => {
		              setShowSpecialHourGuide(false);
		            }}
		            anchor={
		            	<TouchableOpacity
		            		onPress={() => {
		              		setShowSpecialHourGuide(!showSpecialHourGuide);
		            		}}
		            	>
		              	{featherAlertCircle(RFValue(19), color.red2)}
		              </TouchableOpacity>
		            }>
		            <Menu.Item 
		            	onPress={() => {
		              	setShowSpecialHourGuide(false);
		            	}} 
		            	titleStyle={{ width: '100%' }}
		            	title="Today, There are special hours." 
		            />
		          </Menu>
						</View>
					}
					<ShowBusHoursButton />
				</View>
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
  phoneNumberContainer: {
  	justifyContent: 'center',
  	paddingVertical: RFValue(3),
  },
  phoneNumberText: {
  	fontSize: RFValue(15),
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

  todayBusHoursContainer: {
  	flexDirection: 'row', 
  	paddingVertical: RFValue(3)
  },
  specialHourIconContainer: {
  	paddingHorizontal: RFValue(5),
  	paddingVertical: RFValue(3),
  	alignItems: 'center',
  },
  todayStatusContainer: {
  	paddingRight: RFValue(5)
  },
  todayHoursContainer: {
  	paddingHorizontal: RFValue(5)
  },
  hourContainer: {

  },
  hourText: {
  	fontSize: RFValue(15),
  }
});

export default ProfileCardBottom;
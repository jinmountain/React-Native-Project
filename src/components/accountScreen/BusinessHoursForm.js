import React, { useState, useEffect, useRef } from 'react';
import {
	Animated,
	View,
	Text,
	FlatList,
	Dimensions,
	Pressable,
	StyleSheet
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// hooks
import useConvertTime from '../../hooks/useConvertTime';

// color
import color from '../../color';

const BusinessHoursForm = ({ businessHours, busHoursVisibleSwitch }) => {
	const [ windowHeight, setWindowHeight ] = useState(Dimensions.get("window").height);

	const AnimY = useRef(new Animated.Value(windowHeight/2)).current;

	useEffect(() => {
		Animated.timing(AnimY, {
      toValue: windowHeight/4,
      duration: 500,
      useNativeDriver: false
    }).start();
	}, []);

	const renderBusHourItem = ({ item, index }) => {
		return (
			<View style={{ height: RFValue(30), flexDirection: 'row' }}>
				<View style={styles.hourContainer}>
					<Text style={styles.hourText}>
						{useConvertTime.convertMilitaryToStandard(item.opens.hour, item.opens.min)}
					</Text>
				</View>
				<Text style={{ color: color.white2, fontSize: RFValue(19), fontWeight: 'bold', padding: RFValue(5) }}> 
					to 
				</Text>
				<View style={styles.hourContainer}>
					<Text style={styles.hourText}>
						{useConvertTime.convertMilitaryToStandard(item.closes.hour, item.closes.min)}
					</Text>
				</View>
			</View>
		)
	};

	const DayHours = ({ dayText, hours, status }) => {
		return (
			<View style={{ flexDirection: 'row', paddingVertical: RFValue(1) }}>
				<View style={{width: RFValue(55)}}>
					<Text style={{ color: color.white2, fontSize: RFValue(19), fontWeight: 'bold' }}>
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
						<View style={styles.hourContainer}>
							<Text style={styles.hourText}>CLOSED</Text>
						</View>
					}
				</View>
			</View>
		)
	};

	return (
	  // Business Hours
		<Pressable 
			style={{ 
				position: 'absolute',
				zIndex: 6,
				justifyContent: 'center', 
				alignItems: 'center', 
				width: '100%', 
				height: '100%',
				backgroundColor: 'rgba(0, 0, 0, 0.5)'
			}}
			onPressOut={busHoursVisibleSwitch}
		>
			<Animated.View 
				style={[
					styles.formContainer,
					{
						transform: [{ translateY: AnimY }],
					}
				]}
			>
				<View style={styles.titleContainer}>
					<Text style={{color: color.white2, fontSize: RFValue(19)}}>BUSINESS HOURS</Text>
					<View style={{height: 3, width: '100%', backgroundColor: color.white2}}/>
				</View>
				<DayHours
					dayText={"Mon."}
					hours={businessHours.mon_hours}
					status={businessHours.mon_open}
				/>
				<DayHours
					dayText={"Tues."}
					hours={businessHours.tue_hours}
					status={businessHours.tue_open}
				/>
				<DayHours
					dayText={"Wed."}
					hours={businessHours.wed_hours}
					status={businessHours.wed_open}
				/>
				<DayHours
					dayText={"Thur."}
					hours={businessHours.thu_hours}
					status={businessHours.thu_open}
				/>
				<DayHours
					dayText={"Fri."}
					hours={businessHours.fri_hours}
					status={businessHours.fri_open}
				/>
				<DayHours
					dayText={"Sat."}
					hours={businessHours.sat_hours}
					status={businessHours.sat_open}
				/>
				<DayHours
					dayText={"Sun."}
					hours={businessHours.sun_hours}
					status={businessHours.sun_open}
				/>
			</Animated.View>
		</Pressable>
	)
};

const styles = StyleSheet.create({
	formContainer: {
		backgroundColor: color.red1, 
		borderRadius: RFValue(15),
		paddingHorizontal: RFValue(5),
		paddingVertical: RFValue(10)
	},
	titleContainer: {
		justifyContent: 'center', 
		alignItems: 'center', 
		paddingVertical: RFValue(5),
	},
	hourContainer: {
		width: RFValue(95),
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: color.white2, 
	},
	hourText: { 
		color: color.black1, 
		fontSize: RFValue(19), 
		fontWeight: 'bold' 
	}
});

export default BusinessHoursForm;
import React, { useState, useEffect } from 'react';
import { 
	Text, 
	View, 
	StyleSheet,
	Dimensions,
	TouchableOpacity,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Color
import color from '../../color';

// Designs

// Hooks
import useConvertTime from '../../hooks/useConvertTime';


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const dateBoxWidth = windowWidth/7;

const MonthCalendar = ({ dateNow, datesOnCalendar, setDate, setShowCalendar, setDateMoveFromToday }) => {
	return (
		<View style={styles.dateBoxContainer}>
			{
				datesOnCalendar.map((item, index) => 
		  	(
		  		<View 
		  			key={index} 
		  			style={
		  				item.thisMonth && !item.today
		  				? styles.dateBox
		  				: item.thisMonth && item.today
		  				? [styles.dateBox, { backgroundColor: color.blue1 }]
		  				: [styles.dateBox, { backgroundColor: color.gray1 }]
		  			}
		  		>
						<TouchableOpacity
							onPress={() => {
								const dateNowInMs = useConvertTime.convertToDateInMs(dateNow);
								const dateMove = (dateNowInMs - item.time.timestamp) / (- 24 * 60 * 60 * 1000);
								console.log("dateNowInMs: ", dateNowInMs, "dateMove: ", dateMove);
								setDate(item.time.timestamp);
								setShowCalendar(false);
								setDateMoveFromToday(dateMove);
							}}
						>
							<View>
								<Text>{item.time.date}</Text>
								<Text>{item.time.month}</Text>
								<Text>{item.time.day}</Text>
							</View>
						</TouchableOpacity>
					</View>
		  	))
			}
		</View>
	)
}

const styles = StyleSheet.create({
	dateBoxContainer: {
		flexWrap: 'wrap',
		flexDirection: 'row',
	},
	dateBox: {
		minWidth: dateBoxWidth,
		maxWidth: dateBoxWidth,
		paddingVertical: RFValue(7),
	},
});

export default MonthCalendar;
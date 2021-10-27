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
		<View >
			<View style={styles.weekContainer}>
				<View style={styles.dayContainer}>
					<Text style={styles.dayText}>Sun</Text>
				</View>
				<View style={styles.dayContainer}>
					<Text style={styles.dayText}>Mon</Text>
				</View>
				<View style={styles.dayContainer}>
					<Text style={styles.dayText}>Tue</Text>
				</View>
				<View style={styles.dayContainer}>
					<Text style={styles.dayText}>Wed</Text>
				</View>
				<View style={styles.dayContainer}>
					<Text style={styles.dayText}>Thu</Text>
				</View>
				<View style={styles.dayContainer}>
					<Text style={styles.dayText}>Fri</Text>
				</View>
				<View style={styles.dayContainer}>
					<Text style={styles.dayText}>Sat</Text>
				</View>
			</View>
			<View style={styles.dateBoxContainer}>
				{
					datesOnCalendar.map((item, index) => 
			  	(
			  		<View 
			  			key={index} 
			  			style={
			  				item.past && !item.today
			  				?	[styles.dateBox, { opacity: 0.3 }]
			  				: !item.thisMonth
			  				? [styles.dateBox, { backgroundColor: color.grey1 }]
			  				: item.today && !item.past
			  				? [styles.dateBox, { backgroundColor: color.blue1 }]
			  				: item.today && item.past
			  				? [styles.dateBox, { backgroundColor: color.blue1, opacity: 0.3, color: color.white2 }]
			  				: styles.dateBox
			  				// item.thisMonth && !item.today
			  				// ? styles.dateBox
			  				// : item.thisMonth && item.today
			  				// ? [styles.dateBox, { backgroundColor: color.blue1 }]
			  				// : item.thisMonth && item.today && !item.past
			  				// ?	[styles.dateBox, { backgroundColor: color.red1 }]
			  				// : item.past
			  				// ? [styles.dateBox, { backgroundColor: color.red1 }]
			  				// : [styles.dateBox, { backgroundColor: color.grey1 }]
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
									<Text>{item.past ? 'past' : null}</Text>
								</View>
							</TouchableOpacity>
						</View>
			  	))
				}
			</View>
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

	weekContainer: {
		flexDirection: 'row',
	},
	dayContainer: {
		minWidth: dateBoxWidth,
		maxWidth: dateBoxWidth,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: color.red3,
		paddingVertical: RFValue(7),
	},
	dayText: {
		color: color.white2,
		fontSize: RFValue(17),
	},
});

export default MonthCalendar;
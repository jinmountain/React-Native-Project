import React, { useState, useEffect } from 'react';
import { 
	Text, 
	View, 
	StyleSheet,
	Dimensions,
	TouchableOpacity,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// components
import HeaderBottomLine from '../HeaderBottomLine';

// Color
import color from '../../color';

// Designs

// Hooks
import useConvertTime from '../../hooks/useConvertTime';


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const dateBoxWidth = windowWidth/7;

const MonthCalendar = ({ 
	chosenDate,
	dateNow, 
	datesOnCalendar, 
	setChosenDate, 
	setShowCalendar, 
	setDateMoveFromToday, 
	setCalendarMove,
	canSelectPast
}) => {
	return (
		<View >
			<View style={styles.weekContainer}>
				<View style={styles.dayContainer}>
					<Text style={styles.dayText}>Sun</Text>
				</View>
				<View style={styles.verticalSeperator}>
				</View>
				<View style={styles.dayContainer}>
					<Text style={styles.dayText}>Mon</Text>
				</View>
				<View style={styles.verticalSeperator}>
				</View>
				<View style={styles.dayContainer}>
					<Text style={styles.dayText}>Tue</Text>
				</View>
				<View style={styles.verticalSeperator}>
				</View>
				<View style={styles.dayContainer}>
					<Text style={styles.dayText}>Wed</Text>
				</View>
				<View style={styles.verticalSeperator}>
				</View>
				<View style={styles.dayContainer}>
					<Text style={styles.dayText}>Thu</Text>
				</View>
				<View style={styles.verticalSeperator}>
				</View>
				<View style={styles.dayContainer}>
					<Text style={styles.dayText}>Fri</Text>
				</View>
				<View style={styles.verticalSeperator}>
				</View>
				<View style={styles.dayContainer}>
					<Text style={styles.dayText}>Sat</Text>
				</View>
			</View>
			<HeaderBottomLine />
			<View style={styles.dateBoxContainer}>
				{
					datesOnCalendar.map((item, index) => 
			  	(
			  		<View 
			  			key={index} 
			  			style={
			  				item.past && !item.today
			  				?	[styles.dateBox, { opacity: 0.3 }]
			  				: item.time.timestamp === chosenDate
			  				? [ styles.dateBox, { borderWidth: 1, borderColor: color.red2, borderRadius: RFValue(7) }]
			  				: !item.thisMonth
			  				? [styles.dateBox, { backgroundColor: color.grey1 }]
			  				: item.today && !item.past
			  				? [styles.dateBox, { backgroundColor: color.blue1, borderRadius: RFValue(7) }]
			  				: item.today && item.past
			  				? [styles.dateBox, { backgroundColor: color.blue1, opacity: 0.3, borderRadius: RFValue(7) }]
			  				: styles.dateBox
			  			}
			  		>
			  			{
			  				canSelectPast && item.past
			  				?
			  				<TouchableOpacity
									onPress={() => {
										const dateNowInMs = useConvertTime.convertToDateInMs(dateNow);
										setShowCalendar && setShowCalendar(false);
										if (setDateMoveFromToday) {
											const dateMove = (dateNowInMs - item.time.timestamp) / (- 24 * 60 * 60 * 1000);
											console.log("dateNowInMs: ", dateNowInMs, "dateMove: ", dateMove);
											setDateMoveFromToday(dateMove);
										} 
										setCalendarMove(useConvertTime.getMonthMovesBtwDateNowAndThis(dateNow, item.time.timestamp));
									}}
								>
			  					<View style={styles.dateBoxTextContainer}>
										<Text 
											style={
												item.time.timestamp === chosenDate
												? [styles.dateBoxText, { color: color.red2 }]
												: item.today
												?
												[styles.dateBoxText, { color: color.white2 }]
												:
												styles.dateBoxText
											}
										>
											{item.time.date}
										</Text>
									</View>
			  				</TouchableOpacity>
			  				: !canSelectPast && item.past
			  				?
			  				<View>
			  					<View style={styles.dateBoxTextContainer}>
										<Text 
											style={
												item.today
												?
												[styles.dateBoxText, { color: color.white2 }]
												:
												styles.dateBoxText
											}
										>
											{item.time.date}
										</Text>
									</View>
			  				</View>
			  				:
			  				<TouchableOpacity
									onPress={() => {
										const dateNowInMs = useConvertTime.convertToDateInMs(dateNow);
										const dateMove = (dateNowInMs - item.time.timestamp) / (- 24 * 60 * 60 * 1000);
										console.log("dateNowInMs: ", dateNowInMs, "dateMove: ", dateMove);
										if (chosenDate === item.time.timestamp) {
											setChosenDate(null);
										} else {
											setChosenDate(item.time.timestamp);
										}
										setShowCalendar && setShowCalendar(false);
										if (setDateMoveFromToday) {
											const dateMove = (dateNowInMs - item.time.timestamp) / (- 24 * 60 * 60 * 1000);
											console.log("dateNowInMs: ", dateNowInMs, "dateMove: ", dateMove);
											setDateMoveFromToday(dateMove);
										} 
										setCalendarMove(useConvertTime.getMonthMovesBtwDateNowAndThis(dateNow, item.time.timestamp));
									}}
								>
									<View style={styles.dateBoxTextContainer}>
										<Text 
											style={
												item.time.timestamp === chosenDate
												? [styles.dateBoxText, { color: color.red2 }]
												: item.today
												?
												[styles.dateBoxText, { color: color.white2 }]
												:
												styles.dateBoxText
											}
										>
											{item.time.date}
										</Text>
									</View>
								</TouchableOpacity>
			  			}
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
		paddingVertical: RFValue(7),
	},
	dayText: {
		color: color.black1,
		fontWeight: 'bold',
		fontSize: RFValue(17),
	},

	dateBoxTextContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: RFValue(10)
	},
	dateBoxText: {
		fontSize: RFValue(17),
		fontWeight: 'bold',
		color: color.black1,
	},

	verticalSeperator: { 
		height: '50%', 
		minWidth: 1, 
		maxWidth: 1, 
		backgroundColor: color.black1, 
		alignSelf: 'center' 
	}

});

export default MonthCalendar;
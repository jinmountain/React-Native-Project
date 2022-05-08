import React, { useState, useEffect } from 'react';
import { 
	Text, 
	View, 
	StyleSheet,
	FlatList,
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
import {
	convertToDateInMs,
	getMonthMovesBtwDateNowAndThis,
} from '../../hooks/useConvertTime';
import { useOrientation } from '../../hooks/useOrientation';

const MonthCalendar = ({ 
	dateNow, 
	datesOnCalendar,
	chosenDate,
	setChosenDate, 
	setShowCalendar, 
	setDateMoveFromToday, 
	setCalendarMove,
	canSelectPast
}) => {
	/**
	* orientation responsive width and height
	*/
	const [ windowWidth, setWindowWidth ] = useState(Dimensions.get("window").width);
  const [ windowHeight, setWindowHeight ] = useState(Dimensions.get("window").height);
  const [ dateBoxWidth, setDateBoxWidth ] = useState(Dimensions.get("window").width/7);

  const orientation = useOrientation();

  useEffect(() => {
  	setDateBoxWidth(Dimensions.get("window").width/7);
  	setWindowWidth(Dimensions.get("window").width);
  	setWindowHeight(Dimensions.get("window").height);
  }, [orientation]);

	const [ todayDateInMs, setTodayDateInMs ] = useState(convertToDateInMs(dateNow));

	const renderDateBoxItem = ({ item, index }) => {
		return (
			<View 
				key={index} 
				style={
					item.past && !item.today
					?	[styles.dateBox, { width: dateBoxWidth, height: dateBoxWidth, opacity: 0.3 }]
					: item.time.timestamp === chosenDate
					? [ styles.dateBox, { width: dateBoxWidth, height: dateBoxWidth, borderWidth: 1, borderColor: color.red2, borderRadius: RFValue(7) }]
					: !item.thisMonth
					? [styles.dateBox, { width: dateBoxWidth, height: dateBoxWidth, backgroundColor: color.grey1 }]
					: item.today && !item.past
					? [styles.dateBox, { width: dateBoxWidth, height: dateBoxWidth, backgroundColor: color.blue1, borderRadius: RFValue(7) }]
					: item.today && item.past
					? [styles.dateBox, { width: dateBoxWidth, height: dateBoxWidth, backgroundColor: color.blue1, opacity: 0.3, borderRadius: RFValue(7) }]
					: [styles.dateBox, { width: dateBoxWidth, height: dateBoxWidth }]
				}
			>
				{
					canSelectPast && item.past
					?
					<TouchableOpacity
						onPress={() => {
							setShowCalendar && setShowCalendar(false);
							if (setDateMoveFromToday) {
								const dateMove = (todayDateInMs - item.time.timestamp) / (- 24 * 60 * 60 * 1000);
								setDateMoveFromToday(dateMove);
							} 
							setCalendarMove(getMonthMovesBtwDateNowAndThis(dateNow, item.time.timestamp));
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
							{
								item.time.timestamp === todayDateInMs
								? <Text style={styles.todayText}>Today</Text>
								: null
							}
						</View>
					</TouchableOpacity>
					: !canSelectPast && item.past
					?
					<View>
						<View style={styles.dateBoxTextContainer}>
							<Text 
								style={
									item.time.timestamp === chosenDate
									? 
									[styles.dateBoxText, { color: color.red2 }]
									:
									item.today
									?
									[styles.dateBoxText, { color: color.white2 }]
									:
									styles.dateBoxText
								}
							>
								{item.time.date}
							</Text>
							{
								item.time.timestamp === todayDateInMs
								? <Text style={styles.todayText}>Today</Text>
								: null
							}
						</View>
					</View>
					:
					<TouchableOpacity
						onPress={() => {
							const dateMove = (todayDateInMs - item.time.timestamp) / (- 24 * 60 * 60 * 1000);
							if (chosenDate === item.time.timestamp) {
								setChosenDate(null);
							} else {
								setChosenDate(item.time.timestamp);
							}
							setShowCalendar && setShowCalendar(false);
							if (setDateMoveFromToday) {
								const dateMove = (todayDateInMs - item.time.timestamp) / (- 24 * 60 * 60 * 1000);
								setDateMoveFromToday(dateMove);
							} 
							setCalendarMove(getMonthMovesBtwDateNowAndThis(dateNow, item.time.timestamp));
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
							{
								item.time.timestamp === todayDateInMs
								? <Text style={styles.todayText}>Today</Text>
								: null
							}
						</View>
					</TouchableOpacity>
				}
			</View>
		)
	}

	return (
		<View>
			<View style={styles.weekContainer}>
				<View style={[styles.dayContainer, { width: dateBoxWidth }]}>
					<Text style={styles.dayText}>Sun</Text>
				</View>
				<View style={styles.verticalSeperator}>
				</View>
				<View style={[styles.dayContainer, { width: dateBoxWidth }]}>
					<Text style={styles.dayText}>Mon</Text>
				</View>
				<View style={styles.verticalSeperator}>
				</View>
				<View style={[styles.dayContainer, { width: dateBoxWidth }]}>
					<Text style={styles.dayText}>Tue</Text>
				</View>
				<View style={styles.verticalSeperator}>
				</View>
				<View style={[styles.dayContainer, { width: dateBoxWidth }]}>
					<Text style={styles.dayText}>Wed</Text>
				</View>
				<View style={styles.verticalSeperator}>
				</View>
				<View style={[styles.dayContainer, { width: dateBoxWidth }]}>
					<Text style={styles.dayText}>Thu</Text>
				</View>
				<View style={styles.verticalSeperator}>
				</View>
				<View style={[styles.dayContainer, { width: dateBoxWidth }]}>
					<Text style={styles.dayText}>Fri</Text>
				</View>
				<View style={styles.verticalSeperator}>
				</View>
				<View style={[styles.dayContainer, { width: dateBoxWidth }]}>
					<Text style={styles.dayText}>Sat</Text>
				</View>
			</View>
			<HeaderBottomLine />
			<View>
				<FlatList
					data={datesOnCalendar}
					scrollToOverflowEnabled={true}
					contentContainerStyle={{ paddingBottom: 150 }}
					scrollEventThrottle={16}
	        renderItem={renderDateBoxItem}
	        showsVerticalScrollIndicator={false}
					numColumns={7}
					keyExtractor={(item, index) => index.toString()}
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	dateBoxContainer: {
		flexDirection: 'row',
	},
	dateBox: {
		backgroundColor: color.white2,
		justifyContent: 'center',
		alignItems: 'center'
	},

	weekContainer: {
		flexDirection: 'row',
	},
	dayContainer: {
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
		fontSize: RFValue(15),
		fontWeight: 'bold',
		color: color.black1,
	},

	verticalSeperator: { 
		height: '50%', 
		minWidth: 1, 
		maxWidth: 1, 
		backgroundColor: color.black1, 
		alignSelf: 'center' 
	},

	todayText: {
		color: color.black1,
		fontSize: RFValue(9)
	},

});

export default MonthCalendar;
import React, { useState } from 'react';
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

const DateBox = ({
	box,
	index,
	dateNow,
	chosenDate,
	setChosenDate, 
	setShowCalendar, 
	setDateMoveFromToday, 
	setCalendarMove,
	canSelectPast,
	todayDateInMs
}) => {
	console.log(box);
	return (
		<View 
			key={index} 
			style={
				box.past && !box.today
				?	[styles.dateBox, { opacity: 0.3 }]
				: box.time.timestamp === chosenDate
				? [ styles.dateBox, { borderWidth: 1, borderColor: color.red2, borderRadius: RFValue(7) }]
				: !box.thisMonth
				? [styles.dateBox, { backgroundColor: color.grey1 }]
				: box.today && !box.past
				? [styles.dateBox, { backgroundColor: color.blue1, borderRadius: RFValue(7) }]
				: box.today && box.past
				? [styles.dateBox, { backgroundColor: color.blue1, opacity: 0.3, borderRadius: RFValue(7) }]
				: styles.dateBox
			}
		>
			{
				canSelectPast && box.past
				?
				<TouchableOpacity
					onPress={() => {
						setShowCalendar && setShowCalendar(false);
						if (setDateMoveFromToday) {
							const dateMove = (todayDateInMs - box.time.timestamp) / (- 24 * 60 * 60 * 1000);
							setDateMoveFromToday(dateMove);
						} 
						setCalendarMove(useConvertTime.getMonthMovesBtwDateNowAndThis(dateNow, box.time.timestamp));
					}}
				>
					<View style={styles.dateBoxTextContainer}>
						<Text 
							style={
								box.time.timestamp === chosenDate
								? [styles.dateBoxText, { color: color.red2 }]
								: box.today
								?
								[styles.dateBoxText, { color: color.white2 }]
								:
								styles.dateBoxText
							}
						>
							{box.time.date}
						</Text>
						{
							box.time.timestamp === todayDateInMs
							? <Text style={styles.todayText}>Today</Text>
							: null
						}
					</View>
				</TouchableOpacity>
				: !canSelectPast && box.past
				?
				<View>
					<View style={styles.dateBoxTextContainer}>
						<Text 
							style={
								box.time.timestamp === chosenDate
								? 
								[styles.dateBoxText, { color: color.red2 }]
								:
								box.today
								?
								[styles.dateBoxText, { color: color.white2 }]
								:
								styles.dateBoxText
							}
						>
							{box.time.date}
						</Text>
						{
							box.time.timestamp === todayDateInMs
							? <Text style={styles.todayText}>Today</Text>
							: null
						}
					</View>
				</View>
				:
				<TouchableOpacity
					onPress={() => {
						const dateMove = (todayDateInMs - box.time.timestamp) / (- 24 * 60 * 60 * 1000);
						if (chosenDate === box.time.timestamp) {
							setChosenDate(null);
						} else {
							setChosenDate(box.time.timestamp);
						}
						setShowCalendar && setShowCalendar(false);
						if (setDateMoveFromToday) {
							const dateMove = (todayDateInMs - box.time.timestamp) / (- 24 * 60 * 60 * 1000);
							setDateMoveFromToday(dateMove);
						} 
						setCalendarMove(useConvertTime.getMonthMovesBtwDateNowAndThis(dateNow, box.time.timestamp));
					}}
				>
					<View style={styles.dateBoxTextContainer}>
						<Text 
							style={
								box.time.timestamp === chosenDate
								? [styles.dateBoxText, { color: color.red2 }]
								: box.today
								?
								[styles.dateBoxText, { color: color.white2 }]
								:
								styles.dateBoxText
							}
						>
							{box.time.date}
						</Text>
						{
							box.time.timestamp === todayDateInMs
							? <Text style={styles.todayText}>Today</Text>
							: null
						}
					</View>
				</TouchableOpacity>
			}
		</View>

	)
}

const DateRow = ({
	key,
	datesOnRow,
	dateNow,
	chosenDate,
	setChosenDate, 
	setShowCalendar, 
	setDateMoveFromToday, 
	setCalendarMove,
	canSelectPast,
	todayDateInMs
}) => {
	return (
		<View style={styles.dateBoxContainer} key={key}>
			{
				datesOnRow.map((box, index) => (
					<DateBox 
						box={box}
						index={index}
						dateNow={dateNow}
						chosenDate={chosenDate}
						setChosenDate={setChosenDate}
						setShowCalendar={setShowCalendar}
						setDateMoveFromToday={setDateMoveFromToday}
						setCalendarMove={setCalendarMove}
						canSelectPast={canSelectPast}
						todayDateInMs={todayDateInMs}
					/>
				))
			}
		</View>
	)
};

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
	const [ todayDateInMs, setTodayDateInMs ] = useState(useConvertTime.convertToDateInMs(dateNow));
	return (
		<View>
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
			<View>
				{
					datesOnCalendar.map((row, index) => 
			  	(
			  		<DateRow
							key={index}
							datesOnRow={row}
							dateNow={dateNow}
							chosenDate={chosenDate}
							setChosenDate={setChosenDate}
							setShowCalendar={setShowCalendar}
							setDateMoveFromToday={setDateMoveFromToday}
							setCalendarMove={setCalendarMove}
							canSelectPast={canSelectPast}
							todayDateInMs={todayDateInMs}
						/>
			  	))
				}
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
	},

	todayText: {
		color: color.black1,
		fontSize: RFValue(9)
	},

});

export default MonthCalendar;
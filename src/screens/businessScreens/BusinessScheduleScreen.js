import React, { useRef, useState, useEffect, useContext, useCallback } from 'react';
import { 
	Text, 
	View, 
	ScrollView,
	RefreshControl,
	StyleSheet, 
	TouchableOpacity,
	TouchableHighlight,
	FlatList,
	Dimensions,
	Image,
	Animated,
	Vibration
} from 'react-native';

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Designs
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

// Contexts
import { Context as AuthContext } from '../../context/AuthContext';

// Hooks
import { kOrNo } from '../../hooks/kOrNo';
import getRandomColor from '../../hooks/getRandomColor';
import useConvertTime from '../../hooks/useConvertTime';
import { getCalendarDates } from '../../hooks/getCalendarDates';
// Firebase
import businessGetFire from '../../firebase/businessGetFire';
import businessPostFire from '../../firebase/businessPostFire';
import contentGetFire from '../../firebase/contentGetFire';

// Components
import AlertBoxTop from '../../components/AlertBoxTop'; 
import DefaultUserPhoto from '../../components/defaults/DefaultUserPhoto';
import MainTemplate from '../../components/MainTemplate';
import { HeaderForm } from '../../components/HeaderForm';
import LoadingAlert from '../../components/LoadingAlert';
import HeaderBottomLine from '../../components/HeaderBottomLine';
// Display Post
import DisplayPostImage from '../../components/displayPost/DisplayPostImage';
import DisplayPostInfo from '../../components/displayPost/DisplayPostInfo';
import DisplayPostLoading from '../../components/displayPost/DisplayPostLoading';
// Calendar
import MonthCalendar from '../../components/businessSchedule/MonthCalendar';
// Default
import DisplayPostsDefault from '../../components/defaults/DisplayPostsDefault';

// Color
import color from '../../color';

const windowWidth = Dimensions.get("window").width;
// const pressedLabelWidth = windowWidth * 0.77;
const pressedLabelWidth = 0;
const stretchedLabelWidth = windowWidth;
const windowHeight = Dimensions.get("window").height;
const techBoxWidth = windowWidth/3;

// animation
import { useCardAnimation } from '@react-navigation/stack';

// return the startTime and the endTime and available hours based on all the four arguments on rsvDate
const getAvailableHours = (busBusinessHours, techBusinessHours, busSpecialHours, techSpecialHours) => {
	// compare bus and tech and find intersection
	// cases
	// 1. tech.startTime | bus.startTime  | tech.endTime | bus.endTime  => change available hours's endTime
	// 2. bus.startTime  | tech.startTime | tech.endTime | bus.endTime  => change available hours's start and end time
	// 3. bus.startTime  | tech.startTime | bus.endTime  | tech.endTime => change available hours's startTime
	
	// choice 4 would not happen if I make tech only choose their business hours only in range of business's business hours
	// 4. tech.startTime | bus.startTime  | bus.endTime  | tech.endTime

	// assign business business hours as the default hours
	// but if business special hours exist it will be the default hours
	let defaultHours;
	let availableHours = [];
	
	const busHours = busSpecialHours ? busSpecialHours.hours : busBusinessHours.hours;
	console.log("busHours: ", busHours);

	// assign technician business hours as the default hours
	// but if technician special hours exist it will be the default hours
	const techHours = techSpecialHours ? techSpecialHours.hours : techBusinessHours.hours;
	console.log("techHours: ", techHours)

	let busHoursIndex = 0;
	const busHoursLen = busHours.length;

	for (busHoursIndex; busHoursIndex < busHoursLen; busHoursIndex++) {

		let techHoursIndex = 0;
		const techHoursLen = techHours.length;
		console.log("LEN: ", busHoursLen, techHoursLen);
		for (techHoursIndex; techHoursIndex < techHoursLen; techHoursIndex++) {
			const busHoursOpens = busHours[busHoursIndex].opens;
			const busHoursCloses = busHours[busHoursIndex].closes;
			const busHoursOpensNumber = useConvertTime.convertHourMinToNumber(busHours[busHoursIndex].opens.hour, busHours[busHoursIndex].opens.min);
			const busHoursClosesNumber = useConvertTime.convertHourMinToNumber(busHours[busHoursIndex].closes.hour, busHours[busHoursIndex].closes.min);
			const techHoursOpens = techHours[techHoursIndex].opens;
			const techHoursCloses = techHours[techHoursIndex].closes;
			const techHoursOpensNumber = useConvertTime.convertHourMinToNumber(techHours[techHoursIndex].opens.hour, techHours[techHoursIndex].opens.min);
			const techHoursClosesNumber = useConvertTime.convertHourMinToNumber(techHours[techHoursIndex].closes.hour, techHours[techHoursIndex].closes.min);

			// 1. tech.startTime | bus.startTime | tech.endTime | bus.endTime
			console.log("COMPARE: ", busHoursOpensNumber, busHoursClosesNumber, techHoursOpensNumber, techHoursClosesNumber)
			if (
				techHoursOpensNumber <= busHoursOpensNumber && 
				busHoursOpensNumber < techHoursClosesNumber && 
				techHoursClosesNumber < busHoursClosesNumber
			) {
				availableHours.push({opens: busHoursOpens, closes: techHoursCloses});
				console.log(1);
			}
			// 2. bus.startTime | tech.startTime | tech.endTime | bus.endTime => change a's start and end time
			else if (
				busHoursOpensNumber <= techHoursOpensNumber && 
				techHoursClosesNumber <= busHoursClosesNumber
			) {
				availableHours.push({opens: techHoursOpens, closes: techHoursCloses});
				console.log(2);
			}
			// 3. bus.startTime | tech.startTime | bus.endTime | tech.endTime => change a's startTime
			else if (
				busHoursOpensNumber < techHoursOpensNumber && 
				busHoursClosesNumber <= techHoursClosesNumber &&
				busHoursOpensNumber < techHoursOpensNumber
			) {
				availableHours.push({opens: techHoursCloses, closes: busHoursCloses});
				console.log(3);
			}
			// 4. tech.startTime | bus.startTime | bus.endTime | tech.endTime
			else if (
				techHoursOpensNumber <= busHoursOpensNumber &&
				busHoursClosesNumber <= techHoursClosesNumber
			) {
				availableHours.push({opens: busHoursOpens, closes: busHoursCloses});
				console.log(4);
			}
			else {
				continue
			}
		};
	};

	// let availableHoursIndex = 0;
	// const availableHoursLen = availableHours.length;
	// for (availableHoursIndex; availableHoursIndex < availableHoursLen; availableHoursIndex++) {
	// 	if (startTime) {
	// 		if (startTime > useConvertTime.convertHourMinToNumber(availableHours[availableHoursIndex].opens.hour, availableHours[availableHoursIndex].opens.min)) {
	// 			startTime = availableHours[availableHoursIndex].opens;
	// 		}
	// 	} else {
	// 		startTime = availableHours[availableHoursIndex].opens;
	// 	}

	// 	if (endTime) {
	// 		if (endTime < useConvertTime.convertHourMinToNumber(availableHours[availableHoursIndex].closes.hour, availableHours[availableHoursIndex].closes.min)) {
	// 			endTime = availableHours[availableHoursIndex].closes
	// 		}
	// 	} else {
	// 		endTime = availableHours[availableHoursIndex].closes
	// 	}
	// };

	// return {
	// 	// startTime: startTime,
	// 	// endTime: endTime,
	// 	availableHours: availableHours
	// }
	return availableHours;
};

const convertEtcToHourMin = (etc) => {
	if (etc >= 60) {
		const hour = Math.floor(etc/60)
		const min = ((etc/60) - hour) * 60
		if (min == 0) {
			return hour + ' hour'
		} else {
			return hour + ' hour ' + min + ' min'
		}
	} else {
		return etc + ' min'
	}
}

const BusinessScheduleScreen = ({ route, navigation }) => {
	const vibrationTime = 30;

	const { businessUser } = route.params;
	const [ dateNow, setDateNow ] = useState(Date.now());

	// business and special hours
	const [ busBusinessHours, setBusBusinessHours ] = useState(null);
	const [ techBusinessHours, setTechBusinessHours ] = useState(null);
	const [ busSpecialHours, setBusSpecialHours ] = useState(null);
	const [ techSpecialHours, setTechSpecialHours ] = useState(null);

	// date
	const [ rsvDate, setRsvDate ] = useState( useConvertTime.convertToDateInMs( Date.now() ));
	const [ dateMoveFromToday, setDateMoveFromToday ] = useState(0);
	// calendar 
	const [ calendarDate, setCalendarDate ] = useState(useConvertTime.convertToMonthInMs(Date.now()));
	const [ calendarMove, setCalendarMove ] = useState(0);

	// screen controls
	const [ screenReady, setScreenReady ] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
  const [ alertBoxStatus, setAlertBoxStatus ] = useState(false);
  const [ alertBoxText, setAlertBoxText ] = useState(null);

	// business info
	// const [ startTime, setStartTime ] = useState(8);
	// const [ endTime, setEndTime ] = useState(17);
	const [ rsvTimeLimit, setRsvTimeLimit ] = useState(60*60*1000); // default 1 hour

	// picked display post state
	const [ pickedDisplayPost, setPickedDisplayPost ] = useState(null);

	// techs state
	const [ displayPostTechs, setDisplayPostTechs ] = useState([]);
	const [ displayPostTechsState, setDisplayPostTechsState ] = useState(false);

	// schedule chart state
	const [ chartGridsState, setChartGridsState ] = useState(false);
	const [ chartGrids, setChartGrids ] = useState([[]]);
	const [ gridExist, setGridExist ] = useState(false);

	// User pick states
	// selected tech 
	const [ selectedTech, setSelectedTech ] = useState(null);
	// display post
	const [ userAccountDisplayPosts, setUserAccountDisplayPosts ] = useState([]);
	const [ userAccountDisplayPostLast, setUserAccountDisplayPostLast ] = useState(null);
	const [ userAccountDisplayPostFetchSwitch, setUserAccountDisplayPostFetchSwtich ] = useState(true);
	const [ userAccountDisplayPostState, setUserAccountDisplayPostState ] = useState(false);

	// animation
	const { current } = useCardAnimation();

	const firstLabelWidthAnim = useRef(new Animated.Value(pressedLabelWidth)).current;
	const firstLabelHeightAnim = useRef(new Animated.Value(0)).current;
	const firstLabelBorderRadiusAnim = useRef(new Animated.Value(RFValue(100))).current;

	const secondLabelWidthAnim = useRef(new Animated.Value(pressedLabelWidth)).current;
	const secondLabelHeightAnim = useRef(new Animated.Value(0)).current;
	const secondLabelBorderRadiusAnim = useRef(new Animated.Value(RFValue(100))).current;

	const thirdLabelWidthAnim = useRef(new Animated.Value(pressedLabelWidth)).current;
	const thirdLabelHeightAnim = useRef(new Animated.Value(0)).current;
	const thirdLabelBorderRadiusAnim = useRef(new Animated.Value(RFValue(100))).current;

	const stretchLabelWidth = (widthAnim) => {
		return new Promise((res, rej) => {
	    Animated.timing(widthAnim, {
	      toValue: stretchedLabelWidth,
	      duration: 300,
	      useNativeDriver: false
	    }).start();
	    res(true);
		});
  };

  const stretchLabelHeight = (heightAnim) => {
		return new Promise((res, rej) => {
	    Animated.timing(heightAnim, {
	      toValue: RFValue(70),
	      duration: 300,
	      useNativeDriver: false
	    }).start();
	    res(true);
		});
  };

  const pressLabelWidth = (widthAnim) => {
		return new Promise((res, rej) => {
	    Animated.timing(widthAnim, {
	      toValue: pressedLabelWidth,
	      duration: 300,
	      useNativeDriver: false
	    }).start();
	    res(true);
		});
  };

  const pressLabelHeight = (heightAnim) => {
		return new Promise((res, rej) => {
	    Animated.timing(heightAnim, {
	      toValue: 0,
	      duration: 300,
	      useNativeDriver: false
	    }).start();
	    res(true);
		});
  };

  const unfoldLabelBorder = (radiusAnim) => {
		return new Promise((res, rej) => {
	    Animated.timing(radiusAnim, {
	      toValue: 0,
	      duration: 300,
	      useNativeDriver: false
	    }).start();
	    res(true);
		});
  };

  const foldLabelBorder = (radiusAnim) => {
  	return new Promise((res, rej) => {
	    Animated.timing(radiusAnim, {
	      toValue: 100,
	      duration: 300,
	      useNativeDriver: false
	    }).start();
	    res(true);
		});
  };

	const onRefresh = useCallback(() => {
  	let mounted = true;
    setRefreshing(true);

    const clearState = new Promise((res, rej) => {
    	// thing to reset
    	// 1. display posts
    	// 2. schedule and calendar
    	// 3. picked display post and technician
    	// 4. grids

    	setScreenReady(false);

    	setUserAccountDisplayPosts([]);
			setUserAccountDisplayPostLast(null);
			setUserAccountDisplayPostFetchSwtich(true);
			setUserAccountDisplayPostState(false);

			setRsvDate(useConvertTime.convertToDateInMs( Date.now() ));
			setDateMoveFromToday(0);
			setCalendarDate(useConvertTime.convertToMonthInMs(Date.now() ));
			setCalendarMove(0);

			setPickedDisplayPost(null);
			setDisplayPostTechs([]);
			setDisplayPostTechsState(false);
			setSelectedTech(null);

			setChartGridsState(false);
			setChartGrids([]);
			setGridExist(false);

			showCalendar(false);

			res(true);
    });

    clearState
    .then(() => {
    	const getScreenReady = new Promise ((res, rej) => {
				if (userAccountDisplayPostFetchSwitch && !userAccountDisplayPostState && mounted) {
					mounted && setUserAccountDisplayPostState(true);
					const getDisplayPosts = contentGetFire.getBusinessDisplayPostsFire(userAccountDisplayPostLast, businessUser, user.id);
					getDisplayPosts
					.then((posts) => {
						mounted && setUserAccountDisplayPosts([ ...userAccountDisplayPosts, ...posts.fetchedPosts ]);
						if (posts.lastPost !== undefined) {
							mounted && setUserAccountDisplayPostLast(posts.lastPost);
						} else {
							mounted && setUserAccountDisplayPostFetchSwtich(false);
						};
						mounted && setUserAccountDisplayPostState(false);
					})
				}
				res(true);
			});

			getScreenReady
			.then(() => {
				setScreenReady(true);
				setRefreshing(false);
			})
			.catch((error) => {
				console.log(error);
			});
    });

    return () => {
    	mounted = false;
    }
  }, []);

	// Contexts
	const { state: { user } } = useContext(AuthContext);

	useEffect(() => {
		return () => {
			setRefreshing(false);

			setUserAccountDisplayPosts([]);
			setUserAccountDisplayPostLast(null);
			setUserAccountDisplayPostFetchSwtich(true);
			setUserAccountDisplayPostState(false);

			setRsvDate(useConvertTime.convertToDateInMs( Date.now() ));
			setDateMoveFromToday(0);
			setCalendarDate(useConvertTime.convertToMonthInMs(Date.now() ));
			setCalendarMove(0);

			setPickedDisplayPost(null);
			setDisplayPostTechs([]);
			setDisplayPostTechsState(false);
			setSelectedTech(null);

			setChartGridsState(false);
			setChartGrids([[]]);
			setGridExist(false);
		}
	}, []);

	const [ datesOnCalendar, setDatesOnCalendar ] = useState([]);
	const [ showCalendar, setShowCalendar ] = useState(false);

	// Get display posts
	useEffect(() => {
		let mounted = true
		const getScreenReady = new Promise ((res, rej) => {
			if (userAccountDisplayPostFetchSwitch && !userAccountDisplayPostState && mounted) {
				mounted && setUserAccountDisplayPostState(true);
				const getDisplayPosts = contentGetFire.getBusinessDisplayPostsFire(userAccountDisplayPostLast, businessUser, user.id);
				getDisplayPosts
				.then((posts) => {
					mounted && setUserAccountDisplayPosts([ ...userAccountDisplayPosts, ...posts.fetchedPosts ]);
					if (posts.lastPost !== undefined) {
						mounted && setUserAccountDisplayPostLast(posts.lastPost);
					} else {
						mounted && setUserAccountDisplayPostFetchSwtich(false);
					};
					mounted && setUserAccountDisplayPostState(false);
				})
			}
			res(true);
		});

		getScreenReady
		.then(() => {
			setScreenReady(true);
		})
		.catch((error) => {
			console.log(error);
		});

		return () => {
			mounted = false;
			setUserAccountDisplayPosts([]);
			setUserAccountDisplayPostLast(null);
			setUserAccountDisplayPostFetchSwtich(true);
			setUserAccountDisplayPostState(false);

			setShowCalendar(false);
		}
	}, [businessUser]);

	// Calculate 
	// - Calander Dates 
	// - Dates Left In The Month  
	// - Dates of The Following Month in The Last Week of The Month
	getCalendarDates(calendarDate, dateNow, 17, setDatesOnCalendar);

	// get business and technician business and special hours
	// make schedule grids according to existing reservations, business, and special hours
	useEffect(() => {
		let mounted = true;
		if (pickedDisplayPost && selectedTech) {
    	// clear the schedule grids, set chardGridsState to true, set gridExist to false
    	setChartGridsState(true);
	  	setChartGrids([[]]);
	  	setGridExist(false);

	  	// get business hours if there are not business and technician's business hours
	  	// then don't make available grids
  		const getScheduleBusinessSpecialHours = businessGetFire.getScheduleBusinessSpecialHours(businessUser.id, selectedTech.id, rsvDate); 
    	getScheduleBusinessSpecialHours
    	.then((result) => {
    		if (user.business_hours && result.techBusinessHours) {
	    		// at this point we have business and special hours of the businsess and the technician
	    		// get the business hours of rsvDate for business and technician
	    		// - the day index of rsvDate
	    		const dayIndexOfRsvDate = useConvertTime.getDayIndexFromTimestamp(rsvDate); 
	    		// - use the day Index to get the business hours of business and technician
	    		// if dayIndexOfRsvDate is 0 then sun
	    		// - function to get the right attribute based on the day index
	    		const getBusinessHoursOnDayIndex = (dayIndex, businessHours) => {
	    			if (dayIndex === 0) {
	    				return { open: businessHours.sun_open, hours: businessHours.sun_hours }
	    			}
	    			if (dayIndex === 1) {
	    				return { open: businessHours.mon_open, hours: businessHours.mon_hours }
	    			}
	    			if (dayIndex === 2) {
	    				return { open: businessHours.tue_open, hours: businessHours.tue_hours }
	    			}
	    			if (dayIndex === 3) {
	    				return { open: businessHours.wed_open, hours: businessHours.wed_hours }
	    			}
	    			if (dayIndex === 4) {
	    				return { open: businessHours.thu_open, hours: businessHours.thu_hours }
	    			}
	    			if (dayIndex === 5) {
	    				return { open: businessHours.fri_open, hours: businessHours.fri_hours }
	    			}
	    			if (dayIndex === 6) {
	    				return { open: businessHours.sat_open, hours: businessHours.sat_hours }
	    			}
	    		};
	    		// business hours of rsvDate for business and technician
	    		const rsvDateBusBusinessHours = getBusinessHoursOnDayIndex(dayIndexOfRsvDate, user.business_hours);
	    		const rsvDateTechBusinessHours = getBusinessHoursOnDayIndex(dayIndexOfRsvDate, result.techBusinessHours);
	    		const rsvDateBusSpecialHours = result.busSpecialHours;
	    		const rsvDateTechSpecialHours = result.techSpecialHours;

	    		setBusBusinessHours(rsvDateBusBusinessHours);
	    		setTechBusinessHours(rsvDateTechBusinessHours);
	    		setBusSpecialHours(rsvDateBusSpecialHours);
	    		setTechSpecialHours(rsvDateTechSpecialHours);

	    		const availableHours = getAvailableHours(
						rsvDateBusBusinessHours,
						rsvDateTechBusinessHours,
						rsvDateBusSpecialHours,
						rsvDateTechSpecialHours
					);
	    		console.log("available hours: ", availableHours);
	    		// added...
	    		// another filter below to skip adding a grid 
	    		// if the grid is not in business and technician's business and special hours

	    		const getRsvsStartAtOfTech = businessGetFire.getRsvTimestampsOfTech(businessUser.id, selectedTech.id, rsvDate);
			  	getRsvsStartAtOfTech
			  	.then((rsvTimestamps) => {
			  		let grids = [[]];
			  		let gridRow = 0; // each row has each hour
			  		let gridHour = 0; // when business begins, the earliest hour of business by flooring it down

		    		const availableHoursLen = availableHours.length;
		    		let availableHoursIndex = 0;
		    		// use the available hours and get startTime and end time to get number of grids (numOfGrids)
		    		for (availableHoursIndex; availableHoursIndex < availableHoursLen; availableHoursIndex++) {
		    			const opensHour = availableHours[availableHoursIndex].opens.hour
		    			const opensMin = availableHours[availableHoursIndex].opens.min
		    			const closesHour = availableHours[availableHoursIndex].closes.hour
		    			const closesMin = availableHours[availableHoursIndex].closes.min
		    			const startTime = useConvertTime.convertHourMinToNumber(opensHour, opensMin);
		    			const endTime = useConvertTime.convertHourMinToNumber(closesHour, closesMin);

		    			console.log("opensHour:", opensHour, "opensMin: ", opensMin);
		    			console.log("startTime: ", startTime, "endTime: ", endTime);
		    			if (gridHour === 0) {
		    				gridHour = opensHour;
		    			}

		    			const rsvDateTimestamp = useConvertTime.convertToDateInMs(rsvDate);
							var startTimeTimestamp = rsvDateTimestamp + (startTime * 60 * 60 *1000) // convert hours to milisecs
							const displayPostEtc = pickedDisplayPost.data.etc;

							let numOfGrids;
							numOfGrids = (endTime - startTime) * 60 / 5;

							let gridIndex = 0;

							for (gridIndex; gridIndex < numOfGrids; gridIndex++) {
								// const floorStartTime = Math.floor(startTime);
								var gridTimestamp = startTimeTimestamp + (gridIndex * 5 * 60 *1000); // + 5mins
								if (gridIndex === 0) {
									console.log(useConvertTime.convertToNormHourMin(startTimeTimestamp), useConvertTime.convertToNormHourMin(gridTimestamp));
								}
								var gridEndTimestamp = gridTimestamp + (displayPostEtc - 5) * 60 * 1000;
								// displayPostEtc - 5 because it is grid like 1:05 - 1:10

								var gridStartTime = useConvertTime.convertToTime(gridTimestamp);

								// last timestamp of grid available is rsvDateTimestamp + endTime in MS - the picked post's etc in MS
								const lastTimestamp = rsvDateTimestamp + (endTime * 60 * 60 * 1000) - (pickedDisplayPost.data.etc * 60 * 1000)

								// conditions that exclude grid timestamp
								const conflictingGrids = rsvTimestamps.filter(rsv => rsv < gridEndTimestamp && rsv > gridTimestamp)
								// - there is a existing rsv collapsing the new rsv

								// check the following conditions:
								// - existing reservations include a grid timestamp OR 
								// - post's estimated timestamp are in the unavailable timestamps OR 
								// - a design can be finished before the business closes
								if (
									rsvTimestamps.includes(gridTimestamp) ||
									rsvTimestamps.includes(gridEndTimestamp) ||
									gridTimestamp > lastTimestamp
								) {
									continue;
								} 
								// - there is a existing rsv btw the start and the end of new rsv
								else if (conflictingGrids.length > 0) {
									continue;
								}
								else {
									if ( gridStartTime.hour > gridHour ) {
										gridHour = gridStartTime.hour;
										gridRow += 1;
										grids[gridRow] = [];
									};
									// help showing only grids that are bigger than dateNow plus rsvTimeLimit
									if (gridStartTime.timestamp > (dateNow + rsvTimeLimit)) {
										grids[gridRow].push({ gridTimestamp: gridTimestamp, gridStartTime: gridStartTime });
										mounted && setGridExist(true);
									};
								}
						  };
		    		}
		    		mounted && setChartGridsState(false);
					  mounted && setChartGrids(grids);
			  	})
			  	.catch((error) => {
			  		console.log("BusinessScheduleScreen: getRsvsStartAtOfTech: ", error);
			  	});
			  }
    	})
    	.catch((error) => {
    		console.log(error);
    	});
		}
	}, [selectedTech, rsvDate]);

	return (
		<View style={styles.mainContainer}>
			{ displayPostTechsState || userAccountDisplayPostState || chartGridsState
        ? <LoadingAlert />
        : null
      }
			<HeaderForm 
				paddingTopCustomStyle={{ backgroundColor: color.red2 }}
				addPaddingTop={true}
        leftButtonTitle={null}
        leftButtonIcon={<Ionicons name="md-arrow-back" size={RFValue(27)} color={color.white2} />}
        headerTitle={'Scheduler'} 
        rightButtonTitle={null} 
        leftButtonPress={() => {
          navigation.goBack();
        }}
        rightButtonPress={() => {
       		null
       	}}
       	headerCustomStyle={{ backgroundColor: color.red2 }}
       	middleTitleTextCustomStyle={{ color: color.white2 }}
       	customUnderlayColor={color.red1}
      />
			<ScrollView 
				style={styles.scheduleContainer}
				stickyHeaderIndices={[5]}
				refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
			>
				<View style={styles.labelContainer}>
					<View style={styles.labelInnerContainer}>
						{/*<View style={styles.labelIcon}>
							<MaterialCommunityIcons name="numeric-1-circle-outline" size={RFValue(17)} color="black" />
						</View>*/}
						<Animated.View style={[
							styles.labelTextContainer,
							{
								// width: `${firstLabelWidthAnim}%`,
								minWidth: firstLabelWidthAnim,
								minHeight: firstLabelHeightAnim,
								borderRadius: firstLabelBorderRadiusAnim
							},
							{ backgroundColor: color.red2 }
						]}>
							<Text style={styles.labelText}>Pick a Design</Text>
						</Animated.View>
					</View>
				</View>
				<View>
					{ 
						// show display posts if the other user is business and displayPostsShown is true
						screenReady && userAccountDisplayPosts.length > 0 
						?
						<View style={styles.displayPostsContainer}>
							<FlatList
								onEndReached={() => {
									let mounted = true;
									if (mounted && screenReady && userAccountDisplayPostFetchSwitch && !userAccountDisplayPostState) {
										mounted && setUserAccountDisplayPostState(true);
										const getDisplayPosts = contentGetFire.getBusinessDisplayPostsFire(userAccountDisplayPostLast, businessUser, user.id);
										getDisplayPosts
										.then((posts) => {
											mounted && setUserAccountDisplayPosts([ ...userAccountDisplayPosts, ...posts.fetchedPosts ]);
											if (posts.lastPost !== undefined) {
												mounted && setUserAccountDisplayPostLast(posts.lastPost);
											} else {
												mounted && setUserAccountDisplayPostFetchSwtich(false);
											};
											mounted && setUserAccountDisplayPostState(false);
										})
									} else {
										console.log("BusinessScheduleScreen: FlatList: onEndReached: display switch: " + userAccountDisplayPostFetchSwitch + " display state: " + userAccountDisplayPostState);
									}
								}}
								onEndReachedThreshold={0.01}
		            horizontal
		            showsHorizontalScrollIndicator={false}
		            data={userAccountDisplayPosts}
		            keyExtractor={(displayPost, index) => index.toString()}
		            renderItem={({ item }) => {
		              return (
		                <TouchableOpacity 
		                  style={styles.postImageContainer}
		                  onPress={() => {
		                  	if (pickedDisplayPost && pickedDisplayPost.id === item.id) {
		                  		setPickedDisplayPost(null)
		                  		setDisplayPostTechs([]);
		                  		setPickedDisplayPost(null);
		                  		setSelectedTech(null);
		                  		// animate
		                  		pressLabelWidth(firstLabelWidthAnim);
		                  		pressLabelHeight(firstLabelHeightAnim);
		                  		foldLabelBorder(firstLabelBorderRadiusAnim);
		                  	} else {
			                  	if (!displayPostTechsState) {
			                  		// new pickedDisplayPost reset selctedTech
			                  		setSelectedTech(null);
			                  		// set new pickedDisplayPost
				                  	setPickedDisplayPost(item);
			                  		setDisplayPostTechs([]);
														setDisplayPostTechsState(true);
														const getDisplayPostTechs = businessGetFire.getTechsRating(item.data.techs, businessUser.id, item.id);
														getDisplayPostTechs
														.then((techs) => {
															setDisplayPostTechs(techs);
															setDisplayPostTechsState(false);
														})
														.catch((error) => {
															console.log("Error occured: BusinessScheduleScreen: getDisplayPostTechs: ", error);
															setDisplayPostTechsState(false);
														})
														// animate
			                  		stretchLabelWidth(firstLabelWidthAnim);
			                  		stretchLabelHeight(firstLabelHeightAnim);
			                  		unfoldLabelBorder(firstLabelBorderRadiusAnim);
			                  		Vibration.vibrate(vibrationTime);
													}
		                  	}
		                  }}
		                >
			                <DisplayPostImage
			                	type={item.data.files[0].type}
			                	url={item.data.files[0].url}
			                	imageWidth={windowWidth/2}
			                />
			                <DisplayPostInfo
			                	taggedCount={kOrNo(item.data.taggedCount)}
			                	title={item.data.title}
			                	likeCount={kOrNo(item.data.like)}
			                	etc={item.data.etc}
			                	price={item.data.price}
			                	containerWidth={windowWidth/2}
			                />
			                { item.data.files.length > 1
			                	? <MultiplePhotosIndicator
			                			size={RFValue(24)}
			                		/>
			                	: null
			                }
			                { 
			                	pickedDisplayPost && pickedDisplayPost.id === item.id
			                	?
			                	<View style={styles.chosenStatus}>
				                	<View style={styles.chosenShadow}>
				                	
					                </View>
					                <View style={styles.chosenCheck}>
					                	<AntDesign name="checkcircle" size={RFValue(23)} color={color.red2} />
					                </View>
					              </View>
					              : null
			                }
		                </TouchableOpacity>
		              )
		            }}
		          />
							{ 
								userAccountDisplayPostState
								?
								<View style={styles.displayPostLoadingContainer}>
									<DisplayPostLoading customColor={color.blue1}/>
								</View>
								: 
								null
							}
						</View>
						: screenReady && userAccountDisplayPosts.length === 0
						?
						<DisplayPostsDefault/>
						: null
					}
				</View>
				<View style={styles.labelContainer}>
					<View style={
						pickedDisplayPost
						?
						styles.labelInnerContainer
						:
						[
							styles.labelInnerContainer,
							{ opacity: 0.3 }
						]
					}>
						{/*<View style={styles.labelIcon}>
							<MaterialCommunityIcons name="numeric-2-circle-outline" size={RFValue(17)} color="black" />
						</View>*/}
						<Animated.View style={[
							pickedDisplayPost
							?
							{ ...styles.labelTextContainer, ...{ backgroundColor: color.red2 }}
							:
							{ ...styles.labelTextContainer, ...{ backgroundColor: color.black2 }},
							{
								minWidth: secondLabelWidthAnim,
								minHeight: secondLabelHeightAnim,
								borderRadius: secondLabelBorderRadiusAnim
							}
						]}>
							<Text style={styles.labelText}>Pick a Technician</Text>
						</Animated.View>
					</View>
				</View>
				<View style={styles.pickTechContainerOuter}>
					{
						screenReady && pickedDisplayPost && displayPostTechs.length > 0
						?
						<View style={styles.pickTechContainer}>
			        <FlatList
			          horizontal
			          showsHorizontalScrollIndicator={false}
			          data={displayPostTechs}
			          keyExtractor={(tech, index) => index.toString()}
			          renderItem={({ item }) => {
			            return (
			              <TouchableOpacity 
			                onPress={() => {
			                  if (selectedTech && selectedTech.id === item.techData.id) {
			                    setSelectedTech(null)
			                    setChartGrids([[]]);
			                    // animate
		                  		pressLabelWidth(secondLabelWidthAnim);
		                  		pressLabelHeight(secondLabelHeightAnim)
		                  		foldLabelBorder(secondLabelBorderRadiusAnim);
			                  } else {
			                    setSelectedTech({ 
			                    	id: item.techData.id, 
			                    	photoURL: item.techData.photoURL, 
			                    	username: item.techData.username,
			                    	businessHours: item.techData.businessHours,
			                    	specialHours: item.techData.specialHours
			                    });
			                  	// animate
		                  		stretchLabelWidth(secondLabelWidthAnim);
		                  		stretchLabelHeight(secondLabelHeightAnim);
		                  		unfoldLabelBorder(secondLabelBorderRadiusAnim);
		                  		Vibration.vibrate(vibrationTime);
			                  }
			                }}
			                style={styles.techContainer}
			              >
			                <View style={styles.techInnerContainer}>
			                  { 
			                    item.techData.photoURL
			                    ?
			                    <Image style={styles.techImage} source={{ uri: item.techData.photoURL }}/>
			                    : 
			                    <DefaultUserPhoto 
			                      customSizeBorder={RFValue(37)}
			                      customSizeUserIcon={RFValue(25)}
			                    />
			                  }
			                  <View style={styles.techInfoContainer}>
			                    <Text style={styles.techUsernameText}>
			                      {item.techData.username}
			                    </Text>
			                    <View style={styles.techRatingContainer}>
			                    	{ 
			                    		// tech rating in the business
			                    		item.techRatingBus.totalRating && item.techRatingBus.countRating
			                    		?
			                    		<View style={styles.techInfoInner}>
			                    			<Text stlye={styles.techInfoText}>
			                    			mean
			                    			</Text>
			                    			<View style={styles.techInfoIcon}>
				                    			<AntDesign name="staro" size={RFValue(13)} color={color.black1} />
				                    		</View>
				                    		<Text stlye={styles.techInfoText}>{(Math.round(item.techRatingBus.totalRating/item.techRatingBus.countRating * 10) / 10).toFixed(1)}</Text>
				                    	</View>
			                    		:
			                    		<View style={styles.techInfoInner}>
			                    			<Text stlye={styles.techInfoText}>
			                    			mean
			                    			</Text>
			                    			<View style={styles.techInfoIcon}>
				                    			<AntDesign name="staro" size={RFValue(13)} color={color.black1} />
				                    		</View>
				                    		<Text stlye={styles.techInfoText}>-</Text>
				                    	</View>
			                    	}

			                    	{
			                    		// tech rating in the business of the post
			                    		item.techRatingPost && item.techRatingPost.totalRating && item.techRatingPost.countRating
			                    		?
			                    		<View style={styles.techInfoInner}>
			                    			<View style={styles.techInfoIcon}>
				                    			<AntDesign name="staro" size={RFValue(13)} color={color.black1} />
				                    		</View>
				                    		<Text stlye={styles.techInfoText}>{(Math.round(item.techRatingPost.totalRating/item.techRatingPost.countRating * 10) / 10).toFixed(1)}</Text>
				                    	</View>
			                    		:
			                    		<View style={styles.techInfoInner}>
			                    			<View style={styles.techInfoIcon}>
				                    			<AntDesign name="staro" size={RFValue(13)} color={color.black1} />
				                    		</View>
				                    		<Text stlye={styles.techInfoText}>-</Text>
				                    	</View>
			                    	}
			                    	
			                    </View>
			                  </View>
			                </View>
			                { 
			                  selectedTech && selectedTech.id === item.techData.id
			                  ?
			                  <View style={styles.chosenTechStatus}>
			                    <View style={styles.chosenTechShadow}>
			                    
			                    </View>
			                    <View style={styles.chosenTechCheck}>
			                      <AntDesign name="checkcircle" size={RFValue(23)} color={color.red2} />
			                    </View>
			                  </View>
			                  : null
			                }
			                
			              </TouchableOpacity>
			            )
			          }}
			        />
		      	</View>
		      	: screenReady && pickedDisplayPost && displayPostTechs.length === 0 && !displayPostTechsState
		      	?
		      	<View style={styles.pickTechContainer}>
		      		<View style={styles.pickTechDefault}>
		      			<Text style={styles.guideText}>Technicians aren't available for the chosen design</Text>
		      		</View>
		      	</View>
		      	: null
					}
				</View>
				<View style={styles.labelContainer}>
					<View style={
						selectedTech
						?
						styles.labelInnerContainer
						:
						[
							styles.labelInnerContainer,
							{ opacity: 0.3 }
						]
					}>
						{/*<View style={styles.labelIcon}>
							<MaterialCommunityIcons name="numeric-3-circle-outline" size={RFValue(17)} color="black" />
						</View>*/}
						<Animated.View style={[
							selectedTech
							?
							{ ...styles.labelTextContainer, ...{ backgroundColor: color.red2 }}
							:
							{ ...styles.labelTextContainer, ...{ backgroundColor: color.black2 }},
							{
								minWidth: thirdLabelWidthAnim,
								minHeight: thirdLabelHeightAnim,
								borderRadius: thirdLabelBorderRadiusAnim
							}
						]}>
							<Text style={styles.labelText}>Choose Time</Text>
						</Animated.View>
					</View>
				</View>
				<View style={styles.showHoursContainer}>
				</View>
				{
					pickedDisplayPost && selectedTech &&
					<View style={styles.controllerContainer}>
						<View style={styles.topControllerContainer}>
							<View style={styles.topControllerLeftCompartment}>
								{
									// new calendar date => useConvertTime.moveMonthInMs(calendarDate, -1)
									// dateNow's month in miliseconds => useConvertTime.convertToMonthInMs(dateNow)
									showCalendar && 
									useConvertTime.convertToMonthInMs(dateNow) <= useConvertTime.moveMonthInMs(calendarDate, -1)
									?
									<TouchableOpacity
										onPress={() => {
											setCalendarDate(useConvertTime.moveMonthInMs(calendarDate, -1));
											setCalendarMove(calendarMove - 1);
										}}
									>
										<AntDesign name="leftcircleo" size={RFValue(27)} color="black" />
									</TouchableOpacity>
									: !showCalendar && dateMoveFromToday > 0
									?
									<TouchableOpacity
										onPress={() => {
											const dateNowDateInMs = useConvertTime.convertToDateInMs(dateNow);
											const newRsvDate = useConvertTime.convertToDateInMs(rsvDate - 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000);
											if (dateNowDateInMs <= newRsvDate) {
												setRsvDate(newRsvDate);
												setDateMoveFromToday(dateMoveFromToday - 1);
											}
										}}
									>
										<AntDesign name="leftcircleo" size={RFValue(27)} color="black" />
									</TouchableOpacity>
									:
									<View>
										<AntDesign name="leftcircleo" size={RFValue(27)} color={color.grey1} />
									</View>
								}
							</View>
							<View style={styles.calendarControllerCenterCompartment}>
								<TouchableOpacity
									onPress={() => {
										setShowCalendar(!showCalendar);
									}}
								>
									<Text style={styles.rsvDateText}>
										{ showCalendar
											?
											useConvertTime.convertToMonthly(calendarDate)
											:
											useConvertTime.convertToMDD(rsvDate)
										}
									</Text>
								</TouchableOpacity>
								<View style={{ minHeight: 2, maxHeight: 1, backgroundColor: color.black2, width: '77%', marginTop: RFValue(7) }}>
								</View>
							</View>
							<View style={styles.topControllerRightCompartment}>
								<TouchableOpacity
									onPress={() => {
										showCalendar
										?
										(
											setCalendarDate(useConvertTime.moveMonthInMs(calendarDate, +1)),
											setCalendarMove(calendarMove + 1)
										)
										:
										(
											setRsvDate(useConvertTime.convertToDateInMs(rsvDate + 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000)),
											setDateMoveFromToday(dateMoveFromToday + 1)
										)

									}}
								>
									<AntDesign name="rightcircleo" size={RFValue(27)} color="black" />
								</TouchableOpacity>
							</View>
						</View>
					</View>
				}

				{/*{ open: boolean, hours: array }*/}
				{
					pickedDisplayPost && selectedTech &&
					<View>
						<View style={styles.hoursInfoContainer}>
							<View style={styles.hoursInfoBox}>
								<View style={styles.hoursLabelContainer}>
									{
										businessUser.photoURL
										?
										<Image
											style={styles.hoursInfoUserPhoto}
											source={{ uri: businessUser.photoURL }}
										/>
										:
										<DefaultUserPhoto 
                      customSizeBorder={RFValue(37)}
                      customSizeUserIcon={RFValue(25)}
                    />
									}
									<Text style={styles.hoursLabelText}>{businessUser.username} Hours</Text>
								</View>
								{
									busSpecialHours && busSpecialHours.hours.length > 0
									?
									busSpecialHours.hours.map((hours, index) => (
										<View style={styles.showHoursContainer} key={index}>
											<View>
												<Text style={styles.hoursText}>* {useConvertTime.convertMilitaryToStandard(hours.opens.hour, hours.opens.min)} - {useConvertTime.convertMilitaryToStandard(hours.closes.hour, hours.closes.min)}</Text>
											</View>
										</View>
									))
									: busBusinessHours && busBusinessHours.hours.length > 0
									?
									busBusinessHours.hours.map((hours, index) => (
										<View style={styles.showHoursContainer} key={index}>
											<View>
												<Text style={styles.hoursText}>{useConvertTime.convertMilitaryToStandard(hours.opens.hour, hours.opens.min)} - {useConvertTime.convertMilitaryToStandard(hours.closes.hour, hours.closes.min)}</Text>
											</View>
										</View>
									))
									:
									<View style={styles.showHoursContainer}>
										<Text style={styles.hoursText}>Unavailable</Text>
									</View>
								}
							</View>
							<View style={styles.hoursInfoBox}>
								<View style={styles.hoursLabelContainer}>
									{
										selectedTech.photoURL
										?
										<Image
											style={styles.hoursInfoUserPhoto}
											source={{ uri: selectedTech.photoURL }}
										/>
										:
										<DefaultUserPhoto 
                      customSizeBorder={RFValue(37)}
                      customSizeUserIcon={RFValue(25)}
                    />
									}
									<Text style={styles.hoursLabelText}>{selectedTech.username} Hours</Text>
								</View>
								{
									techSpecialHours && techSpecialHours.hours.length > 0
									?
									techSpecialHours.hours.map((hours, index) => (
										<View style={styles.showHoursContainer} key={index}>
											<View>
												<Text style={styles.hoursText}>* {useConvertTime.convertMilitaryToStandard(hours.opens.hour, hours.opens.min)} - {useConvertTime.convertMilitaryToStandard(hours.closes.hour, hours.closes.min)}</Text>
											</View>
										</View>
									))
									: techBusinessHours && techBusinessHours.hours.length > 0
									?
									techBusinessHours.hours.map((hours, index) => (
										<View style={styles.showHoursContainer} key={index}>
											<View>
												<Text style={styles.hoursText}>{useConvertTime.convertMilitaryToStandard(hours.opens.hour, hours.opens.min)} - {useConvertTime.convertMilitaryToStandard(hours.closes.hour, hours.closes.min)}</Text>
											</View>
										</View>
									))
									: 
									<View style={styles.showHoursContainer}>
										<Text style={styles.hoursText}>Unavailable</Text>
									</View>
								}
							</View>
						</View>
					</View>
				}

				{
					// calendar to move to a specific date using it
					showCalendar
					?
					<MonthCalendar 
						dateNow={dateNow}
						datesOnCalendar={datesOnCalendar}
						setDate={setRsvDate}
						setShowCalendar={setShowCalendar}
	          setDateMoveFromToday={setDateMoveFromToday}
	          setCalendarMove={setCalendarMove}
	          canSelectPast={false}
					/>
					: null
				}
				
				{
					!showCalendar && pickedDisplayPost && selectedTech && gridExist
					?
					<View>
						{
							chartGrids.map((gridRow, index) => (
								<View 
									style={styles.gridRow}
									key={index}
								>
									<ScrollView 
										horizontal
										showsHorizontalScrollIndicator={false}
									>
										{
					      			gridRow.map((item, index) => (
							      		<View 
							      			key={index}
							      			style={styles.gridContainer}
							      		>
								      		<TouchableOpacity
								      			style={styles.gridTouchContainer}
								      			key={index}
								      			onPress={() => {
								      				{
								      					pickedDisplayPost && selectedTech
								      					?
						    								(
						    									// animate
					    										navigation.navigate('ReservationRequest', {
										      					businessUserId: businessUser.id,
										      					businessUserUsername: businessUser.username,
										      					businessUserPhotoURL: businessUser.photoURL,
										      					businessUserLocationType: businessUser.locationType,
										      					businessUserLocality: businessUser.locality,

										      					businessGooglemapsUrl: businessUser.googlemapsUrl,
										      					businessLocationCoord: { 
										      						latitude: businessUser.geometry.location.lat, 
										      						longitude: businessUser.geometry.location.lng 
										      					},

										      					selectedTechId: selectedTech.id,
																		selectedTechUsername: selectedTech.username,
																		selectedTechPhotoURL: selectedTech.photoURL,

																		userId: user.id,
																		pickedDisplayPost: pickedDisplayPost,
																		gridTime: item.gridStartTime,
										      				}),
										      				setRsvDate(useConvertTime.convertToDateInMs( Date.now() )),
																	setDateMoveFromToday(0),
																	setCalendarDate(useConvertTime.convertToDateInMs(Date.now() )),
																	setCalendarMove(0),

																	setPickedDisplayPost(null),
																	setDisplayPostTechs([]),
																	setDisplayPostTechsState(false),
																	setSelectedTech(null),

																	setChartGridsState(false),
																	setChartGrids([[]]),

																	// animate back to default
																	pressLabelWidth(firstLabelWidthAnim),
																	pressLabelHeight(firstLabelHeightAnim),
																	foldLabelBorder(firstLabelBorderRadiusAnim),
																	pressLabelWidth(secondLabelWidthAnim),
																	pressLabelHeight(secondLabelWidthAnim),
																	foldLabelBorder(secondLabelBorderRadiusAnim),

																	Vibration.vibrate(vibrationTime)
						    								)
								      					: console.log("not ready yet")
								      				}
								      			}}
								      		>
								      			<View style={styles.grid}>
									      			<Text style={styles.gridText}>
									      				{item.gridStartTime.normalHour}:{item.gridStartTime.normalMin} {item.gridStartTime.pmOrAm}
									      			</Text>
									      		</View>
								      		</TouchableOpacity>
								      	</View>
									    ))
									  }
			      			</ScrollView>
		      			</View>
			      	))
						}
						<View style={{ height: RFValue(100) }}/>
		      </View>
	      	: 
	      	null
	      }
	      {
	      	!showCalendar && pickedDisplayPost && selectedTech && !gridExist
	      	? 
	      	<View style={styles.emptyGridContainer}>
	      		<Text style={styles.emptyGridText}> No Empty Spots on The Date</Text>
	      	</View>
	      	: null
	      }
			</ScrollView>
      { 
        // put this at the last so it can be on the top of others
        alertBoxStatus
        ?
        <AlertBoxTop 
          setAlert={setAlertBoxStatus}
          alertText={alertBoxText}
        />
        : null
      }
		</View>
  );
};

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		backgroundColor: color.white2
	},
	scheduleContainer: {
		backgroundColor: color.white2
	},
	// Controller
	controllerContainer: {
		backgroundColor: color.white2,
	},
	topControllerContainer: {
		flex: 1,
		paddingVertical: RFValue(7),
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	calendarControllerCenterCompartment: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	topControllerLeftCompartment: {
		padding: RFValue(15),
		justifyContent: 'center',
		alignItems: 'center',
	},
	topControllerRightCompartment: {
		padding: RFValue(15),
		justifyContent: 'center',
		alignItems: 'center',
	},

	gridContainer: {
		height: RFValue(57),
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	gridTouchContainer: {
		flex: 1,
		marginHorizontal: RFValue(7),
		borderWidth: 0.5,
		borderRadius: RFValue(7),
		backgroundColor: color.white1,
	},
	gridRow: {
		justifyContent: 'center',
		backgroundColor: color.white2
	},
	grid: {
		justifyContent: 'center',
		alignItems: 'center',
		height: RFValue(33),
		paddingHorizontal: RFValue(9),
		paddingVertical: RFValue(3),
	},
	gridText: {
		fontSize: RFValue(17),
		// fontWeight: 'bold',
	},

	// Label
	labelContainer: {
		height: RFValue(70),
		backgroundColor: color.white2,
		alignItems: 'center',
		justifyContent: 'center'
		// shadowColor: "#000",
	  //   shadowOffset: { width: 0, height: -2 },
	  //   shadowOpacity: 0.3,
	  //   shadowRadius: 3,
	},
	labelInnerContainer: {
		height: RFValue(70),
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: RFValue(7),
	},
	labelIcon: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: RFValue(7),
	},
	labelTextContainer: {
		alignSelf: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: RFValue(15),
		paddingVertical: RFValue(7),
	},
	labelText: {
		fontSize: RFValue(19),
		fontWeight: 'bold',
		color: color.white2
	},

	displayPostsContainer: {
		height: windowWidth/2 + RFValue(50),
		width: '100%',
		backgroundColor: color.white2,
		// shadowColor: "#000",
  //   shadowOffset: { width: 0, height: -2 },
  //   shadowOpacity: 0.3,
  //   shadowRadius: 3,
	},
	displayPostLoadingContainer: {
		width: '100%',
		position: 'absolute',
		alignItems: 'center',
		marginTop: RFValue(7),
	},
  chosenStatus: {
  	flex: 1, 
  	height: windowWidth/2 + RFValue(50), 
  	width: windowWidth/2 , 
  	position: 'absolute', 
  },
  chosenShadow: {
  	flex: 1, 
  	height: windowWidth/2 + RFValue(50), 
  	width: windowWidth/2 , 
  	position: 'absolute', 
  	backgroundColor: color.black1, 
  	opacity: 0.1 
  },
  chosenCheck: {
  	flex: 1, 
  	position: 'absolute', 
  	height: windowWidth/2 + RFValue(50), 
  	width: windowWidth/2, 
  	justifyContent: 'center', 
  	alignItems: 'center'
  },

  pickTechContainerOuter: {
  	width: '100%',
  },
  pickTechContainer: {
    flexDirection: 'row',
    width: '100%',
  	height: techBoxWidth,
  },
  pickTechDefault: {
  	width: '100%',
  	justifyContent: 'center',
    alignItems: 'center',
  },
  techContainer: {
    height: techBoxWidth, 
    width: techBoxWidth, 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(3),
  },
  techImage: {
    height: RFValue(37),
    width: RFValue(37),
    borderRadius: RFValue(100),
  },
  techInnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  techInfoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: RFValue(3),
  },
  techInfoInner: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: RFValue(3),
	},
	techInfoIcon: {
		paddingHorizontal: RFValue(3),
	},
	techInfoText: {
		fontSize: RFValue(13),
	},
  techUsernameText: {
    fontSize: RFValue(15),
  },

  chosenTechStatus: {
    flex: 1, 
    height: techBoxWidth, 
    width: techBoxWidth, 
    position: 'absolute', 
  },
  chosenTechShadow: {
    flex: 1, 
    height: techBoxWidth, 
    width: techBoxWidth, 
    position: 'absolute', 
    backgroundColor: color.black1, 
    opacity: 0.1 
  },
   chosenTechCheck: {
    flex: 1, 
    position: 'absolute', 
    height: techBoxWidth, 
    width: techBoxWidth, 
    justifyContent: 'center', 
    alignItems: 'center'
  },

  guideText: {
  	fontSize: RFValue(23),
  	fontWeight: 'bold'
  },
  rsvDateText: {
  	fontSize: RFValue(21),
  	fontWeight: 'bold'
  },

  emptyGridContainer: {
  	justifyContent: 'center',
  	alignItems: 'center',
  	paddingVertical: RFValue(30),
  },
  emptyGridText: {
  	fontSize: RFValue(20),
  	fontWeight: 'bold',
  },

  showHoursContainer: {
  	flexDirection: 'row'
  },
  hoursInfoContainer: {
  	flexDirection: 'row',
  	alignItems: 'center'
  },
  hoursInfoBox: {
  	flex: 1,
  	alignItems: 'center'
  },
  hoursLabelContainer: {
  	justifyContent: 'center',
  	alignItems: 'center',
  	height: RFValue(70)
  },
  hoursLabelText: {
  	fontSize: RFValue(15)
  },
  hoursText: {
  	fontSize: RFValue(17),
  },
  hoursInfoUserPhoto: {
  	height: RFValue(37),
    width: RFValue(37),
    borderRadius: RFValue(100),
  },
});

export default BusinessScheduleScreen;
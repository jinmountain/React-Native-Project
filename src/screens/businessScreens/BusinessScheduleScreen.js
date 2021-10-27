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
// Firebase
import businessGetFire from '../../firebase/businessGetFire';
import businessPostFire from '../../firebase/businessPostFire';
import contentGetFire from '../../firebase/contentGetFire';
import { getCalendarDates } from '../../hooks/getCalendarDates';

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
	const { businessUser } = route.params;
	const [ dateNow, setDateNow ] = useState(Date.now());

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
	const [ startTime, setStartTime ] = useState(8);
	const [ endTime, setEndTime ] = useState(17);
	const [ rsvTimeLimit, setRsvTimeLimit ] = useState(60*60*1000); // default 1 hour

	// picked display post state
	const [ pickedDisplayPost, setPickedDisplayPost ] = useState(null);

	// techs state
	const [ displayPostTechs, setDisplayPostTechs ] = useState([]);
	const [ displayPostTechsState, setDisplayPostTechsState ] = useState(false);

	// schedule chart state
	const [ chartGridsState, setChartGridsState ] = useState(false);
	const [ chartGrids, setChartGrids ] = useState([[]]);

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

	// // Calculate 
	// // - Calander Dates 
	// // - Dates Left In The Month  
	// // - Dates of The Following Month in The Last Week of The Month
	// getCalendarDates(calendarDate, dateNow, endTime, setDatesOnCalendar);
	useEffect(() => {
		let mounted = true;
		const monthInMs = useConvertTime.convertToMonthInMs(calendarDate);
		const time = useConvertTime.convertToTime(monthInMs);
		const monthIndex = time.monthIndex;
		// todays date and when business end today
		const calendarDateInMs = useConvertTime.convertToDateInMs(calendarDate);
		const dateNowInMs = useConvertTime.convertToDateInMs(dateNow);
		const dateNowEndTime = dateNowInMs + endTime * 60 * 60 * 1000;

		// days
		// 0 1 2 3 4 5 6
		// add days of the month
		let datesInPreMonth = [];
		let dayInPreMonthIndex;
		const firstDayIndex = time.dayIndex;
		if (firstDayIndex !== 0) {
			for (dayInPreMonthIndex = 1; dayInPreMonthIndex < firstDayIndex + 1; dayInPreMonthIndex++) {
				const dayInPreMonthTimestamp = useConvertTime.convertToDateInMs(monthInMs - dayInPreMonthIndex * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000);
				const dayInPreMonthTime = useConvertTime.convertToTime(dayInPreMonthTimestamp);
				if (dayInPreMonthTimestamp > dateNowInMs) {
					datesInPreMonth.unshift({ dateInMS: dayInPreMonthTimestamp, time: dayInPreMonthTime, thisMonth: false, past: false });
				} else {
					datesInPreMonth.unshift({ dateInMS: dayInPreMonthTimestamp, time: dayInPreMonthTime, thisMonth: false, past: true });
				}
			};
		}
		
		let datesInMonth = []
		let dateInMonthIndex;
		let numOfDaysInMonth = useConvertTime.getDaysInMonth(monthIndex, time.year);
		for (dateInMonthIndex = 0; dateInMonthIndex < numOfDaysInMonth; dateInMonthIndex++) {
			const dateInMonthTimestamp = useConvertTime.convertToDateInMs(monthInMs + dateInMonthIndex * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000) // to avoid day light savings;
			const dateInMonthTime = useConvertTime.convertToTime(dateInMonthTimestamp);
			// date is in the month and same as today and the current time is bigger than the end time
			if (dateInMonthTimestamp === dateNowInMs && dateNow > dateNowEndTime) {
				datesInMonth.push({ 
					dateInMS: dateInMonthTimestamp, 
					time: dateInMonthTime, 
					thisMonth: true, 
					past: true, 
					today: true 
				});
			} 
			// date is in the month but less than today
			else if (dateInMonthTimestamp < dateNowInMs) {
				datesInMonth.push({ 
					dateInMS: dateInMonthTimestamp, 
					time: dateInMonthTime, 
					thisMonth: true, 
					past: true, 
					today: false 
				});
			}
			// date is in the month and same as today and the current time is less than the end time
			else if (dateInMonthTimestamp === dateNowInMs && dateNow < dateNowEndTime) {
				datesInMonth.push({ 
					dateInMS: dateInMonthTimestamp, 
					time: dateInMonthTime, 
					thisMonth: true, 
					past: false, 
					today: true 
				});
			}
			// date is in the month and bigger than today
			else {
				datesInMonth.push({ 
					dateInMS: dateInMonthTimestamp, 
					time: dateInMonthTime, 
					thisMonth: true, 
					past: false, 
					today: false 
				});
			}
		};

		let datesInNextMonth = [];
		let lastDateTimestamp = useConvertTime.getDateTimestamp(time.year, monthIndex, numOfDaysInMonth);
		let lastDayIndex = useConvertTime.getDayIndex(time.year, monthIndex, numOfDaysInMonth);
		
		// if lastDayIndex is not 6 which is saturday
		if (lastDayIndex !== 6) {
			let daysLeftInWeek = 6 - lastDayIndex;
			let dayInNextMonthIndex
			for (dayInNextMonthIndex = 1; dayInNextMonthIndex < daysLeftInWeek + 1; dayInNextMonthIndex++) {
				const dateInNextMonthTimestamp = useConvertTime.convertToDateInMs(lastDateTimestamp + dayInNextMonthIndex * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000);
				const dateInNextMonthTime = useConvertTime.convertToTime(dateInNextMonthTimestamp);
				datesInNextMonth.push({ dateInMS: dateInNextMonthTimestamp, time: dateInNextMonthTime, thisMonth: false, past: false });
			};
		}

		mounted && setDatesOnCalendar(datesInPreMonth.concat(datesInMonth, datesInNextMonth));

		return () => {
			mounted = false;
			setDatesOnCalendar([]);
		}
	}, [calendarDate]);

	// make schedule grids
	useEffect(() => {
		let mounted = true;
		if (pickedDisplayPost && selectedTech) {
			setChartGridsState(true);
	  	setChartGrids([[]]);
	  	const getRsvsStartAtOfTech = businessGetFire.getRsvTimestampsOfTech(businessUser.id, selectedTech.id, rsvDate, startTime, endTime);
	  	getRsvsStartAtOfTech
	  	.then((rsvTimestamps) => {
				const rsvDateTimestamp = useConvertTime.convertToDateInMs(rsvDate);
				var startTimeTimestamp = rsvDateTimestamp + (startTime * 60 * 60 *1000) // convert hours to milisecs
				const displayPostEtc = pickedDisplayPost.data.etc;

				let numOfGrids;
				numOfGrids = (endTime - startTime) * 60 / 5

				let grids = [[]];
				let gridIndex;
				let gridRow = 0; // each row has each hour
				let gridHour = Math.floor(startTime); // when business begins, the earliest hour of business by flooring it down
				for (let gridIndex = 0; gridIndex <= numOfGrids; gridIndex++) {
					// const floorStartTime = Math.floor(startTime);

					var gridTimestamp = startTimeTimestamp + (gridIndex * 5 * 60 *1000) // + 5mins
					var gridEndTimestamp = gridTimestamp + (displayPostEtc - 5) * 60 * 1000;
					// displayPostEtc - 5 because it is grid like 1:05 - 1:10

					var gridStartTime = useConvertTime.convertToTime(gridTimestamp);

					// last timestamp of grid available is rsvDateTimestamp + endTime in MS - the picked post's etc in MS
					const lastTimestamp = rsvDateTimestamp + (endTime * 60 * 60 * 1000) - (pickedDisplayPost.data.etc * 60 * 1000)

					// conditions that exclude grid timestamp
					const conflictingGrids = rsvTimestamps.filter(rsv => rsv < gridEndTimestamp && rsv > gridTimestamp)
					// - there is a existing rsv collapsing the new rsv
					if (rsvTimestamps.includes(gridTimestamp) || rsvTimestamps.includes(gridEndTimestamp) || gridTimestamp > lastTimestamp) {
						continue;
					} 
					// - there is a existing rsv btw the new rsv
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
						};
					}
			  };
			  mounted && setChartGridsState(false);
			  mounted && setChartGrids(grids);
	  	})
	  	.catch((error) => {
	  		console.log("BusinessScheduleScreen: getRsvsStartAtOfTech: ", error);
	  	})
		}
	}, [selectedTech, rsvDate]);

	return (
		<MainTemplate>
			{ displayPostTechsState || userAccountDisplayPostState || chartGridsState
        ? <LoadingAlert />
        : null
      }
			<HeaderForm 
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
       	customBackgroundColor={color.red2}
       	customTextColor={color.white2}
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
					{/*<HeaderBottomLine />*/}
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
					<HeaderBottomLine />
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
					{/*<HeaderBottomLine />*/}
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
			                    setSelectedTech({ id: item.techData.id, photoURL: item.techData.photoURL, username: item.techData.username });
			                  	// animate
		                  		stretchLabelWidth(secondLabelWidthAnim);
		                  		stretchLabelHeight(secondLabelHeightAnim);
		                  		unfoldLabelBorder(secondLabelBorderRadiusAnim);
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
					<HeaderBottomLine />
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
							<Text style={styles.labelText}>Select Time</Text>
						</Animated.View>
					</View>
					{/*<HeaderBottomLine />*/}
				</View>
				{
					pickedDisplayPost && selectedTech &&
					<View style={styles.controllerContainer}>
						<View style={styles.topControllerContainer}>
							<View style={styles.topControllerLeftCompartment}>
								{
									showCalendar && calendarMove > 0
									?
									<TouchableOpacity
										onPress={() => {
											const dateNowMonthInMs = useConvertTime.convertToMonthInMs(dateNow);
											const newCalendarDate = useConvertTime.moveMonthInMs(calendarDate, -1);
											console.log("dateNowMonthInMs: ", dateNowMonthInMs, "newCalendarDate: ", newCalendarDate);
											if (dateNowMonthInMs <= newCalendarDate) {
												setCalendarDate(newCalendarDate);
												setCalendarMove(calendarMove - 1);
											}
										}}
									>
										<AntDesign name="leftcircleo" size={RFValue(27)} color="black" />
									</TouchableOpacity>
									: dateMoveFromToday > 0
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
						<HeaderBottomLine />
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
					/>
					: null
				}
				
				{
					!showCalendar && pickedDisplayPost && selectedTech
					?
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
															foldLabelBorder(secondLabelBorderRadiusAnim)
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
	      	: 
	      	null
	      }
	      {
	      	!showCalendar && pickedDisplayPost && selectedTech && chartGrids && chartGrids[0].length === 0
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
		</MainTemplate>
  );
};

const styles = StyleSheet.create({
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
  }
});

export default BusinessScheduleScreen;
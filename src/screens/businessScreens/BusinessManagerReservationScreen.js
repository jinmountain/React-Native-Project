import React, { useState, useEffect, useContext, useCallback } from 'react';
import { 
	Text, 
	View,
	ScrollView,
	RefreshControl,
	StyleSheet, 
	FlatList,
	Image,
	TouchableOpacity,
	TouchableHighlight,
	Dimensions,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Video, AVPlaybackStatus } from 'expo-av';

// Designs
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

// Contexts
import { Context as AuthContext } from '../../context/AuthContext';
import { Context as SocialContext } from '../../context/SocialContext';

// Hooks
import useConvertTime from '../../hooks/useConvertTime';
import { wait } from '../../hooks/wait';

// Firebase
import businessGetFire from '../../firebase/businessGetFire';
import businessPostFire from '../../firebase/businessPostFire';

// Components
import MainTemplate from '../../components/MainTemplate';
import DefaultUserPhoto from '../../components/defaults/DefaultUserPhoto';
import { RatingReadOnly } from '../../components/RatingReadOnly';
import HeaderBottomLine from '../../components/HeaderBottomLine';
import SpinnerFromActivityIndicator from '../../components/ActivityIndicator';
// Calendar
import MonthCalendar from '../../components/businessSchedule/MonthCalendar';

// Color
import color from '../../color';

// icons
import expoIcons from '../../expoIcons';

const RsvInfoCompartment = ({ rsv, borderLineTop }) => {
	// item object structure
	// rsv: {
	// 	confirm: rsvData.confirm,
	// 	startAt: rsvData.startAt,
	// 	etc: rsvData.etc,
	// 	endAt: rsvData.endAt,
	// 	completed: rsvData.completed
	// },
	// customer: {
	// 	id: cusData.id,
	// 	username: cusData.username,
	// 	photoURL: cusData.photoURL,
	// },
	// tech: {
	// 	id: techData.id,
	// 	username: techData.username,
	// 	photoURL: techData.photoURL,
	// },
	// post: {
	//  id: getPostData.id,
	//  title: getPostData.title,
	//  file: postData.files[0],
	//  etc: postData.etc,
	//  price: postData.price,
	//  tags: postData.tags
	// }
	return (
		<View style={styles.rsvInfoCompartment}>
			{
				borderLineTop
				&& <HeaderBottomLine />
			}
			<View style={styles.timeContainer}>
				<Text style={styles.timeText}>
					{useConvertTime.convertToNormHourMin(rsv.rsv.startAt)}
				</Text>
			</View>
			<View style={styles.rsvInfoContainer}>
  			<View style={styles.techContainer}>
  				<View style={styles.userPhotoContainer}>
  					{ 
  						rsv.tech.photoURL
  						?
  						<Image 
	              source={{uri: rsv.tech.photoURL}}
	              style={{width: RFValue(57), height: RFValue(57), borderRadius: RFValue(100)}}
	            />
  						:
  						<DefaultUserPhoto 
  							customSizeBorder={RFValue(57)}
  							customSizeUserIcon={RFValue(37)}
  						/>
  					}
  				</View>
  				<View style={styles.userInfoContainer}>
	  				<View style={styles.usernameContainer}>
	  					<Text style={styles.usernameText}>{rsv.tech.username}</Text>
	  				</View>
		  		</View>
	  		</View>
	  		<View style={styles.cusContainer}>
	  			<View style={styles.userPhotoContainer}>
  					{ 
  						rsv.customer.photoURL
  						?
  						<Image 
	              source={{uri: rsv.customer.photoURL}}
	              style={{width: RFValue(57), height: RFValue(57), borderRadius: RFValue(100)}}
	            />
  						:
  						<DefaultUserPhoto 
  							customSizeBorder={RFValue(57)}
  							customSizeUserIcon={RFValue(37)}
  						/>
  					}
  				</View>
  				<View style={styles.userInfoContainer}>
	  				<View style={styles.usernameContainer}>
	  					<Text style={styles.usernameText}>{rsv.customer.username}</Text>
	  				</View>
		  		</View>
	  		</View>
	  		<View style={styles.postContainer}>
	  			<View style={styles.userPhotoContainer}>
						{
							rsv.post && rsv.post.file && rsv.post.file.type === 'image'
  						?
  						<Image 
	              source={{uri: rsv.post.file.url}}
	              style={{width: RFValue(57), height: RFValue(57)}}
	            />
	            : rsv.post && rsv.post.file && rsv.post.file.type === 'video'
	            ?
	            <Video
                // ref={video}
                style={{width: RFValue(57), height: RFValue(57)}}
                source={{uri: rsv.post.file.url}}
                useNativeControls={false}
                resizeMode="contain"
                shouldPlay={false}
              />
              : null
	          }
  				</View>
  				<View style={styles.userInfoContainer}>
	  				<View style={styles.usernameContainer}>
	  					{	
	  						rsv.post &&
	  						<Text style={styles.usernameText}>
	  							{useConvertTime.convertEtcToHourMin(rsv.post.etc)}
	  							<Entypo name="dot-single" size={RFValue(13)} color="black" /> 
	  							$ {rsv.post.price}
	  						</Text>
	  					}
	  				</View>
		  		</View>
	  		</View>
  		</View>
  	</View>
	)
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const BusinessManagerReservationScreen = ({ navigation, isFocused }) => {
	// Contexts
	const { state: { user } } = useContext(AuthContext);
	
	// Temp start end time of business
	const [ startTime, setStartTime ] = useState(8);
	const [ endTime, setEndTime ] = useState(17);

	// reservation date state
	const dayInMs = 86400000;
	const [ dateNow, setDateNow ] = useState(Date.now());

	const [ rsvDate, setRsvDate ] = useState( useConvertTime.convertToDateInMs( Date.now() ));
	const [ dateMoveFromToday, setDateMoveFromToday ] = useState(0);

	// calendar 
	const [ calendarDate, setCalendarDate ] = useState(useConvertTime.convertToMonthInMs(Date.now()));
	const [ calendarMove, setCalendarMove ] = useState(0);

	const [ datesOnCalendar, setDatesOnCalendar ] = useState([]);
	const [ showCalendar, setShowCalendar ] = useState(false);

	// reservation states
	const [ upcomingRsvs, setUpcomingRsvs ] = useState([]);
	const [ getUpcomingRsvsState, setGetUpcomingRsvsState ] = useState(false);

	const [ uncompletedRsvs, setUncompletedRsvs ] = useState([]);
	const [ getUncompletedRsvsState, setGetUncompletedRsvsState ] = useState(false);

	const [ completedRsvs, setCompletedRsvs ] = useState([]);
	const [ getCompletedRsvsState, setGetCompletedRsvsState ] = useState(false);

	const [ longPressed, setLongPressed ] = useState(false);

	useEffect(() => {
		let isMounted = true;
		if ( isMounted && !getUpcomingRsvsState && dateMoveFromToday >= 0 ) {
			setGetUpcomingRsvsState(true);
			const getUpcomingRsvs = businessGetFire.getUpcomingRsvsOfBus(user.id, dateNow, dateMoveFromToday);

			getUpcomingRsvs
			.then((rsvs) => {
				isMounted && setUpcomingRsvs(rsvs);
				setGetUpcomingRsvsState(false);
			})
			.catch((error) => {
				console.log("BusinessManagerReservationScreen: getUpcomingRsvs: ", error);
			});
		}

		if ( isMounted && !getUncompletedRsvsState && dateMoveFromToday <= 0) {
			setGetUncompletedRsvsState(true);
			const getUncompletedRsvs = businessGetFire.getPreviousRsvsOfBus(user.id, dateNow, dateMoveFromToday, false);

			getUncompletedRsvs
			.then((rsvs) => {
				isMounted && setUncompletedRsvs(rsvs);
				setGetUncompletedRsvsState(false);
			})
			.catch((error) => {
				console.log("BusinessManagerReservationScreen: getUncompletedRsvs: ", error);
			});
		}

		if ( isMounted && !getCompletedRsvsState && dateMoveFromToday <= 0) {
			setGetCompletedRsvsState(true);
			const getCompletedRsvs = businessGetFire.getPreviousRsvsOfBus(user.id, dateNow, dateMoveFromToday, true);

			getCompletedRsvs
			.then((rsvs) => {
				isMounted && setCompletedRsvs(rsvs);
				setGetCompletedRsvsState(false);
			})
			.catch((error) => {
				console.log("BusinessManagerReservationScreen: getCompletedRsvs: ", error);
			});
		}

		return () => {
			isMounted = false;
			setUpcomingRsvs([]);
			setGetUpcomingRsvsState(false);

			setUncompletedRsvs([]);
			setGetUncompletedRsvsState(false);

			setCompletedRsvs([]);
			setGetCompletedRsvsState(false);
		}
	}, [rsvDate]);

	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = useCallback((dateMoveFromToday, dateNow, userId) => {
  	let isMounted = true;
    setRefreshing(true);

    const clearState = new Promise((res, rej) => {
    	setUpcomingRsvs([]);
			setGetUpcomingRsvsState(false);

			setUncompletedRsvs([]);
			setGetUncompletedRsvsState(false);

			setCompletedRsvs([]);
			setGetCompletedRsvsState(false);

			res(true);
    });

    clearState
    .then(() => {
    	if ( isMounted && !getUpcomingRsvsState && dateMoveFromToday >= 0 ) {
				setGetUpcomingRsvsState(true);
				const getUpcomingRsvs = businessGetFire.getUpcomingRsvsOfBus(userId, dateNow, dateMoveFromToday);

				getUpcomingRsvs
				.then((rsvs) => {
					isMounted && setUpcomingRsvs(rsvs);
					setGetUpcomingRsvsState(false);
				})
				.catch((error) => {
					console.log("BusinessManagerReservationScreen: getUpcomingRsvs: ", error);
				});
			}

			if ( isMounted && !getUncompletedRsvsState && dateMoveFromToday <= 0) {
				console.log(dateMoveFromToday);
				setGetUncompletedRsvsState(true);
				const getUncompletedRsvs = businessGetFire.getPreviousRsvsOfBus(userId, dateNow, dateMoveFromToday, false);

				getUncompletedRsvs
				.then((rsvs) => {
					isMounted && setUncompletedRsvs(rsvs);
					setGetUncompletedRsvsState(false);
				})
				.catch((error) => {
					console.log("BusinessManagerReservationScreen: getUncompletedRsvs: ", error);
				});
			}

			if ( isMounted && !getCompletedRsvsState && dateMoveFromToday <= 0) {
				setGetCompletedRsvsState(true);
				const getCompletedRsvs = businessGetFire.getPreviousRsvsOfBus(userId, dateNow, dateMoveFromToday, true);

				getCompletedRsvs
				.then((rsvs) => {
					isMounted && setCompletedRsvs(rsvs);
					setGetCompletedRsvsState(false);
				})
				.catch((error) => {
					console.log("BusinessManagerReservationScreen: getCompletedRsvs: ", error);
				});
			}
    });
  	wait(2000).then(() => setRefreshing(false));

    return () => {
    	isMounted = false;
    }
  }, []);

	return (
		showCalendar
		?
		<MonthCalendar 
			dateNow={dateNow}
			datesOnCalendar={datesOnCalendar}
			setDate={setRsvDate}
			setShowCalendar={setShowCalendar}
      setDateMoveFromToday={setDateMoveFromToday}
		/>
		:
		<View style={{ flex: 1, backgroundColor: color.white2 }}>
			<ScrollView 
				style={styles.managerContainer}
				refreshControl={
	        <RefreshControl 
	        	refreshing={refreshing} 
	        	onRefresh={() => {
		        	onRefresh(dateMoveFromToday, dateNow, user.id) 
			      }}
			    />
			  }
			>
				<View style={styles.controllerContainer}>
					<View style={styles.topControllerContainer}>
						<View style={styles.topControllerLeftCompartment}>
							<TouchableHighlight
								onPress={() => {
									setRsvDate(rsvDate - dayInMs);
									setDateMoveFromToday(dateMoveFromToday - 1);
								}}
								style={styles.controllerButtonTHContainer}
								underlayColor={color.grey1}
							>
								<View style={styles.controllerButtonContainer}>
									{expoIcons.featherMinus(RFValue(23), color.black1)}
								</View>
							</TouchableHighlight>
						</View>
						<View style={styles.topControllerMiddleCompartment}>
							<View style={{ justifyContent: 'center', alignItems: 'center' }}>
								<View style={{ justifyContent: 'center', alignItems: 'center' }}>
									<FontAwesome name="calendar" size={RFValue(23)} color="black" />
								</View>
								<View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
									<View style={{ paddingRight: RFValue(7) }}>
										<Text style={styles.middleCompartmentText}>
											{useConvertTime.convertToMDD(rsvDate)}
										</Text>
									</View>
									<View>
										{
											dateMoveFromToday === 0
											?	null
											: dateMoveFromToday > 0
											? <Text style={styles.middleCompartmentText}>( +{dateMoveFromToday} )</Text>
											: <Text style={styles.middleCompartmentText}>( -{dateMoveFromToday} )</Text>
										}
									</View>
								</View>
							</View>
						</View>
						<View style={styles.topControllerRightCompartment}>
							<TouchableHighlight
								onPress={() => {
									setRsvDate(rsvDate + dayInMs);
									setDateMoveFromToday(dateMoveFromToday + 1);
								}}
								style={styles.controllerButtonTHContainer}
								underlayColor={color.grey1}
							>
								<View style={styles.controllerButtonContainer}>
									{expoIcons.featherPlus(RFValue(23), color.black1)}
								</View>
							</TouchableHighlight>
						</View>
					</View>
				</View>
				
				<View style={styles.contentContainer}>
					{ dateMoveFromToday >= 0
						?
						<View>
							<HeaderBottomLine />
							<View style={styles.labelContainer}>
								<Text style={styles.labelText}>{upcomingRsvs.length} Upcoming</Text>
							</View>
							<HeaderBottomLine />
							{ 
								upcomingRsvs.length > 0
								?
								upcomingRsvs.map(( item, index ) => (
									<TouchableOpacity
										key={index}
										style={styles.rsvContainer}
										delayPressIn={700}
										onPressIn={() => { 
											console.log("longPress");
											setLongPressed(true);
										}}
										onPressOut={() => {
											setLongPressed(false);
										}}
									>
										<RsvInfoCompartment 
											rsv={item} 
											borderLineTop={index > 0}
										/>
									</TouchableOpacity>
								))
								: getUpcomingRsvsState
								?
								<View style={styles.messageContainer}>
									<SpinnerFromActivityIndicator 
										customColor={color.grey1}
									/>
								</View>
								:
								<View style={styles.messageContainer}>
									<Text> Reservations not found</Text>
								</View>
							}
						</View>
						:
						null
					}
					{
						dateMoveFromToday <= 0
						?
						<View>
							<HeaderBottomLine />
							<View style={styles.labelContainer}>
								<Text style={styles.labelText}>{uncompletedRsvs.length} Uncompleted</Text>
							</View>
							<HeaderBottomLine />
							{ 
								uncompletedRsvs.length > 0 && dateMoveFromToday <= 0
								?
								uncompletedRsvs.map(( item, index ) => (
									<TouchableOpacity
										key={index}
										delayPressIn={700}
										onPressIn={() => { 
											console.log("longPress");
											setLongPressed(true);
										}}
										onPressOut={() => {
											setLongPressed(false);
										}}
									>
										{
											index > 0
											&& <HeaderBottomLine />
										}
										<View style={styles.rsvContainer}>
											<RsvInfoCompartment rsv={item}/>
											<View style={styles.actionContainer}>
							  				<TouchableHighlight
								  				onPress={() => {
								  					// send the reservation to the completed list
								  					item.rsv.completed = true
								  					const completedRsvsLen = completedRsvs.length;
								  					let i;
								  					
								  					// empty
								  					if (completedRsvs.length === 0) {
								  						setCompletedRsvs([ item ]);
								  					} 
								  					// only one
								  					else if (completedRsvs.length === 1) {
								  						if (completedRsvs[0].rsv.startAt < item.rsv.startAt) {
								  							setCompletedRsvs([ item, ...completedRsvs]);
								  						} else {
								  							setCompletedRsvs([ ...completedRsvs, item]);
								  						}
								  					}
								  					// more than one
								  					else {
								  						let smallerRsvIndex = completedRsvsLen - 1;
								  						for (i = 0; i < completedRsvsLen; i++) {
									  						if (completedRsvs[i].rsv.startAt < item.rsv.startAt) {
									  							smallerRsvIndex = i;
									  							break;
									  						}
									  					}
							  							setCompletedRsvs([
							  								...completedRsvs.slice(0, smallerRsvIndex),
								  							item,
								  							...completedRsvs.slice(smallerRsvIndex, completedRsvsLen)
								  						])
								  					}
								  					// set a new list of uncompleted reservations
								  					const filteredRsvs = uncompletedRsvs.filter((rsv, index, arr) => {
								  						return ( rsv.id !== item.id )
								  					});
								  					setUncompletedRsvs(filteredRsvs);

								  					//	change on the firestore 
								  					//	completedReservation(
								  					//		rsvId: string, 
								  					//		busId: string, 
								  					//		cusId: string,
								  					//		busLocationType: string,
								  					//		busLocality: string,
								  					//		reservationStartAt: number,
								  					//	)
								  					const completeRsv = businessPostFire.completeReservation(
								  						item.id, 
								  						item.rsv.busId, 
								  						item.rsv.cusId, 
								  						user.locationType, 
								  						user.locality, 
								  						item.rsv.startAt,
								  						item.post.tags,
								  						item.post.service,
								  					);
								  					completeRsv
								  					.then(() => {
								  						console.log("completed a reservation: ", item.id);
								  					})
								  					.catch(() => {
								  						console.log("Error occured: BusinessManagerReservationScreen: completeRsv: ", error);
								  					})
								  				}}
								  				underlayColor={color.grey1}
								  				style={styles.actionButtonContainer}
								  			>
							  					<View style={styles.actionButtonInnerContainer}>
							  						<View style={styles.actionButtonIconContainer}>
							  							<AntDesign name="check" size={RFValue(27)} color={color.back1} />
							  						</View>
							  						<View style={styles.actionButtonTextContainer}>
							  							<Text style={styles.actionButtonText}>Complete</Text>
							  						</View>
							  					</View>
								  			</TouchableHighlight>
								  		</View>
								  	</View>
									</TouchableOpacity>
								))
								: getUncompletedRsvsState
								?
								<View style={styles.messageContainer}>
									<SpinnerFromActivityIndicator 
										customColor={color.grey1}
									/>
								</View>
								:
								<View style={styles.messageContainer}>
									<Text> Reservations not found</Text>
								</View>
							}
						</View>
						: null
					}

					{
						dateMoveFromToday <= 0
						?
						<View>
							<HeaderBottomLine />
							<View style={styles.labelContainer}>
								<Text style={styles.labelText}>{completedRsvs.length} Completed</Text>
							</View>
							<HeaderBottomLine />
							{ 
								completedRsvs.length > 0 && dateMoveFromToday <= 0
								?
								completedRsvs.map(( item, index ) => (
									<TouchableOpacity
										key={index}
										delayPressIn={700}
										onPressIn={() => { 
											console.log("longPress");
											setLongPressed(true);
										}}
										onPressOut={() => {
											setLongPressed(false);
										}}
									>
										{
											index > 0
											&& <HeaderBottomLine />
										}
										<View style={styles.rsvContainer}>
											<RsvInfoCompartment rsv={item}/>
											<View style={styles.actionContainer}>
							  				<TouchableHighlight
								  				onPress={() => {
								  					// send the reservation to the uncompleted list 
								  					item.rsv.completed = false
								  					const uncompletedRsvsLen = uncompletedRsvs.length;
								  					let i;
								  					
								  					if (uncompletedRsvs.length === 0) {
								  						setCompletedRsvs([ item ]);
								  					} 
								  					else if (uncompletedRsvs.length === 1) {
								  						if (uncompletedRsvs[0].rsv.startAt > item.rsv.startAt) {
								  							setCompletedRsvs([ item, ...completedRsvs]);
								  						} else {
								  							setCompletedRsvs([ ...completedRsvs, item]);
								  						}
								  					}
								  					else {
								  						let smallerRsvIndex = uncompletedRsvsLen - 1;
								  						for (i = 0; i < uncompletedRsvsLen; i++) {
									  						if (completedRsvs[i].rsv.startAt < item.rsv.startAt) {
									  							smallerRsvIndex = i;
									  							break;
									  						}
									  					}
							  							setCompletedRsvs([
							  								...completedRsvs.slice(0, smallerRsvIndex),
								  							item,
								  							...completedRsvs.slice(smallerRsvIndex, completedRsvsLen)
								  						])
								  					}

								  					// set a new list of completed reservations
								  					const filteredRsvs = completedRsvs.filter((rsv, index, arr) => {
								  						return ( rsv.id !== item.id )
								  					});
								  					setCompletedRsvs(filteredRsvs);

								  					// change firestore 
								  					const uncompleteRsv = businessPostFire.uncompleteReservation(item.id);
								  					uncompleteRsv
								  					.then(() => {
								  						console.log("uncompleted a reservation: ", item.id);
								  					})
								  					.catch(() => {
								  						console.log("Error occured: BusinessManagerReservationScreen: uncompleteRsv: ", error);
								  					})
								  				}}
								  				underlayColor={color.grey1}
								  				style={styles.actionButtonContainer}
								  			>
							  					<View style={styles.actionButtonInnerContainer}>
							  						<View style={styles.actionButtonIconContainer}>
							  							<AntDesign name="check" size={RFValue(27)} color={color.blue1} />
							  						</View>
							  						<View style={styles.actionButtonTextContainer}>
							  							<Text style={styles.actionButtonText}>Cancel</Text>
							  						</View>
							  					</View>
								  			</TouchableHighlight>
								  		</View>
								  	</View>
									</TouchableOpacity>
								))
								: getCompletedRsvsState
								?
								<View style={styles.messageContainer}>
									<SpinnerFromActivityIndicator 
										customColor={color.grey1}
									/>
								</View>
								:
								<View style={styles.messageContainer}>
									<Text> Reservations not found</Text>
								</View>
							}
						</View>
						: null
					}
				</View>
				{
					longPressed
					?
					<View style={{
						position: 'absolute',
						width: '100%',
						height: '100%',
						justifyContent: 'center',
						alignItems: 'center',
					}}>
						<View style={{
							width: '90%',
							height: '90%',
							backgroundColor: '#fff',
							borderWidth: 1,
						}}>

						</View>
					</View>
					: null
				}
			</ScrollView>
			<TouchableOpacity
  			style={{ 
  				position: 'absolute', 
  				backgroundColor: color.red1,
  				height: RFValue(70), 
  				width: RFValue(70), 
  				borderRadius: RFValue(100),
  				justifyContent: 'center',
  				alignItems: 'center',
  				marginTop: windowHeight*0.685,
  				marginLeft: windowWidth*0.75,
          shadowColor: "#000",
					shadowOffset: {
						width: 0,
						height: 2,
					},
					shadowOpacity: 0.25,
					shadowRadius: 3.84,

					elevation: 5,
  			}}
  		>
  			<View 
  				style={{ 
  					flex: 1, 
  					justifyContent: 'center',
  					alignItems: 'center',
  				}}>
  					<FontAwesome name="calendar-plus-o" size={RFValue(23)} color={color.white2} />
  			</View>	
  		</TouchableOpacity>
		</View>
  );
};

const styles = StyleSheet.create({
	managerContainer: {
		backgroundColor: '#fff',
	},

	contentContainer: {
		backgroundColor: '#fff',
	},
	rsvContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row'
	},
	rsvInfoCompartment: {
		flex: 2.5
	},
	messageContainer: {
		paddingVertical: RFValue(11),
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	labelContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: RFValue(7),
	},
	labelText: {
		fontSize: RFValue(19),
		fontWeight: 'bold',
	},
	timeContainer: {
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: RFValue(7),
	},
	timeText: {
		fontSize: RFValue(23),
		fontWeight: 'bold',
	},
	rsvInfoContainer: {
		width: '100%',
		flexDirection: 'row',
		paddingVertical: RFValue(3),
	},
	techContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: RFValue(3),
	},
	cusContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: RFValue(3),
	},
	postContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: RFValue(3),
	},

	actionContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: RFValue(3),
	},
	actionButtonContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		width: RFValue(57), 
		height: RFValue(57),
		borderWidth: 0.3,
		borderRadius: RFValue(13)
	},
	actionButtonInnerContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	actionButtonIconContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	actionButtonTextContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: RFValue(3),
	},
	actionButtonText: {
		fontSize: RFValue(11),
	},

	statusLabelContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: RFValue(3),
	},

	// Controller
	controllerContainer: {
		backgroundColor: '#fff',
	},
	topControllerContainer: {
		paddingVertical: RFValue(13),
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	topControllerLeftCompartment: {
		paddingLeft: RFValue(11),
		justifyContent: 'center',
		alignItems: 'center',
	},
	topControllerRightCompartment: {
		paddingRight: RFValue(11),
		justifyContent: 'center',
		alignItems: 'center',
	},
	controllerButtonTHContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute', 
		width: RFValue(77), 
		height: RFValue(77), 
		borderRadius: RFValue(77)
	},
	controllerButtonContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	middleCompartmentText: {
		fontSize: RFValue(19),
		fontWeight: 'bold'
	},
});

export default BusinessManagerReservationScreen;
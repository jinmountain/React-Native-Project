import React, { useState, useRef } from 'react';
import {
	Image,
	View,
	Text,
	Animated,
	Pressable,
	Linking,
	StyleSheet,
	TouchableOpacity,
	TouchableHighlight,
	ScrollView,
	Dimensions,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useCardAnimation } from '@react-navigation/stack';

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Color
import color from '../../color';

// Hooks
import businessPostFire from '../../firebase/businessPostFire';
import useConvertTime from '../../hooks/useConvertTime';

// Designs
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

// Components
import MainTemplate from '../../components/MainTemplate';
import HeaderBottomLine from '../../components/HeaderBottomLine';
import DefaultUserPhoto from '../../components/defaults/DefaultUserPhoto';
import THButtonWithBorder from '../../components/buttons/THButtonWithBorder';
import SpinnerFromActivityIndicator from '../../components/ActivityIndicator';
import BasicLocationMap from '../../components/BasicLocationMap';

// icon
import expoIcons from '../../expoIcons';

const ConfirmationPage = ({ 
	rsvRequestResult,
	gridTime,
	pickedDisplayPost, 
	busLocationCoord, 
	busGooglemapsURL, 
	busLocationType,
	businessUserPhotoURL,
	selectedTechPhotoURL,
	windowWidth,
	navigation
}) => {
	return (
		<View style={styles.cfmPageContainer}>
			<View style={styles.cfmHeaderContainer}>
				<View style={styles.compartmentOuter}>
					<View style={styles.leftCompartmentContainer}>
            <TouchableOpacity 
              style={ 
                styles.compartmentHighlight 
              }
              onPress={() => { navigation.goBack() }}
            >
              <View style={styles.compartment}>
                <View style={styles.compartmentIconContainer}>
                  <Ionicons name="md-arrow-back" size={RFValue(27)} color={color.black1} />
                </View>
              </View>
            </TouchableOpacity>
	        </View>
	        <View style={styles.middleCompartmentContainer}>
	        	{ 
		        	rsvRequestResult === 'successful'
		        	&&
	          	<TouchableOpacity 
	              style={ styles.midCompartmentHighlight }
	              onPress={() => { 
	              	navigation.navigate("ActivityTab", {
	              		screen: 'UserRsvStack', 
              			params: {
              				screen: 'UserRsv',
              				params: {
              					screenRefresh: true,
              				}
              			}
		              });
		            }}
	            >
	              <View style={styles.compartment}>
                  <View style={styles.compartmentIconContainer}>
                    <MaterialCommunityIcons name="mirror" size={RFValue(27)} color={color.black1} />
                  </View>
                  <View style={styles.compartmentTextContainer}>
                    <Text style={styles.compartmentText}> Go to Reservations</Text>
                  </View>
	              </View>
	            </TouchableOpacity>
	          }
          </View>
	        <View style={styles.rightCompartmentContainer}>
            <TouchableOpacity 
              style={styles.compartmentHighlight}
              onPress={() => { navigation.goBack() }}
            >
              <View style={styles.compartment}>
                <View style={styles.compartmentIconContainer}>
                  <AntDesign name="close" size={RFValue(27)} color={color.black1} />
                </View>
              </View>
            </TouchableOpacity>
	        </View>
	      </View>
        <HeaderBottomLine />
			</View>
			<ScrollView 
				showsVerticalScrollIndicator={false}
	      scrollEventThrottle={16}
			>
				<View style={styles.cfmTitleContainer}>
					<View style={styles.cfmTitleIconContainer}>
						{
							rsvRequestResult === 'successful'
							? <AntDesign name="checkcircleo" size={RFValue(33)} color={color.black1} />
							: rsvRequestResult === 'taken'
							? <AntDesign name="closecircleo" size={RFValue(33)} color={color.black1} />
							: <AntDesign name="closecircleo" size={RFValue(33)} color={color.black1} />
						}
					</View>
					<View style={styles.cfmTitleTextContainer}>
						{
							rsvRequestResult === 'successful'
							? <Text style={styles.cfmTitleText}>Reservation Complete</Text>
							: rsvRequestResult === 'taken'
							? <Text style={styles.cfmTitleText}>Who was that!?</Text>
							: <Text style={styles.cfmTitleText}>Error</Text>
						}
					</View>
				</View>
				<View style={styles.cfmContent}>
					{
						rsvRequestResult === 'successful'
						? 
						<View style={styles.cfmMessageContainer}>
							<Text style={styles.cfmMessageText}>Enjoy your service.</Text>
						</View>
						: rsvRequestResult === 'taken'
						? 
						<View style={styles.cfmMessageContainer}>
							<Text style={styles.cfmMessageText}>The time you chose is taken already.</Text>
							<Text style={styles.cfmMessageText}>Catch another time.</Text>
							<FontAwesome5 name="sad-tear" size={RFValue(23)} color={color.black1} />
						</View>
						: 
						<View style={styles.cfmMessageContainer}>
							<Text style={styles.cfmMessageText}>Something went wrong.</Text>
							<Text style={styles.cfmMessageText}>Try again.</Text>
							<Ionicons name="sad-outline" size={RFValue(23)} color={color.black1} />
						</View>
					}
					{
						rsvRequestResult === 'successful'
						?
						<View style={styles.cfmRsvInfoContainer}>
							<View style={styles.cfmDateContainer}>
								<Text style={styles.cfmInfoText}>{gridTime.month}, {gridTime.date}, {gridTime.day}</Text>
							</View>
							<View style={styles.cfmTimeContainer}>
								<Text style={styles.cfmInfoText}>{gridTime.normalHour}:{gridTime.normalMin} {gridTime.pmOrAm}</Text>
							</View>
						</View>
						: null
					}
					{
						rsvRequestResult === 'successful'
						&&
						<View style={styles.cfmPostContainer}>
							<View style={styles.cfmImageContainer}>
								{
		              pickedDisplayPost && pickedDisplayPost.data.files[0] && pickedDisplayPost.data.files[0].type === 'image'
		              ?
		              <Image 
		                source={{ uri: pickedDisplayPost.data.files[0].url }}
		                style={{ width: windowWidth, height: windowWidth }}
		              />
		              : pickedDisplayPost && pickedDisplayPost.data.files[0] && pickedDisplayPost.data.files[0].type === 'video'
		              ?
		              <Video
		                // ref={video}
		                style={{ width: windowWidth, height: windowWidth }}
		                source={{ uri: pickedDisplayPost.data.files[0].url }}
		                useNativeControls={false}
		                resizeMode="contain"
		                shouldPlay={false}
		              />
		              : null
		            }
							</View>
							<View style={styles.serviceTitleContainer}>
								<Text style={styles.serviceTitleText}>{pickedDisplayPost.data.title}</Text>
								<Text><Entypo name="dot-single" size={RFValue(13)} color={color.grey7} /></Text>
								<View style={styles.cfmTechImageContainer}>
									{
										selectedTechPhotoURL
										?
										<View>
											<Image source={{ uri: selectedTechPhotoURL}} style={styles.cfmTechImage}/>
										</View>
										: <DefaultUserPhoto customSizeBorder={RFValue(27)} customSizeUserIcon={RFValue(17)}/>
									}
								</View>
							</View>
							<View style={styles.cfmPostInfoContainer}>
								<Text style={styles.cfmInfoText}>
									{expoIcons.dollarSign(RFValue(23), color.black1)} 
									{pickedDisplayPost.data.price}
								</Text>
								<Text><Entypo name="dot-single" size={RFValue(13)} color={color.grey7} /></Text>
								<Text style={styles.cfmInfoText}>{useConvertTime.convertEtcToHourMin(pickedDisplayPost.data.etc)}</Text>
							</View>
						</View>
					}
				</View>
				{
					rsvRequestResult === 'successful'
					?
					<View
			      style={styles.mapContainer}
			    >
			    	<View
				      style={styles.map}
				    >
							<BasicLocationMap 
								locationCoord={busLocationCoord} 
								businessUserPhotoURL={businessUserPhotoURL}
							/>
						</View>
						<View style={styles.mapButtonContainer}>
	            <THButtonWithBorder
	              icon={expoIcons.featherMap(RFValue(23), color.black1)}
	              text={"Open Google Maps"} 
	              onPress={() => {
	                Linking.openURL(busGooglemapsURL);
	              }}
	            />
	          </View>
						{/*<TouchableOpacity 
							style={styles.mapTouchCover}
							onPress={() => {
								busGooglemapsURL
								?
								Linking.openURL(busGooglemapsURL)
								: null
							}}
						>
							<View>
							</View>
						</TouchableOpacity>*/}
					</View>
					: null
				}
			</ScrollView>
		</View>
	)
};

const paymentTypes = [ "payAtStore", "defaultCard", "preferredCard", "applePay" ];

const ReservationRequestScreen = ({ route, navigation }) => {
	const { 
		businessUserId, 
		businessUserUsername, 
		businessUserPhotoURL,
		businessUserLocationType,
		businessUserLocality,

		businessGooglemapsUrl,
		businessLocationCoord,

		selectedTechId,
		selectedTechUsername, 
		selectedTechPhotoURL, 
		userId, 
		pickedDisplayPost, 
		gridTime 
	} = route.params;

	const { colors } = useTheme();
	const { current } = useCardAnimation();

	// screen controls
	const [ windowWidth, setWindowWidth ] = useState(Dimensions.get("window").width);

	// Select payment type 
	const [ selectPaymentType, setSelectPaymentType ] = useState("defaultCard");

	// rsv request state
	const [ rsvRequestState, setRsvRequestState ] = useState(false);

	// three possible results
	// - successful
	// - taken
	// - error
	const [ rsvRequestResult, setRsvRequestResult ] = useState(null);

	return (
		<MainTemplate>
			<View style={styles.rsvConfirmationContainer}>
				<Pressable 
					style={[
						StyleSheet.absoluteFill,
						{ backgroundColor: 'rgba(0, 0, 0, 0.5)' },
					]}
					onPress={navigation.goBack}
				>

				</Pressable>
				<Animated.View 
					style={{
						width: '90%',
						height: '100%',
						borderRadius: RFValue(3),
						backgroundColor: colors.card,
						transform: [
							{
								scale: current.progress.interpolate({
									inputRange: [0, 1],
									outputRange: [0.9, 1],
									extrapolate: 'clamp',
								}),
							},
						],
					}}
				>	
					{
						rsvRequestResult
						?
						<ConfirmationPage 
							rsvRequestResult={rsvRequestResult}
							gridTime={gridTime}
							pickedDisplayPost={pickedDisplayPost}
							busLocationCoord={businessLocationCoord}
							busGooglemapsURL={businessGooglemapsUrl}
							busLocationType={businessUserLocationType}
							businessUserPhotoURL={businessUserPhotoURL}
							selectedTechPhotoURL={selectedTechPhotoURL}
							windowWidth={windowWidth}
							navigation={navigation}
						/>
						:
						<View style={{ flex: 1, padding: RFValue(10) }}>
							<View style={styles.titleContainer}>
								<Text style={styles.titleText}>Reservation</Text>
							</View>
							<HeaderBottomLine />
							<View style={styles.businessContainer}>
								<View style={styles.labelContainer}>
									<Text style={styles.labelText}>Business</Text>
								</View>
								<View style={styles.infoContainer}>
									{
										businessUserPhotoURL
										?
										<View style={styles.imageContainer}>
											<Image source={{ uri: businessUserPhotoURL }} style={styles.businessImage}/>
										</View>
										: <DefaultUserPhoto customSizeBorder={RFValue(37)} customSizeUserIcon={RFValue(21)}/>
									}
									<View>
										<Text 
											numberOfLines={1}
											style={styles.minorInfoText}
										>
											{businessUserUsername}
										</Text>
									</View>
								</View>
							</View>
							<HeaderBottomLine />
							<View style={styles.rsvPickedDisplayPostContainer}>
								<View style={styles.labelContainer}>
									<Text style={styles.labelText}>Design</Text>
								</View>
								<View style={styles.infoContainer}>
									<View style={styles.imageContainer}>
										<Image source={{ uri: pickedDisplayPost.data.files[0].url }} style={styles.rsvPostImage}/>
									</View>
									<View>
										<Text 
											numberOfLines={1}
											style={styles.minorInfoText}
										>
											{pickedDisplayPost.data.title}
										</Text>
									</View>
								</View>
							</View>
							<HeaderBottomLine />
							<View style={styles.rsvSelectedTechContainer}>
								<View style={styles.labelContainer}>
									<Text style={styles.labelText}>Technician</Text>
								</View>
								<View style={styles.infoContainer}>
									{
										selectedTechPhotoURL
										?
										<View style={styles.imageContainer}>
											<Image source={{ uri: selectedTechPhotoURL}} style={styles.rsvTechImage}/>
										</View>
										: <DefaultUserPhoto customSizeBorder={RFValue(37)} customSizeUserIcon={RFValue(21)}/>
									}
									<View>
										<Text 
											numberOfLines={1}
											style={styles.minorInfoText}
										>
											{selectedTechUsername}
										</Text>
									</View>
								</View>
							</View>
							<HeaderBottomLine />
							<View style={styles.rsvInfoContainer}>
								<View style={styles.labelContainer}>
									<Text style={styles.labelText}>Time & Price</Text>
								</View>
								<View style={styles.infoContainer}>
									<View style={styles.rsvDateContainer}>
										<Text style={styles.majorInfoText}>{gridTime.month}, {gridTime.date}, {gridTime.day}</Text>
									</View>
									<View style={styles.rsvTimeContainer}>
										<Text style={styles.majorInfoText}>{gridTime.normalHour}:{gridTime.normalMin} {gridTime.pmOrAm}</Text>
										<Text><Entypo name="dot-single" size={RFValue(13)} color="black" /></Text>
										<View style={styles.rsvEtc}>
											<Text style={styles.majorInfoText}>{useConvertTime.convertEtcToHourMin(pickedDisplayPost.data.etc)}</Text>
										</View>
									</View>
									<View style={styles.rsvPriceContainer}>
										<View style={styles.rsvPrice}>
											<Text style={styles.majorInfoText}>
												{expoIcons.dollarSign(RFValue(17), color.black1)}
												{pickedDisplayPost.data.price}
											</Text>
										</View>
									</View>
								</View>
							</View>
							<HeaderBottomLine />
							<View style={styles.paymentOptionsContainer}>
								<View style={styles.paymentLabelContainer}>
									<Text style={styles.labelText}>Payment Types</Text>
								</View>
								<View style={styles.infoContainer}>
									<ScrollView
										fadingEdgeLength={10}
									>
										<View style={styles.paymentTypeContainer}>
											<THButtonWithBorder 
												icon={<AntDesign name="isv" size={RFValue(15)} color={color.black1} />}
												text={"Pay at Store"}
												onPress={() => {
													console.log("Pay at Store");
												}} 
												value={ selectPaymentType === "payAtStore" ? true : false }
												valueEffect ={{ backgroundColor: color.blue1 }}
											/>
										</View>
										<View style={styles.paymentTypeContainer}>
											<THButtonWithBorder 
												icon={<AntDesign name="creditcard" size={RFValue(15)} color={color.black1} />}
												text={"Default Card"}
												onPress={() => {
													console.log("Pay at Store");
												}} 
												value={ selectPaymentType === "atStore" ? true : false }
												valueEffect ={{ backgroundColor: color.blue1 }}
											/>
										</View>
										<View style={styles.paymentTypeContainer}>
											<THButtonWithBorder 
												icon={<AntDesign name="creditcard" size={RFValue(15)} color={color.black1} />}
												text={"Add New Payment Method"}
												onPress={() => {
													console.log("Pay at Store");
												}} 
												value={ selectPaymentType === "atStore" ? true : false }
												valueEffect ={{ backgroundColor: color.blue1 }}
											/>
										</View>
									</ScrollView>
								</View>
							</View>
							<View style={styles.actionContainer}>
								<TouchableHighlight
									style={{ 
										...styles.buttonContainer, 
										...{
											borderBottomLeftRadius: RFValue(7),
											borderBottomRightRadius: RFValue(7)
										} 
									}}
									onPress={() => {
										setRsvRequestState(true);
										const sendRsvRequest = businessPostFire
										.sendRsvRequest(
											businessUserId,
											businessUserLocationType,
											businessUserLocality,
											selectedTechId,
											userId,
											pickedDisplayPost.id,
											pickedDisplayPost.data.service,
											pickedDisplayPost.data.etc,
											gridTime.timestamp
										);
										sendRsvRequest
										.then((result) => {
											if (result) {
												setRsvRequestResult('successful');
											}
											else {
												setRsvRequestResult('taken');
											}
											setRsvRequestState(false);
										})
										.catch((error) => {
											console.log("Error occured: ReservationRequestScreen: sendRsvRequest: ", error);
											setRsvRequestState(false);
											setRsvRequestResult('error');
										})
									}}
									underlayColor={color.grey4}
								>
									<View style={styles.buttonInner}>
										{
											rsvRequestState
											?
											<SpinnerFromActivityIndicator customSize={'small'}/>
											:
											<Text style={styles.buttonText}>
												Confirm
											</Text>
										}
										
									</View>
								</TouchableHighlight>
								<TouchableHighlight
									style={{ 
										...styles.buttonContainer, 
										...{
											borderTopLeftRadius: RFValue(7),
											borderTopRightRadius: RFValue(7),
											marginTop: RFValue(7),
										} 
									}}
									onPress={() => {
										navigation.goBack();
									}}
									underlayColor={color.grey4}
								>
									<View style={styles.buttonInner}>
										<Text style={styles.buttonText}>
											Cancel
										</Text>
									</View>
								</TouchableHighlight>
							</View>
						</View>
					}
				</Animated.View>
			</View>
		</MainTemplate>
	)
}

const styles = StyleSheet.create({
	rsvConfirmationContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	confirmationBox: {
		// backgroundColor: "#fff",
		// borderWidth: 1,
		// width: '70%',
		// height: '70%',
		// shadowColor: "#000",
	 //  shadowOffset: { width: 0, height: -2 },
	 //  shadowOpacity: 0.3,
	 //  shadowRadius: 3,
	 //  elevation: 7,
	},
	titleContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: RFValue(3),
	},
	titleText: {
		fontSize: RFValue(19),
		fontWeight: 'bold',
	},
	labelContainer: {
		justifyContent: 'center',
		flex: 1,
	},
	paymentLabelContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: RFValue(7)
	},
	labelText: {
		fontWeight: 'bold',
		fontSize: RFValue(17),
	},
	infoContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: RFValue(7),
		flex: 2,
	},
	imageContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	businessContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	businessImage: {
		borderRadius: RFValue(100),
		width: RFValue(37),
		height: RFValue(37),
	},
	rsvPostImage: {
		width: RFValue(37),
		height: RFValue(37),
	},
	rsvTechImage: {
		borderRadius: RFValue(100),
		width: RFValue(37),
		height: RFValue(37),
	},
	rsvPickedDisplayPostContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
		flexDirection: 'row',
	},
	rsvSelectedTechContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	rsvInfoContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	rsvPriceContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	rsvTimeContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	majorInfoText: {
		fontSize: RFValue(17),
		fontWeight: 'bold',
	},
	minorInfoText: {
  	fontSize: RFValue(17)
  },

	paymentOptionsContainer: {
		flex: 2.5,
		justifyContent: 'center',
		alignItems: 'center',
	},
	paymentTypeContainer: {
		paddingVertical: RFValue(3),
	},

	actionContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	},
	buttonContainer: {
		flex: 1,
		width: '100%',
		backgroundColor: "#fff",
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 0.3,
		borderRadius: 15,
	},
	buttonText: {
		fontSize: RFValue(17),
		fontWeight: 'bold',
	},

	cfmPageContainer: {
		flex: 1,
	},
	mapContainer: {
		width: '100%',
		height: RFValue(300),
	},
	mapTouchCover: {
		position: 'absolute',
		width: '100%',
		height: RFValue(300),
	},
	map: {
		width: '100%',
		height: RFValue(300),
	},
	mapButtonContainer: {
    position: 'absolute', 
    alignSelf: 'center', 
    marginTop: RFValue(17)
  },
	cfmImage: {
		width: '100%',
		height: RFValue(200),
	},
	cfmTitleContainer: {
		backgroundColor: color.white2,
	},
	cfmTitleIconContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: RFValue(7)
	},
	cfmTitleTextContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: RFValue(3)
	},
	cfmTitleText: {
		fontSize: RFValue(23)
	},
	cfmMessageContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: RFValue(7),
	},
	cfmMessageText: {
		fontSize: RFValue(17)
	},
	serviceTitleContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: RFValue(3),
		flexDirection: 'row',
	},
	serviceTitleText: {
		fontSize: RFValue(21)
	},

	cfmDateContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	cfmTimeContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	cfmInfoText: {
		fontSize: RFValue(23),
		fontWeight: 'bold',
		color: color.black1
	},
	cfmTechImageContainer: {

	},
	cfmTechImage: {
		borderRadius: RFValue(100),
		width: RFValue(27),
		height: RFValue(27),
	},
	cfmRsvInfoContainer: {
		paddingVertical: RFValue(3)
	},
	cfmPostContainer: {
		paddingVertical: RFValue(9)
	},
	cfmPostInfoContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},

	cfmHeaderContainer: {
		height: '8%',
	},

	compartment: {
		width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compartmentIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  compartmentTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  compartmentText: {
    fontSize: RFValue(17),
  },
  compartmentOuter: {
  	flex: 1,
  	height: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  leftCompartmentContainer: {
  	flex: 1,
  },
  middleCompartmentContainer: {
  	flex: 3,
  	paddingHorizontal: RFValue(3)
  },
  rightCompartmentContainer: {
  	flex: 1,
  },

  compartmentHighlight: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  midCompartmentHighlight: {
  	justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RFValue(12),
    borderWidth: 0.5,
    paddingVertical: RFValue(3)
  },
});

export default ReservationRequestScreen;
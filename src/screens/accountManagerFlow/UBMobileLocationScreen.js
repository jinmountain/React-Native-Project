import React, { useState, useContext }from 'react';
import { 
	Text,
	StyleSheet, 
	View,
	TouchableOpacity,
	FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import { HeaderForm } from '../../components/HeaderForm';
import { InputFormBottomLine } from '../../components/InputFormBottomLine';
import BusinessLocationMap from '../../components/BusinessLocationMap';

// Hooks
import useLocation from '../../hooks/useLocation';
import { useIsFocused } from '@react-navigation/native';

// Context
import { Context as LocationContext } from '../../context/LocationContext';
import { Context as AuthContext } from '../../context/AuthContext';

// Designs
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Feather';
import { FontAwesome } from '@expo/vector-icons';

const UBMobileLocationScreen = ({ navigation }) => {
	const isFocused = useIsFocused();
	const { 
		state: { user },
	} = useContext(AuthContext);
	const { 
		state: {
			currentLocation,
			businessLocation,
		},
		addLocation,
		clearBusinessLocation, 
		addBusinessLocation,
	} = useContext(LocationContext);
	const [locationError] = useLocation(isFocused, addLocation);
	return (
		<SafeAreaView style={styles.screenContainer}>
			<HeaderForm 
				leftButtonTitle="Back"
		    headerTitle={<FontAwesome name="map-o" size={RFValue(20)} color="black" />}
		    rightButtonTitle={
		    	businessLocation !== null
		    	? <AntDesign name="check" size={RFValue(24)} color="#0760D4" />
		    	: null
		    }
		    leftButtonPress={() => {
		    	navigation.goBack(); 
		    	clearBusinessLocation();
		    }}
    		rightButtonPress={() => {
    			businessLocation !== null
    			? navigation.goBack()
    			: null
    		}}
		  />

			<View style={styles.locationGuideContainer}>
				{ locationError 
					? null
					: businessLocation !== null
					?	<Text style={styles.guideText}>
							Hold and drag {<AntDesign name="isv" size={RFValue(20)} color="#0760D4" />} to place on a different location
						</Text>
					: <Text style={styles.guideText}>
							Add current location using the button below
						</Text>
				}
			</View>

			<View style={styles.mapControlContainer}>
				{locationError 
					? <View style={styles.locationErrorContainer}>
							<Text style={styles.errorText}>Please enable your location service</Text>
						</View>
					: null
				}
				<BusinessLocationMap 
					currentBusinessLocation={
						user.location
						? user.location
						: null
					}
				/>
				{locationError
					? null
					: <View style={styles.addLocationButtonContainer}>
							<TouchableOpacity 
								style={styles.addLocationButton}
								onPress={() => {
									addBusinessLocation(
										{ geometry: 
											{ location: 
												{ 
													lat: currentLocation.latitude, 
													lng: currentLocation.longitude 
												}
											}
										}
									);
								}}
							>
								<Text>
									Add Current Location
								</Text>
							</TouchableOpacity>
							{ 
								businessLocation 
								?
								<TouchableOpacity 
									style={styles.addLocationButton}
									onPress={() => {
										clearBusinessLocation();
									}}
								>
									<Text>
										Reset
									</Text>
								</TouchableOpacity>
								: null
							}
						</View>
				}
			</View>
		</SafeAreaView>
	)
};

const styles = StyleSheet.create({
	screenContainer: {
		flex: 1,
		backgroundColor: "#F9F9F9",
	},
	locationGuideContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	mapControlContainer: {
		flex: 9
	},
	locationErrorContainer: {
		position: 'absolute',
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: "#909090",
		padding: 10,
		borderRadius: 10,
	},
	errorText: {
		color: "#F9F9F9"
	},
	addLocationButtonContainer: {
		position: 'absolute',
		flexDirection: 'row',
		alignSelf: 'center',
		marginTop: '5%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	addLocationButton: {
		paddingVertical: 7,
		paddingHorizontal: 7,
		borderWidth: 0.5,
		borderRadius: 5,
		borderColor: "#E0E0E0",
		backgroundColor: '#F9F9F9',
		marginHorizontal: 2,
	},
});

export default UBMobileLocationScreen;

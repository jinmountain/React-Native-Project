import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Context as LocationContext } from '../context/LocationContext';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import SpinnerFromActivityIndicator from '../components/ActivityIndicator';

// Design
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

// Color
import color from '../color';

// Hooks

const BusinessLocationMap = ({
		currentBusinessLocation, 
	}) => {
	const { 
		state: { currentLocation, businessLocation }, 
		dragAddBusinessLocation,
		// addAddress,
		// clearAddress,
	} = useContext(LocationContext);

	if (!currentLocation) {
		return <View style={styles.spinnerContainer}><SpinnerFromActivityIndicator /></View>;
	}
	// three markers
	// 1. current location
	// 2. current business location
	// 3. new business location
	return (
		<MapView 
			provider={PROVIDER_GOOGLE}
			style={styles.map} 
			initialRegion={{
				...currentLocation,
				latitudeDelta: 0.01,
				longitudeDelta: 0.01
			}}
		>
			{ 
				businessLocation
				? null
				:
				<Marker
					key={'currrentLocation'}
					coordinate={{
						...currentLocation,
					}}
				>
					<Entypo name="location-pin" size={RFValue(37)} color={color.blue1} />
				</Marker>
			}
			
			{ businessLocation
				?
				<Marker draggable
					key={'newBusinessLocation'}
					coordinate={{ 
						"latitude": businessLocation.geometry.location.lat,
						"longitude": businessLocation.geometry.location.lng
					}}
					onDragEnd={
						(e) => {
							dragAddBusinessLocation(
								{ geometry: 
									{ location: 
										{ 
											lat: e.nativeEvent.coordinate.latitude, 
											lng: e.nativeEvent.coordinate.longitude 
										}
									}
								}
							);
						}
					}
				>
					<Entypo name="shop" size={RFValue(27)} color={color.blue1} />
				</Marker>
				: null
			}
			{ currentBusinessLocation &&
				<Marker
					key={'currentBusinessLocation'}
					coordinate={{
						"latitude": {...currentBusinessLocation}.lat,
						"longitude": {...currentBusinessLocation}.lng,
					}}
				>
					<Entypo name="shop" size={RFValue(27)} color={color.blue1} />
				</Marker>
			}
		</MapView>
	)
};

const styles = StyleSheet.create({
	map: {
		flex: 1,
	},
	spinnerContainer: {
		flex: 1, 
		justifyContent: 'center', 
		alignItems: 'center',
	}
});

export default BusinessLocationMap;
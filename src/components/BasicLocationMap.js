import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import SpinnerFromActivityIndicator from '../components/ActivityIndicator';

// Design
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

// Color
import color from '../color';

// Hooks

const BusinessLocationMap = ({ locationCoord, businessUserPhotoURL }) => {
	return (
		<MapView 
			provider={PROVIDER_GOOGLE}
			style={styles.map} 
			initialRegion={{
				...locationCoord,
				latitudeDelta: 0.01,
				longitudeDelta: 0.01
			}}
		>
			{ locationCoord &&
				<Marker
					key={'location'}
					coordinate={locationCoord}
				>
					<View>
						{
							businessUserPhotoURL
							?
							<Image 
	              style={styles.userPhoto} 
	              source={{uri: businessUserPhotoURL}} 
	            />
	            :
	            <Ionicons name="ios-location-sharp" size={RFValue(27)} color={color.blue1} />
	          }
					</View>
				</Marker>
			}
		</MapView>
	)
};

const styles = StyleSheet.create({
	map: {
		flex: 1,
		borderRadius: RFValue(7),
	},
  userPhoto: {
    justifyContent: 'center',
    alignItems: 'center',
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: 100,
  }
});

export default BusinessLocationMap;
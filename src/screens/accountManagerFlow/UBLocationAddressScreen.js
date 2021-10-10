import React, { useState, useContext, useEffect }from 'react';
import { 
	Text,
	StyleSheet, 
	View,
	Image,
	TouchableOpacity,
	TouchableHighlight, 
	TextInput,
	FlatList,
	ScrollView } from 'react-native';
import { SafeAreaView, } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import { HeaderForm } from '../../components/HeaderForm';

// Context
import { Context as LocationContext } from '../../context/LocationContext';
import { Context as AuthContext } from '../../context/AuthContext';

// Hooks

// Color codes
import color from '../../color';

// Firestore
import businessUpdateFire from '../../firebase/businessUpdateFire';

// Designs
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const UBLocationAddressScreen = ({ navigation }) => {
	const { 
		state: { user },
	} = useContext(AuthContext);

	const { 
		state: {
			locationType,
			businessLocation,
		},
		clearLocationType,
		clearBusinessLocation,
		resetLocationsAddress,
	} = useContext(LocationContext);

	useEffect(() => {
		return () => {
			resetLocationsAddress();
		}
	}, [])

	return (
		<SafeAreaView style={styles.screenContainer}>
			<HeaderForm 
				leftButtonTitle="Back"
		    headerTitle="Edit Location & Address" 
		    rightButtonTitle={ locationType !== null || businessLocation !== null ? "Done" : null }
		    leftButtonPress={() => {
		    	navigation.goBack(); 
		    	resetLocationsAddress();
		    }}
    		rightButtonPress={() => {
    			if (locationType !== null || businessLocation !== null) {
    				const newLocation = { ...businessLocation, ...{ locationType: locationType }};
    				const updateLocation = businessUpdateFire.businessUpdateLocation(newLocation, user.locality, user.service);
    				updateLocation
    				.then(() => {
    					resetLocationsAddress();
    					navigation.goBack();
    				})
    				.catch((error) => {
    					console.log("Error occured:  updateLocation: ", error);
    				})
    			}
    		}}
		  />
		  <View style={styles.progressBarContainer}>
		  	<TouchableOpacity 
		  		style={
		  			{ ...styles.progressBar, ...{backgroundColor: color.skyblue1}}
		  		}
		  	>
					<AntDesign name="smileo" size={RFValue(20)} color={color.black1} />
		  	</TouchableOpacity>
		  	<TouchableOpacity 
		  		style={
		  			locationType
		  			? { ...styles.progressBar, ...{backgroundColor: color.skyblue1}}
		  			: styles.progressBar
		  		}
		  		onPress={() => { 
		  			navigation.navigate("UBInStoreMobile");
			    	clearLocationType();
			    	clearBusinessLocation();
		  		}}
		  	>
		  		<AntDesign name="isv" size={RFValue(20)} color={color.black1} />
		  		<View style={{borderWidth: 1, marginHorizontal: 2}}></View>
	  			<AntDesign name="rocket1" size={RFValue(20)} color={color.black1} />
		  	</TouchableOpacity>
		  	<TouchableOpacity 
		  		style={
		  			businessLocation
		  			? { ...styles.progressBar, ...{backgroundColor: color.skyblue1}}
		  			: styles.progressBar
		  		}
		  		onPress={() => { 
		  			{ locationType === 'inStore'
		  				?	navigation.navigate("UBInStoreLocationAddress")
		  				: locationType === 'mobile'
		  				? navigation.navigate("UBMobileLocation")
		  				: null
		  			}
		  		}}
		  	>
		  		<FontAwesome name="map-o" size={RFValue(20)} color={color.black1} />
		  	</TouchableOpacity>
		  	<TouchableOpacity 
		  		style={
		  			locationType && businessLocation
		  			? { ...styles.progressBar, ...{backgroundColor: color.skyblue1}}
		  			: styles.progressBar
		  		}
		  	>
		  		<AntDesign 
		  			name="checkcircleo" 
		  			size={RFValue(20)} 
		  			color={ 
		  				locationType && businessLocation
		  				? color.blue1
		  				:	color.gray1
		  			}
		  		/>
		  	</TouchableOpacity>
		  </View>

		  <View style={styles.buttonListContainer}>
	  		<TouchableHighlight 
	  			style={styles.buttonContainer}
	  			underlayColor="#E9FEFF"
	  			onPress={() => {
	  				navigation.navigate("UBInStoreMobile");
	  				clearLocationType();
	  				clearBusinessLocation();
	  			}}
	  		>
	  			<View style={styles.buttonTextContainer}>
		  			<AntDesign name="isv" size={RFValue(28)} color={color.black1} />
		  			<View style={{borderWidth: 1, marginHorizontal: 2}}></View>
		  			<AntDesign name="rocket1" size={RFValue(24)} color={color.black1} />
		  			<Text style={styles.buttonText}>Choose In-Store or Mobile</Text>
		  			{ locationType ? <AntDesign name="check" size={RFValue(24)} color={color.blue1} /> : null }
		  		</View>
	  		</TouchableHighlight>
	  		<TouchableHighlight
	  			style={styles.buttonContainer}
	  			onPress={() => {
	  				{ 
	  					locationType === "inStore"
	  					? ( navigation.navigate("UBInStoreLocationAddress"), clearBusinessLocation())
	  					: locationType === "mobile"
	  					? ( navigation.navigate("UBMobileLocation"), clearBusinessLocation())
	  					: null
	  				}
	  			}}
	  			underlayColor="#E9FEFF"
	  		>
					<View style={styles.buttonTextContainer}>
						<FontAwesome name="map-o" size={RFValue(28)} color={color.black1} />
						<Text style={styles.buttonText}>
							Pick Location and Address
						</Text>
						{ businessLocation ? <AntDesign name="check" size={RFValue(24)} color={color.blue1} /> : null }
					</View>
	  		</TouchableHighlight>
	  		<TouchableHighlight 
	  			style={styles.buttonContainer}
	  			onPress={() => {
	  				resetLocationsAddress();
	  			}}
	  			underlayColor={color.skyblue1}
	  		>
	  			<View style={styles.buttonTextContainer}>
		  			<MaterialCommunityIcons name="backspace-outline" size={RFValue(28)} color={color.black1} />
		  			<Text style={styles.buttonText}>Reset</Text>
		  		</View>
	  		</TouchableHighlight>
		  </View>
	  </SafeAreaView>
	);
};

const styles = StyleSheet.create({
	screenContainer: {
		flex: 1,
		backgroundColor: color.white1,
	},
	progressBarContainer: {
		flex: 0.5,
		flexDirection: 'row',
	},
	progressBar: {
		flex: 1,
		flexDirection: 'row',
		borderWidth: 0.5,
		borderColor: color.gray1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonListContainer: {
		flex: 9,
	},
	buttonContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonTextContainer: {
		flexDirection: 'row',
	},
	buttonText: {
		fontSize: RFValue(20),
		marginHorizontal: 10,
	},
});

export default UBLocationAddressScreen;
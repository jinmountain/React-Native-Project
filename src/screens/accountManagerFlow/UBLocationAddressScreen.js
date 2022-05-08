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
	ScrollView,
	SafeAreaView,
	ActivityIndicator
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import { HeaderForm } from '../../components/HeaderForm';

// Context
import { Context as LocationContext } from '../../context/LocationContext';
import { Context as AuthContext } from '../../context/AuthContext';

// Hooks
import { wait } from '../../hooks/wait';

// Color codes
import color from '../../color';

// Firestore
import {
	businessUpdateLocation
} from '../../firebase/business/businessUpdateFire';

// Designs
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

// expo icons
import { chevronBack } from '../../expoIcons';

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

	const [ waitingToFinishUpdate, setWaitingToFinishUpdate ] = useState(false);

	return (
		<View style={styles.screenContainer}>
			<View style={styles.headerBarContainer}>
				<SafeAreaView/>
				<HeaderForm 
					leftButtonIcon={chevronBack(RFValue(27), color.black1)}
			    headerTitle={
			    	waitingToFinishUpdate 
			    	?
			    	<ActivityIndicator size="small" color={color.purple2}/>
			    	:
			    	"Edit Location & Address"
			    }
			    rightButtonIcon={ 
			    	locationType !== null || businessLocation !== null 
			    	? "Done" 
			    	: null 
			    }
			    leftButtonPress={() => {
			    	navigation.goBack(); 
			    	resetLocationsAddress();
			    }}
	    		rightButtonPress={() => {
	    			if (locationType !== null || businessLocation !== null) {
	    				setWaitingToFinishUpdate(true);

	    				const newLocation = { ...businessLocation, ...{ locationType: locationType }};
	    				const updateLocation = businessUpdateLocation(newLocation, user.service);
	    				updateLocation
	    				.then(() => {
	    					wait(1000)
		    				.then(() => {
		    					resetLocationsAddress();
	    						setWaitingToFinishUpdate(false);
		    				})
		    				.then(() => {
		    					navigation.goBack();
		    				});
	    				})
	    				.catch((error) => {
	    					console.log("Error occured:  updateLocation: ", error);
	    					setWaitingToFinishUpdate(false);
	    				})
	    			}
	    		}}
			  />
			</View>
		  <View style={styles.progressBarContainer}>
		  	<TouchableOpacity 
		  		style={
		  			{ ...styles.progressBar, ...{backgroundColor: color.purple2}}
		  		}
		  	>
					<AntDesign name="smileo" size={RFValue(20)} color={color.white2} />
		  	</TouchableOpacity>
		  	<TouchableOpacity 
		  		style={
		  			locationType
		  			? { ...styles.progressBar, ...{backgroundColor: "#675DA5"}}
		  			: styles.progressBar
		  		}
		  		onPress={() => { 
		  			navigation.navigate("UBInStoreMobile");
			    	clearLocationType();
			    	clearBusinessLocation();
		  		}}
		  	>
		  		<AntDesign name="isv" size={RFValue(20)} color={ locationType ? color.white2 : color.black1} />
		  		<View style={{ borderWidth: 1, marginHorizontal: 2 }}></View>
	  			<AntDesign name="rocket1" size={RFValue(20)} color={locationType ? color.white2 : color.black1} />
		  	</TouchableOpacity>
		  	<TouchableOpacity 
		  		style={
		  			businessLocation
		  			? { ...styles.progressBar, ...{backgroundColor: "#2A2646" }}
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
		  		<FontAwesome name="map-o" size={RFValue(20)} color={businessLocation ? color.white2 : color.black2 } />
		  	</TouchableOpacity>
		  	<TouchableOpacity 
		  		style={
		  			locationType && businessLocation
		  			? { ...styles.progressBar, ...{backgroundColor: "#0E0D18" }}
		  			: styles.progressBar
		  		}
		  	>
		  		<AntDesign 
		  			name="checkcircleo" 
		  			size={RFValue(20)} 
		  			color={ 
		  				locationType && businessLocation
		  				? color.white2
		  				:	color.black2
		  			}
		  		/>
		  	</TouchableOpacity>
		  </View>

		  <View style={styles.buttonListContainer}>
	  		<TouchableHighlight 
	  			style={styles.buttonContainer}
	  			underlayColor={color.grey4}
	  			onPress={() => {
	  				navigation.navigate("UBInStoreMobile");
	  				clearLocationType();
	  				clearBusinessLocation();
	  			}}
	  		>
	  			<View style={styles.buttonTextContainer}>
		  			<Text style={styles.buttonText}>
		  				{ 
		  					locationType 
		  					? <AntDesign name="check" size={RFValue(24)} color={color.red2} /> 
		  					: 
		  					<View style={{ flexDirection: 'row' }}>
		  						<AntDesign name="isv" size={RFValue(28)} color={color.black1} />
					  			<View style={{borderWidth: 1, marginHorizontal: 2}}></View>
					  			<AntDesign name="rocket1" size={RFValue(24)} color={color.black1} />
		  					</View>
		  				}
		  				{' '}
		  				Choose In-Store or Mobile
		  			</Text>
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
	  			underlayColor={color.grey4}
	  		>
					<View style={styles.buttonTextContainer}>
						<Text style={styles.buttonText}>
							{ 
								businessLocation 
								? <AntDesign name="check" size={RFValue(24)} color={color.red2} /> 
								: <FontAwesome name="map-o" size={RFValue(28)} color={color.black1} />
							}
							{' '}
							Pick Location and Address
						</Text>
					</View>
	  		</TouchableHighlight>
	  		<TouchableHighlight 
	  			style={styles.buttonContainer}
	  			onPress={() => {
	  				resetLocationsAddress();
	  			}}
	  			underlayColor={color.grey4}
	  		>
	  			<View style={styles.buttonTextContainer}>
		  			<MaterialCommunityIcons name="backspace-outline" size={RFValue(28)} color={color.black1} />
		  			<Text style={styles.buttonText}>Reset</Text>
		  		</View>
	  		</TouchableHighlight>
		  </View>
	  </View>
	);
};

const styles = StyleSheet.create({
	screenContainer: {
		flex: 1,
		backgroundColor: color.white2,
	},
	headerBarContainer: { 
		backgroundColor: color.white2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    // for android
    elevation: 5,
    // for ios
    zIndex: 5
  },
	progressBarContainer: {
		flexDirection: 'row',
	},
	progressBar: {
		flex: 1,
		flexDirection: 'row',
		borderColor: color.gray1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: RFValue(7)
	},
	buttonListContainer: {
		flex: 1
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
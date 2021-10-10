import React, { useContext, useState }from 'react';
import { 
	Text,
	StyleSheet, 
	View,
	TouchableHighlight,
	TouchableOpacity,
} from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import { HeaderForm } from '../../components/HeaderForm';
import AlertBoxTop from '../../components/AlertBoxTop'; 
import MainTemplate from '../../components/MainTemplate';

// Designs
import { FontAwesome } from '@expo/vector-icons';

// Hooks
import GooglePlacesInput from '../../googleAPI/placesAutocomplete';

// Context
import { Context as LocationContext } from '../../context/LocationContext';

const UBInStoreLocationAddressScreen = ({ navigation }) => {
	const { 
		addBusinessLocation,
	} = useContext(LocationContext);
	// screen update business address state
	const [ ubAddress, setUbAddress ] = useState(null);
	// alert box states
  const [ alertBoxStatus, setAlertBoxStatus ] = useState(false);
  const [ alertBoxText, setAlertBoxText ] = useState(null);

	return (
		<MainTemplate>
			<HeaderForm 
				leftButtonTitle="Back"
		    headerTitle={<FontAwesome name="map-o" size={RFValue(20)} color="black" />} 
		    rightButtonTitle={"Done"}
		    leftButtonPress={() => {
		    	navigation.goBack();
		    }}
    		rightButtonPress={() => {
    			if (ubAddress) {
    				addBusinessLocation(ubAddress);
    				navigation.goBack();
    			} else {
    				setAlertBoxStatus(true);
    				setAlertBoxText("Find your business address using the input box");
    			}
    		}}
		  />
			<View style={styles.mainContainer}>
				{ 
					ubAddress
					?
					<View style={styles.searchBarContainer}>
						<View style={styles.ubAdressLabel}>
							<Text style={styles.labelText}>
								New Business Address:
							</Text>
						</View>
						<TouchableOpacity
							onPress={() => {
								setUbAddress(null);
							}}
						>
							<View style={styles.ubAdressContainer}>
								<Text style={styles.ubAddressText}>{ubAddress.formatted_address}</Text>
							</View>
						</TouchableOpacity>
					</View>
					:
					<View style={styles.searchBarContainer}>
						<GooglePlacesInput 
							setUbAddress={setUbAddress} 
						/>
					</View>
				}
			</View>
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
	screenContainer: {
		flex: 1,
		backgroundColor: "#F9F9F9",
	},
	mainContainer: {
		flex: 1,
		margin: RFValue(30),
	},
	searchBarContainer: {
		flex: 1,
	},
	ubAdressLabel: {

	},
	labelText: {
		fontSize: RFValue(17),
		fontWeight: 'bold',
	},
	ubAdressContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: RFValue(7),
		padding: RFValue(7),
		backgroundColor: '#fff',
		borderRadius: 15,
	},
	ubAddressText: {
		fontSize: RFValue(15),
	},
})

export default UBInStoreLocationAddressScreen;
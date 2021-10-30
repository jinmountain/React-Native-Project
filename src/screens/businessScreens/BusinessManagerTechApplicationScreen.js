import React, { useState, useEffect, useContext, useCallback } from 'react';
import { 
	Text, 
	View, 
	StyleSheet, 
	FlatList,
	Image,
	TouchableOpacity,
	TouchableHighlight 
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Designs
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

// Contexts
import { Context as AuthContext } from '../../context/AuthContext';
import { Context as SocialContext } from '../../context/SocialContext';

// Hooks

// Firebase
import busTechGetFire from '../../firebase/busTechGetFire';
import busTechPostFire from '../../firebase/busTechPostFire';
import businessGetFire from '../../firebase/businessGetFire';

// Components
import MainTemplate from '../../components/MainTemplate';
import DefaultUserPhoto from '../../components/defaults/DefaultUserPhoto';
import { RatingReadOnly } from '../../components/RatingReadOnly';

// Color
import color from '../../color';

const BusinessManagerTechApplicationScreen = ({ navigation, isFocused }) => {
	// Contexts
	const { state: { user } } = useContext(AuthContext);
	const { state: { techApps }, addTechApp, removeTechApp, clearTechApp } = useContext(SocialContext);

	// get technician requests
	//  - states
	// techApp => technician application 
	const [ techAppLast, setTechAppLast ] = useState(null);
	const [ techAppFetchSwitch, setTechAppFetchSwitch ] = useState(true);
	const [ techAppFetchState, setTechAppFetchState ] = useState(false);

	// main effect
	useEffect(() => {
		let isMounted = true;

		// get applications from technicians
		if (techAppFetchSwitch && !techAppFetchState) {
			setTechAppFetchState(true)
			const getTechAppToBus = busTechGetFire.getTechAppToBus(
				user.id, 
				setTechAppLast, 
				setTechAppFetchSwitch, 
				techAppLast
			)
			getTechAppToBus
			.then((techApps) => {
				addTechApp(techApps);
				setTechAppFetchState(false);
				console.log(techApps);
			});
		} else {
			console.log(
				"techAppFetchSwitch: "
				+ techAppFetchSwitch
				+ "techAppFetchState: "
				+ techAppFetchState
			);
		}

		return () => { 
    	isMounted = false
    	setTechAppLast(null);
    	setTechAppFetchSwitch(true);
    	setTechAppFetchState(false);
    	clearTechApp();
    }
	}, [])

	return (
		<View style={styles.managerContainer}>
			<View style={styles.contentContainer}>
				<FlatList
					//onEndReached={}
					onEndReachedThreshold={0.01}
				  vertical
				  showsVerticalScrollIndicator={true}
				  data={techApps}
				  keyExtractor={(techApp) => techApp.id}
				  renderItem={({ item }) => {
				 	// const applicationDoc = { 
			    // 	id: docId, 
			    // 	data: docData,
			    // 	technicianData: technicianData
			    // }
				  	return (
				  		<View
				  			style={styles.techAppContainer}
				  		>
				  			<View style={styles.techApp}>
				  				<View style={styles.techPhotoContainer}>
				  					{ 
				  						item.techData.photoURL
				  						?
				  						<Image 
					              source={{uri: item.techData.photoURL}}
					              style={{width: RFValue(77), height: RFValue(77)}}
					            />
				  						:
				  						<DefaultUserPhoto 
				  							customSizeBorder={77}
				  							customSizeUserIcon={37}
				  						/>
				  					}
				  				</View>
				  				<View style={styles.techAppInfoContainer}>
					  				<View style={styles.techUsernameContainer}>
					  					<Text style={styles.usernameText}>{item.techData.username}</Text>
					  				</View>

						  			<View style={styles.techAppButtonsContainer}>
					  					<TouchableHighlight 
					  						style={{
					  							...styles.techAppButton, 
					  							...{marginRight: RFValue(13)}
					  						}}
					  						underlayColor={color.gray2}
					  						onPress={() => {
					  							const acceptTechApp = busTechPostFire.acceptTechApp(item.id, item.techData.id, user.id)
					  							acceptTechApp
					  							.then((response) => {
					  								if (response) {
					  									removeTechApp(item.id);
					  								}
					  							})
					  						}}
					  					>
					  						<View>
					  							<Text style={styles.buttonText}>Accept</Text>
					  						</View>
					  					</TouchableHighlight>
					  					<TouchableHighlight 
					  						style={styles.techAppButton}
					  						underlayColor={color.gray2}
					  						onPress={() => {
					  							console.log("decline");
					  						}}
					  					>
					  						<View>
					  							<Text style={styles.buttonText}>Decline</Text>
					  						</View>
					  					</TouchableHighlight>
						  			</View>
						  		</View>
					  		</View>
				  		</View>
				  	)
				  }}
				/>
			</View>
		</View>
  );
};

const styles = StyleSheet.create({
	managerContainer: {
		backgroundColor: '#fff',
		flex: 1,
	},

	categoryContainer: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: '#fff',
		marginBottom: RFValue(13),
		backgroundColor: color.gray2,
	},
	categoryInnerContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	category: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: color.gray2,
	},

	contentContainer: {
		backgroundColor: color.white1,
		flex: 9,
	},
	techAppContainer: {
		width: '100%',
		paddingTop: RFValue(7),
		paddingLeft: RFValue(7),
	},
	techApp: {
		flex: 1,
		flexDirection: 'row',
	},
	techPhotoContainer: {
		flex: 1,
	},
	techAppInfoContainer: {
		flexDirection: 'row',
		flex: 3,
	},
	techUsernameContainer: {
		flex: 1,
		justifyContent: 'center',
	},
	usernameText: {
		fontSize: RFValue(15),
	},
	techAppButtonsContainer: {
		flex: 2,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		padding: RFValue(3),
	},
	techAppButton: {
		borderWidth: 2,
		paddingHorizontal: RFValue(7),
		paddingVertical: RFValue(11),
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonText: {
		fontSize: RFValue(17),
	},

	techRatingContainer: {
		flex: 2,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		padding: RFValue(3),
	},
});

export default BusinessManagerTechApplicationScreen;
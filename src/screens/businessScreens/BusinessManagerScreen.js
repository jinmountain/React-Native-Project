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
import {
	getTechAppToBus
} from '../../firebase/business/busTechGetFire';
import {
	acceptTechApp
} from '../../firebase/business/busTechPostFire';
import {
	getTechnicians
} from '../../firebase/business/businessGetFire';

// Components
import MainTemplate from '../../components/MainTemplate';
import DefaultUserPhoto from '../../components/defaults/DefaultUserPhoto';
import { RatingReadOnly } from '../../components/RatingReadOnly';

// Color
import color from '../../color';

// expo icons
import expoIcons from '../../expoIcons';

const BusinessManager = ({ navigation, isFocused }) => {
	// Contexts
	const { state: { user } } = useContext(AuthContext);
	const { state: { techApps }, addTechApp, removeTechApp, clearTechApp } = useContext(SocialContext);
	const [ category, setCategory ] = useState('techs');

	// get technician requests
	//  - states
	// techApp => technician application 
	const [ techAppLast, setTechAppLast ] = useState(null);
	const [ 
		techAppFetchSwitch, 
		setTechAppFetchSwitch 
	] = useState(true);
	const [ techAppFetchState, setTechAppFetchState ] = useState(false);

	// get current techs
	const [ techFetchLast, setTechFetchLast ] = useState(null);
	const [ techFetchState, setTechFetchState ] = useState(false);
	const [ techFetchSwitch, setTechFetchSwitch ] = useState(true);
	const [ currentTechs, setCurrentTechs ] = useState([]);

	const appendTechs = useCallback((techs) => {
      setCurrentTechs([ ...currentTechs, ...techs ]);
    },
    []
	);

	// main effect
	useEffect(() => {
		let isMounted = true;

		// get applications from technicians
		if (techAppFetchSwitch && !techAppFetchState) {
			setTechAppFetchState(true)
			const getTechAppToBus = getTechAppToBus(
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

		// get current technicians
		if (techFetchSwitch && !techFetchState) {
			setTechFetchState(true);
			const getTechnicians = getTechnicians(
				user.id, 
				setTechFetchLast,
				setTechFetchSwitch,
				techFetchLast,
			);
			getTechnicians
			.then((techs) => {
				appendTechs(techs);
				setTechFetchState(false);
			});
		} else {
			console.log(
				"techFetchSwitch: "
				+ techFetchSwitch
				+ "techFetchState: "
				+ techFetchState
			);
		}

		return () => { 
    	isMounted = false
    	setTechAppLast(null);
    	setTechAppFetchSwitch(true);
    	setTechAppFetchState(false);
    	clearTechApp();

    	setTechFetchLast(null);
    	setTechFetchSwitch(true);
    	setTechFetchState(false);
    }
	}, [])

	return (
		<MainTemplate>
			<View style={styles.managerContainer}>
				<View style={styles.categoryContainer}>
					<TouchableHighlight 
						style={
							category === 'techs'
							?
							{ 
								...styles.category, 
								...{ borderTopLeftRadius: RFValue(13), borderTopRightRadius: RFValue(13), backgroundColor: '#fff' } 
							}
							:
							styles.category
						}
						onPress={() => { setCategory('techs')}}
						underlayColor={color.gray4}
					>
						<View style={styles.categoryInnerContainer}>
							<View style={styles.iconContainer}>
								<AntDesign name="team" size={RFValue(27)} color={color.black1} />
							</View>
							<View style={styles.labelContainer}>
								<Text>Technicians</Text>
							</View>
						</View>
					</TouchableHighlight>
					<TouchableHighlight 
						style={
							category === 'techApps'
							?
							{ 
								...styles.category, 
								...{ borderTopLeftRadius: RFValue(13), borderTopRightRadius: RFValue(13), backgroundColor: '#fff' } 
							}
							:
							styles.category
						}
						onPress={() => { setCategory('techApps')}}
						underlayColor={color.gray4}
					>
						<View style={styles.categoryInnerContainer}>
							<View style={styles.iconContainer}>
								<AntDesign name="adduser" size={RFValue(27)} color={color.black1} />
							</View>
							<View style={styles.labelContainer}>
								<Text>Applications</Text>
							</View>
						</View>
					</TouchableHighlight>
					<TouchableHighlight 
						style={
							category === 'reservations'
							?
							{ 
								...styles.category, 
								...{ borderTopLeftRadius: RFValue(13), borderTopRightRadius: RFValue(13), backgroundColor: '#fff' } 
							}
							:
							styles.category
						}
						onPress={() => { setCategory('reservations')}}
						underlayColor={color.gray4}
					>
						<View style={styles.categoryInnerContainer}>
							<View style={styles.iconContainer}>
								<AntDesign name="table" size={RFValue(27)} color={color.black1} />
							</View>
							<View style={styles.labelContainer}>
								<Text>Reservations</Text>
							</View>
						</View>
					</TouchableHighlight>
				</View>
				<View style={styles.contentContainer}>
					{ category === 'techApps' &&
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
							  							const acceptTechApp = acceptTechApp(item.id, item.techData.id, user.id)
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
					}

					{ category === 'techs' &&
						<FlatList
							//onEndReached={}
							onEndReachedThreshold={0.01}
						  vertical
						  showsVerticalScrollIndicator={true}
						  data={currentTechs}
						  keyExtractor={(tech) => tech.id}
						  renderItem={({ item }) => {
						 	// id: docId,
				    	// 	techData: {
				    	// 		username: techData.username,
				    	// 		photoURL: techData.photoURL,
				    	// 		countRating: techData.countRating,
				    	// 		totalRating: techData.totalRating
				    	// 	} 
						  	return (
						  		<TouchableOpacity
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
							  				<View style={styles.techRatingContainer}>
									  			<RatingReadOnly rating={Number((Math.round(item.techData.totalRating/item.techData.countRating * 10) / 10).toFixed(1))} />
									  		</View>
								  		</View>
							  		</View>
						  		</TouchableOpacity>
						  	)
						  }}
						/>
					}
				</View>
			</View>
		</MainTemplate>
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

export default BusinessManager;
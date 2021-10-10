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

const BusinessManagerTechnicianScreen = ({ navigation, isFocused }) => {
	// Contexts
	const { state: { user } } = useContext(AuthContext);

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

		// get current technicians
		if (isMounted && techFetchSwitch && !techFetchState) {
			isMounted && setTechFetchState(true);
			const getTechnicians = businessGetFire.getTechnicians(
				user.id, 
				setTechFetchLast,
				setTechFetchSwitch,
				techFetchLast,
			);
			getTechnicians
			.then((techs) => {
				isMounted && appendTechs(techs);
				isMounted && setTechFetchState(false);
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
    	setCurrentTechs([]);
    	setTechFetchLast(null);
    	setTechFetchSwitch(true);
    	setTechFetchState(false);
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
				  data={currentTechs}
				  keyExtractor={(tech, index) => index.toString()}
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

export default BusinessManagerTechnicianScreen;
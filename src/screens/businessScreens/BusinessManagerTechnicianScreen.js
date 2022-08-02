import React, { useState, useEffect, useContext } from 'react';
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
	getTechnicians
} from '../../firebase/business/businessGetFire';
import {
	getUserInfoFire
} from '../../firebase/user/usersGetFire';

// Components
import MainTemplate from '../../components/MainTemplate';
import DefaultUserPhoto from '../../components/defaults/DefaultUserPhoto';
import { RatingReadOnly } from '../../components/RatingReadOnly';
import UserPhotoForm from '../../components/UserPhotoForm'

// Color
import color from '../../color';

const TechBoxHeader = ({ techId }) => {
  const [ tech, setTech ] = useState(null);

  useEffect(() => {
    let isMounted = false;
    const getUserInfo = getUserInfoFire(techId);
    getUserInfo
    .then((user) => {
      const techUserData = {
        id: user.id,
        photoURL: user.photoURL,
        username: user.username,
        name: user.name
      };
      setTech(techUserData);
    })
    .catch((error) => {
      // handle error;
    });
    
    return () => {
      isMounted = false;
    };
  }, []);

  return (
  	tech &&
  	<View style={styles.techBoxHeaderContainer}>
			<View style={styles.techPhotoContainer}>
				<UserPhotoForm
					photoURL={tech.photoURL}
					imageWidth={RFValue(55)}
					imageHeight={RFValue(55)}
				/>
			</View>
			<View style={styles.techUsernameContainer}>
				<Text style={styles.usernameText}>{tech.username}</Text>
			</View>
		</View>
  )
};

const BusinessManagerTechnicianScreen = ({ navigation, isFocused }) => {
	// Contexts
	const { state: { user }} = useContext(AuthContext);

	const [ screenReady, setScreenReady ] = useState(false);

	// get current techs
	const [ techFetchLast, setTechFetchLast ] = useState(null);
	const [ techFetchState, setTechFetchState ] = useState(false);
	const [ techFetchSwitch, setTechFetchSwitch ] = useState(true);
	const [ currentTechs, setCurrentTechs ] = useState([]);

	// get applied techs
	const [ appTechFetchLast, setAppTechFetchLast ] = useState(null);
	const [ appTechFetchState, setAppTechFetchState ] = useState(false);
	const [ appTechFetchSwitch, setAppTechFetchSwitch ] = useState(true);
	const [ appTechs, setAppTechs ] = useState([]);

	// get invited techs
	const [ invTechFetchLast, setInvTechFetchLast ] = useState(null);
	const [ invTechFetchState, setInvTechFetchState ] = useState(false);
	const [ invTechFetchSwitch, setInvTechFetchSwitch ] = useState(true);
	const [ invTechs, setInvTechs ] = useState([]);

	// main effect
	useEffect(() => {
		let isMounted = true;
		const getScreenReady = new Promise ((res, rej) => {
	    if (isMounted) {
	    	// get active techs
	      setTechFetchState(true);
	      const getTechs = getTechnicians(
	        user.id, 
	        null,
	      );

	      getTechs
	      .then((result) => {
	        setCurrentTechs(result.techs);
	        isMounted && setTechFetchLast(result.lastTech);
	        if (!result.lastTech) {
	          isMounted && setTechFetchSwitch(false);
	        }
	        isMounted && setTechFetchState(false);
	      })

	      // get applied techs
	      setAppTechFetchState(true);
	      const getAppTechs = getTechnicians(
	        user.id, 
	        null,
	        "applied"
	      );
	      getAppTechs
	      .then((result) => {
	        setAppTechs(result.techs);
	        isMounted && setAppTechFetchLast(result.lastTech);
	        if (!result.lastTech) {
	          isMounted && setAppTechFetchSwitch(false);
	        }
	        isMounted && setAppTechFetchState(false);
	      })
	      .catch((error) => {

	      });

	      // get inv techs
	      setAppTechFetchState(true);
	      const getInvTechs = getTechnicians(
	        user.id, 
	        null,
	        "invited"
	      );
	      getInvTechs
	      .then((result) => {
	        setInvTechs(result.techs);
	        isMounted && setInvTechFetchLast(result.lastTech);
	        if (!result.lastTech) {
	          isMounted && setInvTechFetchSwitch(false);
	        }
	        isMounted && setInvTechFetchState(false);
	      })
	      .catch((error) => {

	      });
	    };
	    res();
		});

		getScreenReady
		.then(() => {
			setScreenReady(true);
		})
		.catch((error) => {

		});

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
			{
				appTechs.length > 0
				?
				<View>
					<View style={styles.labelContainer}>
						<Text>Who Applied</Text>
					</View>
					<View>
						<FlatList
							//onEndReached={}
							onEndReachedThreshold={0.01}
						  vertical
						  showsVerticalScrollIndicator={true}
						  contentContainerStyle={{  }}
						  data={appTechs}
						  keyExtractor={(tech, index) => index.toString()}
						  renderItem={({ item }) => {
			        //  item: {
			        //    techId: string
			        //  	countRating: docData.countRating,
			        //  	totalRating: docData.totalRating
			        //  }
						  	return (
						  		<TouchableHighlight
						  			style={styles.techBoxContainer}
						  			onPress={() => {
						  				navigation.navigate("BusinessManagerManageTechnician", {
						  					techId: item.techId
						  				});
						  			}}
						  			underlayColor={color.grey4}
						  		>
						  			<View style={styles.techInner}>
						  				<TechBoxHeader
						  					techId={item.techId}
						  				/>
						  				<View style={styles.techBoxBottomContainer}>
						  					<View style={styles.techRatingContainer}>
									  			<RatingReadOnly rating={Number((Math.round(item.totalRating/item.countRating * 10) / 10).toFixed(1))} />
									  		</View>
								  		</View>
							  		</View>
						  		</TouchableHighlight>
						  	)
						  }}
						/>
					</View>
				</View>
				: null
			}
			{
				invTechs.length > 0
				?
				<View>
					<View style={styles.labelContainer}>
						<Text>You Invited</Text>
					</View>
				</View>
				: null
			}
			{
				currentTechs.length > 0
				?
				<View>
					<View>
						<Text>Current Technicians</Text>
					</View>
					<View>
						<FlatList
							//onEndReached={}
							onEndReachedThreshold={0.01}
						  vertical
						  showsVerticalScrollIndicator={true}
						  contentContainerStyle={{  }}
						  data={currentTechs}
						  keyExtractor={(tech, index) => index.toString()}
						  renderItem={({ item }) => {
			        //  item: {
			        //    techId: string
			        //  	countRating: docData.countRating,
			        //  	totalRating: docData.totalRating
			        //  }
						  	return (
						  		<TouchableHighlight
						  			style={styles.techBoxContainer}
						  			onPress={() => {
						  				navigation.navigate("BusinessManagerManageTechnician", {
						  					techId: item.techId
						  				});
						  			}}
						  			underlayColor={color.grey4}
						  		>
						  			<View style={styles.techInner}>
						  				<TechBoxHeader
						  					techId={item.techId}
						  				/>
						  				<View style={styles.techBoxBottomContainer}>
						  					<View style={styles.techRatingContainer}>
									  			<RatingReadOnly rating={Number((Math.round(item.totalRating/item.countRating * 10) / 10).toFixed(1))} />
									  		</View>
									  		<View style={styles.techRatingContainer}>
									  			<Text>Average rating: {Number((Math.round(item.totalRating/item.countRating * 10) / 10).toFixed(1))}</Text>
									  		</View>
								  		</View>
							  		</View>
						  		</TouchableHighlight>
						  	)
						  }}
						/>
					</View>
				</View>
				: null
			}
		</View>
  );
};

const styles = StyleSheet.create({
	managerContainer: {
		backgroundColor: color.white2,
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

	techBoxContainer: {
		backgroundColor: color.white2,
		paddingVertical: RFValue(5)
	},

	// tech box header
	techBoxHeaderContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: RFValue(9),
	},
	techPhotoContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: RFValue(5),
	},
	techUsernameContainer: {
		justifyContent: 'center',
	},
	usernameText: {
		color: color.black1,
		fontSize: RFValue(19),
	},

	// tech box bottom
	techBoxBottomContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	techRatingContainer: {
		justifyContent: 'center',
		paddingLeft: RFValue(15),
	},
	techInner: {
		flexDirection: 'row',
	},
	techRatingContainer: {
		justifyContent: 'center',
		alignItems: 'center'
	},
});

export default BusinessManagerTechnicianScreen;
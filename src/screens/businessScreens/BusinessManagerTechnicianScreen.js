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
	const { state: { user } } = useContext(AuthContext);

	// get current techs
	const [ techFetchLast, setTechFetchLast ] = useState(null);
	const [ techFetchState, setTechFetchState ] = useState(false);
	const [ techFetchSwitch, setTechFetchSwitch ] = useState(true);
	const [ currentTechs, setCurrentTechs ] = useState([]);

	// main effect
	useEffect(() => {
		let isMounted = true;

    if (isMounted && techFetchSwitch && !techFetchState) {
      setTechFetchState(true);
      const getTechnicians = getTechnicians(
        user.id, 
        techFetchLast,
      );
      getTechnicians
      .then((result) => {
        setCurrentTechs(result.techs);
        isMounted && setTechFetchLast(result.lastTech);
        if (!result.lastTech) {
          isMounted && setTechFetchSwitch(false);
        }
        isMounted && setTechFetchState(false);
      })
    } else {
      console.log(
        "techFetchSwitch: "
        + techFetchSwitch
        + "techFetchState: "
        + techFetchState
      );
    };

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
					  		</View>
				  		</View>
			  		</TouchableHighlight>
			  	)
			  }}
			/>
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

	},
	techRatingContainer: {
		justifyContent: 'center',
		paddingLeft: RFValue(15),
	},
});

export default BusinessManagerTechnicianScreen;
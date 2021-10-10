import React, { useContext, useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native';
import { SafeAreaView, } from 'react-native-safe-area-context';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Designs
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Contexts
import { Context as LocationContext } from '../context/LocationContext';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as PostContext } from '../context/PostContext';

// Hooks
import useLocation from '../hooks/useLocation';
import useBackHandler from '../hooks/useBackHandler';
import { useIsFocused } from '@react-navigation/native';

// Components
import { NavigationBar } from '../components/NavigationBar';
import MapSearchMap from '../components/MapSearchMap';
import MainTemplate from '../components/MainTemplate';
import { StarRating } from '../components/StarRating';

// Color
import color from '../color';

const MapSearchScreen = ({ navigation }) => {
	const isFocused = useIsFocused();
	const [ error, setError ] = useState(null);

	const { 
		state: { currentLocation, searchLocation }, 
		addLocation, 
		addSearchLocation 
	} = useContext(LocationContext);

	const { 
		state: { initialSearchSwitch, businessUsersNear },
		resetBusinessPosts, 
		getBusinessUsersNear,
    switchInitialSearch,
    addBusinessUserSearch, 
  } = useContext(PostContext);

	const { state: { user }} = useContext(AuthContext);
	const [ locationError ] = useLocation(isFocused, addLocation);

  // search method clicked
  const [mapSearchClicked, setMapSearchClicked] = useState(true);
  const [listSearchClicked, setListSearchClicked] = useState(false);

  // view setting
  const [ viewSetting, setViewSetting ] = useState(false);
  const [ changeDistance, setChangeDistance ] = useState(false);
  const [ filterRating, setFilterRating ] = useState(false);

  // rating value to filter
  const [ rating, setRating ] = useState(0);

  // distance setting 
  const [searchDistance, setSearchDistance] = useState(5);

  // search businesses near
  // When app recives the current location for the first time
  // initiate the search and turn off the switch
  useEffect(() => {
  	console.log("search distance: ", searchDistance);
    if (currentLocation) {
      getBusinessUsersNear(currentLocation, searchDistance);
    }
  }, [currentLocation, searchDistance]);

  // // when come back to the map reset the business posts
  // useEffect(() => {
  //   console.log("Reset home business posts.");
  //   resetBusinessPosts();
  // }, [isFocused]);

	const filterResultsByRating = (rating) => {
		if (rating === 0) {
			return businessUsersNear;
		} else {
			return businessUsersNear.filter(result => {
				const avgRating = Number((Math.round(result.totalRating/result.countRating * 10) / 10).toFixed(1))
				return avgRating >= rating;
			});
		}
	};

	return (
		<MainTemplate>
		{ locationError
			?
			<View style={styles.mapContainer}>
				<View style={styles.locationErrorContainer}>
					<Text>Your location service is currently disabled.</Text>
				</View>
			</View>
			:
			<View style={styles.mapContainer}>
				<MapSearchMap
					businessUsersNear={filterResultsByRating(rating)}
					navigate={navigation.navigate}
					userPhotoURL={user.photoURL}
					currentLocation={currentLocation}
					searchLocation={searchLocation}
					addBusinessUser={addBusinessUserSearch}
				/>
				<View style={styles.searchMethodContainerOpacity}>
	      </View>
	      <View style={styles.searchMethodContainer}>
	        <TouchableOpacity style={styles.methodContainer}>
	          <Feather 
	            name="map" 
	            size={RFValue(24)} 
	            color={ mapSearchClicked ? color.purple1 : color.black1 }
	          />
	        </TouchableOpacity>
	        <TouchableOpacity 
	          style={styles.methodContainer}
	        >
	          <Feather 
	            name="grid" 
	            size={RFValue(24)} 
	            color={ listSearchClicked ? color.purple1 : color.black1} 
	          />
	        </TouchableOpacity>
	        {
	        	viewSetting === false && mapSearchClicked === true
	        	?
	        	<TouchableOpacity
	        		style={styles.openCloseSettingButton}
	        		onPress={() => {setViewSetting(!viewSetting)}}
	        	>
		        	<AntDesign name="setting" size={RFValue(23)} color={color.black1} />
		        </TouchableOpacity>
		        : null
	        }
	      </View>
	      {
	      	viewSetting === true 
	      	&& mapSearchClicked === true 
	      	&& changeDistance === false 
	      	&& filterRating === false
	      	?
	      	<View style={styles.mapSettingUpperContainer}>
	      		<View style={styles.mapSettingContainerShadow}>
			      </View>
		      	<View style={styles.mapSettingContainer}>
			        <TouchableHighlight
			        	style={styles.settingButton}
			        	underlayColor={color.grey4}
			        	onPress={() => { setChangeDistance(!changeDistance) }}
			        >
			        	<View style={styles.buttonContainer}>
			        		<MaterialCommunityIcons name="map-marker-distance" size={RFValue(23)} color={color.grey2}/>
			        		<Text style={styles.buttonText}>
				            {searchDistance} km
				          </Text>
			        	</View>
			        </TouchableHighlight>
			        <TouchableHighlight
			        	style={styles.settingButton}
			        	underlayColor={color.grey4}
			        	onPress={() => { setFilterRating(!filterRating) }}
			        >
			        	<View style={styles.buttonContainer}>
				          <Text style={styles.settingButtonText}>
				          	<AntDesign name="hearto" size={RFValue(23)} color={color.ratingRed} />
				          </Text>
			         	</View>
			        </TouchableHighlight>
			        <TouchableHighlight
			        	style={styles.openCloseSettingButton}
			        	onPress={() => {setViewSetting(!viewSetting)}}
			        	underlayColor={color.grey4}
			        >
			          <AntDesign name="upcircleo" size={RFValue(23)} color={color.black1} />
			        </TouchableHighlight>
			      </View>
			    </View>
		      : changeDistance === true
		      ?
		      <View style={styles.mapSettingUpperContainer}>
		      	<View style={styles.mapSettingContainerShadow}>
			      </View>
			      <View style={styles.mapSettingContainer}>
			      	<TouchableHighlight
			        	style={styles.settingButton}
			        	onPress={() => {setSearchDistance(5)}}
			        	underlayColor={color.grey4}
			        >
			        	<Text>
			        		5 km
			        	</Text>
			        </TouchableHighlight>
			        <TouchableHighlight
			        	style={styles.settingButton}
			        	onPress={() => {setSearchDistance(10)}}
			        	underlayColor={color.grey4}
			        >
			        	<Text>
			        		10 km
			        	</Text>
			        </TouchableHighlight>
			        <TouchableHighlight
			        	style={styles.settingButton}
			        	onPress={() => {setSearchDistance(15)}}
			        	underlayColor={color.grey4}
			        >
			        	<Text>
			        		15 km
			        	</Text>
			        </TouchableHighlight>
			        <TouchableHighlight
			        	style={styles.settingButton}
			        	onPress={() => {setSearchDistance(20)}}
			        	underlayColor={color.grey4}
			        >
			        	<Text>
			        		20 km
			        	</Text>
			        </TouchableHighlight>
			        <TouchableHighlight
			        	style={styles.openCloseSettingButton}
			        	onPress={() => {setChangeDistance(false)}}
			        	underlayColor={color.grey4}
			        >
			          <AntDesign name="upcircleo" size={RFValue(23)} color={color.black1} />
			        </TouchableHighlight>
			      </View>
		     	</View>
		      : filterRating === true
		      ?
		      <View style={styles.mapSettingUpperContainer}>
		      	<View style={styles.mapSettingContainerShadow}>
			      </View>
			      <View style={styles.mapSettingContainer}>
			      	<View style={styles.settingButton}>
				      	<StarRating
				      		rating={rating}
				      		changeRating={setRating}
				      	/>
				      </View>
				      {
				      	rating > 0
				      	?
				      	<TouchableHighlight
				        	style={styles.subSettingButton}
				        	onPress={() => {setRating(0)}}
				        	underlayColor={color.grey4}
				        >
				        	<Text style={styles.subSettingText}>
				        		Show All
				        	</Text>
				        </TouchableHighlight>
				        : null
				      }
			      	<TouchableHighlight
			        	style={styles.openCloseSettingButton}
			        	onPress={() => {setFilterRating(!filterRating)}}
			        	underlayColor={color.grey4}
			        >
			          <AntDesign name="upcircleo" size={RFValue(23)} color={color.black1} />
			        </TouchableHighlight>
			      </View>
		     	</View>
		      :
		      null
	      }
	    </View>
		}
		</MainTemplate>
  );
};

const styles = StyleSheet.create({
	mapContainer: {
		flex: 1,
	},
	locationErrorContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
  searchMethodContainerOpacity: {
    position: 'absolute',
    width: '100%',
    height: '8%',
    backgroundColor: color.grey5,
    opacity: 0.1,
  },
  searchMethodContainer: {
    position: 'absolute',
    width: '100%',
    height: '8%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    height: '100%',
  },
  mapSettingUpperContainer: {
  	flexDirection: 'row',
  	position: 'absolute',
    height: '7%',
    width: '100%',
    marginTop: RFValue(49),
  },
  mapSettingContainerShadow: {
  	height: '100%',
  	width: '100%',
    position: 'absolute',
    backgroundColor: color.grey2,
    opacity: 0.1,
  },
  mapSettingContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingButton: {
  	flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  buttonContainer: {
  	flexDirection: 'row',
  	justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
  	justifyContent: 'center',
    alignItems: 'center',
  	paddingHorizontal: 3,
  },
  settingButtonText: {
  	justifyContent: 'center',
    alignItems: 'center',
  },
  openCloseSettingButton: {
  	padding: RFValue(7),
  	marginRight: RFValue(5),
  	borderRadius: 10,
  },
  subSettingButton: {
  	padding: RFValue(7),
  	marginRight: RFValue(5),
  	borderRadius: 10,
  	borderWidth: 0.5,
  },
  subSettingText: {
  	fontSize: RFValue(13),
  },
});

export default MapSearchScreen;
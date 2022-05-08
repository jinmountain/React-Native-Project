import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
	Text, 
	View, 
	Button, 
	StyleSheet, 
	TouchableOpacity, 
	TouchableHighlight,
	SafeAreaView,
	ScrollView,
	FlatList,
	Pressable,
	Image,
	Keyboard,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Designs
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Contexts
import { Context as LocationContext } from '../context/LocationContext';
import { Context as AuthContext } from '../context/AuthContext';

// Hooks
import useLocation from '../hooks/useLocation';
import { useIsFocused } from '@react-navigation/native';
import useGetUserInfo from '../hooks/useGetUserInfo';
import { useNavigation } from '@react-navigation/native';

// Components
import { NavigationBar } from '../components/NavigationBar';
import MapSearchMap from '../components/MapSearchMap';
// import MainTemplate from '../components/MainTemplate';
import { StarRating } from '../components/StarRating';
import DefaultUserPhoto from '../components/defaults/DefaultUserPhoto';
import { SearchBar } from '../components/createPost/SearchBar';
import { UsersFoundListForm } from '../components/createPost/UsersFoundListForm';

// firebase
import { getBusinessUsersNearFire } from '../firebase/user/usersGetFire';
import {
  getSearchUsersFire,
  getUserSearchHistoryFire,
} from '../firebase/user/usersGetFire';
import { 
	postUserSearchHistoryFire,
	updateUsernameSearchHistoryStatus
} from '../firebase/user/usersPostFire';
import { deleteUsernameSearchHistFire } from '../firebase/user/usersDeleteFire';

// Color
import color from '../color';

// expo icons
import {
	chevronBack,
	ioniconsList,
	fontawesomeListAlt,
	antdesignSearch,
	antClose
} from '../expoIcons';

const UserBox = ({
  item,
  enablePress,
  setChosenUser,
  navigateToAccount,
  enableSearchHistory,
  pressEnabled,
  pressUnabled,
  currentUserId
}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={
        enablePress
        ?
        styles.usersList
        : { ...styles.usersList, ...{ opacity: 0.3 } }
      }
      onPress={() => {
        if (enablePress) {
          navigateToAccount && navigation.navigate('UserAccountStack', {
            screen: 'UserAccount',
            params: {
              accountUserId: item.id
            }
          });
          // enableSearchHistory && save the account user id to search history
          if (enableSearchHistory) {
            // save the account user id to to the user's user search history
            const postUserSearchHistory = postUserSearchHistoryFire(currentUserId, item.id);
            postUserSearchHistory
            .then(() => {
              console.log("good")
            })
            .catch((error) => {

            });
          }
        } else {
          pressUnabled && pressUnabled()
        }
      }} 
    >
      <View style={styles.userPhotoContainer}>
        { 
          item.photoURL
          ?
          <Image style={styles.userPhoto} source={{ uri: item.photoURL }}/>
          : <DefaultUserPhoto customSizeBorder={RFValue(68)}/>
        }
      </View>
      <View style={styles.userInfoContainer}>
        <Text style={styles.usernameText}>@{item.username}</Text>
      </View>
    </TouchableOpacity>
  )
};

const SearchHistUserBox = ({ currentUserId, uid }) => {
	const navigation = useNavigation();
	const [ userInfo ] = useGetUserInfo(uid);

	const [ userInfoState, setUserInfoState ] = useState(userInfo);

	useEffect(() => {
		if (userInfo) {
			setUserInfoState(userInfo);
		}
	}, [userInfo]);

	return (
		userInfoState &&
		<View style={styles.searchHistUserBoxContainer}>
			<TouchableOpacity
	      style={styles.searchHistUserTouchableContainer}
	      onPress={() => {
          navigation.navigate('UserAccountStack', {
            screen: 'UserAccount',
            params: {
              accountUserId: userInfo.id
            }
          });

          // save the account user id to to the user's user search history
          const postUserSearchHistory = postUserSearchHistoryFire(currentUserId, userInfo.id);
          postUserSearchHistory
          .then(() => {
            console.log("good")
          })
          .catch((error) => {

          });
	      }} 
	    >
	      <View style={styles.userPhotoContainer}>
	        { 
	          userInfo.photoURL
	          ?
	          <Image style={styles.userPhoto} source={{ uri: userInfo.photoURL }}/>
	          : <DefaultUserPhoto customSizeBorder={RFValue(68)}/>
	        }
	      </View>
	      <View style={styles.userInfoContainer}>
	        <Text style={styles.usernameText}>@{userInfo.username}</Text>
	      </View>
	    </TouchableOpacity>
      <View style={styles.closeButtonContainer}>
      	<Pressable
      		onPress={() => {
      			// update the status to 3, which means don't show it to the search result
      			const deleteUsernameSearchHist = updateUsernameSearchHistoryStatus(currentUserId, userInfo.id, 3);
      			deleteUsernameSearchHist
      			.then(() => {
      				// delete from state
      				setUserInfoState(null);
      			})
      			.catch(() => {

      			});
      		}}
      	>
      		<View>
      			{ antClose(RFValue(20), color.black1) }
      		</View>
      	</Pressable>
      </View>
		</View>
	)
};

const SearchHistUsersForm = ({ currentUserId, userIds }) => {
	return (
		<View style={{ flex: 1 }}>
			<View style={styles.shLabelContainer}>
				<Text style={styles.shLabelText}>Recent</Text>
			</View>
			<FlatList
	      showsVerticalScrollIndicator={false}
	      data={userIds}
	      keyExtractor={(user) => user.suid}
	      renderItem={({ item }) => {
	        return (
	        	<SearchHistUserBox 
	        		currentUserId={currentUserId}
	        		uid={item.suid} 
	        	/>
	       	)
	    	}}
	    />
	  </View>
	)
};

const ListSearch = () => {
	// contexts
	const { state: { user }} = useContext(AuthContext);

	// states
	const [ searchUserUsername, setSearchUserUsername ] = useState('');
	const [ usersFound, setUsersFound ] = useState([]);

	// ========================================
	//	states for the username search history 
	// ========================================
	const [ searchHistUserIds, setSearchHistUserIds ] = useState([]);

	// user search
  useEffect(() => {
    if (searchUserUsername && searchUserUsername.length >= 1) {
      setUsersFound([]);
      console.log("length: ", searchUserUsername.length, " input: ", searchUserUsername);
      const searchUsers = getSearchUsersFire(searchUserUsername, "all");
      searchUsers
      .then((users) => {
        console.log('Search users: ', users.length);
        if (users.length < 1) {
          setUsersFound([]);
          console.log('An user not found.');
          // when there isn't a user clear the previous list for an update
          // dispatch({ type: 'clear_search'});
        } else {
          setUsersFound(users);
          // dispatch({ type: 'search_users', payload: users});
        };
      });

    } else {
      setSearchUserUsername('');
      setUsersFound([]);
      // Clear when the input length became 0 from 1
      // clearUserUsernameInput();
      // clearSearchUser();
    }
  }, [searchUserUsername]);

  // get user search history
  useEffect(() => {
  	if (user && user.id) {
  		const getUserSearchHist = getUserSearchHistoryFire(user.id);
  		getUserSearchHist
  		.then((result) => {
  			setSearchHistUserIds(result.fetchedSearchHist);
  			console.log("search history: ", result);
  		})
  		.catch((error) => {

  		});
  	}
  }, []);

	return (
		<View style={{ flex: 1, backgroundColor: color.white2 }}>
			<View style={{ paddingVertical: RFValue(10) }}>
				<SearchBar
					searchUserUsername={searchUserUsername}
				  setSearchUserUsername={setSearchUserUsername}
				  setUsersFound={setUsersFound}
				  customPlaceholderText={"Search with username"}
				/>
			</View>
			{
				// show username search history
				// when no username input
				// and search history exists 
		   	searchHistUserIds && 
		   	searchHistUserIds.length > 0 &&
		   	// searchUserUsername &&
		   	searchUserUsername.length === 0
		   	?
	   		<SearchHistUsersForm 
	   			currentUserId={user.id}
	   			userIds={searchHistUserIds} 
	   		/>
	   		: null
	   	}
			{
				searchUserUsername && 
				searchUserUsername.length > 0 && 
				usersFound && 
				usersFound.length > 0
				?
				<UsersFoundListForm
		      usersFound={usersFound}
	        setUsersFound={setUsersFound}
	        setSearchUserUsername={setSearchUserUsername}
	        setChosenUser={null}
	        navigateToAccount={true}
	        enableSearchHistory={true}
		    />
		    :
		    searchUserUsername && 
				searchUserUsername.length > 0 
				?
		    <Pressable
		    	style={{ flex: 1 }}
	        onPress={() => {
	        	Keyboard.dismiss();
	        }}
		    >
			    <View style={styles.listSearchGuideContainer}>
			    	<View style={styles.listSearchGuideIconContainer}>
			    		{antdesignSearch(RFValue(30), color.black1)}
			    	</View>
			    	<Text style={styles.listSearchGuideIconText}>
			    		Users are not found
			    	</Text>
			    </View>
			  </Pressable>
			  :
		    <Pressable
		    	style={{ flex: 1 }}
	        onPress={() => {
	        	Keyboard.dismiss();
	        }}
		    >
			    <View style={styles.listSearchGuideContainer}>
			    	<View style={styles.listSearchGuideIconContainer}>
			    		{antdesignSearch(RFValue(30), color.black1)}
			    	</View>
			    	<Text style={styles.listSearchGuideIconText}>
			    		Search by starting to put the username
			    	</Text>
			    </View>
			  </Pressable>
			}
		</View>
	)
}

const MapSearchScreen = ({ navigation }) => {
	const isFocused = useIsFocused();
	const [ error, setError ] = useState(null);

	const { 
		state: { currentLocation, searchLocation }, 
		addLocation, 
		addSearchLocation 
	} = useContext(LocationContext);

	const { state: { user }} = useContext(AuthContext);
	const [ locationError ] = useLocation(isFocused, addLocation);

  // search method clicked
  const [ mapSearchClicked, setMapSearchClicked ] = useState(true);
  const [ listSearchClicked, setListSearchClicked ] = useState(false);
  const [ searchMethod, setSearchMethod ] = useState('map');

  // view setting
  const [ viewSetting, setViewSetting ] = useState(false);
  const [ changeDistance, setChangeDistance ] = useState(false);
  const [ filterRating, setFilterRating ] = useState(false);

  // rating value to filter
  const [ rating, setRating ] = useState(0);

  // distance setting 
  // in km
  const [searchDistance, setSearchDistance] = useState(5);

  // -- businesses near states
  const [ busUsersNear, setBusUsersNear ] = useState([]);
  const [ filteredBusUsersNear, setFilteredBusUsersNear ] = useState([]);
  const [ fetchBusUserNearState, setFetchBusUserNearState ] = useState(false);

  const [ screenReady, setScreenReady ] = useState(false);

  const resetSettingAndBusUsersState = () => {
  	setViewSetting(false);
  	setChangeDistance(false);
  	setFilterRating(false);

  	setRating(0);
  	setSearchDistance(5);
  	// setBusUsersNear([]);
  	setFetchBusUserNearState(false);
  };

  // search businesses near
  // When app recives the current location for the first time
  // initiate the search and turn off the switch
  useEffect(() => {
  	let isMounted = true;
  	if (!fetchBusUserNearState && currentLocation && searchDistance) {
  		console.log("search");
  		isMounted && setFetchBusUserNearState(true);
  		const getBusUsersNear = getBusinessUsersNearFire(currentLocation, searchDistance, 'mile');
  		getBusUsersNear
  		.then((busUsers) => {
  			isMounted && setBusUsersNear(busUsers);
  			isMounted && setFilteredBusUsersNear(busUsers);
  			isMounted && setFetchBusUserNearState(false);
  			isMounted && setScreenReady(true);
  		})
  		.catch((error) => {
  			isMounted && setFetchBusUserNearState(false);
  		});
  	};

  	return () => {
  		isMounted = false;
  		resetSettingAndBusUsersState();
  	};
  }, [currentLocation, searchDistance]);

  useEffect(() => {
  	const filterBusUsersByRating = (rating) => {
			if (rating === 0) {
				return busUsersNear;
			} 

			return busUsersNear.filter(result => {
				const avgRating = Number(
					(Math.round(result.data.totalRating/result.data.countRating * 10) / 10).toFixed(1)
				)
				return avgRating >= rating;
			});
		};

		if (screenReady) {
	  	const filteredUsers = filterBusUsersByRating(rating);
	  	setFilteredBusUsersNear(filteredUsers);
	  	console.log("filtered");
		}
  }, [rating]);

	// map search component
		const renderMapSearch = () => {
			return (
				<View style={styles.mapContainer}>
					<MapSearchMap
						busUsersNear={filterBusUsersByRating(rating)}
						currentLocation={currentLocation}
						searchLocation={searchLocation}
					/>
		    </View>
			)
		}

	// render map search setting
		const renderFilterSetting = () => {
			return (
				<View style={styles.mapSettingContainer}>
	        <TouchableHighlight
	        	style={styles.settingButton}
	        	underlayColor={color.grey4}
	        	onPress={() => { setChangeDistance(true) }}
	        >
	        	<View style={styles.buttonContainer}>
	        		<MaterialCommunityIcons name="map-marker-distance" size={RFValue(23)} color={color.grey2}/>
	        		<Text style={styles.buttonText}>
		            {searchDistance} miles
		          </Text>
	        	</View>
	        </TouchableHighlight>
	        <TouchableHighlight
	        	style={styles.settingButton}
	        	underlayColor={color.grey4}
	        	onPress={() => { setFilterRating(true) }}
	        >
	        	<View style={styles.buttonContainer}>
		          <Text style={styles.settingButtonText}>
		          	<AntDesign name="hearto" size={RFValue(23)} color={color.ratingRed} />
		          </Text>
	         	</View>
	        </TouchableHighlight>
	        <TouchableHighlight
	        	style={styles.openCloseSettingButton}
	        	onPress={() => {setViewSetting(false)}}
	        	underlayColor={color.grey4}
	        >
	        	<View style={styles.buttonContainer}>
	          	<AntDesign name="upcircleo" size={RFValue(23)} color={color.black1} />
	        	</View>
	        </TouchableHighlight>
	      </View>
			)
		};

		const renderFilterDistance = () => {
			return (
				<View style={styles.distanceSettingContainer}>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
					>
		      	<TouchableHighlight
		        	style={styles.distanceSettingButton}
		        	onPress={() => {setSearchDistance(5)}}
		        	underlayColor={color.grey4}
		        >
		        	<View style={styles.distanceButtonContainer}>
			        	<Text style={styles.distanceText}>
			        		5
			        	</Text>
			        </View>
		        </TouchableHighlight>
		        <TouchableHighlight
		        	style={styles.distanceSettingButton}
		        	onPress={() => {setSearchDistance(10)}}
		        	underlayColor={color.grey4}
		        >
		        	<View style={styles.distanceButtonContainer}>
			        	<Text style={styles.distanceText}>
			        		10
			        	</Text>
			        </View>
		        </TouchableHighlight>
		        <TouchableHighlight
		        	style={styles.distanceSettingButton}
		        	onPress={() => {setSearchDistance(15)}}
		        	underlayColor={color.grey4}
		        >
		        	<View style={styles.distanceButtonContainer}>
			        	<Text style={styles.distanceText}>
			        		15
			        	</Text>
			        </View>
		        </TouchableHighlight>
		        <TouchableHighlight
		        	style={styles.distanceSettingButton}
		        	onPress={() => {setSearchDistance(20)}}
		        	underlayColor={color.grey4}
		        >
		        	<View style={styles.distanceButtonContainer}>
			        	<Text style={styles.distanceText}>
			        		20
			        	</Text>
			        </View>
		        </TouchableHighlight>
		        <TouchableHighlight
		        	style={styles.distanceSettingButton}
		        	onPress={() => {setSearchDistance(25)}}
		        	underlayColor={color.grey4}
		        >
		        	<View style={styles.distanceButtonContainer}>
			        	<Text style={styles.distanceText}>
			        		25
			        	</Text>
			        </View>
		        </TouchableHighlight>
		        <TouchableHighlight
		        	style={styles.distanceSettingButton}
		        	onPress={() => {setSearchDistance(30)}}
		        	underlayColor={color.grey4}
		        >
		        	<View style={styles.distanceButtonContainer}>
			        	<Text style={styles.distanceText}>
			        		30
			        	</Text>
			        </View>
		        </TouchableHighlight>
		        <TouchableHighlight
		        	style={styles.distanceSettingButton}
		        	onPress={() => {setSearchDistance(50)}}
		        	underlayColor={color.grey4}
		        >
		        	<View style={styles.distanceButtonContainer}>
			        	<Text style={styles.distanceText}>
			        		50
			        	</Text>
			        </View>
		        </TouchableHighlight>
		      </ScrollView>
		      <View style={styles.distanceUnitContainer}>
						<Text style={styles.distanceUnitText}>
							Miles
						</Text>
					</View>
	        <TouchableHighlight
	        	style={styles.openCloseSettingButton}
	        	onPress={() => {setChangeDistance(false)}}
	        	underlayColor={color.grey4}
	        >
	        	<View style={styles.buttonContainer}>
	          	<AntDesign name="upcircleo" size={RFValue(23)} color={color.black1} />
	        	</View>
	        </TouchableHighlight>
	      </View>
			)
		};

		const renderFilterRating = () => {
			return (
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
		        	<View style={styles.buttonContainer}>
			        	<Text style={styles.subSettingText}>
			        		Show All
			        	</Text>
			        </View>
		        </TouchableHighlight>
		        : null
		      }
	      	<TouchableHighlight
	        	style={styles.openCloseSettingButton}
	        	onPress={() => {setFilterRating(!filterRating)}}
	        	underlayColor={color.grey4}
	        >
	        	<View style={styles.buttonContainer}>
	          	<AntDesign name="upcircleo" size={RFValue(23)} color={color.black1} />
	        	</View>
	        </TouchableHighlight>
	      </View>
			)
		};

		const renderMapSearchSetting = () => {
			return (
				<View style={
					searchMethod === 'map'
					?
					[styles.searchMethodContainer, { position: 'absolute' }]
					: styles.searchMethodContainer
				}>
	      	<SafeAreaView/>
	      	<View style={styles.searchMethodInner}>
	      		<TouchableOpacity 
	      			style={styles.methodContainer}
	      			onPress={() => {
	      				setSearchMethod("map");
	      			}}
	      		>
	      			<View>
			          <Feather 
			            name="map" 
			            size={RFValue(24)} 
			            color={ searchMethod === 'map' ? color.purple1 : color.black1 }
			          />
			        </View>
		        </TouchableOpacity>
		        <TouchableOpacity 
		          style={styles.methodContainer}
		          onPress={() => {
		          	setSearchMethod("list");
		          }}
		        >
		        	<View>
		        		{fontawesomeListAlt(RFValue(24), 
		        			searchMethod === 'list' ? color.purple1 : color.black1
		        		)}
			        </View>
		        </TouchableOpacity>
		        {
		        	searchMethod === 'map'
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
		      	viewSetting && searchMethod === 'map'
		      	?
		      	<View style={styles.mapSettingUpperContainer}>
		      		{
		      			changeDistance && !filterRating
		      			?
		      			renderFilterDistance()
		      			: filterRating && !changeDistance
		      			?
		      			renderFilterRating()
		      			:
		      			renderFilterSetting()
		      		}
		      	</View>
		      	: null
		      }
	      </View>
			)
		};


	if (locationError) return (
		<View style={styles.mainContainer}>
			<View style={styles.mapContainer}>
				<View style={styles.locationErrorContainer}>
					<Text>Your location service is currently disabled.</Text>
				</View>
			</View>
		</View>
	);

	return (
		<View style={styles.mainContainer}>
			{renderMapSearchSetting()}
			{
				searchMethod === 'map'
				?
				<View style={styles.mapContainer}>
					<MapSearchMap
						busUsersNear={filteredBusUsersNear}
						currentLocation={currentLocation}
						searchLocation={searchLocation}
					/>
		    </View>
				: searchMethod === 'list'
				? 
				<ListSearch/>
				: 
				<View>
					<Text>Something went wrong</Text>
				</View>
			}
		</View>
  );
};

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},
	mapContainer: {
		flex: 1,
	},
	locationErrorContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
  searchMethodContainer: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 1
  },
  searchMethodInner: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonContainer: {
  	width: RFValue(30),
  	justifyContent: 'center',
  	alignItems: 'center'
  },
  methodContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingVertical: RFValue(7)
  },
  mapSettingUpperContainer: {
  },
  mapSettingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceSettingContainer: {
  	flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: RFValue(5)
  },
  settingButton: {
  	flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RFValue(3),
    padding: RFValue(3),
    marginHorizontal: RFValue(3)
  },
  distanceUnitContainer: {
  	justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(7),
  },
  distanceUnitText: {
  	fontSize: RFValue(15),
  	color: color.black1
  },
  distanceSettingButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RFValue(3),
    paddingHorizontal: RFValue(5),
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: RFValue(5)
  },
  buttonContainer: {
  	flexDirection: 'row',
  	justifyContent: 'center',
    alignItems: 'center',
  },
  distanceButtonContainer: {
  	flexDirection: 'row',
  	justifyContent: 'center',
    alignItems: 'center',
  },
  distanceText: {
  	fontSize: RFValue(17)
  },
  buttonText: {
  	justifyContent: 'center',
    alignItems: 'center',
  	paddingHorizontal: RFValue(3),
  	fontSize: RFValue(17),
  	color: color.black1
  },
  settingButtonText: {
  	justifyContent: 'center',
    alignItems: 'center',
  },
  openCloseSettingButton: {
  	padding: RFValue(7),
  	marginHorizontal: RFValue(5),
  	borderRadius: RFValue(10),
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

  usersFoundContainer: {
    backgroundColor: color.white1,
    flex: 1,
    opacity: 1,
    paddingHorizontal: "3%",
    paddingVertical: RFValue(10),
  },

  usersList:{
    flexDirection: 'row',
    height: RFValue(80),
  },

  usernameText: {
    color: color.black1,
    fontSize: RFValue(18),
  },
  userPhotoContainer:{
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: RFValue(10),
    paddingHorizontal: RFValue(5),
  },
  userPhoto: {
    width: RFValue(68),
    height: RFValue(68),
    borderRadius: RFValue(100),
  },
  userInfoContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  listSearchGuideContainer: {
  	flex: 1,
  	backgroundColor: color.white2,
  	justifyContent: 'center',
    alignItems: 'center',
  },
  listSearchGuideIconContainer: {
  	paddingVertical: RFValue(15)
  },
  listSearchGuideIconText: {
  	fontSize: RFValue(17),
  	color: color.black1
  },

  searchHistUserBoxContainer: {
  	flexDirection: 'row',
  	height: RFValue(80)
  },
  searchHistUserTouchableContainer: {
  	flex: 1,
  	flexDirection: 'row',
  },
  closeButtonContainer: {
  	justifyContent: 'center',
  	alignItems: 'center',
  	padding: RFValue(30)
  },
  shLabelContainer: {
  	justifyContent: 'center',
  	paddingLeft: RFValue(15),
  	paddingVertical: RFValue(10)
  },
  shLabelText: {
  	fontSize: RFValue(19)
  },
});

export default MapSearchScreen;
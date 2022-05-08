
// -- tech and business button system
// -- two button alert for bus tech button system

// -- React 
	import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
	import { 
		View,
		SafeAreaView,
		StatusBar,
		StyleSheet,
		Image,
		ImageBackground,
		Text,  
		TouchableOpacity,
		TouchableWithoutFeedback,
		Dimensions,
		FlatList,
		Animated,
		Pressable,
	  PanResponder,
	  Platform,
	  ActivityIndicator,
	} from 'react-native';

// -- NPMs
	import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
	import { Video, AVPlaybackStatus } from 'expo-av';
	import { TabView, TabBar } from 'react-native-tab-view';
	import { Button, Snackbar } from 'react-native-paper';
	import BottomSheet from 'reanimated-bottom-sheet';

// -- Components
	import BusRatePosts from '../components/accountScreen/BusRatePosts';
	import ButtonA from '../components/buttons/ButtonA';
	import AnimScaleButton from '../components/buttons/AnimScaleButton';
	import ProfileCardUpper from '../components/accountScreen/ProfileCardUpper';
	import ProfileCardBottom from '../components/accountScreen/ProfileCardBottom';
	import MainTemplate from '../components/MainTemplate';
	import MultiplePhotosIndicator from '../components/MultiplePhotosIndicator';
	import SpinnerFromActivityIndicator from '../components/ActivityIndicator';
	import UserAccountHeaderForm from '../components/accountScreen/UserAccountHeaderForm';
	import TwoButtonAlert from '../components/TwoButtonAlert';
	// Display Post
	import DisplayPostImage from '../components/displayPost/DisplayPostImage';
	import DisplayPostInfo from '../components/displayPost/DisplayPostInfo';
	import DisplayPostLoading from '../components/displayPost/DisplayPostLoading';
	// Loading Containers
	import GetPostLoading from '../components/GetPostLoading';
	// horizontal line
	import HeaderBottomLine from '../components/HeaderBottomLine';
	// rating
	import { RatingReadOnly } from '../components/RatingReadOnly';
	// business hours
	import BusinessHoursForm from '../components/accountScreen/BusinessHoursForm'
	// Last Page Sign
	import PostEndSign from '../components/PostEndSign';
	import DisplayPostEndSign from '../components/DisplayPostEndSign';
	import SnailBottomSheet from '../components/SnailBottomSheet';

// Context
	import { Context as AuthContext } from '../context/AuthContext';

// Firebase
	import {
		postNewTechDocFire,
		removeTechDocFire,
		inactivateTechDocFire,
		activateTechDocFire
	} from '../firebase/business/busTechPostFire';

	import {
		checkTechDoc
	} from '../firebase/business/busTechGetFire';

	import {
		getUserPostsFire,
		getBusinessDisplayPostsFire,
		getBusRatedPostsFire,
		getUserRatedPostsFire
	} from '../firebase/post/postGetFire';
	import {
		getUserInfoFire
	} from '../firebase/user/usersGetFire';

// Designs
	import { AntDesign } from '@expo/vector-icons';
	import { Feather } from '@expo/vector-icons';
	import { Ionicons } from '@expo/vector-icons';

// Color
	import color from '../color';

// -- expo icons
	import {
		antdesignPicture,
		antdesignStar,
		featherColumns,
		featherBookOpen,
		featherBook,
		matStarBoxMultipleOutline,
		chevronBack,
		antCheck,
		antdesignTeam
	} from '../expoIcons';

// -- Hooks
	import count from '../hooks/count';
	import { useOrientation } from '../hooks/useOrientation';
	import { roundUpFirstDec } from '../hooks/useMath';

// -- Constant Value
	const DISPLAY_POST_HEIGHT = RFValue(200);
	const DISPLAY_POST_WIDTH = RFValue(150);
	const DISPLAY_POST_MARGIN = 10;

	const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
	const TabBarHeight = RFValue(55);
	const SafeStatusBar = Platform.select({
	  ios: 44,
	  android: StatusBar.currentHeight,
	});

	const PullToRefreshDist = 50;
	const tab2ItemSize = 100;

const UserAccountScreen = ({ route, navigation }) => {
	// paper snackbar
	const [ showSnackBar, setShowSnackBar ] = useState(false);
	const [ snackBarText, setSnackBarText ] = useState(null);
  const onToggleSnackBar = () => setShowSnackBar(!showSnackBar);
  const onDismissSnackBar = () => setShowSnackBar(false);

	// -- orientation responsive width and height
		const [ windowWidth, setWindowWidth ] = useState(Dimensions.get("window").width);
	  const [ windowHeight, setWindowHeight ] = useState(Dimensions.get("window").height);
	  const [ threePostsRowImageWH, setThreePostsRowImageWH ] = useState(Dimensions.get("window").width/3 - 4/3);
	  const [ ratedPostImageWH, setRatedPostImageWH ] = useState()

	  const orientation = useOrientation();
	  useEffect(() => {
	  	const newWindowWidth = Dimensions.get("window").width;
	  	const newWindowHeight = Dimensions.get("window").height;
	  	setThreePostsRowImageWH(newWindowWidth/3 - 4/3);
	  	setWindowWidth(newWindowWidth);
	  	setWindowHeight(newWindowHeight);
	  	setRatedPostImageWH(newWindowWidth/2 - 1/2);
	  }, [orientation]);

	// -- collapsible tab states
  	// -- states
		const [routes, setRoutes] = useState(
			[
		    {key: 'tab1', title: 'Tab1'},
		    {key: 'tab2', title: 'Tab2'},
			]
		);
		const [tabIcons, setTabIcons] = useState(
			[ 
				antdesignPicture(RFValue(23), color.black1),
				matStarBoxMultipleOutline(RFValue(23), color.black1)
			]
		);

		useEffect(() => {
			if (accountUserData.type === 'business' || accountUserData.type === 'technician') {
				setRoutes([
			    {key: 'tab1', title: 'Tab1'},
			    {key: 'tab2', title: 'Tab2'},
			    {key: 'tab3', title: 'Tab3'}
				]);
				setTabIcons([ 
					antdesignPicture(RFValue(23), color.black1),
					<RatingReadOnly rating={accountUserData.totalRating/accountUserData.countRating}/>,
					matStarBoxMultipleOutline(RFValue(23), color.black1)
				]);
			} else {
				setRoutes([
			    {key: 'tab1', title: 'Tab1'},
			    {key: 'tab2', title: 'Tab2'}
				]);
				setTabIcons([ 
					antdesignPicture(RFValue(23), color.black1),
					matStarBoxMultipleOutline(RFValue(23), color.black1)
				]);
			}
		}, [accountUserData]);

	// -- account screen post states and effect
		const { accountUserId } = route.params;
		const [ refreshing, setRefreshing ] = React.useState(false);
		const [ screenReady, setScreenReady ] = useState(false);

		// tech bus states
		const [ busTechRelation, setBusTechRelation ] = useState(null);
		const [ showBottomSheetRelationHandler, setShowBottomSheetRelationHandler ] = useState(false);
		const toggleBottomSheetRelationHandler = () => {
			setShowBottomSheetRelationHandler(!showBottomSheetRelationHandler);
		}
		// state to use when accpeting and declining an application or an inviation
		const [ busTechRelationHandler, setBusTechRelationHandler ] = useState(null);
		const [ tbaStatus, setTbaStatus ] = useState(false);

		const { state: { user }} = useContext(AuthContext);
		const [ accountUserData, setAccountUserData ] = useState({});

		const [ isBusHoursVisible, setIsBusHoursVisible ] = useState(false);

		const [ userAccountPosts, setUserAccountPosts ] = useState([]);
		const [ userAccountPostLast, setUserAccountPostLast ] = useState(null);
		const [ userAccountPostFetchSwitch, setUserAccountPostFetchSwitch ] = useState(true);
		const [ userAccountPostState, setUserAccountPostState ] = useState(false);

		const [ userAccountDisplayPosts, setUserAccountDisplayPosts ] = useState([]);
		const [ userAccountDisplayPostLast, setUserAccountDisplayPostLast ] = useState(null);
		const [ userAccountDisplayPostFetchSwitch, setUserAccountDisplayPostFetchSwitch ] = useState(true);
		const [ userAccountDisplayPostState, setUserAccountDisplayPostState ] = useState(false);

		const [ userRatedPosts, setUserRatedPosts ] = useState([]);
		const [ userRatedPostLast, setUserRatedPostLast ] = useState(null);
		const [ userRatedPostFetchSwitch, setUserRatedPostFetchSwitch ] = useState(true);
		const [ userRatedPostState, setUserRatedPostState ] = useState(false);
		const [ isUserRatedPostActive, setIsUserRatedPostActive ] = useState(false);

		const [ busRatedPosts, setBusRatedPosts ] = useState([]);
		const [ busRatedPostLast, setBusRatedPostLast ] = useState(null);
		const [ busRatedPostFetchSwitch, setBusRatedPostFetchSwitch ] = useState(true);
		const [ busRatedPostState, setBusRatedPostState ] = useState(false);
		const [ isBusRatedPostActive, setIsBusRatedPostActive ] = useState(false);

		const resetPostStates = () => {
			setUserAccountPosts([]);
			setUserAccountPostLast(null);
			setUserAccountPostFetchSwitch(true);
			setUserAccountPostState(false);

			setUserAccountDisplayPosts([]);
			setUserAccountDisplayPostLast(null);
			setUserAccountDisplayPostFetchSwitch(true);
			setUserAccountDisplayPostState(false);

			setBusRatedPosts([]);
			setBusRatedPostLast(null);
			setBusRatedPostFetchSwitch(true);
			setBusRatedPostState(false);
			setIsBusRatedPostActive(false);

			setUserRatedPosts([]);
			setUserRatedPostLast(null);
			setUserRatedPostFetchSwitch(true);
			setUserRatedPostState(false);
			setIsUserRatedPostActive(false);
		};

		useEffect(() => {
			let mounted = true;
			const getScreenReady = new Promise ((res, rej) => {
				const getAccountUserData = getUserInfoFire(accountUserId);
				getAccountUserData
				.then((userData) => {
					if (userData) {
						let accountUserData = {
							id: userData.id,
							username:userData.username,
							name:userData.name,
							photoURL:userData.photoURL,
							postCount:userData.postCount,
							type: userData.type,
							sign:userData.sign,
							website:userData.website,
							coverPhotoURL: userData.coverPhotoURL
						};
						if (userData.type === "business") {
							accountUserData = { ...accountUserData, ...{
								business_hours: userData.business_hours,
								locationType:userData.locationType,
								locality: userData.locality,
								formatted_address:userData.formatted_address,
								googlemapsUrl:userData.googlemapsUrl,
								techs:userData.techs,
								displayPostCount:userData.displayPostCount,
								countRating:userData.countRating,
								businessRegisterdAt:userData.businessRegisteredAt,
								geometry: userData.geometry
							}}
						};
						mounted && setAccountUserData(accountUserData);

						// if account user is a business and current user is a tech
						if (userData.type === 'business' && user.type === 'technician') {
							const checkTechApp = checkTechDoc(userData.id, user.id);
							checkTechApp
							.then((result) => {
								// possible status
								// active
								// inactive
								// applied
								// invited
								setBusTechRelation(result);
							})
							.catch((error) => {

							});
						};
						if (userData.type === 'technician' && user.type === 'business') {
							const checkTechApp = checkTechDoc(user.id, userData.id);
							checkTechApp
							.then((result) => {
								// possible status
								// active
								// inactive
								// applied
								// invited
								setBusTechRelation(result);
							})
							.catch((error) => {

							});
						};

						// get account user's posts
						if(userAccountPostFetchSwitch && !userAccountPostState && mounted) {
							mounted && setUserAccountPostState(true);
							const getUserPosts = getUserPostsFire(null, accountUserId);
							getUserPosts
							.then((posts) => {
								mounted && setUserAccountPosts(posts.fetchedPosts);
								if (posts.lastPost !== undefined && mounted) {
									mounted && setUserAccountPostLast(posts.lastPost);
								} else {
									mounted && setUserAccountPostFetchSwitch(false);
								};
								mounted && setUserAccountPostState(false);
							})
							.catch((error) => {
								rej(error);
							});
						}
						// get account user's display posts
						if (userData.type === 'business' && userAccountDisplayPostFetchSwitch && !userAccountDisplayPostState && mounted) {
							mounted && setUserAccountDisplayPostState(true);
							const getDisplayPosts = getBusinessDisplayPostsFire(accountUserId, null);
							getDisplayPosts
							.then((posts) => {
								mounted && setUserAccountDisplayPosts(posts.fetchedPosts);
								if (posts.lastPost !== undefined) {
									mounted && setUserAccountDisplayPostLast(posts.lastPost);
								} else {
									mounted && setUserAccountDisplayPostFetchSwitch(false);
								};
								mounted && setUserAccountDisplayPostState(false);
							})
							.catch((error) => {
								rej(error);
							});
						}

						// set tab routes and icons depending on the type of user
						if (userData.type === 'business') {
							setRoutes(
								[
							    {key: 'tab1', title: 'Tab1'},
							    {key: 'tab2', title: 'Tab2'},
							    {key: 'tab3', title: 'Tab3'}
								]
							);
							setTabIcons(
								[ 
									antdesignPicture(RFValue(23), color.black1),
									<RatingReadOnly rating={userData.totalRating/userData.countRating}/>,
									matStarBoxMultipleOutline(RFValue(23), color.black1)
								]
							);
						}
						else if (userData.type === 'technician') {
							setRoutes(
								[
							    {key: 'tab1', title: 'Tab1'},
							    {key: 'tab2', title: 'Tab2'},
							    {key: 'tab3', title: 'Tab3'}
								]
							);
							setTabIcons(
								[ 
									antdesignPicture(RFValue(23), color.black1),
									<RatingReadOnly rating={userData.totalRating/userData.countRating}/>,
									matStarBoxMultipleOutline(RFValue(23), color.black1)
								]
							);
						}
						else {
							setRoutes(
								[
							    {key: 'tab1', title: 'Tab1'},
					    		{key: 'tab2', title: 'Tab2'},
								]
							);
							setTabIcons(
								[ 
									antdesignPicture(RFValue(23), color.black1),
									matStarBoxMultipleOutline(RFValue(23), color.black1)
								]
							);
						}

						res(true);
					}
				})
				.catch((error) => {
					rej(error);
				});
			});

			getScreenReady
			.then(() => {
				setScreenReady(true);
			})
			.catch((error) => {
				console.log(error);
			});

			return () => {
				mounted = false;
				resetPostStates();
			}
		}, [accountUserId]);

	  const onRefresh = useCallback(() => {
	  	let mounted = true;

	    const clearState = new Promise((res, rej) => {
	    	resetPostStates();
				res(true);
	    });

	    clearState
	    .then(() => {
	    	const getAccountUserData = getUserInfoFire(accountUserId);
				getAccountUserData
				.then((userData) => {
					if (userData) {
						let accountUserData = {
							id: userData.id,
							username:userData.username,
							name:userData.name,
							photoURL:userData.photoURL,
							postCount:userData.postCount,
							type: userData.type,
							sign:userData.sign,
							website:userData.website,
						};
						if (userData.type === "business") {
							accountUserData = { ...accountUserData, ...{
								locationType:userData.locationType,
								locality: userData.locality,
								formatted_address:userData.formatted_address,
								googlemapsUrl:userData.googlemapsUrl,
								techs:userData.techs,
								displayPostCount:userData.displayPostCount,
								countRating:userData.countRating,
								businessRegisterdAt:userData.businessRegisteredAt,
								geometry: userData.geometry
							}}
						};
						mounted && setAccountUserData(accountUserData);

						// get account user's posts
						if(userAccountPostFetchSwitch && !userAccountPostState && mounted) {
							mounted && setUserAccountPostState(true);
							const getUserPosts = getUserPostsFire(null, accountUserId);
							getUserPosts
							.then((posts) => {
								mounted && setUserAccountPosts(posts.fetchedPosts);
								if (posts.lastPost !== undefined && mounted) {
									mounted && setUserAccountPostLast(posts.lastPost);
								} else {
									mounted && setUserAccountPostFetchSwitch(false);
								};
								mounted && setUserAccountPostState(false);
							})
							.catch((error) => {

							});
						}
						// get account user's display posts
						if (userData.type === 'business' && userAccountDisplayPostFetchSwitch && !userAccountDisplayPostState && mounted) {
							mounted && setUserAccountDisplayPostState(true);
							const getDisplayPosts = getBusinessDisplayPostsFire(accountUserId, null);
							getDisplayPosts
							.then((posts) => {
								mounted && setUserAccountDisplayPosts(posts.fetchedPosts);
								if (posts.lastPost !== undefined) {
									mounted && setUserAccountDisplayPostLast(posts.lastPost);
								} else {
									mounted && setUserAccountDisplayPostFetchSwitch(false);
								};
								mounted && setUserAccountDisplayPostState(false);
							})
							.catch((error) => {

							});
						}

						// set tab routes and icons depending on the type of user
						if (userData.type === 'business') {
							setRoutes(
								[
							    {key: 'tab1', title: 'Tab1'},
							    {key: 'tab2', title: 'Tab2'},
							    {key: 'tab3', title: 'Tab3'}
								]
							);
							setTabIcons(
								[ 
									antdesignPicture(RFValue(23), color.black1),
									<RatingReadOnly rating={userData.totalRating/userData.countRating}/>,
									matStarBoxMultipleOutline(RFValue(23), color.black1)
								]
							);
						}
						else if (userData.type === 'technician') {
							setRoutes(
								[
							    {key: 'tab1', title: 'Tab1'},
							    {key: 'tab2', title: 'Tab2'},
							    {key: 'tab3', title: 'Tab3'}
								]
							);
							setTabIcons(
								[ 
									antdesignPicture(RFValue(23), color.black1),
									<RatingReadOnly rating={userData.totalRating/userData.countRating}/>,
									matStarBoxMultipleOutline(RFValue(23), color.black1)
								]
							);
						}
						else {
							setRoutes(
								[
							    {key: 'tab1', title: 'Tab1'},
					    		{key: 'tab2', title: 'Tab2'},
								]
							);
							setTabIcons(
								[ 
									antdesignPicture(RFValue(23), color.black1),
									matStarBoxMultipleOutline(RFValue(23), color.black1)
								]
							);
						}
					}
				})
				.catch((error) => {
					// handle error
				});
	    });

	    return () => {
	    	mounted = false;
	    }
	  }, []);

	// -- methods
		const busHoursVisibleSwitch = () => {
			setIsBusHoursVisible(!isBusHoursVisible);
		};

	// tabView states and refs
		/**
	   * stats
	   */
	  const [ tabHeaderHeight, setTabHeaderHeight ] = useState(300);
	  const [ tabIndex, setTabIndex ] = useState(0);
	  const [tab2Data] = useState(Array(30).fill(0));

	  /**
	   * ref
	   */
	  const scrollY = useRef(new Animated.Value(0)).current;
	  const headerScrollY = useRef(new Animated.Value(0)).current;
	  // for capturing header scroll on Android
	  const headerMoveScrollY = useRef(new Animated.Value(0)).current;
	  const listRefArr = useRef([]);
	  const listOffset = useRef({});
	  const isListGliding = useRef(false);
	  const headerScrollStart = useRef(0);
	  const _tabIndex = useRef(0);
	  const refreshStatusRef = useRef(false);

	// -- PanResponder for header
  	const headerPanResponder = useRef(
	    PanResponder.create({
	      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
	      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
	      onStartShouldSetPanResponder: (evt, gestureState) => {
	        headerScrollY.stopAnimation();
	        syncScrollOffset();
	        return false;
	      },

	      onMoveShouldSetPanResponder: (evt, gestureState) => {
	        headerScrollY.stopAnimation();
	        return Math.abs(gestureState.dy) > 5;
	      },
	      onPanResponderEnd: (evt, gestureState) => {
	        handlePanReleaseOrEnd(evt, gestureState);
	      },
	      onPanResponderMove: (evt, gestureState) => {
	        const curListRef = listRefArr.current.find(
	          (ref) => ref.key === routes[_tabIndex.current].key,
	        );
	        const headerScrollOffset = -gestureState.dy + headerScrollStart.current;
	        if (curListRef.value) {
	          // scroll up
	          if (headerScrollOffset > 0) {
	            curListRef.value.scrollToOffset({
	              offset: headerScrollOffset,
	              animated: false,
	            });
	            // start pull down
	          } else {
	            if (Platform.OS === 'ios') {
	              curListRef.value.scrollToOffset({
	                offset: headerScrollOffset / 3,
	                animated: false,
	              });
	            } else if (Platform.OS === 'android') {
	              if (!refreshStatusRef.current) {
	                headerMoveScrollY.setValue(headerScrollOffset / 1.5);
	              }
	            }
	          }
	        }
	      },
	      onShouldBlockNativeResponder: () => true,
	      onPanResponderGrant: (evt, gestureState) => {
	        headerScrollStart.current = scrollY._value;
	      },
	    }),
	  ).current;

	// -- PanResponder for list in tab scene
	  const listPanResponder = useRef(
	    PanResponder.create({
	      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
	      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
	      onStartShouldSetPanResponder: (evt, gestureState) => false,
	      onMoveShouldSetPanResponder: (evt, gestureState) => {
	        headerScrollY.stopAnimation();
	        return false;
	      },
	      onShouldBlockNativeResponder: () => true,
	      onPanResponderGrant: (evt, gestureState) => {
	        headerScrollY.stopAnimation();
	      },
	    }),
	  ).current;

	// -- Tab View useEffect
	  useEffect(() => {
	    scrollY.addListener(({value}) => {
	      const curRoute = routes[tabIndex].key;
	      listOffset.current[curRoute] = value;
	    });

	    headerScrollY.addListener(({value}) => {
	      listRefArr.current.forEach((item) => {
	        if (item.key !== routes[tabIndex].key) {
	          return;
	        }
	        if (value > tabHeaderHeight || value < 0) {
	          headerScrollY.stopAnimation();
	          syncScrollOffset();
	        }
	        if (item.value && value <= tabHeaderHeight) {
	          item.value.scrollToOffset({
	            offset: value,
	            animated: false,
	          });
	        }
	      });
	    });

	    // -- tab index 1 is about rated posts
	    // businesses will have posts that rated them
	    // technicians will have posts that rated them
	    // users will have posts that they rated

	    const getUserRatedPosts = () => {
	    	console.log("get user rated posts")
	    	if (userRatedPostFetchSwitch && !userRatedPostState) {
					setIsUserRatedPostActive(true);
					setUserRatedPostState(true);
					const getPosts = getUserRatedPostsFire(null, accountUserData.id);
					getPosts
					.then((result) => {
						console.log('fetchedPosts: ', result.fetchedPosts.length);
						setUserRatedPosts(result.fetchedPosts);
						if (result.lastPost !== undefined) {
							setUserRatedPostLast(result.lastPost);
						} else {
							setUserRatedPostFetchSwitch(false);
						};
						setUserRatedPostState(false);
					})
					.catch((error) => {

					});
				}
	    };
	    // do when tabIndex is 1, user type is business, and busRatedPost is never fetched
			if (tabIndex === 1 && accountUserData.type === "business") {
				if(busRatedPostFetchSwitch && !busRatedPostState) {
					setIsBusRatedPostActive(true);
					setBusRatedPostState(true);
					const getBusRatedPosts = getBusRatedPostsFire(null, accountUserData.id);
					getBusRatedPosts
					.then((result) => {
						setBusRatedPosts(result.fetchedPosts);
						if (result.lastPost !== undefined) {
							setBusRatedPostLast(result.lastPost);
						} else {
							setBusRatedPostFetchSwitch(false);
						};
						setBusRatedPostState(false);
					})
				}
			}
			// business
			if (accountUserData.type === "business" && tabIndex === 2) {
				getUserRatedPosts();
			};
			// user
			if (!accountUserData.type && tabIndex === 1) {
				getUserRatedPosts();
			};

	    return () => {
	      scrollY.removeAllListeners();
	      headerScrollY.removeAllListeners();
	    };
	  }, [routes, tabIndex]);

	// -- Helper functions
  	// -- scroll offset sync
  	// -- refresh action using panresponder
	  const syncScrollOffset = () => {
	    const curRouteKey = routes[_tabIndex.current].key;

	    listRefArr.current.forEach((item) => {
	      if (item.key !== curRouteKey) {
	        if (scrollY._value < tabHeaderHeight && scrollY._value >= 0) {
	          if (item.value) {
	            item.value.scrollToOffset({
	              offset: scrollY._value,
	              animated: false,
	            });
	            listOffset.current[item.key] = scrollY._value;
	          }
	        } else if (scrollY._value >= tabHeaderHeight) {
	          if (
	            listOffset.current[item.key] < tabHeaderHeight ||
	            listOffset.current[item.key] == null
	          ) {
	            if (item.value) {
	              item.value.scrollToOffset({
	                offset: tabHeaderHeight,
	                animated: false,
	              });
	              listOffset.current[item.key] = tabHeaderHeight;
	            }
	          }
	        }
	      }
	    });
	  };

	  const startRefreshAction = () => {
	    if (Platform.OS === 'ios') {
	      listRefArr.current.forEach((listRef) => {
	        listRef.value.scrollToOffset({
	          offset: -80,
	          animated: true,
	        });
	      });
	      refresh().finally(() => {
	        syncScrollOffset();
	        // do not bounce back if user scroll to another position
	        if (scrollY._value < 0) {
	          listRefArr.current.forEach((listRef) => {
	            listRef.value.scrollToOffset({
	              offset: 0,
	              animated: true,
	            });
	          });
	        }
	      });
	    } else if (Platform.OS === 'android') {
	      Animated.timing(headerMoveScrollY, {
	        toValue: -150,
	        duration: 300,
	        useNativeDriver: true,
	      }).start();
	      refresh().finally(() => {
	        Animated.timing(headerMoveScrollY, {
	          toValue: 0,
	          duration: 300,
	          useNativeDriver: true,
	        }).start();
	      });
	    }
	  };

	  const handlePanReleaseOrEnd = (evt, gestureState) => {
	    // console.log('handlePanReleaseOrEnd', scrollY._value);
	    syncScrollOffset();
	    headerScrollY.setValue(scrollY._value);
	    if (Platform.OS === 'ios') {
	      if (scrollY._value < 0) {
	        if (scrollY._value < -PullToRefreshDist && !refreshStatusRef.current) {
	          startRefreshAction();
	        } else {
	          // should bounce back
	          listRefArr.current.forEach((listRef) => {
	            listRef.value.scrollToOffset({
	              offset: 0,
	              animated: true,
	            });
	          });
	        }
	      } else {
	        if (Math.abs(gestureState.vy) < 0.2) {
	          return;
	        }
	        Animated.decay(headerScrollY, {
	          velocity: -gestureState.vy,
	          useNativeDriver: true,
	        }).start(() => {
	          syncScrollOffset();
	        });
	      }
	    } else if (Platform.OS === 'android') {
	      if (
	        headerMoveScrollY._value < 0 &&
	        headerMoveScrollY._value / 1.5 < -PullToRefreshDist
	      ) {
	        startRefreshAction();
	      } else {
	        Animated.timing(headerMoveScrollY, {
	          toValue: 0,
	          duration: 300,
	          useNativeDriver: true,
	        }).start();
	      }
	    }
	  };

	  const onMomentumScrollBegin = () => {
	    isListGliding.current = true;
	  };

	  const onMomentumScrollEnd = () => {
	    isListGliding.current = false;
	    syncScrollOffset();
	    // console.log('onMomentumScrollEnd'); 
	  };

	  const onScrollEndDrag = (e) => {
	    syncScrollOffset();

	    const offsetY = e.nativeEvent.contentOffset.y;
	    // console.log('onScrollEndDrag', offsetY);
	    // iOS only
	    if (Platform.OS === 'ios') {
	      if (offsetY < -PullToRefreshDist && !refreshStatusRef.current) {
	        startRefreshAction();
	      }
	    }

	    // check pull to refresh
	  };

	  const refresh = async () => {
	    console.log('-- start refresh');
	    refreshStatusRef.current = true;
	    await new Promise((resolve, reject) => {
	      // onRefresh();
	      setTimeout(() => {
	        resolve('done');
	      }, 2000);
	    }).then((value) => {
	      console.log('-- refresh done!');
	      refreshStatusRef.current = false;
	    });
	  };

	const renderLabel = ({route, focused}) => {
    return (
      <Text style={[styles.label, {opacity: focused ? 1 : 0.5}]}>
        {route.title}
      </Text>
    );
  };

  // -- Tab Bar Icons
		const renderBusIcon = ({route, focused, color}) => {
	    switch (route.key) {
	      case 'tab1':
	        return ( 
	          <View 
	            style={[{opacity: focused ? 1 : 0.5}]}
	          >
	            {tabIcons[0]}
	          </View>
	        )
	      case 'tab2':
	        return ( 
	          <View 
	            style={[{opacity: focused ? 1 : 0.5}]}
	          >
	            {tabIcons[1]}
	          </View> 
	        )
	      case 'tab3':
	        return ( 
	          <View 
	            style={[{opacity: focused ? 1 : 0.5}]}
	          >
	            {tabIcons[2]}
	          </View> 
	        )
	    }
	  }

	  const renderUserIcon = ({route, focused, color}) => {
	    switch (route.key) {
	      case 'tab1':
	        return ( 
	          <View 
	            style={[{opacity: focused ? 1 : 0.5}]}
	          >
	            {tabIcons[0]}
	          </View>
	        )
	      case 'tab2':
	        return ( 
	          <View 
	            style={[{opacity: focused ? 1 : 0.5}]}
	          >
	            {tabIcons[1]}
	          </View> 
	        )
	      case 'tab3':
	        return ( 
	          <View 
	            style={[{opacity: focused ? 1 : 0.5}]}
	          >
	            {tabIcons[2]}
	          </View> 
	        )
	    }
	  }

	// -- Tab View Render Scene
	  const renderBusScene = ({route}) => {
	    const focused = route.key === routes[tabIndex].key;
	    let numCols;
	    let data;
	    let renderItem;
	    let onEndReached;
	    switch (route.key) {
	      case 'tab1':
	        numCols = 3;
	        data = userAccountPosts;
	        renderItem = renderFirstTabItem;
	        onEndReached = firstTabOnEndReached;
	        break;
	      case 'tab2':
	        numCols = 2;
	        data = busRatedPosts;
	        renderItem = renderRatedPostItem;
	        onEndReached = busRatedPostOnEndReached;
	        break;
	      case 'tab3':
	        numCols = 2;
	        data = userRatedPosts;
	        renderItem = renderRatedPostItem;
	        onEndReached = userRatedPostOnEndReached;
	        break;
	      default:
	        return null;
	    }
	    return (
	      <Animated.FlatList
	        scrollToOverflowEnabled={true}
	        {...listPanResponder.panHandlers}
	        numColumns={numCols}
	        ref={(ref) => {
	          if (ref) {
	            const found = listRefArr.current.find((e) => e.key === route.key);
	            if (!found) {
	              listRefArr.current.push({
	                key: route.key,
	                value: ref,
	              });
	            }
	          }
	        }}
	        scrollEventThrottle={16}
	        onScroll={
	          focused
	            ? Animated.event(
	                [
	                  {
	                    nativeEvent: {contentOffset: {y: scrollY}},
	                  },
	                ],
	                {useNativeDriver: true},
	              )
	            : null
	        }
	        onMomentumScrollBegin={onMomentumScrollBegin}
	        onScrollEndDrag={onScrollEndDrag}
	        onMomentumScrollEnd={onMomentumScrollEnd}
	        // ItemSeparatorComponent={() => <View style={{height: 10}} />}
	        // ListHeaderComponent={() => <View style={{height: 10}} />}
	        contentContainerStyle={{
	          paddingTop: tabHeaderHeight + TabBarHeight,
	          minHeight: windowHeight - SafeStatusBar + tabHeaderHeight,
	        }}
	        showsHorizontalScrollIndicator={false}
	        data={data}
	        renderItem={renderItem}
	        onEndReached={onEndReached}
	        showsVerticalScrollIndicator={false}
	        keyExtractor={(item, index) => index.toString()}
	      />
	    );
	  };

	  const renderUserScene = ({route}) => {
	    const focused = route.key === routes[tabIndex].key;
	    let numCols;
	    let data;
	    let renderItem;
	    let onEndReached;
	    switch (route.key) {
	      case 'tab1':
	        numCols = 3;
	        data = userAccountPosts;
	        renderItem = renderFirstTabItem;
	        onEndReached = firstTabOnEndReached;
	        break;
	      case 'tab2':
	        numCols = 2;
	        data = userRatedPosts;
	        renderItem = renderRatedPostItem;
	        onEndReached = userRatedPostOnEndReached;
	        break;
	      default:
	        return null;
	    }
	    return (
	      <Animated.FlatList
	        scrollToOverflowEnabled={true}
	        {...listPanResponder.panHandlers}
	        numColumns={numCols}
	        ref={(ref) => {
	          if (ref) {
	            const found = listRefArr.current.find((e) => e.key === route.key);
	            if (!found) {
	              listRefArr.current.push({
	                key: route.key,
	                value: ref,
	              });
	            }
	          }
	        }}
	        scrollEventThrottle={16}
	        onScroll={
	          focused
	            ? Animated.event(
	                [
	                  {
	                    nativeEvent: {contentOffset: {y: scrollY}},
	                  },
	                ],
	                {useNativeDriver: true},
	              )
	            : null
	        }
	        onMomentumScrollBegin={onMomentumScrollBegin}
	        onScrollEndDrag={onScrollEndDrag}
	        onMomentumScrollEnd={onMomentumScrollEnd}
	        // ItemSeparatorComponent={() => <View style={{height: 10}} />}
	        // ListHeaderComponent={() => <View style={{height: 10}} />}
	        contentContainerStyle={{
	          paddingTop: tabHeaderHeight + TabBarHeight,
	          minHeight: windowHeight - SafeStatusBar + tabHeaderHeight,
	        }}
	        showsHorizontalScrollIndicator={false}
	        data={data}
	        renderItem={renderItem}
	        onEndReached={onEndReached}
	        showsVerticalScrollIndicator={false}
	        keyExtractor={(item, index) => index.toString()}
	      />
	    );
	  };

	// -- Tab Bar
	  const renderTabBar = (props) => {
	    const y = scrollY.interpolate({
	      inputRange: [0, tabHeaderHeight],
	      outputRange: [tabHeaderHeight, 0],
	      // extrapolate: 'clamp',
	      extrapolateRight: 'clamp',
	    });
	    return (
	      <Animated.View
	        style={{
	          top: 0,
	          zIndex: 1,
	          position: 'absolute',
	          transform: [{translateY: y}],
	          width: '100%',
	        }}>
	        <TabBar
	          {...props}
	          onTabPress={({route, preventDefault}) => {
	            if (isListGliding.current) {
	              preventDefault();
	            }
	          }}
	          style={styles.tab}
	          // renderLabel={renderLabel}
	          renderIcon={
	          	accountUserData.type === 'business' || accountUserData.type === 'technician'
	          	?
	          	renderBusIcon
	          	:
	          	renderUserIcon
	          }
	          indicatorStyle={styles.indicator}
	        />
	      </Animated.View>
	    );
	  };

	// -- Tab View
	  const renderTabView = () => {
	    return (
	      <TabView
	        onIndexChange={(id) => {
	          _tabIndex.current = id;
	          setTabIndex(id);
	        }}
	        navigationState={{index: tabIndex, routes}}
	        renderScene={
	        	accountUserData.type === 'business' || accountUserData.type === 'technician'
	        	?
	        	renderBusScene
	        	:
	        	renderUserScene
	        }
	        renderIcon={
          	accountUserData.type === 'business' || accountUserData.type === 'technician'
          	?
          	renderBusIcon
          	:
          	renderUserIcon
          }
	        renderTabBar={renderTabBar}
	        initialLayout={{
	          height: 0,
	          width: windowWidth,
	        }}
	      />
	    );
	  };

	// -- tech and business button system
		const renderBusTechCommButton = () => {
			return (
				// possible cases

				// account user = business and current user = tech
				// - if the business invited => busTechRelation is "invited"
				// - if the tech already joined => busTechRelation is "active"
				// account user = tech and current user = business
				// - if the tech applied => busTechRelation is "applied"
				// - if the business accepted => busTechRelation is "active"
				// else "inactive"

				<View style={styles.managerButtonContainer}>
					<AnimScaleButton
						icon={
							busTechRelation === 'invited' || 
							busTechRelation === 'applied'
							?
							antCheck(RFValue(19), color.blue1)
							:	busTechRelation === 'active'
							?
							antdesignTeam(RFValue(19), color.red2)
							: null
						}
						text={
							busTechRelation === 'invited'
							? `Invited`
							: busTechRelation === 'applied'
							?	`Applied`
							: busTechRelation === 'active'
							?	`On the same team`
							: busTechRelation === 'inactive' && accountUserData.type === 'business' && user.type === 'technician'
							? `Join ${accountUserData.username}`
							: busTechRelation === 'inactive' && accountUserData.type === 'technician' && user.type === 'business'
							? `Invite ${accountUserData.username}`
							: "Something went wrong"
						}
						customTextStyle={{
							fontSize: RFValue(15), 
							color: color.black1,
							paddingVertical: RFValue(7),
							paddingHorizontal: RFValue(3),
						}}
						customButtonContainerStyle={{
							backgroundColor: color.white2,
							borderWidth: 0.5,
							borderColor: color.grey3,
							borderRadius: RFValue(5),
							paddingHorizontal: RFValue(5),
						}}
						onPress={() => {
							// -- possible cases
							
							// when busTechRelation is invited (bus invited)
							// -- if user is a technician => open the handler
							// -- if user is a business => open the tba to remove the tech doc
							
							// when busTechRelation is applied (tech applied)
							// -- if user is a business => open the handler
							// -- if user is a tech => open the tba to remove the tech doc
							
							// when busTechRelation is active
							// -- if user is a tech or a bus => open the tba that can inactivate the tech doc
							
							// when busTechRelation is inactive
							// -- if user is a business => open the tba to invite
							// when busTechRelation is inactive
							// -- if user is a tech => open the tba to apply
							
							if (busTechRelation === 'invited' && user.type === 'technician') {
								toggleBottomSheetRelationHandler();
							}
							if (busTechRelation === 'invited' && user.type === 'business') {
								setTbaStatus('remove');
							}
							if (busTechRelation === 'applied' && user.type === 'business') {
								toggleBottomSheetRelationHandler();
							}
							if (busTechRelation === 'applied' && user.type === 'technician') {
								setTbaStatus('remove');
							}
							if (busTechRelation === 'active') {
								setTbaStatus("inactivate");
							}
							if (busTechRelation === 'inactive' && user.type === 'business') {
								setTbaStatus("invite");
							}
							if (busTechRelation === 'inactive' && user.type === 'technician') {
								setTbaStatus("apply");
							}
						}}
					/>
				</View>
			)
		}


	// -- Render Header
	  const renderHeader = () => {
	  	return (
	  		<Animated.View
	        {...headerPanResponder.panHandlers}
	        style={[
	          styles.header, 
	          { height: tabHeaderHeight },
	          {
	          	transform: [{
	          		translateY: scrollY.interpolate({
						      inputRange: [0, tabHeaderHeight],
						      outputRange: [0, -tabHeaderHeight],
						      extrapolateRight: 'clamp',
						      // extrapolate: 'clamp',
						    })
	          	}]
	          }
	        ]}
	      >
	        <View
	          onLayout={({ nativeEvent }) => {
	            setTabHeaderHeight(nativeEvent.layout.height);
	          }}
	        >
	          <ProfileCardUpper 
							photoURL={accountUserData.photoURL}
							postCount={accountUserData.postCount}
							displayPostCount={accountUserData.displayPostCount}
						/>
						<ProfileCardBottom
							locationType={accountUserData.type === 'business' && accountUserData.locationType}
							address={accountUserData.type === 'business' && accountUserData.formatted_address}
							googleMapUrl={accountUserData.type === 'business' && accountUserData.googlemapsUrl}
							sign={accountUserData.sign}
							websiteAddress={accountUserData.website}
							businessHours={accountUserData.business_hours && accountUserData.business_hours}
							busHoursExist={accountUserData.type === 'business' && accountUserData.business_hours ? true : false}
							busHoursVisibleSwitch={
								accountUserData.business_hours && accountUserData.type === 'business'
								?
								busHoursVisibleSwitch
								: null
							}
						/>
						<View style={styles.accountManagerContainer}>
							{busTechRelation && renderBusTechCommButton()}
							<AnimScaleButton
								text={"Follow"}
								customTextStyle={{
									fontSize: RFValue(15), 
									color: color.blue1,
									paddingVertical: RFValue(7),
									paddingHorizontal: RFValue(3),
								}}
								customButtonContainerStyle={{
									backgroundColor: color.white2,
									borderWidth: 0.5,
									borderColor: color.blue1,
									borderRadius: RFValue(5),
									paddingHorizontal: RFValue(5),
								}}
								onPress={() => {
									null
								}}
							/>
						</View>
						{ 
							accountUserData.type === 'business'
							?
							<View style={styles.displayPostLabelContainer}>
								{
									userAccountDisplayPostState
									?
									<DisplayPostLoading />
									:
									<Text style={styles.userPostsLabelText}>
										{featherBook(RFValue(23), color.black1)}
									</Text>
								}
								<TouchableOpacity 
									style={styles.showTwoColumnButtonContainer}
									onPress={() => {
										console.log("two");
									}}
								>
									{featherBookOpen(RFValue(23), color.black1)}
								</TouchableOpacity>
							</View>
							:
							null
						}
						{ 
							// don't use the loading spinner for display posts
							// already has a spinner for whole account screen
							screenReady && accountUserData.type === 'business'
							?
							<View style={styles.displayPostContainer}>
								<FlatList
									onEndReached={() => {
										if (
											accountUserData.type === 'business' && 
											userAccountDisplayPostFetchSwitch && 
											!userAccountDisplayPostState
										) {
											setUserAccountDisplayPostState(true);
											const getDisplayPosts = getBusinessDisplayPostsFire(accountUserData.id, accountDisplayPostLast);
											getDisplayPosts
											.then((posts) => {
												setUserAccountDisplayPosts([ ...userAccountDisplayPosts, ...posts.fetchedPosts ]);
												if (posts.lastPost !== undefined) {
													setUserAccountDisplayPostLast(posts.lastPost);
												} else {
													setUserAccountDisplayPostFetchSwitch(false);
												};
												setUserAccountDisplayPostState(false);
											})
											.catch((error) => {

											});
										} else {
											console.log("accountScreen: FlatList: onEndReached: display switch: " + userAccountDisplayPostFetchSwitch + " display state: " + userAccountDisplayPostState );
										}
									}}
									onEndReachedThreshold={0.1}
									// ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
			            horizontal
			            decelerationRate={'fast'}
			            pagingEnabled
			            snapToInterval={DISPLAY_POST_WIDTH + DISPLAY_POST_MARGIN}
			            showsHorizontalScrollIndicator={false}
			            data={userAccountDisplayPosts}
			            keyExtractor={(displayPost, index ) => index.toString()}
			            getItemLayout={
			            	(data, index) => (
				            	{
								        length: DISPLAY_POST_WIDTH + DISPLAY_POST_MARGIN,
								        offset: (DISPLAY_POST_WIDTH + DISPLAY_POST_MARGIN) * index,
								        index
								      }
				            )
									}
			            renderItem={({ item, index }) => {
			              return (
			                <TouchableWithoutFeedback 
			                  onPress={() => {
			                  	// navigation.navigate('PostDetail', {
			                  	// 	post: item,
			                  	// 	postSource: 'account'
			                  	// });
			                  	navigation.navigate(
			                  		"UserAccountPostsSwipeStack",
			                  		{
			                  			screen: "PostsSwipe",
			                  			params: {
			                  				postSource: 'accountDisplay',
				                  			cardIndex: index,
				                  			posts: userAccountDisplayPosts,
			      										postState: userAccountDisplayPostState,
																postFetchSwitch: userAccountDisplayPostFetchSwitch,
																postLast: userAccountDisplayPostLast,
			                  			}
			                  		}
			                  	);
			                  }}
			                >
			                	<View style={styles.displayPostInner}>
					                <DisplayPostImage
					                	type={item.data.files[0].type}
					                	url={item.data.files[0].url}
					                	imageWidth={DISPLAY_POST_WIDTH}
					                />
					                <DisplayPostInfo
					                	containerWidth={DISPLAY_POST_WIDTH}
					                	taggedCount={count.kOrNo(item.data.taggedCount)}
					                	rating={
					                		item.data.countRating
					                		?
					                		roundUpFirstDec(item.data.totalRating/item.data.countRating)
					                		: "-"
					                	}
					                	title={item.data.title}
					                	likeCount={count.kOrNo(item.data.likeCount)}
					                	price={item.data.price}
					                	etc={item.data.etc}
					                />
				                  { item.data.files.length > 1
				                  	? <MultiplePhotosIndicator
				                  			size={RFValue(17)}
				                  		/>
				                  	: null
				                  }
				                </View>
			                </TouchableWithoutFeedback>
			              )
			            }}
			          />
							</View>
							: screenReady && accountUserData.type === 'business' && userAccountDisplayPosts.length === 0
							? <DisplayPostsDefault />
							: null
						}
	        </View>
	      </Animated.View>
	  	)
	  };

	// -- Custom Refresh
	  const renderCustomRefresh = () => {
	    // headerMoveScrollY
	    return Platform.select({
	      ios: (
	        <AnimatedIndicator
	          style={{
	            top: -50,
	            position: 'absolute',
	            alignSelf: 'center',
	            transform: [
	            	// {
	             //    scale: scrollY.interpolate({
			           //  	inputRange: [-80, 0],
			           //    outputRange: [1.5, 0.5],
			           //    extrapolate: 'clamp',
			           //  })
	             //  },
	              {
	                translateY: scrollY.interpolate({
	                  inputRange: [-50, 0],
	                  outputRange: [80, 0],
	                  extrapolate: 'clamp',
	                })
	              },
	            ]
	          }}
	          animating
	          color={color.black1}
	        />
	      ),
	      android: (
	        <Animated.View
	          style={{
	            transform: [
	              {
	                translateY: headerMoveScrollY.interpolate({
	                  inputRange: [-100, 0],
	                  outputRange: [150, 0],
	                  extrapolate: 'clamp',
	                })
	              },
	            ],
	            backgroundColor: '#eee',
	            height: 38,
	            width: 38,
	            borderRadius: 19,
	            borderWidth: 2,
	            borderColor: '#ddd',
	            justifyContent: 'center',
	            alignItems: 'center',
	            alignSelf: 'center',
	            top: -50,
	            position: 'absolute',
	          }}>
	          <ActivityIndicator
	          	animating
	          	color={color.black2}
	          />
	        </Animated.View>
	      ),
	    });
	  };

	// -- First Tab Item
	  const renderFirstTabItem = ({ item, index }) => {
	    return (
	      <View
	        key={item.id}
	        style={[styles.imageContainer, 
	          index % 3 !== 0 ? { paddingLeft: 2 } : { paddingLeft: 0 }
	        ]}
	      >
	        <TouchableWithoutFeedback
	          onPress={() => {
	            navigation.navigate(
            		"UserAccountPostsSwipeStack",
            		{
            			screen: "PostsSwipe",
            			params: {
            				postSource: 'account',
		                cardIndex: index,
		                posts: userAccountPosts,
		                postState: userAccountPostState,
		                postFetchSwitch: userAccountPostFetchSwitch,
		                postLast: userAccountDisplayPostLast,
            			}
            		}
            	);
	          }}
	        > 
	          <View>
	            { 
	              item.data.files[0].type === 'video'
	              ?
	              <View style={{width: threePostsRowImageWH, height: threePostsRowImageWH}}>
	                <Video
	                  // ref={video}
	                  style={{
	                  	backgroundColor: color.white2,
	                  	width: threePostsRowImageWH, 
	                  	height: threePostsRowImageWH
	                  }}
	                  source={{
	                    uri: item.data.files[0].url,
	                  }}
	                  useNativeControls={false}
	                  resizeMode="contain"
	                  shouldPlay={false}
	                />
	              </View>
	              : item.data.files[0].type === 'image'
	              ?
	              <ImageBackground 
	                // defaultSource={require('../../img/defaultImage.jpeg')}
	                source={{uri: item.data.files[0].url}}
	                style={{width: threePostsRowImageWH, height: threePostsRowImageWH}}
	              />
	              : null
	            }
	            { item.data.files.length > 1
	              ? <MultiplePhotosIndicator size={16}/>
	              : null
	            }
	          </View>
	        </TouchableWithoutFeedback>
	      </View>
	    );
	  };

	// -- First Tab OnEndReached
	  const firstTabOnEndReached = () => {
	  	if (userAccountPostFetchSwitch && !userAccountPostState) {
	  		setAccountPostState(true);
		  	const getUserPosts = getUserPostsFire(userAccountPostLast, accountUserData.id);
				getUserPosts
				.then((posts) => {
					setUserAccountPosts([ ...accountPosts, ...posts.fetchedPosts ]);
					if (posts.lastPost !== undefined) {
						setUserAccountPostLast(posts.lastPost);
					} else {
						setUserAccountPostFetchSwitch(false);
					};
					setUserAccountPostState(false);
				});
	  	}
	  };

  // -- Bus Rated Post Item
	  const renderRatedPostItem = ({item, index}) => {
	  	return (
	  		<TouchableWithoutFeedback>
					<View style={[
						styles.ratedPostContainer,
						index % 2 !== 0 ? { paddingLeft: 2 } : { paddingLeft: 0 }
					]}>
	  				<View>
	            { 
	              item.data.files[0].type === 'video'
	              ?
	              <View style={{width: ratedPostImageWH, height: ratedPostImageWH}}>
	                <Video
	                  // ref={video}
	                  style={{backgroundColor: color.white2, borderWidth: 0, width: ratedPostImageWH, height: ratedPostImageWH}}
	                  source={{
	                    uri: item.data.files[0].url,
	                  }}
	                  useNativeControls={false}
	                  resizeMode="contain"
	                  shouldPlay={false}
	                />
	              </View>
	              : item.data.files[0].type === 'image'
	              ?
	              <ImageBackground 
	                // defaultSource={require('../../img/defaultImage.jpeg')}
	                source={{uri: item.data.files[0].url}}
	                style={{width: ratedPostImageWH, height: ratedPostImageWH}}
	              />
	              : null
	            }
	            { item.data.files.length > 1
	              ? <MultiplePhotosIndicator size={16}/>
	              : null
	            }
	          </View>
	          <View style={styles.ratingContainer}>
	          	<RatingReadOnly rating={item.data.rating}/>
	          </View>
	        </View>
		    </TouchableWithoutFeedback>
	  	)
	  };

	// -- Bus Rated Post OnEndReached
	  const busRatedPostOnEndReached = ({item, index}) => {
	  	if(busRatedPostFetchSwitch && !busRatedPostState) {
				setBusRatedPostState(true);
				const getUserPosts = getBusRatedPostsFire(busRatedPostLast, accountUserData.id);
				getUserPosts
				.then((posts) => {
					setBusRatedPosts(posts.fetchedPosts);
					if (posts.lastPost !== undefined) {
						setBusRatedPostLast(posts.lastPost);
					} else {
						setBusRatedPostFetchSwitch(false);
					};
					setBusRatedPostState(false);
				})
			}
	  };

	// -- User Rated Post OnEndReached
		const userRatedPostOnEndReached = ({item, index}) => {
	  	if(busRatedPostFetchSwitch && !busRatedPostState) {
				setBusRatedPostState(true);
				const getUserPosts = getBusRatedPostsFire(busRatedPostLast, accountUserData.id);
				getUserPosts
				.then((posts) => {
					setBusRatedPosts(posts.fetchedPosts);
					if (posts.lastPost !== undefined) {
						setBusRatedPostLast(posts.lastPost);
					} else {
						setBusRatedPostFetchSwitch(false);
					};
					setBusRatedPostState(false);
				})
			}
	  };

	// -- Header Bar
	  const renderHeaderBar = () => {
	  	return (
	  		<UserAccountHeaderForm
				  leftButtonTitle={null}
	      	leftButtonIcon={
	      		chevronBack(
	      			RFValue(27), 
	      			accountUserData.coverPhotoURL ? color.white2 : color.black1
	      		)
	      	}
				  leftButtonPress={() => { navigation.goBack() }}
				  coverPhotoMode={accountUserData.coverPhotoURL ? true : false}
					username={accountUserData.username}
					usernameTextStyle={
						accountUserData.coverPhotoURL 
						? { color: color.white2 }
						: { color: color.black1 }
					}
					title={null}
					firstIcon={
						<Feather name="send" size={RFValue(25)} color={
							accountUserData.coverPhotoURL
						? color.white2
						: color.black1
						}/>
					}
					secondIcon={
						accountUserData.type === 'business'
						? 
						<Feather name="shopping-bag" size={RFValue(25)} color={
							accountUserData.coverPhotoURL
							? color.white2
							: color.black1
						}/>
						: null
					}
					firstOnPress={() => {
						navigation.navigate('Chat', { theOtherUser: accountUserData });
					}}
					secondOnPress={
						accountUserData.type === 'business'
						? null
						: null
					}
				/>
	  	)
	  };

	// -- two button alert for bus tech button system
	 const renderTwoButtonAlert = () => {
	 	return (
	 		tbaStatus
	    && 
	    <TwoButtonAlert 
	      title={<Ionicons name="alert-circle-outline" size={RFValue(27)} color={color.black1} />}
	      message={
	      	busTechRelation === 'active' && user.type === 'technician'
	      	? `Say bye to ${accountUserData.username}?`
	      	: busTechRelation === 'active' && user.type === 'business'
	      	? `Say bye to ${accountUserData.username}?`
	      	: busTechRelation === 'invited' && user.type === 'business'
	      	? "Cancel the invitation?"

	      	: busTechRelation === 'invited' && 
	      	user.type === 'technician' && 
	      	accountUserData.type === 'business' && 
	      	busTechRelationHandler === 'accept'
	      	? `Accept ${accountUserData.username}'s Invitation?`

	      	: busTechRelation === 'invited' && 
	      	user.type === 'technician' && 
	      	accountUserData.type === 'business' && 
	      	busTechRelationHandler === 'decline'
	      	? `Decline ${accountUserData.username}'s Invitation?`

	      	: busTechRelation === 'applied' && user.type === 'technician'
	      	? "Cancel the application?"

	      	: busTechRelation === 'applied' && 
	      	user.type === 'business' &&
	      	accountUserData.type === 'technician' &&
	      	busTechRelationHandler === 'accept'
	      	? `Accept ${accountUserData.username}'s Application?`

	      	: busTechRelation === 'applied' && 
	      	user.type === 'business' &&
	      	accountUserData.type === 'technician' &&
	      	busTechRelationHandler === 'decline'
	      	? `Decline ${accountUserData.username}'s Application?`

					: accountUserData.type === 'business' && user.type === 'technician'
					? `Join ${accountUserData.username} as a technician?`
					: accountUserData.type === 'technician' && user.type === 'business'
					? `Recruit ${accountUserData.username} to your business?`
					: null
	      }
	      buttonOneText={"Yes"}
	      buttonTwoText={"No"}
	      buttonOneAction={() => {
	      	const postNewTechDoc = (busId, techId, senderId, receiverId, followingBusTechRelation) => {
	      		const postDoc = postNewTechDocFire(busId, techId, senderId, receiverId, followingBusTechRelation);
						postDoc
						.then((response) => {
							if (response) {
								setBusTechRelation(followingBusTechRelation);
								setShowSnackBar(true);
								setSnackBarText("Request Completed");
							}
							setTbaStatus(false);
						});
	      	};

	      	const removeTechDoc = (busId, techId, followingBusTechRelation) => {
	      		const removeDoc = removeTechDocFire(busId, techId);
	      		removeDoc
	      		.then((response) => {
	      			if (response) {
								setBusTechRelation(followingBusTechRelation);
								setShowSnackBar(true);
								setSnackBarText("Request Completed");
							}
							setTbaStatus(false);
	      		});
	      	}

	      	const inactivateTechDoc = (busId, techId, followingBusTechRelation) => {
	      		const inactivate = inactivateTechDocFire(busId, techId);
	      		inactivate
	      		.then((response) => {
	      			if (response) {
								setBusTechRelation(followingBusTechRelation);
								setShowSnackBar(true);
								setSnackBarText("Request Completed");
							}
							setTbaStatus(false);
	      		});
	      	};

	      	const activateTechDoc = (busId, techId, followingBusTechRelation) => {
	      		const inactivate = activateTechDocFire(busId, techId);
	      		inactivate
	      		.then((response) => {
	      			if (response) {
								setBusTechRelation(followingBusTechRelation);
								setShowSnackBar(true);
								setSnackBarText("Request Completed");
							}
							setTbaStatus(false);
	      		});
	      	};

	      	if (busTechRelation === 'active' && user.type === 'technician') {
	      		inactivateTechDoc(accountUserData.id, user.id, 'inactive');
	      	}
	      	if (busTechRelation === 'active' && user.type === 'business') {
	      		inactivateTechDoc(user.id, accountUserData.id, 'inactive');
	      	}
	      	// when user is a business and invited a tech
	      	if (
	      		user.type === 'business' && 
	      		accountUserData.type === 'technician' &&
	      		busTechRelation === 'invited'
	      	) {
	      		removeTechDoc(user.id, accountUserData.id, 'inactive');
	      	}
	      	// when user is a tech and applied for a tech
	      	if (
	      		user.type === 'technician' &&
	      		accountUserData.type === 'business' &&
	      		busTechRelation === 'applied'
      		) {
	      		removeTechDoc(accountUserData.id, user.id, 'inactive');
	      	}
	      	if (
	      		user.type === 'technician' &&
	      		accountUserData.type === 'business' && 
	      		busTechRelation === 'inactive'
	      	) {
	      		postNewTechDoc(accountUserData.id, user.id, user.id, accountUserData.id, 'applied');
	      	}
	      	if (
	      		user.type === 'business' &&
	      		accountUserData.type === 'technician' && 
	      		busTechRelation === 'inactive'
	      	) {
	      		postNewTechDoc(user.id, accountUserData.id, user.id, accountUserData.id, 'invited');
	      	}
	      	// when the user is a business and received an application
	      	if (user.type === 'business' &&
	      		accountUserData.type === 'technician' &&
	      		busTechRelation === 'applied' &&
	      		busTechRelationHandler === 'accept'
	      	) {
	      		activateTechDoc(user.id, accountUserData.id, 'active');
	      	}
	      	if (user.type === 'business' &&
	      		accountUserData.type === 'technician' &&
	      		busTechRelation === 'applied' &&
	      		busTechRelationHandler === 'decline'
	      	) {
	      		removeTechDoc(user.id, accountUserData.id, 'inactive');
	      	}
	      	// when the user is a technician and received an invitation
	      	if (user.type === 'technician' &&
	      		accountUserData.type === 'business' &&
	      		busTechRelation === 'invited' &&
	      		busTechRelationHandler === 'accept'
	      	) {
	      		activateTechDoc(accountUserData.id, user.id, 'active');
	      	}
	      	if (user.type === 'technician' &&
	      		accountUserData.type === 'business' &&
	      		busTechRelation === 'invited' &&
	      		busTechRelationHandler === 'decline'
	      	) {
	      		removeTechDoc(user.id, accountUserData.id, 'inactive');
	      	}
	      }}
	      buttonTwoAction={() => { 
	      	setTbaStatus(false)
	      }}
	    />
	 	)
	 }

	// -- bottom sheet tech bus relation handler
	  const BusTechRelationHandler = () => (
	    <View
	      style={{
	        backgroundColor: color.white2,
	      }}
	    >
	    	<Pressable
	    		onPress={() => {
	    			setBusTechRelationHandler('accept');
	    			toggleBottomSheetRelationHandler();
	    			setTbaStatus(true);
	    		}}
	    	>
		    	<View style={[styles.relationHandlerTextContainer, { height: windowHeight * 0.1 }]}>
		    		<Text style={styles.relationHandlerText}>
		    			Accept
		    		</Text>
		    	</View>
		    </Pressable>
		    <HeaderBottomLine/>
		    <Pressable
		    	onPress={() => {
		    		setBusTechRelationHandler('decline');
		    		toggleBottomSheetRelationHandler();
		    		setTbaStatus(true);
		    	}}
		    >
		    	<View style={[styles.relationHandlerTextContainer, { height: windowHeight * 0.1 }]}>
		    		<Text style={styles.relationHandlerText}>
		    			Decline
		    		</Text>
		    	</View>
		    </Pressable>
		    <HeaderBottomLine/>
	    </View>
	  );

		const bottomSheetRef = React.useRef(null);

	return (
		screenReady
		?
		<View style={{ flex: 1, backgroundColor: color.white1 }}>
			<View style={styles.headerBarContainer}>
				<ImageBackground
					source={{ uri: accountUserData.coverPhotoURL }}
					resizeMode="cover"
					style={{ }}
				>
					<SafeAreaView/>
					{renderHeaderBar()}
				</ImageBackground>
			</View>
			<View style={styles.mainContainer}>
				{renderTabView()}
	      {renderHeader()}
	      {renderCustomRefresh()}
			</View>
			{
				isBusHoursVisible &&
				<BusinessHoursForm
					businessHours={accountUserData.business_hours}
					busHoursVisibleSwitch={busHoursVisibleSwitch}
				/>
			}
			{renderTwoButtonAlert()}
			{
				showBottomSheetRelationHandler &&
				<SnailBottomSheet
					snapPoints={[0, 0.3, 1]}
					snapSwitchs={[false, false]}
					content={<BusTechRelationHandler/>}
					onClickBackground={() => {setShowBottomSheetRelationHandler(false)}}
					onCloseEnd={() => {setShowBottomSheetRelationHandler(false)}}
				/>
			}
			<Snackbar
        visible={showSnackBar}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Close',
          onPress: () => {
            onDismissSnackBar()
          },
        }}>
        {snackBarText}
      </Snackbar>
		</View>
		: 
		<SafeAreaView style={{ 
			flex: 1, 
			justifyContent: 'center', 
			alignItems: 'center' 
		}}>
			<SpinnerFromActivityIndicator/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
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
	accountManagerContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: color.white2,
		paddingVertical: RFValue(5)
	},
	managerButtonContainer: {
		backgroundColor: color.white2,
		marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: RFValue(15),
	},
	// zIndex shadow 5
	displayPostLabelContainer: {
		backgroundColor: color.white2,
		justifyContent: 'center',
		alignItems: 'center',
    padding: RFValue(10),
    height: RFValue(57),
	},

	showTwoColumnButtonContainer: {
		position: 'absolute',
		alignSelf: 'flex-end',
		paddingRight: RFValue(10)
	},
	displayPostContainer: {
		backgroundColor: color.white2
	},
	displayPostInner: {
		height: DISPLAY_POST_HEIGHT,
		width: DISPLAY_POST_WIDTH,
		marginHorizontal: DISPLAY_POST_MARGIN/2,
	},
	multiplePhotosSymbol: {
		position: 'absolute',
		alignSelf: 'flex-end',
		paddingRight: 10,
		marginTop: 10,
	},

	imageContainer: {
    alignItems: 'center',
    marginBottom: 1,
  },

  header: {
    width: '100%',
    position: 'absolute',
    backgroundColor: color.white2,
  },
  label: {fontSize: 16, color: '#222'},
  tab: {
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: color.white2,
    height: TabBarHeight,
  },
  indicator: {
    backgroundColor: color.black1,
    height: 3,
  },

  ratedPostContainer: {
  	marginBottom: 2
  },
  ratingContainer: {
  	position: 'absolute'
  },

  relationHandlerTextContainer: {
  	justifyContent: 'center',
  	alignItems: 'center',
  },
  relationHandlerText: {
  	fontWeight: 'bold',
  	fontSize: RFValue(19)
  },
});


export default UserAccountScreen;
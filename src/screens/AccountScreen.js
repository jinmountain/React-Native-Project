// Contents
// -- add a new post and change post states
// -- orientation responsive width and height
// -- account screen post states and effect
// -- collapsible tab states
// -- PanResponder for header
// -- PanResponder for list in tab scene

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
	  Alert,
	  ActivityIndicator,
	} from 'react-native';

// -- NPMs
	import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
	import { Video, AVPlaybackStatus } from 'expo-av';
	import { TabView, TabBar } from 'react-native-tab-view';

// -- Components
	import BusRatePosts from '../components/accountScreen/BusRatePosts';
	import RatedPostForm from '../components/accountScreen/RatedPostForm';
	// buttons
	import ButtonA from '../components/buttons/ButtonA';
	import ProfileCardUpper from '../components/accountScreen/ProfileCardUpper';
	import ProfileCardBottom from '../components/accountScreen/ProfileCardBottom';
	import MainTemplate from '../components/MainTemplate';
	import MultiplePhotosIndicator from '../components/MultiplePhotosIndicator';
	import SpinnerFromActivityIndicator from '../components/ActivityIndicator';
	import DisplayPostsDefault from '../components/defaults/DisplayPostsDefault';
	// Display Post
	import DisplayPostImage from '../components/displayPost/DisplayPostImage';
	import DisplayPostInfo from '../components/displayPost/DisplayPostInfo';
	import DisplayPostLoading from '../components/displayPost/DisplayPostLoading';
	// horizontal line
	import HeaderBottomLine from '../components/HeaderBottomLine';
	// rating
	import { RatingReadOnly } from '../components/RatingReadOnly';
	// business hours
	import BusinessHoursForm from '../components/accountScreen/BusinessHoursForm'
	// Last Page Sign
	import PostEndSign from '../components/PostEndSign';
	import DisplayPostEndSign from '../components/DisplayPostEndSign';
	// Header
	import UserAccountHeaderForm from '../components/accountScreen/UserAccountHeaderForm';
	// custom nav bar
	import NavigationBar from '../components/NavigationBar';

// Context
import { Context as AuthContext } from '../context/AuthContext';

// -- Firebase
	import {
		getUserPostsFire,
		getBusinessDisplayPostsFire,
		getUserRatedPostsFire,
		getBusRatedPostsFire
	} from '../firebase/post/postGetFire';

	import {
		getBusSpecialHourFire
	} from '../firebase/business/businessGetFire';

	import {
		getUserPhotoURLFire
	} from '../firebase/user/usersGetFire';

// hooks
import { convertToTime } from '../hooks/useConvertTime';

// Designs
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';

// Color
import color from '../color';

// -- expo icons
	import {
		antdesignPicture,
		antdesignStar,
		featherColumns,
		featherBookOpen,
		featherBook,
		matStarBoxMultipleOutline
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

const AccountScreen = ({ route, navigation }) => {
	// -- add a new post and change post states
		const { newPost } = route.params;
		useEffect(() => {
			if (newPost) {
				if (newPost.display) {
					setAccountDisplayPosts([ newPost, ...accountDisplayPosts ]);
				}
				else if (newPost.isRated) {

				}
				else {
					setAccountPosts([ newPost, ...accountPosts ]);
				}
			}
		}, [newPost]);

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

  // -- account screen post states and effect
		const [ screenReady, setScreenReady ] = useState(false);

		const { state: { user }, accountRefresh } = useContext(AuthContext);
		const [ isBusHoursVisible, setIsBusHoursVisible ] = useState(false); 
		const [ specialHour, setSpecialHour ] = useState(null);

		// const [ accountUserData, setAccountUserData ] = useState(user);

		const [ accountPosts, setAccountPosts ] = useState([]);
		const [ accountPostLast, setAccountPostLast ] = useState(null);
		const [ accountPostFetchSwitch, setAccountPostFetchSwitch ] = useState(true);
		const [ accountPostState, setAccountPostState ] = useState(false);

		const [ accountDisplayPosts, setAccountDisplayPosts ] = useState([]);
		const [ accountDisplayPostLast, setAccountDisplayPostLast ] = useState(null);
		const [ accountDisplayPostFetchSwitch, setAccountDisplayPostFetchSwitch ] = useState(true);
		const [ accountDisplayPostState, setAccountDisplayPostState ] = useState(false);

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
			setAccountPosts([]);
			setAccountPostLast(null);
			setAccountPostFetchSwitch(true);
			setAccountPostState(false);

			setAccountDisplayPosts([]);
			setAccountDisplayPostLast(null);
			setAccountDisplayPostFetchSwitch(true);
			setAccountDisplayPostState(false);

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

		// effect to fetch posts to make the first screen
		useEffect(() => {
			let isMounted = true;
			const getScreenReady = new Promise ((res, rej) => {
				// if user is a busines check if there is a special hour 
				if (user.type === 'business') {
					const timestampNow = Date.now();
					const timeNow = convertToTime(timestampNow);
					// console.log(timeNow.year, timeNow.monthIndex, timeNow.date);
					const getBusSpecialHour = getBusSpecialHourFire(user.id, timeNow.year, timeNow.monthIndex, timeNow.date);
					getBusSpecialHour
					.then((specialHour) => {
						setSpecialHour(specialHour);
					})
					.catch((error) => {
						rej(error);
					})
				}

				// get account user's posts
				if (
					accountPostFetchSwitch && 
					!accountPostState
				) {
					isMounted && setAccountPostState(true);
					const getUserPosts = getUserPostsFire(null, user.id);
					getUserPosts
					.then((posts) => {
						isMounted && setAccountPosts(posts.fetchedPosts);
						if (posts.lastPost !== undefined) {
							isMounted && setAccountPostLast(posts.lastPost);
						} else {
							isMounted && setAccountPostFetchSwitch(false);
						};
						isMounted && setAccountPostState(false);
					})
					.catch((error) => {
						rej(error);
					});
				}
				// get account user's display posts
				if (
					user.type === 'business' && 
					accountDisplayPostFetchSwitch && 
					!accountDisplayPostState
				) {
					isMounted && setAccountDisplayPostState(true);
					const getDisplayPosts = getBusinessDisplayPostsFire(user.id, null);
					getDisplayPosts
					.then((posts) => {
						isMounted && setAccountDisplayPosts(posts.fetchedPosts);
						if (posts.lastPost !== undefined) {
							isMounted && setAccountDisplayPostLast(posts.lastPost);
						} else {
							isMounted && setAccountDisplayPostFetchSwitch(false);
						};
						isMounted && setAccountDisplayPostState(false);
					})
					.catch((error) => {
						rej(error);
					});
				}
				res(true);
			});

			getScreenReady
			.then(() => {
				isMounted && setScreenReady(true);
			})
			.catch((error) => {
				console.log(error);
			});

			return () => {
				isMounted = false;
				resetPostStates();
			}
		}, []);

	  const onRefresh = useCallback(() => {
	    const clearState = new Promise((res, rej) => {
	    	resetPostStates();
				res(true);
	    });

	    clearState
	    .then(() => {
		  	accountRefresh();
	    	if(!accountPostState) {
					setAccountPostState(true);
					const getUserPosts = getUserPostsFire(null, user.id);
					getUserPosts
					.then((posts) => {
						setAccountPosts(posts.fetchedPosts);
						if (posts.lastPost !== undefined && isMounted) {
							setAccountPostLast(posts.lastPost);
						} else {
							setAccountPostFetchSwitch(false);
						};
						setAccountPostState(false);
					})
				}

				if (user.type === 'business' && !accountDisplayPostState) {
					setAccountDisplayPostState(true);
					const getDisplayPosts = getBusinessDisplayPostsFire(user.id, null);
					getDisplayPosts
					.then((posts) => {
						setAccountDisplayPosts(posts.fetchedPosts);
						if (posts.lastPost !== undefined) {
							setAccountDisplayPostLast(posts.lastPost);
						} else {
							setAccountDisplayPostFetchSwitch(false);
						};
						setAccountDisplayPostState(false);
					})
				}
	    })
	    .catch((error) => {
				// handle error
			});
	  }, []);

	// -- here on same for both AccountScreen and UserAccountScreen  
	// -- methods
		const busHoursVisibleSwitch = () => {
			setIsBusHoursVisible(!isBusHoursVisible);
		};

  // -- collapsible tab states
  	// -- states
		const [ routes, setRoutes ] = useState(
			user.type === 'business'
			?
			[
		    {key: 'tab1', title: 'Tab1'},
		    {key: 'tab2', title: 'Tab2'},
		    {key: 'tab3', title: 'Tab3'}
			]
			: user.type === 'technician'
			?
			[
		    {key: 'tab1', title: 'Tab1'},
		    {key: 'tab2', title: 'Tab2'},
		    {key: 'tab3', title: 'Tab3'}
			]
			:
			[
		    {key: 'tab1', title: 'Tab1'},
		    {key: 'tab2', title: 'Tab2'},
			]
		);
		const [ tabIcons, setTabIcons ] = useState(
			user.type === 'business'
			?
			[ 
				antdesignPicture(RFValue(23), color.black1),
				<RatingReadOnly rating={user.totalRating/user.countRating}/>,
				matStarBoxMultipleOutline(RFValue(23), color.black1)
			]
			:
			[ 
				antdesignPicture(RFValue(23), color.black1),
				matStarBoxMultipleOutline(RFValue(23), color.black1)
			]
		);

		useEffect(() => {
			if (user.type === 'business' || user.type === 'technician') {
				setRoutes([
			    {key: 'tab1', title: 'Tab1'},
			    {key: 'tab2', title: 'Tab2'},
			    {key: 'tab3', title: 'Tab3'}
				]);
				setTabIcons([ 
					antdesignPicture(RFValue(23), color.black1),
					<RatingReadOnly rating={user.totalRating/user.countRating}/>,
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
		}, [user]);

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
					const getPosts = getUserRatedPostsFire(null, user.id);
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
			if (tabIndex === 1 && user.type === "business") {
				if(busRatedPostFetchSwitch && !busRatedPostState) {
					setIsBusRatedPostActive(true);
					setBusRatedPostState(true);
					const getBusRatedPosts = getBusRatedPostsFire(null, user.id);
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
			if (user.type === "business" && tabIndex === 2) {
				getUserRatedPosts();
			};
			// user
			if (!user.type && tabIndex === 1) {
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
	    if (Platform.OS === 'ios') {
	      if (scrollY._value < 0) {
	      	console.log("value: ", scrollY._value);
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
	      onRefresh();
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
	    let flatListKey;
	    let numCols;
	    let data;
	    let renderItem;
	    let onEndReached;
	    switch (route.key) {
	      case 'tab1':
	      	flatListKey = "tab1"
	        numCols = 3;
	        data = accountPosts;
	        renderItem = renderFirstTabItem;
	        onEndReached = firstTabOnEndReached;
	        break;
	      case 'tab2':
	      	flatListKey = "tab2"
	        numCols = 1;
	        data = busRatedPosts;
	        renderItem = renderBusRatedPostItem;
	        onEndReached = busRatedPostOnEndReached;
	        break;
	      case 'tab3':
	      	flatListKey = "tab3"
	        numCols = 1;
	        data = userRatedPosts;
	        renderItem = renderUserRatedPostItem;
	        onEndReached = userRatedPostOnEndReached;
	        break;
	      default:
	        return null;
	    }
	    return (
	      <Animated.FlatList
	      	key={flatListKey}
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
	          minHeight: windowHeight
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
	        data = accountPosts;
	        renderItem = renderFirstTabItem;
	        onEndReached = firstTabOnEndReached;
	        break;
	      case 'tab2':
	        numCols = 2;
	        data = userRatedPosts;
	        renderItem = renderUserRatedPostItem;
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
	          minHeight: windowHeight
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
	        }}
	        // enable tabbar to have pan responder to move the header
	        {...headerPanResponder.panHandlers}
	      >
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
	          	user.type === 'business' || user.type === 'technician'
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
	        	user.type === 'business' || user.type === 'technician'
	        	?
	        	renderBusScene
	        	:
	        	renderUserScene
	        }
	        renderIcon={
          	user.type === 'business' || user.type === 'technician'
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
							photoURL={user.photoURL}
							postCount={user.postCount}
							displayPostCount={user.displayPostCount}
						/>
						<ProfileCardBottom
							phoneNumber={user.phoneNumber}
							locationType={user.type === 'business' && user.locationType}
							address={user.type === 'business' && user.formatted_address}
							googleMapUrl={user.type === 'business' && user.googlemapsUrl}
							sign={user.sign}
							websiteAddress={user.website}
							businessHours={user.business_hours && user.business_hours}
							busHoursExist={user.type === 'business' && user.business_hours ? true : false}
							busHoursVisibleSwitch={
								user.business_hours && user.type === 'business'
								?
								busHoursVisibleSwitch
								: null
							}
							specialHour={specialHour ? specialHour : null}
						/>
						<View style={styles.accountManagerContainer}>
							<View style={styles.managerButtonContainer}>
								<TouchableOpacity onPress={() => navigation.navigate('UpdateProfileStack')}>
									<ButtonA 
										text="Edit Profile"
										customStyles={{
											fontSize: RFValue(15), 
											color: color.black1,
										}}
									/>
								</TouchableOpacity>
							</View>
							{ user.type === 'business'
								?
								<View style={styles.managerButtonContainer}>
									<TouchableOpacity onPress={() => navigation.navigate('BusinessMain')}>
										<ButtonA 
											text="Manage Shop"
											customStyles={{
												fontSize: RFValue(15), 
												color: color.black1,
											}}
										/>
									</TouchableOpacity>
								</View>
								: null
							}
						</View>
						{ 
							user.type === 'business'
							?
							<View style={styles.displayPostLabelContainer}>
								{
									accountDisplayPostState
									?
									<DisplayPostLoading />
									:
									featherBook(RFValue(23), color.black1)
								}
								<TouchableOpacity 
									style={styles.showTwoColumnButtonContainer}
									onPress={() => {
										// navigate to two column screen
										navigation.navigate("DisplayPostTwoColumn", {
											posts: accountDisplayPosts
										});
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
							screenReady && user.type === 'business'
							?
							<View style={styles.displayPostContainer}>
								<FlatList
									onEndReached={() => {
										if (user.type === 'business' && accountDisplayPostFetchSwitch && !accountDisplayPostState) {
											setAccountDisplayPostState(true);
											const getDisplayPosts = getBusinessDisplayPostsFire(user.id, accountDisplayPostLast);
											getDisplayPosts
											.then((posts) => {
												setAccountDisplayPosts([ ...accountDisplayPosts, ...posts.fetchedPosts ]);
												if (posts.lastPost !== undefined) {
													setAccountDisplayPostLast(posts.lastPost);
												} else {
													setAccountDisplayPostFetchSwitch(false);
												};
												setAccountDisplayPostState(false);
											})
										}
									}}
									onEndReachedThreshold={0.1}
									// ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
			            horizontal
			            decelerationRate={'fast'}
			            pagingEnabled
			            snapToInterval={DISPLAY_POST_WIDTH + DISPLAY_POST_MARGIN}
			            showsHorizontalScrollIndicator={false}
			            data={accountDisplayPosts}
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
			                  		"AccountPostsSwipeStack",
			                  		{
			                  			screen: "PostsSwipe",
			                  			params: {
			                  				postSource: 'accountDisplay',
				                  			cardIndex: index,
				                  			posts: accountDisplayPosts,
			      										postState: accountDisplayPostState,
																postFetchSwitch: accountDisplayPostFetchSwitch,
																postLast: accountDisplayPostLast,
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
							: screenReady && user.type === 'business' && accountDisplayPosts.length === 0
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
	            navigation.navigate("AccountPostsSwipeStack", {
              	screen: 'PostsSwipe',
  							params: {
  								postSource: 'account',
		              cardIndex: index,
		              posts: accountPosts,
		              postState: accountPostState,
		              postFetchSwitch: accountPostFetchSwitch,
		              postLast: accountDisplayPostLast,
                }
              });
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
	  	if (accountPostFetchSwitch && !accountPostState) {
	  		setAccountPostState(true);
		  	const getUserPosts = getUserPostsFire(accountPostLast, user.id);
				getUserPosts
				.then((posts) => {
					setAccountPosts([ ...accountPosts, ...posts.fetchedPosts ]);
					if (posts.lastPost !== undefined) {
						setAccountPostLast(posts.lastPost);
					} else {
						setAccountPostFetchSwitch(false);
					};
					setAccountPostState(false);
				});
	  	}
	  };

  // -- Bus Rated Post Item
	  const renderBusRatedPostItem = ({item, index}) => {
	  	return (
		  	<RatedPostForm
		  		item={item}
		  		index={index}
		  		type={"bus"}
		  	/>
		  )
	  };

  // -- Bus Rated Post Item
	  const renderUserRatedPostItem = ({item, index}) => {
	  	return (
		  	<RatedPostForm
		  		item={item}
		  		index={index}
		  		type={"user"}
		  	/>
		  )
	  };

	// -- Bus Rated Post OnEndReached
	  const busRatedPostOnEndReached = ({item, index}) => {
	  	if(busRatedPostFetchSwitch && !busRatedPostState) {
				setBusRatedPostState(true);
				const getUserPosts = getBusRatedPostsFire(busRatedPostLast, user.id);
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
				const getUserPosts = getBusRatedPostsFire(busRatedPostLast, user.id);
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
				  leftButtonIcon={null}
				  leftButtonPress={null}
				  coverPhotoMode={user.coverPhotoURL ? true : false}
					username={user.username}
					usernameTextStyle={
						user.coverPhotoURL 
						? { color: color.white2 }
						: { color: color.black1 }
					}
					title={null}
					firstIcon={<AntDesign name="plus" size={RFValue(27)} color={
						user.coverPhotoURL
						? color.white2
						: color.black1
					} />}
					secondIcon={<AntDesign name="message1" size={RFValue(27)} color={
						user.coverPhotoURL
						? color.white2
						: color.black1
					} />}
					thirdIcon={<Feather name="menu" size={RFValue(27)} color={
						user.coverPhotoURL
						? color.white2
						: color.black1
					} />}
					firstOnPress={() => {
						navigation.navigate("ContentCreate");
					}}
					secondOnPress={() => {
						navigation.navigate("ChatListStack");
					}}
					thirdOnPress={() => {
						navigation.navigate("AccountManagerStack");
					}}
				/>
	  	)
	  };

	return (
		screenReady
		?
		<View style={{ flex: 1, backgroundColor: color.white1 }}>
			<View style={styles.headerBarContainer}>
				<ImageBackground
					source={{ uri: user.coverPhotoURL }}
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
					businessHours={user.business_hours}
					busHoursVisibleSwitch={busHoursVisibleSwitch}
				/>
			}
			<SafeAreaView/>
		</View>
		: 
		<SafeAreaView style={{ 
			flex: 1, 
			justifyContent: 'center', 
			alignItems: 'center',
			backgroundColor: color.white2,
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
  }
});

export default AccountScreen;
import React, { useRef, useState, useContext, useCallback, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Animated, 
  Text, 
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Dimensions
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import BottomSheet from 'reanimated-bottom-sheet';

// Components
import HeaderScrollExpandAnim from '../components/HeaderScrollExpandAnim';
import MainTemplate from '../components/MainTemplate';
import DefaultUserPhoto from '../components/defaults/DefaultUserPhoto';
import HeaderBottomLine from '../components/HeaderBottomLine';
import SpinnerFromActivityIndicator from '../components/ActivityIndicator';
import BasicLocationMap from '../components/BasicLocationMap';
import AlertBoxTop from '../components/AlertBoxTop';

// Design
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

// Firebase
import rsvGetFire from '../firebase/rsvGetFire';

// Contexts
import { Context as AuthContext } from '../context/AuthContext';
import { Context as PostContext } from '../context/PostContext';

// Hooks
import useConvertTime from '../hooks/useConvertTime';

// color
import color from '../color';

// icon
import expoIcons from '../expoIcons';

const RsvContainer = ({ rsv, rsvType, navigation }) => {
  // upcoming rsv json structure

  // rsvDetail = {
  //   id: doc.id,
  //   rsv: {
  //     busId: rsvData.busId,
  //     cusId: rsvData.cusId,
  //     confirm: rsvData.confirm,
  //     startAt: rsvData.startAt,
  //     etc: rsvData.etc,
  //     endAt: rsvData.endAt,
  //     completed: rsvData.completed
  //   },
  //   tech: {
  //     id: getTechData.id,
  //     username: techData.username,
  //     photoURL: techData.photoURL,
  //   },
  //   post: displayPost
  // }

  // post's display post json
  // displayPost = {
  //   id: postId, 
  //   data: postData, 
  //   user: busData, <= contains business user info
  //   like: like ? true : false
  // };

  return (
    <View style={styles.rsvsContainer}>
      {/*click to post detail screen*/}
      <View style={styles.postContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("PostDetail", {
              post: rsv.post,
              postSource: 'userAccountDisplay'
            })
          }}
        >
          {
            rsv.post && rsv.post.data.files[0] && rsv.post.data.files[0].type === 'image'
            ?
            <Image 
              source={{ uri: rsv.post.data.files[0].url }}
              style={{ width: RFValue(170), height: RFValue(170) }}
            />
            : rsv.post && rsv.post.data.files[0] && rsv.post.data.files[0].type === 'video'
            ?
            <Video
              // ref={video}
              style={{ width: RFValue(170), height: RFValue(170) }}
              source={{ uri: rsv.post.data.files[0].url}}
              useNativeControls={false}
              resizeMode="contain"
              shouldPlay={false}
            />
            : null
          }
        </TouchableOpacity>
      </View>
      <View style={styles.postInfoContainer}>
        <View style={styles.techBusContainer}>
          <View style={styles.busContainer}>
            <TouchableOpacity>
              <View style={styles.imageContainer}>
              { 
                rsv.post.user.photoURL
                ?
                <Image 
                  source={{uri: rsv.post.user.photoURL}}
                  style={{ width: RFValue(37), height: RFValue(37), borderRadius: RFValue(100)}}
                />
                :
                <DefaultUserPhoto 
                  customSizeBorder={RFValue(37)}
                  customSizeUserIcon={RFValue(27)}
                />
              }
              </View>
              <View style={styles.usernameContainer}>
                <Text style={styles.usernameText}>{rsv.post.user.username}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.techContainer}>
            <TouchableOpacity>
              <View style={styles.imageContainer}>
              { 
                rsv.tech.photoURL
                ?
                <Image 
                  source={{uri: rsv.tech.photoURL}}
                  style={{ width: RFValue(37), height: RFValue(37), borderRadius: RFValue(100)}}
                />
                :
                <DefaultUserPhoto 
                  customSizeBorder={RFValue(37)}
                  customSizeUserIcon={RFValue(27)}
                />
              }
              </View>
              <View style={styles.usernameContainer}>
                <Text style={styles.usernameText}>{rsv.tech.username}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.timePriceContainer}>
          <View style={styles.rsvDateContainer}>
            <Text style={styles.boldInfoText}>{useConvertTime.convertToMDD(rsv.rsv.startAt)}</Text>
          </View>
        </View>
        { 
          rsvType === 'upcoming'
          ?
          <View style={styles.statusContainer}>
            <View style={styles.statusInnerContainer}>
              <Text style={styles.boldInfoText}>{useConvertTime.convertToNormHourMin(rsv.rsv.startAt)}</Text>
              {expoIcons.entypoDot(RFValue(11), color.black1)}
              <Text style={styles.boldInfoText}>
                {expoIcons.dollarSign(RFValue(17), color.black1)} {rsv.post.data.price}
              </Text>
            </View>
          </View>
          : rsvType === 'previous'
          ?
          <View style={styles.statusContainer}>
            { 
              rsv.completed
              ? 
              <View style={styles.statusInnerContainer}>
                {expoIcons.antCheck(RFValue(17), color.blue1)}
                <Text style={styles.boldInfoText}>Complete</Text>
              </View>
              : 
              <View style={styles.statusInnerContainer}>
                {expoIcons.antClose(RFValue(17), color.black1)}
                <Text style={styles.boldInfoText}>Uncomplete</Text>
              </View>
            }
          </View>
          :
          <View style={styles.statusContainer}>
            <Text style={styles.boldInfoText}>Error</Text>
          </View>
        }
      </View>
    </View>
  )
};

const UserRsvScreen = ({ route, navigation }) => {
  const { 
    screenRefresh,
    showAlertBoxRequest,
    showAlertBoxRequestText,
  } = route.params;
	const offset = useRef(new Animated.Value(0)).current;
  const sheetRef = useRef(null);

  // bottom sheet states
  const [ showBottomSheet, setShowBottomSheet ] = useState(false);
  const [ bottomSheetHeight, setBottomSheetHeight ] = useState(Dimensions.get("window").height * 0.75);
  const [ bottomSheetRsvPost, setBottomSheetRsvPost ] = useState(null);
  const [ bottomSheetRsvTech, setBottomSheetRsvTech ] = useState(null);

  // Contexts
  const { state: { user } } = useContext(AuthContext);
  const { 
    state: { 
      upcomingRsvLast, 
      previousRsvLast 
    }, 
    addUpcomingRsvLast, 
    addPreviousRsvLast,

    clearUpcomingRsvLast,
    clearPreviousRsvLast,
  } = useContext(PostContext);

  // screen controls
  const [ windowWidth, setWindowWidth ] = useState(Dimensions.get("window").width);
  const [ screenReady, setScreenReady ] = useState(false);
  const [ refreshing, setRefreshing ] = useState(false);
  // alert box
  const [ showAlertBoxTop, setShowAlertBoxTop ] = useState(showAlertBoxRequest);
  const [ alertBoxTopText, setAlertBoxTopText ] = useState(showAlertBoxRequestText);

  // reservation states
  const [ upcomingRsvs, setUpcomingRsvs ] = useState([]);
  const [ getUpcomingRsvsState, setGetUpcomingRsvsState ] = useState(false);
  const [ upcomingRsvsFetchSwitch, setUpcomingRsvsFetchSwitch ] = useState(true);

  const [ previousRsvs, setPreviousRsvs ] = useState([]);
  const [ getPreviousRsvsState, setGetPreviousRsvsState ] = useState(false);
  const [ previousRsvsFetchSwitch, setPreviousRsvsFetchSwitch ] = useState(true);

  const [ dateNow, setDateNow ] = useState(Date.now());

  const onRefresh = useCallback(() => {
    let isMounted = true;
    isMounted && setRefreshing(true);

    const clearState = new Promise((res, rej) => {
      // things to reset
      isMounted && setScreenReady(false);

      isMounted && setUpcomingRsvs([]);
      isMounted && setGetUpcomingRsvsState(false);
      isMounted && setUpcomingRsvsFetchSwitch(true);
      isMounted && clearUpcomingRsvLast();

      isMounted && setPreviousRsvs([]);
      isMounted && setGetPreviousRsvsState(false);
      isMounted && setPreviousRsvsFetchSwitch(true);
      isMounted && clearPreviousRsvLast();

      isMounted && setDateNow(Date.now());

      res(true);
    });

    clearState
    .then(() => {
      const getScreenReady = new Promise ((res, rej) => {
        if ( isMounted && !getUpcomingRsvsState ) {
          isMounted && setGetUpcomingRsvsState(true);
          const getUpcomingRsvs = rsvGetFire.getUpcomingRsvsOfCus(user.id, dateNow, null);

          getUpcomingRsvs
          .then((result) => {
            isMounted && setUpcomingRsvs(result.rsvs);
            if (result.lastRsv !== undefined && isMounted) {
              isMounted && addUpcomingRsvLast(result.lastRsv);
            } else {
              isMounted && setUpcomingRsvsFetchSwitch(false);
            };

            if (!result.fetchSwitch) {
              isMounted && setUpcomingRsvsFetchSwitch(false);
            }

            isMounted && setGetUpcomingRsvsState(false);
          })
          .catch((error) => {
            console.log("ActivityScreen: getUpcomingRsvs: ", error);
          });
        }

        if ( isMounted && !getPreviousRsvsState ) {
          isMounted && setGetPreviousRsvsState(true);
          const getPreviousRsvs = rsvGetFire.getPreviousRsvsOfCus(user.id, dateNow, null);

          getPreviousRsvs
          .then((result) => {
            isMounted && setPreviousRsvs(result.rsvs);
            if (result.lastRsv !== undefined && isMounted) {
              isMounted && addPreviousRsvLast(result.lastRsv);
            } else {
              isMounted && setPreviousRsvsFetchSwitch(false);
            };

            if (!result.fetchSwitch) {
              isMounted && setPreviousRsvsFetchSwitch(false);
            }

            isMounted && setGetPreviousRsvsState(false);
          })
          .catch((error) => {
            console.log("ActivityScreen: getCompletedRsvs: ", error);
          });
        }

        res(true);
      });

      getScreenReady
      .then(() => {
        isMounted && setScreenReady(true);
        isMounted && setRefreshing(false);
      })
      .catch((error) => {
        console.log(error);
      });
    });

    return () => {
      isMounted = false;
    }
  }, []);

  // when screen get alert box request and refresh request from params
  useEffect(() => {
    console.log("showAlertBoxRequest: ", showAlertBoxRequest, "showAlertBoxRequestText: ", showAlertBoxRequestText,"screenRefresh: ", screenRefresh);
    let isMounted = true;

    // when showAlertBoxRequest is true, show the alert box
    if ( showAlertBoxRequest === true ) {
      const setAlertBoxStates = new Promise((res, rej) => {
        isMounted && setShowAlertBoxTop(showAlertBoxRequest);
        isMounted && setAlertBoxTopText(showAlertBoxRequestText);
        res();
      });

      // after showed the alert box set the params back to default setting
      setAlertBoxStates
      .then(() => {
        navigation.setParams({ 
          showAlertBoxRequest: false, 
          showAlertBoxRequestText: null, 
          // screenRefresh: null 
        });
      });
    };
    
    return () => {
      isMounted = false;
    }
  }, [showAlertBoxRequest]);

  useEffect(() => {
    let isMounted = true;
    if (screenRefresh) {
      isMounted && setRefreshing(true);

      const clearState = new Promise((res, rej) => {
        // things to reset
        isMounted && setScreenReady(false);

        isMounted && setUpcomingRsvs([]);
        isMounted && setGetUpcomingRsvsState(false);
        isMounted && setUpcomingRsvsFetchSwitch(true);
        isMounted && clearUpcomingRsvLast();

        isMounted && setPreviousRsvs([]);
        isMounted && setGetPreviousRsvsState(false);
        isMounted && setPreviousRsvsFetchSwitch(true);
        isMounted && clearPreviousRsvLast();

        isMounted && setDateNow(Date.now());

        res(true);
      });

      clearState
      .then(() => {
        const getScreenReady = new Promise ((res, rej) => {
          if ( isMounted && !getUpcomingRsvsState ) {
            isMounted && setGetUpcomingRsvsState(true);
            const getUpcomingRsvs = rsvGetFire.getUpcomingRsvsOfCus(user.id, dateNow, null);

            getUpcomingRsvs
            .then((result) => {
              console.log("refresh: upcomingRsvs: ", result.rsvs.length);
              isMounted && setUpcomingRsvs(result.rsvs);
              if (result.lastRsv !== undefined && isMounted) {
                isMounted && addUpcomingRsvLast(result.lastRsv);
              } else {
                isMounted && setUpcomingRsvsFetchSwitch(false);
              };

              if (!result.fetchSwitch) {
                isMounted && setUpcomingRsvsFetchSwitch(false);
              }

              isMounted && setGetUpcomingRsvsState(false);
            })
            .catch((error) => {
              console.log("ActivityScreen: getUpcomingRsvs: ", error);
            });
          }

          if ( isMounted && !getPreviousRsvsState ) {
            isMounted && setGetPreviousRsvsState(true);
            const getPreviousRsvs = rsvGetFire.getPreviousRsvsOfCus(user.id, dateNow, null);

            getPreviousRsvs
            .then((result) => {
              isMounted && setPreviousRsvs(result.rsvs);
              if (result.lastRsv !== undefined && isMounted) {
                isMounted && addPreviousRsvLast(result.lastRsv);
              } else {
                isMounted && setPreviousRsvsFetchSwitch(false);
              };

              if (!result.fetchSwitch) {
                isMounted && setPreviousRsvsFetchSwitch(false);
              }

              isMounted && setGetPreviousRsvsState(false);
            })
            .catch((error) => {
              console.log("ActivityScreen: getCompletedRsvs: ", error);
            });
          }

          res(true);
        });

        getScreenReady
        .then(() => {
          isMounted && setScreenReady(true);
          isMounted && setRefreshing(false);
          // set params back to default
          navigation.setParams({  
            screenRefresh: null 
          });
        })
        .catch((error) => {
          console.log(error);
        });
      });
    }

    return () => {
      isMounted = false;
    }
  }, [screenRefresh]);

  // get rsvs when screen is opened 
  useEffect(() => {
    let isMounted = true;

    const getScreenReady = new Promise ((res, rej) => {
      if ( isMounted && !getUpcomingRsvsState && upcomingRsvsFetchSwitch ) {
        isMounted && setGetUpcomingRsvsState(true);
        const getUpcomingRsvs = rsvGetFire.getUpcomingRsvsOfCus(user.id, dateNow, upcomingRsvLast);

        getUpcomingRsvs
        .then((result) => {
          isMounted && setUpcomingRsvs(result.rsvs);
          if (result.lastRsv !== undefined && isMounted) {
            isMounted && addUpcomingRsvLast(result.lastRsv);
          } else {
            isMounted && setUpcomingRsvsFetchSwitch(false);
          };

          if (!result.fetchSwitch) {
            isMounted && setUpcomingRsvsFetchSwitch(false);
          }

          isMounted && setGetUpcomingRsvsState(false);
        })
        .catch((error) => {
          console.log("ActivityScreen: getUpcomingRsvs: ", error);
        });
      }

      if ( isMounted && !getPreviousRsvsState && previousRsvsFetchSwitch ) {
        isMounted && setGetPreviousRsvsState(true);
        const getPreviousRsvs = rsvGetFire.getPreviousRsvsOfCus(user.id, dateNow, previousRsvLast);

        getPreviousRsvs
        .then((result) => {
          isMounted && setPreviousRsvs(result.rsvs);
          if (result.lastRsv !== undefined && isMounted) {
            isMounted && addPreviousRsvLast(result.lastRsv);
          } else {
            isMounted && setPreviousRsvsFetchSwitch(false);
          };

          if (!result.fetchSwitch) {
            isMounted && setPreviousRsvsFetchSwitch(false);
          }

          isMounted && setGetPreviousRsvsState(false);
        })
        .catch((error) => {
          console.log("ActivityScreen: getCompletedRsvs: ", error);
        });
      }
      res(true);
    });

    getScreenReady
    .then(() => {
      setScreenReady(true);
    })
    .catch((error) => {
      console.log(error);
    });

    return () => {
      isMounted = false;
      setUpcomingRsvs([]);
      setGetUpcomingRsvsState(false);
      setUpcomingRsvsFetchSwitch(true);
      clearUpcomingRsvLast();

      setPreviousRsvs([]);
      setGetPreviousRsvsState(false);
      setPreviousRsvsFetchSwitch(true);
      clearPreviousRsvLast();
    }
  }, []);

	return (
		<View style={{ flex: 1 }}>
      {
        screenReady
        ?
        <View style={{ flex: 1 }}>
    			<ScrollView
            style={{ flex: 1, backgroundColor: 'white', zIndex: 7 }}
            contentContainerStyle={{
              paddingBottom: RFValue(77),
            }}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: offset } } }],
              { useNativeDriver: false }
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            stickyHeaderIndices={[0]}
          >
            <HeaderScrollExpandAnim 
              animValue={offset}
              headerTitle={"Reservations"}
              maxHeaderHeight={RFValue(190)}
              minHeaderHeight={RFValue(50)}
              maxHeaderTitleSize={RFValue(50)}
              minHeaderTitleSize={RFValue(17)}
              backgroundColor={color.white2}
            />
            <View>
              <View style={styles.labelContainer}>
                <Text style={styles.labelText}>Upcoming</Text>
              </View>
              {
                upcomingRsvs.length > 0
                &&
                <HeaderBottomLine />
              }
              <View style={styles.upcomingRsvs}>
                {
                  upcomingRsvs.map(( item, index ) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        navigation.navigate("RsvDetail", {
                          rsvStatus: 'upcoming',
                          rsvDetail: item
                        });
                      }}
                      // delayPressIn={700}
                      // onPressIn={() => { 
                      //   console.log("longPress");
                      // }}
                      // onPressOut={() => {
                      // }}
                    >
                      {
                        index > 0
                        && <HeaderBottomLine />
                      }
                      <RsvContainer 
                        rsv={item} 
                        rsvType={'upcoming'} 
                        navigation={navigation} 
                      />
                    </TouchableOpacity>
                  ))
                }
                {
                  screenReady && upcomingRsvs.length > 0 && upcomingRsvsFetchSwitch
                  ?
                  <TouchableOpacity style={styles.loadMoreContainer}>
                    <Text style={styles.loadMoreText}>
                      Load More
                    </Text>
                  </TouchableOpacity>
                  :
                  null
                }
              </View>
              <HeaderBottomLine />
              <View style={styles.labelContainer}>
                <Text style={styles.labelText}>Past</Text>
              </View>
              <HeaderBottomLine />
              <View style={styles.previousRsvs}>
                {
                  previousRsvs.map(( item, index ) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        navigation.navigate("RsvDetail", {
                          rsvStatus: 'previous',
                          rsvDetail: item
                        });
                      }}
                      delayPressIn={700}
                      onPressIn={() => { 
                        console.log("longPress");
                      }}
                      onPressOut={() => {
                      }}
                    >
                      {
                        index > 0
                        && <HeaderBottomLine />
                      }
                      <RsvContainer rsv={item} rsvType={'previous'} navigation={navigation} />
                    </TouchableOpacity>
                  ))
                }
                {
                  screenReady && previousRsvs.length > 0 && previousRsvsFetchSwitch
                  ?
                  <TouchableOpacity style={styles.loadMoreContainer}>
                    <Text style={styles.loadMoreText}>
                      Load More
                    </Text>
                  </TouchableOpacity>
                  :
                  null
                }
              </View>
            </View>
    			</ScrollView>
          {
            showAlertBoxTop &&
            <AlertBoxTop 
              setAlert={setShowAlertBoxTop}
              alertText={alertBoxTopText}
            />
          }
        </View>
        :
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <SpinnerFromActivityIndicator/>
        </View>
      }
		</View>
	)
};

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center'
	},
	headerContainer: {
		// paddingVertical: RFValue(7),
		borderWidth: 1,
	},

  loadMoreContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: RFValue(77),
  },
  loadMoreText: {
    fontSize: RFValue(15),
    fontWeight: 'bold'
  },

  rsvsContainer: {
    width: '100%',
    flexDirection: 'row',
    height: RFValue(170),
  },
  labelContainer: {
    height: RFValue(50),
    justifyContent: 'center',
    paddingLeft: RFValue(15)
  },
  labelText: {
    fontSize: RFValue(25),
    fontWeight: 'bold'
  },
  postContainer: {
    flex: 1,
  },
  postInfoContainer: {
    flex: 1
  },
  techBusContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  busContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  techContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  usernameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  usernameText: {
    fontSize: RFValue(15)
  },
  timePriceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rsvDateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: RFValue(17),
  },
  rsvTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boldInfoText: {
    fontSize: RFValue(17),
    fontWeight: 'bold'
  },
});

export default UserRsvScreen;
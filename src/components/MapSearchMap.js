import React, { useContext, useEffect, useState, useRef } from 'react';
import { 
	View, 
	Text, 
	Image,
  TextInput,
	ScrollView,
  Animated, 
	StyleSheet,  
	TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
  TouchableHighlight,
  FlatList,
  Pressable,
  Linking,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Circle, Marker, Callout } from 'react-native-maps';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Video, AVPlaybackStatus } from 'expo-av';
import { useNavigation } from '@react-navigation/native';

// Designs
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

// Components
import SpinnerFromActivityIndicator from '../components/ActivityIndicator';
import { RatingReadOnly } from '../components/RatingReadOnly';
import DefaultUserPhoto from '../components/defaults/DefaultUserPhoto';

// firebase
import { getBusinessDisplayPostsFire } from '../firebase/post/postGetFire';

// Contexts
// import { Context as PostContext } from '../context/PostContext';
// import { Context as LocationContext } from '../context/LocationContext';

// Color
import color from '../color';

// expo icons
import { antdesignPhone } from '../expoIcons';

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height * 0.25;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const BusDisplayPosts = ({ busId }) => {
  const ImageWidth = RFValue(75);

  const [ displayPosts, setDisplayPosts ] = useState([]);
  const [ displayPostLast, setDisplayPostLast ] = useState(null);
  const [ displayPostFetchSwitch, setDisplayPostFetchSwitch ] = useState(true);
  const [ displayPostState, setDisplayPostState ] = useState(false);

  const resetStates = () => {
    setDisplayPosts([]);
    setDisplayPostLast(null);
    setDisplayPostFetchSwitch(true);
    setDisplayPostState(false);
  };

  useEffect(() => {
    let isMounted = true;
    if (displayPostFetchSwitch && !displayPostState) {
      isMounted && setDisplayPostState(true);
      const getDisplayPosts = getBusinessDisplayPostsFire(busId, null);
      getDisplayPosts
      .then((result) => {
        isMounted && setDisplayPosts(result.fetchedPosts);
        if (result.lastPost !== undefined) {
          isMounted && setDisplayPostLast(result.lastPost);
        } else {
          isMounted && setDisplayPostFetchSwitch(false);
        };
        isMounted && setDisplayPostState(false);
      })
      .catch((error) => {

      });
    }
    return () => {
      isMounted = false;
      resetStates();
    };
  }, [])

  const renderItem = () => {
    return (
      <View 
        key={item.id}
        style={styles.displayImageContainer}
      >
        { 
          item.data.files[0].type === 'video'
          ?
          <View style={{width: ImageWidth, height: ImageWidth}}>
            <Video
              style={{
                backgroundColor: color.white2,
                width: ImageWidth, 
                height: ImageWidth
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
          <Image
            // defaultSource={require('../../img/defaultImage.jpeg')}
            source={{uri: item.data.files[0].url}}
            style={{width: ImageWidth, height: ImageWidth}}
          />
          : null
        }
      </View>
    )
  }

  return (
    displayPosts.length > 0
    ?
    <Pressable
      onLongPress={() => {
        console.log("modal");
      }}
    >
      <View style={styles.displayPostsContainer}>
        {
          displayPosts.map((item, index) => (
            <View 
              key={item.id}
              style={styles.displayImageContainer}
            >
              { 
                item.data.files[0].type === 'video'
                ?
                <View style={{width: ImageWidth, height: ImageWidth}}>
                  <Video
                    style={{
                      backgroundColor: color.white2,
                      width: ImageWidth, 
                      height: ImageWidth
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
                <Image
                  // defaultSource={require('../../img/defaultImage.jpeg')}
                  source={{uri: item.data.files[0].url}}
                  style={{width: ImageWidth, height: ImageWidth}}
                />
                : null
              }
            </View>
          ))
        }
      </View>
    </Pressable>
    :
    <View style={{ justifyContent: 'center', alignItems: 'center', height: ImageWidth, backgroundColor: color.white1 }}>
      <Text>
        No Posts Yet
      </Text>
    </View>
  )
};

const MapSearchMap = ({ 
  busUsersNear, 
  currentLocation,
  searchLocation
}) => {
  // refer to his code 
  // https://github.com/itzpradip/Food-Finder-React-Native-App/blob/master/screens/ExploreScreen.js
	// const { 
 //    state: { currentLocation, searchLocation } 
 //  } = useContext(LocationContext);

  const navigation = useNavigation();

	let mapIndex = 0;
  let mapAnimation = new Animated.Value(0);

	useEffect(() => {
    // map animation listener 
    mapAnimation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); 
      // animate 30% away from landing on the next item
      if (index >= busUsersNear.length) {
        index = busUsersNear.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }
      
      clearTimeout(regionTimeout);

      const regionTimeout = setTimeout(() => {
        if( mapIndex !== index ) {
          mapIndex = index;
          const { location } = busUsersNear[index].data.geometry;
          console.log(location);
          _map.current.animateToRegion(
            {
              latitude: location.lat,
              longitude: location.lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01
            },
            350
          );
        }
      }, 10);
    });
  });

  const interpolations = busUsersNear.map((marker, index) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      ((index + 1) * CARD_WIDTH),
    ];

    const scale = mapAnimation.interpolate({
      inputRange,
      outputRange: [1, 1.3, 1],
      extrapolate: "clamp"
    });

    return { scale };
  });

  const onMarkerPress = (mapEventData) => {
    // const setBusinessScrollViewTrue = new Promise ((res, rej) => {
    //   setBusinessScrollView(true);
    //   res();
    // });
    const markerID = mapEventData._targetInst.return.key;

    let x = (markerID * CARD_WIDTH) + (markerID * 20); 
    if (Platform.OS === 'ios') {
      x = x - SPACING_FOR_CARD_INSET;
    }

    _scrollView.current.scrollTo({ x: x, y: 0, animated: true });
  };

  const _map = useRef(null);
  const _scrollView = useRef(null);

	if (!currentLocation) {
		return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <SpinnerFromActivityIndicator />
      </View>
    );
	}

	return (
		<View style={styles.container}>
			<MapView 
        ref={_map}
				provider={PROVIDER_GOOGLE}
				style={styles.map} 
				initialRegion={{
					...currentLocation,
					latitudeDelta: 0.01,
					longitudeDelta: 0.01
				}}
			>
				{busUsersNear.map((marker, index) => {
          const scaleStyle = {
            transform: [
              {
                scale: interpolations[index].scale,
              }
            ]
          }

          return (
            <MapView.Marker 
              key={index} 
              coordinate={{
                "latitude": marker.data.geometry.location.lat,
                "longitude": marker.data.geometry.location.lng
              }} 
              onPress={(e)=>onMarkerPress(e)}
            >
              <Animated.View style={styles.markerWrap}>
                <Animated.View
                  style={[styles.marker, scaleStyle]}
                > 
                  { marker.data.photoURL
                    ? 
                    <Image 
                      style={{ 
                        ...styles.businessPhoto, 
                        ...{ 
                          borderWidth: 2, 
                          borderColor: '#fff'
                        }
                      }} 
                      source={{uri: marker.data.photoURL}} 
                    />
                    : 
                    <DefaultUserPhoto 
                      customSizeBorder={RFValue(30)}
                      customSizeUserIcon={RFValue(20)}
                      customColor={color.black1}
                    />
                  }
                </Animated.View>
              </Animated.View>
            </MapView.Marker>
          );
        })}
			</MapView>

			<Animated.ScrollView
        ref={_scrollView}
        decelerationRate={"fast"}
        horizontal
        pagingEnabled
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 20}
        snapToAlignment="center"
        style={styles.scrollView}
        contentInset={{
          top: 0,
          left: SPACING_FOR_CARD_INSET,
          bottom: 0,
          right: SPACING_FOR_CARD_INSET
        }}
        contentContainerStyle={{
          paddingHorizontal: Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0
        }}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: mapAnimation,
                }
              },
            },
          ],
          {useNativeDriver: true}
        )}
      >
        { busUsersNear && busUsersNear.map((marker, index) =>(
          <TouchableWithoutFeedback
            key={index}
            onPress={() => {
              navigation.navigate('UserAccountStack', {
                screen: 'UserAccount',
                params: {
                  accountUserId: marker.id
                }
              })
            }}
          >
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.userPhotoContainer}>
                  { 
                    marker.data.photoURL
                    ? 
                    <Image 
                      source={{uri: marker.data.photoURL}}
                      style={styles.cardUserPhoto}
                      resizeMode="cover"
                    />
                    : 
                    <DefaultUserPhoto 
                      customSizeBorder={RFValue(33)}
                      customSizeUserIcon={RFValue(22)}
                      customColor={color.black1}
                    />
                  }
                  <View style={styles.userDistanceContainer}>
                    <Text style={styles.userDistanceText}>
                      {Math.round(marker.distance * 10) / 10}
                    </Text>
                    <Text style={styles.userDistanceText}>
                      miles
                    </Text>
                  </View>
                </View>
                <View style={styles.cardUserInfo}>  
                  <View styles={styles.cardUserInfoTop}>
                    <Text numberOfLines={1} style={styles.cardtitle}>{marker.data.username}</Text>
                    { marker.data.countRating >= 1 
                      ?
                      <View style={styles.cardRatingContainer}>
                        <Text style={styles.averageRatingText}>
                          {
                            // round up to the first decimal point
                            // fix the decimal point to the first
                            // change the type to Number
                            Number((Math.round(marker.data.totalRating/marker.data.countRating * 10) / 10).toFixed(1))
                          }
                        </Text>
                        <RatingReadOnly 
                          rating={Number((Math.round(marker.data.totalRating/marker.data.countRating * 10) / 10).toFixed(1))}
                        />
                        {
                          marker.data.countRating === 1
                          ? 
                            <Text style={styles.countRatingText}>
                              1 review
                            </Text>
                          : <Text style={styles.countRatingText}>
                              {marker.data.countRating} reviews
                            </Text>
                        }
                      </View>
                      :
                      <View style={styles.cardRatingContainer}>
                        <Text numberOfLines={1} style={styles.noRatingWarning}>
                          Waiting for the first review
                        </Text>
                      </View>
                    }
                    {
                      marker.data.sign && 
                      <Text numberOfLines={1} style={styles.cardDescription}>{marker.data.sign}</Text>
                    }
                    {
                      marker.data.phoneNumber && 
                      <Text 
                        numberOfLines={1} 
                        style={styles.cardDescription}
                        onPress={()=>{Linking.openURL(`tel:${marker.data.phoneNumber}`)}}
                      >
                        {antdesignPhone(RFValue(13), color.black1)} {marker.data.phoneNumber}
                      </Text>
                    }
                  </View>
{/*                  <View style={styles.cardUserInfoBottom}>
                    <View>
                    </View>
                  </View>*/}
                </View>
              </View>
              <View style={styles.cardBottom}>
                <BusDisplayPosts
                  busId={marker.id}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </Animated.ScrollView>
		</View>
	)
};

const styles = StyleSheet.create({
	container: {
    flex: 1,
  },
	map: {
		flex: 1,
		width: width,
		height: height,
	},
  scrollView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  card: {
    elevation: 5,
    backgroundColor: "#FFF",
    borderTopLeftRadius: RFValue(5),
    borderTopRightRadius: RFValue(5),
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardTop: {
    flex: 1,
    padding: RFValue(10),
    flexDirection: 'row',
  },
  cardBottom: {
    justifyContent: 'flex-end'
  },
  userPhotoContainer: {
    paddingHorizontal: RFValue(5),
    paddingTop: RFValue(5),
  },
  cardUserPhoto: {
    width: RFValue(35),
    height: RFValue(35),
    borderRadius: 100,
  },
  cardUserInfo: {
    flex: 1,
    paddingHorizontal: RFValue(5),
    paddingTop: RFValue(5),
  },
  cardUserInfoTop: {

  },
  cardtitle: {
    fontSize: RFValue(15),
    // marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: RFValue(13),
    color: color.grey3,
  },
  // Rating
  cardRatingContainer: {
    alignItems: 'center',
    paddingVertical: RFValue(3), 
    flexDirection: 'row',
  },
  countRatingText: {
    paddingLeft: RFValue(3),
    color: color.grey3,
    paddingHorizontal: RFValue(2),
  },
  noRatingWarning: {
    paddingRight: RFValue(3),
    fontSize: RFValue(12),
    color: color.grey3,
  },
  averageRatingText: {
    color: color.grey3,
    paddingRight: RFValue(3), 
  },
  // Markers stay static (not responsive)
  markerWrap: {
    alignItems: "center",
    justifyContent: 'center',
    width: RFValue(55),
    height: RFValue(55),
  },
  marker: {
    alignItems: "center",
    justifyContent: 'center',
    width: RFValue(55),
    height: RFValue(55),
    elevation: 5,
  },
  userPhoto: {
    justifyContent: 'center',
    alignItems: 'center',
    width: RFValue(30),
    height: RFValue(30),
    borderRadius: 100,
  },
  businessPhoto: {
    justifyContent: 'center',
    alignItems: 'center',
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: 100,
  },

  userDistanceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: RFValue(10)
  },
  userDistanceText: {
    color: color.black1,
    fontSize: RFValue(11)
  },

  displayPostsContainer: {
    flexDirection: 'row'
  },
});

export default MapSearchMap;
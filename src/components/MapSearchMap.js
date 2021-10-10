import React, { useContext, useEffect, useState } from 'react';
import { 
	View, 
	Text, 
	Image,
  TextInput,
	ScrollView,
  Animated, 
	StyleSheet,  
	TouchableOpacity,
  Dimensions,
  Platform,
  TouchableHighlight,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Circle, Marker, Callout } from 'react-native-maps';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

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

// Contexts
// import { Context as PostContext } from '../context/PostContext';
// import { Context as LocationContext } from '../context/LocationContext';

// Color
import color from '../color';

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height * 0.35;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const colorByRating = (rating) => {
  // about color look colors for rating in color.js
  if (rating !== null && rating >= 1) {
    return '#4815AA';
  } 
  else if (rating !== null && rating >= 2) {
    return "#DA9E00";
  }
  else if (rating !== null && rating >= 3) {
    return "#0C6B94";
  } 
  else if (rating !== null && rating >= 4) {
    return "#6E5BD4";
  } 
  else if (rating !== null && rating >= 5) {
    return "#F60000";
  } 
  else {
    return "#E0E0E0";
  };
};

const MapSearchMap = ({ 
  businessUsersNear, 
  navigate, 
  userPhotoURL,
  currentLocation,
  searchLocation,
  addBusinessUser
}) => {
  // show or hide scroll view
  const [ viewScrollView, setViewScrollView ] = useState(true);

  // refer to his code 
  // https://github.com/itzpradip/Food-Finder-React-Native-App/blob/master/screens/ExploreScreen.js
	// const { 
 //    state: { currentLocation, searchLocation } 
 //  } = useContext(LocationContext);

  // const { 
  //   state: { businessUsersNear }, 
  // } = useContext(PostContext);

	let mapIndex = 0;
  let mapAnimation = new Animated.Value(0);

	useEffect(() => {
    mapAnimation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); 
      // animate 30% away from landing on the next item
      if (index >= businessUsersNear.length) {
        index = businessUsersNear.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }
      
      clearTimeout(regionTimeout);

      const regionTimeout = setTimeout(() => {
        if( mapIndex !== index ) {
          mapIndex = index;
          const { location } = businessUsersNear[index].geometry;
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

  const interpolations = businessUsersNear.map((marker, index) => {
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

    if (viewScrollView === true) {
      _scrollView.current.scrollTo({x: x, y: 0, animated: true});
    } else {
      setViewScrollView(true);
    };
  };

  const _map = React.useRef(null);
  const _scrollView = React.useRef(null);

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
        onPress={() => { setViewScrollView(!viewScrollView) }}
			>
        <MapView.Marker
          key={'currrentLocation'}
          coordinate={{
            ...currentLocation,
          }}
        >
          { 
            userPhotoURL
            ?
            <Image 
              style={styles.userPhoto} 
              source={{uri: userPhotoURL}} 
            />
            :
            <AntDesign name="smile-circle" size={RFValue(24)} color="#2B2C33" />
          }
        </MapView.Marker>
				{businessUsersNear.map((marker, index) => {
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
                "latitude": marker.geometry.location.lat,
                "longitude": marker.geometry.location.lng
              }} 
              onPress={(e)=>onMarkerPress(e)}
            >
              <Animated.View style={[styles.markerWrap]}>
                <Animated.View
                  style={[styles.marker, scaleStyle]}
                > 
                  { marker.photoURL
                    ? <Image 
                        style={{ 
                          ...styles.userPhoto, 
                          ...{ 
                            borderWidth: 2, 
                            borderColor: '#fff'
                          }
                        }} 
                        source={{uri: marker.photoURL}} 
                      />
                    : <Feather name="user" size={RFValue(24)} color="black" />
                  }
                </Animated.View>
              </Animated.View>
            </MapView.Marker>
          );
        })}
			</MapView>
      { viewScrollView
        ?
  			<Animated.ScrollView
          ref={_scrollView}
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
          {businessUsersNear.map((marker, index) =>(
            <TouchableOpacity
              style={styles.card}
              key={index}
              onPress={() => {
                addBusinessUser(marker);
                navigate("MapSearchPosts", 
                  {
                    businessUser: marker, 
                  }
                );
              }}
            >
              <Image 
                source={{uri: marker.photoURL}}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.textContent}>
                <Text numberOfLines={1} style={styles.cardtitle}>{marker.username}</Text>
                { marker.countRating >= 1 
                  ?
                  <View style={styles.cardRatingContainer}>
                    <Text style={styles.averageRatingText}>
                      {
                        // round up to the first decimal point
                        // fix the decimal point to the first
                        // change the type to Number
                        Number((Math.round(marker.totalRating/marker.countRating * 10) / 10).toFixed(1))
                      }
                    </Text>
                    <RatingReadOnly 
                      rating={Number((Math.round(marker.totalRating/marker.countRating * 10) / 10).toFixed(1))}
                    />
                    {
                      marker.countRating === 1
                      ? 
                        <Text style={styles.countRatingText}>
                          1 review
                        </Text>
                      : <Text style={styles.countRatingText}>
                          {marker.countRating} reviews
                        </Text>
                    }
                  </View>
                  :
                  <View style={styles.cardRatingContainer}>
                    <Text numberOfLines={1} style={styles.noRatingWarning}>
                      Waiting for the first
                    </Text>
                    <AntDesign name="heart" size={RFValue(13)} color={color.rating5}/>
                  </View>
                }
                <Text numberOfLines={1} style={styles.cardDescription}>{marker.sign}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.ScrollView>
        : null
      }
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
    // padding: 10,
    elevation: 5,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    alignSelf: "center",
  },
  textContent: {
    flex: 2,
    padding: RFValue(10),
  },
  cardtitle: {
    fontSize: RFValue(15),
    // marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: RFValue(12),
    color: "#444",
  },
  // Rating
  cardRatingContainer: {
    alignItems: 'center',
    paddingVertical: 3, 
    flexDirection: 'row',
  },
  countRatingText: {
    paddingLeft: 3,
    color: '#5A646A',
    paddingHorizontal: 2,
  },
  noRatingWarning: {
    paddingRight: RFValue(3),
    fontSize: RFValue(12),
    color: '#5A646A',
  },
  averageRatingText: {
    color: '#5A646A',
    paddingRight: 3, 
  },
  // Markers stay static (not responsive)
  markerWrap: {
    alignItems: "center",
    justifyContent: 'center',
    width: 110,
    height: 80,
  },
  marker: {
    alignItems: "center",
    justifyContent: 'center',
    width: 30,
    height: 30,
    elevation: 5,
  },
  markerText: {
    fontSize: 15,
    color: 'black',
    elevation: 5,
    fontWeight: 'bold',
  },
  markerTextOutlineLeft: {
    position: 'absolute',
    paddingBottom: 1,
    paddingRight: 1, 
    color: "red",
    fontSize: 15,
    elevation: 4,
  },
  markerTextOutlineRight: {
    position: 'absolute',
    paddingTop: 1,
    paddingLeft: 1, 
    color: "red",
    fontSize: 15,
    elevation: 4,
  },
  button: {
    alignItems: 'center',
    marginTop: 5
  },
  signIn: {
    width: '100%',
    padding:5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3
  },
  textSign: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  userPhoto: {
    justifyContent: 'center',
    alignItems: 'center',
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: 100,
  }
});

export default MapSearchMap;
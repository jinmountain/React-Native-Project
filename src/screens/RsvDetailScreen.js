import React, { useRef, useState, useContext, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Animated, 
  Text, 
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  RefreshControl,
  Image,
  Linking,
  Dimensions
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import BottomSheet from 'reanimated-bottom-sheet';

// Components
import MainTemplate from '../components/MainTemplate';
import DefaultUserPhoto from '../components/defaults/DefaultUserPhoto';
import HeaderBottomLine from '../components/HeaderBottomLine';
import SpinnerFromActivityIndicator from '../components/ActivityIndicator';
import BasicLocationMap from '../components/BasicLocationMap';
import { HeaderForm } from '../components/HeaderForm';
import THButtonWithBorder from '../components/buttons/THButtonWithBorder'
import VerticalSwipePostImage from '../components/postCard/VerticalSwipePostImage';
import TwoButtonAlert from '../components/TwoButtonAlert';

// Design
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

// Hooks
import useConvertTime from '../hooks/useConvertTime';

// color
import color from '../color';

// icon
import expoIcons from '../expoIcons';

const RenderContent = ({ sheetRef, navigation, contentHeight, setShowTba }) => {
  return (
    <View
      style={{
        backgroundColor: color.white2,
        height: contentHeight,
      }}
    >
      <View style={{ 
        height: RFValue(50), 
        // backgroundColor: color.grey7,
        // alignItems: 'center' 
      }}>
        {/*{expoIcons.featherMoreHorizontal(RFValue(27), color.white2)}*/}
        <View style={{
          flexDirection: 'row',
          height: RFValue(50),
          alignItems: 'center',
          borderWidth: 1
        }}>
          <View style={{ flex: 1 }}>
            
          </View>
          <TouchableHighlight
            style={{ height: RFValue(50), width: RFValue(50), justifyContent: 'center', alignItems: 'center' }}
            onPress={() => sheetRef.current.snapTo(0)}
            underlayColor={color.grey4}
          >
            <View>
              {expoIcons.evilIconsClose(RFValue(27), color.black1)}
            </View>
          </TouchableHighlight>
        </View>
      </View>
      <HeaderBottomLine />
      <TouchableOpacity
        onPress={() => {
          setShowTba(true);
        }}
        style={styles.bsButtonTouch}
      >
        <View style={styles.bsButton}>
          <Text style={styles.bsButtonText}>Cancel Reservation</Text>
        </View>
      </TouchableOpacity>
      <HeaderBottomLine />
      <TouchableOpacity
        style={styles.bsButtonTouch}
      >
        <View style={styles.bsButton}>
          <Text style={styles.bsButtonText}>Share</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
};

const RsvDetailScreen = ({ route, navigation }) => {
  const { 
    rsvStatus,
    rsvDetail
  } = route.params;

  const sheetRef = useRef(null);

  // screen controls
  const [ windowWidth, setWindowWidth ] = useState(Dimensions.get("window").width);
  const [ showBottomSheet, setShowBottomSheet ] = useState(false);
  const [ bottomSheetHeight, setBottomSheetHeight ] = useState(RFValue(300));
  // const [ bottomSheetHeight, setBottomSheetHeight ] = useState(Dimensions.get("window").height * 0.3);
  const [ showTba, setShowTba ] = useState(false);

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
    <View style={{ flex: 1 }}>
      <HeaderForm 
        leftButtonTitle={null}
        leftButtonIcon={expoIcons.IoniconsMdArrowBack(RFValue(27), color.black1)}
        headerTitle={"Reservation Info"} 
        rightButtonTitle={null} 
        rightButtonIcon={expoIcons.featherMoreVertical(RFValue(23), color.grey2)}
        leftButtonPress={() => {
          navigation.goBack();
        }}
        rightButtonPress={() => {
          navigation.navigate(
            "RsvDetailManager", 
            {
              requestType: 'rsv',
              rsvId: rsvDetail.id,
              busId: rsvDetail.rsv.busId,
              busLocationType: rsvDetail.post.user.locationType,
              busLocality: rsvDetail.post.user.locality,
              cusId: rsvDetail.rsv.cusId,
              postServiceType: rsvDetail.post.data.service
            }
          )
          // setShowBottomSheet(!showBottomSheet);
        }}
      />
      <ScrollView>
        <View style={styles.rsvInfoContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Time and Status</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.boldInfoText}>{useConvertTime.convertToMDD(rsvDetail.rsv.startAt)}</Text>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.boldInfoText}>{useConvertTime.convertToNormHourMin(rsvDetail.rsv.startAt)}</Text>
          </View>
          <View style={styles.statusContainer}>
            {
              rsvStatus === 'upcoming'
              ?
              <Text style={styles.boldInfoText}>Upcoming</Text>
              : rsvDetail.rsv.completed
              ? 
              <View style={styles.statusInnerContainer}>
                {expoIcons.antCheck(RFValue(21), color.blue1)}
                <Text style={styles.boldInfoText}>Complete</Text>
              </View>
              : 
              <View style={styles.statusInnerContainer}>
                {expoIcons.antClose(RFValue(21), color.black1)}
                <Text style={styles.boldInfoText}>Uncomplete</Text>
              </View>
            }
          </View>
        </View>

        <View style={{ width: windowWidth, height: windowWidth }}>
          {
            rsvDetail.post && rsvDetail.post.user && rsvDetail.post.user.geometry && rsvDetail.post.user.photoURL &&
            <BasicLocationMap 
              locationCoord={{
                latitude: rsvDetail.post.user.geometry.location.lat, 
                longitude: rsvDetail.post.user.geometry.location.lng
              }}
              businessUserPhotoURL={rsvDetail.post.user.photoURL}
            />
          }
          <View style={styles.mapButtonContainer}>
            <THButtonWithBorder
              icon={expoIcons.featherMap(RFValue(23), color.black1)}
              text={"Open Google Maps"} 
              onPress={() => {
                Linking.openURL(rsvDetail.post.user.googlemapsUrl);
              }}
            />
          </View>
        </View>

        <View style={styles.techBusContainer}>
          {
            rsvDetail.post && rsvDetail.post.user && rsvDetail.tech &&
            <View style={styles.techBusInner}>
              <View style={styles.busContainer}>
                <View style={styles.labelContainer}>
                  <Text style={styles.labelText}>Business</Text>
                </View>
                <View style={styles.imageContainer}>
                  { 
                    rsvDetail.post.user.photoURL
                    ?
                    <Image 
                      source={{uri: rsvDetail.post.user.photoURL}}
                      style={{ width: RFValue(90), height: RFValue(90), borderRadius: RFValue(100)}}
                    />
                    :
                    <DefaultUserPhoto 
                      customSizeBorder={RFValue(90)}
                      customSizeUserIcon={RFValue(17)}
                    />
                  }
                </View>
                <TouchableOpacity
                  style={styles.busTechTouch}
                  onPress={() => {
                    navigation.navigate("UserAccountStack", {
                      screen: "UserAccount",
                      params: {
                        targetUser: rsvDetail.post.user
                      }
                    })
                  }}
                >
                  <View style={styles.usernameContainer}>
                    <Text style={styles.usernameText}>{rsvDetail.post.user.username}</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.techContainer}>
                <View style={styles.labelContainer}>
                  <Text style={styles.labelText}>Technician</Text>
                </View>

                <View style={styles.imageContainer}>
                { 
                  rsvDetail.tech.photoURL
                  ?
                  <Image 
                    source={{uri: rsvDetail.tech.photoURL}}
                    style={{ width: RFValue(90), height: RFValue(90), borderRadius: RFValue(100)}}
                  />
                  :
                  <DefaultUserPhoto 
                    customSizeBorder={RFValue(90)}
                    customSizeUserIcon={RFValue(60)}
                  />
                }
                </View>
                <TouchableOpacity
                  style={styles.busTechTouch}
                  onPress={() => {
                    navigation.navigate("UserAccountStack", {
                      screen: "UserAccount",
                      params: {
                        targetUser: rsvDetail.tech
                      }
                    })
                  }}
                >
                  <View style={styles.usernameContainer}>
                    <Text style={styles.usernameText}>{rsvDetail.tech.username}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          }
        </View>

        <View style={styles.postContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Design</Text>
          </View>
          <VerticalSwipePostImage
            files={rsvDetail.post.data.files}
            onFocus={true}
          />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("PostDetail", {
                post: rsvDetail.post,
                postSource: 'userAccountDisplay'
              })
            }}
          >
            <View style={styles.postInfoContainer}>
              <View style={styles.postTitleContainer}>
                <Text style={styles.postTitleText}>{rsvDetail.post.data.title}</Text>
              </View>
              <View style={styles.postPriceTimeContainer}>
                <Text style={styles.boldInfoText}>
                  {expoIcons.dollarSign(RFValue(23), color.black1)} 
                  {rsvDetail.post.data.price}
                </Text>
                <Text><Entypo name="dot-single" size={RFValue(13)} color={color.grey7} /></Text>
                <Text style={styles.boldInfoText}>{useConvertTime.convertEtcToHourMin(rsvDetail.post.data.etc)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {
        showBottomSheet
        &&
        <BottomSheet
          ref={sheetRef}
          snapPoints={[bottomSheetHeight, 0, 0]}
          borderRadius={RFValue(10)}
          renderContent={() => {
            return (
              <RenderContent
                sheetRef={sheetRef}
                navigation={navigation}
                contentHeight={bottomSheetHeight}
                setShowTba={setShowTba}
              />
            )
          }}
          initialSnap={0}
          // allow onPress inside bottom sheet
          enabledContentTapInteraction={false}
          enabledBottomClamp={true}
          onCloseEnd={() => {
            setShowBottomSheet(false);
          }}
        />
      }
      {
        showTba
        &&
        <TwoButtonAlert
          title={"Cancel Reservation"}
          message={"Do you want to cancel the reservation?"} 
          buttonOneText={"Yes"} 
          buttonTwoText={"No"}
          buttonOneAction={() => {
            console.log("cancel");
          }}
          buttonTwoAction={() => {
            setShowTba(false);
          }}
        />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  mapButtonContainer: {
    position: 'absolute', 
    alignSelf: 'center', 
    marginTop: RFValue(17)
  },
  techBusContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: color.white2
  },
  techBusInner: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  busTechTouch: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContainer: {
    width: '100%',
    backgroundColor: color.white1,
    height: RFValue(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelText: {
    fontSize: RFValue(19),
    color: color.black1
  },
  imageContainer: {
    paddingVertical: RFValue(7),
    justifyContent: 'center',
    alignItems: 'center',
  },
  busContainer: {
    flex: 1
  },
  techContainer: {
    flex: 1,
  },
  usernameContainer: {
    paddingVertical: RFValue(7),
    justifyContent: 'center',
    alignItems: 'center',
  },
  usernameText: {
    fontWeight: 'bold',
    fontSize: RFValue(19)
  },
  rsvInfoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.white2,
  },
  statusContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boldInfoText: {
    fontSize: RFValue(23),
    fontWeight: 'bold'
  },
  postTitleContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  postTitleText: {
    fontSize: RFValue(27),
  },
  postInfoContainer: {
    backgroundColor: color.white2,
    paddingVertical: RFValue(11)
  },
  postPriceTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  bsButtonTouch: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bsButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bsButtonText: {
    fontSize: RFValue(21),
  },
});

export default RsvDetailScreen;
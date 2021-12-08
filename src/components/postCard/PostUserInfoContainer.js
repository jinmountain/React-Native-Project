import React, { useContext, useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Image,
  StyleSheet,  
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, } from 'react-native-safe-area-context';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// components
import DefaultUserPhoto from '../defaults/DefaultUserPhoto';

// Designs
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

// Firebase
import usersGetFire from '../../firebase/usersGetFire';

// Hooks
import { navigate } from '../../navigationRef';
import convertEtcToHourMin from '../../hooks/convertEtcToHourMin';

const { width, height } = Dimensions.get("window");
// const CARD_HEIGHT = height * 0.77;
const USER_INFO_BOX_HEIGHT = RFValue(55);

// color
import color from '../../color';

// icon
import expoIcons from '../../expoIcons';

const PostUserInfoContainer = ({ postId, postData, currentUserId }) => {
  const [ postUser, setPostUser ] = useState(null);

  useEffect(() => {
    let isMounted = false;
    const getUserInfo = usersGetFire.getUserInfoFire(postData.uid);
    getUserInfo
    .then((user) => {
      const postUserData = {
        id: user.id,
        photoURL: user.photoURL,
        type: user.type,
        username: user.username,
        name: user.name
      };
      setPostUser(postUserData);
    })
    .catch((error) => {
      // handle error;
    });
    
    return () => {
      isMounted = false;
    };
  }, []);

  const navigation = useNavigation();
  return (
    <View style={styles.userInfoContainer}>
      <ScrollView 
        horizontal={true}
        fadingEdgeLength={RFValue(100)}
        showsHorizontalScrollIndicator={false}
      >
        <TouchableOpacity 
          style={styles.infoContainer}
          onPress={() => {
            postData.uid === currentUserId
            ?
            navigation.navigate('Account')
            :
            navigation.navigate('UserAccountStack', {
              screen: 'UserAccount',
              params: {
                accountUserId: postUser.id
              }
            })
          }}
        >
          <View style={styles.userPhotoContainer}>
            { 
              postUser && postUser.photoURL
              ?
              <Image 
                style={styles.userPhoto} 
                source={{ uri: postUser.photoURL }} 
              />
              : 
              <DefaultUserPhoto 
                customSizeBorder={RFValue(38)}
                customSizeUserIcon={RFValue(26)}
              />
            }
          </View>
          <View style={styles.textInfoContainer}>
            {
              postUser && postUser.name
              ?
              <Text
                numberOfLines={1}
                style={styles.nameText}
              >{postUser.name}</Text>
              :
              <Text
                numberOfLines={1}
                style={[ styles.nameText, {fontStyle: 'italic', color: color.grey3} ]}
              >Name</Text>
            }
            {
              postUser && postUser.username
              ?
              <Text 
                numberOfLines={1}
                style={styles.usernameText}
              >
                @{postUser.username}
              </Text>
              :
              <Text 
                numberOfLines={1}
                style={[ styles.usernameText, {fontStyle: 'italic', color: color.grey3} ]}
              >
                @Username
              </Text>
            }
          </View>
        </TouchableOpacity>
        {
          postData.display
          ?
          <TouchableHighlight 
            style={styles.displayPostInfoTH}
            onPress={() => {
              console.log("shop");
            }}
            underlayColor={color.grey4}
          >
            <View style={styles.displayPostInfoContainer}>
              <Feather name="shopping-bag" size={RFValue(17)} color={color.black1} />
              <View style={styles.displayPostInfoInner}>
                <View style={styles.displayPostInfoElement}>
                  <Text style={styles.displayPostInfoText}>$</Text>
                </View>
                <View style={styles.displayPostInfoElement}>
                  <Text style={styles.displayPostInfoText}>
                    {postData.price}
                  </Text>
                </View>
              </View>
              <View style={styles.displayPostInfoInner}>
                <View style={styles.displayPostInfoElement}>
                  <AntDesign name="clockcircleo" size={RFValue(13)} color={color.black1} />
                </View>
                <View style={styles.displayPostInfoElement}>
                  <Text style={styles.displayPostInfoText}>
                    {convertEtcToHourMin(postData.etc)}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableHighlight>
          : null
        }
      </ScrollView>
      <View style={styles.postManagerButtonContainer}>
        <TouchableHighlight
          onPress={() => 
            postUser &&
            navigation.navigate("PostManager", { 
              postId: postId, 
              postData: postData,
              postUserId: postUser.id,
              currentUserId: currentUserId,
            })
          }
          underlayColor={color.grey4}
          style={styles.pmButton}
        >
          {expoIcons.featherMoreVertical(RFValue(23), color.grey2)}
        </TouchableHighlight>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userInfoContainer: {
    paddingLeft: 10,
    backgroundColor: '#fff',
    width: width,
    paddingVertical: 3,
    height: USER_INFO_BOX_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  infoContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: RFValue(7),
  },
  userPhotoContainer: {
    borderWidth: 1,
    height: "100%",
  },
  userPhoto: {
    width: RFValue(38),
    height: RFValue(38),
    borderRadius: RFValue(38),
  },
  textInfoContainer: {
    justifyContent: 'center',
    paddingHorizontal: RFValue(7),
    borderWidth: 1
  },
  nameText: {
    color: color.black1,
    fontSize: RFValue(16),
  },
  usernameText: {
    color: color.black1,
    fontSize: RFValue(15),
  },
  postManagerButtonContainer: {
    position: "absolute",
    alignSelf: 'center',
    // paddingRight: RFValue(3),
  },
  pmButton: {
    width: RFValue(50),
    height: RFValue(50),
    borderRadius: RFValue(100),
    justifyContent: 'center',
    alignItems: 'center',
  },

  displayPostInfoTH: {
    borderWidth: RFValue(1),
    borderRadius: RFValue(15),
    paddingHorizontal: RFValue(7),
    marginVertical: RFValue(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  displayPostInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  displayPostInfoInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(3),
  },
  displayPostInfoElement: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(1),
  },
  displayPostInfoText: {
    fontSize: RFValue(15),
  },
});

export default PostUserInfoContainer;
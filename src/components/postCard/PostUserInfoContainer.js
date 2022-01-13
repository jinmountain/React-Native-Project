import React, { useContext, useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Image,
  StyleSheet,  
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
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
import { timeDifference } from '../../hooks/timeDifference';

// color
import color from '../../color';

// icon
import {featherMoreVertical} from '../../expoIcons';

const { width, height } = Dimensions.get("window");
// const CARD_HEIGHT = height * 0.77;
const DEFAULT_USER_INFO_BOX_HEIGHT = RFValue(55);

const PostUserInfoContainer = ({ 
  postId, 
  postData, 
  currentUserId, 
  postTimestamp,
  deletePostState
}) => {
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
        contentContainerStyle={{paddingRight: RFValue(50)}}
        horizontal={true}
        fadingEdgeLength={RFValue(100)}
        showsHorizontalScrollIndicator={false}
      >
        <TouchableOpacity 
          style={styles.infoContainer}
          onPress={() => {
            // postData.uid === currentUserId
            // ?
            // navigation.navigate('AccountTab')
            // :
            navigation.navigate('UserAccountTab', {
              screen: 'UserAccount',
              params: {
                accountUserId: postData.uid
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
              postUser && postUser.username
              ?
              <Text 
                numberOfLines={1}
                style={styles.usernameText}
              >
                {postUser.username}
              </Text>
              :
              <Text 
                numberOfLines={1}
                style={[ styles.usernameText, {fontStyle: 'italic', color: color.grey3} ]}
              >
                Username
              </Text>
            }
            <Text style={styles.timeDifferenceText}>{timeDifference(Date.now(), postTimestamp)}</Text>
          </View>
        </TouchableOpacity>
        {
          postData.display
          ?
          <View style={styles.displayPostInfoContainer}>
            <TouchableWithoutFeedback 
              style={styles.titleTextContainer}
              onPress={() => {
                navigation.navigate("PostDetail", {
                  postId: postId
                })
              }}
            >
              <Text style={styles.titleText}>{postData.title}</Text>
            </TouchableWithoutFeedback>
          </View>
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
              deletePostState: deletePostState,
            })
          }
          underlayColor={color.grey4}
          style={styles.pmButton}
        >
          {featherMoreVertical(RFValue(23), color.grey2)}
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
    height: DEFAULT_USER_INFO_BOX_HEIGHT,
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
  },
  usernameText: {
    color: color.black1,
    fontSize: RFValue(15),
  },
  postManagerButtonContainer: {
    backgroundColor: color.white2,
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

  displayPostInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    paddingHorizontal: RFValue(10),
    fontWeight: 'bold',
    fontSize: RFValue(19),
    color: color.black1
  },
  timeDifferenceText: {
    fontSize: RFValue(13),
    color: color.grey3
  },
});

export default PostUserInfoContainer;
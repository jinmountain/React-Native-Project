import React, { useContext, useState, useRef } from 'react';
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

// Designs
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

// Hooks
import { navigate } from '../../navigationRef';
import convertEtcToHourMin from '../../hooks/convertEtcToHourMin';

const { width, height } = Dimensions.get("window");
const cardHeight = height * 0.77;

// color
import color from '../../color';

// icon
import expoIcons from '../../expoIcons';

const PostUserInfoContainer = ({ postSource, postUser, postId, postData, currentUserId }) => {
  // postSource 
  // 'hot'
  // 'account'
  // 'accountDisplay'
  // 'businessUser'
  // 'businessTagged'

  const navigation = useNavigation();
  return (
    <View style={styles.userInfoContainer}>
      <ScrollView 
        horizontal={true}
        fadingEdgeLength={RFValue(100)}
      >
        <TouchableOpacity 
          style={styles.infoContainer}
          onPress={() => {
            postSource === 'hot' || 
            postSource === 'businessUser' || 
            postSource === 'businessTagged' || 
            postSource === 'userAccount' || 
            postSource === 'userAccountDisplay'
            ?
            navigation.navigate('UserAccountStack', {
              screen: 'UserAccount',
              params: {
                targetUser: postUser
              }
            })
            : postSource === 'account' || postSource === 'accountDisplay'
            ?
            navigation.navigate('Account')
            : null
          }}
        >
          <View style={styles.userPhotoContainer}>
            { 
              postUser.photoURL
              ?
              <Image 
                style={styles.userPhoto} 
                source={{ uri: postUser.photoURL }} 
              />
              : <Feather name="user" size={RFValue(24)} color="black" />
            }
          </View>
          <View style={styles.textInfoContainer}>
            {
              postUser.username
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
                style={{ ...styles.usernameText, ...{fontStyle: 'italic', color: color.grey3} }}
              >
                None
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
              <Feather name="shopping-bag" size={RFValue(23)} color={color.black1} />
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
            navigation.navigate("PostManager", { 
              postId: postId, 
              postData: postData,
              postUserId: postUser.id,
              currentUserId: currentUserId
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
    justifyContent: 'center',
    height: cardHeight * 0.1,
  },
  infoContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: RFValue(7),
  },
  userPhotoContainer: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userPhoto: {
    width: RFValue(38),
    height: RFValue(38),
    borderRadius: RFValue(38),
  },
  textInfoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(7),
  },
  usernameText: {
    fontSize: RFValue(16),
  },
  postManagerButtonContainer: {
    position: 'absolute',
    alignSelf: 'flex-end',
    paddingHorizontal: RFValue(7),
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingHorizontal: RFValue(5),
  },
  displayPostInfoElement: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(3),
  },
  displayPostInfoText: {
    fontSize: RFValue(15),
  },
});

export default PostUserInfoContainer;
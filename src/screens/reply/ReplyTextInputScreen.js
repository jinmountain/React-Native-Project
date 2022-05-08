import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableHighlight,
  TouchableWithoutFeedback,
	TextInput,
	Image,
  KeyboardAvoidingView,
  SafeAreaView,
  Pressable
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { getStatusBarHeight } from 'react-native-status-bar-height';

// components
import SpinnerFromActivityIndicator from '../../components/ActivityIndicator';

// firebase
import replyPostFire from '../../firebase/reply/replyPostFire';

// color
import color from '../../color';

// icon
import {
  antClose
} from '../../expoIcons';

const ReplyTextInputScreen = ({ navigation, route }) => {
  const { 
    postId,
    commentId,
    currentUserId,
  	currentUserPhotoURL,
    incrementReplyCount,
    addNewReply
  } = route.params;

  const iosStatusBarHeight = getStatusBarHeight();
  const SafeStatusBar = Platform.select({
    ios: iosStatusBarHeight,
    android: StatusBar.currentHeight,
  });

  const [ newReply, setNewReply ] = useState(null);
  const [ postReplyState, setPostReplyState ] = useState(false);

  const [ textInputFormHeight, setTextInputFormHeight ] = useState(RFValue(30));

	const textInputForm = () => {
    return (
      <View style={
          // isKeyboardVisible 
          // ? { ...styles.newCommentContainer, ...{ marginBottom: RFValue(65) }} 
          // // space between the keyboard and the input bar when the keyboard is visible
          // : styles.newCommentContainer
          styles.newCommentContainer
        }
      >
        <View style={[
          styles.currentUserPhotoContainer,
          {
            height: Math.max(RFValue(50), textInputFormHeight)
          }
        ]}>
          { 
            currentUserPhotoURL
            ?
            <Image 
              style={styles.currentUserPhoto} 
              source={{ uri: currentUserPhotoURL }} 
            />
            :
            <DefaultUserPhoto 
              customSizeBorder={RFValue(30)}
              customSizeUserIcon={RFValue(20)}
            />
          }
        </View>

        <View style={styles.newCommentTextInputContainer}>
          <TextInput
            style={[
              styles.newCommentTextInput,
              {
                height: Math.max(RFValue(30), textInputFormHeight)
              }
            ]}
            onChangeText={setNewReply}
            value={newReply}
            placeholder={"Start writing"}
            autoComplete={false}
            autoCorrect={false}
            autoFocus={true}
            multiline={true}
            numberOfLines={50}
            onContentSizeChange={(event) => {
              setTextInputFormHeight(event.nativeEvent.contentSize.height);
            }}
          />
        </View>
        
        <TouchableHighlight 
          style={styles.newCommentButton}
          underlayColor={color.grey4}
          onPress={() => {
            if (
              !newReply || 
              newReply.trim().length === 0 || 
              postReplyState
            ) return

            setPostReplyState(true);
            const newReplyLen = newReply.trim().length;
            const postReply = replyPostFire
            .postReplyFire(
              postId, 
              commentId, 
              currentUserId, 
              newReply
            );

            postReply
            .then((newReply) => {
              addNewReply(newReply);
              setNewReply(null);
              setPostReplyState(false);
              incrementReplyCount();
            })
            .then(() => {
              navigation.goBack();
            })
            .catch((error) => {
              setPostReplyState(false);
            });
          }}
        >
          <View style={styles.newCommentButtonTextContainer}>
            { 
              postReplyState
              ?
              <SpinnerFromActivityIndicator 
                customSize={"small"}
                customColor={color.red3}
              />
              :
              <Text style={styles.newCommentButtonText}>Post</Text>
            }
          </View>
        </TouchableHighlight>
      </View>
    )
  }

	return (
		<KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.mainContainer}
    >
      <Pressable
        style={[
          { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
        ]}
        onPress={() => { navigation.goBack() }}
      />
      <View style={{
        zIndex: 5,
        position: 'absolute',
        alignSelf: 'flex-end'
      }}>
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.goBack();
          }}
        >
          <View
            style={{
              marginTop: SafeStatusBar + RFValue(5),
              marginRight: RFValue(15),
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              width: RFValue(35),
              height: RFValue(35),
              borderRadius: RFValue(35),
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text>{antClose(RFValue(25), color.black1)}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      {textInputForm()}
		</KeyboardAvoidingView>
	)
};

const styles = StyleSheet.create({
  mainContainer: { 
    flex: 1,
  },

  currentUserPhotoContainer: {
    alignItems: 'flex-end',
    paddingTop: RFValue(9),
    paddingRight: RFValue(9),
    width: RFValue(60),
  },
  currentUserPhoto: {
    width: RFValue(30),
    height: RFValue(30),
    borderRadius: RFValue(30),
  },

  newCommentContainer: {
    backgroundColor: color.white2,
    flexDirection: 'row',
    alignItems: 'center',
    width: "100%",
    paddingVertical: RFValue(5)
  },

  newCommentTextInputContainer: {
    flex: 1,
  },
  newCommentTextInput: {
    fontSize: RFValue(17),
    color: color.black1,
    paddingLeft: RFValue(5)
  },

  newCommentButton: {
    width: RFValue(70),
    height: RFValue(45),
    paddingHorizontal: RFValue(15),
    paddingVertical: RFValue(5),
    // borderWidth: 1,
    borderRadius: RFValue(10),
    // borderColor: color.red2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: RFValue(5)
  },
  newCommentButtonText: {
    color: color.red2,
    fontSize: RFValue(17)
  }
});

export default ReplyTextInputScreen;
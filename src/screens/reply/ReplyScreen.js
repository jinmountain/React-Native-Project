import React, { useState, useEffect, useContext, useRef, useMemo, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity,
  TouchableHighlight,
  KeyboardAvoidingView,
  Dimensions,
  Pressable,
  FlatList,
  TextInput,
  Platform,
  Image,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// npms
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';

// Components
import MainTemplate from '../../components/MainTemplate';
import HeaderBottomLine from '../../components/HeaderBottomLine';
import { HeaderForm } from '../../components/HeaderForm';
import DefaultUserPhoto from '../../components/defaults/DefaultUserPhoto';
import SpinnerFromActivityIndicator from '../../components/ActivityIndicator';
import ExpandableText from '../../components/ExpandableText'
import ReplyBar from '../../components/ReplyBar';

// firebase
import replyGetFire from '../../firebase/reply/replyGetFire';
import replyPostFire from '../../firebase/reply/replyPostFire';
import likeGetFire from '../../firebase/like/likeGetFire';
// Design

// contexts
import { Context as AuthContext } from '../../context/AuthContext';

// Hooks
import count from '../../hooks/count';
import useIsKeyboardVisible from '../../hooks/useIsKeyboardVisible';
import { timeDifference } from '../../hooks/timeDifference';

// color
import color from '../../color';

// sizes
import sizes from '../../sizes';

// icon
import expoIcons from '../../expoIcons';

const { width, height } = Dimensions.get("window");

const ReplyScreen = ({ navigation, route }) => {
  const sheetRef = useRef(null);
  const [ bottomSheetHeight, setBottomSheetHeight ] = useState(height - RFValue(95));
  const [ windowWidth, setWindowWidth ] = useState(width);
  const [ windowHeight, setWindowHeight ] = useState(width);

  const [ newReply, setNewReply ] = useState(null);
  const [ postReplyState, setPostReplyState ] = useState(false);

  const [ replies, setReplies ] = useState([]);
  const [ replyLast, setReplyLast ] = useState(null);
  const [ replyFetchSwitch, setReplyFetchSwitch ] = useState(true);
  const [ replyFetchState, setReplyFetchState ] = useState(false);

  const [ isKeyboardVisible ] = useIsKeyboardVisible();

  const { 
    postId, 
    commentId, 
    commentData,
    commentUser,
    currentUserId,
    textInputAutoFocus,
    incrementReplyCount,
    decrementReplyCount
  } = route.params;

  const { 
    state: {
      user
    }
  } = useContext(AuthContext);

  useEffect(() => {
    let isMounted = true;
    const getScreenReady = new Promise ((res, rej) => {
      if (replyFetchSwitch && !replyFetchState && isMounted) {
        isMounted && setReplyFetchState(true);
        const getReplies = replyGetFire.getRepliesFire(postId, commentId);
        getReplies
        .then((result) => {
          isMounted && setReplies(result.fetchedReplies);
          if (result.lastReply) {
            isMounted && setReplyLast(result.lastReply);
          } else {
            isMounted && setReplyFetchSwitch(false);
          };

          if (!result.fetchSwitch) {
            isMounted && setReplyFetchSwitch(false);
          };
        })
        .catch((error) => {
          rej(error);
        });
      };
    });
    return () => {
      isMounted = false;
      setReplies([]);
      setReplyLast(null);
      setReplyFetchSwitch(true);
      setReplyFetchState(false);

      setNewReply(null);
      setPostReplyState(false);
    };
  }, []);

  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => 
    ['75%'],
    []
  );

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      navigation.goBack();
    } 
    // console.log('handleSheetChanges', index);
  }, []);

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
    >
      <View 
        style={styles.mainContainer}
      >
        <Pressable 
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
          ]}
          onPress={() => { navigation.goBack() }}
        >
        </Pressable>
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enablePanDownToClose={true}
          handleComponent={() => {
            return (
              <View 
                style={styles.bottomSheetHeaderContainer}
              >
                <View style={styles.bottomSheetHeaderTopContainer}>
                  <View style={styles.bottomSheetHeaderTitleContainer}>
                    <Text style={styles.bottomSheetHeaderTitleText}>Replies</Text>
                  </View>
                  <TouchableHighlight
                    style={styles.bottomSheetHeaderCloseButton}
                    underlayColor={color.grey4}
                    onPress={() => {
                      navigation.goBack();
                    }}
                  >
                    {expoIcons.antClose(RFValue(19), color.black1)}
                  </TouchableHighlight>
                </View>
              </View>
            )
          }}
        >
          <View 
            style={{ flex: 1, backgroundColor: color.white2 }} 
          >
            <View
              style={styles.commentBar}
            >
              <View style={styles.userPhotoContainer}>
                { 
                  commentUser && commentUser.photoURL
                  ?
                  <Image 
                    style={styles.userPhoto} 
                    source={{ uri: commentUser.photoURL }} 
                  />
                  :
                  <DefaultUserPhoto 
                    customSizeBorder={RFValue(38)}
                    customSizeUserIcon={RFValue(26)}
                  />
                }
              </View>
              <View style={styles.commentContainer}>
                <View style={styles.commentBarHeader}>
                  { 
                    commentUser && commentUser.username
                    ? <Text style={styles.headerText}>{commentUser.username} {expoIcons.entypoDot(RFValue(11), color.grey1)} {timeDifference(Date.now(), commentData.createdAt)}</Text>
                    : null
                  }
                </View>
                <ExpandableText 
                  caption={commentData.text}
                  defaultCaptionNumLines={5}
                />
              </View>
            </View>
            <HeaderBottomLine />
            <View style={styles.replyContainer}>
              <BottomSheetFlatList
                onEndReached={() => {
                  
                }}
                onEndReachedThreshold={0.1}
                contentContainerStyle={{

                }}
                vertical
                showsVerticalScrollIndicator={false}
                decelerationRate={"fast"}
                data={replies}
                keyExtractor={(reply, index) => reply.id}
                renderItem={({ item: reply, index }) => {
                  return (
                    <ReplyBar
                      postId={postId}
                      commentId={commentId}
                      replyId={reply.id}
                      replyData={reply.data}
                      currentUserId={user.id}
                      decrementReplyCount={decrementReplyCount}
                    />
                  )
                }}
              />
            </View>
            <View style={styles.newCommentContainer}>
              <View style={styles.currentUserPhotoContainer}>
                { 
                  user.photoURL
                  ?
                  <Image 
                    style={styles.currentUserPhoto} 
                    source={{ uri: user.photoURL }} 
                  />
                  :
                  <DefaultUserPhoto 
                    customSizeBorder={RFValue(38)}
                    customSizeUserIcon={RFValue(26)}
                  />
                }
              </View>
              <View style={styles.newCommentTextInputContainer}>
                <TextInput
                  style={styles.newCommentTextInput}
                  onChangeText={setNewReply}
                  value={newReply}
                  placeholder={"Start writing"}
                  autoComplete={false}
                  autoCorrect={false}
                  autoFocus={textInputAutoFocus}
                />
              </View>
              <TouchableHighlight 
                style={styles.newCommentButton}
                underlayColor={color.grey4}
                onPress={() => {
                  setPostReplyState(true);
                  const newReplyLen = newReply.trim().length;
                  if (!postReplyState && newReplyLen > 0) {
                    const postReply = replyPostFire.postReplyFire(postId, commentId, user.id, newReply);
                    postReply
                    .then((newReply) => {
                      setReplies([ newReply, ...replies ]);
                      setNewReply(null);
                      setPostReplyState(false);
                      incrementReplyCount();
                    })
                    .catch((error) => {
                      setPostReplyState(false);
                      // handle error
                    });
                  }
                }}
              >
                <View style={styles.newCommentButtonTextContainer}>
                  { 
                    false
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
          </View>
        </BottomSheet>
      </View>
    </KeyboardAvoidingView>
  )
};

const styles = StyleSheet.create({
  replyContainer: {
    flex: 1
  },
  commentActionBar: {
    paddingVertical: RFValue(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  userPhotoContainer: {
    padding: RFValue(10),
    alignItems: 'center',
    width: RFValue(70)
  },
  userPhoto: {
    width: RFValue(38),
    height: RFValue(38),
    borderRadius: RFValue(38),
  },

  commentTextContainer: {
    justifyContent: 'center',
  },
  commentText: {
    fontSize: RFValue(18),
    color: color.black1
  },

  mainContainer: { flex: 1 },
  currentUserPhotoContainer: {
    padding: RFValue(10),
    alignItems: 'center',
    width: RFValue(70)
  },
  currentUserPhoto: {
    width: RFValue(38),
    height: RFValue(38),
    borderRadius: RFValue(38),
  },

  newCommentContainer: {
    backgroundColor: color.white2,
    flexDirection: 'row',
    minHeight: RFValue(50),
    height: RFValue(50),
    alignItems: 'center',
  },

  newCommentTextInputContainer: {
    flex: 1
  },
  newCommentTextInput: {
    flex: 1,
    fontSize: RFValue(17),
    color: color.black1
  },

  newCommentButton: {
    width: RFValue(70),
    height: RFValue(45),
    paddingHorizontal: RFValue(15),
    paddingVertical: RFValue(5),
    borderWidth: 1,
    borderRadius: RFValue(10),
    borderColor: color.red2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: RFValue(5)
  },
  newCommentButtonText: {
    color: color.red2,
    fontSize: RFValue(17)
  },

  bottomSheetHeaderContainer: {
    height: RFValue(55),
    width: "100%", 
    justifyContent: 'center'
  },
  bottomSheetHeaderTopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  bottomSheetHeaderTitleContainer: {
    paddingLeft: RFValue(10),
    justifyContent: 'center',
  },
  bottomSheetHeaderTitleText: {
    fontSize: RFValue(19),
    color: color.black1,
    fontWeight: 'bold'
  },
  bottomSheetHeaderCloseButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: RFValue(10),
    width: RFValue(35),
    height: RFValue(35),
    borderRadius: RFValue(35)
  },

  commentBar: {
    flexDirection: 'row',
    backgroundColor: color.white2,
    paddingVertical: RFValue(3),
  },

  commentContainer: {
    paddingVertical: RFValue(3),
    marginRight: RFValue(7),
  },

  commentBarHeader: {
    paddingVertical: RFValue(5),
    justifyContent: 'center'
  },
  headerText: {
    color: color.grey3,
    fontSize: RFValue(15)
  },

  actionIconContainer: {
    justifyContent: 'center',
    width: RFValue(70),
    alignItems: 'center'
  },

  commentActionBar: {
    paddingVertical: RFValue(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  userPhotoContainer: {
    alignItems: 'flex-end',
    paddingTop: RFValue(9),
    paddingRight: RFValue(9),
    width: RFValue(70)
  },
  userPhoto: {
    width: RFValue(38),
    height: RFValue(38),
    borderRadius: RFValue(38),
  },

  commentTextContainer: {
    justifyContent: 'center',
  },
  commentText: {
    fontSize: RFValue(18),
    color: color.black1
  },
});

export default ReplyScreen;
import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
  StyleSheet, 
  View,
  SafeAreaView,
  Text, 
  TouchableHighlight,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Dimensions,
  Pressable,
  FlatList,
  TextInput,
  Platform,
  Image,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Menu, Divider } from 'react-native-paper';

// npms
// import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';

// Components
import MainTemplate from '../../components/MainTemplate';
import HeaderBottomLine from '../../components/HeaderBottomLine';
import { HeaderForm } from '../../components/HeaderForm';
import DefaultUserPhoto from '../../components/defaults/DefaultUserPhoto';
import SpinnerFromActivityIndicator from '../../components/ActivityIndicator';
import ExpandableText from '../../components/ExpandableText'
import ReplyBar from '../../components/ReplyBar';
import SnailBottomSheet from '../../components/SnailBottomSheet';
import BottomSheetHeader from '../../components/BottomSheetHeader';

// firebase
import replyGetFire from '../../firebase/reply/replyGetFire';
import replyPostFire from '../../firebase/reply/replyPostFire';
import likeGetFire from '../../firebase/like/likeGetFire';
// Design

// contexts
import { Context as AuthContext } from '../../context/AuthContext';

// Hooks
import count from '../../hooks/count';
import { timeDifference } from '../../hooks/timeDifference';

// color
import color from '../../color';

// sizes
import sizes from '../../sizes';

// icon
import {
  antClose,
  entypoDot,
  entypoList
} from '../../expoIcons';

const { width, height } = Dimensions.get("window");

const ReplyScreen = ({ navigation, route }) => {
  const [ bottomSheetHeight, setBottomSheetHeight ] = useState(height - RFValue(95));
  const [ windowWidth, setWindowWidth ] = useState(width);
  const [ windowHeight, setWindowHeight ] = useState(width);

  const [ newReply, setNewReply ] = useState(null);
  const [ postReplyState, setPostReplyState ] = useState(false);

  const [ replies, setReplies ] = useState([]);
  const [ replyLast, setReplyLast ] = useState(null);
  const [ replyFetchSwitch, setReplyFetchSwitch ] = useState(true);
  const [ replyFetchState, setReplyFetchState ] = useState(false);
  const [ replySortType , setReplySortType ] = useState('top');

  // add new reply to replies state
  const addNewReply = (newReply) => {
    setReplies([ newReply, ...replies ]);
  };

  const { 
    postId, 
    commentId, 
    commentData,
    commentUser,
    currentUserId,
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
        const getReplies = replyGetFire.getRepliesFire(postId, commentId, null, "top");
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

          isMounted && setReplyFetchState(false);
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

  const textInputForm = () => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate("ReplyTextInput", {
            postId,
            commentId,
            currentUserId: user.id,
            currentUserPhotoURL: user.photoURL,
            incrementReplyCount,
            addNewReply
          });
        }}
      >
        <View>
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
                  customSizeBorder={RFValue(27)}
                  customSizeUserIcon={RFValue(18)}
                />
              }
            </View>
            <View style={
              styles.newCommentTextInputContainer
            }>
              <Text style={styles.newCommentTextInput}>
                Start writing
              </Text>
            </View>
            <View style={styles.newCommentButton}>
              <View style={styles.newCommentButtonTextContainer}>
                <Text style={styles.newCommentButtonText}>Post</Text>
              </View>
            </View>
          </View>
          <HeaderBottomLine />
        </View>
      </TouchableWithoutFeedback>
    )
  }

  const _repliesFlatListRef = useRef(null);

  const renderContent = () => {
    return (
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
                ? <Text style={styles.headerText}>{commentUser.username} {entypoDot(RFValue(11), color.grey1)} {timeDifference(Date.now(), commentData.createdAt)}</Text>
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
          {
            replies.length > 0
            ?
            <FlatList
              ref={_repliesFlatListRef}
              onEndReached={() => {
                // console.log("replyFetchSwitch:", replyFetchSwitch, "replyFetchState: ", replyFetchState);
                if (replyFetchSwitch && !replyFetchState) {
                  setReplyFetchState(true);
                  const getReplies = replyGetFire.getRepliesFire(postId, commentId, replyLast, replySortType);
                  getReplies
                  .then((result) => {
                    setReplies([ ...replies, ...result.fetchedReplies ]);
                    if (result.lastReply) {
                      setReplyLast(result.lastReply);
                    } else {
                      setReplyFetchSwitch(false);
                    };

                    if (!result.fetchSwitch) {
                      setReplyFetchSwitch(false);
                    };

                    setReplyFetchState(false);
                  })
                  .catch((error) => {
                    rej(error);
                  });
                };
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
                  index === 0
                  ?
                  <View>
                    {textInputForm()}
                    <ReplyBar
                      index={index}
                      postId={postId}
                      commentId={commentId}
                      replyId={reply.id}
                      replyData={reply.data}
                      currentUserId={user.id}
                      decrementReplyCount={decrementReplyCount}
                    />
                  </View>
                  :
                  <ReplyBar
                    index={index}
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
            :
            textInputForm()
          }
        </View>
      </View>
    )
  };

  // -- render comment bottom sheet header
    const [ showSetting, setShowSetting ] = useState(false);
    const renderBottomSheetHeader = () => {
      return (
        <View 
          style={styles.bottomSheetHeaderContainer}
        > 
          <View style={styles.bottomSheetHeaderInner}>
            <View style={styles.sliderIndicatorContainer}>
              <View style={styles.sliderIndicator}/>
            </View>
            <View style={styles.bottomSheetHeaderBottomContainer}>
              <View style={styles.bottomSheetHeaderTitleContainer}>
                <Text style={styles.bottomSheetHeaderTitleText}>
                  {
                    replies.length > 1 ? "Replies" : "Reply"
                  }
                </Text>
              </View>
              <View style={styles.buttonsContainer}>
                <Menu
                  visible={showSetting}
                  onDismiss={() => {
                    setShowSetting(false);
                  }}
                  anchor={
                    <TouchableHighlight
                      style={styles.bottomSheetHeaderCloseButton}
                      underlayColor={color.grey4}
                      onPress={() => {
                        setShowSetting(!showSetting);
                      }}
                    >
                      <View>
                        {entypoList(RFValue(21), color.black1)}
                      </View>
                    </TouchableHighlight>
                  }>
                  <Menu.Item onPress={() => {
                    if (
                      !replyFetchState && 
                      replySortType !== "top"
                    ) {
                      setReplyFetchState(true);
                      setReplyFetchSwitch(true);
                      setReplyLast(null);
                      const getReplies = replyGetFire.getRepliesFire(postId, commentId, null, "top");
                      getReplies
                      .then((result) => {
                        setReplies(result.fetchedReplies);
                        if (result.lastReply) {
                          setReplyLast(result.lastReply);
                        } else {
                          setReplyFetchSwitch(false);
                        };

                        if (!result.fetchSwitch) {
                          setReplyFetchSwitch(false);
                        };

                        setReplyFetchState(false);
                        setShowSetting(false);
                        setReplySortType("top");
                        _repliesFlatListRef.current.scrollToOffset({ animated: true, offset: 0 });
                      })
                      .catch((error) => {
                        
                      });
                    };
                  }} title="Top" />
                  <Divider />
                  <Menu.Item onPress={() => {
                    if ( 
                      !replyFetchState &&
                      replySortType !== 'new'
                    ) {
                      setReplyFetchState(true);
                      setReplyFetchSwitch(true);
                      setReplyLast(null);
                      const getReplies = replyGetFire.getRepliesFire(postId, commentId, null, "new");
                      getReplies
                      .then((result) => {
                        setReplies(result.fetchedReplies);
                        if (result.lastReply) {
                          setReplyLast(result.lastReply);
                        } else {
                          setReplyFetchSwitch(false);
                        };

                        if (!result.fetchSwitch) {
                          setReplyFetchSwitch(false);
                        };

                        setReplyFetchState(false);
                        setShowSetting(false);
                        setReplySortType("new");
                        _repliesFlatListRef.current.scrollToOffset({ animated: true, offset: 0 });
                      })
                      .catch((error) => {
                        
                      });
                    };
                  }} title="New" />
                </Menu>
                <TouchableHighlight
                  style={styles.bottomSheetHeaderCloseButton}
                  underlayColor={color.grey4}
                  onPress={() => {
                    navigation.goBack();
                  }}
                >
                  {antClose(RFValue(21), color.black1)}
                </TouchableHighlight>
              </View>
            </View>
          </View>
          <HeaderBottomLine />
        </View>
      )
    };

  return (
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
      <SnailBottomSheet
        header={renderBottomSheetHeader()}
        content={renderContent()}
        snapPoints={[0, 0.75, 1]}
        snapSwitchs={[false, false]}
        onCloseEnd={() => {
          navigation.goBack();
        }}
        bottomSheetContainerStyle={{
          borderTopLeftRadius: RFValue(9),
          borderTopRightRadius: RFValue(9),
        }}
      />
    </View>
  )
};

const styles = StyleSheet.create({
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
    alignItems: 'flex-end',
    paddingRight: RFValue(9),
    width: RFValue(70)
  },
  currentUserPhoto: {
    width: RFValue(27),
    height: RFValue(27),
    borderRadius: RFValue(27),
  },

  newCommentContainer: {
    backgroundColor: color.white2,
    flexDirection: 'row',
    minHeight: RFValue(50),
    height: RFValue(50),
    alignItems: 'center',
  },

  newCommentTextInputContainer: {
    flex: 1,
  },
  newCommentTextInput: {
    fontSize: RFValue(17),
    color: color.grey3,
    paddingLeft: RFValue(5)
  },

  newCommentButton: {
    width: RFValue(70),
    height: RFValue(45),
    paddingHorizontal: RFValue(15),
    paddingVertical: RFValue(5),
    // borderWidth: 1,
    // borderRadius: RFValue(10),
    // borderColor: color.red2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: RFValue(5)
  },
  newCommentButtonText: {
    color: color.red2,
    fontSize: RFValue(17)
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

  replyContainer: {
    flex: 1
  },

  bottomSheetHeaderContainer: {
    backgroundColor: color.white2,
    height: RFValue(55),
    width: "100%", 
    borderTopLeftRadius: RFValue(9),
    borderTopRightRadius: RFValue(9),
  },
  bottomSheetHeaderInner: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomSheetHeaderTitleText: {
    fontSize: RFValue(19),
    color: color.black1,
    fontWeight: 'bold'
  },
  sliderIndicatorContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  sliderIndicator: {
    width: 50,
    height: 5,
    backgroundColor: color.grey1,
    borderRadius: 100
  },
  bottomSheetHeaderBottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: RFValue(15),
  },
  bottomSheetHeaderTitleContainer: {
    paddingLeft: RFValue(10),
    justifyContent: 'center',
  },
  bottomSheetHeaderCloseButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: RFValue(10),
    width: RFValue(35),
    height: RFValue(35),
    borderRadius: RFValue(35)
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: 'center',
  },
});

export default ReplyScreen;
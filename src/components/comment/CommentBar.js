import React, { useContext, useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  Image,
  StyleSheet,  
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Contexts

// Components
import { HeaderForm } from '../HeaderForm';
import DefaultUserPhoto from '../defaults/DefaultUserPhoto';
import ExpandableText from '../ExpandableText'
import HeaderBottomLine from '../HeaderBottomLine';
import AnimHighlight from '../buttons/AnimHighlight';

// Hooks
import { wait } from '../../hooks/wait';
import { useNavigation } from '@react-navigation/native';
import { timeDifference } from '../../hooks/timeDifference';

// firebase
import {
  getUserInfoFire
} from '../../firebase/user/usersGetFire';
import {
  checkCommentLikeFire
} from '../../firebase/like/likeGetFire';
import {
  likeCommentFire,
  undoLikeCommentFire
} from '../../firebase/like/likePostFire';

// color
import color from '../../color';

// expo icons
import {
  matMessageTextOutline,
  entypoDot,
  antdesignHeart,
  antdesignHearto,
  featherMoreVertical
} from '../../expoIcons';

const { width, height } = Dimensions.get("window");

const CommentBar = ({ 
  index,
	commentId,
  commentData,
  currentUserId,
  postId,
  decrementCommentCount
}) => {
	const navigation = useNavigation();

  const [ currentCommentData, setCurrentCommentData ] = useState(commentData);
  const [ replyCountState, setReplyCountState ] = useState(commentData.count_replies)
  const [ commentUser, setCommentUser ] = useState(null);
  const [ like, setLike ] = useState(false);
  const [ likeButtonReady, setLikeButtonReady ] = useState(false);

  const [ countLikes, setCountLikes ] = useState(commentData.count_likes);

  const deleteCurrentCommentState = () => {
    setCurrentCommentData(null);
  };

  const incrementReplyCount = () => {
    setReplyCountState(replyCountState + 1);
  };
  const decrementReplyCount = () => {
    setReplyCountState(replyCountState - 1);
  };

  useEffect(() => {
    let isMounted = true;
    if (commentData && commentData.uid) {
      const getUserInfo = getUserInfoFire(commentData.uid);
      getUserInfo
      .then((user) => {
        const commentUserData = {
          id: user.id,
          photoURL: user.photoURL,
          type: user.type,
          username: user.username,
        };
        setCommentUser(commentUserData);
      })
      .catch((error) => {
        // handle error;
      });
    }

    const checkLike = checkCommentLikeFire(postId, commentId, currentUserId);
    checkLike
    .then((result) => {
      isMounted && setLikeButtonReady(true);
      isMounted && setLike(result);
    })
    .catch((error) => {
      // handle error
    });

    return () => {
      isMounted = false;
      setCommentUser(null);
      setLike(false);
      setLikeButtonReady(false);
    }
  }, []);

  // -- like button animation
    const scaleAnimValue = useRef(new Animated.Value(1)).current;
    const opacityAnimValue = useRef(new Animated.Value(1)).current;

    const likeOpacityAnim = () => {
      Animated.timing(opacityAnimValue, {
        toValue: 0.5,
        duration: 100,
        useNativeDriver: false
      }).start(({ finished }) => {
        if (finished) {
          Animated.timing(opacityAnimValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false
          }).start();
        }
      });
    }

    const likeScaleAnim = () => {
      Animated.timing(scaleAnimValue, {
        toValue: 1.5,
        duration: 300,
        useNativeDriver: false,
      }).start(({finished}) => {
        if (finished) {
          Animated.spring(scaleAnimValue, {
            toValue: 1,
            friction: 3,
            useNativeDriver: false
          }).start();
        }
      });
    };

  // -- render comment bar
    const renderCommentBar = () => {
      return (
        <View>
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
                  customSizeBorder={RFValue(30)}
                  customSizeUserIcon={RFValue(20)}
                />
              }
            </View>
            <View style={styles.commentContainer}>
              <View style={styles.commentBarHeader}>
                <View style={styles.usernameContainer}>
                  { 
                    commentUser && commentUser.username
                    ? <Text style={styles.headerText}>{commentUser.username} {entypoDot(RFValue(11), color.grey1)} {timeDifference(Date.now(), currentCommentData.createdAt)} {currentCommentData.edited && "(edited)"}</Text>
                    : null
                  }
                </View>
                <View style={styles.optionButtonContainer}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => {
                      navigation.navigate("CommentManager", {
                        postId: postId,
                        commentId: commentId,
                        commentData: currentCommentData,
                        commentUser: commentUser,
                        currentUserId: currentUserId,
                        deleteCurrentCommentState: deleteCurrentCommentState,
                        decrementCommentCount: decrementCommentCount,
                        setCurrentCommentData: setCurrentCommentData
                      });
                    }}
                  >
                    <View style={styles.actionIconContainer}>
                      <Text>{featherMoreVertical(RFValue(15), color.grey2)}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <ExpandableText 
                caption={currentCommentData.text}
                defaultCaptionNumLines={5}
              />
              <View style={styles.commentActionBar}>
                <View style={styles.likeButtonAndCountContainer}>
                  {
                    likeButtonReady && like
                    ?
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => {
                        const undoLike = undoLikeCommentFire(postId, commentId, currentUserId);
                        undoLike
                        .then(() => {
                          setLike(false);
                          setCountLikes(countLikes - 1);
                        })
                        .catch((error) => {
                          // handle error
                        });
                      }}
                    >
                      <Animated.View style={[
                        styles.actionIconContainer,
                        {
                          transform: [
                            {
                              scale: scaleAnimValue
                            }
                          ],
                          opacity: opacityAnimValue
                        }
                      ]}>
                        {antdesignHeart(RFValue(19), color.red2)} 
                      </Animated.View>
                    </TouchableOpacity>
                    : likeButtonReady && !like
                    ?
                    <TouchableWithoutFeedback 
                      style={styles.actionButton}
                      onPress={() => {
                        console.log("like");
                        console.log(postId, commentId, currentUserId)
                        const doLike = likeCommentFire(postId, commentId, currentUserId);
                        doLike
                        .then(() => {
                          setLike(true);
                          likeScaleAnim();
                          likeOpacityAnim();
                          setCountLikes(countLikes + 1);
                        })
                        .catch((error) => {
                          // handle error
                        })
                      }}
                    >
                      <View style={styles.actionIconContainer}>
                        {antdesignHearto(RFValue(19), color.red2)}
                      </View>
                    </TouchableWithoutFeedback>
                    : 
                    <ActivityIndicator 
                      size={"small"}
                      color={color.black1}
                    />
                  } 

                  <View style={styles.likeCountContainer}>
                    <Text style={styles.likeCountText}>
                       {countLikes} 
                    </Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => {
                    navigation.navigate("Reply", {
                      postId: postId, 
                      commentId: commentId, 
                      commentData: currentCommentData,
                      commentUser: commentUser,
                      currentUserId: currentUserId,
                      textInputAutoFocus: false,
                      incrementReplyCount: incrementReplyCount,
                      decrementReplyCount: decrementReplyCount
                    });
                  }}
                >
                  <View style={styles.actionIconContainer}>
                    <Text 
                      style={styles.replyCountText}
                      numberOfLines={1}
                    >
                      {replyCountState}
                      {
                        replyCountState > 1
                        ?
                        " Replies"
                        :
                        " Reply"
                      }
                      {/*{matMessageTextOutline(RFValue(15), color.black2)} */}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <HeaderBottomLine />
        </View>
      )
    }

	return (
    currentCommentData &&
    <AnimHighlight
      content={
        renderCommentBar()
      }
      onPressOutAction={() => {
        navigation.navigate("Reply", {
          postId: postId, 
          commentId: commentId, 
          commentData: currentCommentData,
          commentUser: commentUser,
          currentUserId: currentUserId,
          textInputAutoFocus: false,
          incrementReplyCount: incrementReplyCount,
          decrementReplyCount: decrementReplyCount
        });
      }}
    />
  )
};

const styles = StyleSheet.create({
	commentBar: {
    flexDirection: 'row',
    paddingVertical: RFValue(3)
  },

  commentContainer: {
    flex: 1,
    paddingVertical: RFValue(3),
    marginRight: RFValue(7),
  },

  commentBarHeader: {
    flexDirection: 'row',
    paddingVertical: RFValue(5),
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerText: {
    color: color.grey3,
    fontSize: RFValue(15)
  },
  usernameContainer: {
    alignItems: 'center',
  },
  optionButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  likeButtonAndCountContainer: {
    width: RFValue(70),
    flexDirection: 'row',
    alignItems: 'center'
  },
    likeCountContainer: {
    paddingHorizontal: RFValue(5)
  },
  likeCountText: {
    fontSize: RFValue(17),
    color: color.grey3
  },

  actionIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: RFValue(5),
  },

  commentActionBar: {
    paddingVertical: RFValue(5),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  userPhotoContainer: {
    alignItems: 'flex-end',
    paddingTop: RFValue(9),
    paddingRight: RFValue(9),
    width: RFValue(60)
  },
  userPhoto: {
    width: RFValue(30),
    height: RFValue(30),
    borderRadius: RFValue(30),
  },

  commentTextContainer: {
    justifyContent: 'center',
  },
  commentText: {
    fontSize: RFValue(17),
    color: color.black1
  },

  replyCountText: {
    fontSize: RFValue(17),
    color: color.blue1
  },
});
export default CommentBar;
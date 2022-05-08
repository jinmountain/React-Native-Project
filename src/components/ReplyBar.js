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
import { HeaderForm } from './HeaderForm';
import DefaultUserPhoto from './defaults/DefaultUserPhoto';
import ExpandableText from './ExpandableText'
import HeaderBottomLine from './HeaderBottomLine';

// Hooks
import { wait } from '../hooks/wait';
import { useNavigation } from '@react-navigation/native';
import { timeDifference } from '../hooks/timeDifference';

// firebase
import {
  getUserInfoFire
} from '../firebase/user/usersGetFire';
import { checkReplyLikeFire } from '../firebase/like/likeGetFire';
import {
  likeReplyFire,
  undoLikeReplyFire
} from '../firebase/like/likePostFire';

// color
import color from '../color';

// expo icons
import {
  entypoDot,
  antdesignHeart,
  antdesignHearto,
  featherMoreVertical
} from '../expoIcons';

const { width, height } = Dimensions.get("window");

const ReplyBar = ({
  index,
  postId,
  commentId,
  replyId,
  replyData,
  currentUserId,
  decrementReplyCount
}) => {
  const navigation = useNavigation();

  const [ currentReplyData, setCurrentReplyData ] = useState(replyData);
  const [ replyUser, setReplyUser ] = useState(null);
  const [ like, setLike ] = useState(false);
  const [ likeButtonReady, setLikeButtonReady ] = useState(false);

  const [ countLikes, setCountLikes ] = useState(replyData.count_likes);

  useEffect(() => {
    let isMounted = true;
    if (replyData && replyData.uid) {
      const getUserInfo = getUserInfoFire(replyData.uid);
      getUserInfo
      .then((user) => {
        const replyUserData = {
          id: user.id,
          photoURL: user.photoURL,
          type: user.type,
          username: user.username,
        };
        setReplyUser(replyUserData);
      })
      .catch((error) => {
        // handle error;
      });
    }

    const checkLike = checkReplyLikeFire(postId, commentId, currentUserId);
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
      setReplyUser(null);
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

  return (
    currentReplyData &&
    <View>
      <View
        style={styles.commentBar}
      >
        <View style={styles.userPhotoContainer}>
          { 
            replyUser && replyUser.photoURL
            ?
            <Image 
              style={styles.userPhoto} 
              source={{ uri: replyUser.photoURL }} 
            />
            :
            <DefaultUserPhoto 
              customSizeBorder={RFValue(27)}
              customSizeUserIcon={RFValue(18)}
            />
          }
        </View>
        <View style={styles.commentContainer}>
          <View style={styles.commentBarHeader}>
            <View style={styles.usernameContainer}>
              { 
                replyUser && replyUser.username
                ? <Text style={styles.headerText}>{replyUser.username} {entypoDot(RFValue(11), color.grey1)} {timeDifference(Date.now(), currentReplyData.createdAt)} {currentReplyData.edited && "(edited)"}</Text>
                : null
              }
            </View>
            <View style={styles.optionButtonContainer}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => {
                  navigation.navigate("ReplyManager", {
                    postId: postId,
                    commentId: commentId,
                    replyId: replyId,
                    replyData: currentReplyData,
                    replyUser: replyUser,
                    currentUserId: currentUserId,
                    setCurrentReplyData: setCurrentReplyData,
                    decrementReplyCount: decrementReplyCount
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
            caption={currentReplyData.text}
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
                    const undoLike = undoLikeReplyFire(postId, commentId, replyId, currentUserId);
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
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => {
                    const doLike = likeReplyFire(postId, commentId, replyId, currentUserId);
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
                </TouchableOpacity>
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
          </View>
        </View>
      </View>
      <HeaderBottomLine />
    </View>
  )
};

const styles = StyleSheet.create({
  commentBar: {
    flexDirection: 'row',
    backgroundColor: color.white2,
    paddingVertical: RFValue(3),
  },

  commentContainer: {
    flex: 1,
    paddingVertical: RFValue(3),
    paddingRight: RFValue(7)
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
    padding: RFValue(5)
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
    width: RFValue(70)
  },
  userPhoto: {
    width: RFValue(27),
    height: RFValue(27),
    borderRadius: RFValue(27),
  },

  commentTextContainer: {
    justifyContent: 'center',
  },
  commentText: {
    fontSize: RFValue(18),
    color: color.black1
  },
});

export default ReplyBar;
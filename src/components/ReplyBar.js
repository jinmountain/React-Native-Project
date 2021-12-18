import React, { useContext, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Image,
  StyleSheet,  
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity
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
import usersGetFire from '../firebase/usersGetFire';
import likeGetFire from '../firebase/like/likeGetFire';
import likePostFire from '../firebase/like/likePostFire';

// color
import color from '../color';

// expo icons
import expoIcons from '../expoIcons';

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
      const getUserInfo = usersGetFire.getUserInfoFire(replyData.uid);
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

    const checkLike = likeGetFire.checkReplyLikeFire(postId, commentId, currentUserId);
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
              customSizeBorder={RFValue(38)}
              customSizeUserIcon={RFValue(26)}
            />
          }
        </View>
        <View style={styles.commentContainer}>
          <View style={styles.commentBarHeader}>
            { 
              replyUser && replyUser.username
              ? <Text style={styles.headerText}>{replyUser.username} {expoIcons.entypoDot(RFValue(11), color.grey1)} {timeDifference(Date.now(), currentReplyData.createdAt)} {currentReplyData.edited && "(edited)"}</Text>
              : null
            }
          </View>
          <ExpandableText 
            caption={currentReplyData.text}
            defaultCaptionNumLines={5}
          />
          <View style={styles.commentActionBar}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                if (like) {
                  const undoLike = likePostFire.undoLikeReplyFire(postId, commentId, replyId, currentUserId);
                  undoLike
                  .then(() => {
                    setLike(false);
                    setCountLikes(countLikes - 1);
                  })
                  .catch((error) => {
                    // handle error
                  });
                } else {
                  const doLike = likePostFire.likeReplyFire(postId, commentId, replyId, currentUserId);
                  doLike
                  .then(() => {
                    setLike(true);
                    setCountLikes(countLikes + 1);
                  })
                  .catch((error) => {
                    // handle error
                  })
                }
              }}
            >
              <View style={styles.actionIconContainer}>
                <Text>
                {
                  likeButtonReady && like
                  ?
                  expoIcons.antdesignHeart(RFValue(15), color.red2)
                  : likeButtonReady && !like
                  ?
                  expoIcons.antdesignHearto(RFValue(15), color.red2)
                  :
                  null
                } {countLikes} 
                </Text>
              </View>
            </TouchableOpacity>
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
                <Text>{expoIcons.featherMoreVertical(RFValue(15), color.grey2)}</Text>
              </View>
            </TouchableOpacity>
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
    justifyContent: 'flex-end',
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
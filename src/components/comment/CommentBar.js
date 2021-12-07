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

// Hooks

// Contexts

// Components
import { HeaderForm } from '../HeaderForm';
import DefaultUserPhoto from '../defaults/DefaultUserPhoto';
import ExpandableText from '../ExpandableText'
import HeaderBottomLine from '../HeaderBottomLine';

// Hooks
import { wait } from '../../hooks/wait';
import { useNavigation } from '@react-navigation/native';

// firebase
import usersGetFire from '../../firebase/usersGetFire';
import likeGetFire from '../../firebase/like/likeGetFire';
import likePostFire from '../../firebase/like/likePostFire';

// color
import color from '../../color';

// expo icons
import expoIcons from '../../expoIcons';

const { width, height } = Dimensions.get("window");

const CommentBar = ({ 
  index,
	commentId,
  commentData,
  currentUserId,
  postId
}) => {
	const navigation = useNavigation();

  const [ commentUserPhotoURL, setCommentUserPhotoURL ] = useState(null);
  const [ like, setLike ] = useState(false);
  const [ likeButtonReady, setLikeButtonReady ] = useState(false);


  useEffect(() => {
    let isMounted = true;
    console.log(commentData.uid);
    if (commentData && commentData.uid) {
      const getUserPhotoURL = usersGetFire.getUserPhotoURLFire(commentData.uid);
      getUserPhotoURL
      .then((userPhotoURL) => {
        console.log(userPhotoURL);
        isMounted && setCommentUserPhotoURL(userPhotoURL);
      })
      .catch((error) => {
        // handle error
      });
    }

    const checkLike = likeGetFire.checkCommentLikeFire(postId, commentId, currentUserId);
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
      setCommentUserPhotoURL(null);
      setLike(false);
      setLikeButtonReady(false);
    }
  }, []);

	return (
    <View key={index}>
  		<View
        style={styles.commentBar}
      >
        <View style={styles.userPhotoContainer}>
          { 
            commentUserPhotoURL
            ?
            <Image 
              style={styles.userPhoto} 
              source={{ uri: commentUserPhotoURL }} 
            />
            :
            <DefaultUserPhoto 
              customSizeBorder={RFValue(38)}
              customSizeUserIcon={RFValue(26)}
            />
          }
        </View>
        <View style={styles.commentContainer}>
          <ExpandableText 
            caption={commentData.comment}
            defaultCaptionNumLines={5}
          />
          <View style={styles.commentActionBar}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                if (like) {
                  const undoLike = likePostFire.undoLikeCommentFire(postId, commentId, currentUserId);
                  undoLike
                  .then(() => {
                    setLike(false);
                  })
                  .catch((error) => {
                    // handle error
                  });
                } else {
                  const doLike = likePostFire.likeCommentFire(postId, commentId, currentUserId);
                  doLike
                  .then(() => {
                    setLike(true);
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
                } {commentData.count_likes} 
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
            >
              <View style={styles.actionIconContainer}>
                <Text>{expoIcons.matMessageTextOutline(RFValue(15), color.black2)} {commentData.count_replies}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
            >
              <View style={styles.actionIconContainer}>
                <Text>Reply</Text>
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
		flex: 1,
    flexDirection: 'row',
    backgroundColor: color.white2,
    paddingVertical: RFValue(3)
  },

  commentContainer: {
    flex: 1,
    paddingVertical: RFValue(3),
    paddingRight: RFValue(7)
  },

  actionIconContainer: {
    justifyContent: 'center',
    width: RFValue(70),
    alignItems: 'center'
  },

  commentActionBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
});
export default CommentBar;
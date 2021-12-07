// note
// - show the post's top comment in a single line
// - the top comment box is a button
// - if a user clicks one is navigated to the post detail screen with comment box on

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  TextInput
} from 'react-native';

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from '@react-navigation/native';

// firebase
import commentGetFire from '../../firebase/commentGetFire';
import usersGetFire from '../../firebase/usersGetFire';

// components
import DefaultUserPhoto from '../defaults/DefaultUserPhoto';

// hooks
import count from '../../hooks/count';

// color
import color from '../../color';

const PostCardCommentLine = ({ postId, currentUserPhotoURL, commentCount }) => {
  const [ comment, setComment ] = useState(null);
  const [ userPhotoURL, setUserPhotoURL ] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    let isMounted = true;

    const getTopComment = commentGetFire.getTopComment(postId);
    getTopComment
    .then((topComment) => {
      //console.log("top comment: ", topComment);
      isMounted && setComment(topComment);
      if (topComment) {
        const getUserPhotoURL = usersGetFire.getUserPhotoURLFire(topComment.data.uid);
        getUserPhotoURL
        .then((userPhotoURL) => {
          isMounted && setUserPhotoURL(userPhotoURL);
        })
        .catch((error) => {
          // handle error
        });
      };
    })
    .catch((error) => {
      console.log(error);
    });

    return () => {
      isMounted = false;
      setComment(null);
      setUserPhotoURL(null);
    }
  }, []);

  return (
    <View style={styles.mainContainer}>
      {
        !comment
        ? null
        : comment.data
        ?
        // when the top comment exists
        <TouchableWithoutFeedback
          style={styles.naviagteToComments}
          onPress={() => {
            navigation.navigate('Comment', {
              postId: postId,
              commentCount: commentCount
            });
          }}
        > 
          <View>
            <View style={styles.commentContainer}>
              <View style={styles.userPhotoContainer}>
                { 
                  !comment
                  ?
                  null
                  : userPhotoURL
                  ?
                  <Image 
                    style={styles.userPhoto} 
                    source={{ uri: userPhotoURL }} 
                  />
                  :
                  <DefaultUserPhoto 
                    customSizeBorder={RFValue(15)}
                    customSizeUserIcon={RFValue(10)}
                  />
                }
              </View>
              <View style={styles.topCommentTextContainer}>
                <Text
                  numberOfLines={1}
                  style={styles.commentText}
                >
                  {comment.data.comment}
                </Text>
              </View>
            </View>
            <View style={styles.viewCommentsContainer}>
              <Text style={styles.viewCommentsText}>View {commentCount} {count.commentOrComments(commentCount)}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        : 
        <View style={styles.commentContainer}>
          <View style={styles.userPhotoContainer}>
            { 
              currentUserPhotoURL
              ?
              <Image 
                style={styles.userPhoto} 
                source={{ uri: currentUserPhotoURL }} 
              />
              :
              <DefaultUserPhoto 
                customSizeBorder={RFValue(15)}
                customSizeUserIcon={RFValue(10)}
              />
            }
          </View>
          <View style={styles.firstCommentContainer}>
            <Text style={styles.firstCommentText}>
              be the first to write
            </Text>
          </View>
        </View>
      }
    </View>
  )
};

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  naviagteToComments: {
    justifyContent: 'center',
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: RFValue(35),
    paddingVertical: RFValue(3),
  },
  firstCommentContainer: {
    flex: 1,
    paddingLeft: RFValue(5),
    width: "100%",
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  textInput: {
    flex: 1,
  },
  commentText: {
    color: color.black1,
  },
  userPhotoContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  userPhoto: {
    width: RFValue(21),
    height: RFValue(21),
    borderRadius: RFValue(100),
  },
  viewCommentsContainer: {
    height: RFValue(21)
  },
  viewCommentsText: {
    color: color.grey3
  },

  topCommentTextContainer: {
    paddingLeft: RFValue(5)
  },
});

export default PostCardCommentLine;
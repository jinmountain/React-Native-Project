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
  StyleSheet,
  Image,
  TextInput
} from 'react-native';

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// firebase
import commentGetFire from '../../firebase/commentGetFire';

// components
import DefaultUserPhoto from '../defaults/DefaultUserPhoto';

// color
import color from '../../color';

const PostCardCommentLine = ({ postId, currentUserPhotoURL, postId, commentCount }) => {

  const [ comment, setComment ] = useState(null);

  const [ newComment, setNewComment ] = useState(null);
  const [ postNewCommentState, setPostNewCommentState ] = useState(false);
  useEffect(() => {
    let isMounted = true;

    const getTopComment = commentGetFire.getTopComment(postId);
    getTopComment
    .then((topComment) => {
      //console.log("top comment: ", topComment);
      isMounted && setComment(topComment);
    })
    .catch((error) => {
      console.log(error);
    });

    return () => {
      isMounted = false;
      setComment(null);
      setNewComment(null);
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
        <TouchableOpacity
          style={styles.navigateToPostDetailContainer}
          onPress={() => {
            navigation.navigate('PostDetail', {
              postId: postId
            });
          }}
        > 
          <View style={styles.commentContainer}>
            <View style={styles.userPhotoContainer}>
              { 
                !comment
                ?
                null
                : comment.user
                ?
                <Image 
                  style={styles.userPhoto} 
                  source={{ uri: comment.user.photoURL }} 
                />
                : 
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
            <Text style={styles.viewCommentsText}>view 3 comments</Text>
          </View>
        </TouchableOpacity>
        : 
        <View style={styles.commentContainer}>
          <View style={styles.userPhotoContainer}>
            { 
              !comment
              ?
              null
              : comment.user
              ?
              <Image 
                style={styles.userPhoto} 
                source={{ uri: comment.user.photoURL }} 
              />
              : 
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
          {
            postNewCommentState
            ?
            <View>

            </View>
            :
            <View style={styles.firstCommentContainer}>
              <TextInput
                style={styles.textInput}
                onChangeText={setNewComment}
                value={newComment}
                placeholder="be the first to write"
              />

              {
                newComment
                ?
                <TouchableHighlight
                  style={styles.commentButton}
                  underlayColor={color.grey4}
                  onPress={() => {
                    console.log(newComment);
                  }}
                >
                  <View style={styles.commentButtonTextContainer}>
                    <Text style={styles.commentButtonText}>
                      Comment
                    </Text>
                  </View>
                </TouchableHighlight>
                : null
              }
            </View>
          }
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
  navigateToPostDetailContainer: {
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
    paddingLeft: RFValue(27)
  },
  viewCommentsText: {
    color: color.grey3
  },

  topCommentTextContainer: {
    paddingLeft: RFValue(5)
  },

  commentButton: {
    padding: RFValue(3),
    borderRadius: RFValue(5)
  },
  commentButtonTextContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  commentButtonText: {
    fontSize: RFValue(13),
    color: color.red2
  },
});

export default PostCardCommentLine;
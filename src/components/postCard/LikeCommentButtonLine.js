import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Designs
import { FontAwesome5 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

// Hooks
import { timeDifference } from '../../hooks/timeDifference';
import { kOrNo } from '../../hooks/kOrNo';

// firebase
import likeFire from '../../firebase/like/likeFire.js'
import likeGetFire from '../../firebase/like/likeGetFire.js'

// Color
import color from '../../color';

// Components
import THButtonWOBorder from '../buttons/THButtonWOBorder';
import TagLine from '../TagLine';

const PostLikeCommentTimeInfo = ({ 
  countRating, 
  postId, 
  uid, 
  tags, 
  likeCount,
  comment_count,
  currentUserId
}) => {
  const [ likeCountState, setLikeCountState ] = useState(likeCount);
  const [ liked, setLiked ] = useState(false);
  const [ likeButtonReady, setLikeButtonReady ] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const checkLike = likeGetFire.checkLikeFire(postId, currentUserId);
    checkLike
    .then((like) => {
      isMounted && setLikeButtonReady(true);
      isMounted && setLiked(like);
    })
    .catch((error) => {

    });

    return () => {
      isMounted = false;
      setLiked(false);
      setLikeButtonReady(false);
    }
  }, []);

  return (
    <View 
      style={styles.likeCommentButtonContainer}
    >
      { 
        likeButtonReady && liked
        ? 
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => {
            setLiked(false); 
            likeFire.undoLikePostFire(postId, uid);
            setLikeCountState(likeCountState - 1);
          }}
        >
          <AntDesign name="heart" size={styles.buttonSize} color="red" />
          <Text style={styles.buttonText}>{likeCountState}</Text>
        </TouchableOpacity>
        : likeButtonReady && !liked
        ?
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => {
            setLiked(true);
            likeFire.likePostFire(postId, uid);
            setLikeCountState(likeCountState + 1);
          }}
        >
          <AntDesign name="hearto" size={styles.buttonSize} color="black" />
          <Text style={styles.buttonText}>{likeCountState}</Text>
        </TouchableOpacity>
        : null
      }
      <TouchableOpacity
        style={styles.buttonContainer}
      >
        <AntDesign name="message1" size={styles.buttonSize} color="black" />
      </TouchableOpacity>
      { 
        countRating
        ?
        <TouchableOpacity
          style={styles.buttonContainer}
        >
          <AntDesign name="staro" size={styles.buttonSize} color={color.black1} />
          <Text style={styles.buttonText}>{kOrNo(countRating)}</Text>
        </TouchableOpacity>
        :
        null
      }
      <TagLine 
        tags={tags}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  likeCommentButtonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: RFValue(3),
    height: RFValue(40),
    alignItems: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    marginRight: RFValue(11),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: RFValue(17),
    paddingHorizontal: RFValue(3),
  },
  buttonSize: RFValue(27),
});

export default PostLikeCommentTimeInfo;
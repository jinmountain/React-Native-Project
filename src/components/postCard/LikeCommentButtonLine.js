import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from '@react-navigation/native';

// Designs
import { FontAwesome5 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

// Hooks
import { timeDifference } from '../../hooks/timeDifference';
import count from '../../hooks/count';

// firebase
import likePostFire from '../../firebase/like/likePostFire.js'
import likeGetFire from '../../firebase/like/likeGetFire.js'

// Color
import color from '../../color';

// Components
import THButtonWOBorder from '../buttons/THButtonWOBorder';
import TagLine from '../TagLine';

const LikeCommentButtonLine = ({ 
  countRating, 
  postId, 
  uid, 
  tags, 
  likeCount,
  commentCount,
  currentUserId
}) => {
  const [ likeCountState, setLikeCountState ] = useState(likeCount);
  const [ like, setLike ] = useState(false);
  const [ likeButtonReady, setLikeButtonReady ] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    let isMounted = true;
    const checkLike = likeGetFire.checkLikeFire(postId, currentUserId);
    checkLike
    .then((result) => {
      isMounted && setLikeButtonReady(true);
      isMounted && setLike(result);
    })
    .catch((error) => {

    });

    return () => {
      isMounted = false;
      setLike(false);
      setLikeButtonReady(false);
    }
  }, []);

  return (
    <View 
      style={styles.likeCommentButtonContainer}
    >
      { 
        likeButtonReady && like
        ? 
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => {
            setLike(false); 
            likePostFire.undoLikePostFire(postId, uid);
            setLikeCountState(likeCountState - 1);
          }}
        >
          <AntDesign name="heart" size={styles.buttonSize} color="red" />
          <Text style={styles.buttonText}>{likeCountState}</Text>
        </TouchableOpacity>
        : likeButtonReady && !like
        ?
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => {
            setLike(true);
            likePostFire.likePostFire(postId, uid);
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
        onPress={() => {
          navigation.navigate('Comment', {
            postId: postId,
            commentCount: commentCount
          });
        }}
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
          <Text style={styles.buttonText}>{count.kOrNo(countRating)}</Text>
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

export default LikeCommentButtonLine;
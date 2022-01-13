import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback
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

// expo icons
import {
  evilIconsChevronDown, 
  evilIconsChevronUp, 
  featherBookmark
} from '../../expoIcons';

// Components
import THButtonWOBorder from '../buttons/THButtonWOBorder';
import AnimHighlight from '../buttons/AnimHighlight';

const LikeCommentButtonLine = ({ 
  countRating, 
  postId, 
  postUserId, 
  likeCount,
  commentCount,
  currentUserId,
  moreDetailExists,
  expandInfoBox,
  setExpandInfoBox,
  cardIndex,
  postFiles,
  // setShowCommentPostIndex
}) => {
  const [ commentCountState, setCommentCountState ] = useState(commentCount);
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
    <AnimHighlight
      content={
        <View 
          style={styles.likeCommentButtonContainer}
          onPress={() => {
            if (moreDetailExists) {
              setExpandInfoBox(!expandInfoBox)
            }
          }}
        >
          {
            moreDetailExists &&
            <View style={styles.expandInfoBoxIconContainer}>
              {
                !expandInfoBox
                ? evilIconsChevronDown(RFValue(27), color.black1)
                : evilIconsChevronUp(RFValue(27), color.black1)
              }
            </View>
          }
          { 
            likeButtonReady && like
            ? 
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => {
                setLike(false); 
                likePostFire.undoLikePostFire(postId, currentUserId);
                setLikeCountState(likeCountState - 1);
              }}
            >
              <AntDesign name="heart" size={RFValue(29)} color={color.red2} />
              <Text style={styles.buttonText}>{likeCountState}</Text>
            </TouchableOpacity>
            : likeButtonReady && !like
            ?
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => {
                setLike(true);
                likePostFire.likePostFire(postId, currentUserId);
                setLikeCountState(likeCountState + 1);
              }}
            >
              <Text style={styles.buttonText}><AntDesign name="hearto" size={styles.buttonSize} color={color.red2} /> {likeCountState}</Text>
            </TouchableOpacity>
            : null
          }
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              // setShowCommentPostIndex(cardIndex);
              navigation.navigate('Comment', {
                postId: postId,
                commentCount: commentCountState,
                setCommentCountState: setCommentCountState,
                postFiles: postFiles
              });
            }}
          >
            <Text style={styles.buttonText}>
              <AntDesign name="message1" size={styles.buttonSize} color="black" /> {count.kOrNo(commentCountState)}
            </Text>
          </TouchableOpacity>
          { 
            countRating
            ?
            <TouchableOpacity
              style={styles.buttonContainer}
            >
              <Text style={styles.buttonText}><AntDesign name="staro" size={styles.buttonSize} color={color.black1} /> {count.kOrNo(countRating)}</Text>
            </TouchableOpacity>
            :
            null
          }
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              console.log("book mark");
            }}
          >
            {featherBookmark(styles.buttonSize, color.black1)}
          </TouchableOpacity>
        </View>
      }
      onPressOutAction={() => {
        if (moreDetailExists) {
          setExpandInfoBox(!expandInfoBox)
        }
      }}
      customStyles={{ width: '100%', height: RFValue(40) }}
    />
  )
};

const styles = StyleSheet.create({
  likeCommentButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingVertical: RFValue(3),
    height: RFValue(40),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: RFValue(17),
    paddingHorizontal: RFValue(3),
    justifyContent: 'center',
  },
  buttonSize: RFValue(23),
  expandInfoBoxIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LikeCommentButtonLine;
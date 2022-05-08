import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Animated,
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
import { wait } from '../../hooks/wait';
import { roundUpFirstDec } from '../../hooks/useMath';

// firebase
import {
  likePostFire,
  undoLikePostFire
} from '../../firebase/like/likePostFire.js';
import { 
  checkPostLikeFire, 
  // getPostLikeCountFire 
} from '../../firebase/like/likeGetFire.js';

// Color
import color from '../../color';

// expo icons
import {
  evilIconsChevronDown, 
  evilIconsChevronUp, 
  featherBookmark,
  antdesignHearto,
  antdesignHeart
} from '../../expoIcons';

// Components
import THButtonWOBorder from '../buttons/THButtonWOBorder';
import AnimHighlight from '../buttons/AnimHighlight';
import PostLikeButton from '../buttons/PostLikeButton';

const LikeCommentButtonLine = ({ 
  totalRating,
  countRating, 
  postId, 
  postUserId, 
  likeCount,
  commentCount,
  incrementCommentCount,
  decrementCommentCount,
  currentUserId,
  moreDetailExists,
  expandInfoBox,
  setExpandInfoBox,
  cardIndex,
  postFiles,
  postCaption
  // setShowCommentPostIndex
}) => {
  const [ likeCountState, setLikeCountState ] = useState(likeCount);
  const [ like, setLike ] = useState(false);
  const incrementLikeCount = () => {
    setLikeCountState(likeCountState + 1);
  };
  const decrementLikeCount = () => {
    setLikeCountState(likeCountState - 1);
  };
  const [ likeButtonReady, setLikeButtonReady ] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    let isMounted = true;
    const checkLike = checkPostLikeFire(postId, currentUserId);
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
    <View style={styles.likeCommentButtonContainer}>
{/*      {
        moreDetailExists &&
        <View style={styles.expandInfoBoxIconContainer}>
          {
            !expandInfoBox
            ? evilIconsChevronDown(RFValue(27), color.black1)
            : evilIconsChevronUp(RFValue(27), color.black1)
          }
        </View>
      }*/}
      <View style={styles.buttonContainer}>
        { 
          likeButtonReady && like
          ? 
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              setLike(false); 
              const undoLike = undoLikePostFire(postId, currentUserId);
              undoLike
              .then(() => {
                decrementLikeCount();
              })
              .catch((error) => {

              });
            }}
          >
            <Animated.View
              style={[
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  transform: [
                    {
                      scale: scaleAnimValue
                    }
                  ],
                  opacity: opacityAnimValue
                },
              ]}
            >
              {antdesignHeart(RFValue(25), color.red2)}
            </Animated.View>
          </TouchableOpacity>
          : likeButtonReady && !like
          ?
          <TouchableWithoutFeedback
            onPress={() => {
              const likePost = likePostFire(postId, currentUserId);
              likePost
              .then(() => {
                setLike(true);
                likeScaleAnim();
                likeOpacityAnim();
                incrementLikeCount();
              })
              .catch((error) => {

              });
            }}
          >
            <View style={styles.buttonIconContainer}>
              {antdesignHearto(RFValue(25), color.red2)}
            </View>
          </TouchableWithoutFeedback>
          : 
          <ActivityIndicator 
            size={"small"}
            color={color.black1}
          />
        }
        <View style={styles.likeCountTextContainer}>
          <Text style={styles.buttonText}>{likeCountState}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          // setShowCommentPostIndex(cardIndex);
          navigation.navigate('Comment', {
            postId: postId,
            postFiles: postFiles,
            postCaption: postCaption,
            incrementCommentCount,
            decrementCommentCount,
          });
        }}
      >
        <Text style={styles.buttonText}>
          <AntDesign name="message1" size={styles.buttonSize} color="black" /> {count.kOrNo(commentCount)}
        </Text>
      </TouchableOpacity>
      { 
        countRating
        ?
        <TouchableOpacity>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonIconContainer}>
              <AntDesign name="staro" size={RFValue(27)} color={color.yellow2} />
            </View>
            <Text style={styles.buttonText}>
              {
                countRating
                ?
                roundUpFirstDec(totalRating/countRating)
                : "-"
              }
            </Text>
          </View>
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
  )
};

const styles = StyleSheet.create({
  likeCommentButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: RFValue(3),
    height: RFValue(40),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonIconContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  likeCountTextContainer: {
    padding: RFValue(5),
    justifyContent: 'center',
    alignItems: 'center'
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
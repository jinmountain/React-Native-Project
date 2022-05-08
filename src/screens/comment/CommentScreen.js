import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity,
  TouchableHighlight,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  SafeAreaView,
  Keyboard,
  Dimensions,
  Pressable,
  FlatList,
  TextInput,
  Platform,
  Image,
  StatusBar,
  ScrollView,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Video, AVPlaybackStatus } from 'expo-av';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { BlurView } from 'expo-blur';
import { Menu, Divider } from 'react-native-paper';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  useDerivedValue,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
} from "react-native-reanimated";
import { PanGestureHandler, TapGestureHandler } from "react-native-gesture-handler";
import { clamp } from "react-native-redash";

// Components
import MainTemplate from '../../components/MainTemplate';
import HeaderBottomLine from '../../components/HeaderBottomLine';
import { HeaderForm } from '../../components/HeaderForm';
import DefaultUserPhoto from '../../components/defaults/DefaultUserPhoto';
import CommentBar from '../../components/comment/CommentBar';
import SpinnerFromActivityIndicator from '../../components/ActivityIndicator';
import SnailBottomSheet from '../../components/SnailBottomSheet';
import BottomSheetHeader from '../../components/BottomSheetHeader';
import CommentReplyBottomSheetHeader from '../../components/CommentReplyBottomSheetHeader';
import ExpandableText from '../../components/ExpandableText';

// firebase
import commentGetFire from '../../firebase/comment/commentGetFire';
// Design

// contexts
import { Context as AuthContext } from '../../context/AuthContext';

// Hooks
import count from '../../hooks/count';
import useIsKeyboardVisible from '../../hooks/useIsKeyboardVisible';
import { useOrientation } from '../../hooks/useOrientation';

// color
import color from '../../color';

// sizes
import sizes from '../../sizes';

// icon
import {
  antClose,
  entypoList
} from '../../expoIcons';

const CommentScreen = ({ navigation, route }) => {
  const iosStatusBarHeight = getStatusBarHeight();
  const SafeStatusBar = Platform.select({
    ios: iosStatusBarHeight,
    android: StatusBar.currentHeight,
  });

  // -- orientation and state
    const [ windowWidth, setWindowWidth ] = useState(Dimensions.get("window").width);
    const [ windowHeight, setWindowHeight ] = useState(Dimensions.get("window").height);
    const [ safeWindowHeight, setSafeWindowHeight ] = useState(Dimensions.get("window").height - SafeStatusBar);
    const [ imageWidth, setImageWidth ] = useState((Dimensions.get("window").height - SafeStatusBar) * 0.25);

    const orientation = useOrientation();

    useEffect(() => {
      const safeWindowHeight = Dimensions.get("window").height - SafeStatusBar;
      setWindowWidth(Dimensions.get("window").width);
      setWindowHeight(Dimensions.get("window").height);
      setSafeWindowHeight(safeWindowHeight);
      setImageWidth(safeWindowHeight * 0.25);
    }, [orientation]);

  // -- comment states and effect
    const [ comments, setComments ] = useState([]);
    const [ commentLast, setCommentLast ] = useState(null);
    const [ commentFetchSwitch, setCommentFetchSwitch ] = useState(true);
    const [ commentFetchState, setCommentFetchState ] = useState(false);
    const [ commentSortType , setCommentSortType ] = useState('top');

    // add new comment to comments state
    const addNewComment = (newComment) => {
      setComments([ newComment, ...comments ]);
    };

    // const [ isKeyboardVisible ] = useIsKeyboardVisible();

    const { 
      postId, 
      postFiles, 
      postCaption, 
      incrementCommentCount,
      decrementCommentCount, 
    } = route.params;

    const { 
      state: {
        user
      }
    } = useContext(AuthContext);

    useEffect(() => {
      let isMounted = true;
      const getScreenReady = new Promise ((res, rej) => {
        if (commentFetchSwitch && !commentFetchState && isMounted) {
          isMounted && setCommentFetchState(true);
          const getComments = commentGetFire.getCommentsFire(postId, null, commentSortType);
          getComments
          .then((result) => {
            isMounted && setComments(result.fetchedComments);
            if (result.lastComment) {
              isMounted && setCommentLast(result.lastComment);
            } else {
              isMounted && setCommentFetchSwitch(false);
            };

            if (!result.fetchSwitch) {
              isMounted && setCommentFetchSwitch(false);
            };

            isMounted && setCommentFetchState(false);
          })
          .catch((error) => {
            rej(error);
          });
        };
      });
      return () => {
        isMounted = false;
        setComments([]);
        setCommentLast(null);
        setCommentFetchSwitch(true);
        setCommentFetchState(false);
      };
    }, []);

  // -- flatList viewable items change
    const [focusedCardIndex, setFocusedCardIndex] = useState(0);
    const viewabilityConfig = useRef({
      itemVisiblePercentThreshold: 50,
      waitForInteraction: true,
      minimumViewTime: 500, // stay at least 0.5 second
    })

    const onViewableItemsChanged = useRef(({ viewableItems, changed }) => {
      if (changed && changed.length > 0) {
        setFocusedCardIndex(changed[0].index);
      }
    });

  // -- text input form
    const [ textInputFormHeight, setTextInputFormHeight ] = useState(RFValue(30));
    const textInputForm = () => {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate("CommentTextInput", {
              postId,
              currentUserId: user.id,
              currentUserPhotoURL: user.photoURL,
              incrementCommentCount,
              addNewComment
            });
          }}
        >
          <View>
            <View style={styles.newCommentContainer}>
              <View style={styles.currentUserPhotoContainer}>
                { 
                  user.photoURL
                  ?
                  <Image 
                    style={styles.currentUserPhoto} 
                    source={{ uri: user.photoURL }} 
                  />
                  :
                  <DefaultUserPhoto 
                    customSizeBorder={RFValue(30)}
                    customSizeUserIcon={RFValue(20)}
                  />
                }
              </View>
              <View style={
                styles.newCommentTextInputContainer
              }>
                <Text style={styles.newCommentTextInput}>
                  Start writing
                </Text>
              </View>
              <View
                style={styles.newCommentButton}
              >
                <View style={styles.newCommentButtonTextContainer}>
                  <Text style={styles.newCommentButtonText}>Post</Text>
                </View>
              </View>
            </View>
            <HeaderBottomLine />
          </View>
        </TouchableWithoutFeedback>
      )
    }

  // -- on close end
    const onCloseEnd = () => {
      navigation.goBack();
    }

  // -- comment bottom sheet animation
    const snapPoints = [ 0, 0.75, 1 ];

    const snapSwitchs = [ true, true ];
    const firstSnapSwitch = snapSwitchs[0];
    const thirdSnapSwitch = snapSwitchs[1];

    // the scale value to make the image full
    const imageScaleOutput = windowWidth/imageWidth;
    // the distance image size grows
    const imageScaleInputDistance = windowWidth - imageWidth;
    const fullImageCommentSnapHeight = safeWindowHeight * snapPoints[1] - imageScaleInputDistance;
    const secondSnapHeight = safeWindowHeight * snapPoints[1];
    const firstSnapHeight = fullImageCommentSnapHeight;
    const thirdSnapHeight = safeWindowHeight;

    const firstSnapAbsY = safeWindowHeight - fullImageCommentSnapHeight;
    const secondSnapAbsY = safeWindowHeight * (1 - snapPoints[1]);
    const thirdSnapAbsY = safeWindowHeight * (1 - snapPoints[2]);
    const bottomAbsY = safeWindowHeight;

    const bottomFirstSnapDistAvg = fullImageCommentSnapHeight / 2;
    const firstSecondSnapDistAvg = (secondSnapHeight - firstSnapHeight) / 2;
    const secondThirdSnapDistAvg = (thirdSnapHeight - secondSnapHeight) / 2;

    const thirdSnapTranslateY = -(safeWindowHeight * snapPoints[2] - safeWindowHeight * snapPoints[1]);
    const firstSnapTranslateY = safeWindowHeight * snapPoints[1] - fullImageCommentSnapHeight;

    const bottomSheetHeight = useSharedValue(secondSnapHeight);
    const contentHeight = useSharedValue(safeWindowHeight - secondSnapHeight);
    const translateY = useSharedValue(0);
    const snapIndex = useSharedValue(1);

    const onGestureEventBottomSheet = useAnimatedGestureHandler({
      onStart: (_, ctx) => {
        ctx.offsetY = translateY.value;
      },
      onActive: (event, ctx) => {
        translateY.value = event.translationY;
        bottomSheetHeight.value = clamp(
          secondSnapHeight - (ctx.offsetY + event.translationY), 
          0, 
          safeWindowHeight
        );
        contentHeight.value = clamp(
          safeWindowHeight - secondSnapHeight + (ctx.offsetY + event.translationY),
          0,
          safeWindowHeight
        );
      },
      onEnd: (event, ctx) => {
        // console.log(event);
        // console.log("firstSecondSnapDistAvg: ", firstSecondSnapDistAvg);
        // console.log("secondThirdSnapDistAvg: ", secondThirdSnapDistAvg);
        // console.log("snapIndex: ", snapIndex.value);
        if (snapIndex.value === 2) {
          // only go down
          if (event.velocityY > 900 || event.translationY > secondThirdSnapDistAvg) {
            bottomSheetHeight.value = withTiming(secondSnapHeight, {
              duration: 500
            });
            contentHeight.value = withTiming(safeWindowHeight - secondSnapHeight, {
              duration: 500
            });
            translateY.value = 0;
            snapIndex.value = 1
          } 
          // go back to the third snap 
          else {
            bottomSheetHeight.value = withTiming(thirdSnapHeight, {
              duration: 500
            });
            contentHeight.value = withTiming(safeWindowHeight - thirdSnapHeight, {
              duration: 500
            });
            translateY.value = thirdSnapTranslateY;
            snapIndex.value = 2
          }
        }
        else if (snapIndex.value === 1) {
          // go down
          if (event.velocityY > 900 || event.translationY > firstSecondSnapDistAvg) {
            if (event.velocityY > 1500) {
              runOnJS(onCloseEnd)();
            } else {
              bottomSheetHeight.value = withTiming(firstSnapHeight, {
                duration: 500
              });
              contentHeight.value = withTiming(safeWindowHeight - firstSnapHeight, {
                duration: 500
              });
              translateY.value = firstSnapTranslateY;
              snapIndex.value = 0
            }
          }
          // go up
          else if (event.velocityY < -900 || event.translationY < -secondThirdSnapDistAvg) {
            bottomSheetHeight.value = withTiming(thirdSnapHeight, {
              duration: 500
            });
            contentHeight.value = withTiming(safeWindowHeight - thirdSnapHeight, {
              duration: 500
            });
            translateY.value = thirdSnapTranslateY;
            snapIndex.value = 2
          } 
          // go back to the second snap
          else {
            bottomSheetHeight.value = withTiming(secondSnapHeight, {
              duration: 500
            });
            contentHeight.value = withTiming(safeWindowHeight - secondSnapHeight, {
              duration: 500
            });
            translateY.value = 0;
            snapIndex.value = 1
          }
        }
        else if (snapIndex.value === 0) {
          // go down
          if (event.velocityY > 900 || event.translationY > bottomFirstSnapDistAvg) {
            runOnJS(onCloseEnd)();
          }
          // go up
          else if (event.velocityY < -900 || event.translationY < -firstSecondSnapDistAvg) {
            bottomSheetHeight.value = withTiming(secondSnapHeight, {
              duration: 500
            });
            contentHeight.value = withTiming(safeWindowHeight - secondSnapHeight, {
              duration: 500
            });
            translateY.value = 0;
            snapIndex.value = 1
          }
          else {
            bottomSheetHeight.value = withTiming(firstSnapHeight, {
              duration: 500
            });
            contentHeight.value = withTiming(safeWindowHeight - firstSnapHeight, {
              duration: 500
            });
            translateY.value = firstSnapTranslateY;
            snapIndex.value = 0;
          }
        }
        else {
          bottomSheetHeight.value = withTiming(secondSnapHeight, {
            duration: 500
          });
          contentHeight.value = withTiming(safeWindowHeight - secondSnapHeight, {
            duration: 500
          });
          translateY.value = 0;
          snapIndex.value = 1
        }
      },
    });

  // -- render comments
    const _commentsFlatListRef = useRef(null);
    const renderComments = () => {
      return (
        <View 
          style={{ flex: 1, backgroundColor: color.white2 }} 
        >
          {
            comments.length > 0
            ?
            <FlatList
              ref={_commentsFlatListRef}
              onEndReached={() => {
                // console.log("commentFetchSwitch:", commentFetchSwitch, "commentFetchState: ", commentFetchState);
                if (commentFetchSwitch && !commentFetchState) {
                  setCommentFetchState(true);
                  const getComments = commentGetFire.getCommentsFire(postId, commentLast, commentSortType);
                  getComments
                  .then((result) => {
                    setComments([ ...comments, ...result.fetchedComments ]);
                    if (result.lastComment) {
                      setCommentLast(result.lastComment);
                    } else {
                      setCommentFetchSwitch(false);
                    };

                    if (!result.fetchSwitch) {
                      setCommentFetchSwitch(false);
                    };
                    setCommentFetchState(false);
                  })
                  .catch((error) => {
                    rej(error);
                  });
                };
              }}
              onEndReachedThreshold={0.1}
              vertical
              showsVerticalScrollIndicator={false}
              decelerationRate={"fast"}
              data={comments}
              keyExtractor={(comment, index) => comment.id}
              renderItem={({ item: comment, index }) => {
                return (
                  index === 0
                  ?
                  <View>
                    {
                      postCaption.length > 0 &&
                      <>
                        <View style={styles.captionContainer}>
                          <ExpandableText
                            caption={postCaption}
                            defaultCaptionNumLines={5}
                          />
                        </View>
                        <HeaderBottomLine />
                      </>
                    }
                    {textInputForm()}
                    <CommentBar
                      index={index} 
                      commentId={comment.id}
                      commentData={comment.data}
                      currentUserId={user.id}
                      postId={postId}
                      decrementCommentCount={decrementCommentCount}
                    />
                  </View>
                  :
                  <CommentBar
                    index={index}
                    commentId={comment.id}
                    commentData={comment.data}
                    currentUserId={user.id}
                    postId={postId}
                    decrementCommentCount={decrementCommentCount}
                  />
                )
              }}
            />
            : 
            <View>
              {
                postCaption.length > 0 &&
                <>
                  <View style={styles.captionContainer}>
                    <ExpandableText
                      caption={postCaption}
                      defaultCaptionNumLines={5}
                    />
                    
                  </View>
                  <HeaderBottomLine />
                </>
              }
              {textInputForm()}
            </View>
          }
        </View>
      )
    };

  // -- Animated Style
    const bottomSheetAnimatedStyle = useAnimatedStyle(() => {
      return {
        height: bottomSheetHeight.value
      };
    });

    const contentAnimatedStyle = useAnimatedStyle(() => {
      return {
        height: contentHeight.value,
      };
    });

    const imageContainerAnimatedStyle = useAnimatedStyle(() => {
      const imageScale = interpolate(
        contentHeight.value,
        [
          secondSnapAbsY, 
          secondSnapAbsY + imageScaleInputDistance, 
          secondSnapAbsY + imageScaleInputDistance
        ],
        [1, imageScaleOutput, imageScaleOutput],
        Extrapolate.CLAMP
      );

      return {
        transform: [{
          scale: imageScale
        }],
      }
    });

    const opacityAnimatedStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        contentHeight.value,
        [0, secondSnapAbsY + imageScaleInputDistance],
        [1, 0.5],
        Extrapolate.CLAMP
      );

      return {
        backgroundColor: `rgba(0, 0, 0, ${opacity})`
      }
    });

  // -- render comment bottom sheet header
    const [ showSetting, setShowSetting ] = useState(false);
    const renderBottomSheetHeader = () => {
      return (
        <View 
          style={styles.bottomSheetHeaderContainer}
        > 
          <View style={styles.bottomSheetHeaderInner}>
            <View style={styles.sliderIndicatorContainer}>
              <View style={styles.sliderIndicator}/>
            </View>
            <View style={styles.bottomSheetHeaderBottomContainer}>
              <View style={styles.bottomSheetHeaderTitleContainer}>
                <Text style={styles.bottomSheetHeaderTitleText}>
                  {
                    comments.length > 1 ? "Comments" : "Comment"
                  }
                </Text>
              </View>
              <View style={styles.buttonsContainer}>
                <Menu
                  visible={showSetting}
                  onDismiss={() => {
                    setShowSetting(false);
                  }}
                  anchor={
                    <TouchableHighlight
                      style={styles.bottomSheetHeaderCloseButton}
                      underlayColor={color.grey4}
                      onPress={() => {
                        setShowSetting(!showSetting);
                      }}
                    >
                      <View>
                        {entypoList(RFValue(21), color.black1)}
                      </View>
                    </TouchableHighlight>
                  }>
                  <Menu.Item onPress={() => {
                    if (
                      !commentFetchState && 
                      commentSortType !== "top"
                    ) {
                      setCommentFetchState(true);
                      setCommentFetchSwitch(true);
                      setCommentLast(null);
                      const getComments = commentGetFire.getCommentsFire(postId, null, "top");
                      getComments
                      .then((result) => {
                        setComments(result.fetchedComments);
                        if (result.lastComment) {
                          setCommentLast(result.lastComment);
                        } else {
                          setCommentFetchSwitch(false);
                        };

                        if (!result.fetchSwitch) {
                          setCommentFetchSwitch(false);
                        };

                        setCommentFetchState(false);
                        setShowSetting(false);
                        setCommentSortType("top");
                        _commentsFlatListRef.current.scrollToOffset({ animated: true, offset: 0 });
                      })
                      .catch((error) => {
                        
                      });
                    };
                  }} title="Top" />
                  <Divider />
                  <Menu.Item onPress={() => {
                    if ( 
                      !commentFetchState &&
                      commentSortType !== 'new'
                    ) {
                      setCommentFetchState(true);
                      setCommentFetchSwitch(true);
                      setCommentLast(null);
                      const getComments = commentGetFire.getCommentsFire(postId, null, "new");
                      getComments
                      .then((result) => {
                        setComments(result.fetchedComments);
                        if (result.lastComment) {
                          setCommentLast(result.lastComment);
                        } else {
                          setCommentFetchSwitch(false);
                        };

                        if (!result.fetchSwitch) {
                          setCommentFetchSwitch(false);
                        };

                        setCommentFetchState(false);
                        setShowSetting(false);
                        setCommentSortType("new");
                        _commentsFlatListRef.current.scrollToOffset({ animated: true, offset: 0 });
                      })
                      .catch((error) => {
                        
                      });
                    };
                  }} title="New" />
                </Menu>
                <TouchableHighlight
                  style={styles.bottomSheetHeaderCloseButton}
                  underlayColor={color.grey4}
                  onPress={() => {
                    navigation.goBack();
                  }}
                >
                  {antClose(RFValue(21), color.black1)}
                </TouchableHighlight>
              </View>
            </View>
          </View>
          <HeaderBottomLine />
        </View>
      )
    };

  return (
    <Animated.View 
      style={[
        styles.mainContainer,
        styles.absoluteFill,
        opacityAnimatedStyle
      ]}
    >
      <SafeAreaView/>
      <Animated.View
        style={[
          {
            justifyContent: 'center',
            alignItems: 'center',
          },
          contentAnimatedStyle
        ]}
      >
        <Animated.View style={[
          {
            // borderWidth: 1,
            justifyContent: 'center', 
            alignItems: 'center',
            width: imageWidth,
            height: imageWidth,
            borderRadius: 15,
          },
          imageContainerAnimatedStyle,
        ]}>
          <FlatList
            horizontal
            onViewableItemsChanged={onViewableItemsChanged.current}
            viewabilityConfig={viewabilityConfig.current}
            pagingEnabled={true}
            snapToInterval={imageWidth}
            showsHorizontalScrollIndicator={false}
            data={postFiles}
            keyExtractor={(file, index) => index.toString()}
            getItemLayout = {(data, index) => (
              {
                length: imageWidth,
                offset: imageWidth * index,
                index
              }
            )}
            renderItem={({ item, index }) => {
              return (
                <View 
                  style={[
                    { width: imageWidth, height: imageWidth }, 
                  ]}
                >
                  { 
                    item.type === 'video'
                    ?
                      <Video
                        style={[
                          { width: imageWidth, height: imageWidth },
                          // imageAnimatedStyle
                        ]}
                        source={{
                          uri: item.url,
                        }}
                        useNativeControls={true}
                        resizeMode="contain"
                        shouldPlay={focusedCardIndex === index}
                        // onPlaybackStatusUpdate={status => setStatus(() => status)}
                      />
                    : item.type === 'image'
                    ?
                    <Image 
                      source={{uri: item.url}}
                      style={[
                        { width: imageWidth, height: imageWidth },
                        // imageAnimatedStyle
                      ]}
                      resizeMethod="auto"
                      resizeMode="contain"
                    />
                    : null
                  }
                </View>
              )
            }}
          />
        </Animated.View>
      </Animated.View>
      <PanGestureHandler onGestureEvent={onGestureEventBottomSheet}>
        <Animated.View style={[
          styles.bottomSheetContainer,
          bottomSheetAnimatedStyle,
        ]}>
            {renderBottomSheetHeader()}
            {renderComments()}
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  )
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  currentUserPhotoContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: RFValue(9),
    width: RFValue(60)
  },
  currentUserPhoto: {
    width: RFValue(30),
    height: RFValue(30),
    borderRadius: RFValue(30),
  },

  newCommentContainer: {
    backgroundColor: color.white2,
    flexDirection: 'row',
    height: RFValue(50),
    alignItems: 'center',
    width: "100%"
  },

  newCommentTextInputContainer: {
    flex: 1,
  },
  newCommentTextInput: {
    fontSize: RFValue(17),
    color: color.grey3,
    paddingLeft: RFValue(5)
  },

  newCommentButton: {
    width: RFValue(70),
    height: RFValue(45),
    paddingHorizontal: RFValue(15),
    paddingVertical: RFValue(5),
    // // borderWidth: 1,
    // borderRadius: RFValue(10),
    // // borderColor: color.red2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: RFValue(5)
  },
  newCommentButtonText: {
    color: color.red2,
    fontSize: RFValue(17)
  },

  bottomSheetContainer: {
    flex: 1, 
    justifyContent: 'flex-end', 
    backgroundColor: color.white2,
    borderTopRightRadius: 9,
    borderTopLeftRadius: 9
  },

  captionContainer: {
    paddingHorizontal: RFValue(10),
    paddingVertical: RFValue(15)
  },

  bottomSheetHeaderContainer: {
    backgroundColor: color.white2,
    height: RFValue(55),
    width: "100%", 
    borderTopLeftRadius: RFValue(9),
    borderTopRightRadius: RFValue(9),
  },
  bottomSheetHeaderInner: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomSheetHeaderTitleText: {
    fontSize: RFValue(19),
    color: color.black1,
    fontWeight: 'bold'
  },
  sliderIndicatorContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  sliderIndicator: {
    width: 50,
    height: 5,
    backgroundColor: color.grey1,
    borderRadius: 100
  },
  bottomSheetHeaderBottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: RFValue(15),
  },
  bottomSheetHeaderTitleContainer: {
    paddingLeft: RFValue(10),
    justifyContent: 'center',
  },
  bottomSheetHeaderCloseButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: RFValue(10),
    width: RFValue(35),
    height: RFValue(35),
    borderRadius: RFValue(35)
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: 'center',
  },
});

export default CommentScreen;
import React, { useState, useEffect, useContext, useCallback, useMemo, useRef } from 'react';
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
  Button,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Video, AVPlaybackStatus } from 'expo-av';

// npms
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
// Components
import MainTemplate from '../../components/MainTemplate';
import HeaderBottomLine from '../../components/HeaderBottomLine';
import { HeaderForm } from '../../components/HeaderForm';
import DefaultUserPhoto from '../../components/defaults/DefaultUserPhoto';
import CommentBar from '../../components/comment/CommentBar';
import SpinnerFromActivityIndicator from '../../components/ActivityIndicator';
// import SnailBottomSheet from '../../components/SnailBottomSheet';

// firebase
import commentGetFire from '../../firebase/comment/commentGetFire';
import commentPostFire from '../../firebase/comment/commentPostFire';
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
import expoIcons from '../../expoIcons';

const CommentScreen = ({ navigation, route }) => {
  /**
  * orientation responsive width and height
  */
  const [ windowWidth, setWindowWidth ] = useState(Dimensions.get("window").width);
  const [ windowHeight, setWindowHeight ] = useState(Dimensions.get("window").height);
  const [ imageWidth, setImageWidth ] = useState(Dimensions.get("window").width / 3);

  const orientation = useOrientation();

  useEffect(() => {
    setWindowWidth(Dimensions.get("window").width);
    setWindowHeight(Dimensions.get("window").height);
  }, [orientation]);

  const [ newComment, setNewComment ] = useState(null);
  const [ postCommentState, setPostCommentState ] = useState(false);

  const [ comments, setComments ] = useState([]);
  const [ commentLast, setCommentLast ] = useState(null);
  const [ commentFetchSwitch, setCommentFetchSwitch ] = useState(true);
  const [ commentFetchState, setCommentFetchState ] = useState(false);

  const [ isKeyboardVisible ] = useIsKeyboardVisible();

  const { postId, postFiles, commentCount, setCommentCountState } = route.params;

  const incrementCommentCount = () => {
    setCommentCountState(commentCount + 1);
  };
  const decrementCommentCount = () => {
    setCommentCountState(commentCount - 1);
  };

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
        const getComments = commentGetFire.getCommentsFire(postId);
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

      setNewComment(null);
      setPostCommentState(false);
    };
  }, []);

  // bottom sheet parts
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => 
    // [height-RFValue(95)-width-RFValue(55), height-RFValue(95)-RFValue(55)],
    ['75%'],
    []
  );
  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      navigation.goBack();
    } 
    // console.log('handleSheetChanges', index);
  }, []);

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
    >
      <View 
        style={styles.mainContainer}
      >
        <Pressable 
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'rgba(0, 0, 0, 0.5)', },
          ]}
          onPress={() => { navigation.goBack() }}
        >
          <SafeAreaView />
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <FlatList
              horizontal
              pagingEnabled={true}
              snapToInterval={windowWidth}
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
                  <TouchableWithoutFeedback 
                    onPress={() => navigation.navigate(
                      "ImageZoomin", 
                      {
                        file: postFiles[index]
                      }
                    )}
                  >
                    <View 
                      style={{width: imageWidth, height: imageWidth}}
                    >
                      { 
                        item.type === 'video'
                        ?
                        <View style={styles.cardVideoContainer}>
                          <Video
                            style={{ width: imageWidth, height: imageWidth }}
                            source={{
                              uri: item.url,
                            }}
                            useNativeControls={true}
                            resizeMode="contain"
                            // paused={!onFocus}
                            // onLoad={() => {
                            //   onFocus && currentFileIndex === index 
                            //   ? video.current.playAsync()
                            //   : video.current.pauseAsync()
                            // }}
                            // isLooping={true}
                            shouldPlay={onFocus && focusedCardIndex === index }
                            onPlaybackStatusUpdate={status => setStatus(() => status)}
                          />
                        </View>
                        : item.type === 'image'
                        ?
                        <Image 
                          source={{uri: item.url}}
                          style={{ width: imageWidth, height: imageWidth }}
                          resizeMethod="auto"
                          resizeMode="contain"
                        />
                        : null
                      }
                    </View>
                  </TouchableWithoutFeedback>
                )
              }}
            />
          </View>
        </Pressable>
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enablePanDownToClose={true}
          handleComponent={() => {
            return (
              <View 
                style={styles.bottomSheetHeaderContainer}
              >
                <View style={styles.bottomSheetHeaderTopContainer}>
                  <View style={styles.bottomSheetHeaderTitleContainer}>
                    <Text style={styles.bottomSheetHeaderTitleText}>Comments</Text>
                  </View>
                  <TouchableHighlight
                    style={styles.bottomSheetHeaderCloseButton}
                    underlayColor={color.grey4}
                    onPress={() => {
                      navigation.goBack();
                    }}
                  >
                    {expoIcons.antClose(RFValue(19), color.black1)}
                  </TouchableHighlight>
                </View>
              </View>
            )
          }}
        >
          <View 
            style={{ flex: 1, backgroundColor: color.white2 }} 
          >
            <BottomSheetFlatList
              onEndReached={() => {
                
              }}
              onEndReachedThreshold={0.1}
              contentInset={{
                // top: 0,
                // left: 0,
                // bottom: 0,
                // right: 0
              }}
              contentContainerStyle={{

              }}
              vertical
              showsVerticalScrollIndicator={false}
              decelerationRate={"fast"}
              data={comments}
              keyExtractor={(comment, index) => comment.id}
              renderItem={({ item: comment, index }) => {
                return (
                  <CommentBar
                    commentId={comment.id}
                    commentData={comment.data}
                    currentUserId={user.id}
                    postId={postId}
                    decrementCommentCount={decrementCommentCount}
                  />
                )
              }}
            />
            <View style={
                // isKeyboardVisible 
                // ? { ...styles.newCommentContainer, ...{ marginBottom: RFValue(65) }} 
                // // space between the keyboard and the input bar when the keyboard is visible
                // : styles.newCommentContainer
                styles.newCommentContainer
              }
            >
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
                    customSizeBorder={RFValue(38)}
                    customSizeUserIcon={RFValue(26)}
                  />
                }
              </View>
              <View style={styles.newCommentTextInputContainer}>
                <TextInput
                  style={styles.newCommentTextInput}
                  onChangeText={setNewComment}
                  value={newComment}
                  placeholder={"Start writing"}
                  autoComplete={false}
                  autoCorrect={false}
                />
              </View>
              <TouchableHighlight 
                style={styles.newCommentButton}
                underlayColor={color.grey4}
                onPress={() => {
                  setPostCommentState(true);
                  const newCommentLen = newComment.trim().length;
                  if (!postCommentState && newCommentLen > 0) {
                    const postComment = commentPostFire.postCommentFire(postId, user.id, newComment);
                    postComment
                    .then((newComment) => {
                      setComments([ newComment, ...comments ]);
                      setNewComment(null);
                      setPostCommentState(false);
                      incrementCommentCount();
                    })
                    .catch((error) => {
                      setPostCommentState(false);
                      // handle error
                    });
                  }
                  
                }}
              >
                <View style={styles.newCommentButtonTextContainer}>
                  { 
                    false
                    ?
                    <SpinnerFromActivityIndicator 
                      customSize={"small"}
                      customColor={color.red3}
                    />
                    :
                    <Text style={styles.newCommentButtonText}>Post</Text>
                  }
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </BottomSheet>
      </View>
    </KeyboardAvoidingView>
  )
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  currentUserPhotoContainer: {
    padding: RFValue(10),
    alignItems: 'center',
    width: RFValue(70)
  },
  currentUserPhoto: {
    width: RFValue(38),
    height: RFValue(38),
    borderRadius: RFValue(38),
  },

  newCommentContainer: {
    backgroundColor: color.white2,
    flexDirection: 'row',
    minHeight: RFValue(50),
    height: RFValue(50),
    alignItems: 'center',
  },

  newCommentTextInputContainer: {
    flex: 1
  },
  newCommentTextInput: {
    flex: 1,
    fontSize: RFValue(17),
    color: color.black1
  },

  newCommentButton: {
    width: RFValue(70),
    height: RFValue(45),
    paddingHorizontal: RFValue(15),
    paddingVertical: RFValue(5),
    borderWidth: 1,
    borderRadius: RFValue(10),
    borderColor: color.red2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: RFValue(5)
  },
  newCommentButtonText: {
    color: color.red2,
    fontSize: RFValue(17)
  },

  bottomSheetHeaderContainer: {
    height: RFValue(55),
    width: "100%", 
    justifyContent: 'center'
  },
  bottomSheetHeaderTopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  bottomSheetHeaderTitleContainer: {
    paddingLeft: RFValue(10),
    justifyContent: 'center',
  },
  bottomSheetHeaderTitleText: {
    fontSize: RFValue(19),
    color: color.black1,
    fontWeight: 'bold'
  },
  bottomSheetHeaderCloseButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: RFValue(10),
    width: RFValue(35),
    height: RFValue(35),
    borderRadius: RFValue(35)
  },
});

export default CommentScreen;
import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity,
  TouchableHighlight,
  KeyboardAvoidingView,
  Dimensions,
  Pressable,
  FlatList,
  TextInput,
  Image,
  Keyboard
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// npms
import BottomSheet from 'reanimated-bottom-sheet';

// Components
import MainTemplate from '../components/MainTemplate';
import HeaderBottomLine from '../components/HeaderBottomLine';
import { HeaderForm } from '../components/HeaderForm';
import DefaultUserPhoto from '../components/defaults/DefaultUserPhoto';
import CommentBar from '../components/comment/CommentBar';
import SpinnerFromActivityIndicator from '../components/ActivityIndicator';

// firebase
import commentGetFire from '../firebase/commentGetFire';
import commentPostFire from '../firebase/commentPostFire';
// Design

// contexts
import { Context as AuthContext } from '../context/AuthContext';

// Hooks
import count from '../hooks/count';

// color
import color from '../color';

// icon
import expoIcons from '../expoIcons';

const RenderContent = ({ 
  navigation, 
  contentHeight, 
  comments, 
  setComments,
  postId, 
  currentUserId,
  currentUserPhotoURL,
  newComment, 
  setNewComment,
  commentCount,
  isKeyboardVisible,
  postCommentState,
  setPostCommentState
}) => {
  return (
    <KeyboardAvoidingView 
      style={{ backgroundColor: color.white2, height: contentHeight }} 
      behavior={Platform.OS == "ios" ? "padding" : "height"}
    >
      <HeaderForm
        leftButtonTitle={
          commentCount
          ? `${commentCount} ${count.commentOrComments(commentCount)}`
          : null
        }
        leftButtonIcon={expoIcons.chevronBack(RFValue(27), color.black1)}
        leftButtonPress={() => {
          navigation.goBack();
        }}
      />
      <FlatList
        onEndReached={() => {
          
        }}
        onEndReachedThreshold={0.1}
        contentInset={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0
        }}
        contentContainerStyle={{
          paddingVertical: Platform.OS === 'android' ? 0 : 0
        }}
        vertical
        // pagingEnabled
        // stickyHeaderIndices={[0]}
        scrollEventThrottle={1000}
        showsVerticalScrollIndicator={false}
        // snapToInterval={cardHeight + CARD_MARGIN}
        decelerationRate={"fast"}
        snapToAlignment="center"
        data={comments}
        keyExtractor={(comment, index) => comment.id}
        // getItemLayout = {(data, index) => (
        //   {
        //     length: cardHeight + CARD_MARGIN,
        //     offset: ( cardHeight + CARD_MARGIN ) * index,
        //     index
        //   }
        // )}
        renderItem={({ item: comment, index }) => {
          return (
            <CommentBar
              commentId={comment.id}
              commentData={comment.data}
              currentUserId={currentUserId}
              postId={postId}
            />
          )
        }}
        // ListFooterComponent={
        //   // swipePostFetchSwitch === false
        //   // ? <PostEndSign />
        //   // : null
        // }
      />
      <View style={
          isKeyboardVisible 
          ? { ...styles.newCommentContainer, ...{ marginBottom: RFValue(65) }} 
          // space between the keyboard and the input bar when the keyboard is visible
          : styles.newCommentContainer
        }
      >
        <View style={styles.currentUserPhotoContainer}>
          { 
            currentUserPhotoURL
            ?
            <Image 
              style={styles.currentUserPhoto} 
              source={{ uri: currentUserPhotoURL }} 
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
          />
        </View>
        <TouchableHighlight 
          style={styles.newCommentButton}
          underlayColor={color.grey4}
          onPress={() => {
            setPostCommentState(true);
            const newCommentLen = newComment.trim().length;
            if (!postCommentState && newCommentLen > 0) {
              const postComment = commentPostFire.postCommentFire(postId, currentUserId, newComment);
              postComment
              .then((newComment) => {
                setComments([ newComment, ...comments ]);
                setNewComment(null);
                setPostCommentState(false);
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
    </KeyboardAvoidingView>
  )
};

const CommentScreen = ({ navigation, route }) => {
  const sheetRef = useRef(null);
  const [ bottomSheetHeight, setBottomSheetHeight ] = useState(Dimensions.get("window").height - RFValue(130));
  const [ windowWidth, setWindowWidth ] = useState(Dimensions.get("window").width);
  const [ windowHeight, setWindowHeight ] = useState(Dimensions.get("window").height);

  const [ newComment, setNewComment ] = useState(null);
  const [ postCommentState, setPostCommentState ] = useState(false);

  const [ comments, setComments ] = useState([]);
  const [ commentLast, setCommentLast ] = useState(null);
  const [ commentFetchSwitch, setCommentFetchSwitch ] = useState(true);
  const [ commentFetchState, setCommentFetchState ] = useState(false);

  const [ isKeyboardVisible, setIsKeyboardVisible ] = useState(false);

  const { postId, commentCount } = route.params;

  const { 
    state: {
      user
    }
  } = useContext(AuthContext);

  // listen keyboard open close
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = () => {
    setIsKeyboardVisible(true);
  };

  const _keyboardDidHide = () => {
    setIsKeyboardVisible(false);
  };

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

  return (
    <View style={{ flex: 1 }}>
      <View 
        style={styles.mainContainer}
      >
        <Pressable 
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
          ]}
          onPress={() => { navigation.goBack() }}
        >
        </Pressable>
        <BottomSheet
          ref={sheetRef}
          snapPoints={[bottomSheetHeight, 0, 0]}
          borderRadius={RFValue(10)}
          renderContent={() => {
            return (
              <RenderContent
                navigation={navigation}
                contentHeight={bottomSheetHeight}
                comments={comments}
                setComments={setComments}
                postId={postId}
                currentUserId={user.id}
                currentUserPhotoURL={user.photoURL}
                newComment={newComment}
                setNewComment={setNewComment}
                commentCount={commentCount}
                isKeyboardVisible={isKeyboardVisible}
                postCommentState={postCommentState}
                setPostCommentState={setPostCommentState}
              />
            )
          }}
          initialSnap={0}
          // allow onPress inside bottom sheet
          enabledContentTapInteraction={false}
          enabledBottomClamp={true}
          onCloseEnd={() => {
            navigation.goBack();
          }}
        />
      </View>
    </View>
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
    flexDirection: 'row',
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
});

export default CommentScreen;
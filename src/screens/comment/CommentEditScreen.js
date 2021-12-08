import React, { useState, useEffect, useContext } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity,
  TouchableHighlight,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TextInput,
  Image,
  Keyboard
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// npms
import BottomSheet from 'reanimated-bottom-sheet';

// Components
import HeaderBottomLine from '../../components/HeaderBottomLine';
import { HeaderForm } from '../../components/HeaderForm';
import DefaultUserPhoto from '../../components/defaults/DefaultUserPhoto';
import SpinnerFromActivityIndicator from '../../components/ActivityIndicator';

// firebase
import commentGetFire from '../../firebase/commentGetFire';
import commentPostFire from '../../firebase/commentPostFire';
// Design

// contexts
import { Context as AuthContext } from '../../context/AuthContext';

// Hooks
import count from '../../hooks/count';
import useIsKeyboardVisible from '../../hooks/useIsKeyboardVisible';
import { timeDifference } from '../../hooks/timeDifference';

// color
import color from '../../color';

// icon
import expoIcons from '../../expoIcons';


const CommentEditScreen = ({ navigation, route }) => {
	const { postId, commentId, commentData, commentUser, currentUserId } = route.params;

	const [ isKeyboardVisible ] = useIsKeyboardVisible();

	const [ editedComment, setEditedComment ] = useState(commentData.comment);

	const [ editCommentState, setEditCommentState ] = useState(false);

	return (
		<KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: color.white2 }} 
      behavior={Platform.OS == "ios" ? "padding" : "height"}
    >
      <HeaderForm
      	addPaddingTop={true}
        leftButtonIcon={"Cancel"}
        leftButtonPress={() => {
          navigation.goBack();
        }}
        headerTitle={
        	editCommentState 
        	? 
        	<SpinnerFromActivityIndicator 
        		customSize={"small"}
        	/> 
        	: "Edit"
        }
        rightButtonIcon={"Done"}
        rightButtonPress={() => {
        	if (!editCommentState) {
        		setEditCommentState(true);
        		const editComment = commentPostFire.editCommentFire(postId, commentId, editedComment);
	        	editComment
	        	.then(() => {
	        		setEditCommentState(false);
	        		navigation.navigate("Comment", {
		          	postId: postId
		          });
	        	})
	        	.catch((error) => {
	        		setEditCommentState(false);
	        		// handle error
	        	});
        	}
        }}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      	<View style={styles.inner}>
		    	<View style={styles.commentBar}>
		        <View style={styles.userPhotoContainer}>
		          { 
		            commentUser && commentUser.photoURL
		            ?
		            <Image 
		              style={styles.userPhoto} 
		              source={{ uri: commentUser.photoURL }} 
		            />
		            :
		            <DefaultUserPhoto 
		              customSizeBorder={RFValue(38)}
		              customSizeUserIcon={RFValue(26)}
		            />
		          }
		        </View>
		        <View style={styles.commentContainer}>
		          <View style={styles.commentBarHeader}>
		            { 
		              commentUser && commentUser.username
		              ? <Text style={styles.headerText}>{commentUser.username} {expoIcons.entypoDot(RFValue(15), color.grey1)} {timeDifference(Date.now(), commentData.createdAt)}</Text>
		              : null
		            }
		          </View>
		          <TextInput 
		          	style={styles.editTextInput}
				        onChangeText={setEditedComment}
				        value={editedComment}
				        multiline={true}
				        autoComplete={false}
				        autoCorrect={false}
				        autoFocus={true}
		          />
		        </View>
		      </View>
		      <HeaderBottomLine />
		    </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
	)
};

const styles = StyleSheet.create({
	inner: {
		flex: 1,
	},
	commentBar: {
    flexDirection: 'row',
    backgroundColor: color.white2,
    paddingVertical: RFValue(7),
  },

  commentContainer: {
    flex: 1,
    paddingVertical: RFValue(3),
    paddingRight: RFValue(7)
  },

  commentBarHeader: {
    paddingVertical: RFValue(5),
    justifyContent: 'center'
  },
  headerText: {
    color: color.grey3,
    fontSize: RFValue(15)
  },

  actionIconContainer: {
    justifyContent: 'center',
    width: RFValue(70),
    alignItems: 'center'
  },

  commentActionBar: {
    paddingVertical: RFValue(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

  editTextInput: {
  	justifyContent: 'center',
    fontSize: RFValue(17),
    color: color.black1
  }
});

export default CommentEditScreen;
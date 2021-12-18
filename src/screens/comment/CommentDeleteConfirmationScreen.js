// note

import React, { useState, useRef } from 'react';
import { 
	Text, 
	View,  
	StyleSheet,
	TouchableOpacity,
	TouchableHighlight,
	Pressable,
  ScrollView,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import BottomSheet from 'reanimated-bottom-sheet';

// Components
import MainTemplate from '../../components/MainTemplate';
import HeaderBottomLine from '../../components/HeaderBottomLine';
import DeleteConfirmation from '../../components/DeleteConfirmation';

// firebase
import commentDeleteFire from '../../firebase/comment/commentDeleteFire';

// Designs
import { Feather } from '@expo/vector-icons';

// Color
import color from '../../color';

// hooks

// icon
import expoIcons from '../../expoIcons';

const CommentDeleteConfirmationScreen = ({ route, navigation }) => {
	const { 
    headerText, 
    messageText, 
    postId, 
    commentId, 
    deleteCurrentCommentState, 
    decrementCommentCount 
  } = route.params;

	return (
		<View 
			style={{ flex: 1 }}
		>
		  <DeleteConfirmation
        headerText={headerText}
        messageText={messageText}
        deleteAction={() => {
          const deleteComment = commentDeleteFire.deleteCommentFire(postId, commentId);
          deleteComment
          .then(() => { 
            deleteCurrentCommentState(); 
            decrementCommentCount();
            navigation.goBack();
          })
          .catch((error) => {
            console.log(error);
          });
        }}
      />	
		</View>
	);
};

const styles = StyleSheet.create({

});

export default CommentDeleteConfirmationScreen;
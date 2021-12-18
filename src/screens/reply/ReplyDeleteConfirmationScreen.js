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
import replyDeleteFire from '../../firebase/reply/replyDeleteFire';

// Designs
import { Feather } from '@expo/vector-icons';

// Color
import color from '../../color';

// hooks

// icon
import expoIcons from '../../expoIcons';

const ReplyDeleteConfirmationScreen = ({ route, navigation }) => {
	const { 
    headerText, 
    messageText, 
    postId, 
    commentId, 
    replyId,
    setCurrentReplyData, 
    decrementReplyCount 
  } = route.params;

	return (
		<View 
			style={{ flex: 1 }}
		>
		  <DeleteConfirmation
        headerText={headerText}
        messageText={messageText}
        deleteAction={() => {
          const deleteReply = replyDeleteFire.deleteReplyFire(postId, commentId, replyId);
          deleteReply
          .then(() => { 
            setCurrentReplyData(null); 
            decrementReplyCount();
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

export default ReplyDeleteConfirmationScreen;
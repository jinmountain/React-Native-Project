import React, { useContext, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Image,
  ScrollView,
  StyleSheet,  
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  Animated,
  Platform,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Hooks
import { useOrientation } from '../../hooks/useOrientation';

// Contexts

// Components
import { HeaderForm } from '../HeaderForm';
import VerticalSwipePostImage from './VerticalSwipePostImage';
import PostInfoBox from './PostInfoBox';
import PostBusinessUserInfoContainer from './PostBusinessUserInfoContainer';
import PostUserInfoContainer from './PostUserInfoContainer';
import LikeCommentButtonLine from './LikeCommentButtonLine';
import PostLikeCommentTimeInfo from './PostLikeCommentTimeInfo';

// Hooks
import { wait } from '../../hooks/wait';
import { isCloseToBottom } from '../../hooks/isCloseToBottom';
import { useNavigation } from '@react-navigation/native';

const PostCard = ({ 
	post,
	currentUserId,
	currentUserPhotoURL,
	isCardFocused,

  cardHeight,
  cardWidth,
  cardMargin,

  cardIndex,
  // setShowCommentPostIndex
}) => {
  const [ postState, setPostState ] = useState(post);
  const deletePostState = () => {
    setPostState(null);
  };

	const navigation = useNavigation();

  const [ expandInfoBox, setExpandInfoBox ] = useState(false);
	return (
    postState &&
		<View
      style={
        expandInfoBox
        ?
        { 
          ...styles.card, 
          ...{ width: cardWidth, marginBottom: cardMargin } 
        }
        :
        { 
          ...styles.card, 
          ...{ height: cardHeight, width: cardWidth, marginBottom: cardMargin } 
        }
      }
    >
      <PostUserInfoContainer
    		postId={postState.id}
    		postData={postState.data}
    		currentUserId={currentUserId}
        postTimestamp={postState.data.createdAt}
        deletePostState={deletePostState}
    	/>
      <VerticalSwipePostImage
        files={postState.data.files}
        onFocus={isCardFocused}
        isDisplay={postState.data.display}
        displayPrice={postState.data.price}
        displayEtc={postState.data.etc}
        cardWidth={cardWidth}
      />
      <PostInfoBox
        tags={postState.data.tags}
        totalRating={postState.data.totalRating}
        countRating={postState.data.countRating}
        caption={postState.data.caption}
        defaultCaptionNumLines={1}
        postId={postState.id}
        postUserId={postState.data.uid}
        likeCount={postState.data.likeCount}
        commentCount={postState.data.commentCount}
        postTimestamp={postState.data.createdAt}
        currentUserPhotoURL={currentUserPhotoURL}
        currentUserId={currentUserId}
        expandInfoBox={expandInfoBox}
        setExpandInfoBox={setExpandInfoBox}
        cardIndex={cardIndex}
        postFiles={postState.data.files}
        // setShowCommentPostIndex={setShowCommentPostIndex}
      />
    </View>
  )
};

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
	},
	card: {
		flex: 1,
    elevation: 5, // for android
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { 
    	width: 0,
			height: 2, 
		},
  },
});
export default PostCard;
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
  Platform,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  useDerivedValue,
  withDecay,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { clamp, withBouncing } from "react-native-redash";

// Hooks
import { useOrientation } from '../../hooks/useOrientation';

// Contexts

// Components
import { HeaderForm } from '../HeaderForm';
import PostImageForm from './PostImageForm';
import PostInfoBox from './PostInfoBox';
import PostBusinessUserInfoContainer from './PostBusinessUserInfoContainer';
import PostUserInfoContainer from './PostUserInfoContainer';
import LikeCommentButtonLine from './LikeCommentButtonLine';

// Hooks
import { wait } from '../../hooks/wait';
import { isCloseToBottom } from '../../hooks/isCloseToBottom';
import { useNavigation } from '@react-navigation/native';

const PostCard = ({ 
	post,
	currentUserId,
	currentUserPhotoURL,
	isCardFocused,

  cardWidth,
  cardMargin,

  cardIndex,
}) => {
  const [ postState, setPostState ] = useState(post);
  const deletePostState = () => {
    setPostState(null);
  };

	const navigation = useNavigation();

  const [ expandInfoBox, setExpandInfoBox ] = useState(false);

  const [ commentCountState, setCommentCountState ] = useState(postState.data.commentCount);
  const incrementCommentCount = () => {
    setCommentCountState(commentCountState + 1);
  };
  const decrementCommentCount = () => {
    setCommentCountState(commentCountState - 1);
  };

	return (
    postState &&
		<View
      style={[
        styles.card, 
        { width: cardWidth, marginBottom: cardMargin }
      ]}
    >
      <PostUserInfoContainer
    		postId={postState.id}
    		postData={postState.data}
    		currentUserId={currentUserId}
        postTimestamp={postState.data.createdAt}
        deletePostState={deletePostState}
    	/>
      <PostImageForm
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
        commentCount={commentCountState}
        incrementCommentCount
        decrementCommentCount
        postTimestamp={postState.data.createdAt}
        currentUserPhotoURL={currentUserPhotoURL}
        currentUserId={currentUserId}
        expandInfoBox={expandInfoBox}
        setExpandInfoBox={setExpandInfoBox}
        cardIndex={cardIndex}
        postFiles={postState.data.files}
        postTitle={postState.data.title}
        postPrice={postState.data.price}
        postEtc={postState.data.etc}
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
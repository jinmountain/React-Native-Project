import React, { useEffect, useState, useRef } from 'react';
import { 
  Text, 
  StyleSheet,  
  TouchableOpacity,
  Dimensions,
  FlatList,
  Platform,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Hooks
import { useOrientation } from '../../hooks/useOrientation';
import { useIsFocused } from '@react-navigation/native';

// Contexts

// Components
import PostCard from './PostCard';
import { HeaderForm } from '../HeaderForm';
import PostEndSign from '../PostEndSign';

// Hooks
import { wait } from '../../hooks/wait';

const { width, height } = Dimensions.get("window");

// post user info box + image height + like comment button line + tag line
const CARD_HEIGHT = RFValue(55) + width + RFValue(40) + RFValue(50);
const CARD_WIDTH = width;
const CARD_MARGIN = height * 0.03;
const POST_INFO_BOX_HEIGHT = CARD_HEIGHT * 0.9 - CARD_WIDTH;
const USER_INFO_HEADER_HEIGHT = CARD_HEIGHT * 0.1;

const PostCardsVerticalSwipe = ({ 
	postSource,
	cardIndex,
	getPosts,
	swipePosts, 
	swipePostFetchSwitch,
	swipePostLast,
	swipePostState,

	setSwipePosts,
  setSwipePostLast,
  setSwipePostFetchSwtich,
  setSwipePostState,

	currentUser,
	// two parameters below are used for setting right getPosts
	accountUserId,
	businessUserId
}) => {
	const isFocused = useIsFocused();
	const _cardListView = useRef(null);

 	// Video auto play 
 	// currnet focused card index
  const [focusedCardIndex, setFocusedCardIndex] = useState(0)

	const viewabilityConfig = useRef({
	  itemVisiblePercentThreshold: 50,
	  waitForInteraction: true,
	  minimumViewTime: 1000, // stay at least 1 second
	})

	const onViewableItemsChanged = useRef(({ viewableItems, changed }) => {
	  if (changed && changed.length > 0) {
	    setFocusedCardIndex(changed[0].index);
	    // console.log("changed focused card index to: ", changed[0].index);
	    // console.log("Visible items are", viewableItems);
    	// console.log("Changed in this iteration", changed);
	  }
	});

	// // move flatlist to the card with showCommentPostIndex
	// const [ showCommentPostIndex, setShowCommentPostIndex ] = useState(null); 
	// const scrollToIndex = (index) => {
 //    _cardListView.current.scrollToIndex({ animated: true, index: index })
 //  }
 //  // setTimeout prevents out of range error of scrollToIndex
	// useEffect(() => {
	// 	if (showCommentPostIndex) {
	// 		const scrollToIndexPromise = new Promise ((res, rej) => {
	// 			setTimeout(() => scrollToIndex(showCommentPostIndex), 500);
	// 			res();
	// 		})
	// 		scrollToIndexPromise
	// 		.then(() => {
	// 			setShowCommentPostIndex(null);
	// 		});
	// 	}
	// }, [showCommentPostIndex]);

	return (
		<FlatList
	    ref={_cardListView}
	    initialScrollIndex={cardIndex}
	    onViewableItemsChanged={onViewableItemsChanged.current}
      viewabilityConfig={viewabilityConfig.current}
	    onEndReached={() => {
				if (swipePostFetchSwitch && !swipePostState) {
					isFocused && setSwipePostState(true);
					let getSwipePosts;
					postSource === 'hot'
          ? getSwipePosts = getPosts(swipePostLast)
          : postSource === 'account'
          ? getSwipePosts = getPosts(swipePostLast, accountUserId)
          : postSource === 'accountDisplay'
          ? getSwipePosts = getPosts(swipePostLast, accountUserId)
          // business tagged posts (ex. serach screen reviews)
          : postSource === 'businessTagged'
          ? getSwipePosts = getPosts(swipePostLast, businessUserId)
          : null

          getSwipePosts
					.then((posts) => {
						isFocused && setSwipePosts([ ...swipePosts, ...posts.fetchedPosts ]);
						// make new spots with 0 in postCardsLayout
						if (posts.lastPost !== undefined) {
							isFocused && setSwipePostLast(posts.lastPost);
						} else {
							isFocused && setSwipePostFetchSwtich(false);
						};
						isFocused && setSwipePostState(false);
					});
				}
			}}
			onEndReachedThreshold={0.1}
			contentInset={{
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      }}
      contentContainerStyle={{
      	backgroundColor: "white",
        paddingVertical: Platform.OS === 'android' ? 0 : 0
      }}
	    vertical
	    showsVerticalScrollIndicator={false}
	    data={swipePosts}
	    keyExtractor={(post, index) => index.toString()}
	    getItemLayout = {(data, index) => (
	      {
	        length: CARD_HEIGHT + CARD_MARGIN,
	        offset: ( CARD_HEIGHT + CARD_MARGIN ) * index,
	        index
	      }
	    )}
	    renderItem={({ item: post, index }) => {
				return (
					<PostCard 
						post={post}
						postId={ post.id }
						postData={ post.data }
						currentUserId={ currentUser.id }
						files={post.data.files}
						tags={post.data.tags}
						totalRating={post.data.totalRating}
						countRating={post.data.countRating}
						caption={post.data.caption}
						defaultCaptionNumLines={1}
						postUserId={post.data.uid}
						likeCount={post.data.likeCount}
						postTimestamp={post.data.createdAt}
						currentUserPhotoURL={currentUser.photoURL}
						isCardFocused={focusedCardIndex === index}
						CARD_HEIGHT={CARD_HEIGHT}
						CARD_WIDTH={CARD_WIDTH}
						CARD_MARGIN={CARD_MARGIN}
						cardIndex={index}
						// setShowCommentPostIndex={setShowCommentPostIndex}
					/>
			  )
			}}
			ListFooterComponent={
				swipePostFetchSwitch === false
				? <PostEndSign />
				: null
			}
	  />
	)
};

const styles = StyleSheet.create({

});

export default PostCardsVerticalSwipe;
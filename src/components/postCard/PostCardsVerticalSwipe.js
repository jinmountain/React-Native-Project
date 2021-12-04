import React, { useEffect, useState, useRef } from 'react';
import { 
  Text, 
  StyleSheet,  
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
  Platform,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Hooks
import { useOrientation } from '../../hooks/useOrientation';

// Contexts

// Components
import PostCard from './PostCard';
import { HeaderForm } from '../HeaderForm';
import PostEndSign from '../PostEndSign';

// Hooks
import { wait } from '../../hooks/wait';

const { width, height } = Dimensions.get("window");

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
	const _cardListView = useRef(null);

  // useEffect(() => {
  // 	let isMounted = true;
  //   const postScrollAnimListener = postCardVerticalSwipeAnim.addListener(({ value }) => {
  //   	if (value) {
  //   		const getIndex = new Promise((res, rej) => {
  //   		});
  //   		getIndex
  //   		.then((index) => {
  //   			isMounted && setCurrentFocusedCardIndex(index);
  //   		});
  //   	};
  //   });

  //   return () => {
  //   	isMounted = false;
  //   	postCardVerticalSwipeAnim.removeListener(postScrollAnimListener);
  //   	// console.log("removed postScrollAnimListener");
  //   }
  // });

  // when get new posts data scroll to top
  useEffect(() => {
  	_cardListView.current.scrollToOffset(0);
  }, [postSource, cardIndex]);

 	// Video auto play 
 	// currnet focused card index
  const [focusedCardIndex, setFocusedCardIndex] = useState(0)

	const viewabilityConfig = useRef({
	  itemVisiblePercentThreshold: 50,
	  waitForInteraction: true,
	  minimumViewTime: 1000, // stay at least 1 second
	})

	const onViewableItemsChanged = React.useRef(({ viewableItems, changed }) => {
	  if (changed && changed.length > 0) {
	    setFocusedCardIndex(changed[0].index);
	    // console.log("changed focused card index to: ", changed[0].index);
	    // console.log("Visible items are", viewableItems);
    	// console.log("Changed in this iteration", changed);
	  }
	});

	return (
		<Animated.FlatList
	    ref={_cardListView}
	    onViewableItemsChanged={onViewableItemsChanged.current}
      viewabilityConfig={viewabilityConfig.current}
	    onEndReached={() => {
				if (swipePostFetchSwitch && !swipePostState) {
					isFocused && setSwipePostState(true);
					let getSwipePosts;
					postSource === 'hot'
          ? getSwipePosts = getPosts(swipePostLast, currentUser.id)
          : postSource === 'account'
          ? getSwipePosts = getPosts(swipePostLast, currentUser.id, currentUser.id)
          : postSource === 'accountDisplay'
          ? getSwipePosts = getPosts(swipePostLast, currentUser.id, currentUser.id)
          // business user posts (ex. search screen)
          : postSource === 'businessUser'
          ? getSwipePosts = getPosts(swipePostLast, businessUserId, currentUser.id)
          // business tagged posts (ex. serach screen reviews)
          : postSource === 'businessTagged'
          ? getSwipePosts = getPosts(swipePostLast, businessUserId, currentUser.id)
          : postSource === 'userAccount'
          ? getSwipePosts = getPosts(swipePostLast, accountUserId, currentUser.id)
          : postSource === 'userAccountDisplay'
          ? getSwipePosts = getPosts(swipePostLast, accountUserId, currentUser.id)
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
			onEndReachedThreshold={0.01}
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
	    style={styles.scrollView}
	    data={swipePosts.slice(cardIndex)}
	    keyExtractor={(post, index) => index.toString()}
	    // getItemLayout = {(data, index) => (
	    //   {
	    //     length: cardHeight + CARD_MARGIN,
	    //     offset: ( cardHeight + CARD_MARGIN ) * index,
	    //     index
	    //   }
	    // )}
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
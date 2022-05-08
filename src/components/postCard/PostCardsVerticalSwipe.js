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

	// -- screen orientation and reponsive state change
		const { width, height } = Dimensions.get("window");
		// post user info box + image height + like comment button line + tag line
		// const CARD_HEIGHT = RFValue(55) + width + RFValue(40) + RFValue(50);
		const CARD_WIDTH = width;
		const CARD_MARGIN = height * 0.03;

		// -- states
		// const [ cardHeight, setCardHeight ] = useState(CARD_HEIGHT);
		const [ cardWidth, setCardWidth ] = useState(CARD_WIDTH);
		const [ cardMargin, setCardMargin ] = useState(CARD_MARGIN);
		
		// -- screen orientation and reponsive state change
		const orientation = useOrientation();
	  useEffect(() => {
	  	console.log("orientation: ", orientation);
	    // if (orientation === 'LANDSCAPE') {

	    // }
	    // if (orientation === 'PORTRAIT') {
	    	const newCardWidth = width;
	    	setCardWidth(newCardWidth);
	    	console.log("newCardWidth: ", newCardWidth);
	    	const newCardMargin = height * 0.03
	    	setCardMargin(newCardMargin);
	    // }
	  }, [orientation]);

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

	useEffect(() => {
		const wait = new Promise(resolve => setTimeout(resolve, 100));
    wait.then(() => {
      _cardListView.current.scrollToIndex({ index: cardIndex, animated: false });
    });
	}, []);

	return (
		<FlatList
	    ref={_cardListView}
	    // initialScrollIndex={cardIndex}
	    onScrollToIndexFailed={info => {
		    const wait = new Promise(resolve => setTimeout(resolve, 100));
		    wait.then(() => {
		      _cardListView.current.scrollToIndex({ index: cardIndex, animated: false });
		    });
		  }}
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
	    // getItemLayout = {
	    // 	(data, index) => (
		   //    {
		   //      length: cardHeight + cardMargin,
		   //      offset: ( cardHeight + cardMargin ) * index,
		   //      index
		   //    }
		   //  )
	    // }
	    renderItem={({ item: post, index }) => {
				return (
					<PostCard 
						post={post}
						currentUserId={currentUser.id}
						currentUserPhotoURL={currentUser.photoURL}
						isCardFocused={focusedCardIndex === index}
						cardWidth={cardWidth}
						cardMargin={cardMargin}
						cardIndex={index}
					/>
			  )
			}}
			ListFooterComponent={
				swipePostFetchSwitch === false
				? <PostEndSign />
				: null
			}
			initialNumToRender={3}
	  />
	)
};

const styles = StyleSheet.create({

});

export default PostCardsVerticalSwipe;
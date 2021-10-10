import React, { useContext, useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  Image,
  ScrollView,
  StyleSheet,  
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView, } from 'react-native-safe-area-context';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Hooks
import { colorByRating } from '../../hooks/colorByRating';
// import getImageSizeByURL from '../hooks/getImageSizeByURL;' 
import { useOrientation } from '../../hooks/useOrientation';

// Contexts
import { Context as AuthContext } from '../../context/AuthContext';

// Components
import { HeaderForm } from '../HeaderForm';
import { RatingReadOnly } from '../RatingReadOnly';
import VerticalSwipePostImage from './VerticalSwipePostImage';
import PostInfoBox from './PostInfoBox';
import PostBusinessUserInfoContainer from './PostBusinessUserInfoContainer';
import PostUserInfoContainer from './PostUserInfoContainer';
import PostEndSign from '../PostEndSign';
import LikeCommentButtonLine from './LikeCommentButtonLine';
import PostLikeCommentTimeInfo from './PostLikeCommentTimeInfo';

// Hooks
import { wait } from '../../hooks/wait';
import { isCloseToBottom } from '../../hooks/isCloseToBottom';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get("window");
const cardHeight = height * 0.77;
const cardMargin = height * 0.03;
const cardWidth = width;
const infoBoxHeight = cardHeight * 0.9 - width;
// account post has user info line => cardheight * 0.9
const PostInfoBoxHeight = cardHeight * 0.9 - cardWidth;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const PostCard = ({ 
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
	businessUser,
	targetUser
}) => {
	// const orientation = useOrientation();
	// const [ windowWidth, setWindowWidth ] = useState(Dimensions.get("window").width);
 //  const [ windowHeight, setWindowHeight ] = useState(Dimensions.get("window").height);
 //  const [ threePostsRowImageWH, setThreePostsRowImageWH ] = useState(Dimensions.get("window").width/3-2);

 //  const [ cardHeight, setCardHeight ] = useState( orientation === 'LANDSCAPE' ? Dimensions.get("window").width * 0.77 : Dimensions.get("window").height * 0.77 );
 //  const [ cardMargin, setCardMargin ] = useState( orientation === 'LANDSCAPE' ? Dimensions.get("window").width * 0.03 : Dimensions.get("window").height * 0.03 );
 //  const [ cardWidth, setCardWidth ] = useState( Dimensions.get("window").width );
 //  const [ infoBoxHeight, setInfoBoxHeight ] = useState( 
 //  	orientation === 'LANDSCAPE' 
 //  	? (Dimensions.get("window").width * 0.77) * 0.9 - Dimensions.get("window").width
 //  	: (Dimensions.get("window").height * 0.77) * 0.9 - Dimensions.get("window").width 
 //  );

 //  useEffect(() => {
 //    setThreePostsRowImageWH(Dimensions.get("window").width/3-2);
 //    setWindowWidth(Dimensions.get("window").width);
 //    setWindowHeight(Dimensions.get("window").height);

 //    if (orientation === 'LANDSCAPE') {
 //    	setCardHeight(Dimensions.get("window").width * 0.77);
 //    	setCardMargin(Dimensions.get("window").width * 0.03);
 //    	setInfoBoxHeight( (Dimensions.get("window").width * 0.77) * 0.9 - Dimensions.get("window").width );
 //    }
 //    if (orientation === 'PORTRAIT') {
 //    	setCardHeight(Dimensions.get("window").height * 0.77);
 //    	setCardMargin(Dimensions.get("window").height * 0.03);
 //    	setInfoBoxHeight( (Dimensions.get("window").height * 0.77) * 0.9 - Dimensions.get("window").width );
 //    }

 //    setCardWidth(Dimensions.get("window").width);
 //  }, [orientation]);

	const navigation = useNavigation();
	const postLength = swipePosts.length;
	const _cardListView = useRef(null);
	console.log("postFetchSwitch: ", swipePostFetchSwitch);

  const [ currentPostIndex, setCurrentPostIndex ] = useState(0);

  // Video auto play 
  let postIndex = 0;
  let postAnimation = new Animated.Value(0);
	// let currentPostIndex = 0;
  useEffect(() => {
    const postScrollAnimListener = postAnimation.addListener(({ value }) => {
    	if (value) {
    		const getIndex = new Promise((res, rej) => {
    			console.log("PostsSwipe: PostCard: listener value: ", value, "cardHeight + cardMargin: ", cardHeight + cardMargin, "cardHeight: ", cardHeight);
		      let index = Math.floor((value + (cardHeight + cardMargin)) / ( cardHeight + cardMargin )) - 1; 
		      console.log("current card index: ", index);
		      // animate 30% away from landing on the next item
		      if (index >= postLength) {
		        index = postLength - 1;
		      };
		      if (index <= 0) {
		        index = 0;
		      };
		      res(index);
    		});
    		getIndex
    		.then((index) => {
    			setCurrentPostIndex(index);
    		});
    	};
    });

    return () => {
    	postAnimation.removeListener(postScrollAnimListener);
    	console.log("removed postScrollAnimListener");
    }
  });

  // when get new posts data scroll to top
  useEffect(() => {
  	_cardListView.current.scrollToOffset(0);
  }, [postSource, cardIndex])

  // const [videoPlay, setVideoPlay] = useState(new Array(postLength.fill(0)));
	return (
		<Animated.FlatList
	    ref={_cardListView}
	    onEndReached={() => {
				if (swipePostFetchSwitch && !swipePostState) {
					let getSwipePosts;
					postSource === 'hot'
          ? getSwipePosts = getPosts(swipePostLast, currentUser.id)
          : postSource === 'account'
          ? getSwipePosts = getPosts(swipePostLast, currentUser, currentUser.id)
          : postSource === 'accountDisplay'
          ? getSwipePosts = getPosts(swipePostLast, currentUser, currentUser.id)
          // business user posts (ex. search screen)
          : postSource === 'businessUser'
          ? getSwipePosts = getPosts(swipePostLast, businessUser, currentUser.id)
          // business tagged posts (ex. serach screen reviews)
          : postSource === 'businessTagged'
          ? getSwipePosts = getPosts(swipePostLast, businessUser.id, currentUser.id)
          : postSource === 'userAccount'
          ? getSwipePosts = getPosts(swipePostLast, targetUser, currentUser.id)
          : postSource === 'userAccountDisplay'
          ? getSwipePosts = getPosts(swipePostLast, targetUser, currentUser.id)
          : null

          getSwipePosts
					.then((posts) => {
						setSwipePosts([ ...swipePosts, ...posts.fetchedPosts ]);
						if (posts.lastPost !== undefined) {
							setSwipePostLast(posts.lastPost);
						} else {
							setSwipePostFetchSwtich(false);
						};
						setSwipePostState(false);
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
	    // snapToInterval={cardHeight + cardMargin}
	    decelerationRate={"fast"}
	    snapToAlignment="center"
	    style={styles.scrollView}
	    data={swipePosts.slice(cardIndex)}
	    keyExtractor={(post, index) => index.toString()}
	    getItemLayout = {(data, index) => (
	      {
	        length: cardHeight + cardMargin,
	        offset: ( cardHeight + cardMargin ) * index,
	        index
	      }
	    )}
	    renderItem={({ item: post, index }) => {
				return (
					<View
			      style={{ ...styles.card, ...{ height: cardHeight, width: cardWidth, marginBottom: cardMargin } }}
			    >
			      <PostUserInfoContainer
			      	postSource={ postSource }
		      		postUser={ post.user }
		      		postId={ post.id }
		      		postData={ post.data }
		      		currentUserId={ currentUser.id }
		      	/>
			      <VerticalSwipePostImage
			        files={post.data.files}
			        onFocus={currentPostIndex === index ? true : false}
			      />
			      <PostInfoBox
			        tags={post.data.tags}
			        totalRating={post.data.totalRating}
			        countRating={post.data.countRating}
			        caption={post.data.caption}
			        defaultCaptionNumLines={1}
			        rootScreen={postSource}
			        navigateToPostDetail={() => {
			        	navigation.navigate('PostDetail', {
              		post: post,
              		postSource: postSource
              	});
			        }}
			        height={infoBoxHeight}
			        youLike={post.like}
			        postId={post.id}
			        uid={post.data.uid}
			        likeCount={post.data.likeCount}
			        postTimestamp={post.data.createdAt}
			      />
			    </View>
			  )
			}}
			ListFooterComponent={
				swipePostFetchSwitch === false
				? <PostEndSign />
				: null
			}
			onScroll={
				Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: {
                y: postAnimation,
              }
            },
          },
        ],
        {useNativeDriver: true})
			}
	  />
	)
};

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
	},
	card: {
		flex: 1,
    elevation: 10, // for android
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { 
    	width: 0,
			height: 2, 
		},
		// height: cardHeight,
  	// width: cardWidth,
    // overflow: "hidden", don't use this it hides shadow for ios
    // marginBottom: cardMargin,
  },
});
export default PostCard;
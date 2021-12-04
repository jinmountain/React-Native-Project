import React, { useContext, useState, useEffect } from 'react';
import { 
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaView, } from 'react-native-safe-area-context';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Hooks
// import getImageSizeByURL from '../hooks/getImageSizeByURL;' 

// Contexts
import { Context as PostContext } from '../context/PostContext';
import { Context as AuthContext } from '../context/AuthContext';

// Designs
import { Ionicons } from '@expo/vector-icons';

// Firebase
import contentGetFire from '../firebase/contentGetFire';

// Components
import { HeaderForm } from '../components/HeaderForm';
import PostCardsVerticalSwipe from '../components/postCard/PostCardsVerticalSwipe';
import MainTemplate from '../components/MainTemplate';
// Loading
import GetPostLoading from '../components/GetPostLoading';
// End Sign
import PostEndSign from '../components/PostEndSign';

// Color
import color from '../color';

// expo icons
import expoIcons from '../expoIcons';

const screenSelector = (
  screen,
  defaultAction, 
  hot, 
  account, 
  accountDisplay, 
  businessUser, 
  businessTagged, 
  userAccount, 
  userAccountDisplay
  ) => {
  let value
  screen === 'hot'
  ? value = hot
  : screen === 'account'
  ? value = account
  : screen === 'accountDisplay'
  ? value = accountDisplay
  : screen === 'businessUser'
  ? value = businessUser
  : screen === 'businessTagged'
  ? value = businessTagged
  : screen === 'userAccount'
  ? value = userAccount
  : screen === 'userAccountDisplay'
  ? value = userAccountDisplay
  : value = defaultAction
  return value;
};

const PostsSwipeScreen = ({ route, navigation }) => {
  const { 
    cardIndex, 
    postSource, 

    posts, 
    postState, 
    postFetchSwitch, 
    postLast,

    accountUserId, // need for swipe screen get posts of an account user
    businessUserId, // need for swipe screen get posts of a business
  } = route.params;

  const [ swipeCardIndex, setSwipeCardIndex ] = useState(0);
  const [ swipePostSource, setSwipePostSource ] = useState('default');

  const [ swipePosts, setSwipePosts ] = useState([]);
  const [ swipePostLast, setSwipePostLast ] = useState(null);
  const [ swipePostFetchSwitch, setSwipePostFetchSwtich ] = useState(true);
  const [ swipePostState, setSwipePostState ] = useState(false);

  const [ swipeScreenAccountUserId, setSwipeScreenAccountUserId ] = useState(null);
  const [ swipeScreenBusinessUserId, setSwipeScreenBusinessUserId ] = useState(null);

  //console.log("PostsSwipe: postSource: ", postSource, "| index: ", cardIndex, "| posts: ", posts.length);

  useEffect(() => {
    let mounted = true
    mounted && setSwipeCardIndex(cardIndex);
    mounted && setSwipePostSource(postSource);

    mounted && setSwipePosts(posts);
    mounted && setSwipePostLast(postLast);
    mounted && setSwipePostFetchSwtich(postFetchSwitch);
    mounted && setSwipePostState(postState);

    mounted && setSwipeScreenAccountUserId(accountUserId);
    mounted && setSwipeScreenBusinessUserId(businessUserId);

    return () => {
      mounted = false;
      setSwipeCardIndex(0);
      setSwipePostSource('default');

      setSwipePosts([]);
      setSwipePostLast(null);
      setSwipePostFetchSwtich(true);
      setSwipePostState(false);

      setSwipeScreenAccountUserId(accountUserId);
      setSwipeScreenBusinessUserId(businessUserId);
    }
  }, [cardIndex, postSource, accountUserId, posts, postState, postFetchSwitch, postLast, businessUserId ])

  const { 
    state: {
      user
    },
  } = useContext(AuthContext);

  return (
    <View style={styles.mainContainer}>
      <HeaderForm 
        leftButtonTitle={null}
        leftButtonIcon={expoIcons.chevronBack(RFValue(27), color.black1)}
        headerTitle={null} 
        rightButtonTitle={null} 
        leftButtonPress={() => {
          navigation.goBack();
        }}
        rightButtonPress={() => {
          null
        }}
        addPaddingTop={true}
      />
      <View style={{flex: 1}}>
        <PostCardsVerticalSwipe
          postSource={postSource}
          cardIndex={cardIndex}

          getPosts={
            screenSelector(
              postSource, 
              [], 
              // hot posts
              contentGetFire.getHotPostsFire,
              // account posts
              contentGetFire.getUserPostsFire,
              // account display posts 
              contentGetFire.getBusinessDisplayPostsFire,
              // business user posts (ex. search screen)
              contentGetFire.getBusinessDisplayPostsFire,
              // business tagged posts (ex. serach screen reviews)
              contentGetFire.getTaggedPostsFire,
              // getUserAccountPosts,
              contentGetFire.getUserPostsFire,
              // user account display post
              contentGetFire.getBusinessDisplayPostsFire
            )
          }

          swipePosts={swipePosts}
          swipePostFetchSwitch={swipePostFetchSwitch}
          swipePostLast={swipePostLast}
          swipePostState={swipePostState}

          setSwipePosts={setSwipePosts}
          setSwipePostLast={setSwipePostLast}
          setSwipePostFetchSwtich={setSwipePostFetchSwtich}
          setSwipePostState={setSwipePostState}

          currentUser={{ id: user.id, photoURL: user.photoURL }}
          // search screen
          businessUserId={swipeScreenBusinessUserId}
          // need for UserAccountScreen
          accountUserId={swipeScreenAccountUserId}
        />
      </View>
      {swipePostState && <GetPostLoading />}
    </View>
  )
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: color.white2,
  },
});

export default PostsSwipeScreen;
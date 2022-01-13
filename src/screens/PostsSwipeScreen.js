import React, { useContext, useState, useEffect } from 'react';
import { 
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
// import { SafeAreaView, } from 'react-native-safe-area-context';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Hooks
// import getImageSizeByURL from '../hooks/getImageSizeByURL;' 

// Contexts
import { Context as PostContext } from '../context/PostContext';
import { Context as AuthContext } from '../context/AuthContext';

// Designs
import { Ionicons } from '@expo/vector-icons';

// Firebase
import postGetFire from '../firebase/post/postGetFire';

// Components
import { HeaderForm } from '../components/HeaderForm';
import PostCardsVerticalSwipe from '../components/postCard/PostCardsVerticalSwipe';
import MainTemplate from '../components/MainTemplate';
// Loading
import GetPostLoading from '../components/GetPostLoading';
// End Sign
import PostEndSign from '../components/PostEndSign';
import PanX from '../components/PanX';
import PanXY from '../components/PanXY';

// Color
import color from '../color';

// expo icons
import { chevronBack } from '../expoIcons';

// const { width, height } = Dimensions.get("window");

const screenSelector = (
  screen,
  defaultAction, 
  hot, 
  account, 
  accountDisplay,
  busRated, 
  ) => {
  let value
  screen === 'hot'
  ? value = hot
  : screen === 'account'
  ? value = account
  : screen === 'accountDisplay'
  ? value = accountDisplay
  : screen === 'busRated'
  ? value = businessTagged
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

  // for user account screen
  const [ swipeScreenAccountUserId, setSwipeScreenAccountUserId ] = useState(null);
  // for business search screen
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
    <SafeAreaView style={{ flex: 1, backgroundColor: color.white2, borderRadius: 30 }}>
      <View style={styles.mainContainer}>
        <HeaderForm 
          leftButtonTitle={null}
          leftButtonIcon={chevronBack(RFValue(27), color.black1)}
          headerTitle={null} 
          rightButtonTitle={null} 
          leftButtonPress={() => {
            navigation.goBack();
          }}
          rightButtonPress={() => {
            null
          }}
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
                postGetFire.getHotPostsFire,
                // account posts
                postGetFire.getUserPostsFire,
                // account display posts 
                postGetFire.getBusinessDisplayPostsFire,
                // business tagged posts (ex. search screen reviews)
                postGetFire.getTaggedPostsFire,
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
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: color.white2,
  },
});

export default PostsSwipeScreen;
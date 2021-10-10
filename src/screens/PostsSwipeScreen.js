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
import PostCard from '../components/postCard/PostCard';
import MainTemplate from '../components/MainTemplate';
// Loading
import GetPostLoading from '../components/GetPostLoading';
// End Sign
import PostEndSign from '../components/PostEndSign';

// Color
import color from '../color';

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
    targetUser, 
    posts, 
    postState, 
    postFetchSwitch, 
    postLast,
    businessUserSearch
  } = route.params;

  const [ swipeCardIndex, setSwipeCardIndex ] = useState(0);
  const [ swipePostSource, setSwipePostSource ] = useState('default');
  const [ swipeTargetUser, setSwipeTargetUser ] = useState(null);

  const [ swipePosts, setSwipePosts ] = useState([]);
  const [ swipePostLast, setSwipePostLast ] = useState(null);
  const [ swipePostFetchSwitch, setSwipePostFetchSwtich ] = useState(true);
  const [ swipePostState, setSwipePostState ] = useState(false);

  const [ swipeBusinessUserSearch, setSwipeBusinessUserSearch ] = useState(null);

  console.log("PostsSwipe: postSource: ", postSource, "| index: ", cardIndex, "| posts: ", posts.length);

  useEffect(() => {
    let mounted = true
    mounted && setSwipeCardIndex(cardIndex);
    mounted && setSwipePostSource(postSource);
    mounted && setSwipeTargetUser(targetUser);
    mounted && setSwipePosts(posts);
    mounted && setSwipePostLast(postLast);
    mounted && setSwipePostFetchSwtich(postFetchSwitch);
    mounted && setSwipePostState(postState);
    mounted && setSwipeBusinessUserSearch(businessUserSearch);

    console.log(targetUser);
    return () => {
      mounted = false;
      setSwipeCardIndex(0);
      setSwipePostSource('default');
      setSwipeTargetUser(null);

      setSwipePosts([]);
      setSwipePostLast(null);
      setSwipePostFetchSwtich(true);
      setSwipePostState(false);
    }
  }, [cardIndex, postSource, targetUser, posts, postState, postFetchSwitch, postLast, businessUserSearch ])

  const { 
    state: {
      user
    },
  } = useContext(AuthContext);

  return (
    <MainTemplate>
      <HeaderForm 
        leftButtonTitle={null}
        leftButtonIcon={<Ionicons name="md-arrow-back" size={RFValue(27)} color={color.black1} />}
        headerTitle={null} 
        rightButtonTitle={null} 
        leftButtonPress={() => {
          navigation.goBack();
        }}
        rightButtonPress={() => {
          null
        }}
      />
      <View style={{height: "100%", paddingBottom: RFValue(37)}}>
        <PostCard
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

          currentUser={user}
          // search screen
          businessUser={swipeBusinessUserSearch}
          // need for UserAccountScreen
          targetUser={swipeTargetUser}
        />
      </View>
    </MainTemplate>
  )
};

const styles = StyleSheet.create({
  postsSwipeScreenContainer: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
});

export default PostsSwipeScreen;
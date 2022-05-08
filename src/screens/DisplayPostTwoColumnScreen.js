import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  FlatList,
  SafeAreaView,
  TouchableWithoutFeedback
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import MainTemplate from '../components/MainTemplate';
import HeaderBottomLine from '../components/HeaderBottomLine';
import { HeaderForm } from '../components/HeaderForm';
// -- Display Post
import DisplayPostImage from '../components/displayPost/DisplayPostImage';
import DisplayPostInfo from '../components/displayPost/DisplayPostInfo';

// Design

// Hooks
import count from '../hooks/count';
import { roundUpFirstDec } from '../hooks/useMath';

// color
import color from '../color';

// icon
import expoIcons from '../expoIcons';

// -- Constant Value

  const DISPLAY_POST_WIDTH = Dimensions.get("window").width/2 - 0.5;
  const DISPLAY_POST_MARGIN = 10;

const DisplayPostTwoColumnScreen = ({ navigation, route }) => {
  const { 
    posts, 
    postState, 
    postFetchSwitch, 
    postLast,

    currentUserId,
    displayPostUserId
  } = route.params;

  const [ tcPosts, setTcPosts ] = useState([]);
  const [ tcPostLast, setTcPostLast ] = useState(null);
  const [ tcPostFetchSwitch, setTcPostFetchSwtich ] = useState(true);
  const [ tcPostState, setTcPostState ] = useState(false);

  const [ windowWidth, setWindowWidth ] = useState(Dimensions.get("window").width);

  useEffect(() => {
    let mounted = true

    mounted && setTcPosts(posts);
    mounted && setTcPostLast(postLast);
    mounted && setTcPostFetchSwtich(postFetchSwitch);
    mounted && setTcPostState(postState);

    return () => {
      mounted = false;

      setTcPosts([]);
      setTcPostLast(null);
      setTcPostFetchSwtich(true);
      setTcPostState(false);
    }
  }, []);

  // two column screen flatlist onEndReached function
  const twoColumnFlatListOnEndReached = () => {
    if (setTcPostFetchSwtich && !tcPostState) {
      setTcPostState(true);
      const getDisplayPosts = getBusinessDisplayPostsFire(displayPostUserId, null);
      getDisplayPosts
      .then((posts) => {
        setTcPosts([ ...tcPosts, ...posts.fetchedPosts ]);
        if (posts.lastPost !== undefined) {
          setTcPostLast(posts.lastPost);
        } else {
          setTcPostFetchSwtich(false);
        };
        setTcPostState(false);
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.white2 }}>
      <SafeAreaView/>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={posts}
            keyExtractor={(post) => post.id}
            renderItem={({ item, index }) => {
              return (
                <TouchableWithoutFeedback 
                  onPress={() => {
                    navigation.navigate(
                      "AccountPostsSwipeStack",
                      {
                        screen: "PostsSwipe",
                        params: {
                          postSource: 'accountDisplay',
                          cardIndex: index,
                          posts: tcPosts,
                          postState: tcPostState,
                          postFetchSwitch: tcPostFetchSwitch,
                          postLast: tcPostLast,
                        }
                      }
                    );
                  }}
                >
                  <View style={[
                    styles.displayPostInner,
                    {
                      width: DISPLAY_POST_WIDTH
                    },
                    index % 2 == 0 ? { marginRight: 1 } : { marginRight: 0 }
                  ]}>
                    <DisplayPostImage
                      type={item.data.files[0].type}
                      url={item.data.files[0].url}
                      imageWidth={DISPLAY_POST_WIDTH}
                    />
                    <DisplayPostInfo
                      containerWidth={DISPLAY_POST_WIDTH}
                      taggedCount={count.kOrNo(item.data.taggedCount)}
                      rating={
                        item.data.countRating
                        ?
                        roundUpFirstDec(item.data.totalRating/item.data.countRating)
                        : "-"
                      }
                      title={item.data.title}
                      likeCount={count.kOrNo(item.data.likeCount)}
                      price={item.data.price}
                      etc={item.data.etc}
                      infoBoxBackgroundColor={color.white1}
                    />
                    { item.data.files.length > 1
                      ? <MultiplePhotosIndicator
                          size={RFValue(17)}
                        />
                      : null
                    }
                  </View>
                </TouchableWithoutFeedback>
              )
            }}
            numColumns={2}
            onEndReached={twoColumnFlatListOnEndReached}
          />
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  displayPostInner: {

  },
});

export default DisplayPostTwoColumnScreen;
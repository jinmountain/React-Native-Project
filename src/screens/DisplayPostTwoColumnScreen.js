import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity,
  Pressable,
  TouchableHighlight,
  Dimensions,
  FlatList,
  SafeAreaView,
  TouchableWithoutFeedback,
  Image
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import MainTemplate from '../components/MainTemplate';
import HeaderBottomLine from '../components/HeaderBottomLine';
import { HeaderForm } from '../components/HeaderForm';
// -- Display Post
import DisplayPostImage from '../components/displayPost/DisplayPostImage';
import DisplayPostInfo from '../components/displayPost/DisplayPostInfo';
import DefaultUserPhoto from '../components/defaults/DefaultUserPhoto';

// Design

// Hooks
import count from '../hooks/count';
import { roundUpFirstDec } from '../hooks/useMath';

// Firebase
import { getBusinessDisplayPostsFire } from '../firebase/post/postGetFire';
import { getUserInfoFire } from '../firebase/user/usersGetFire';
import { getTechsRating } from '../firebase/business/businessGetFire';

// color
import color from '../color';

// icon
import {
  antdesignStaro,
  evilIconsChevronDown
} from '../expoIcons';

// -- Constant Value

  const DISPLAY_POST_WIDTH = Dimensions.get("window").width * 0.75;
  const DISPLAY_POST_MARGIN = 10;


const DisplayPostTechInfo = ({ techs, busId, postId }) => {
  const [ dpTechs, setDpTechs ] = useState([]);
  const [ screenReady, setScreenReady ] = useState(false);

  // techData: {
  //   id: 
  //   username: 
  //   photoURL: 
  //   businessHours: 
  //   specialHours: 
  // }

  // techRatingBus: {
  //   countRating: 
  //   totalRating: 
  // }

  // techRatingPost: {
  //   countRating: 
  //   totalRating: 
  // }

  useEffect(() => {
    const getScreenReady = new Promise ((res, rej) => {
      const getRating = getTechsRating(techs, busId, postId);
      getRating
      .then((techs) => {
        // sort them in order by rating
        // console.log(techs);
        const techsSorted = techs.sort((a, b) => {
          // criteria to compare
          let avgA;
          let avgB;

          // show rating for this post
          // show the avg rating under the profile picture or somewhere else

          avgA = a.techRatingPost.countRating > 0 
          ? a.techRatingPost.totalRating / a.techRatingPost.countRating
          : 1
          avgB = b.techRatingPost.countRating > 0
          ? b.techRatingPost.totalRating / b.techRatingPost.countRating 
          : 1

          return avgB - avgA;
        });
        console.log("techSorted: ", techsSorted);
        setDpTechs(techsSorted);
      })
      .catch((error) => {

      });

      res();
    });

    getScreenReady
    .then(() => {
      setScreenReady(true);
    })
    .catch((error) => {

    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={dpTechs}
        keyExtractor={(dpTechs, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <Pressable key={index}>
              <View style={styles.techInfoContainer}>
                <View style={styles.techInfoLeftContainer}>
                  <View>
                    { 
                      item.techData.photoURL
                      ?
                      <Image style={styles.techImage} source={{ uri: item.techData.photoURL }}/>
                      : 
                      <DefaultUserPhoto 
                        customSizeBorder={RFValue(37)}
                        customSizeUserIcon={RFValue(25)}
                      />
                    }
                  </View>
                  <View>
                    <Text>{item.techData.username}</Text>
                  </View>
                  { 
                    // tech rating in the business
                    item.techRatingBus.totalRating && item.techRatingBus.countRating
                    ?
                    <View style={styles.avgRatingContainer}>
                      <View>
                        {antdesignStaro(RFValue(13), color.yellow2)}
                      </View>
                      <Text>
                        {(Math.round(item.techRatingBus.totalRating/item.techRatingBus.countRating * 10) / 10).toFixed(1)}
                      </Text>
                    </View>
                    :
                    <View style={styles.avgRatingContainer}>
                      <View>
                        {antdesignStaro(RFValue(13), color.black1)}
                      </View>
                      <Text>
                        -
                      </Text>
                    </View>
                  }
                </View>
                {
                  item.techRatingPost && item.techRatingPost.totalRating && item.techRatingPost.countRating
                  ?
                  <View style={styles.postRatingContainer}>
                    <View style={styles.starIconContainer}>
                      {antdesignStaro(RFValue(19), color.yellow2)}
                    </View>
                    <Text style={styles.postRatingText}>
                      {(Math.round(item.techRatingPost.totalRating/item.techRatingPost.countRating * 10) / 10).toFixed(1)}
                    </Text>
                  </View>
                  :
                  <View style={styles.postRatingContainer}>
                    <View style={styles.starIconContainer}>
                      {antdesignStaro(RFValue(19), color.black1)}
                    </View>
                    <Text style={styles.postRatingText}>
                      -
                    </Text>
                  </View>
                }
              </View>
            </Pressable>
          )
        }}
      />
      {
        dpTechs && dpTechs.length == 0
        ?
        <View>
          <Text>techs are not found</Text>
        </View>
        :
        null
      }
    </View>
  )
}

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
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <FlatList
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={DISPLAY_POST_WIDTH + 5}
            snapToAlignment="center"
            decelerationRate={"fast"}
            contentInset={{
              top: 0,
              left: 50,
              bottom: 0,
              right: 50
            }}
            data={posts}
            keyExtractor={(post) => post.id}
            renderItem={({ item, index }) => {
              return (
                <TouchableWithoutFeedback 
                  onPress={() => {
                    // navigation.navigate(
                    //   "AccountPostsSwipeStack",
                    //   {
                    //     screen: "PostsSwipe",
                    //     params: {
                    //       postSource: 'accountDisplay',
                    //       cardIndex: index,
                    //       posts: tcPosts,
                    //       postState: tcPostState,
                    //       postFetchSwitch: tcPostFetchSwitch,
                    //       postLast: tcPostLast,
                    //     }
                    //   }
                    // );
                  }}
                >
                  <View style={[
                    styles.displayPostInner,
                    {
                      width: DISPLAY_POST_WIDTH,
                      marginRight: 5
                    }
                  ]}>
                    <View style={styles.postTitleContainer}>
                      <Text style={{ fontWeight: 'bold', fontSize: RFValue(23) }}>
                        {item.data.title}
                      </Text>
                    </View>
                    <DisplayPostImage
                      type={item.data.files[0].type}
                      url={item.data.files[0].url}
                      imageWidth={DISPLAY_POST_WIDTH}
                      imageCustomStyle={{ 
                        borderTopLeftRadius: 9, 
                        borderTopRightRadius: 9, 
                        borderBottomLeftRadius: 0, 
                        borderBottomRightRadius: 0 
                      }}
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
                      title={null}
                      likeCount={count.kOrNo(item.data.likeCount)}
                      price={item.data.price}
                      etc={item.data.etc}
                      infoBoxBackgroundColor={color.white1}
                      infoTextFontSize={RFValue(17)}
                    />
                    <DisplayPostTechInfo
                      techs={item.data.techs}
                      busId={item.data.uid}
                      postId={item.id}
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
            numColumns={1}
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
  techImage: {
    height: RFValue(37),
    width: RFValue(37),
    borderRadius: RFValue(100),
  },
  techInfoContainer: {
    flexDirection: 'row', 
    backgroundColor: color.white1, 
    paddingHorizontal: RFValue(5),
    paddingVertical: RFValue(3)
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  techInfoLeftContainer: {
    width: RFValue(70),
    alignItems: 'center',
    paddingHorizontal: RFValue(3)
  },
  postRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  avgRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postRatingText: {
    fontSize: RFValue(19)
  },

  postTitleContainer: { 
    height: RFValue(50), 
    justifyContent: 'center', 
    backgroundColor: color.white2, 
  },
  starIconContainer: {
    paddingHorizontal: RFValue(5)
  }
});

export default DisplayPostTwoColumnScreen;
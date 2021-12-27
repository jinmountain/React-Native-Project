import React, { useState, useEffect, } from 'react';
import { 
	View, 
	Text, 
	StyleSheet,
	TouchableWithoutFeedback,
  Dimensions,
  Image,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from '@react-navigation/native';
import { Video, AVPlaybackStatus } from 'expo-av';

// Designs
import { AntDesign } from '@expo/vector-icons';

// Components
import MultiplePhotosIndicator from './MultiplePhotosIndicator';

// Color
import color from '../color';

// hooks
import { useOrientation } from '../hooks/useOrientation';

const ThreePostsRow = ({ 
  screen,
  accountUserId, 
  posts, 
  postState,
  postFetchSwitch,
  postLast,
}) => {
  const navigation = useNavigation();
  const [defaultPosts, setDefaultPosts] = useState(Array(9).fill(0));
  const [ threePostsRowImageWH, setThreePostsRowImageWH ] = useState(Dimensions.get("window").width/3-2);

  const orientation = useOrientation();

  useEffect(() => {
    console.log("posts: ", posts);
    setThreePostsRowImageWH(Dimensions.get("window").width/3-2);
  }, [orientation]);

	return (
    <View style={[styles.container, {paddingBottom: RFValue(150)}]}>
    {
      postState && posts.length === 0
      ?
      defaultPosts.map((item, index) => 
      (
        <View
          key={index}
          style={[styles.imageContainer, 
            index % 3 !== 0 ? { paddingLeft: 2 } : { paddingLeft: 0 }
          ]}
        >
          <View style={{width: threePostsRowImageWH, height: threePostsRowImageWH, backgroundColor: color.grey1 }}>
          </View>
        </View>
      ))
      : !postState && posts.length === 0
      ? 
      <View style={styles.emptyPostContainer}>
        <View style={styles.cloudContainer}>
          <AntDesign name="cloudo" size={RFValue(57)} color={color.grey3} />
        </View>
        <Text style={styles.emptyPostText}>No Posts Yet</Text>
      </View>
      :
      posts.map((item, index) => 
      (
        <View
          key={item.id}
          style={[styles.imageContainer, 
            index % 3 !== 0 ? { paddingLeft: 2 } : { paddingLeft: 0 }
          ]}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              // navigate('PostsSwipeStack', {
              //   screen: 'PostsSwipe',
              //   params: { 
              //     postSource: screen,
              //     cardIndex: index,
              //     accountUserId: accountUserId,
              //     posts: posts,
              //     postState: postState,
              //     postFetchSwitch: postFetchSwitch,
              //     postLast: postLast,
              //   }
              // });
              navigation.navigate(
                'PostsSwipe',
                { 
                  postSource: screen,
                  cardIndex: index,
                  accountUserId: accountUserId,
                  posts: posts,
                  postState: postState,
                  postFetchSwitch: postFetchSwitch,
                  postLast: postLast,
                }
              );
            }}
          > 
            <View>
              { 
                item.data.files[0].type === 'video'
                ?
                <View style={{width: threePostsRowImageWH, height: threePostsRowImageWH}}>
                  <Video
                    // ref={video}
                    style={{backgroundColor: color.white2, borderWidth: 0, width: threePostsRowImageWH, height: threePostsRowImageWH}}
                    source={{
                      uri: item.data.files[0].url,
                    }}
                    useNativeControls={false}
                    resizeMode="contain"
                    shouldPlay={false}
                  />
                </View>
                : item.data.files[0].type === 'image'
                ?
                <Image 
                  defaultSource={require('../../img/defaultImage.jpeg')}
                  source={{uri: item.data.files[0].url}}
                  style={{width: threePostsRowImageWH, height: threePostsRowImageWH}}
                />
                : null
              }
              { item.data.files.length > 1
                ? <MultiplePhotosIndicator size={16}/>
                : null
              }
            </View>
          </TouchableWithoutFeedback>
        </View>
      ))
    }
    </View>
	)
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white2,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 2,
  },
  emptyPostContainer: {
    marginVertical: RFValue(7),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyPostText: {
    fontSize: RFValue(17),
    color: color.grey3,
  },
});

export default ThreePostsRow;
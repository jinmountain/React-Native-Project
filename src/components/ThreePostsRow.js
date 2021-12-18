import React, { useState, useEffect, } from 'react';
import { 
	View, 
	Text, 
	StyleSheet,
	TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Video, AVPlaybackStatus } from 'expo-av';

// navigation
import { navigate } from '../navigationRef';

// Designs
import { AntDesign } from '@expo/vector-icons';

// Components
import MultiplePhotosIndicator from './MultiplePhotosIndicator';

// Color
import color from '../color';

const ThreePostsRow = ({ 
  navigate, 
  screen,
  accountUserId, 
  posts, 
  postState,
  postFetchSwitch,
  postLast,
  threePostsRowImageWH
}) => {
  const [defaultPosts, setDefaultPosts] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);

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
          <View style={{width: threePostsRowImageWH, height: threePostsRowImageWH, backgroundColor: color.gray1 }}>
          </View>
        </View>
      ))
      : !postState && posts.length === 0
      ? 
      <View style={styles.emptyPostContainer}>
        <View style={styles.cloudContainer}>
          <AntDesign name="cloudo" size={RFValue(57)} color={color.gray3} />
        </View>
        <Text style={styles.emptyPostText}>No Posts Yet</Text>
      </View>
      :
      posts.map((item, index) => 
      (
        <View
          key={index}
          style={[styles.imageContainer, 
            index % 3 !== 0 ? { paddingLeft: 2 } : { paddingLeft: 0 }
          ]}
        >
          <TouchableOpacity
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
              navigate(
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
          </TouchableOpacity>
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
    color: color.gray3,
  },
});

export default ThreePostsRow;
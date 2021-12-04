import React, { useRef, useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Image,
  Dimensions,
  FlatList,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from '@react-navigation/native';

// Designs

// hooks
import { wait } from '../../hooks/wait';

// Components
import PhotosPageIndicator from './PhotosPageIndicator';

// Color
import color from '../../color';

const { width, height } = Dimensions.get("window");

let currentFileIndex = 0;
const VerticalSwipePostImage = ({files, onFocus}) => {
  // files
  // {
  //  type: string
  //  url: string
  // }

  const _fileListView = useRef(null);
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [ currentFileIndex, setCurrentFileIndex ] = useState(0);
  let fileIndex = 0;
  let fileAnimation = new Animated.Value(0);
  const navigation = useNavigation();

  const [ showPage, setShowPage ] = useState(true);

  // activate when showPage change and set showPage to false after 3 seconds
  useEffect(() => {
    if (showPage) {
      wait(3000)
      .then(() => {
        setShowPage(false);
      });
    }
  }, [showPage]);

  useEffect(() => {
    fileAnimation.addListener(({ value }) => {
      if (value > 0) {
        // set showPage to true when detect index change
        setShowPage(true);
        const getIndex = new Promise((res, rej) => {
          // console.log("value: ", value, "cardWidth: ", width);
          let index = Math.floor((value + width) / width) - 1; 
          if (index >= files.length) {
            index = files.length - 1;
          };
          if (index <= 0) {
            index = 0;
          };
          res(index);
        });
        getIndex
        .then((index) => {
          // console.log("file index: ", index);
          setCurrentFileIndex(index);
        });
      }
    });
  });

  useEffect(() => {
    _fileListView.current.scrollToOffset(0);
  }, [files])

  return (
    <View>
      <Animated.FlatList
        horizontal
        ref={_fileListView}
        pagingEnabled={true}
        decelerationRate={'normal'}
        snapToInterval={width}
        showsHorizontalScrollIndicator={false}
        data={files}
        keyExtractor={(file, index) => index.toString()}
        getItemLayout = {(data, index) => (
          {
            length: width,
            offset: width * index,
            index
          }
        )}
        renderItem={({ item, index }) => {
          return (
            <TouchableWithoutFeedback 
              onPress={() => navigation.navigate(
                "ImageZoomin", 
                {
                  file: files[currentFileIndex]
                }
              )}
            >
              <View 
                style={styles.imageContainer}
              >
                { 
                  item.type === 'video'
                  ?
                  <View style={styles.cardVideoContainer}>
                    <Video
                      ref={video}
                      style={styles.cardVideo}
                      source={{
                        uri: item.url,
                      }}
                      useNativeControls={true}
                      resizeMode="contain"
                      // paused={!onFocus}
                      // onLoad={() => {
                      //   onFocus && currentFileIndex === index 
                      //   ? video.current.playAsync()
                      //   : video.current.pauseAsync()
                      // }}
                      // isLooping={true}
                      shouldPlay={onFocus && currentFileIndex === index }
                      onPlaybackStatusUpdate={status => setStatus(() => status)}
                    />
                  </View>
                  : item.type === 'image'
                  ?
                  <Image 
                    source={{uri: item.url}}
                    defaultSource={require('../../../img/defaultImage.jpeg')}
                    style={styles.cardImage}
                    resizeMethod="auto"
                    resizeMode="contain"
                  />
                  : null
                }
              </View>
            </TouchableWithoutFeedback>
          )
        }}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: fileAnimation,
                }
              },
            },
          ],
          {useNativeDriver: true}
        )}
      />
      { 
        files.length > 1 && showPage
        ?
        <PhotosPageIndicator 
          currentIndex={currentFileIndex}
          imageLength={files.length}
          marginTop={width}
        />
        : null
      }
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    backgroundColor: "#FFF",
  },
  cardImage: {
    backgroundColor: color.white1,
    width: width,
    height: width,
  },
  cardVideoContainer: {
    width: width,
    height: width,
  },
  cardVideo: {
    backgroundColor: color.white2,
    width: width,
    height: width,
  }
});

export default VerticalSwipePostImage;
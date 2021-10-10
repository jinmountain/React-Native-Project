import React, { useRef, useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Image,
  Dimensions,
  FlatList,
  Animated
} from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Designs

// Components
import PhotosPageIndicator from './PhotosPageIndicator';

// Color
import color from '../../color';

const { width, height } = Dimensions.get("window");
const cardHeight = height * 0.77;

let currentFileIndex = 0;
const VerticalSwipePostImage = ({files, onFocus}) => {
  const _fileListView = useRef(null);
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [ currentFileIndex, setCurrentFileIndex ] = useState(0);
  let fileIndex = 0;
  let fileAnimation = new Animated.Value(0);

  useEffect(() => {
    fileAnimation.addListener(({ value }) => {
      if (value > 0) {
        const getIndex = new Promise((res, rej) => {
          console.log("value: ", value, "cardWidth: ", width);
          let index = Math.floor((value + width) / width) - 1; 
          // animate 30% away from landing on the next item
          if (index >= files.length) {
            index = files.length - 1;
            console.log(index);
          };
          if (index <= 0) {
            index = 0;
            console.log(index);
          };
          res(index);
        });
        getIndex
        .then((index) => {
          setCurrentFileIndex(index);
        });
      }
    });
  });

  useEffect(() => {
    _fileListView.current.scrollToOffset(0);
  }, [files])

  return (
    <Animated.FlatList
      horizontal
      ref={_fileListView}
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
            { 
              files.length > 1
              ?
              <PhotosPageIndicator 
                currentIndex={index}
                imageLength={files.length}
              />
              : null
            }
          </View>
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
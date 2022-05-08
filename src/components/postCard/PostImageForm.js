import React, { useRef, useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Image,
  Dimensions,
  FlatList,
  Text,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  block,
  cond,
  eq,
  set,
  useCode,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing
} from "react-native-reanimated";
import {
  PinchGestureHandler,
  ScrollView,
  State,
} from "react-native-gesture-handler";
import {
  clamp
} from "react-native-redash";

// Designs

// hooks
import { wait } from '../../hooks/wait';
import {
  convertEtcToHourMin
} from '../../hooks/useConvertTime';

// Components
import PhotosPageIndicator from './PhotosPageIndicator';

// Color
import color from '../../color';

// expo icons
// import {
// } from '../../expoIcons';

const { width, height } = Dimensions.get("window");

let currentFileIndex = 0;

// -- zoomable image component
  const ZoomableImage = ({ imageUrl, cardWidth }) => {
    const scale = useSharedValue(1);
    const focalX = useSharedValue(0);
    const focalY = useSharedValue(0);
    const zIndex = State.ACTIVE ? 10 : 0;

    const pinchGestureHandle = useAnimatedGestureHandler(
      {
        onStart: () => {

        },
        onActive: (event) => {
          scale.value = clamp(event.scale, 1, 3);
          focalX.value = event.focalX;
          focalY.value = event.focalY;
        },
        onEnd: () => {
          scale.value = withTiming(1, {
            duration: 300,
            easing: Easing.inOut(Easing.ease),
          });
        },
      },
      [],
    );

    const animatedStyles = useAnimatedStyle(() => {
      return {
        transform: [
          {translateX: focalX.value},
          {translateY: focalY.value},
          {translateX: -cardWidth / 2},
          {translateY: -cardWidth / 2},
          {scale: scale.value},
          {translateX: -focalX.value},
          {translateY: -focalY.value},
          {translateX: cardWidth / 2},
          {translateY: cardWidth / 2},
        ],
      }; 
    });

    return (
      <Animated.View style={{ width: cardWidth, height: cardWidth, zIndex }}>
        <PinchGestureHandler
          onGestureEvent={pinchGestureHandle}
        >
          <Animated.Image 
            source={{uri: imageUrl}}
            defaultSource={require('../../../img/defaultImage.jpeg')}
            style={[
              { 
                width: undefined, 
                height: undefined,
                resizeMode: "cover",
                ...StyleSheet.absoluteFillObject
              },
              animatedStyles
            ]}
            // resizeMethod="auto"
            // resizeMode="contain"
          />
        </PinchGestureHandler>
      </Animated.View>
    )
  };

const PostImageForm = ({
  files, 
  onFocus, 
  isDisplay, 
  displayPrice, 
  displayEtc,
  cardWidth
}) => {
  // files
  // {
  //  type: string
  //  url: string
  // }
  const isFocused = useIsFocused();

  const _fileListView = useRef(null);
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
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
    _fileListView.current.scrollToOffset(0);
  }, [files]);

  const [focusedCardIndex, setFocusedCardIndex] = useState(0);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    waitForInteraction: true,
    minimumViewTime: 500, // stay at least 0.5 second
  })

  const onViewableItemsChanged = useRef(({ viewableItems, changed }) => {
    if (changed && changed.length > 0) {
      setFocusedCardIndex(changed[0].index);
      console.log("item index: ", changed[0].index);
      setShowPage(true);
    }
  });

  return (
    <View>
      <FlatList
        horizontal
        initialNumToRender={1}
        ref={_fileListView}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
        pagingEnabled={true}
        snapToInterval={width}
        showsHorizontalScrollIndicator={false}
        decelerationRate={"fast"}
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
            item.type === 'video'
            ?
            <View style={{ width: cardWidth, height: cardWidth}}>
              <Video
                ref={video}
                style={{ width: cardWidth, height: cardWidth}}
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
                // when screen is focused, vertically focused, and horizontally focused
                shouldPlay={isFocused && onFocus && focusedCardIndex === index }
                onPlaybackStatusUpdate={status => setStatus(() => status)}
              />
            </View>
            : item.type === 'image'
            ?
            <ZoomableImage
              cardWidth={cardWidth}
              imageUrl={item.url}
            />
            : null
          )
        }}
      />
      { 
        files.length > 1 && showPage
        ?
        <PhotosPageIndicator 
          currentIndex={focusedCardIndex}
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
    backgroundColor: color.white2,
  },
});

export default PostImageForm;
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

// Designs

// hooks
import { wait } from '../../hooks/wait';
import useConvertTime from '../../hooks/useConvertTime';

// Components
import PhotosPageIndicator from './PhotosPageIndicator';

// Color
import color from '../../color';

// expo icons
import expoIcons from '../../expoIcons';

const { width, height } = Dimensions.get("window");

let currentFileIndex = 0;
const VerticalSwipePostImage = ({files, onFocus, isDisplay, displayPrice, displayEtc}) => {
  // files
  // {
  //  type: string
  //  url: string
  // }

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
      setShowPage(true);
      // console.log("changed focused card index to: ", changed[0].index);
      // console.log("Visible items are", viewableItems);
      // console.log("Changed in this iteration", changed);
    }
  });

  return (
    <View>
      <FlatList
        horizontal
        ref={_fileListView}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
        pagingEnabled={true}
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
                  file: files[index]
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
                      shouldPlay={onFocus && focusedCardIndex === index }
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

      {
        isDisplay &&
        <View style={styles.displayPostShopButtonContainer}>
          <TouchableHighlight 
            style={styles.displayPostInfoTH}
            onPress={() => {
              console.log("shop");
            }}
            underlayColor={color.grey4}
          >
            <View style={styles.shopButtonInner}>
              {expoIcons.featherShoppingBack(RFValue(17), color.red2)}
              <View style={styles.displayPostInfoInner}>
                <View style={styles.displayPostInfoElement}>
                  <Text style={styles.displayPostInfoText}>$</Text>
                </View>
                <View style={styles.displayPostInfoElement}>
                  <Text style={styles.displayPostInfoText}>
                    {displayPrice}
                  </Text>
                </View>
              </View>
              <View style={styles.displayPostInfoInner}>
                <View style={styles.displayPostInfoElement}>
                  { 
                    expoIcons.antdesignClockCircleO(RFValue(13), color.black1)
                  }
                </View>
                <View style={styles.displayPostInfoElement}>
                  <Text style={styles.displayPostInfoText}>
                    {useConvertTime.convertEtcToHourMin(displayEtc)}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableHighlight>
        </View>
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
  },

  displayPostShopButtonContainer: {
    position: 'absolute',
    width: "100%",
    paddingRight: RFValue(9),
    marginTop: RFValue(9),
  },
  displayPostInfoTH: {
    alignSelf: 'flex-end',
    borderWidth: RFValue(1),
    borderRadius: RFValue(15),
    paddingHorizontal: RFValue(7),
    paddingVertical: RFValue(7),
    justifyContent: 'center',
    alignItems: 'center',

    elevation: 5, // for android
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { 
      width: 0,
      height: 2, 
    },
  },
  shopButtonInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  displayPostInfoInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(3),
  },
  displayPostInfoElement: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(1),
  },
  displayPostInfoText: {
    fontSize: RFValue(15),
  },
});

export default VerticalSwipePostImage;
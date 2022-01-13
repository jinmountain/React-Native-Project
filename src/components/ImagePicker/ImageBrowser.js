import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  Dimensions,
  Animated,
  Text,
  ActivityIndicator,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback
} from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { StatusBar } from 'expo-status-bar';
import { Video, AVPlaybackStatus } from 'expo-av';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';

import * as ScreenOrientation from 'expo-screen-orientation';
import * as MediaLibrary from 'expo-media-library'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'

// components
import ImageBox from './ImageBox';
import { HeaderForm } from '../HeaderForm';
import PanXYPinch from '../PanXYPinch';

// hooks
import { useOrientation } from '../../hooks/useOrientation';

// colors
import color from '../../color';

// sizes
import sizes from '../../sizes';

// expo icons
import { 
  chevronBack, 
  evilIconsChevronDown,
  featherRotateCw,
  featherRotateCcw
} from '../../expoIcons';

// -- possible media types
// audio   'audio'
// photo   'photo'
// unknown 'unknown'
// video   'video'

const headerBoxHeight = sizes.headerBoxHeight;

// loadCompleteMetadata, loadCount, emptyStayComponent, preloaderComponent, mediaType
export default ImageBrowser = ({ 
  existingSelectedFiles,
  max, 
  loadCompleteMetadata, 
  loadCount, 

  emptyStayComponent, 
  preloaderComponent, 

  mediaType,
  // onChange,
  // callback,

  onFinish,
  goBack,

  noCameraPermissionComponent,
  renderExtraComponent
}) => {
  const [ windowWidth, setWindowWidth ] = useState(Dimensions.get("window").width);
  const [ windowHeight, setWindowHeight ] = useState(Dimensions.get("window").height);
  const [ fileImageWidth, setFileImageWidth ] = useState(Dimensions.get("window").width/4 - 6/4);

  const orientation = useOrientation();

  useEffect(() => {
    setWindowWidth(Dimensions.get("window").width);
    setWindowHeight(Dimensions.get("window").height);
    setFileImageWidth(Dimensions.get("window").width/4 - 6/4);
  }, [orientation]);

  const [ lastImage, setLastImage ] = useState(null);
  const [ chosenAlbum, setChosenAlbum ] = useState(null);
  const [ recentAlbum, setRecentAlbum ] = useState(null);
  const [ albums, setAlbums ] = useState([]);
  const [ isVisible, setIsVisible ] = useState('default');
  const [ hasCameraPermission, setHasCameraPermission ] = useState(null);
  const [ hasCameraRollPermission, setHasCameraRollPermission ] = useState(null);
  const [ numColumns, setNumColumns ] = useState(null);
  const [ photos, setPhotos ] = useState([]);
  const [ selected, setSelected ] = useState(
    existingSelectedFiles 
    ? existingSelectedFiles 
    : []
  );
  const [ selectedIds, setSelectedIds ] = useState(
    existingSelectedFiles
    ? existingSelectedFiles.map((file) => file.id)
    : []
  );
  const [ isEmpty, setIsEmpty ] = useState(false);
  const [ after, setAfter ] = useState(null);
  const [ hasNextPage, setHasNextPage ] = useState(true);

  const [ headerHeight, setHeaderHeight ] = useState(windowWidth/2);
  const [ albumBarHeight ] = useState(RFValue(55));
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getPermissionsAsync();
    ScreenOrientation.addOrientationChangeListener(onOrientationChange);
    const orientation = ScreenOrientation.getOrientationAsync();
    const numCol = getNumColumns(orientation);
    setNumColumns(numCol);
  }, []);

  const getPermissionsAsync = async () => {
    const { status: camera } = await ImagePicker.requestCameraPermissionsAsync()
    const { status: cameraRoll } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    console.log("cameraRoll: ", cameraRoll, "camera: ", camera);
    setHasCameraPermission(camera === 'granted');
    setHasCameraRollPermission(cameraRoll === 'granted');
  }

  useEffect(() => {
    getPhotos(chosenAlbum);
    setIsVisible('default');
  }, [chosenAlbum]);

  // ref of flatlist that shows selected images
  const _selectedImages = useRef(null);

  useEffect(() => {
    const selectedLen = selected.length;
    if (selectedLen > 0) {

      // onChange(selected.length, () => prepareCallback());
    }
    // console.log("selected: ", selected);
  }, [selected]);

  const onOrientationChange = ({orientationInfo}) => {
    ScreenOrientation.removeOrientationChangeListeners();
    ScreenOrientation.addOrientationChangeListener(onOrientationChange);
    const numCol = getNumColumns(orientationInfo.orientation);
    setNumColumns(numCol);
  }

  const getNumColumns = (orientation) => {
    const {PORTRAIT_UP, PORTRAIT_DOWN} = ScreenOrientation.Orientation;
    const isPortrait = orientation === PORTRAIT_UP || orientation === PORTRAIT_DOWN;
    return isPortrait ? 4 : 7;
  }

  const selectImage = async (newFile) => {
    const getAssetInfo = await MediaLibrary.getAssetInfoAsync(newFile.id);
    const newFileLocalUri = getAssetInfo.localUri;
    console.log("localuri: ", newFileLocalUri);

    let newSelected = Array.from(selected);
    let newSelectedIds = Array.from(selectedIds);

    if (
      newSelectedIds.indexOf(newFile.id) === -1
    ) {
      console.log("newFile: ", newFile);
      const fileJson = {
        type: 
        newFile.mediaType === 'video' 
        ? 'video' 
        : newFile.mediaType === 'photo' || newFile.mediaType === 'image'
        ? 'image' 
        : null,
        uri: newFileLocalUri,
        id: newFile.id
      }
      console.log("fileJson: ", fileJson);
      newSelected.push(fileJson);
      newSelectedIds.push(newFile.id);
    } else {
      // if newSelected has the file exclude the file
      const deleteIndex = newSelectedIds.indexOf(newFile.id);
      // * use splice not filter
      newSelected.splice(deleteIndex, 1);
      newSelectedIds.splice(deleteIndex, 1);
    }
    // if newSelected's length is longer than max just return
    if (newSelected.length > max) return;
    if (!newSelected) newSelected = []; 
    setSelected(newSelected);
    setSelectedIds(newSelectedIds);
    // do above first and do onChange
  }

  const getPhotos = (chosenAlbum) => {
    let params = {
      first: loadCount,
      mediaType: mediaType,
      sortBy: [MediaLibrary.SortBy.creationTime]
    };

    if (chosenAlbum) params.album = chosenAlbum.id;
    if (after) params.after = after;
    if (!hasNextPage) return;

    MediaLibrary
    .getAssetsAsync(params)
    .then((data) => {
      processPhotos(data);
      if (!chosenAlbum && !after) {
        const firstFileObj = data.assets[0];
        setRecentAlbum(
          {
            title: "Recent",
            id: null,
            mediaType: firstFileObj.mediaType,
            uri: firstFileObj.uri,
            assetCount: data.totalCount,
          }
        );
      };
    });
  };

  const processPhotos = (data) => {
    if (data.totalCount) {
      if (after === data.endCursor) return;
      const uris = data.assets;
      setPhotos([ ...photos, ...uris ]);
      setAfter(data.endCursor);
      setHasNextPage(data.hasNextPage);
    } else {
      setIsEmpty(true);
    }
  }

  const getItemLayout = (data, index) => {
    const length = fileImageWidth;
    return {length, offset: length * index, index};
  }

  // const prepareCallback = async () => {
  //   const selectedFiles = selected.map(i => photos[i]);
  //   if (!loadCompleteMetadata){
  //     callback(await Promise.all(selectedFiles));
  //   }
  //   else {
  //     const files = await Promise.all(selectedFiles.map(i => MediaLibrary.getAssetInfoAsync(i)));
  //     callback(files);
  //   }
  // };

  const getAlbums = () => {
    return new Promise ((res, rej) => {
      MediaLibrary
      .getAlbumsAsync()
      .then(async (albums) => {
        const albumsData = await Promise.all(
          albums.map(async (album) => {
            const firstFileObj = await getAlbumFirstFile(album.id)
            const albumAndFirstFile = { ...album, ...firstFileObj };
            return albumAndFirstFile;
          })
        );
        res(albumsData);
      });
    });
  };

  const getAlbumFirstFile = (albumId) => {
    return new Promise ((res, rej) => {
      let params = {
        first: loadCount,
        mediaType: mediaType,
        sortBy: [MediaLibrary.SortBy.creationTime],
        album: albumId
      };

      MediaLibrary
      .getAssetsAsync(params)
      .then((data) => {
        const firstFile = {
          mediaType: data.assets[0].mediaType,
          uri: data.assets[0].uri
        }

        res(firstFile);
      });
    });
  };

  const renderSelectedComponent = (selectedItemNumber) => {
    return (
      <View style={{ flex: 1, position: 'absolute', alignSelf: 'flex-end' }}>
        <View 
          style={{ 
            width: RFValue(20), 
            height: RFValue(20), 
            borderRadius: RFValue(30), 
            justifyContent: 'center', 
            alignItems: 'center', 
            borderWidth: 2, 
            borderColor: color.white2,
            backgroundColor: color.blue1,
            marginTop: RFValue(3),
            marginRight: RFValue(3)
          }}
        >
          <Text 
            style={{ 
              color: color.white2, 
              fontSize: RFValue(11), 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}
          >{selectedItemNumber}</Text>
        </View>
      </View>
    )
  };

  const renderImageTile = ({ item, index }) => {
    const isSelected = selectedIds.indexOf(item.id) !== -1;
    const selectedItemNumber = selectedIds.indexOf(item.id) + 1;
    return (
      <ImageBox
        item={item}
        index={index}
        selectImage={selectImage}
        isSelected={isSelected}
        selectedItemNumber={selectedItemNumber}
        fileImageWidth={fileImageWidth}
        renderSelectedComponent={renderSelectedComponent}
        renderExtraComponent={renderExtraComponent}
      />
    );
  }

  const renderPreloader = () => preloaderComponent;

  const renderEmptyStay = () => emptyStayComponent;

  const renderSelectedFiles = () => {
    const imageScale = scrollY.interpolate({
      inputRange: [0, headerHeight],
      outputRange: [1, 0.5],
      extrapolate: 'clamp',
    });
    const y = scrollY.interpolate({
      inputRange: [0, headerHeight],
      outputRange: [0, -headerHeight],
      extrapolate: 'clamp',
    });
    return (
      <Animated.View style={{ 
        position: 'absolute',
        justifyContent: 'center',
        transform: [
          {
            scale: imageScale,
          },
          {
            translateY: y,
          }
        ],
        backgroundColor: color.black1
      }}>
        <FlatList
          ref={_selectedImages}
          data={selected}
          pagingEnabled
          horizontal
          decelerationRate={'fast'}
          showsHorizontalScrollIndicator={false}
          snapToInterval={windowWidth}
          onContentSizeChange={() => _selectedImages.current.scrollToEnd({ animated: false })}
          getItemLayout={(data, index) => (
            {length: windowWidth, offset: windowWidth * index, index}
          )}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderSelectedFileItem}
        />
      </Animated.View>
    )
  };

  const renderSelectedFileItem = ({ item, index }) => {
    return (
      <TouchableOpacity 
        style={{
          width: windowWidth, 
          height: windowWidth,
        }}
        onPress={() => {
          let newSelected = Array.from(selected);
          newSelected.splice(index, 1);
          setSelected(newSelected);

          let newSelectedIds = Array.from(selectedIds);
          newSelectedIds.splice(index, 1);
          setSelectedIds(newSelectedIds);
        }}
      >
        { 
          item.type === 'video'
          ?
          <View style={{width: windowWidth, height: windowWidth}}>
            <Video
              // ref={video}
              style={{
                width: windowWidth, 
                height: windowWidth
              }}
              source={{ uri: item.uri }}
              useNativeControls={false}
              resizeMode="contain"
              shouldPlay={false}
            />
            {renderSelectedComponent(index + 1)}
          </View>
          : item.type === 'image'
          ?
          <ImageBackground 
            // defaultSource={require('../../img/defaultImage.jpeg')}
            source={{ uri: item.uri }}
            resizeMode="contain"
            style={{width: windowWidth, height: windowWidth }}
          >
            {renderSelectedComponent(index + 1)}
          </ImageBackground>
          : null
        }
      </TouchableOpacity>
    )
  };

  const renderAlbumBar = (props) => {
    const y = scrollY.interpolate({
      inputRange: [0, headerHeight],
      outputRange: [headerHeight, 0],
      // extrapolate: 'clamp',
      extrapolateRight: 'clamp',
    });
    return (
      <Animated.View style={{
        zIndex: 1,
        position: 'absolute',
        width: '100%',
        height: albumBarHeight,
        marginTop: headerHeight,
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: color.black1, 
        paddingVertical: RFValue(7), 
        paddingLeft: RFValue(10),
        transform: [{translateY: y}],
      }}>
        <SafeAreaView />
        <TouchableOpacity
          onPress={() => {
            const executeGetAlbums = getAlbums();
            executeGetAlbums
            .then((albums) => {
              setAlbums(albums);
              setIsVisible('albums');
            });
          }}
        >
          <View>
            <Text style={{ color: color.white2, justifyContent: 'center', fontSize: RFValue(15) }}>
              {
                chosenAlbum
                ?
                `${chosenAlbum.title}`
                :
                "Recent"
              }
              {evilIconsChevronDown(RFValue(19), color.white2)}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderImages = () => {
    return (
      <View style={{ backgroundColor: color.black1 }}>
        <Animated.FlatList
          data={photos}
          numColumns={4}
          // key={numColumns}
          renderItem={renderImageTile}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: color.black1 }} />}
          keyExtractor={(_, index) => index}
          onEndReached={() => getPhotos()}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={isEmpty ? renderEmptyStay() : renderPreloader()}
          initialNumToRender={24}
          getItemLayout={getItemLayout}
          contentContainerStyle={{
            paddingTop: windowWidth/2 + albumBarHeight,
          }}
          onScroll={
            Animated.event(
              [
                {
                  nativeEvent: {contentOffset: {y: scrollY}},
                },
              ],
              {useNativeDriver: true},
            )
          }
        />
      </View>
    )
  }

  const renderImageBrowser = () => {
    return (
      <View style={{ flex: 1, backgroundColor: color.black1 }}>
        <View style={{ zIndex: 1, backgroundColor: color.black1}}>
          <SafeAreaView />
          <HeaderForm 
            headerCustomStyle={{ backgroundColor: color.black1 }}
            leftCustomButtonIcon={
              <TouchableOpacity 
                style={styles.compartmentHighlight}
                onPress={() => {
                  goBack();
                }}
              >
                <View style={styles.compartmentIconContainer}>
                  <Text style={styles.buttonIconText}>{chevronBack(RFValue(27), color.white2)}</Text>
                </View>
              </TouchableOpacity>
            }
            rightCustomButtonIcon={
              <TouchableOpacity 
                style={styles.compartmentHighlight}
                onPress={() => {
                  onFinish(selected);
                  goBack();
                }}
              >
                <View style={styles.compartmentIconContainer}>
                  <Text style={styles.buttonIconText}>Done</Text>
                </View>
              </TouchableOpacity>
            }

            headerTitle={
              selectedIds.length > 0 
              ?
              `${selectedIds.length} Selected`
              : "0 Selected"
            }
            middleTitleTextCustomStyle={{
              color: color.white2,
              fontSize: RFValue(17)
            }}
          />
        </View>
        <View>
          {/*
           -- use this view as the padding of the images flatlist
           -- tried putting padding using contentContainerStyle
           -- but it will make the flatlist goes all the way up
          */}
          <View style={{ height: headerHeight }}/>
          { renderImages() }
          { renderAlbumBar() }
          { selected && renderSelectedFiles() }
        </View>
      </View>
    );
  }

  const AlbumBox = ({ item }) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          // if the album box you choose is not same as the already chosen album box
          if (chosenAlbum !== item) {
            const clearPhotos = new Promise((res, rej) => {
              setPhotos([]);
              setAfter(null);
              setHasNextPage(true);
              res();
            });
            clearPhotos
            .then(() => {
              setChosenAlbum(item);
            });
          // if same then just go back to the default screen
          } else {
            setIsVisible('default');
          }
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{width: RFValue(100), height: RFValue(100)}}>
            { 
              item.mediaType === 'video'
              ?
              <View style={{width: RFValue(100), height: RFValue(100)}}>
                <Video
                  // ref={video}
                  style={{width: RFValue(100), height: RFValue(100)}}
                  source={{ uri: item.uri }}
                  useNativeControls={false}
                  resizeMode="contain"
                  shouldPlay={false}
                />
              </View>
              : item.mediaType === 'photo'
              ?
              <ImageBackground 
                // defaultSource={require('../../img/defaultImage.jpeg')}
                source={{ uri: item.uri }}
                resizeMode="contain"
                style={{width: RFValue(100), height: RFValue(100)}}
              />
              : null
            }
          </View>
          <View style={{ justifyContent: 'center', height: RFValue(100), paddingLeft: RFValue(9) }}>
            <View style={{ paddingTop: RFValue(5) }}>
              <Text style={{ color: color.white2, fontSize: RFValue(17) }}>{item.title}</Text>
            </View>
            <View style={{ paddingTop: RFValue(5) }}>
              <Text style={{ color: color.white2, fontSize: RFValue(17) }}>{item.assetCount}</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  const renderAlbumBox = ({ item, index }) => {
    return (
      <AlbumBox 
        item={item}
      />
    )
  };

  const renderAlbumList = () => {
    return (
      <View style={{ flex: 1, backgroundColor: color.black1 }}>
        <View>
          <SafeAreaView />
          <HeaderForm 
            headerCustomStyle={{ backgroundColor: color.black1 }}
            leftCustomButtonIcon={
              <TouchableOpacity 
                style={styles.compartmentHighlight}
                onPress={() => {
                  setIsVisible("default");
                }}
              >
                <View style={styles.compartmentIconContainer}>
                  <Text style={styles.buttonIconText}>{chevronBack(RFValue(27), color.white2)}</Text>
                </View>
              </TouchableOpacity>
            }
          />
        </View>
        <AlbumBox
          item={recentAlbum}
        />
        <View style={{ paddingLeft: RFValue(15), paddingVertical: RFValue(7) }}>
          <Text style={{ color: color.white2, fontWeight: 'bold', fontSize: RFValue(19) }}>My Albums</Text>
        </View>
        <FlatList
          data={albums}
          // key={numColumns}
          renderItem={renderAlbumBox}
          keyExtractor={(_, index) => index.toString()}
          // ListEmptyComponent={isEmpty ? renderEmptyStay() : renderPreloader()}
        />
      </View>
    )
  };

  // if (!hasCameraPermission) return noCameraPermissionComponent || null;

  return (
    <View style={styles.container}>
      {
        isVisible === 'default'
        ? renderImageBrowser()
        : isVisible === 'albums'
        ? renderAlbumList()
        : null
      }
      <StatusBar hidden={true} style="dark" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  compartmentHighlight: {
    justifyContent: 'center',
    alignItems: 'center',
    width: headerBoxHeight,
    height: headerBoxHeight,
    borderRadius: RFValue(100),
  },
  compartmentIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonIconText: {
    color: color.white2,
    fontSize: RFValue(17)
  },
});
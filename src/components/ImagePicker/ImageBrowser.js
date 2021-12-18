import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import * as ScreenOrientation from 'expo-screen-orientation';
import * as MediaLibrary from 'expo-media-library'
import * as Permissions from 'expo-permissions'
import ImageBox from './ImageBox';

const {width} = Dimensions.get('window');

// possible media types
// audio   'audio'
// photo   'photo'
// unknown 'unknown'
// video   'video'

// loadCompleteMetadata, loadCount, emptyStayComponent, preloaderComponent, mediaType
export default ImageBrowser = ({ 
  max, 
  loadCompleteMetadata, 
  loadCount, 
  emptyStayComponent, 
  preloaderComponent, 
  mediaType,
  onChange,
  callback,
  noCameraPermissionComponent,
  renderSelectedComponent,
  renderExtraComponent
}) => {

  // const [ hasCameraPermission, setHasCameraPermission ] = useState(null);
  // const [ hasCameraRollPermission, setHasCameraRollPermission ] = useState(null);
  const [ numColumns, setNumColumns ] = useState(null);
  const [ photos, setPhotos ] = useState([]);
  const [ selected, setSelected ] = useState([]);
  const [ isEmpty, setIsEmpty ] = useState(false);
  const [ after, setAfter ] = useState(null);
  const [ hasNextPage, setHasNextPage ] = useState(true);

  useEffect(() => {
    // getPermissionsAsync();
    ScreenOrientation.addOrientationChangeListener(onOrientationChange);
    const orientation = ScreenOrientation.getOrientationAsync();
    const numCol = getNumColumns(orientation);
    setNumColumns(numCol);
    getPhotos();
  }, []);

  useEffect(() => {
    if (selected.length > 0) {
      onChange(selected.length, () => prepareCallback());
    }
  }, [selected]);

  // const getPermissionsAsync = async () => {
  //   const {status: camera} = await Permissions.askAsync(Permissions.CAMERA);
  //   const {status: cameraRoll} = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
  //   setHasCameraPermission(camera === "granted");
  //   setHasCameraRollPermission(cameraRoll === "granted");
  // }

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

  const selectImage = (index) => {
    console.log("selected", selected);
    let newSelected = Array.from(selected);
    // if newSelected has index push index
    if (newSelected.indexOf(index) === -1) {
      newSelected.push(index);
    } else {
    // else exclude the index
      const deleteIndex = newSelected.indexOf(index);
      newSelected.splice(deleteIndex, 1);
    }
    // if newSelected's length is longer than max just return
    if (newSelected.length > max) return;
    if (!newSelected) newSelected = []; 
    setSelected(newSelected);
    
    console.log("newSelected: ", newSelected);
    // do above first and do onChange
    
  }

  const getPhotos = () => {
    const params = {
      first: loadCount,
      mediaType: mediaType,
      sortBy: [MediaLibrary.SortBy.creationTime]
    };
    if (after) params.after = after;
    if (!hasNextPage) return;
    MediaLibrary
    .getAssetsAsync(params)
    .then(processPhotos);
  }

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
    const length = width / 4;
    return {length, offset: length * index, index};
  }

  const prepareCallback = async () => {
    const selectedPhotos = selected.map(i => photos[i]);
    if (!loadCompleteMetadata){
      callback(await Promise.all(selectedPhotos));
    }
    else {
      const assetsInfo = await Promise.all(selectedPhotos.map(i => MediaLibrary.getAssetInfoAsync(i)));
      callback(assetsInfo);
    }
  };

  const renderImageTile = ({item, index}) => {
    const selectedOrNot = selected.indexOf(index) !== -1;
    const selectedItemNumber = selected.indexOf(index) + 1;
    return (
      <ImageBox
        selectedItemNumber={selectedItemNumber}
        item={item}
        index={index}
        selected={selectedOrNot}
        selectImage={selectImage}
        renderSelectedComponent={renderSelectedComponent}
        renderExtraComponent={renderExtraComponent}
      />
    );
  }

  const renderPreloader = () => preloaderComponent;

  const renderEmptyStay = () => emptyStayComponent;

  const renderImages = () => {
    return (
      <FlatList
        data={photos}
        numColumns={numColumns}
        key={numColumns}
        renderItem={renderImageTile}
        keyExtractor={(_, index) => index}
        onEndReached={() => getPhotos()}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={isEmpty ? renderEmptyStay() : renderPreloader()}
        initialNumToRender={24}
        getItemLayout={getItemLayout}
      />
    );
  }

  // if (!hasCameraPermission) return noCameraPermissionComponent || null;

  return (
    <View style={styles.container}>
      {renderImages()}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
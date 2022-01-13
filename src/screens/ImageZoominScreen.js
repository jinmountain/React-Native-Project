import React, { useState, useEffect, useRef }from 'react';
import { 
	Text, 
	StyleSheet, 
	View, 
	Image, 
	Dimensions,
	SafeAreaView,
	Animated,
} from 'react-native';
// import ImageView from "react-native-image-viewing";
import { Video, AVPlaybackStatus } from 'expo-av';
import ImageViewer from 'react-native-image-zoom-viewer';

// Components
import MainTemplate from '../components/MainTemplate';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { HeaderForm } from '../components/HeaderForm';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// icon
import {ioniconsMdArrowBack} from '../expoIcons';

// color
import color from '../color';

const ImageZoominScreen = ({ route, navigation }) => {
	const { file } = route.params;

	// const [visible, setVisible] = useState(true);
	const [ hideSurrounds, setHideSurrounds ] = useState(false);

	return (
		<View style={styles.screenContainer}>
			<Animated.View 
				style={[
					styles.headerBarContainer,
					{ transform: [{translateY: 0}] }
				]}

			>
				<SafeAreaView/>
				<HeaderForm 
					leftButtonTitle={null}
					leftButtonIcon={ioniconsMdArrowBack(RFValue(27), color.black1)}
	        leftButtonPress={() => {
	          navigation.goBack(); 
	        }}
				/>
			</Animated.View>
			<View style={styles.fileContainer}>
				{
					file.type == 'image'
					?
					<ImageViewer
						onMove={() => {
							
						}}
					  imageUrls={[{ url: file.url }]}
					  onSwipeDown={() => {
					  	navigation.goBack();
					  }}
					  backgroundColor={color.black1}
					  enableSwipeDown={true}
					  renderIndicator={() => {
					  	null;
					  }}
					  onClick={() => {
					  	setHideSurrounds(!hideSurrounds);
					  }}
					  saveToLocalByLongPress={false}
					/>
					: file.type  == 'video'
					?
					<Video
            // ref={video}
            style={styles.video}
            source={{
              uri: file.url,
            }}
            useNativeControls={true}
            resizeMode="contain"
            shouldPlay={true}
          />
          :
          null
				}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	screenContainer: {
		flex: 1,
		backgroundColor: color.white2
	},
	headerBarContainer: { 
		position: 'absolute',
		width: '100%',
		backgroundColor: color.white2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    // for android
    elevation: 5,
    // for ios
    zIndex: 5
  },
	fileContainer: {
		elevation: 10,
		flex: 1,
		justifyContent: 'center',
		backgroundColor: color.white2
	},
	image: {
		width: windowWidth, 
		height: windowWidth
	},
	video: {
		// backgroundColor: color.white2, 
		width: windowWidth, 
		height: windowWidth
	},
});
export default ImageZoominScreen;

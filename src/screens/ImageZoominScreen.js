import React, { useState, useEffect, useRef }from 'react';
import { 
	Text, 
	StyleSheet, 
	View, 
	Image, 
	Dimensions 
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
import expoIcons from '../expoIcons';

// color
import color from '../color';

const ImageZoominScreen = ({ route, navigation }) => {
	const { file } = route.params;

	// const [visible, setVisible] = useState(true);
	const [ hideSurrounds, setHideSurrounds ] = useState(false);

	return (
		<View style={styles.screenContainer}>
			<HeaderForm 
				addPaddingTop={true}
				leftButtonTitle={null}
				leftButtonIcon={expoIcons.ioniconsMdArrowBack(RFValue(27), color.black1)}
        leftButtonPress={() => {
          navigation.goBack(); 
        }}
			/>
			<View style={styles.fileContainer}>
				{
					file.type == 'image'
					?
					<ImageViewer
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
		justifyContent: 'center',
	},
	fileContainer: {
		elevation: 10,
		flex: 1,
		justifyContent: 'center',
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

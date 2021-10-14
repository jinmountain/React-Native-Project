import React, { useState, useEffect, }from 'react';
import { 
	Text, 
	StyleSheet, 
	View, 
	Image, 
	Dimensions, 
	Alert, 
} from 'react-native';
// import ImageView from "react-native-image-viewing";
import { Video, AVPlaybackStatus } from 'expo-av';

// Components
import MainTemplate from '../components/MainTemplate';
import { NavigationBar } from '../components/NavigationBar';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { HeaderForm } from '../components/HeaderForm';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// icon
import expoIcons from '../expoIcons';

// color
import color from '../color';

const ImageZoominScreen = ({ route, isFocused, navigation }) => {
	const { file } = route.params;

	// const [visible, setVisible] = useState(true);

	return (
		<MainTemplate>
			<HeaderForm 
				leftButtonTitle={null}
				leftButtonIcon={expoIcons.ioniconsMdArrowBack(RFValue(27), color.black1)}
        leftButtonPress={() => {
          navigation.goBack(); 
        }}
			/>
			{/*<View style={styles.screenContainer}>
				<ImageView
				  images={[{ uri: imageUri }]}
				  imageIndex={0}
				  visible={visible}
				  onRequestClose={() => {
				  	setVisible(false);
				  }}
				/>
			</View>*/}

			<View style={styles.fileContainer}>
				{
					file.type == 'image'
					?
					<Image 
	          source={{uri: file.url}}
	          style={styles.image}
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
		</MainTemplate>
	);
};

const styles = StyleSheet.create({
	screenContainer: {
		flex: 1,
		justifyContent: 'center',
	},
	fileContainer: {
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

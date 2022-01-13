import React, { useState, useEffect }from 'react';
import { 
	View, 
	Image, 
} from 'react-native';
import * as VideoThumbnails from 'expo-video-thumbnails';

// Color
import color from '../color';

const VideoThumbnail = ({ width, height, url }) => {
	const [image, setImage] = useState(null);

	useEffect(() => {
		console.log("url: ", url);
		generateThumbnail(url);
	}, []);

	const generateThumbnail = async () => {
    try {
      const { thumbnailUri } = await VideoThumbnails.getThumbnailAsync(
        url,
        {
          time: 0,
          quality: 0
        }
      );
      setImage(thumbnailUri);
    } catch (e) {
      console.warn(e);
    }
  };

	return (
		<View style={{width: width, height: height}}>
      <Image
        // ref={video}
        style={{
        	backgroundColor: color.white2,  
        	width: width, 
        	height: height
        }}
        source={{
          uri: image,
        }}
        resizeMode="contain"
      />
    </View>
	)
};

export default VideoThumbnail;

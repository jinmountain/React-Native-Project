import React, { useState } from 'react';
import { 
	View, 
	StyleSheet, 
	Image,
} from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';

const DisplayPostImage = ({ type, url, imageWidth }) => {

  const [status, setStatus] = React.useState({});

	return (
    type === 'video'
    ?
    <View style={{ width: imageWidth, height: imageWidth }}>
      <Video
        // ref={video}
        style={styles.postImage}
        source={{
          uri: url,
        }}
        useNativeControls={false}
        resizeMode="contain"
        shouldPlay={false}
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
    </View>
    : type === 'image'
    ?
    <Image
      defaultSource={require('../../../img/defaultImage.jpeg')}
    	style={{ width: imageWidth, height: imageWidth }} 
    	source={{ uri: url }}
    />
    : null
	)
}

const styles = StyleSheet.create({

});

export default DisplayPostImage;
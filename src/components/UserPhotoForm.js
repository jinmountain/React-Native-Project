import React from 'react';
import { 
	View,
	Image
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// components
import DefaultUserPhoto from './defaults/DefaultUserPhoto';

const UserPhotoForm = ({ photoURL, imageWidth, imageHeight }) => {
	return (
		photoURL
		?
		<Image 
      source={{uri: photoURL}}
      style={{ width: imageWidth, height: imageWidth, borderRadius: 100 }}
    />
		:
		<DefaultUserPhoto 
			customSizeBorder={imageWidth}
			customSizeUserIcon={imageWidth*0.63}
		/>
	)
};

export default UserPhotoForm;
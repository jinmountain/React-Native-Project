import React, { useEffect, useContext } from 'react';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

// Contexts
import { Context as PostContext } from '../context/PostContext';
import { Context as SocialContext } from '../context/SocialContext';

// import { navigate } from '../navigationRef';
import { useNavigation } from '@react-navigation/native';

// Firebase
import profilePhotoFire from '../firebase/profilePhotoFire';

export default () => {
	const [updateProfilePhotoFire] = profilePhotoFire();
	// const { addFile } = useContext(PostContext);
	// const { addFileChat } = useContext(SocialContext);
  const navigation = useNavigation();

	useEffect(() => {
	  (async () => {
	    if (Platform.OS !== 'web') {
	      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
	      if (status !== 'granted') {
	        alert('Sorry, we need camera roll permissions to make this work!');
	      }
	    }
	  })();
	}, []);

	const pickImage = async (screen, currentUser, addFile) => {
		return new Promise (async (res, rej) => {
			let result 
			if (screen === "profile") {
				result = await ImagePicker.launchImageLibraryAsync({
				  mediaTypes: ImagePicker.MediaTypeOptions.Images,
				  allowsEditing: true,
				  aspect: [1, 1],
				  quality: 1
				});
			} else {
				result = await ImagePicker.launchImageLibraryAsync({
				  mediaTypes: ImagePicker.MediaTypeOptions.All,
				  allowsEditing: true,
				  videoMaxDuration: 10, // maximum 10 seconds
				  aspect: [1, 1],
				  quality: 1 // compressed for maximum quality
				});
			}
			
			try {
				if(!result.cancelled) {
					//console.log(result);
					//console.log('file uri: ', result.uri);
					let lastIndexOfDash = result.uri.lastIndexOf('/');
					let lastIndexOfDot = result.uri.lastIndexOf(".") - lastIndexOfDash;
					// id is the combi of the file name and the current time
					let id = result.uri.substr(lastIndexOfDash+1, lastIndexOfDot-1).concat('_' + Date.now());
					//console.log('file id: ', id);
					//console.log('file type: ', result.type);
					if (result.type === 'video' && result.duration < 5000) {
						res({id: id, type: result.type, uri: result.uri});
						// if (screen === 'profile') {
						// 	updateProfilePhotoFire(result.uri, currentUser);
						// }

						// if (screen === 'post') {
						// 	addFile(id, result.type, result.uri);
						// }

						// if (screen === 'nav') {
						// 	addFile(id, result.type, result.uri);
						// 	navigation.navigate('ContentCreate');
						// }

						// if (screen === 'chat') {
						// 	addFileChat(id, result.type, result.uri);
						// }
					} 

					if (result.type === 'image') {
						res({id: id, type: result.type, uri: result.uri});
						// if (screen === 'profile') {
						// 	updateProfilePhotoFire(result.uri, currentUser);
						// }

						// if (screen === 'post') {
						// 	addFile(id, result.type, result.uri);
						// }

						// if (screen === 'nav') {
						// 	addFile(id, result.type, result.uri);
						// 	navigation.navigate('ContentCreate');
						// }

						// if (screen === 'chat') {
						// 	addFileChat(id, result.type, result.uri);
						// }
					}
				}
			} catch (error) {
				rej(error);
			}
		});
	};

	return [pickImage];
}
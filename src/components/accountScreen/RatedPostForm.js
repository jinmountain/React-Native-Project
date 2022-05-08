// -- React 
import React, { useEffect, useState } from 'react';
import { 
	View,
	StyleSheet,
	Image,
	ImageBackground,
	Text,  
	Pressable,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Video, AVPlaybackStatus } from 'expo-av';

// firebase
import {
	getUserPhotoURLFire
} from '../../firebase/user/usersGetFire';

// component
import DefaultUserPhoto from '../defaults/DefaultUserPhoto';
import { RatingReadOnly } from '../RatingReadOnly';
import MultiplePhotosIndicator from '../MultiplePhotosIndicator';

// color
import color from '../../color';

// expo icons

const RatedPostForm = ({ item, index, type }) => {
	const POST_IMAGE_SIZE = RFValue(150);

	const [ reviewerPhotoURL, setReviewerPhotoURL ] = useState(null);
	const [ reviewerPhotoReady, setReviewerPhotoReady ] = useState(false);
	useEffect(() => {
		if (type === "bus") {
			const getReviewerPhotoURL = getUserPhotoURLFire(item.data.uid);
			getReviewerPhotoURL
			.then((photoURL) => {
				setReviewerPhotoURL(photoURL);
				setReviewerPhotoReady(true);
			})
			.catch((error) => {

			});
		}
	}, []);

	return (
		<Pressable>
			<View style={styles.ratedPostContainer}>
				{
					reviewerPhotoReady &&
					<View style={styles.reviewerPhotoContainer}>
            { 
              reviewerPhotoURL
              ?
              <Image 
                style={styles.reviewerPhoto} 
                source={{ uri: reviewerPhotoURL }} 
              />
              : 
              <DefaultUserPhoto 
                customSizeBorder={RFValue(38)}
                customSizeUserIcon={RFValue(26)}
              />
            }
					</View>
				}
				{
					item.data.files.length > 0 &&
					<View>
	          { 
	            item.data.files[0].type === 'video'
	            ?
	            <View style={{width: POST_IMAGE_SIZE, height: POST_IMAGE_SIZE}}>
	              <Video
	                // ref={video}
	                style={{backgroundColor: color.white2, borderWidth: 0, width: POST_IMAGE_SIZE, height: POST_IMAGE_SIZE}}
	                source={{
	                  uri: item.data.files[0].url,
	                }}
	                useNativeControls={false}
	                resizeMode="contain"
	                shouldPlay={false}
	              />
	            </View>
	            : item.data.files[0].type === 'image'
	            ?
	            <ImageBackground 
	              // defaultSource={require('../../img/defaultImage.jpeg')}
	              source={{uri: item.data.files[0].url}}
	              style={{width: POST_IMAGE_SIZE, height: POST_IMAGE_SIZE}}
	            />
	            : null
	          }
	          { item.data.files.length > 1
	            ? <MultiplePhotosIndicator size={RFValue(16)}/>
	            : null
	          }
	        </View>
				}
        <View style={styles.reviewTextContainer}>
        	<View style={styles.ratingContainer}>
          	<RatingReadOnly rating={item.data.rating}/>
          </View>
        	<Text style={styles.reviewText}>
        		{item.data.caption}
        	</Text>
        </View>
      </View>
    </Pressable>
	)
};

const styles = StyleSheet.create({
  ratedPostContainer: {
  	flexDirection: 'row',
  	backgroundColor: color.white2
  },
  ratingContainer: {
  	paddingVertical: RFValue(5)
  },

  reviewerPhotoContainer: {
  	justifyContent: 'center',
  	alignItems: 'center',
  	padding: RFValue(10)
  },
  reviewerPhoto: {
  	width: RFValue(50),
  	height: RFValue(50),
  	borderRadius: RFValue(100)
  },
  reviewTextContainer: {
  	padding: RFValue(5)
  },
  reviewText: {
  	fontSize: RFValue(17)
  }
});

export default RatedPostForm;
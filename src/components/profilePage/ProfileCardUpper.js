import React, { useContext, useEffect, useState } from 'react';
import { 
	View, 
	StyleSheet,
	Text,  
	TouchableOpacity,
	Dimensions,
	Image,
} from 'react-native';

// Components
import DefaultUserPhoto from '../../components/defaults/DefaultUserPhoto';

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height

const ProfileCardUpper = ({photoURL, postCount, followerCount, followingCount}) => {
	return (
		<View style={styles.profileCardContainer}>
			<View style={styles.profilePictureContainer}>
				<TouchableOpacity style={styles.profilePictureButtonContainer}>
					{photoURL
						? <Image style={styles.profilePicture} source={{uri: photoURL}} />
						: <DefaultUserPhoto />
					}
				</TouchableOpacity>
			</View>
			<View style={styles.profileInfoContainer}>
				<View style={styles.numOfPostContainer}>
					<Text numberOfLines={1}>Posts</Text>
					<Text style={styles.value}>
						{ 
							postCount
							? postCount
							: 0
						}
					</Text>
				</View>
				<View style={styles.numOfPostContainer}>
					<Text numberOfLines={1}>Followers</Text>
					<Text style={styles.value}>36</Text>
				</View>
				<View style={styles.numOfPostContainer}>
					<Text numberOfLines={1}>Following</Text>
					<Text style={styles.value}>36</Text>
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
  profileCardContainer: {
  	height: windowHeight*0.15,
  	flexDirection: 'row',
  	paddingHorizontal: RFValue(10),
  	backgroundColor: '#fff',
  },
  profilePictureContainer: {
  	flex: 1,
  	justifyContent: 'center',
  	alignItems: 'center',
  },
  profilePicture: {
  	justifyContent: 'center',
  	alignItems: 'center',
  	width: RFValue(80),
  	height: RFValue(80),
  	borderWidth: 1,
  	borderColor: '#5A646A',
  	borderRadius: RFValue(100),
  },
  numOfPostContainer: {
  	flex: 1,
  	flexDirection: 'column',
  	alignItems: 'center',
  	justifyContent: 'center',
  },
  profileInfoContainer: {
  	flexDirection: 'row',
  	flex: 3,
  	justifyContent: 'space-around',
  },
  value: {
  	fontWeight: 'bold',
  	fontSize: RFValue(19),
  },
});

export default ProfileCardUpper;
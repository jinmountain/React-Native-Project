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

// color
import color from '../../color';

const ProfileCardUpper = ({photoURL, postCount, displayPostCount, followerCount, followingCount}) => {
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
				{
					displayPostCount &&
					<View style={styles.infoItemContainer}>
						<Text style={styles.labelText} numberOfLines={1}>Piece</Text>
						<Text style={styles.infoText}>
							{ 
								displayPostCount
								? displayPostCount
								: 0
							}
						</Text>
					</View>
				}
				<View style={styles.infoItemContainer}>
					<Text style={styles.labelText} numberOfLines={1}>Post</Text>
					<Text style={styles.infoText}>
						{ 
							postCount
							? postCount
							: 0
						}
					</Text>
				</View>
				<View style={styles.infoItemContainer}>
					<Text style={styles.labelText} numberOfLines={1}>Follower</Text>
					<Text style={styles.infoText}>36</Text>
				</View>
				<View style={styles.infoItemContainer}>
					<Text style={styles.labelText} numberOfLines={1}>Following</Text>
					<Text style={styles.infoText}>36</Text>
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
  profileCardContainer: {
  	flexDirection: 'row',
  	justifyContent: 'center',
  	alignItems: 'center',
  	backgroundColor: color.white2,
  	paddingVertical: RFValue(5),
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
  infoItemContainer: {
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
  labelText: {
  	color: color.grey3,
  	fontWeight: 'bold',
  	fontSize: RFValue(11)
  },
  infoText: {
  	fontWeight: 'bold',
  	fontSize: RFValue(19),
  },
});

export default ProfileCardUpper;
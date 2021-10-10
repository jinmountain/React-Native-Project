import React from 'react';
import { 
  View, 
  Text, 
  Image,
  StyleSheet,  
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView, } from 'react-native-safe-area-context';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import { RatingReadOnly } from '../RatingReadOnly';

const { width, height } = Dimensions.get("window");
const cardHeight = height * 0.85;

const PostBusinessUserInfoContainer = ({ businessUser }) => {
  return (
    <View style={styles.businessUserInfoContainer}>
      <View style={styles.businessPhotoContainer}>
        <Image 
          style={styles.businessPhoto} 
          source={{ uri: businessUser.photoURL }} 
        />
      </View>
      <View style={styles.businessInfoContainer}>
        <Text 
          numberOfLines={1}
          style={styles.businessUsernameText}>
          {businessUser.username}
        </Text>
        { 
          businessUser.totalRating
          ? <RatingReadOnly 
              rating={Number((Math.round(businessUser.totalRating/businessUser.countRating * 10) / 10).toFixed(1))} 
            />
          : null
        }
      </View>
      <View style={styles.businessActionContainer}>
        <TouchableOpacity
          style={styles.followButtonContainer}
        >
          <Text style={styles.followText}>
            Follow
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.bookButtonContainer}
        >
          <Text style={styles.bookText}>
            Book
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  businessUserInfoContainer: {
    flexDirection:'row',
    alignItems: 'center',
    paddingLeft: 10,
    backgroundColor: '#fff',
    width: width,
    paddingVertical: 3,
    height: cardHeight * 0.1,
  },
  businessPhotoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3,
  },
  businessPhoto: {
    width: RFValue(38),
    height: RFValue(38),
    borderRadius: RFValue(38),
  },
  businessInfoContainer: {
    marginHorizontal: 6,
  },
  businessActionContainer: {
    flexDirection: 'row',
  },
  followButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginHorizontal: 3,
  },
  followText: {
    fontWeight: 'bold',
    fontSize: RFValue(16),
  },
  bookButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 3,
  },
  bookText: {
    fontWeight: 'bold',
    fontSize: RFValue(16),
  },
});

export default PostBusinessUserInfoContainer;
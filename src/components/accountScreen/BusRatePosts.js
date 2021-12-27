import React, { useState, useEffect, } from 'react';
import { 
	View, 
	Text, 
	StyleSheet,
	TouchableWithoutFeedback,
  Dimensions,
  Image,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from '@react-navigation/native';
import { Video, AVPlaybackStatus } from 'expo-av';

// Designs
import { AntDesign } from '@expo/vector-icons';

// Components
import MultiplePhotosIndicator from '../MultiplePhotosIndicator';

// Color
import color from '../../color';

// hooks
import { useOrientation } from '../../hooks/useOrientation';

const BusRatePosts = ({ 

}) => {
  const navigation = useNavigation();
  const [defaultPosts, setDefaultPosts] = useState(Array(9).fill(0));
  const [ threePostsRowImageWH, setThreePostsRowImageWH ] = useState(Dimensions.get("window").width/3-2);

  const orientation = useOrientation();

  useEffect(() => {
    setThreePostsRowImageWH(Dimensions.get("window").width/3-2);
  }, [orientation]);

	return (
    <View style={[styles.container, {paddingBottom: RFValue(150)}]}>
    {
      defaultPosts.map((item, index) => 
      (
        <View
          key={index}
          style={[styles.imageContainer, 
            index % 3 !== 0 ? { paddingLeft: 2 } : { paddingLeft: 0 }
          ]}
        >
          <View style={{width: threePostsRowImageWH, height: threePostsRowImageWH, backgroundColor: color.grey1 }}>
          </View>
        </View>
      ))
    }
    </View>
	)
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white2,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 2,
  },
  emptyPostContainer: {
    marginVertical: RFValue(7),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyPostText: {
    fontSize: RFValue(17),
    color: color.gray3,
  },
});

export default BusRatePosts;
import React from 'react'
import { 
	Text,
	View, 
	StyleSheet,
	Dimensions
} from 'react-native';

// NPMs
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Color
import color from '../../color';

// expo icons
import expoIcons from '../../expoIcons';

// Designs
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const windowWidth = Dimensions.get("window").width;

const DisplayPostsDefault = () => {
	return (
		<View style={styles.displayPostsContainer}>
			<View style={styles.displayPostsDefaultContainer}>
			  <View style={styles.cloudContainer}>
			  	{expoIcons.snailShell(RFValue(33), color.red2)}
			  </View>
			  <View style={styles.cloudContainer}>
			  	{expoIcons.snailShell(RFValue(33), color.red2)}
			  </View>
			</View>
		</View>
	)
};

const styles = StyleSheet.create({
	displayPostsContainer: {
		height: windowWidth/2 + RFValue(30),
		width: '100%',
		backgroundColor: '#fff',
		// shadowColor: "#000",
  	//   shadowOffset: { width: 0, height: -2 },
  	//   shadowOpacity: 0.3,
    // shadowRadius: 3,
	},
	displayPostsDefaultContainer: {
		flexDirection: 'row',
		height: windowWidth/2 + RFValue(30),
  	width: windowWidth,
  	justifyContent: 'center', 
  	alignItems: 'center', 
	},
	cloudContainer: {
 		flex: 1,
		justifyContent: 'center', 
  	alignItems: 'center',
  },
  text: {
  	fontSize: RFValue(17),
  	color: color.grey3,
  },
});

export default DisplayPostsDefault;
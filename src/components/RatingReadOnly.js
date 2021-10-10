import React, { useState } from 'react';
import {
  View,
  StyleSheet,
} from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Designs
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

// Color
import color from '../color';

// function getRandomColor() {
//   var letters = '0123456789ABCDEF';
//   var color = '#';
//   for (var i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// };

const RatingReadOnly = ({rating}) => {
	// const [ randomColor, setRandomColor ] = useState(getRandomColor());
	return (
		<View style={styles.ratingContainer}>
			<View style={styles.iconContainer}>
				{ rating !== null && rating >= 1 
					? <FontAwesome name="star" size={RFValue(17)} color={color.yellow2} />
					: rating !== null && rating >= 0.5
					? <FontAwesome name="star-half" size={RFValue(17)} color={color.yellow2} />
					: <FontAwesome name="star-o" size={RFValue(17)} color={color.ratingGuide} />
				}
			</View>
			<View style={styles.iconContainer}>
				{ rating !== null && rating >= 2 
					? <FontAwesome name="star" size={RFValue(17)} color={color.yellow2} />
					: rating !== null && rating >= 1.5
					? <FontAwesome name="star-half" size={RFValue(17)} color={color.yellow2} />
					: <FontAwesome name="star-o" size={RFValue(17)} color={color.ratingGuide} />
				}
			</View>
			<View style={styles.iconContainer}>
				{ rating !== null && rating >= 3 
					? <FontAwesome name="star" size={RFValue(17)} color={color.yellow2} />
					: rating !== null && rating >= 2.5
					? <FontAwesome name="star-half" size={RFValue(17)} color={color.yellow2} />
					: <FontAwesome name="star-o" size={RFValue(17)} color={color.ratingGuide} />
				}
			</View>
			<View style={styles.iconContainer}>
				{ rating !== null && rating >= 4 
					? <FontAwesome name="star" size={RFValue(17)} color={color.yellow2} />
					: rating !== null && rating >= 3.5
					? <FontAwesome name="star-half" size={RFValue(17)} color={color.yellow2} />
					: <FontAwesome name="star-o" size={RFValue(17)} color={color.ratingGuide} />
				}
			</View>
			<View style={styles.iconContainer}>
				{ rating !== null && rating >= 5 
					? <FontAwesome name="star" size={RFValue(17)} color={color.yellow2} />
					: rating !== null && rating >= 4.5
					? <FontAwesome name="star-half" size={RFValue(17)} color={color.yellow2} />
					: <FontAwesome name="star-o" size={RFValue(17)} color={color.ratingGuide} />
				}
			</View>
    </View>
	);
};

const styles = StyleSheet.create({
	ratingContainer: {
		flexDirection: 'row',
	},
	iconContainer: {
    padding: RFValue(1),
    marginVertical: RFValue(3),
	},
});

export { RatingReadOnly };
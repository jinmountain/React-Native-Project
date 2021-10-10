import React from 'react';
import { 
	View, 
	StyleSheet,
	Text,  
	Dimensions
} from 'react-native';

// NPMs
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Designs
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

// Color
import color from '../../color';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const DisplayPostInfo = ({ containerWidth, title, taggedCount, likeCount, etc, price }) => {
	return (
		<View style={{ ...styles.displayPostInfoContainer, ...{ width: containerWidth } }}>
			<View style={styles.infoTop}>
				<Text style={styles.infoText}>
					{title}
				</Text>
			</View>
			<View style={styles.infoBottom}>
				<View style={styles.infoContainer}>
					<AntDesign name="hearto" size={RFValue(11)} color={color.ratingRed} />
					<Text style={styles.infoText}>
						{likeCount}
			  	</Text>
				</View>
				<View style={styles.infoContainer}>
					<Text style={styles.infoText}>
						${price}
			  	</Text>
				</View>
				<View style={styles.infoContainer}>
			  	<AntDesign name="clockcircleo" size={RFValue(11)} color={color.black1} />
			  	<Text style={styles.infoText}>
						{etc}
			  	</Text>
				</View>
				<View style={styles.infoContainer}>
					<AntDesign name="staro" size={RFValue(11)} color={color.black1} />
					<Text style={styles.infoText}>
						{taggedCount}
			  	</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({ 
	displayPostInfoContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 2,
		backgroundColor: color.white1,
		paddingVertical: RFValue(3),
	},
	infoContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: RFValue(3),
	},
	infoTop: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	infoBottom: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	infoText: {
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: RFValue(3),
	},
});

export default DisplayPostInfo;

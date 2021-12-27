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

// icon
import expoIcons from '../../expoIcons';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const DisplayPostInfo = ({ containerWidth, title, taggedCount, likeCount, etc, price }) => {
	return (
		<View style={{ ...styles.displayPostInfoContainer, ...{ width: containerWidth } }}>
			<View style={styles.infoTop}>
				<Text style={styles.infoTitleText} numberOfLines={1}>
					{title}
				</Text>
			</View>
			<View style={styles.infoBottom}>
				<View style={styles.infoContainer}>
					<AntDesign name="hearto" size={RFValue(11)} color={color.ratingRed} />
					<Text style={styles.infoText} numberOfLines={1}>
						{likeCount}
			  	</Text>
				</View>
				<View style={styles.infoContainer}>
					<Text style={styles.infoText} numberOfLines={1}>
						${price}
			  	</Text>
				</View>
				<View style={styles.infoContainer}>
					{expoIcons.clockIcon(RFValue(11), color.black1)}
			  	<Text style={styles.infoText} numberOfLines={1}>
						{etc}
			  	</Text>
				</View>
				<View style={styles.infoContainer}>
					<AntDesign name="staro" size={RFValue(11)} color={color.black1} />
					<Text style={styles.infoText} numberOfLines={1}>
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
		backgroundColor: color.white2,
		paddingVertical: RFValue(3),
		height: RFValue(50),
	},
	infoContainer: {
		flex: 1,
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
		paddingVertical: 1
	},
	infoTitleText: {
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: RFValue(3),
		fontSize: RFValue(15),
		fontWeight: 'bold'
	},
	infoText: {
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: RFValue(3),
		fontSize: RFValue(11),
		color: color.grey3
	},
});

export default DisplayPostInfo;

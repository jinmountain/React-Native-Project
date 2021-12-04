import React from 'react';
import { 
	Text, 
	View,  
	StyleSheet, 
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView, } from 'react-native-safe-area-context';

// Color
import color from '../color';

// Designs
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ResolveAuthScreen = () => {
	return (
		<SafeAreaView
			style={styles.resolveAuthScreenContainer}
		>
			<View style={styles.brandContainer}>
				<Text>
					<MaterialCommunityIcons name="alpha-s-box-outline" size={RFValue(27)} color={color.black1} />
					<MaterialCommunityIcons name="alpha-n-box" size={RFValue(27)} color={color.black1} />
					<MaterialCommunityIcons name="alpha-a-box-outline" size={RFValue(27)} color={color.black1} />
					<MaterialCommunityIcons name="alpha-i-box" size={RFValue(27)} color={color.black1} />
					<MaterialCommunityIcons name="alpha-l-box-outline" size={RFValue(27)} color={color.black1} />
				</Text>
				<Text>
					There are over 40,000 species of snails all over the world
				</Text>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	resolveAuthScreenContainer: {
		flex: 1,
	},
	brandContainer: {
		flex: 1,
		backgroundColor: color.white1,
		justifyContent: 'center',
		alignItems: 'center',
	},

});

export default ResolveAuthScreen;
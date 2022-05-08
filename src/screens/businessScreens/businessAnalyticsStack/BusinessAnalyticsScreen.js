import React, { useState } from 'react';
import { 
	Text, 
	View, 
	ScrollView,
	StyleSheet, 
	TouchableOpacity,
	TouchableHighlight,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Designs

// Contexts

// Hooks
// import useConvertTime from '../../../hooks/useConvertTime';

// Components
import MainTemplate from '../../../components/MainTemplate';
import BarGraph from '../../../components/BarGraph';
import THButtonWithBorder from '../../../components/buttons/THButtonWithBorder';
import KitkatButton from '../../../components/buttons/KitkatButton';
import HeaderBottomLine from '../../../components/HeaderBottomLine';

// Color
import color from '../../../color';

// const FlashCard

const BusinessAnalyticsScreen = ({ navigation }) => {

	return (
		<MainTemplate>
			<ScrollView>
				<View style={styles.labelContainer}>
					<Text style={styles.labelText}>Analytics</Text>
				</View>
				<HeaderBottomLine />
				<KitkatButton 
					text={"Reservation"}
					onPress={() => {
						navigation.navigate("ReservationAnalytics");
					}} 
				/>
				<HeaderBottomLine />
				<KitkatButton 
					text={"Post"} 
				/>
				<HeaderBottomLine />
				<KitkatButton 
					text={"Customer"}
				/>
				<HeaderBottomLine />
				<KitkatButton 
					text={"Technician"} 
				/>
			</ScrollView>
		</MainTemplate>
  );
};

const styles = StyleSheet.create({
	graphContainer: {
		flex: 1,
		paddingHorizontal: RFValue(3),
	},

	labelContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: color.white2,
		paddingVertical: RFValue(7),
	},
	labelText: {
		fontSize: RFValue(17),
	},
});

export default BusinessAnalyticsScreen;
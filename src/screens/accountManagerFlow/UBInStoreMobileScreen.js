import React, { useContext }from 'react';
import { 
	Text,
	StyleSheet, 
	View,
	TouchableHighlight,
	TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import { HeaderForm } from '../../components/HeaderForm';

// Designs
import { AntDesign } from '@expo/vector-icons';

// Context
import { Context as LocationContext } from '../../context/LocationContext';

const UBInStoreMobileScreen = ({ navigation }) => {
	const { 
		state: {
			locationType,
		},
		addLocationType,
	} = useContext(LocationContext);

	return (
		<SafeAreaView style={styles.screenContainer}>
			<HeaderForm 
				leftButtonTitle="Back"
		    headerTitle="In-Store or Mobile" 
		    rightButtonTitle={null}
		    leftButtonPress={() => {
		    	navigation.goBack();
		    }}
    		rightButtonPress={() => {
    			null;
    		}}
		  />
			<View style={styles.buttonListContainer}>
				<TouchableHighlight
					style={styles.buttonConatiner}
					underlayColor="#E9FEFF"
					onPress={() => {
						addLocationType('inStore');
						navigation.goBack();
					}}
				>
					<View style={styles.buttonTextContainer}>
						<AntDesign name="isv" size={RFValue(28)} color="black" />
						<Text style={styles.buttonText}>
							In-Store
						</Text>
					</View>
				</TouchableHighlight>
				<TouchableHighlight
					style={styles.buttonConatiner}
					underlayColor="#E9FEFF"
					onPress={() => {
						addLocationType('mobile');
						navigation.goBack();
					}}
				>
					<View style={styles.buttonTextContainer}>
						<AntDesign name="rocket1" size={24} color="black" />
						<Text style={styles.buttonText}>
							Mobile
						</Text>
					</View>
				</TouchableHighlight>
			</View>
			<View style={{flex: 1}}>
			</View>
		</SafeAreaView>
	)
};

const styles = StyleSheet.create({
	screenContainer: {
		flex: 1,
		backgroundColor: "#F9F9F9",
	},
	buttonListContainer: {
		flex: 1,
	},
	buttonConatiner: {
		flex: 1,
	},
	buttonTextContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonText: {
		fontSize: RFValue(20),
		marginHorizontal: 10,
	},
});

export default UBInStoreMobileScreen;
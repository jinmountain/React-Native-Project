import React, { useContext }from 'react';
import { 
	Text,
	StyleSheet, 
	View,
	TouchableHighlight,
	TouchableOpacity,
	SafeAreaView
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import { HeaderForm } from '../../components/HeaderForm';

// Designs
import { AntDesign } from '@expo/vector-icons';

// color
import color from '../../color';

// expo icons
import { chevronBack } from '../../expoIcons';

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
		<View style={styles.screenContainer}>
			<View style={styles.headerBarContainer}>
				<SafeAreaView/>
				<HeaderForm 
					leftButtonIcon={ chevronBack(RFValue(27),	color.black1) }
			    headerTitle="In-Store or Mobile" 
			    rightButtonTitle={null}
			    leftButtonPress={() => {
			    	navigation.goBack();
			    }}
	    		rightButtonPress={() => {
	    			null;
	    		}}
			  />
			</View>
			
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
		</View>
	)
};

const styles = StyleSheet.create({
	screenContainer: {
		flex: 1,
		backgroundColor: color.white2,
	},
	headerBarContainer: { 
		backgroundColor: color.white2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    // for android
    elevation: 5,
    // for ios
    zIndex: 5
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
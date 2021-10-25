import React, { useState, useEffect, useContext }from 'react';
import { 
	Text,
	StyleSheet, 
	View,
	Switch,
	TouchableOpacity, 
	TextInput,
	FlatList,
	ScrollView } from 'react-native';
import { SafeAreaView, } from 'react-native-safe-area-context';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Componenets
import { HeaderForm } from '../../components/HeaderForm';
import KitkatButton from '../../components/buttons/KitkatButton';
import HeaderBottomLine from '../../components/HeaderBottomLine';

// Context
import { Context as AuthContext } from '../../context/AuthContext';

// icon
import expoIcons from '../../expoIcons';

// color
import color from '../../color';


const UpdateBusinessScreen = ({ navigation }) => {
	const { 

	} = useContext(AuthContext);
	const [ businessOpen, setbusinessOpen ] = useState(false);
  const toggleSwitch = () => setbusinessOpen(previousState => !previousState);
	return (
		<SafeAreaView style={styles.updateBusinessScreenContainer}>
			<HeaderForm 
        leftButtonTitle={null}
        leftButtonIcon={expoIcons.ioniconsMdArrowBack(RFValue(27), color.black1)}
        headerTitle={"Update Business Information"} 
        rightButtonTitle={null} 
        leftButtonPress={() => {
          navigation.goBack();
        }}
        rightButtonPress={() => {
          {
            null
          }
        }}
      />
			<View style={styles.businessManagerContainer}>
				<View style={styles.businessOpenStatusContainer}>
					<View style={styles.statusTextContainer}>
						<Text style={styles.statusText}>
							Business Open Status
						</Text>
					</View>
					<View style={styles.switchContainer}>
						<View style={styles.onOffStatusConatiner}>
							{ businessOpen === false
								? <Text style={[styles.onOffText, { color: "#252525" }]}>Closed</Text>
								: <Text style={[styles.onOffText, { color: "#1069FF" }]}>Open</Text>
							}
						</View>
						<Switch
			        trackColor={{ false: '#767577', true: '#81b0ff' }}
			        thumbColor={businessOpen ? '#f4f3f4' : '#f4f3f4'}
			        ios_backgroundColor="#3e3e3e"
			        onValueChange={toggleSwitch}
			        value={businessOpen}
			      />
		     	</View>
		    </View>
		    <HeaderBottomLine />
		    <KitkatButton
					onPress={() => {
		    		navigation.navigate("UBLocationAddress")
		    	}}
					icon={expoIcons.evilIconsLocation(RFValue(27), color.black1)}
					text={"Change Location & Address"}
				/>
				<KitkatButton
					onPress={() => {
		    		navigation.navigate("DeregisterBusiness")
		    	}}
					icon={null}
					text={"Deregister Business"}
				/>
		  </View>
		</SafeAreaView>
	)
};

const styles = StyleSheet.create({
	updateBusinessScreenContainer: {
		flex: 1,
		backgroundColor: "#FFF"
	},
	businessManagerContainer: {
	},
	businessOpenStatusContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginVertical: 10,
	},
	statusTextContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	statusText: {
		fontSize: RFValue(17),
	},
	switchContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	buttonContainer: {
		paddingVertical: RFValue(10),
		marginVertical: 1,
		backgroundColor: "#F0F0F0",
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonText: {
		fontWeight: 'bold',
		fontSize: RFValue(20),
	},
	onOffStatusConatiner: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	onOffText: {
		fontWeight: 'bold',
		fontSize: RFValue(15),
	}
});

export default UpdateBusinessScreen;
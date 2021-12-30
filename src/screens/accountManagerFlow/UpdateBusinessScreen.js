import React, { useState, useEffect, useContext }from 'react';
import { 
	Text,
	StyleSheet, 
	View,
	Switch,
	TouchableOpacity,
	SafeAreaView,
	TextInput,
	FlatList,
	ScrollView } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Componenets
import { HeaderForm } from '../../components/HeaderForm';
import KitkatButton from '../../components/buttons/KitkatButton';
import HeaderBottomLine from '../../components/HeaderBottomLine';
import MainTemplate from '../../components/MainTemplate';

// Context
import { Context as AuthContext } from '../../context/AuthContext';

// icon
import expoIcons from '../../expoIcons';

// color
import color from '../../color';

// design
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const UpdateBusinessScreen = ({ navigation }) => {
	const { 
		user
	} = useContext(AuthContext);
	const [ businessOpen, setbusinessOpen ] = useState(false);
  const toggleSwitch = () => setbusinessOpen(previousState => !previousState);
	return (
		<View style={styles.updateBusinessScreenContainer}>
			<View style={styles.headerBarContainer}>
				<SafeAreaView/>
				<HeaderForm 
	        leftButtonTitle={null}
	        leftButtonIcon={expoIcons.ioniconsMdArrowBack(RFValue(27), color.black1)}
	        headerTitle={"Update Business"} 
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
			</View>
			<View style={styles.businessManagerContainer}>
				{/*<View style={styles.businessOpenStatusContainer}>
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
		    </View>*/}
		    <KitkatButton
					onPress={() => {
						navigation.navigate('SetBusinessHoursStack', {
							screen: 'SetBusinessHours',
							params: { 
								userType: 'bus'
							}
						})
					}}
					icon={<MaterialCommunityIcons name="clock-outline" size={RFValue(27)} color={color.black1} />}
					text={"Set Business Hours"}
				/>
				<KitkatButton
					onPress={() => {
						navigation.navigate('SetSpecialHoursStack', {
							screen: 'SetSpecialHours',
							params: { 
								userType: 'bus'
							}
						})
					}}
					icon={<MaterialCommunityIcons name="timeline-clock-outline" size={RFValue(27)} color={color.black1} />}
					text={"Add Special Hours"}
				/>
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
					icon={<Ionicons name="log-out-outline" size={RFValue(27)} color={color.black1} />}
					text={"Deregister Business"}
				/>
		  </View>
		</View>
	)
};

const styles = StyleSheet.create({
	updateBusinessScreenContainer: {
		flex: 1,
		backgroundColor: "#FFF"
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
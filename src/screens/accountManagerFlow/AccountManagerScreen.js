import React, { useState, useContext }from 'react';
import { 
	Text, 
	View, 
	StyleSheet,
	TouchableOpacity,
	TouchableHighlight,
	Dimensions,
	ScrollView,
} from 'react-native';
// import { SafeAreaView, } from 'react-native-safe-area-context';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Contexts
import { Context as AuthContext } from '../../context/AuthContext';

// Designs
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Componenets
import { HeaderForm } from '../../components/HeaderForm';
import AlertBoxTop from '../../components/AlertBoxTop'; 
import AccountManagerButton from '../../components/buttons/AccountManagerButton';
import MainTemplate from '../../components/MainTemplate';
import KitkatButton from '../../components/buttons/KitkatButton';
import HeaderBottomLine from '../../components/HeaderBottomLine';

// Color
import color from '../../color';

// expo icons
import {
	ioniconsMdArrowBack,
	phoneIcon,
} from '../../expoIcons';

const { width, height } = Dimensions.get("window");
const buttonSize = width/3 - 8; // borderWidth + marginHorizontal * 2 = 8
const oneThirdWidth = width / 3

const AccountManagerScreen = ({ navigation }) => {
	const { state: { user }, accountRefresh, signout } = useContext(AuthContext);

	const [ alertBoxStatus, setAlertBoxStatus ] = useState(false);
	const [ alertBoxText, setAlertBoxText ] = useState("Username is necessary for a business or technician registration.")

	return (
		<View style={styles.mainContainer}>
			<HeaderForm 
				addPaddingTop={true}
        leftButtonTitle={user.username}
        leftButtonIcon={ioniconsMdArrowBack(RFValue(27), color.black1)}
        // headerTitle={"Account Manager"} 
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
      
			<View style={styles.menuContainer}>
				<ScrollView>
					{/*{ user.username
						&&
						<View style={styles.labelContainer}>
							<Text style={styles.labelText}>{user.username}</Text>
						</View>
					}*/}
					<View style={styles.regularMenu}>
						<KitkatButton
							onPress={() => {
								console.log("payment");
							}}
							icon={<AntDesign name="creditcard" size={RFValue(27)} color={color.black1} />}
							text={"Payment"}
						/>
						<KitkatButton
							onPress={() => {
								navigation.navigate("SetPhoneNumber");
							}}
							icon={phoneIcon(RFValue(27), color.black1)}
							text={"Phone number"}
						/>
						<HeaderBottomLine />
					</View>

					{ user.type === 'business' &&
						<View>
							<View style={styles.labelContainer}>
								<Text style={styles.labelText}>Business</Text>
							</View>
							<View style={styles.businessMenu}>
								<KitkatButton
									onPress={() => navigation.navigate('UpdateBusinessStack')}
									icon={<AntDesign name="edit" size={RFValue(27)} color={color.black1} />}
									text={user.username}
								/>
								<KitkatButton
									onPress={() => navigation.navigate('BusinessMain')}
									icon={<Entypo name="shop" size={RFValue(27)} color={color.black1} />}
									text={"Manage Business"}
								/>
							</View>
						</View>
					}
					{ user.type !== 'business' && user.type !== 'technician' &&
						<View>
							<View style={styles.labelContainer}>
								<Text style={styles.labelText}>Business or Technician Registration</Text>
							</View>
							<View style={styles.businessMenu}>
								<KitkatButton
									onPress={() => {
										user.username 
										?
										navigation.navigate('RegisterBusiness')
										: 
										setAlertBoxStatus(true)
									}}
									icon={<AntDesign name="edit" size={RFValue(27)} color={color.black1} />}
									text={"Register Business"}
								/>
								<KitkatButton
									onPress={() => {
										user.username 
										?
										navigation.navigate('RegisterTechnician')
										: 
										setAlertBoxStatus(true)
									}}
									icon={<Ionicons name="brush-outline" size={RFValue(27)} color={color.black1} />}
									text={"Register Technician"}
								/>
							</View>
						</View>
					}
					{ 
						user.type === 'technician' &&
						<View>
							<View style={styles.labelContainer}>
								<Text style={styles.labelText}>Technician</Text>
							</View>
							<View style={styles.businessMenu}>
								<KitkatButton
									onPress={() => {
											null
										}}
									icon={<Ionicons name="brush-outline" size={RFValue(27)} color={color.black1} />}
									text={user.username}
								/>
							</View>
						</View>
					}
					<HeaderBottomLine />
					<KitkatButton
						onPress={() => {
							signout();
						}}
						icon={<Ionicons name="ios-power" size={RFValue(27)} color="black" />}
						text={"Sign Out"}
					/>
				</ScrollView>
			</View>

			{ 
				// put this at the last so it can be on the top of others
      	alertBoxStatus
      	?
	      <AlertBoxTop 
	      	setAlert={setAlertBoxStatus}
	      	alertText={alertBoxText}
	      />
	      : null
	    }
		</View>
	);
};

const styles = StyleSheet.create({
	mainContainer: {
		backgroundColor: color.white2,
		flex: 1,
	},
	menuContainer: {
		backgroundColor: color.white2,
		flex: 1,
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
	regularMenu: {

	},
	businessMenu: {

	},
});

export default AccountManagerScreen;
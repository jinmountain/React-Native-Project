import React, { useState, useEffect, useContext }from 'react';
import { 
	Text,
	StyleSheet,
	ScrollView, 
	View,
	Switch,
	TouchableOpacity,
} from 'react-native';
import { SafeAreaView, } from 'react-native-safe-area-context';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import CheckBox from '../../components/CheckBox';
import { HeaderForm } from '../../components/HeaderForm';
import SimpleSpinnerTopMargin from '../../components/loading/SimpleSpinnerTopMargin';

// Hooks
import businessUpdateFire from '../../firebase/businessUpdateFire';

// Contexts
import { Context as AuthContext } from '../../context/AuthContext';

const RegisterBusinessScreen = ({ navigation }) => {
	const { state: { user }, localSignin } = useContext(AuthContext);
	const [ businessService, setBusinessService ] = useState(["nail"]); // nail for now 
	const [ isChecked, setChecked ] = useState(false);
	const [ registering, setRegistering ] = useState(false);
	return (
		<SafeAreaView style={styles.deregisterBusinessScreenContainer}>
			{
				registering
				? <SimpleSpinnerTopMargin/>
				: null
			}
			<HeaderForm 
        leftButtonTitle='Back'
        headerTitle={"Registeration"} 
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
			<View style={styles.deregistrationContainer}>
				<ScrollView style={styles.noticeContainer}>
					<View style={styles.titleContainer}>
						<Text>
							Read before Proceed
						</Text>
					</View>
					<View style={styles.contentContainer}>
						<Text>
							Agreement
						</Text>
						<Text>
							Agreement
						</Text>
						<Text>
							Agreement
						</Text>
					</View>
				</ScrollView>
				<View style={styles.actionBoxContainer}>
					<View style={styles.actionBoxTitleContainer}>
						<Text style={styles.titleText}>
							Wish You the Best!
						</Text>
					</View>
					<View style={styles.checkBoxContainer}>
						<CheckBox
							value={isChecked}
		          onValueChange={() => {
		          	setChecked(!isChecked)
		          }}
						/>
		        <Text>By checking the box I agree the statement above.</Text>
					</View>
					<View style={styles.buttonContainerContainer}>
						<View style={styles.rowContainer}>
							<TouchableOpacity 
								style={{ ...styles.buttonContainer, ...{ backgroundColor: "#E9FEFF" }}}
								onPress={() => {
									const businessRegister = businessUpdateFire.businessRegister(businessServiceType);
									isChecked 
									? 
									(
										setRegistering(true),
										businessRegister
										.then(() => {
											const loadUpdatedUserData = localSignin()
											loadUpdatedUserData
											.then(() => {
												navigation.goBack();
											})
											setRegistering(false);
										})
									)
									: console.log("need checkmark")
								}}
							>
								<Text style={{...styles.buttonText, ...{color: "#1069FF"}}}>
									Yes
								</Text>
							</TouchableOpacity>
							<TouchableOpacity 
								onPress={() => {navigation.goBack()}}
								style={{ ...styles.buttonContainer, ...{ backgroundColor: "#F0F0F0" }}}
							>
								<Text style={{...styles.buttonText, ...{color: "#252525"}}}>
									No
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	deregisterBusinessScreenContainer: {
		flex: 1,
		backgroundColor: '#FFF',
	},
	deregistrationContainer: {
		flex: 1,
	},
	noticeContainer: {
		borderWidth: 1,
	},
	actionBoxContainer: {
		justifyContent: 'flex-end',
	},
	actionBoxTitleContainer: {
		marginHorizontal: 30,
		justifyContent: 'center',
		alignItems: 'center',
	},
	titleText: {
		fontWeight: 'bold',
		fontSize: RFValue(25),
	},
	checkBoxContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	checkbox: {
    margin: 3,
  },
	buttonContainerContainer: {
	},
	buttonContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: RFValue(20),
	},
	buttonText: {
		fontSize: RFValue(20),
		color: "#FFF",
	},
	rowContainer: {
		justifyContent: 'center',
		flexDirection: 'row',
	}
});

export default RegisterBusinessScreen;
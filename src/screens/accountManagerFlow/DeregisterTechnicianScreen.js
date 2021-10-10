import React, { useState, useContext }from 'react';
import { 
	Text,
	StyleSheet,
	ScrollView, 
	View,
	TouchableOpacity,
} from 'react-native';
import { SafeAreaView, } from 'react-native-safe-area-context';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";


// Components
import CheckBox from '../../components/CheckBox';
import { HeaderForm } from '../../components/HeaderForm';

// Hooks
import businessUpdateFire from '../../firebase/businessUpdateFire';

// Contexts
import { Context as AuthContext } from '../../context/AuthContext';

const DeregisterBusinessScreen = ({ navigation }) => {
	const { state: { user }, localSignin } = useContext(AuthContext);
	const [isChecked, setChecked] = useState(false);
	return (
		<SafeAreaView style={styles.deregisterBusinessScreenContainer}>
			<HeaderForm 
        leftButtonTitle='Back'
        headerTitle={"Deregistration"} 
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
							We Hope You Come Back!
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
									isChecked 
									? ( 
											businessUpdateFire.technicianDeregister(user.id),
											localSignin(navigation.navigate, 'Account')
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

export default DeregisterBusinessScreen;
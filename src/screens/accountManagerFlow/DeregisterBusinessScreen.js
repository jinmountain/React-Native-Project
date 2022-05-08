import React, { useState, useContext }from 'react';
import { 
	Text,
	StyleSheet,
	ScrollView, 
	View,
	TouchableOpacity,
	SafeAreaView,
	Pressable
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Componenets
import CheckBox from '../../components/CheckBox';
import { HeaderForm } from '../../components/HeaderForm';
import SpinnerFromActivityIndicator from '../../components/ActivityIndicator';

// Hooks
import {
	businessDeregisterFire
} from '../../firebase/business/businessUpdateFire';
import { wait } from '../../hooks/wait';

// Contexts
import { Context as AuthContext } from '../../context/AuthContext';

// expo icons
import {
	chevronBack,
	antdesignCheckCircleo
} from '../../expoIcons';

// color
import color from '../../color';

const DeregisterBusinessScreen = ({ navigation }) => {
	const { state: { user }, localSignin } = useContext(AuthContext);
	const [isChecked, setChecked] = useState(false);
	const [ deregistering, setDeregistering ] = useState(false);
	const [ complete, setComplete ] = useState(false);

	const renderDeregister = () => {
		return (
			<View style={styles.deregistrationContainer}>
				<HeaderForm 
	        leftButtonIcon={chevronBack(RFValue(27), color.black1)}
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
						<View style={styles.checkBox}>
							<CheckBox
								value={isChecked}
			          onValueChange={() => {
			          	setChecked(!isChecked)
			          }}
							/>
						</View>
						<View style={styles.checkBoxMessageContainer}>
		        	<Text style={styles.checkBoxMessageText}>
		        		By checking the box I agree the statement above.
		        	</Text>
		       	</View>
					</View>
					<View style={styles.buttonContainerContainer}>
						<View style={styles.rowContainer}>
							<TouchableOpacity 
								style={{ ...styles.buttonContainer, ...{ backgroundColor: "#E9FEFF" }}}
								onPress={() => {
									const businessDeregister = businessDeregisterFire(user.id);
									isChecked 
									? 
									(
										setDeregistering(true),
										businessDeregister
										.then(() => {
											wait(1000)
											.then(() => {
												setDeregistering(false);
												setComplete(true);

											})
										})
									)
									: console.log("need checkmark")
								}}
							>
								<Text style={{...styles.buttonText, ...{color: "#1069FF"}}}>
									{
										deregistering
										? <SpinnerFromActivityIndicator customSize={"small"}/>
										: "Yes"
									}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity 
								onPress={() => {navigation.goBack()}}
								style={{ ...styles.buttonContainer, ...{ backgroundColor: "#F0F0F0" }}}
							>
								<Text style={{...styles.buttonText, ...{color: "#252525"}}}>
									Go Back
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
		)
	};

	const renderComplete = () => {
  	return (
  		<View style={styles.completeContainer}>
  			<View style={styles.completeMessageContainer}>
  				<Text style={{ fontSize: RFValue(47), color: color.black1, paddingVertical: RFValue(27) }}>Deregisteration</Text>
  				<Text style={{ fontSize: RFValue(47), color: color.black1, paddingVertical: RFValue(27) }}>Complete</Text>
  				<Text style={{paddingVertical: RFValue(27)}}>{antdesignCheckCircleo(RFValue(47), color.blue1)}</Text>
  			</View>
  			<View style={styles.closeButtonContainer}>
  				<Pressable
  					onPress={() => {
  						navigation.navigate("Account");
  					}}
  				>
  					<View style={styles.closeButtonTextContainer}>
  						<Text style={styles.closeButtonText}>Close</Text>
  					</View>
  				</Pressable>
  			</View>
  		</View>
  	)
  };

	return (
		<SafeAreaView style={styles.deregisterBusinessScreenContainer}>
      {
      	complete
      	?	renderComplete()
      	: renderDeregister()
      }
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
	},

	checkBoxContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	checkBox: {
    padding: RFValue(5),
  },
	checkBoxMessageContainer: {
		flex: 1,
		justifyContent: 'center',
		paddingVertical: RFValue(3)
	},
	checkBoxMessageText: {
		fontSize: RFValue(17),
		color: color.black1
	},

	completeContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	completeMessageContainer: {
		justifyContent: 'center',
		alignItems: 'center'
	},

	closeButtonContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	closeButtonTextContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: RFValue(5)
	},
	closeButtonText: {
		fontSize: RFValue(21)
	},
});

export default DeregisterBusinessScreen;
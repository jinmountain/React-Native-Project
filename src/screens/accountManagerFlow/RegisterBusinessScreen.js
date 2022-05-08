import React, { useState, useEffect, useContext }from 'react';
import { 
	Text,
	StyleSheet,
	ScrollView, 
	View,
	Switch,
	TouchableOpacity,
	SafeAreaView,
	Pressable,
	Modal,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import CheckBox from '../../components/CheckBox';
import { HeaderForm } from '../../components/HeaderForm';
import HeaderBottomLine from '../../components/HeaderBottomLine';
import AlertBoxTop from '../../components/AlertBoxTop'; 
import SpinnerFromActivityIndicator from '../../components/ActivityIndicator';
// Hooks
import { capitalizeFirstLetter } from '../../hooks/capitalizeFirstLetter';
import { wait } from '../../hooks/wait';
// firebase
import {
	businessRegisterFire
} from '../../firebase/business/businessUpdateFire';

// Contexts
import { Context as AuthContext } from '../../context/AuthContext';

// color
import color from '../../color';

// expo icons
import {
	chevronBack,
	chevronForward,
	evilIconsClose,
	antCheck,
	antdesignCheckCircleo
} from '../../expoIcons';

// service
import services from '../../services';

const RegisterBusinessScreen = ({ navigation }) => {
	const { state: { user }} = useContext(AuthContext);

  const [ alertBoxStatus, setAlertBoxStatus ] = useState(false);
  const [ alertBoxText, setAlertBoxText ] = useState(null);

	const [ businessService, setBusinessService ] = useState([]); // nail for now 
	const [ isChecked, setChecked ] = useState(false);
	const [ registering, setRegistering ] = useState(false);
	const [ complete, setComplete ] = useState(false);

  const [ showSelectServiceModal, setShowSelectServiceModal ] = useState(false);

  const renderRegister = () => {
  	return (
  		<View style={styles.registrationContainer}>
  			<HeaderForm 
	        leftButtonIcon={chevronBack(RFValue(27), color.black1)}
	        headerTitle={"Registeration"} 
	        rightButtonIcon={null} 
	        leftButtonPress={() => {
	          navigation.goBack();
	        }}
	        rightButtonPress={() => {
	          {
	            null
	          }
	        }}
	      />
				<Pressable
	        onPress={() => setShowSelectServiceModal(true)}
	      >
	      	<View style={styles.selectServiceButtonContainer}>
	        	<Text style={styles.selectServiceText}>
	        		Select Your Business' Services {chevronForward(RFValue(23), color.black1)}
	        	</Text>
	        </View>
	      </Pressable>
	      <HeaderBottomLine />
	      <View style={styles.selectedServicesContainer}>
        	<View style={styles.selectedLabelContainer}>
        		<Text style={styles.selectedLabelText}>Selected: </Text>
        	</View>
        	<ScrollView horizontal>
	        	{
	        		businessService.map((item, index) => (
	        			<View 
	        				key={index}
	        				style={styles.selectedService}
	        			>
	        				<Text style={styles.selectedServiceText}>
	        					{capitalizeFirstLetter(item)}
	        				</Text>
	        			</View>
	        		))
	        	}
	        </ScrollView>
        </View>
        <HeaderBottomLine />
				<ScrollView>
					<View style={styles.agreementMessageContainer}>
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
					</View>
				</ScrollView>
				<View style={styles.actionBoxContainer}>
					<View style={styles.actionBoxTitleContainer}>
						<Text style={styles.titleText}>
							Wish You the Best!
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
									const businessRegister = businessRegisterFire(businessService);
									isChecked && businessService.length > 0
									? 
									(
										setRegistering(true),
										businessRegister
										.then(() => {
											wait(1000)
											.then(() => {
												setRegistering(false);
												setComplete(true);
											});
										})
										.catch(() => {
											setAlertBoxStatus(true);
											setAlertBoxText("Something wasn't right. Try again Later.");
											setRegistering(false);
										})
									)
									:!isChecked
									? 
									(
										setAlertBoxStatus(true),
										setAlertBoxText("The check mark is missing.")
									)
									: !businessService.length > 0
									?
									(
										setAlertBoxStatus(true),
										setAlertBoxText("Select service.")
									)
									: null
								}}
							>
								<Text style={{...styles.buttonText, ...{color: "#1069FF"}}}>
									{
										registering
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
  				<Text style={{ fontSize: RFValue(47), color: color.black1, paddingVertical: RFValue(27) }}>Registeration</Text>
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
		<SafeAreaView style={styles.registerBusinessScreenContainer}>
			<Modal
        animationType="fade"
        transparent={true}
        visible={showSelectServiceModal}
        onRequestClose={() => {
          setShowSelectServiceModal(!showSelectServiceModal);
        }}
      >
      	<Pressable
	        style={[
	          StyleSheet.absoluteFill,
	          { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
	        ]}
	        onPress={() => { setShowSelectServiceModal(false) }}
	      />
        <View style={styles.modalCenteredView}>
          <View style={styles.modalContainer}>
          	<View style={styles.modalHeader}>
          		<View style={styles.modalTitleContainer}>
            		<Text style={styles.modalTitleText}>Select Service</Text>
            	</View>
            	<Pressable
	              style={{}}
	              onPress={() => setShowSelectServiceModal(!showSelectServiceModal)}
	            >
	            	<View style={styles.closeModalIconContainer}>
	            		<Text style={{}}>{evilIconsClose(RFValue(25), color.black1)}</Text>
	            	</View>
	            </Pressable>
            </View>
            <HeaderBottomLine />
            <View style={styles.pickServiceContainer}>
            {
            	services.map((item, index) => (
            		<Pressable
            			key={index}
		              style={{}}
		              onPress={() => {
		              	if (businessService.includes(item.value)) {
		              		setBusinessService(businessService.filter((service) => service !== item.value));
		              	} else {
		              		setBusinessService([ ...businessService, item.value ]);
		              	}
		              }}
		            >
		            	<View style={styles.serviceOptionsContainer}>
		            		<View style={styles.serviceLabelContainer}>
		              		<Text style={styles.labelText}>{item.label}</Text>
		              	</View>

		              	{
		              		businessService.includes(item.value) &&
		              		<View style={styles.serviceCheckMarkContainer}>
			              		{antCheck(RFValue(23), color.blue1)}
			              	</View>
		              	}
		              </View>
		            </Pressable>
            	))
            }
            </View>
            <HeaderBottomLine/>
            <View style={styles.modalBottomContainer}>
            	<Pressable
            		onPress={() => {
            			setShowSelectServiceModal(false);
            		}}
            	>
		          	<View style={styles.modalBottomButtonContainer}>
		          		<Text style={styles.modalBottomButtonText}>Close</Text>
		          	</View>
		          </Pressable>
	          </View>
          </View>
        </View>
      </Modal>
			{
				complete
				? renderComplete()
				: renderRegister()
			}
      { 
        // put this at the last so it can be on the top of others
        alertBoxStatus &&
        <AlertBoxTop 
          setAlert={setAlertBoxStatus}
          alertText={alertBoxText}
        />
      }
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	registerBusinessScreenContainer: {
		flex: 1,
		backgroundColor: color.white2,
	},
	registrationContainer: {
		flex: 1,
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

	agreementMessageContainer: {
		padding: RFValue(10)
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

	modalCenteredView: {
		flex: 1,
    justifyContent: "center",
	},
	modalHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: RFValue(19),
		paddingHorizontal: RFValue(10)
	},
	modalTitleContainer: {
		flex: 1
	},
	modalTitleText: {
		fontSize: RFValue(19),
		color: color.black1
	},
	closeModalIconContainer: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	pickServiceContainer: {
		paddingVertical: RFValue(10),
		paddingHorizontal: RFValue(10)
	},
	serviceOptionsContainer: {
		flexDirection: 'row', 
		alignItems: 'center', 
		paddingVertical: RFValue(10),
	},
	serviceLabelContainer: {
		flex: 1,
	},
	serviceCheckMarkContainer: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	labelText: {
		fontSize: RFValue(17)
	},
	modalContainer: {
		backgroundColor: color.white2,
		borderRadius: RFValue(5),
	},
	modalBottomContainer: {
		height: RFValue(55),
	},
	modalBottomButtonContainer: {
		height: RFValue(55),
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalBottomButtonText: {
		fontSize: RFValue(19),
		fontWeight: 'bold',
	},

	selectServiceButtonContainer: {
		justifyContent: 'center', 
		paddingLeft: RFValue(12), 
		paddingVertical: RFValue(10),
		justifyContent: 'center',
	},
	selectServiceText: {
		fontSize: RFValue(19),
		fontWeight: 'bold',
	},

	selectedServicesContainer: {
		height: RFValue(50), 
		flexDirection: 'row'
	},
	selectedLabelContainer: {
		justifyContent: 'center',
		paddingHorizontal: RFValue(10)
	},
	selectedLabelText: {
		fontSize: RFValue(19),
		color: color.black1
	},
	selectedService: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: RFValue(5)
	},
	selectedServiceText: {
		fontSize: RFValue(19),
		color: color.black1,
		fontWeight: 'bold'
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

export default RegisterBusinessScreen;
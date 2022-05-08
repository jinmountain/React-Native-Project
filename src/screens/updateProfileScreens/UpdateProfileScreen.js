import React, { useState, useEffect, useContext }from 'react';
import { 
	Text, 
	StyleSheet, 
	View,
	Image,
	TouchableOpacity, 
	TextInput,
	SafeAreaView,
	ScrollView,
	ImageBackground,
	Pressable
} from 'react-native';
import { Button, Snackbar } from 'react-native-paper';

// NPMs
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

//Componenets
import { NavigationBar } from '../../components/NavigationBar';
import { InputFormBottomLine } from '../../components/InputFormBottomLine';
import ButtonA from '../../components/buttons/ButtonA';
import { HeaderForm } from '../../components/HeaderForm';
import DefaultUserPhoto from '../../components/defaults/DefaultUserPhoto';
import UserDataEditButtonForm from '../../components/accountScreen/UserDataEditButtonForm';

// firebase
import { 
	profileUpdateFire, 
	updateProfilePhotoFire,
	updateProfileCoverPhotoFire
} from '../../firebase/user/usersPostFire';

// Contexts
import { Context as AuthContext } from '../../context/AuthContext';

// Designs

// Color
import color from '../../color';

// icon
import {
	evilIconsClose
} from '../../expoIcons';

// Hooks
import useImage from '../../hooks/useImage';

const UpdateProfileScreen = ({ route, isFocused, navigation }) => {
	const { 
		returnedInputType,
		returnedInputValue,
	} = route.params;

	const [pickImage] = useImage();
	const { 
		state: { 
			user, 
		}, 
	} = useContext(AuthContext);

	const [ showSnackBar, setShowSnackBar ] = useState(false);
	const [ snackBarText, setSnackBarText ] = useState(null);
  const onToggleSnackBar = () => setShowSnackBar(!showSnackBar);
  const onDismissSnackBar = () => setShowSnackBar(false);

	const [ newName, setNewName ] = useState(null);
	const [ newUsername, setNewUsername ] = useState(null);
	const [ newWebsite, setNewWebsite ] = useState(null);
	const [ newSign, setNewSign ] = useState(null);
	const [ newPhoneNumber, setNewPhoneNumber ] = useState(null);
	const [ newEmail, setNewEmail ] = useState(null);

	// Control for username change
	const [ allowUsernameChange, setAllowUsernameChange ] = useState(false);
	const [ usernameTimeLimitWarning, setUsernameTimeLimitWarning] = useState(false);

	useEffect(() => {
		// username change timer to limit
		if (user.last_username_change_at) {
			const daysPassed = (Date.now() - user.last_username_change_at)/(24*60*60*1000);
			if (daysPassed < 1) {
				console.log('Blocked to change username.');
				setAllowUsernameChange(false);
			} else {
				console.log('Allowed to change username.');
				setAllowUsernameChange(true);
			}
		} else {
			setAllowUsernameChange(true);
		}

		return () => {

		};
	}, []);

	useEffect(() => {
		console.log(returnedInputType, returnedInputValue);
		if (returnedInputType && returnedInputValue) {
			if (returnedInputType === 'name') {
				setNewName(returnedInputValue);
			}
			if (returnedInputType === 'username') {
				setNewUsername(returnedInputValue);
			}
			if (returnedInputType === 'website') {
				setNewWebsite(returnedInputValue);
			}
			if (returnedInputType === 'sign') {
				setNewSign(returnedInputValue);
			}
			if (returnedInputType === 'phoneNumber') {
				setNewPhoneNumber(returnedInputValue);
			}
			if (returnedInputType === 'email') {
				setNewEmail(returnedInputValue);
			}
		}
	}, [returnedInputType, returnedInputValue])

	return (
		<View style={styles.updateProfileScreenContainer}>
			<View style={styles.headerBarContainer}>
				<SafeAreaView />
				<HeaderForm 
					leftButtonIcon={evilIconsClose(RFValue(27), color.black1)}
					headerTitle="Edit" 
					rightButtonIcon={ 
						"Done"
					}
					leftButtonPress={() => {
						navigation.goBack();
					}}
					rightButtonPress={() => {
						let newUserInfo = {};

						// if there is new input and the new input is not same 
						// as the existing user data add to newUserInfo

						if (newName && user.name !== newName) {
							newUserInfo.name = newName;
						};
						if (newUsername && user.username !== newUsername) {
							newUserInfo.username = newUsername;
						};
						if (newWebsite && user.website !== newWebsite) {
							newUserInfo.website = newWebsite;
						};
						if (newSign && user.sign !== newSign) {
							newUserInfo.sign = newSign;
						};
						if (newPhoneNumber && user.phoneNumber !== newPhoneNumber) {
							newUserInfo.phoneNumber = newPhoneNumber;
						};

						console.log(newUserInfo);

						if (JSON.stringify(newUserInfo) !== '{}') {
							// console.log("go");
							const updateProfile = profileUpdateFire(newUserInfo);
							updateProfile
							.then(() => {
								navigation.navigate('Account');
							})
							.catch((error) => {
								console.log(error);
							});
						}
					}} 
				/>
			</View>
			<View style={styles.inputFormContainer}>
				<ScrollView>
					<ImageBackground
						source={{uri: user.coverPhotoURL}}
						resizeMode="cover"
						style={{ }}
					>
						<View style={styles.profilePictureControlContainer}>
							<Pressable
								onPress={() => {
									pickImage("image")
									.then((pickedImage) => {
										if (pickedImage.type === "photo" || "image") {
											// console.log("image type: ", pickedImage.type);
											const updateCoverPhoto = updateProfileCoverPhotoFire(pickedImage, user.coverPhotoURL);
											updateCoverPhoto
											.then(() => {
												onToggleSnackBar();
												setSnackBarText("Cover photo is changed.")
											})
											.catch((error) => {
												console.log(error);
											});
										}
									})
								}}
							>
								<View style={{
									backgroundColor: color.white2, 
									justifyContent: 'center', 
									alignItems: 'center', 
									padding: RFValue(5),
									borderRadius: RFValue(9),
									marginBottom: RFValue(15)
								}}>
									<Text style={{
										color: color.black1,
										fontSize: RFValue(13),
									}}>Change Cover Photo</Text>
								</View>
							</Pressable>
							<View style={styles.profilePictureContainer}>
								<Pressable 
									onPress={() => {
										user.photoURL
										?
										navigation.navigate("ImageZoomin", {
											file: { type: 'image', url: user.photoURL }
										})
										: null
									}}
								>
									<View>
										{user.photoURL
											? 
											<Image 
												style={styles.profilePicture}
												source={{ uri: user.photoURL }}
											/>
											: 
											<DefaultUserPhoto 
												customSizeBorder={RFValue(90)}
												customSizeUserIcon={RFValue(60)}
											/>
										}
									</View>
								</Pressable>

								<Pressable
									onPress={() => {
										pickImage("image")
										.then((pickedImage) => {
											if (pickedImage.type === "photo" || "image") {
												// console.log("image type: ", pickedImage);
												// console.log("image type: ", pickedImage.type);
												const updatePhoto = updateProfilePhotoFire(pickedImage, user.photoURL);
												updatePhoto
												.then(() => {
													onToggleSnackBar();
													setSnackBarText("Profile photo is changed.")
												})
												.catch((error) => {
													console.log(error);
												});
											}
										})
									}}
								>
									<View style={{
										backgroundColor: color.white2, 
										justifyContent: 'center', 
										alignItems: 'center',
										padding: RFValue(5),
										borderRadius: RFValue(9),
										marginTop: RFValue(5)

									}}>
										<Text style={{
											color: color.black1,
											fontSize: RFValue(13),
										}}>
											Change Photo
										</Text>
									</View>
								</Pressable>
							</View>
						</View>
					</ImageBackground>
					<InputFormBottomLine />
					<View style={styles.updateInputContainer} >
						<UserDataEditButtonForm
							inputValue={
								newName
							}
							currentValue={user.name}
							dataType={"name"}
						/>
						<UserDataEditButtonForm
							inputValue={
								newUsername
							}
							currentValue={user.username}
							dataType={"username"}
							allowUsernameChange={allowUsernameChange}
							setUsernameTimeLimitWarning={setUsernameTimeLimitWarning}
						/>
						{ allowUsernameChange === false && usernameTimeLimitWarning === true
							? <View style={styles.requisiteWarningContainer}>
									<Text style={styles.requisiteWarning}>
										Your username was changed in less than 15 days.
									</Text>
								</View>
							: null
						}
						<UserDataEditButtonForm
							inputValue={
								newWebsite
							}
							currentValue={user.website}
							dataType={"website"}
						/>
						<UserDataEditButtonForm
							inputValue={
								newSign
							}
							currentValue={user.sign}
							dataType={"sign"}
						/>
						<UserDataEditButtonForm
							inputValue={
								newPhoneNumber
							}
							currentValue={user.phoneNumber}
							dataType={"phoneNumber"}
						/>
					</View>
					<InputFormBottomLine />
				</ScrollView>
			</View>
			<Snackbar
        visible={showSnackBar}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Close',
          onPress: () => {
            onDismissSnackBar();
          },
        }}>
        {
        	snackBarText
        	? snackBarText
        	: "404"
        }
      </Snackbar>
		</View>
	);
};

const styles = StyleSheet.create({
	updateProfileScreenContainer: {
		flex: 1,
		backgroundColor: color.white1,
	},
	inputFormContainer: {
		flex: 1,
	},
	profilePictureControlContainer: {
		paddingTop: RFValue(35),
		paddingBottom: RFValue(35),
		justifyContent: 'center',
		alignItems: 'center',
	},
	profilePictureContainer: {
		alignItems: 'center',
	},
	profilePicture: {
		width: RFValue(135),
		height: RFValue(135),
		borderRadius: RFValue(100),
	},

	updateInputContainer: {
		padding: RFValue(5),
		marginTop: RFValue(5),
		marginBottom: RFValue(5),
		marginLeft: RFValue(30),
		marginRight: RFValue(30),
	},
	grey3D4850Text: {
		color: '#3D4850',
	},
	requisiteWarningContainer: {
		paddingHorizontal: RFValue(18),
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: RFValue(20),
	},
	requisiteWarning: {
		color: color.red2,
	},

	buttonContainer: {
		borderRadius: RFValue(15),
		backgroundColor: color.grey4,
		padding: RFValue(7),
		marginBottom: RFValue(7),
		backgroundColor: color.white2
	},
	textInputLabelContainer: {
		minHeight: RFValue(25),
	},
	textInputLabel: {
		fontSize: RFValue(12),
		marginTop: RFValue(8),
		color: color.grey3,
	},
	inputContainer: {
		paddingLeft: RFValue(10),
		justifyContent: 'center',
		minHeight: RFValue(35),
		paddingBottom: RFValue(7),
	},
	blackText: {
		color: color.black1,
		fontSize: RFValue(17),
	},
	greyaaaaaaText: {
		color: color.grey3,
		fontSize: RFValue(17),
	},
	usernameInput: {
		fontSize: RFValue(17),
		color: color.grey3,
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
});
export default UpdateProfileScreen;
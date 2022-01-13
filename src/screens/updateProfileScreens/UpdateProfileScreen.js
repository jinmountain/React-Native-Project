import React, { useState, useEffect, useContext }from 'react';
import { 
	Text, 
	StyleSheet, 
	View,
	Image,
	TouchableOpacity, 
	TextInput,
	ScrollView } from 'react-native';

// NPMs
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView, } from 'react-native-safe-area-context';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

//Componenets
import { NavigationBar } from '../../components/NavigationBar';
import { ProfileInputForm } from '../../components/ProfileInputForm';
import { InputFormBottomLine } from '../../components/InputFormBottomLine';
import ButtonA from '../../components/ButtonA';
import { HeaderForm } from '../../components/HeaderForm';
import DefaultUserPhoto from '../../components/defaults/DefaultUserPhoto';
import UserDataEditButtonForm from '../../components/accountScreen/UserDataEditButtonForm';

// firebase
import { profileUpdateFire } from '../../firebase/profileUpdateFire';

// Contexts
import { Context as AuthContext } from '../../context/AuthContext';

// Designs

// Color
import color from '../../color';

// icon
import expoIcons from '../../expoIcons';

// Hooks
import useImage from '../../hooks/useImage';

const UpdateProfileScreen = ({ route, isFocused, navigation }) => {
	const [pickImage] = useImage();
	const { 
		state: { 
			user, 
			newProfileJson,
			newName,
			newUsername,
			newWebsite,
			newSign,
		}, 
		signout,
		resetEdit,
		addNewName,
		addNewUsername,
		addNewWebsite,
		addNewSign,
	} = useContext(AuthContext);

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
			resetEdit();
		};
	}, []);

	return (
		<SafeAreaView style={styles.updateProfileScreenContainer}>
			<HeaderForm 
				leftButtonTitle={null}
				leftButtonIcon={expoIcons.evilIconsClose(RFValue(27), color.black1)}
				headerTitle="Edit" 
				rightButtonTitle={ 
					newProfileJson !== undefined && newProfileJson !== null 
					? "Done" 
					: null 
				}
				leftButtonPress={() => {
					resetEdit();
					navigation.goBack();
				}}
				rightButtonPress={() => {
					// allow update when at least one is changed
					if (newProfileJson !== undefined && newProfileJson !== null) {
						console.log("update user: ", newProfileJson);
						const updateProfile = profileUpdateFire(currentUserId, newProfileJson);
						updateProfile
						.then(() => {
							navigation.navigate('Account');
						})
						.catch((error) => {
							console.log(error);
						});
					};
				}} 
			/>
			<View style={styles.inputFormContainer}>
				<KeyboardAwareScrollView >
					<View style={styles.profilePictureControlContainer}>
						<TouchableOpacity 
							onPress={() => {
								user.photoURL
								?
								navigation.navigate("ImageZoomin", {
									file: { type: 'image', url: user.photoURL }
								})
								: null
							}}
						>
							<View style={styles.profilePictureContainer}>
								{user.photoURL
									? <Image style={styles.profilePicture} source={{uri: user.photoURL}} />
									: <DefaultUserPhoto />
								}
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								pickImage("profile", 
								{
									userType: user.type, 
									userId: user.id, 
									userCurrentPhotoURL: user.photoURL ,
								})
							}}
						>
							<ButtonA 
								text="Change Photo"
								customStyles={{
									fontSize: RFValue(15), 
									color: color.black1
								}}
							/>
						</TouchableOpacity>
					</View>
					<InputFormBottomLine />
					<View style={styles.updateInputContainer} >
						<UserDataEditButtonForm
							navigate={navigation.navigate}
							newInput={newName}
							currentValue={user.name}
							dataType={"Name"}
							allowUsernameChange={allowUsernameChange}
							setUsernameTimeLimitWarning={setUsernameTimeLimitWarning}
						/>
						<UserDataEditButtonForm
							navigate={navigation.navigate}
							newInput={newUsername}
							currentValue={user.username}
							dataType={"Username"}
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
							navigate={navigation.navigate}
							newInput={newWebsite}
							currentValue={user.website}
							dataType={"Website"}
							allowUsernameChange={allowUsernameChange}
							setUsernameTimeLimitWarning={setUsernameTimeLimitWarning}
						/>
						<UserDataEditButtonForm
							navigate={navigation.navigate}
							newInput={newSign}
							currentValue={user.sign}
							dataType={"Sign"}
							allowUsernameChange={allowUsernameChange}
							setUsernameTimeLimitWarning={setUsernameTimeLimitWarning}
						/>
					</View>
					<InputFormBottomLine />
				</KeyboardAwareScrollView>
			</View>
		</SafeAreaView>
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
		flex: 1,
		paddingVertical: RFValue(20),
		justifyContent: 'center',
		alignItems: 'center',
	},
	profilePictureContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: RFValue(15),
	},
	profilePicture: {
		width: RFValue(80),
		height: RFValue(80),
		borderWidth: 1,
		borderColor: '#5A646A',
		borderRadius: RFValue(100),
	},
	updateBusinessButtonContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: RFValue(10),
	},
	updateBusinessButton: {
		borderRadius: 5,
		marginVertical: 5,
		marginHorizontal: 5,
		paddingVertical: 10,
		paddingHorizontal: 10,
	},
	updateInputContainer: {
		flex: 2,
		padding: 5,
		marginTop: 5,
		marginBottom: 5,
		marginLeft: RFValue(30),
		marginRight: RFValue(30),
	},
	grey3D4850Text: {
		color: '#3D4850',
	},
	requisiteWarningContainer: {
		paddingHorizontal: 18,
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: RFValue(20),
	},
	requisiteWarning: {
		color: color.red2,
	},
});
export default UpdateProfileScreen;
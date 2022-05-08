import React, { useState, useEffect, useContext }from 'react';
import { 
	Text,
	StyleSheet, 
	View,
	TouchableOpacity, 
	TextInput,
	SafeAreaView,
	ScrollView,
	KeyboardAvoidingView 
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Hooks
import { 
	meetUsernameRules, 
	uniqueUsername, 
} from '../../hooks/meetRulesProfile';

// Components
import { HeaderForm } from '../../components/HeaderForm';
import { InputFormBottomLine } from '../../components/InputFormBottomLine';

// Contexts
import { Context as AuthContext } from '../../context/AuthContext';

// Designs
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

// Color
import color from '../../color';

// icon
import {
	evilIconsClose
} from '../../expoIcons';

const UpdateProfileInputScreen = ({ route, navigation }) => {
	const { 
		inputType,
		inputValue,
	} = route.params;
	const { 
		state: { 
			user
		}, 
	} = useContext(AuthContext);

	// newInputCheck is going to be added to new inputs and new inputs' json
	const [newInputCheck, setNewInputCheck] = useState('');
	const [uniqueUsernameControl, setUniqueUsernameControl] = useState(false);
	const [rulesUsernameControl, setRulesUsernameControl] = useState(false);

  const [ textInputFormHeight, setTextInputFormHeight ] = useState(RFValue(35));

	useEffect(() => {
		if (inputType === 'username' && newInputCheck.length > 0) {
			uniqueUsername(newInputCheck, user.username, setUniqueUsernameControl);
			meetUsernameRules(newInputCheck, setRulesUsernameControl);
		}
	}, [newInputCheck]);

	useEffect(() => {
		console.log("inputValue: ", inputValue);
		if (inputValue) {
			setNewInputCheck(inputValue);
		}
	}, [inputType]);

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.updateProfileInputScreenContainer}
		>
			<View style={styles.headerBarContainer}>
				<SafeAreaView/>
				<HeaderForm 
			    leftButtonTitle={null}
			    leftButtonIcon={evilIconsClose(RFValue(27), color.black1)}
			    headerTitle={
			    	inputType === 'name'
						?
						"Name"
						: inputType === 'username'
						? "Username"
						: inputType === 'website'
						? "Website"
						: inputType === 'sign'
						? "Sign"
						: inputType === "phoneNumber"
						? "Phone Number"
						: inputType === "email"
						? "Email"
						: "undefined"
			    } 
			    rightButtonIcon={
		    		inputType === 'name' && newInputCheck.length > 0
			    	? <AntDesign name="check" size={RFValue(25)} color={color.blue1} />
			    	: 
			    	inputType === 'username' && 
			    	uniqueUsernameControl === true && 
			    	rulesUsernameControl === true && 
			    	newInputCheck.length > 0
				    ?	<AntDesign name="check" size={RFValue(25)} color={color.blue1} />
			    	: inputType === 'website' && newInputCheck.length > 0
			    	? <AntDesign name="check" size={RFValue(25)} color={color.blue1} />
			    	: inputType === 'sign' && newInputCheck.length > 0
			    	? <AntDesign name="check" size={RFValue(25)} color={color.blue1} />
			    	: inputType === 'phoneNumber' && newInputCheck.length > 0
			    	? <AntDesign name="check" size={RFValue(25)} color={color.blue1} />
			    	: inputType === 'email' && newInputCheck.length > 0
			    	? <AntDesign name="check" size={RFValue(25)} color={color.blue1} />
			    	: <AntDesign name="check" size={RFValue(25)} color={color.black1} />
		    	}
			    leftButtonPress={() => {
			    	navigation.goBack();
			    }}
			    rightButtonPress={() => {
			    	if (
				    	inputType === 'username' && 
				    	uniqueUsernameControl === true && 
				    	rulesUsernameControl === true && 
				    	newInputCheck.trim().length > 0
					  ) {	
		    			navigation.navigate("UpdateProfile", {
		    				returnedInputType: inputType,
	          		returnedInputValue: newInputCheck
		    			});
		    		};
		    		if (
		    			inputType !== 'username' && 
		    			newInputCheck.trim().length > 0
		    		) {
		    			navigation.navigate("UpdateProfile", {
		    				returnedInputType: inputType,
	          		returnedInputValue: newInputCheck
		    			});
		    		};
			    }}
			  />
			</View>
		  <View style={styles.inputContainer}>
		  	<ScrollView
		  		contentContainerStyle={{ paddingBottom: RFValue(100) }}
		  	>
					<View style={styles.profileInputFormContainer}>
						<View style={styles.textInputLabelContainer}>
							{ newInputCheck
								? 
								<Text style={styles.textInputLabel}>
									{
										inputType === 'name'
										?
										"Name"
										: inputType === 'username'
										? "Username"
										: inputType === 'website'
										? "Website"
										: inputType === 'sign'
										? "Sign"
										: inputType === "phoneNumber"
										? "Phone Number"
										: inputType === "email"
										? "Email"
										: "undefined"
									}
								</Text>
								: null
							}
						</View>
						<View style={styles.textInputContainer}>
							<TextInput
								style={[
									styles.input,
									{
		                height: Math.max(RFValue(35), textInputFormHeight)
		              }
								]}
								placeholder={
									inputType === 'name'
									?
									"Name"
									: inputType === 'username'
									? "Username"
									: inputType === 'website'
									? "Website"
									: inputType === 'sign'
									? "Sign"
									: inputType === "phoneNumber"
									? "Phone Number"
									: inputType === "email"
									? "Email"
									: "undefined"
								}
								placeholderTextColor={color.grey3}
								onChangeText={(text) => {
									if (inputType === 'sign') {
										setNewInputCheck(text);
									} else {
										const trimmedText = text.trim();
										setNewInputCheck(trimmedText);
									}
								}}
								value={newInputCheck}
								maxLength={
									inputType === 'sign'
									? 100
									: inputType === 'website'
									? 50
									: 30
								}
								multiline={
									inputType === 'sign'
									? true
									: false
								}
								underlineColorAndroid="transparent"
								autoCapitalize="none"
								numberOfLines={
									inputType === 'sign'
									? 10
									: 1
								}
								onContentSizeChange={(event) => {
		              setTextInputFormHeight(event.nativeEvent.contentSize.height);
		            }}
							/>
						</View>
						<InputFormBottomLine customStyles={{borderColor: color.grey1}} />
					</View>
			    { 
			    	inputType !== "username"
			    	? null
			    	: uniqueUsernameControl === false || rulesUsernameControl === false
			    	? <View style={styles.alertContainer}>
								<AntDesign name="exclamationcircleo" size={RFValue(18)} color="black" />
								<Text style={styles.alertText}>
									Username must be unique, longer than 4 characters, limited to 30 characters, and contain only letters, numbers, periods, and underscores.
								</Text>
							</View>
						: <View style={styles.validContainer}>
								<AntDesign name="check" size={RFValue(25)} color={color.blue1} />
								<Text style={styles.validText}>
									Valid
								</Text>
							</View>
			    }
			  </ScrollView>
			</View>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	updateProfileInputScreenContainer: {
		flex: 1,
		backgroundColor: color.white2,
	},
	inputContainer: {
		flex: 1,
		marginTop: RFValue(30),
		paddingLeft: RFValue(30),
		paddingRight: RFValue(30),
	},
	alertContainer: {
		marginTop: RFValue(7),
		flexDirection: "row",
	},
	alertText: {
		marginLeft: RFValue(5),
	},
	validContainer: {
		marginTop: RFValue(7),
		flexDirection: "row",
	},
	validText: {
		alignSelf: 'flex-end',
		marginLeft: 5,
		fontSize: RFValue(15),
	},

	profileInputFormContainer: {

	},
	textInputContainer: {
		paddingBottom: RFValue(7)
	},
	textInputLabel: {
		fontSize: RFValue(12),
		marginTop: RFValue(8),
		color: color.grey3
	},
	textInputLabelContainer: {
		minHeight: RFValue(25),
		paddingBottom: RFValue(10),
	},
	input: {
		color: color.black1,
		fontSize: RFValue(17),
		overflow: 'hidden',
		// don't put margin or padding bottom 
		// it increase the gap between the placeholder and the bottom line
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

export default UpdateProfileInputScreen;
import React, { useState, useEffect, useContext }from 'react';
import { 
	Text,
	StyleSheet, 
	View,
	TouchableOpacity, 
	TextInput,
	ScrollView } from 'react-native';
import { SafeAreaView, } from 'react-native-safe-area-context';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Hooks
import { 
	meetUsernameRules, 
	uniqueUsername, 
} from '../../hooks/meetRulesProfile';

// Components
import { HeaderForm } from '../../components/HeaderForm';
import { ProfileInputForm } from '../../components/ProfileInputForm';

// Contexts
import { Context as AuthContext } from '../../context/AuthContext';

// Designs
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

// Color
import color from '../../color';

// icon
import expoIcons from '../../expoIcons';

const UpdateProfileInputScreen = ({ route, navigation }) => {
	const { inputType } = route.params;
	const { 
		state: { 
			user, 
			newProfileJson,
			newName,
			newUsername,
			newWebsite,
			newSign
		}, 
		addNewName,
		addNewUsername,
		addNewWebsite,
		addNewSign,
		addNewInputToJson,
		cancelProfileUpdate,
	} = useContext(AuthContext);

	// newInputCheck is going to be added to new inputs and new inputs' json
	const [newInputCheck, setNewInputCheck] = useState('');
	const [uniqueUsernameControl, setUniqueUsernameControl] = useState(false);
	const [rulesUsernameControl, setRulesUsernameControl] = useState(false);

	if (inputType === 'Username' && newUsername !== null) {
		useEffect(() => {
			uniqueUsername(newInputCheck, user.username, setUniqueUsernameControl);
			meetUsernameRules(newInputCheck, setRulesUsernameControl);
		}, [newInputCheck]);
	};

	return (
		<SafeAreaView style={styles.updateProfileInputScreenContainer}>
			<HeaderForm 
		    leftButtonTitle={null}
		    leftButtonIcon={expoIcons.evilIconsClose(RFValue(27), color.black1)}
		    headerTitle={inputType} 
		    rightButtonTitle={
	    		inputType === 'Name' && newInputCheck !== ''
		    	? <AntDesign name="check" size={RFValue(25)} color={color.blue1} />
		    	: 
		    	inputType === 'Username' && 
		    	uniqueUsernameControl === true && 
		    	rulesUsernameControl === true && 
		    	newInputCheck !== ''
			    ?	<AntDesign name="check" size={RFValue(25)} color={color.blue1} />
		    	: inputType === 'Website' && newInputCheck !== ''
		    	? <AntDesign name="check" size={RFValue(25)} color={color.blue1} />
		    	: inputType === 'Sign' && newInputCheck !== ''
		    	? <AntDesign name="check" size={RFValue(25)} color={color.blue1} />
		    	: <AntDesign name="check" size={RFValue(25)} color={color.black1} />
	    	}
		    leftButtonPress={() => {
		    	navigation.goBack();
		    }}
		    rightButtonPress={() => {
		    	{
		    		inputType === 'Name'
			    	? (
			    			addNewName(newInputCheck),
			    			addNewInputToJson({ name: newInputCheck }),
			    			navigation.goBack()
			    		)
			    	: 
			    	inputType === 'Username' && 
			    	uniqueUsernameControl === true && 
			    	rulesUsernameControl === true && 
			    	newInputCheck !== ''
				    ?	( 
				    		console.log( uniqueUsernameControl, rulesUsernameControl ),
			    			addNewInputToJson({ username: newInputCheck }),
				    		addNewUsername(newInputCheck),
			    			navigation.goBack()
			    		)
			    	: inputType === 'Website'
			    	? (
			    			addNewWebsite(newInputCheck),
			    			addNewInputToJson({ website: newInputCheck }),
			    			navigation.goBack()
			    		)
			    	: inputType === 'Sign'
			    	? (
			    			addNewSign(newInputCheck),
			    			addNewInputToJson({ sign: newInputCheck }),
			    			navigation.goBack()
			    		)
			    	: null
		    	}
		    }}
		  />
		  <View style={styles.inputContainer} >
		  	{
		  		inputType === 'Name'
		    	? <ProfileInputForm
							setInputCheck={setNewInputCheck}
							assignedValue={newInputCheck}
							currentValue={user.name}
							maxLength={30}
							placeholderValue={"Name"}
							multiline={false}
							customHeight={RFValue(35)}
						/>
		    	: inputType === 'Username'
		    	? <ProfileInputForm
							setInputCheck={setNewInputCheck}
							assignedValue={newInputCheck}
							currentValue={user.username}
							maxLength={30}
							placeholderValue={"Username"}
							multiline={false}
							customHeight={RFValue(35)}
						/>
		    	: inputType === 'Website'
		    	? <ProfileInputForm
							setInputCheck={setNewInputCheck}
							assignedValue={newWebsite}
							currentValue={user.website}
							// maxLength={30}
							placeholderValue={"Website"}
							multiline={false}
							customHeight={RFValue(35)}
						/>
		    	: inputType === 'Sign'
		    	? <ProfileInputForm
							setInputCheck={setNewInputCheck}
							assignedValue={newSign}
							currentValue={user.sign}
							// maxLength={30}
							numberOfLines={30}
							placeholderValue={"Sign"}
							multiline={true}
							customHeight={RFValue(100)}
						/>
		    	: null
		    }
		    { 
		    	inputType !== "Username"
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
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	updateProfileInputScreenContainer: {
		flex: 1,
		backgroundColor: "#FFF",
	},
	inputContainer: {
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
});

export default UpdateProfileInputScreen;
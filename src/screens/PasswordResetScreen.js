import React, { useState, useContext, useEffect } from 'react';
import 
{ 
	View, 
	Text, 
	Image, 
	TextInput, 
	TouchableOpacity, 
	StyleSheet, 
  SafeAreaView
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Context 
import { Context as AuthContext } from '../context/AuthContext';

// Components
import SpinnerFromActivityIndicator from '../components/ActivityIndicator';
import color from '../color';
import { HeaderForm } from '../components/HeaderForm';
import NavLink from '../components/NavLink';

// Designs
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

const PasswordResetScreen = ({ navigation }) => {
	const [email, setEmail] = useState('');

  const [ requestPasswordReset, setRequestPasswordReset ] = useState(false);
  const [ responsePasswordReset, setResponsePasswordReset ] = useState(true);
  const [ requestLoading, setRequestLoading ] = useState(false);

	const { state, clearErrorMessage, passwordReset } = useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      clearErrorMessage();
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, []);

	return (
		<SafeAreaView style={styles.container}>
      <HeaderForm 
        leftButtonTitle='Back'
        headerTitle='Password Reset' 
        rightButtonTitle={null} 
        leftButtonPress={() => {
          navigation.goBack();
        }}
        rightButtonPress={() => {
          null
        }}
      />
			<KeyboardAwareScrollView
        style={styles.signScreenContainer}
        keyboardShouldPersistTaps="always"
      >
				<Image
          style={styles.logo}
          // source={require('../../../assets/icon.png')}
        />

        {
          state.errorMessage 
          ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> 
          : null
        }
        
        {
          requestPasswordReset && responsePasswordReset
          ? null
          : 
          <TextInput
            style={styles.input}
            placeholder='E-mail'
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setEmail(text)}
            value={email}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
        }
        
        <View style={styles.actionContainer}>
        { 
          requestPasswordReset && responsePasswordReset
          ?
          <View style={styles.guideContainer}>
            <Text style={styles.guideText}>An email is sent to</Text>
            <Text style={styles.emailText}> {email} </Text>
            <Text style={styles.guideText}>for password reset.</Text>
            <Text style={styles.guideText}>Use the link in the email to reset your password.</Text>
          </View>
          :
  	      <TouchableOpacity
            style={
              requestLoading 
              ? { ...styles.button, ...{ backgroundColor: color.gray4 }}
              : styles.button
            }
            onPress={() => {
              setRequestLoading(true);
              clearErrorMessage();
              wait(2000)
              .then(async () => {
                setRequestPasswordReset(true);
                const response = await passwordReset({ email });
                setResponsePasswordReset(response);
                setRequestLoading(false);
              });
            }}
          >
            { 
              requestLoading
              ? 
              <View style={styles.spinnerContainer}>
                <SpinnerFromActivityIndicator />
              </View>
              : 
              <Text style={styles.buttonTitle}>Request password reset</Text>
            }
  	      </TouchableOpacity>
        }
        </View>
				<NavLink 
					text="Don't have an account? Sign up instead"
					routeName="Signup"
				/>
			</KeyboardAwareScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
    flex: 1,
    backgroundColor: color.white1,
  },
  signScreenContainer: {
    flex: 1, 
    marginHorizontal: RFValue(20),
  },
  logo: {
    flex: 1,
    height: 120,
    width: 90,
    alignSelf: "center",
    margin: 30
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 16
  },
  guideContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  guideText: {
    fontSize: RFValue(18)
  },
  emailText: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    fontStyle: 'italic',
    textDecorationLine: 'underline'
  },
  button: {
    backgroundColor: '#788eec',
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: 'center'
  },
  buttonTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: "bold"
  },
  errorMessage: {
		fontSize: 16,
		color: 'red',
		marginTop: 15
	}
});

export default PasswordResetScreen;
import React, { useState, useContext, useEffect } from 'react';
import 
{ 
	View, 
	Text, 
	Image, 
	TextInput, 
	TouchableOpacity, 
	StyleSheet, 
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform
} from 'react-native';
import NavLink from '../components/NavLink';
import { Context } from '../context/AuthContext';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import color from '../color';

const SigninScreen = ({ navigation }) => {
	const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

	const { state, signin, clearErrorMessage } = useContext(Context);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      clearErrorMessage();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, []);

	return (
		<KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback 
        onPress={Keyboard.dismiss}
      >
        <View style={styles.inner}>
    			<Image
            style={styles.logo}
            source={require('../../assets/icon.png')}
          />
          {state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}
    			<TextInput
            style={styles.input}
            placeholder='E-mail'
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setEmail(text)}
            value={email}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholderTextColor="#aaaaaa"
            secureTextEntry
            placeholder='Password'
            onChangeText={(text) => setPassword(text)}
            value={password}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => signin({email, password})}>
            <Text style={styles.buttonTitle}>Log in</Text>
          </TouchableOpacity>
    			<NavLink 
    				text="Don't have an account? Sign up instead"
    				routeName="Signup"
    			/>
          <NavLink
            text="Forgot a password?"
            routeName="PasswordReset"
          />
        </View>
      </TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
    flex: 1,
    backgroundColor: color.white1,
  },
  inner: {
    flex: 1,
    marginHorizontal: RFValue(20),
    justifyContent: 'center',
  },
  title: {

  },
  logo: {
    height: RFValue(50),
    width: RFValue(50)
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
  button: {
    backgroundColor: '#788eec',
    marginTop: 20,
    height: 48,
    borderRadius: 5,
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
		marginLeft: 15,
		marginTop: 15
	}
});

export default SigninScreen;
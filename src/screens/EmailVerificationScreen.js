import React, { useState, useContext } from 'react';
import 
{ 
	View,
	ScrollView,
	RefreshControl,
	Text, 
	Image, 
	TouchableOpacity, 
	TouchableHighlight,
	StyleSheet, 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Contexts
import { Context as AuthContext } from '../context/AuthContext';

// Color
import color from '../color';

// Components
import AlertBoxTop from '../components/AlertBoxTop';
import SpinnerFromActivityIndicator from '../components/ActivityIndicator';

// Designs
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

// Firebase
import authFire from  '../firebase/authFire';

// navigate
// import * as RootNavigation from '../navigationRef';

const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

const EmailVerificationScreen = ({ navigation }) => {
	const [ requestVerificationEmail, setRequestVerificationEmail ] = useState(false);
	// alert box
	const [ alertBoxStatus, setAlertBoxStatus ] = useState(false);
	const [ alertBoxText, setAlertBoxText ] = useState("Verification email is sent.");
	const [ requestVELoading, setRequestVELoading ] = useState(false);

	const [refreshing, setRefreshing] = React.useState(false);

	const { state: { user }, clearCurrentUser } = useContext(AuthContext);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => setRefreshing(false));
  }, []);

	return (
		<SafeAreaView style={styles.screenContainer}>
			<ScrollView
				style={{ flex: 1 }}
				refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
			>
				{ 
					alertBoxStatus
					?
					<AlertBoxTop 
						setAlert={setAlertBoxStatus}
						alertText={alertBoxText}
					/>
					:
					null
				}
				<View style={styles.messageContainer}>
					<View stylye={styles.iconContainer}>
						<AntDesign name="mail" size={RFValue(78)} color="black" />
					</View>
					<Text style={styles.messageText}>
						Verify your email
					</Text>
					<View style={styles.guideContainer}>
						<Text style={styles.guideText}>
							An email has been sent to {user.email} for email verification.
						</Text>
						<Text style={styles.guideText}>
							Check your inbox and use the link in the email sent by us to verify your email address.
						</Text>
					</View>
				</View>
				<View style={styles.actionContainer}>
					{
						requestVELoading
						? 
						<View style={styles.spinnerContainer}>
							<SpinnerFromActivityIndicator />
						</View>
						: null
					}
					{ 
						requestVerificationEmail
						?
						<View>
							<Text>Another verification email is sent to: </Text>
							<Text style={styles.emailText}>{user.email}.</Text>
							<Text>Please check your spam box as well.</Text>
							<Text>After you verify your email, log in again using the link below.  
								<AntDesign name="smileo" size={RFValue(13)} color={color.black1} />
							</Text>
						</View>
						:
						<TouchableHighlight
							onPress={() => {
								setRequestVELoading(true);
								wait(2000).then(() => {
									setRequestVerificationEmail(true);
									setWarningRequestSent(true);
									setRequestVELoading(false);
									authFire.sendVerificationEmail();
								})
							}}
							underlayColor={color.gray4}
						>
							<Text style={styles.actionText}>Request another verification email</Text>
						</TouchableHighlight>
					}
					<TouchableOpacity 
						onPress={() => { clearCurrentUser() }}
						style={styles.actionButtonB}
					>
						<Text style={styles.actionButtonBText}>
							Go to Sign Up
						</Text>
						<View style={{borderWidth: 1}}>
						</View>
						<Text style={styles.actionButtonBText}>
							Sign In
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
};

const styles = StyleSheet.create({
	screenContainer: {
		flex: 1,
	},
	messageContainer: {
		flex: 3,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: RFValue(38),
		paddingVertical: RFValue(108),
	},
	messageText: {
		fontSize: RFValue(38),
	},
	iconContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: RFValue(20),
	},
	guideContainer: {
		paddingVertical: RFValue(10),
		justifyContent: 'center',
		alignItems: 'center',
	},
	guideText: {
		paddingTop: RFValue(5),
		fontSize: RFValue(18)
	},
	actionContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: RFValue(38),
	},
	actionText: {
		color: color.blue1
	},
	actionButtonB: {
		flexDirection: 'row',
		justifyContent: 'center', 
		alignItems: 'center',
		paddingTop: RFValue(10),
	},
	actionButtonBText: {
		paddingHorizontal: 10,
		color: color.blue1,
	},
	emailText: {
		color: color.blue1
	},
	spinnerContainer: {
		padding: 10,
		flexDirection: 'row',
		justifyContent: 'center', 
	}
});

export default EmailVerificationScreen;
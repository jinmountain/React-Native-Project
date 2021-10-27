import createDataContext from './createDataContext';
import authFire from '../firebase/authFire';
import usersGetFire from '../firebase/usersGetFire';
import { profileUpdateFire } from '../firebase/profileUpdateFire';
import businessUpdateFire from '../firebase/businessUpdateFire';

// import navigate from '../hooks/navigate';

const authReducer = (state, action) => {
	switch (action.type) {
		case 'add_error': 
			return { ...state, errorMessage: action.payload };
		case 'signin':
			return { errorMessage: '' };
		case 'clear_error_message':
			return { ...state, errorMessage: '' };
		case 'add_currentUser':
			return { user: action.payload };
		case 'clear_currentUser':
			return { ...state, user: null };
		case 'signout':
			return { errorMessage: '', user: null };
		// update profile
		case 'reset_profile_edit':
			return { ...state, newName: null, newUsername: null, newWebsite: null, newSign: null, newProfileJson: null };
		case 'add_new_name':
			return { 
				...state, 
				newName: action.payload, 
			};
		case 'add_new_username':
			return { 
				...state, 
				newUsername: action.payload,
			};
		case 'add_new_website':
			return { 
				...state, 
				newWebsite: action.payload,
			};
		case 'add_new_sign':
			return { 
				...state, 
				newSign: action.payload,
			};
		case 'add_new_input_json':
			return {
				...state,
				newProfileJson: { ...state.newProfileJson, ...action.payload }
			}
		case 'cancel_profile_update': 
			return { ...state, newProfileJson: null };
		
		// navigation status
		case 'tab_home':
			return { ...state, homeTab: true, searchTab: false, activityTab: false, accountTab: false };
		case 'tab_search':
			return { ...state, homeTab: false, searchTab: true, activityTab: false, accountTab: false };
		case 'tab_activity':
			return { ...state, homeTab: false, searchTab: false, activityTab: true, accountTab: false };
		case 'tab_account':
			return { ...state, homeTab: false, searchTab: false, activityTab: false, accountTab: true };

		default:
			return state;
	}
};

const trimmer = (string) => {
	return string.trim();
}

const localSignin = dispatch => async (navigate, screen) => {
	return new Promise (async (res, rej) => {
		try {
			const userData = await authFire.localSigninFire();
			if (userData) {
				console.log('localSignin: userData >> ', userData.id);
			} else {
				console.log('localSignin: current user data does not exist');
			}
			dispatch({ type: 'add_currentUser', payload: userData});
			if (screen) {
				navigate(screen);
			}
			// userData is false when didn't go through
			res(userData);
		} catch (error) {
			console.log('localSignin: ', error);
			rej(error);
		};
	});
};

const accountRefresh = dispatch => (navigate) => {
	const authCheck = authFire.authCheck();
	authCheck
	.then((currentUser) => {
		const getUserInfo = usersGetFire.getUserInfoFire(currentUser.uid);
		getUserInfo
		.then((userData) => {
			if (userData) {
				dispatch({ type: 'add_currentUser', payload: userData});
				console.log('current user data is up to date: ', userData.id);
			} else {
				// when userData is false
				console.log('can not find the curren user data');
			}
		})
		.catch((error) => {
			console.log("error: accountRefresh: getUserInfoFire: ", error);
		});
	})
	.catch((error) => {
		// when authCheck fails
		const signOut = authFire.signoutFire();
		signOut
		.then(() => {
			dispatch({ type: 'clear_currentUser'});
			console.log("AuthContext: accountRefresh: authCheck: ", error);
		})
		.catch((error) => {
			console.log("error: signoutFire: ", error);
		});
	});
};

const updateUser = dispatch => async (type, newProfile) => {
	console.log("update user: ", type, newProfile);
	const authCheck = authFire.authCheck();
	authCheck
	.then((currentUser) => {
		const currentUserId = currentUser.uid;
		const newUserData = profileUpdateFire(currentUserId, type, newProfile);
		newUserData
		.then( async (response) => {
			if (response) {
				console.log("new user info applied: ", response);
				const getUserInfo = usersGetFire.getUserInfoFire(currentUserId);
				getUserInfo
				.then((userData) => {
					if (userData) {
						dispatch({ type: 'add_currentUser', payload: userData});
						console.log('received new user data: ', userData.id);
					} else {
						console.log('new user data update failed');
					}
				})
				.catch((error) => {
					console.log("error: getUserInfoFire: ", error);
				});
			} else {
				console.log("AuthContext: updateUser: profile update failed");
			}
		})
		.catch((err) => {
			console.log(err);
		});
	})
	.catch((error) => {
		// when authCheck fails
		const signOut = authFire.signoutFire();
		signOut
		.then(() => {
			dispatch({ type: 'clear_currentUser'});
			console.log("AuthContext: updateUser: authCheck: ", error);
		})
		.catch((error) => {
			console.log("error: AuthContext: updateUser: signOut: ", error);
		})
	});
}

const clearErrorMessage = dispatch => () => {
	dispatch({ type: 'clear_error_message' });
};

const signup = dispatch => async ({ email, password, confirmPassword }) => {
	try {
		const userData = await authFire.signupFire(
			trimmer(email), 
			trimmer(password), 
			trimmer(confirmPassword)
		);
		if (userData === 'passwordDoNotMatch') {
			dispatch({ 
				type: 'add_error', payload: 
				'Your password and confirm password do not match.' 
			});
		} else {
			dispatch({ type: 'add_currentUser', payload: userData});
		} 
	} catch (error) {
		dispatch({ type: 'add_error', payload: 'Email is already registered.' })
		switch (error.code) {
      // when email is allready in user
      case 'auth/email-already-in-use':
        console.log(`Email address ${email} already in use.`);
        // sign in with the email and password and check whether the email is verified
        break;
      case 'auth/invalid-email':
        console.log(`Email address ${email} is invalid.`);
        break;
      case 'auth/operation-not-allowed':
        console.log(`Error during sign up.`);
        break;
      case 'auth/weak-password':
        console.log('Password is not strong enough. Add additional characters including special characters and numbers.');
        break;
      default:
        console.log(error.message);
        break;
    };
	};
};

const signin = dispatch => async ({ email, password }) => {
	try {
		const userData = await authFire.signinFire(trimmer(email), trimmer(password));
		dispatch({ type: 'add_currentUser', payload: userData});
	} catch (err) {
		dispatch({
			type: 'add_error',
			payload: 'Email is not registered or password is incorrect'
		});
		console.log(err);
	}
};

const passwordReset = dispatch => ({ email }) => {
	return new Promise (async (res, rej) => {
		try {
			const request = await authFire.passwordResetFire(trimmer(email));
			res(request);
		} catch (error) {
			switch (error.code) {
	      // when email is allready in user
	      case 'auth/invalid-email':
	      	dispatch({
						type: 'add_error',
						payload: 'Email is not valid'
					});
	        console.log(`Email address is not valid.`);
	        break;
	      default:
	      	dispatch({
						type: 'add_error',
						payload: 'Sorry, try again later'
					});
	        console.log(error.message);
	        break;
	    };
			res(false);
		}
	})
};

const signout = dispatch => async () => {
	return new Promise ((res, rej) => {
		const signOut = authFire.signoutFire();
		signOut
		.then(() => {
			console.log("signout successful");
			dispatch({ type: 'clear_currentUser' });
			console.log('state change: user >> null user info is removed from auth context');
			res(true);
		})
		.catch((error) => {
			rej(error);
		})
	})
};

const clearCurrentUser = dispatch => () => {
	dispatch({ type: 'clear_currentUser'});
};

// update profile
const resetEdit = dispatch => () => {
	dispatch({ type: 'reset_profile_edit' });
}

const addNewName = dispatch => (newName) => {
	dispatch({ type: 'add_new_name', payload: newName });
};

const addNewUsername = dispatch => (newUsername) => {
	dispatch({ type: 'add_new_username', payload: newUsername });
};

const addNewWebsite = dispatch => (newWebsite) => {
	dispatch({ type: 'add_new_website', payload: newWebsite });
};

const addNewSign = dispatch => (newSign) => {
	dispatch({ type: 'add_new_sign', payload: newSign });
};

const addNewInputToJson = dispatch => (newInput) => {
	dispatch({ type: 'add_new_input_json', payload: newInput });
	console.log("Added: ", newInput);
}

const cancelProfileUpdate = dispatch => () => {
	dispatch({ type: 'cancel_profile_update' });
	console.log("Cancelled the profile update.");
}

// navigation bar status
const tabHome = dispatch => () => {
	dispatch({ type: 'tab_home', });
}
const tabSearch = dispatch => () => {
	dispatch({ type: 'tab_search', });
}
const tabActivity = dispatch => () => {
	dispatch({ type: 'tab_activity', });
}
const tabAccount = dispatch => () => {
	dispatch({ type: 'tab_account', });
}

export const { Provider, Context } = createDataContext(
	authReducer,
	{
		signin, 
		signout,
		clearCurrentUser,
		signup,
		passwordReset,
		clearErrorMessage, 
		localSignin, 
		accountRefresh, 
		updateUser, 
		// update profile
		resetEdit,
		addNewName,
		addNewUsername,
		addNewWebsite,
		addNewSign,
		addNewInputToJson,
		cancelProfileUpdate,
		// navigation bar status
		tabHome,
		tabSearch,
		tabActivity,
		tabAccount,
	},
	{ 
		user: null, 
		// update profile
		newProfileJson: null, 
		newName : null,
		newUsername : null,
		newWebsite: null,
		newSign: null,
		// navigation bar status
		homeTab: true,
		searchTab: false,
		activityTab: false,
		accountTab: false,

		errorMessage: '' 
	}
);
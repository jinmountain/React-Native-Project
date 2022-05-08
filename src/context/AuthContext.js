import createDataContext from './createDataContext';
import {
	authCheck,
	signoutFire,
	signupFire,
	signinFire,
	passwordResetFire,
} from '../firebase/authFire';
import {
	getUserInfoFire,
} from '../firebase/user/usersGetFire';

// import navigate from '../hooks/navigate';

const authReducer = (state, action) => {
	switch (action.type) {
		case 'add_error': 
			return { ...state, errorMessage: action.payload };

		case 'signin':
			return { ...state, errorMessage: '' };
		case 'signout':
			return { errorMessage: '', user: null };

		case 'clear_error_message':
			return { ...state, errorMessage: '' };

		case 'add_current_user_id':
			return { ...state, userId: action.payload };
		case 'add_current_user_data':
			return { ...state, user: action.payload };
		case 'clear_current_user_data':
			return { ...state, user: null, userId: null };

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
};

const accountRefresh = dispatch => (navigate) => {
	return new Promise ((res, rej) => {
		const checkAuth = authCheck();
		checkAuth
		.then((currentUser) => {
			const getUserInfo = getUserInfoFire(currentUser.uid);
			getUserInfo
			.then((userData) => {
				if (userData) {
					dispatch({ type: 'add_current_user_data', payload: userData});
					dispatch({ type: 'add_current_user_id', payload: userData.id });
					console.log('AuthContext accountRefresh: ', userData.id);
					res(userData);
				} else {
					// when userData is false
					console.log('current user not found');
					rej("current user not found");
				}
			})
			.catch((error) => {
				console.log("error: AuthContext/accountRefresh/getUserInfoFire: ", error);
			});
		})
		.catch((error) => {
			// when authCheck fails
			const signOut = signoutFire();
			signOut
			.then(() => {
				dispatch({ type: 'clear_current_user_data'});
				console.log("AuthContext/accountRefresh/authCheck: ", error);
				rej("auth failed signed out");
			})
			.catch((error) => {
				console.log("error: signoutFire: ", error);
				rej("auth failed sign out failed");
			});
		});
	});
};

const addCurrentUserId = dispatch => (userId) => {
	dispatch({ type: 'add_current_user_id', payload: userId });
};
const addCurrentUserData = dispatch => (userData) => {
	dispatch({ type: 'add_current_user_data', payload: userData});
};

const clearErrorMessage = dispatch => () => {
	dispatch({ type: 'clear_error_message' });
};

const signup = dispatch => async ({ email, password, confirmPassword }) => {
	try {
		const userData = await signupFire(
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
			dispatch({ type: 'add_current_user_data', payload: userData });
			dispatch({ type: 'add_current_user_id', payload: userData.id });
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
        console.log('Error during sign up.');
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
		const userData = await signinFire(trimmer(email), trimmer(password));
		dispatch({ type: 'add_current_user_data', payload: userData});
		dispatch({ type: 'add_current_user_id', payload: userData.id });
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
			const request = await passwordResetFire(trimmer(email));
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

	      case 'auth/user-not-found':
	      	dispatch({
	      		ype: 'add_error',
						payload: 'Email is not registered'
	      	});
	      	break;
	      default:
	      	dispatch({
						type: 'add_error',
						payload: 'Sorry, try again later'
					});
					console.log(error.code);
	        console.log(error.message);
	        break;
	    };
			res(false);
		}
	})
};

const signout = dispatch => async () => {
	return new Promise ((res, rej) => {
		const signOut = signoutFire();

		signOut
		.then(() => {
			console.log("signout successful");
			dispatch({ type: 'clear_current_user_data' });
			console.log('user signed out');
			res(true);
		})
		.catch((error) => {
			rej(error);
		});
	});
};

const clearCurrentUser = dispatch => () => {
	dispatch({ type: 'clear_current_user_data'});
};

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

		//
		accountRefresh,
		addCurrentUserId,
		addCurrentUserData,

		// navigation bar status
		tabHome,
		tabSearch,
		tabActivity,
		tabAccount,
	},
	{ 
		user: null,
		userId: null,

		// navigation bar status
		homeTab: true,
		searchTab: false,
		activityTab: false,
		accountTab: false,

		errorMessage: '' 
	}
);
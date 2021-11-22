import Firebase from '../firebase/config'
import { navigate } from '../navigationRef';
import checkUsernameFire from './checkUsernameFire';


import authFire from '../firebase/authFire';

const timestamp = () => {
	return Date.now()
};

const firestoreUsersUpdate = (userId, newProfileInfo) => {
	const usersRef = Firebase.firestore().collection('users')
	usersRef
	.doc(userId)
	.update(newProfileInfo)
	.then((user) => {
		console.log("updated user data on firestore");
	})
	.catch((error) => {
		console.log(error);
	});
};

const profileUpdateFire = (newProfile) => {
	return new Promise (async (res, rej) => {
		const authCheck = authFire.authCheck();
			authCheck
			.then((currentUser) => {
				if (newProfile.username) {
					const checkUsernameUnique = checkUsernameFire.checkUniqueUsername(newProfile.username);
					checkUsernameUnique
					.then((result) => {
						// result true if the username is unique
						if (result) {
							console.log("change user data with new username");
							let newProfileDataWithLastUsernameChangeAt = {...newProfile, ...{last_username_change_at: Date.now()}};
							try {
								firestoreUsersUpdate(currentUser.uid, newProfileDataWithLastUsernameChangeAt);
								res(true);
							} catch (error) {
								rej(error);
							};
						} else {
							rej(false);
						}
					})
					.catch((error) => {
						rej(error);
					});
				} else {
					console.log("change user data without new username");
					try {
						firestoreUsersUpdate(currentUser.uid, newProfile);
						res(true);
					} catch (error) {
						rej(error);
					};
				}
			})
			.catch((error) => {
				rej(error);
			});
	});
};

export { profileUpdateFire }
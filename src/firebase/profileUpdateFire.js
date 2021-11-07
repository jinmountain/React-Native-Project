import Firebase from '../firebase/config'
import { navigate } from '../navigationRef';
import checkUsernameFire from './checkUsernameFire';

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

const profileUpdateFire = (userId, newProfile) => {
	return new Promise (async (res, rej) => {
		try {
			if (newProfile.username) {
				const checkUsernameUnique = checkUsernameFire.checkUniqueUsername(newProfile.username);
				checkUsernameUnique
				.then((result) => {
					// result true if the username is unique
					if (result) {
						console.log("change user data with new username");
						firestoreUsersUpdate(userId, newProfile);
						res(true);
					} else {
						console.log("profileUpdateFire: profileUpdateFire: checkUniqueUsername: username already exists");
						res(false);
					}
				})
				.catch((error) => {
					res(false);
					console.log('Error occured: profileUpdateFire: profileUpdateFire:', error);
				});
			} else {
				console.log("change user data without new username");
				try {
					firestoreUsersUpdate(userId, newProfile);
					res(true);
				} catch (error) {
					res(false);
					console.log('Error occured: profileUpdateFire: profileUpdateFire: ', error);
				};
			}
		} catch (error) {
			rej(error);
		};
	});
};

export { profileUpdateFire }
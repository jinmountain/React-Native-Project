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
		console.log("users updated");
	})
	.catch((error) => {
		console.log(error);
	});
};

const profileUpdateFire = (userId, type, newProfile) => {
	return new Promise (async (res, rej) => {
		try {
			if (newProfile.username) {
				await checkUsernameFire.checkUniqueUsername(newProfile.username);
				try {
					// updating profile AUTH and Firestore
					firestoreUsersUpdate(userId, newProfile);
					res(newProfile);
				} catch (error) {
					res(false);
					console.log('Error occured: profileUpdateFire: profileUpdateFire:', error);
				};
			} else {
				console.log("change user info without new username");
				try {
					firestoreUsersUpdate(userId, newProfile);
					res(newProfile);
				} catch (error) {
					res(false);
					console.log('Error occured: profileUpdateFire: profileUpdateFire: ', error);
				};
			}
		} catch (error) {
			res(false);
			console.log("username is taken or ", error);
		};
	});
};

export { profileUpdateFire }
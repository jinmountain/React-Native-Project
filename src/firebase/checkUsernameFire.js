import Firebase from '../firebase/config'
import { navigate } from '../navigationRef';

const currentUserFire = () => {
	return Firebase.auth().currentUser || {}
};

const checkUniqueUsername = (possibleUsername) => {
	const trimmedUsername = possibleUsername.trim();
	return new Promise (async (res, rej) => {
		console.log(`comparing ${trimmedUsername} to other usernames.`)
		const findUsernameRef = await Firebase.firestore().collection("users");
		findUsernameRef
		.where("username", "==", trimmedUsername)
		.get()
		.then((snapshot) => {
			if (snapshot.empty) {
				console.log(`A user with ${trimmedUsername} not found`);
				res(true);
			} else {
				snapshot.forEach((doc) => {
					console.log(doc.id, " => ", doc.data());
					res(false);
				});
			}
		})
		.catch((error) => {
			rej(error);
		});
	})
};

export default { checkUniqueUsername }
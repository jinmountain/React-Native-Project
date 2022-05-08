import Firebase from '../../firebase/config';
import firebase from 'firebase/app';

import { authCheck } from '../../firebase/authFire';
import checkUsernameFire from '../../firebase/checkUsernameFire';

const db = Firebase.firestore();
const usersRef = db.collection('users');

const deleteUsernameSearchHistFire = (userId, shId) => {
	return new Promise (async (res, rej) => {
		usersRef
	  .doc(userId)
	  .collection("user_search_history")
	  .doc(shId)
	  .delete();
	});
}


export { deleteUsernameSearchHistFire }
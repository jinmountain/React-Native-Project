import Firebase from '../firebase/config';
import firebase from 'firebase/app';

const db = Firebase.firestore();
const usersRef = db.collection('users');

const changeUserAppState = (userId, appState) => {
	usersRef
	.doc(userId)
	.set({
		appState: appState
	}, {
		merge: true
	});
};

const postUserCurrentChat = (userId, chatId) => {
	usersRef
	.doc(userId)
	.set({
		currentChatId: chatId
	}, {
		merge: true
	});
} 

export default { changeUserAppState, postUserCurrentChat};
import Firebase from '../firebase/config';
import firebase from 'firebase/app';
import { navigate } from '../navigationRef';

import useConvertTime from '../hooks/useConvertTime';

const db = Firebase.firestore();
const usersRef = db.collection('users');
const postsRef = db.collection('posts');
const reservationsRef = db.collection('reservations');

const deleteBusSpecialHoursDoc = (busId, specialHoursDocId) => {
	return new Promise ((res, rej) => {
		try {
			const deleteSpecialHours = usersRef.doc(busId).collection("special_hours").doc(specialHoursDocId).delete();
			res(true);
		} catch (error) {
			rej(error);
		}
	});
};

const deleteTechSpecialHoursDoc = (busId, techId, specialHoursDocId) => {
	return new Promise ((res, rej) => {
		try {
			const deleteSpecialHours = usersRef.doc(busId).collection("technicians").doc(techId).collection("special_hours").doc(specialHoursDocId).delete();
			res(true);
		} catch (error) {
			rej(error);
		}
	});
};

export default { 
	deleteBusSpecialHoursDoc,
	deleteTechSpecialHoursDoc
};
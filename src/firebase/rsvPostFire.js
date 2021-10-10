import Firebase from '../firebase/config';
import firebase from 'firebase/app';
import { navigate } from '../navigationRef';

import useConvertTime from '../hooks/useConvertTime';

const db = Firebase.firestore();
const usersRef = db.collection('users');
const reservationsRef = db.collection('reservations');

const appRsvCounts = db.collection('rsvCounts');

const cancelRsv = (
	rsvId,
	busId,
	busLocationType,
	busLocality,
	cusId,
	postServiceType,
) => {
	return new Promise (async (res, rej) => {
		const countIncrementByOne = firebase.firestore.FieldValue.increment(1);

		const changeCounts = (changeRef, doc) => {
			// increase total count
			changeRef.doc(doc).set({
  			cancelledCount: countIncrementByOne,
  		}, { merge: true });
  	}

		try {
			// check if the rsv exists
			reservationsRef
			.doc(rsvId)
			.get()
			.then((doc) => {
				if (doc.exists) {
					// delete reservation
					const deleteRsv = reservationsRef.doc(rsvId).delete();
					// App Global Reservation Count
					changeCounts(appRsvCounts, `${postServiceType}GlobalRsvCount`);
					if (busLocationType === "inStore" && busLocality) {
						// App Local Reservation Count
						changeCounts(appRsvCounts, `${postServiceType}${busLocality}RsvCount`);
					}
					// Business Reservation Count
					changeCounts(usersRef.doc(busId).collection("rsvCounts"), `${postServiceType}RsvCount`);
		  		// Customer User Reservation Count
		  		changeCounts(usersRef.doc(cusId).collection("rsvCounts"), `${postServiceType}RsvCount`);
		  		res(true);
				} else {
					res("rsvNotFound");
				}
			});
		} 
		catch {(error) => {
			rej(error);
		}};
	});
};

export default { cancelRsv };
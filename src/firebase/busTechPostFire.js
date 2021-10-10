import Firebase from '../firebase/config';
import firebase from 'firebase/app';
import { navigate } from '../navigationRef';

const db = Firebase.firestore();
const usersRef = db.collection('users');
const techAppsRef = db.collection('techApps');

const sendTechApp = (targetUserId, currentUserId) => {
	return new Promise (async (res, rej) => {
		try {
			// first get current user data and check type is technician
			// const currentUser = await usersRef.doc(currentUserId).get();
			// const targetUser = await usersRef.doc(targetUserId).get();
			const checkExistingRequest = await techAppsRef
			.where("techId", "==", currentUserId)
			.where("busId", "==", targetUserId)
			.get()
			.then((querySnapshot) => {
				if (querySnapshot.docs.length > 0) {
					console.log("already sent the request");
					res(true);
				} else {
					const createdAt = Date.now();
					const requestId = techAppsRef.doc().id;
					const requestData = { 
						busId: targetUserId, 
						techId: currentUserId, 
						createdAt: createdAt 
					};
					techAppsRef.doc(requestId).set(requestData);

					usersRef
					.doc(targetUserId)
					.collection("notifications")
					.add({
						collection: "techApps", 
						docId: requestId,
						senderId: currentUserId,
						createdAt: createdAt 
					});
					console.log("sent join request");
					res('sent');
				}
			})
			.catch((error) => {
				console.log("Error occured: firebase: busTechPostFire: sendTechApp: checkExistingRequest: ", error);
			});


		} 
		catch {(error) => {
			console.log("Error occured: firebase: busTechPostFire: sendTechApp: ", error);
		}};
	});
};

const cancelTechApp = (targetUserId, currentUserId) => {
	return new Promise (async (res, rej) => {
		try {
			// first get current user data and check type is technician
			// const currentUser = await usersRef.doc(currentUserId).get();
			// const targetUser = await usersRef.doc(targetUserId).get();
			const checkExistingRequest = await techAppsRef
			.where("techId", "==", currentUserId)
			.where("busId", "==", targetUserId)
			.get()
			.then((querySnapshot) => {
				if (querySnapshot.docs.length > 0) {
					querySnapshot.forEach(async (doc) => {
						const docId = doc.id;
						techAppsRef.doc(docId).delete();
						res('canceled');
					});
				} else {
					console.log("tech app does not exist");
					res(false);
				}
			})
			.catch((error) => {
				console.log("Error occured: firebase: busTechPostFire: cnacelTechApp: checkExistingRequest: ", error);
			});
		} 
		catch {(error) => {
			console.log("Error occured: firebase: busTechPostFire: cnacelTechApp: ", error);
		}};
	});
};

const requestTechLeave = (targetUserId, currentUserId) => {
	return new Promise ((res, rej) => {
		try {
			
		} 
		catch {(error) => {

		}};
	});
};

const acceptTechApp = (techAppId, techId, busId) => {
	return new Promise ((res, rej) => {
		try {
			const createdAt = Date.now();
			const techniciansRef = usersRef.doc(busId).collection("technicians");
			
			techniciansRef
			.doc(techId)
			.set({
				techId: techId,
				createdAt: createdAt,
				status: 'active'
			}, { merge: true });

			usersRef
			.doc(busId)
			.set({
				techs: firebase.firestore.FieldValue.arrayUnion(techId)
			}, { merge: true });

			techAppsRef.doc(techAppId).delete();

			res(true);
		} catch {(error) => {
			console.log("Error occured: firebase: busTechPostFire: acceptTechToBus: ", error);
			res(false);
		}}
	});
};

const declineTechApp = (techAppId, techId, busId) => {
	return new Promise ((res, rej) => {
		try {
			techAppsRef.doc(techAppId).delete();
			res(true);
		} catch {(error) => {
			console.log("Error occured: firebase: busTechPostFire: acceptTechToBus: ", error);
			res(false);
		}}
	});
}



export default { sendTechApp, cancelTechApp, acceptTechApp, declineTechApp };
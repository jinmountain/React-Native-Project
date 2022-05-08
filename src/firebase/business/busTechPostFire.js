import Firebase from '../../firebase/config';
import firebase from 'firebase/app';
import { navigate } from '../../navigationRef';

const db = Firebase.firestore();
const usersRef = db.collection('users');
const techAppsRef = db.collection('techApplications');
const batch = db.batch();

const postNewTechDocFire = (busId, techId, senderId, receiverId, statusType) => {
	// when tech apply sender is tech
	// when bus invite sender is bus
	return new Promise ((res, rej) => {
		// first get current user data and check type is technician
		// const currentUser = await usersRef.doc(currentUserId).get();
		// const targetUser = await usersRef.doc(targetUserId).get();
		const techniciansRef = usersRef.doc(busId).collection("technicians");
		techniciansRef
		.doc(techId)
		.get()
		.then(async (doc) => {
			const dateNow = Date.now();

			const sendNotification = async () => {
				const notiDocId = await usersRef
				.doc(receiverId)
				.collection("notifications")
				.doc().id;

				await usersRef
				.doc(receiverId)
				.collection("notifications")
				.doc(notiDocId)
				.set({
					type: "new_tech_doc",
					docId: techId,
					senderId: senderId,
					createdAt: dateNow 
				});
			}
			
			// update existing doc
			if (doc.exists) {
				const docData = doc.data();
				if (docData.status === 'inactive') {
					await techniciansRef
					.doc(techId)
					.set({
						techId: techId,
						createdAt: dateNow,
						status: statusType
					}, { merge: true });

					sendNotification();

					res(true);
				}
				else {
					res(false);
				}
			} 
			// or make a new doc
			else {
				await techniciansRef
				.doc(techId)
				.set({
					techId: techId,
					createdAt: dateNow,
					status: statusType
				});

				sendNotification();

				res(true);
			};
		});
	});
};

// when tech doc's status is applied or invited you can remove the tech doc
const removeTechDocFire = (busId, techId) => {
	return new Promise (async (res, rej) => {
		const techniciansRef = usersRef.doc(busId).collection("technicians");

		techniciansRef
		.doc(techId)
		.get()
		.then((doc) => {
			if (doc.exists) {
				const docData = doc.data();
				// when status is applied or invited then can cancel
				if (docData.status === 'applied' || docData.status === 'invited') {
					techniciansRef
					.doc(techId)
					.delete()
					.then(() => {
						res(true);
					})
					.catch((error) => {
						rej(error);
					})
				} else {
					rej("tech doc status is not applied or invited");
				}
			} else {
				rej("tech doc does not exist");
			}
		})
		.catch((error) => {
			rej(error);
		});
	})
};

// when the tech doc status is active you can inactivate it
const inactivateTechDocFire = (busId, techId) => {
	return new Promise ((res, rej) => {
		const dateNow = Date.now();
		const techniciansRef = usersRef.doc(busId).collection("technicians");

		techniciansRef
		.doc(techId)
		.set({
			leftAt: dateNow,
			status: 'inactive'
		}, { merge: true })
		.then(() => {
			res(true);
		})
		.catch((error) => {
			rej(error);
		});
	});
};

// when the tech doc status is applied or invited you can activate it
const activateTechDocFire = (busId, techId) => {
	return new Promise ((res, rej) => {
		const dateNow = Date.now();
		const techniciansRef = usersRef.doc(busId).collection("technicians");
		
		techniciansRef
		.doc(techId)
		.set({
			joinedAt: dateNow,
			status: 'active'
		}, { merge: true })
		.then(() => {
			res(true);
		})
		.catch((error) => {
			rej(error);
		});
	});
};

export { postNewTechDocFire, removeTechDocFire, inactivateTechDocFire, activateTechDocFire };
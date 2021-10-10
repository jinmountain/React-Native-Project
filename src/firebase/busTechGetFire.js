import Firebase from '../firebase/config'
import { navigate } from '../navigationRef';

const db = Firebase.firestore();
const usersRef = db.collection('users');
const techAppsRef = db.collection('techApps');

const getTechApp = (targetUserId, currentUserId) => {
	return new Promise (async (res, rej) => {
		try {
			const checkExistingApp = 
				await techAppsRef
				.where("techId", "==", currentUserId)
				.where("busId", "==", targetUserId)
				.get()
				.then((querySnapshot) => {
					if (querySnapshot.docs.length > 0) {
						return true;
					} else {
						return false;
					}
				})
				.catch((error) => {
					console.log("Error occured: firebase: businessTechnicianPostFire: sendTechnicianRequest: checkExistingRequest: ", error);
				});

			if (checkExistingApp === true) {
				res(true);
			}
			else {
				res(false);
			}
		} 
		catch {(error) => {
			console.log("Error occured: firebase: businessTechnicianPostFire: getTechnicianRequest: ", error);
		}};
	});
};

const getTechAppToBus = (
	businessId,  
	setTechAppLast,
	setTechAppFetchSwitch,
	techAppLast,
) => {
	return new Promise ((res, rej) => {
		try {
			var limit = 7;
			let techAppsStartAfterRef;
			if (techAppLast) {
				techAppsStartAfterRef = techAppsRef
				.where("busId", "==", businessId)
				.orderBy("createdAt", "desc")
				.startAfter(techAppLast)
				console.log("startAfter techAppLast");
			} else {
				techAppsStartAfterRef = techAppsRef
				.where("busId", "==", businessId)
				.orderBy("createdAt", "desc")
			};
			let techApp = []
			techAppsStartAfterRef
			.limit(limit)
			.get()
			.then((querySnapshot) => {
				let docIndex = 0;
				const docLength = querySnapshot.docs.length;
				var lastVisible = querySnapshot.docs[docLength - 1];

				// handle lastVisible
				if (lastVisible !== undefined) {
					setTechAppLast(lastVisible);
				} 
				// handle switch
				//  - when docLength is shorter than limit it means no more docs available
				if (docLength < limit) {
					setTechAppFetchSwitch(false);
					console.log("messageFetchSwitch >> off.");
				}

				if (docLength > 0) {
					querySnapshot.forEach(async (doc) => {
						const docId = doc.id;
			    	const docData = doc.data();
			    	const getTechnicianData = await usersRef.doc(docData.techId).get();
		    		const technicianData = getTechnicianData.data();

		    		// gather the data to the variable chat
			    	const appDoc = { 
				    	id: docId, 
				    	createdAt: docData.createdAt,
				    	techData: {
				    		id: technicianData.id,
				    		username: technicianData.username,
				    		photoURL: technicianData.photoURL, 
				    	}
				    }

			    	techApp.push(appDoc);
			    	docIndex += 1;
			    	if (docIndex === docLength) {
			    		res(techApp);
						}
					})
				} 
				else {
					res(techApp);
				}
			});
		} catch{(error) => {
			console.log("Error occured: busTechGetFire: getTechAppToBus: ", error);
		}}
	})
};

export default { getTechApp, getTechAppToBus };
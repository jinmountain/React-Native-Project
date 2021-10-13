import Firebase from '../firebase/config';
import firebase from 'firebase/app';
import { navigate } from '../navigationRef';

import useConvertTime from '../hooks/useConvertTime';

const db = Firebase.firestore();
const usersRef = db.collection('users');
const postsRef = db.collection('posts');
const reservationsRef = db.collection('reservations');

const getUpcomingRsvsOfCus = (userId, currentTimestamp, lastRsv) => {
	return new Promise ( async (res, rej) => {
		const dateInMs = useConvertTime.convertToDateInMs(currentTimestamp);
		let reservations = [];
		let getReservations

		if (lastRsv) {
			getReservations = reservationsRef
			.where("cusId", "==", userId)
			.where("startAt", ">=", currentTimestamp)
			.startAfter(lastRsv)
			.limit(7);
		} else {
			getReservations = reservationsRef
			.where("cusId", "==", userId)
			.where("startAt", ">=", currentTimestamp)
			.limit(7);
		}
		
		getReservations
		.get()
		.then((querySnapshot) => {
			const docLength = querySnapshot.docs.length;
			var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
			let fetchSwitch = false;
			fetchSwitch = docLength < 7 ? false : true;
			let docIndex = 0;

			if (docLength > 0) {
				console.log("found upcoming reservations");
				querySnapshot.forEach(async (doc) => {
					const rsvData = doc.data();

					const getTechData = await usersRef.doc(rsvData.techId).get();
					const techData = getTechData.data();
					const getBusData = await usersRef.doc(rsvData.busId).get();
					const busData = getBusData.data();
					if (busData && busData.g) {
            delete busData['g']
          }
          if (busData && busData.coordinates) {
            delete busData['coordinates']
          }
					const getPostData = await postsRef.doc(rsvData.displayPostId).get();
					const postData = getPostData.data();
					const postId = getPostData.id;

					const getLike = await usersRef.doc(userId).collection("likes").doc(postId).get();
	      	const like = getLike.data();
		  		let displayPost = {
		  			id: postId, 
		  			data: postData, 
		  			user: busData,
		  			like: like ? true : false
		  		};

					const rsvDetail = {
						id: doc.id,
						rsv: {
							busId: rsvData.busId,
							cusId: rsvData.cusId,
							confirm: rsvData.confirm,
							startAt: rsvData.startAt,
							etc: rsvData.etc,
							endAt: rsvData.endAt,
							completed: rsvData.completed
						},
						tech: techData,
						post: displayPost
					}

					reservations.push(rsvDetail);
					docIndex += 1;
					if (docIndex === docLength) {
						console.log("getUpcomingRsvs: fetchSwitch: ", fetchSwitch);
						res({ rsvs: reservations, lastRsv: lastVisible, fetchSwitch: fetchSwitch });
					}
				});
			} else {
				res({ rsvs: reservations, lastRsv: lastVisible, fetchSwitch: fetchSwitch });
			}
		})
		.catch((error) => {
			rej(error);
		})
	})
};

const getPreviousRsvsOfCus = (userId, currentTimestamp, lastRsv) => {
	return new Promise ( async (res, rej) => {
		const dateInMs = useConvertTime.convertToDateInMs(currentTimestamp);
		let reservations = [];
		
		let getReservations;

		if (lastRsv) {
			getReservations = reservationsRef
			.where("cusId", "==", userId)
			.where("startAt", "<", currentTimestamp)
			.orderBy("startAt", "desc")
			.startAfter(lastRsv)
			.limit(7);
		} else {
			getReservations = reservationsRef
			.where("cusId", "==", userId)
			.where("startAt", "<", currentTimestamp)
			.orderBy("startAt", "desc")
			.limit(7);
		}

		getReservations
		.get()
		.then((querySnapshot) => {
			const docLength = querySnapshot.docs.length;
			var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
			// if the docs length is shorter than limit turn off switch
			let fetchSwitch = false;
			fetchSwitch = docLength < 7 ? false : true;
			let docIndex = 0;

			if (docLength > 0) {
				console.log("found previous reservations");
				querySnapshot.forEach(async (doc) => {
					const rsvData = doc.data();

					const getTechData = await usersRef.doc(rsvData.techId).get();
					const techData = getTechData.data();
					const getBusData = await usersRef.doc(rsvData.busId).get();
					const busData = getBusData.data();
					if (busData && busData.g) {
            delete busData['g']
          }
          if (busData && busData.coordinates) {
            delete busData['coordinates']
          }
					const getPostData = await postsRef.doc(rsvData.displayPostId).get();
					const postData = getPostData.data();
					const postId = getPostData.id;

					const getLike = await usersRef.doc(userId).collection("likes").doc(postId).get();
	      	const like = getLike.data();
		  		let displayPost = {
		  			id: postId, 
		  			data: postData, 
		  			user: busData,
		  			like: like ? true : false
		  		};

					const rsvDetail = {
						id: doc.id,
						rsv: {
							busId: rsvData.busId,
							cusId: rsvData.cusId,
							confirm: rsvData.confirm,
							startAt: rsvData.startAt,
							etc: rsvData.etc,
							endAt: rsvData.endAt,
							completed: rsvData.completed
						},
						tech: techData,
						post: displayPost
					}

					reservations.push(rsvDetail);
					docIndex += 1;
					if (docIndex === docLength) {
						console.log("getPreviousRsvs: fetchSwitch: ", fetchSwitch);
						res({ rsvs: reservations, lastRsv: lastVisible, fetchSwitch: fetchSwitch });
					}
				});
			} else {
				res({ rsvs: reservations, lastRsv: lastVisible, fetchSwitch: fetchSwitch });
			}
		})
		.catch((error) => {
			console.log("rsvGetFire: getPreviousRsvsOfCus: ", error);
		})
	})
};

export default { 
	getUpcomingRsvsOfCus,
	getPreviousRsvsOfCus
};
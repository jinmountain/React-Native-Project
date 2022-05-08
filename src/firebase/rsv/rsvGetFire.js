import Firebase from '../../firebase/config';
import firebase from 'firebase/app';

import {
	convertToDateInMs
} from '../../hooks/useConvertTime';

const db = Firebase.firestore();
const usersRef = db.collection('users');
const postsRef = db.collection('posts');
const reservationsRef = db.collection('reservations');

const getUpcomingRsvsOfCus = (userId, currentTimestamp, lastRsv) => {
	return new Promise ( async (res, rej) => {
		const dateInMs = convertToDateInMs(currentTimestamp);
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
				res({ rsvs: [], lastRsv: null, fetchSwitch: false });
			}
		})
		.catch((error) => {
			rej(error);
		})
	})
};

const getPreviousRsvsOfCus = (userId, currentTimestamp, lastRsv) => {
	return new Promise ( async (res, rej) => {
		const dateInMs = convertToDateInMs(currentTimestamp);
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

// gives grid timestamps that are taken
const getRsvTimestampsOfTech = (busId, techId, rsvDate) => {
	return new Promise ((res, rej) => {
		const dateInMs = rsvDate;

		let reservations = [];

		const getReservations = reservationsRef
		.where("techId", "==", techId)
		.where("dateInMs", "==", dateInMs)

		getReservations
		.get()
		.then((querySnapshot) => {
			let docIndex = 0;
			const docLength = querySnapshot.docs.length;

			if (docLength > 0) {
				console.log("found reservations");
				querySnapshot.forEach((doc) => {
					const rsvData = doc.data();
					const rsvEtc = Number(rsvData.etc);
					const numOfGrids = rsvEtc/5; // 5 min per grid
					let index;
					console.log("rsv start at: ", rsvData.startAt);
					console.log("rsv start at: ", rsvData.etc);
					for (index = 0; index < numOfGrids; index++) {
						const rsvStartAt = rsvData.startAt;
						const gridTimestamp = rsvStartAt + 5 * index * 1000 * 60;
						if (reservations.includes(gridTimestamp)) {
							continue;
						} else {
							reservations.push(gridTimestamp);
							console.log("existing rsv grid timestamp: ", gridTimestamp);
						}
					}
					docIndex += 1;
					if (docIndex === docLength) {
						res(reservations);
					}
				});
			} else {
				res(reservations);
			}
		})
		.catch((error) => {
			console.log(error);
		})
	})
};

const getUpcomingRsvsOfBus = (busId, currentTimestamp, daysFromToday) => {
	return new Promise ( async (res, rej) => {
		const dateInMs = convertToDateInMs(currentTimestamp);
		let reservations = [];
		
		let getReservations;
		if (daysFromToday > 0) {
			getReservations = reservationsRef
			.where("busId", "==", busId)
			.where("dateInMs", "==", dateInMs)
			.limit(10)
		}
		// if daysFromToday is 0 it means it's today
		// so get upcoming reservations that are after the current time
		if (daysFromToday == 0) {
			getReservations = reservationsRef
			.where("busId", "==", busId)
			.where("dateInMs", "==", dateInMs)
			.where("startAt", ">=", currentTimestamp)
			.limit(10)
		}
		
		getReservations
		.get()
		.then((querySnapshot) => {
			let docIndex = 0;
			const docLength = querySnapshot.docs.length;
			if (docLength > 0) {
				console.log("found upcoming reservations");
				querySnapshot.forEach(async (doc) => {
					const rsvData = doc.data();

					const getTechData = await usersRef.doc(rsvData.techId).get();
					const techData = getTechData.data();
					const getCusData = await usersRef.doc(rsvData.cusId).get();
					const cusData = getCusData.data();
					const getPostData = await postsRef.doc(rsvData.displayPostId).get();
					const postData = getPostData.data();

					const rsvDetail = {
						id: doc.id,
						rsv: {
							busId: rsvData.busId,
							cusId: rsvData.cusId,
							confirm: rsvData.confirm,
							startAt: rsvData.startAt,
							etc: rsvData.etc,
							endAt: rsvData.endAt,
							fulfilled: rsvData.fulfilled
						},
						customer: {
							id: getCusData.id,
							username: cusData.username,
							photoURL: cusData.photoURL,
						},
						tech: {
							id: getTechData.id,
							username: techData.username,
							photoURL: techData.photoURL,
						},
						post: {
							id: getPostData.id,
							title: getPostData.title,
							file: postData.files[0],
							etc: postData.etc,
							price: postData.price,
							tags: postData.tags
						}
					}

					reservations.push(rsvDetail);
					docIndex += 1;
					if (docIndex === docLength) {
						res(reservations);
						console.log("getUpcomingRsvs: ", reservations.length);
					}
				});
			} else {
				res(reservations);
				console.log("getUpcomingRsvs: ", reservations);
			}
		})
		.catch((error) => {
			console.log("businessGetFire: getUpcomingRsvsOfBus: ", error);
		})
	})
};

const getPreviousRsvsOfBus = (busId, currentTimestamp, daysFromToday, completed) => {
	return new Promise ( async (res, rej) => {
		const dateInMs = convertToDateInMs(currentTimestamp);
		let reservations = [];
		
		let getReservations;
		if (daysFromToday < 0 ) {
			getReservations = reservationsRef
			.where("busId", "==", busId)
			.where("dateInMs", "==", dateInMs)
			.where("completed", "==", completed)
			.orderBy("startAt", "desc")
			.limit(10);
		}

		if (daysFromToday === 0) {
			getReservations = reservationsRef
			.where("busId", "==", busId)
			.where("dateInMs", "==", dateInMs)
			.where("completed", "==", completed)
			.where("startAt", "<", currentTimestamp)
			.orderBy("startAt", "desc")
			.limit(10);
		}
		
		getReservations
		.get()
		.then((querySnapshot) => {
			let docIndex = 0;
			const docLength = querySnapshot.docs.length;
			if (docLength > 0) {
				console.log("found previous reservations");
				querySnapshot.forEach(async (doc) => {
					const rsvData = doc.data();

					const getTechData = await usersRef.doc(rsvData.techId).get();
					const techData = getTechData.data();
					const getCusData = await usersRef.doc(rsvData.cusId).get();
					const cusData = getCusData.data();
					const getPostData = await postsRef.doc(rsvData.displayPostId).get();
					const postData = getPostData.data();

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
						customer: {
							id: cusData.id,
							username: cusData.username,
							photoURL: cusData.photoURL,
						},
						tech: {
							id: techData.id,
							username: techData.username,
							photoURL: techData.photoURL,
						},
						post: {
							id: getPostData.id,
							title: getPostData.title,
							file: postData.files[0],
							etc: postData.etc,
							price: postData.price,
							tags: postData.tags,
							service: postData.service,
						}
					}

					reservations.push(rsvDetail);
					docIndex += 1;
					if (docIndex === docLength) {
						res(reservations);
						console.log("getPreviousRsvs: ", reservations.length);
					}
				});
			} else {
				res(reservations);
			}
		})
		.catch((error) => {
			console.log("businessGetFire: getPreviousRsvsOfBus: ", error);
		})
	})
};

export { 
	getUpcomingRsvsOfCus,
	getPreviousRsvsOfCus,

	getRsvTimestampsOfTech, 
	getUpcomingRsvsOfBus, 
	getPreviousRsvsOfBus,
};
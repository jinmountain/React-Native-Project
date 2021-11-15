import Firebase from '../firebase/config';
import firebase from 'firebase/app';
import { navigate } from '../navigationRef';

import useConvertTime from '../hooks/useConvertTime';

const db = Firebase.firestore();
const usersRef = db.collection('users');
const postsRef = db.collection('posts');
const reservationsRef = db.collection('reservations');

const getTechnicians = (
	busId, 
	setTechLast,
	setTechFetchSwitch,
	techLast,
) => {
	return new Promise (async (res, rej) => {
		const technicians = []
		const limit = 13
		try {
			let techniciansRef;
			if (techLast) {
				techniciansRef = usersRef
				.doc(busId)
				.collection("technicians")
				.orderBy("createdAt", "desc")
				.startAfter(techLast)
				console.log("getTechnicians => startAfter");
			} else {
				techniciansRef = usersRef
				.doc(busId)
				.collection("technicians")
				.orderBy("createdAt", "desc")
			};

			techniciansRef
			.limit(limit)
			.get()
			.then((querySnapshot) => {
				let docIndex = 0;
				const docLength = querySnapshot.docs.length;
				console.log(docLength);
				var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
				if (lastVisible !== undefined) {
					setTechLast(lastVisible);
				} 

				if (docLength < limit) {
					setTechFetchSwitch(false);
					console.log("techFetchSwitch >> off.");
				}

				if (docLength > 0) {
					querySnapshot.forEach(async (techDoc) => {
						const docId = techDoc.id;
			    	const docData = techDoc.data();
			    	let theOtherUserRef;
			    	let notificationCount;

			    	// get theOtherUser data
			    	const getTechData = await usersRef.doc(docData.techId).get();
			    	const techData = getTechData.data();

			    	// gather the data to the variable chat
			    	const tech = {
			    		techData: {
			    			id: techData.id,
			    			username: techData.username,
			    			photoURL: techData.photoURL,
			    		},
			    		techBusData: {
			    			countRating: docData.countRating,
			    			totalRating: docData.totalRating
			    		}
			    	}

			    	technicians.push(tech);
			    	docIndex += 1;
			    	if (docIndex === docLength) {
			    		res(technicians);
						}
					});
				} 
				else {
					res(technicians);
				};
			})
		} 
		catch {(error) => {
			res(technicians);
			console.log("Error occured: firebase: businessGetFire: getTechnicians: ", error);
		}};
	});
}

const getTechniciansByIds = (techs) => {
	return new Promise ( async (res, rej) => {
		let technicians = [];
		let docIndex = 0;
		const numOfTechs = techs.length;

		if (numOfTechs === 0) {
			res(technicians);
		}

		try {
			if (numOfTechs > 0) {
				let i;
				for (i = 0; i < numOfTechs; i++) {
					// get tech data
					const getTechData = await usersRef.doc(techs[i]).get();
					const techData = getTechData.data();

					// // get tech average rating
					// const getTechRatingBus = await usersRef.doc(busId).collection("technicians").doc(techs[i]).get();
					// const techRatingBus = getTechRatingBus.data();

					// // get tech rating for this post
					// const getTechRatingPost = await usersRef.doc(busId).collection("technicians").doc(techs[i]).collection("ratingsByPost").doc(postId).get();
					// const techRatingPost = getTechRatingPost.data();

					const tech = {
		    		techData: {
		    			id: techData.id,
		    			username: techData.username,
		    			photoURL: techData.photoURL,
		    		},
					}
					console.log(tech);
					docIndex += 1
					technicians.push(tech);
					if (docIndex === numOfTechs) {
						res(technicians);
					}
				}
			}
		} catch {(error) => {
			res(technicians);
			console.log("Error occured: firebase: businessGetFire: getTechniciansByIds")
		}}
	})
}

const getTechsRating = (techs, busId, postId) => {
	return new Promise ( async (res, rej) => {
		let technicians = [];
		let docIndex = 0;
		const numOfTechs = techs.length;

		if (numOfTechs === 0) {
			res(technicians);
		}

		try {
			if (numOfTechs > 0) {
				let i;
				for (i = 0; i < numOfTechs; i++) {
					// get tech data
					const getTechData = await usersRef.doc(techs[i]).get();
					const techData = getTechData.data();

					// get tech average rating
					const getTechRatingBus = await usersRef.doc(busId).collection("technicians").doc(techs[i]).get();
					const techRatingBus = getTechRatingBus.data();

					// get tech rating for this post
					let techRatingPost;
					try {
						const getTechRatingPost = await usersRef.doc(busId).collection("technicians").doc(techs[i]).collection("ratingsByPost").doc(postId).get();
						techRatingPost = getTechRatingPost.data();
					} catch {(error) => {
						console.log("businessGetFire: getTechsRating: getTechRatingPost: ", error);
					}}
					
					let tech = {
		    		techData: {
		    			id: techData.id,
		    			username: techData.username,
		    			photoURL: techData.photoURL,
		    			businessHours: techData.business_hours,
		    			specialHours: techData.special_hours
		    		},
		    		techRatingBus: {
		    			countRating: techRatingBus.countRating,
		    			totalRating: techRatingBus.totalRating
		    		},
					}

					if (techRatingPost !== undefined) {
						tech = { ...tech, ...{
								techRatingPost: {
				    			countRating: techRatingPost.countRating,
				    			totalRating: techRatingPost.totalRating
				    		}
				    	}
				    }
				  }

					docIndex += 1
					technicians.push(tech);
					if (docIndex === numOfTechs) {
						res(technicians);
					}
				}
			}
		} catch {(error) => {
			res(technicians);
			console.log("Error occured: firebase: businessGetFire: getTechsRating")
		}}
	})
};

// gives grid timestamps that are taken
const getRsvTimestampsOfTech = (busId, techId, rsvDate, startTime, endTime) => {
	return new Promise ((res, rej) => {
		const dateInMs = rsvDate;

		let reservations = [];

		const busStartTimestamp = dateInMs + (startTime * 60 * 60 *1000);
		const busEndTimestamp = dateInMs + (endTime * 60 * 60 * 1000);
		const getReservations = reservationsRef
		.where("techId", "==", techId)
		.where("dateInMs", "==", dateInMs)
		.where("startAt", ">=", busStartTimestamp) 
		.where("startAt", "<", busEndTimestamp)

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
		const dateInMs = useConvertTime.convertToDateInMs(currentTimestamp);
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
}

const getPreviousRsvsOfBus = (busId, currentTimestamp, daysFromToday, completed) => {
	return new Promise ( async (res, rej) => {
		const dateInMs = useConvertTime.convertToDateInMs(currentTimestamp);
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

const getTechBusinessHours = (busId, techId) => {
	return new Promise ((res, rej) => {
		const getTechData = usersRef.doc(busId).collection("technicians").doc(techId).get();
		getTechData
		.then((doc) => {
			const techData = doc.data();
			if (techData.business_hours) {
				res(techData.business_hours)
			} else {
				res(null)
			}
		})
		.catch((error) => {
			rej(error);
		})
	});
};

const getBusUpcomingSpecialHours = (busId, specialHourLast) => {
	return new Promise ((res, rej) => {
		const now = Date.now();
		let specialHours = [];
		let getSpecialHours;

		if (specialHourLast) {
			getSpecialHours = usersRef
			.doc(busId)
			.collection("special_hours")
			.where("date_in_ms", ">", now)
			.orderBy("date_in_ms")
			.startAfter(specialHourLast)
			.limit(10)
		} else {
			getSpecialHours = usersRef
			.doc(busId)
			.collection("special_hours")
			.where("date_in_ms", ">", now)
			.orderBy("date_in_ms")
			.limit(10)
		}

		getSpecialHours
		.get()
		.then((querySnapshot) => {
			let docIndex = 0;
			const docLength = querySnapshot.docs.length;

			var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
			
			if (docLength > 0) {
				querySnapshot.forEach(async (doc) => {
					const docData = doc.data();
					specialHours.push(docData);
					docIndex += 1;

					if (docIndex === docLength) {
						res({ specialHours: specialHours, lastSpecialHour: lastVisible, fetchSwitch: true });
					}
				});
			} else {
				res({ rsvs: [], lastRsv: null, fetchSwitch: false });
			}
		})
		.catch((error) => {
			rej(error);
		});
	});
};

const getTechUpcomingSpecialHours = (busId, techId, specialHourLast) => {
	return new Promise ((res, rej) => {
		const now = Date.now();
		let specialHours = [];
		let getSpecialHours;

		if (specialHourLast) {
			getSpecialHours = usersRef
			.doc(busId)
			.collection("special_hours")
			.where("date_in_ms", ">", now)
			.startAfter(specialHourLast)
			.limit(20)
		} else {
			getSpecialHours = usersRef
			.doc(busId)
			.collection("special_hours")
			.where("date_in_ms", ">", now)
			.limit(20)
		}
		getSpecialHours
		.get()
		.then((querySnapshot) => {
			let docIndex = 0;
			const docLength = querySnapshot.docs.length;

			var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
			
			if (docLength > 0) {
				querySnapshot.forEach(async (doc) => {
					const docData = doc.data();
					specialHours.push(docData);
					docIndex += 1;

					if (docIndex === docLength) {
						res({ specialHours: specialHours, lastSpecialHour: lastVisible, fetchSwitch: true });
					}
				});
			} else {
				res({ rsvs: [], lastRsv: null, fetchSwitch: false });
			}
		})
		.catch((error) => {
			rej(error);
		});
	});
};

export default { 
	getTechnicians, 
	getTechniciansByIds, 
	getTechsRating, 
	getRsvTimestampsOfTech, 
	getUpcomingRsvsOfBus, 
	getPreviousRsvsOfBus,

	getBusUpcomingSpecialHours,
	getTechUpcomingSpecialHours
};
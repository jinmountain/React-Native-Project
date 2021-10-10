import Firebase from '../firebase/config';
import firebase from 'firebase/app';
import { navigate } from '../navigationRef';

// Hooks
import useConvertTime from '../hooks/useConvertTime';

const db = Firebase.firestore();
const usersRef = db.collection('users');
const reservationsRef = db.collection('reservations');

const appRsvCounts = db.collection('rsvCounts');

const appRsvGlobalPeriodsRef = db.collection('rsvGlobalPeriods');
const appRsvLocalPeriodsRef = db.collection('rsvLocalPeriods');

const getLocality = (address) => {
	let locality; // string
	const splitAddressArr = address.split(", ");
	const splitArrLength = splitAddressArr.length;
	if (splitAddressArr[splitArrLength-1] === "USA") {
		var state = splitAddressArr[2].replace(/[0-9]/g, '').replace(/ /g, '');
		var city = splitAddressArr[1].replace(/ /g, '');
		var country = splitAddressArr[splitArrLength-1];
		locality = `${city}${state}${country}`;
	}
	return locality;
};

const sendRsvRequest = (
	busId,
	busLocationType,
	busLocality,
	techId,
	userId,
	displayPostId,
	postServiceType,
	etc,
	startAt
) => {
	return new Promise (async (res, rej) => {
		const endAt = startAt + (etc * 60 * 1000);
		// max time for nail is 2 hour most
		const expectedEndAt = startAt - (120 * 60 * 100);
		const dateInMs = useConvertTime.convertToDateInMs(startAt);

		const countIncrementByOne = firebase.firestore.FieldValue.increment(1);
		const time = useConvertTime.convertToTime(startAt);
		// return {
		// 	timestamp: timestamp,
		// 	year: year,
		// 	monthIndex: monthIndex,
		// 	month: month,
		// 	date: date,
		// 	dayIndex: dayIndex,
		// 	day: day,
		// 	hour: hour,
		// 	normalHour: normalHour,
		// 	pmOrAm: pmOrAm,
		// 	min: min < 10 ? `0${min}` : min
		// };
		const dayIndexNumber = Number(time.dayIndex);
		const dayIndexString = String(dayIndexNumber);
		const dayString = String(time.day)

		const monthIndexNumber = Number(time.monthIndex);
		const monthIndexString = String(monthIndexNumber);
		const monthString = String(time.month);

		const hourString = String(time.hour);
		const hourNumber = Number(time.hour);

		const dateInMsNumber = Number(useConvertTime.convertToDateInMs(startAt));
		const dateInMsString = String(dateInMsNumber);

		const weekInMsNumber = Number(useConvertTime.convertToWeekInMs(startAt));
		const weekInMsString = String(weekInMsNumber);

		const monthInMsNumber = Number(useConvertTime.convertToMonthInMs(startAt));
		const monthInMsString = String(monthInMsNumber);

		const yearInMsNumber = Number(useConvertTime.convertToYearInMs(startAt));
		const yearInMsString = String(yearInMsNumber);

		const changeCounts = (changeRef, doc) => {
			// increase total count
			changeRef.doc(doc).set({
  			count: countIncrementByOne
  		}, { merge: true });

  		// increase hours count
  		// see which hours are popular
  		// 0 1 2 ... 24
  		changeRef.doc(doc).collection("hourly").doc(hourString).set({
  			hour: hourNumber,
  			count: countIncrementByOne
  		}, { merge: true });

			// increase days count
			// sun(0) mon(1) tue(2) ... sat(6) 
  		changeRef.doc(doc).collection("days").doc(dayIndexString).set({
  			dayIndex: dayIndexNumber,
  			// day: dayString,
  			count: countIncrementByOne
  		}, { merge: true });

  		// increase daily count
  		changeRef.doc(doc).collection("daily").doc(dateInMsString).set({
  			time: dateInMsNumber,
  			count: countIncrementByOne
  		}, { merge: true });

  		// increase weekly count
  		changeRef.doc(doc).collection("weekly").doc(weekInMsString).set({
  			time: weekInMsNumber,
  			count: countIncrementByOne
  		}, { merge: true });

  		// increase months count
  		// ex) jan(0), feb(1), mar(3) ...
  		changeRef.doc(doc).collection("months").doc(monthIndexString).set({
  			monthIndex: monthIndexNumber,
  			// month: monthString,
  			count: countIncrementByOne
  		}, { merge: true });

  		// increase monthly count
  		changeRef.doc(doc).collection("monthly").doc(monthInMsString).set({
  			time: monthInMsNumber,
  			count: countIncrementByOne
  		}, { merge: true });
  		
  		// increase yearly count
  		changeRef.doc(doc).collection("yearly").doc(yearInMsString).set({
  			time: yearInMsNumber,
  			count: countIncrementByOne
  		}, { merge: true });
		};

		try {
			// Check Rsv Conflict
			// True (make the new rsv) THEN existing rsv endAt <= new rsv startAt OR existing rsv startAt >= new rsv endAt 
			// => NEGATE =>
			// exsiting rsv startAt < new rsv endAt AND existing rsv endAt > new rsv startAt THEN False (Do not make the new rsv)
			reservationsRef
			.where("techId", "==", techId)
			.where("dateInMs", "==", dateInMs)
			.where("startAt", ">=", expectedEndAt) 
			.where("startAt", "<", endAt)
			.get()
			.then((querySnapshot) => {
				let docIndex = 0;
				const docLength = querySnapshot.docs.length;
				const newReservation = {
    			busId: busId,
    			techId: techId,
    			cusId: userId,
    			displayPostId: displayPostId,
    			service: postServiceType,
    			etc: Number(etc),
    			startAt: startAt,
    			endAt: endAt,
    			dateInMs: dateInMs,
    			completed: false,
    		};

				if (docLength > 0) {
					console.log("doc startAt < new doc endAt");
					let checkResult = true;
					for (docIndex; docIndex < docLength; i++) {
						const docData = querySnapshot.docs[docIndex].data();
						if (docData.endAt > startAt) {
							console.log("rsv found conflict:" + docData.startAt + "-" + docData.endAt + "|" + startAt + "-" + endAt);
							checkResult = false;
							res(false);
							break;
						}
					}

					if (checkResult) {
						// add reservation
						reservationsRef.add(newReservation);
		    		
						// Snail Global Reservation Count
						changeCounts(appRsvCounts, `${postServiceType}GlobalRsvCount`);

						if (busLocationType === "inStore" && busLocality) {
							// Snail Local Reservation Count
							changeCounts(appRsvCounts, `${postServiceType}${busLocality}RsvCount`);
						}
						
						// Business Reservation Count
						changeCounts(usersRef.doc(busId).collection("rsvCounts"), `${postServiceType}RsvCount`);

		    		// User Reservation Count
		    		changeCounts(usersRef.doc(userId).collection("rsvCounts"), `${postServiceType}RsvCount`);

		    		res(newReservation);
					} else {
						res(false);
					}
				} else {
					// add reservation
	    		reservationsRef.add(newReservation);

	    		// Snail Global Reservation Count
	    		changeCounts(appRsvCounts, `${postServiceType}GlobalRsvCount`);

	    		if (busLocationType === "inStore" && busLocality) {
						// Snail Local Reservation Count
						changeCounts(appRsvCounts, `${postServiceType}${busLocality}RsvCount`);
					}

					// Business Reservation Count
					changeCounts(usersRef.doc(busId).collection("rsvCounts"), `${postServiceType}RsvCount`);

	    		// User Reservation Count
	    		changeCounts(usersRef.doc(userId).collection("rsvCounts"), `${postServiceType}RsvCount`);

	    		res(newReservation);
				}
			});
		} 
		catch {(error) => {
			rej(error);
		}};
	});
};

const completeReservation = (rsvId, busId, cusId, busLocationType, busLocality, reservationStartAt, postTags, postServiceType) => {
	return new Promise (async (res, rej) => {
		const countIncrementByOne = firebase.firestore.FieldValue.increment(1);
		try {
			const batch = db.batch();

			batch.update(
				reservationsRef.doc(rsvId),
				{
					completed: true
				}
			);

			// Snail's Reservation Completed Count
			// Global
			batch.update(
				appRsvCounts.doc(`${postServiceType}GlobalRsvCount`),
				{
					completedCount: countIncrementByOne
				}
			);

			// Local
			if (busLocationType === "inStore" && busLocality) {
				// Local Snail Data
				batch.update(
					appRsvCounts.doc(`${postServiceType}${busLocality}RsvCount`),
					{
						completedCount: countIncrementByOne
					}
				);
			};

			// w1
			// Business' Reservation Completed Count
			batch.update(
				usersRef.doc(busId).collection("rsvCounts").doc(`${postServiceType}RsvCount`),
				{
					completedCount: countIncrementByOne
				}
			);

			// w1
			// User's Reservation Completed Count
			batch.update(
				usersRef.doc(cusId).collection("rsvCounts").doc(`${postServiceType}RsvCount`),
				{
					completedCount: countIncrementByOne
				}
			);

			// w1 r1
			// Snail Global Reservation Period
			const rsvGlobalPeriodsRef = appRsvGlobalPeriodsRef.doc(`${postServiceType}GlobalRsvPeriod`);
			await rsvGlobalPeriodsRef
			.get()
			.then((doc) => {
				if (doc.exists) {
					const docData = doc.data();
					const rsvGlobalPeriod = (reservationStartAt - docData.firstTime) / (docData.count + 1);
					batch.update(
						rsvGlobalPeriodsRef,
						{
							count: countIncrementByOne,
							lastTime: reservationStartAt,
							period: rsvGlobalPeriod
						}
					);
				} else {
					batch.set(
						rsvGlobalPeriodsRef,
						{
							count: 1,
							firstTime: reservationStartAt,
							period: 0,
							service: postServiceType
						}
					);
				}
			})
			.catch((error) => {
				console.log("Error occured: completeReservation: rsvGlobalPeriodsRef: ", error);
			});

			// w1 r1
			// Snail Local Reservation Period
			const rsvLocalPeriodsRef = snailRsvLocalPeriodsRef.doc(`${postServiceType}${busLocality}RsvPeriod`);
			await rsvLocalPeriodsRef
			.get()
			.then((doc) => {
				if (doc.exists) {
					const docData = doc.data();
					const rsvLocalPeriod = (reservationStartAt - docData.firstTime) / (docData.count + 1);
					batch.update(
						rsvLocalPeriodsRef,
						{
							count: countIncrementByOne,
							lastTime: reservationStartAt,
							period: rsvLocalPeriod
						}
					);
				} else {
					batch.set(
						rsvLocalPeriodsRef,
						{
							count: 1,
							firstTime: reservationStartAt,
							period: 0,
							service: postServiceType,
							locality: busLocality,
						}
					);
				}
			})
			.catch((error) => {
				console.log("Error occured: completeReservation: rsvLocalPeriodsRef: ", error);
			});

			// w1 r1
			// Business’ Customer Reservation Period
			// First check the doc exists
			const businessRsvPeriodsRef = usersRef.doc(busId).collection(`${postServiceType}CustomerRsvPeriods`).doc(cusId);
			await businessRsvPeriodsRef
			.get()
			.then((doc) => {
				if (doc.exists) {
					const docData = doc.data();
					const rsvPeriod = (reservationStartAt - docData.firstTime) / (docData.count + 1);
					batch.update(
						businessRsvPeriodsRef,
						{
							count: countIncrementByOne,
							lastTime: reservationStartAt,
							period: rsvPeriod,
						}
					);
				} else {
					batch.set(
						businessRsvPeriodsRef,
						{
							cusId: cusId,
							count: 1,
							firstTime: reservationStartAt,
							period: 0,
							service: postServiceType
						}
					);
				}
			})
			.catch((error) => {
				console.log("Error occured: completeReservation: businessRsvPeriodsRef: ", error);
			});

			// w1 r1
			// User's Reservation Period
			// First check the doc exists
			const userRsvPeriodsRef = usersRef.doc(cusId).collection("rsvPeriods").doc(`${postServiceType}RsvPeriod`);
			await userRsvPeriodsRef
			.get()
			.then((doc) => {
				if (doc.exists) {
					const docData = doc.data();
					const userRsvPeriod = (reservationStartAt - docData.firstTime) / (docData.count + 1);
					batch.update(
						userRsvPeriodsRef,
						{
							count: countIncrementByOne,
							lastTime: reservationStartAt,
							period: userRsvPeriod
						}
					);
				} else {
					batch.set(
						userRsvPeriodsRef,
						{
							count: 1,
							firstTime: reservationStartAt,
							period: 0,
							service: postServiceType
						}
					);
				}
			})
			.catch((error) => {
				console.log("Error occured: completeReservation: userRsvPeriodsRef: ", error);
			});
			
			// Tag Count
			console.log("postTags: ", postTags);
			const adjPostTags = postTags ? postTags : [];
			const postTagsLength = postTags ? postTags.length : 0;
			let tagIndex;
			// const handlePostTags = new Promise((res, rej) => {
			// 	try {
			for (tagIndex = 0; tagIndex < postTagsLength; tagIndex++) {
				console.log("tag: ", postTags[tagIndex]);
				// // Tag Popularity of User Completed Reservation
				// // w3 r3
				const userRsvTagCountsRef = usersRef.doc(cusId).collection(`${postServiceType}RsvTagCounts`).doc(postTags[tagIndex]);
				await userRsvTagCountsRef
				.get()
				.then((doc) => {
					if (doc.exists) {
						const docData = doc.data();
						const daily = (reservationStartAt - docData.firstTime) / (3600 * 1000 * 24)
						const newHeat = (docData.count + 1) / daily

						batch.update(
							userRsvTagCountsRef,
							{
								count: countIncrementByOne,
								lastTime: reservationStartAt,
								heat: newHeat
							}
						);
					} else {
						batch.set(
							userRsvTagCountsRef,
							{
								tag: postTags[tagIndex],
								service: postServiceType,
								count: 0,
								firstTime: reservationStartAt,
								heat: 0,
							}
						);
					}
				})
				.catch((error) => {
					console.log("Error occured: completeReservation: userRsvTagCountsRef: ", error);
				});

				// Tag Popularity of Business Completed Reservation
				// w3 r3
				const businessRsvTagCountsRef = usersRef.doc(busId).collection(`${postServiceType}RsvTagCounts`).doc(postTags[tagIndex]);
				await businessRsvTagCountsRef
				.get()
				.then((doc) => {
					if (doc.exists) {
						const docData = doc.data();
						const daily = (reservationStartAt - docData.firstTime) / (3600 * 1000 * 24)
						const newHeat = (docData.count + 1) / daily

						batch.update(
							businessRsvTagCountsRef,
							{
								count: countIncrementByOne,
								lastTime: reservationStartAt,
								heat: newHeat
							}
						);
					} else {
						batch.set(
							businessRsvTagCountsRef,
							{
								tag: postTags[tagIndex],
								service: postServiceType,
								count: 0,
								firstTime: reservationStartAt,
								heat: 0,
							},
						);
					}
				})
				.catch((error) => {
					console.log("Error occured: completeReservation: businessRsvTagCountsRef: ", error);
				});

				// Tag Popularity of Snail Global Completed Reservation
				// w3 r3
				const snailGlobalRsvTagCountsRef = db.collection(`${postServiceType}GlobalRsvTagCounts`).doc(postTags[tagIndex]);
				await snailGlobalRsvTagCountsRef
				.get()
				.then((doc) => {
					if (doc.exists) {
						const docData = doc.data();
						const daily = (reservationStartAt - docData.firstTime) / (3600 * 1000 * 24)
						const newHeat = (docData.count + 1) / daily

						batch.update(
							snailGlobalRsvTagCountsRef,
							{
								count: countIncrementByOne,
								lastTime: reservationStartAt,
								heat: newHeat
							}
						);
					} else {
						batch.set(
							snailGlobalRsvTagCountsRef,
							{
								tag: postTags[tagIndex],
								service: postServiceType,
								count: 0,
								firstTime: reservationStartAt,
								heat: 0,
							}, 
							{ merge: true }
						);
					}
				})
				.catch((error) => {
					console.log("Error occured: completeReservation: snailGlobalRsvTagCountsRef: ", error);
				});

				// Tag Popularity of Snail Local Completed Reservation
				// w3 r3
				const snailLocalRsvTagCountsRef = db.collection(`${postServiceType}${busLocality}RsvTagCounts`).doc(postTags[tagIndex]);
				await snailLocalRsvTagCountsRef
				.get()
				.then((doc) => {
					if (doc.exists) {
						const docData = doc.data();
						const daily = (reservationStartAt - docData.firstTime) / (3600 * 1000 * 24)
						const newHeat = (docData.count + 1) / daily;

						batch.update(
							snailLocalRsvTagCountsRef,
							{
								count: countIncrementByOne,
								lastTime: reservationStartAt,
								heat: newHeat
							}
						);
					} else {
						batch.set(
							snailLocalRsvTagCountsRef,
							{
								tag: postTags[tagIndex],
								service: postServiceType,
								locality: busLocality,
								count: 0,
								firstTime: reservationStartAt,
								heat: 0,
							},
							{ merge: true }
						);
					}
				})
				.catch((error) => {
					console.log("Error occured: completeReservation: snailLocalRsvTagCountsRef: ", error);
				});
			}
			batch.commit();
		} catch {(error) => {
			rej(error);
		}}
	});
};

export default { sendRsvRequest, completeReservation };
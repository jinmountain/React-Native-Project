import Firebase from '../../firebase/config';
import firebase from 'firebase/app';

// Hooks

const db = Firebase.firestore();
const usersRef = db.collection('users');
const reservationsRef = db.collection('reservations');

const appRsvCounts = db.collection('rsv_counts');

const appRsvGlobalPeriodsRef = db.collection('rsv_global_periods');
const appRsvLocalPeriodsRef = db.collection('rsv_local_periods');

const getLocality = (address) => {
	let locality; // string
	const splitAddressArr = address.split(", ");
	const splitArrLength = splitAddressArr.length;
	if (splitAddressArr[splitArrLength-1] === "usa") {
		var state = splitAddressArr[2].replace(/[0-9]/g, '').replace(/ /g, '').toLowerCase();
		var city = splitAddressArr[1].replace(/ /g, '').toLowerCase();
		var country = splitAddressArr[splitArrLength-1].toLowerCase();
		locality = `${city}_${state}_${country}`;
	}
	return locality;
};

const postBusSpecialDateFire = (busId, timezoneOffset, dateInMs, dateStatus, year, monthIndex, date) => {
	return new Promise ((res, rej) => {
		const busSpecialHoursRef = usersRef.doc(busId).collection("special_hours");

		busSpecialHoursRef
		.where("year", "==", year)
		.where("monthIndex", "==", monthIndex)
		.where("date", "==", date)
		.get()
		.then(async (querySnapshot) => {
			const docLength = querySnapshot.docs.length;
			if (docLength > 0) {
				res(null)
			} else {
				const newDocId = await usersRef.doc(busId).collection("special_hours").doc().id;

				const newSpecialDate = {
					id: newDocId,
					timezoneOffset: timezoneOffset,
					date_in_ms: dateInMs,
					status: dateStatus,
					hours: [],
					year: year,
					monthIndex: monthIndex,
					date: date
				}
				
				busSpecialHoursRef
				.doc(newDocId)
				.set(
					newSpecialDate, 
					{
						merge: true
					}
				)
				.then(() => {
					res(newSpecialDate);
				})
				.catch((error) => {
					rej(error);
				});
			}
		})
		.catch((error) => {
			rej(error);
		});
	});
}

const postTechSpecialDateFire = (busId, techId, timezoneOffset, dateInMs, dateStatus, year, monthIndex, date) => {
	return new Promise ((res, rej) => {
		const techSpecialHoursRef = usersRef.doc(busId).collection("technicians").doc(techId).collection("special_hours");

		// if there is a same date on the special hours don't add
		techSpecialHoursRef
		.where("year", "==", year)
		.where("monthIndex", "==", monthIndex)
		.where("date", "==", date)
		.get()
		.then(async (querySnapshot) => {
			const docLength = querySnapshot.docs.length;
			if (docLength > 0) {
				res(null)
			} else {
				const newDocId = await techSpecialHoursRef.doc().id;
				const newSpecialDate = {
					id: newDocId,
					timezoneOffset: timezoneOffset,
					date_in_ms: dateInMs,
					status: dateStatus,
					hours: [],
					year: year,
					monthIndex: monthIndex,
					date: date
				}

				techSpecialHoursRef
				.doc(newDocId)
				.set(
					newSpecialDate, 
					{
						merge: true
					}
				)
				.then(() => {
					res(newSpecialDate);
				})
				.catch((error) => {
					rej(error);
				});
			}
		})
		.catch((error) => {
			rej(error);
		});
	});
};

const postBusSpecialHours = (busId, docId, mergedHours) => {
	return new Promise (async (res, rej) => {
		const busSpecialHoursRef = usersRef.doc(busId).collection("special_hours").doc(docId);
		busSpecialHoursRef
		.set(
			{ hours: mergedHours }, 
			{
				merge: true
			}
		)
		.then(() => {
			res(true);
		})
		.catch((error) => {
			rej(error);
		});
	});
};

const postTechSpecialHours = (busId, techId, docId, mergedHours) => {
	return new Promise (async (res, rej) => {
		const busSpecialHoursRef = usersRef.doc(busId).collection("technicians").doc(techId).collection("special_hours").doc(docId);
		busSpecialHoursRef
		.set(
			{ hours: mergedHours }, 
			{
				merge: true
			}
		)
		.then(() => {
			res(true);
		})
		.catch((error) => {
			rej(error);
		});
	});
};

export { 
	postBusSpecialDateFire, 
	postTechSpecialDateFire, 
	postBusSpecialHours, 
	postTechSpecialHours 
};
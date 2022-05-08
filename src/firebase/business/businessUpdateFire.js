import Firebase from '../../firebase/config'
import firebase from 'firebase/app';
import * as geofirestore from 'geofirestore';

// GoogleAPI
// import geocoding from '../googleAPI/geocoding';

// hooks
import {
	convertToTime
} from '../../hooks/useConvertTime';

// Firebase
import { authCheck } from '../authFire';
// const uid = () => {
// 	return (Firebase.auth().currentUser || {}).uid
// };

const db = Firebase.firestore();
const batch = db.batch();
const rootRef = Firebase.firestore();
const usersRef = Firebase.firestore().collection('users');
const firestoreDeleteFieldValue = firebase.firestore.FieldValue.delete();

// count increment and decrement
const countIncrementByOne = firebase.firestore.FieldValue.increment(1);
const countDecrementByOne = firebase.firestore.FieldValue.increment(-1);

const busUserUpdate = (newBusData) => {
	return new Promise ((res, rej) => {
		const checkAuth = authCheck();
		checkAuth
		.then((currentUser) => {
			usersRef
			.doc(currentUser.uid)
			.set(
				newBusData,
				{ merge: true }
			);
			res(true);
		})
		.catch((error) => {
			rej(error);
		});
	});
};

const businessUpdateLocation = (newLocation, userService) => {
	return new Promise ((res, rej) => {
		const checkAuth = authCheck();
		checkAuth
		.then((currentUser) => {
			// Create a Firestore reference
			const firestore = firebase.firestore();
			// Create a GeoFirestore reference
			const GeoFirestore = geofirestore.initializeApp(firestore);
			const lat = newLocation.geometry.location.lat;
			const lng = newLocation.geometry.location.lng;

			const serviceLen = userService.length;

			let newBusinessData
			if (newLocation.locationType === "inStore") {
				// Local Snail Data
				const getLocality = (address) => {
					let locality; // string
					const splitAddressArr = address.split(", ");
					const splitArrLength = splitAddressArr.length;
					if (splitAddressArr[splitArrLength-1] === "USA") {
						var state = splitAddressArr[2].replace(/[0-9]/g, '').replace(/ /g, '').toLowerCase();
						var city = splitAddressArr[1].replace(/ /g, '').toLowerCase();
						var country = splitAddressArr[splitArrLength-1].toLowerCase();
						locality = `${city}_${state}_${country}`;
					}
					return locality;
					consol
				};
				
				const locality = getLocality(newLocation.formatted_address);
				let googlemapsUrl;

				if (newLocation.url) {
					// cahnge attribute name url to googlemapsUrl
					googlemapsUrl = newLocation.url
					delete newLocation.url
				}
				newBusinessData = { 
					...newLocation, 
					...{ 
						coordinates: new firebase.firestore.GeoPoint(lat, lng),
						googlemapsUrl: googlemapsUrl,
						locality: locality
					}
				}
				
				// increment the store count of the locality
				// increment the store count of service 
				// increment the store count of service in monthly

				batch.set(
					rootRef
					.collection("snailCounts")
					.doc("location")
					.collection(`${locality}`)
					.doc(`${locality}_bus_count`),
					{ count: countIncrementByOne },
					{ merge: true }
				);

				const dateNow = Date.now();
				const nowTime = convertToTime(dateNow);
        const nowMonthIndex = nowTime.monthIndex;
        const nowNormalMonth = nowTime.normalMonth;
        const nowYear = nowTime.year;
        const monthYearId = `${nowMonthIndex}_${nowYear}`;

				let serviceIndex;
				for (serviceIndex = 0; serviceIndex < serviceLen; serviceIndex++ ) {
					batch.set(
						rootRef
						.collection("snailCounts")
						.doc("location")
						.collection(`${locality}`)
						.doc(`${userService[serviceIndex]}_bus_count`),
						{ count: countIncrementByOne },
						{ merge: true }
					);

					batch.set(
						rootRef
						.collection("snailCounts")
						.doc("location")
						.collection(`${locality}`)
						.doc(`${userService[serviceIndex]}_bus_count`)
						.collection("monthly")
						.doc(monthYearId),
						{ 
							monthIndex: nowMonthIndex,
          		year: nowYear,
          		count: countIncrementByOne
						},
						{ merge: true }
					);
				}
			} else {
				newBusinessData = { 
					...newLocation, 
					...{ coordinates: new firebase.firestore.GeoPoint(lat, lng) }
				}
			}

			const usersGeoRef = GeoFirestore.collection('users');
			usersGeoRef
			.doc(currentUser.uid)
			.update(newBusinessData)
			.then(() => {
				console.log("updated business location: ", newBusinessData);
				batch.commit();
				res(true);
			})
			.catch((error) => {
				rej(error);
			});
		})
		.catch((error) => {
			rej(error);
		});
	});
};

const businessRegisterFire = (businessServices) => {
	return new Promise ((res, rej) => {
		const checkAuth = authCheck();
		checkAuth
		.then(async (currentUser) => {
			// console.log(currentUser.uid);
			const dateNow = Date.now();
			const nowTime = convertToTime(dateNow);
      const nowMonthIndex = nowTime.monthIndex;
      const nowNormalMonth = nowTime.normalMonth;
      const nowYear = nowTime.year;
      const monthYearId = `${nowMonthIndex}_${nowYear}`;
      // console.log(nowTime, nowMonthIndex, nowNormalMonth, nowYear, monthYearId)
			// change to business
			batch.set(
				usersRef
				.doc(currentUser.uid),
				{ 
					type: "business", 
					service: businessServices, 
					businessRegisteredAt: dateNow, 
					business_hours: [],
				}, { merge: true }
			);
			// increment count of total registered business
			batch.set(
				rootRef
				.collection("snailCounts")
				.doc("total_registered_bus"),
				{ count: countIncrementByOne },
				{ merge: true }
			);
			// increment count of monthly new registered business
			batch.set(
				rootRef
				.collection("snailCounts")
				.doc("total_registered_bus")
				.collection("monthly")
				.doc(monthYearId),
				{ 
					monthIndex: nowMonthIndex,
      		year: nowYear,
      		count: countIncrementByOne
				},
				{ merge: true }
			);
			// increment count of total service
			// increment count of monthy new service

			businessServices.forEach((service) => {
				batch.set(
					rootRef
					.collection("snailCounts")
					.doc(`${service}_bus_count`),
					{ count: countIncrementByOne },
					{ merge: true }
				);

				batch.set(
					rootRef
					.collection("snailCounts")
					.doc(`${service}_bus_count`)
					.collection("monthly")
					.doc(monthYearId),
					{ 
						monthIndex: nowMonthIndex,
        		year: nowYear,
        		count: countIncrementByOne
					},
					{ merge: true }
				);
			});

			batch
			.commit()
			.then(() => {
				res();
			});
		})
		.catch((error) => {
			rej(error);
		})
	});
};

const businessDeregisterFire = () => {
	return new Promise ((res, rej) => {
		const checkAuth = authCheck();
		checkAuth
		.then((currentUser) => {
			const dateNow = Date.now();
			const nowTime = convertToTime(dateNow);
      const nowMonthIndex = nowTime.monthIndex;
      const nowNormalMonth = nowTime.normalMonth;
      const nowYear = nowTime.year;
      const monthYearId = `${nowMonthIndex}_${nowYear}`;
			// change business to pre business
			batch.update(
				usersRef
				.doc(currentUser.uid),
				{ 
					type: "preBusiness", 
		  		businessDeregisteredAt: dateNow,
		  		// delete following fields
		  		coordinates: firestoreDeleteFieldValue,
		  		formatted_address: firestoreDeleteFieldValue,
		  		g: firestoreDeleteFieldValue,
		  		geometry: firestoreDeleteFieldValue,
		  		locationType: firestoreDeleteFieldValue,
		  		url: firestoreDeleteFieldValue,
		  		locality: firestoreDeleteFieldValue,
		  		business_hours: firestoreDeleteFieldValue
				}
			);
			// increment count of total deregistered business
			batch.set(
				rootRef
				.collection("snailCounts")
				.doc("total_deregistered_bus"),
				{ count: countIncrementByOne },
				{ merge: true }
			);
			// increment count of monthly deregistered business
			batch.set(
				rootRef
				.collection("snailCounts")
				.doc("total_deregistered_bus")
				.collection("monthly")
				.doc(monthYearId),
				{ 
					monthIndex: nowMonthIndex,
      		year: nowYear,
      		count: countIncrementByOne
				},
				{ merge: true }
			);

			batch
			.commit()
			.then(() => {
				res();
			});
		})
		.catch((error) => {
			rej(error);
		});
	});
};

const technicianRegister = (techServices) => {
	return new Promise ((res, rej) => {
		const checkAuth = authCheck();
		checkAuth
		.then((currentUser) => {
			const dateNow = Date.now();
			const nowTime = convertToTime(dateNow);
      const nowMonthIndex = nowTime.monthIndex;
      const nowNormalMonth = nowTime.normalMonth;
      const nowYear = nowTime.year;
      const monthYearId = `${nowMonthIndex}_${nowYear}`;

      batch.update(
      	usersRef.doc(currentUser.uid),
      	{ 
					type: "technician", 
					technicianRegisteredAt: Date.now(),
					service: techServices,
					business_hours: [],
				}
      );

			// increment count of total registered tech
			batch.set(
				rootRef
				.collection("snailCounts")
				.doc("total_registered_tech"),
				{ count: countIncrementByOne },
				{ merge: true }
			);

      // increment count of monthly new registered tech
			batch.set(
				rootRef
				.collection("snailCounts")
				.doc("total_registered_tech")
				.collection("monthly")
				.doc(monthYearId),
				{ 
					monthIndex: nowMonthIndex,
      		year: nowYear,
      		count: countIncrementByOne
				},
				{ merge: true }
			);

			// increment count of total service
			// increment count of monthy new service
			techServices.forEach((service) => {
				batch.set(
					rootRef
					.collection("snailCounts")
					.doc(`${service}_tech_count`),
					{ count: countIncrementByOne },
					{ merge: true }
				);

				batch.set(
					rootRef
					.collection("snailCounts")
					.doc(`${service}_tech_count`)
					.collection("monthly")
					.doc(monthYearId),
					{ 
						monthIndex: nowMonthIndex,
        		year: nowYear,
        		count: countIncrementByOne
					},
					{ merge: true }
				);
			});

			batch
			.commit()
			.then(() => {
				res();
			})
		})
		.catch((error) => {
			console.log(error);
		});
	});
};

const technicianDeregister = () => {
	return new Promise ((res, rej) => {
		const checkAuth = authCheck();
		checkAuth
		.then((currentUser) => {
			const dateNow = Date.now();
			const nowTime = convertToTime(dateNow);
      const nowMonthIndex = nowTime.monthIndex;
      const nowNormalMonth = nowTime.normalMonth;
      const nowYear = nowTime.year;
      const monthYearId = `${nowMonthIndex}_${nowYear}`;

			// first change type to preBusiness
      batch.update(
      	usersRef.doc(currentUser.uid),
      	{ 
					type: "preTechnician", 
					technicianDeregisteredAt: dateNow,
					service: firestoreDeleteFieldValue,
					business_hours: firestoreDeleteFieldValue,
				}
      );

      // increment count of total deregistered tech
			batch.set(
				rootRef
				.collection("snailCounts")
				.doc("total_deregistered_tech"),
				{ count: countIncrementByOne },
				{ merge: true }
			);

			// increment count of monthly deregistered tech
			batch.set(
				rootRef
				.collection("snailCounts")
				.doc("total_deregistered_tech")
				.collection("monthly")
				.doc(monthYearId),
				{ 
					monthIndex: nowMonthIndex,
      		year: nowYear,
      		count: countIncrementByOne
				},
				{ merge: true }
			);

			batch
			.commit()
			.then(() => {
				res();
			});
		})
		.catch((error) => {
			console.log(error);
		})
	});
};

const updateBusBusinessHoursFire = (newBusinessHours) => {
	return new Promise ((res, rej) => {
		const authCheck = authFire.authCheck();
		authCheck
		.then((currentUser) => {
			const businessUserRef = usersRef.doc(currentUser.uid)
			businessUserRef
			.set({
				business_hours: newBusinessHours,
				last_business_hours_update: Date.now()
			}, {
				merge: true
			})
			.then(() => {
				res(true);
			})
			.catch((error) => {
				rej(error);
			})
		})
		.catch((error) => {
			rej(error);
		});
	});
};

const updateTechBusinessHoursFire = (techId, newBusinessHours) => {
	return new Promise ((res, rej) => {
		const authCheck = authFire.authCheck();
		authCheck
		.then((currentUser) => {
			const techRef = usersRef.doc(currentUser.uid).collection("technicians").doc(techId)
			techRef
			.set({
				business_hours: newBusinessHours,
				last_business_hours_update: Date.now()
			}, {
				merge: true
			})
			.then(() => {
				res(true);
			})
			.catch((error) => {
				rej(error);
			})
		})
		.catch((error) => {
			rej(error);
		});
	});
};

const updateBusSpecialHoursDocHours = (busId, docId, newHours) => {
	return new Promise ((res, rej) => {
		const specialHoursDocRef = usersRef.doc(busId).collection("special_hours").doc(docId);
		specialHoursDocRef
		.set({
			hours: newHours
		}, {
			merge: true
		})
		.then(() => {
			res();
		})
		.catch((error) => {
			rej(error);
		})
	});
};

const updateTechSpecialHoursDocHours = (busId, techId, docId, newHours) => {
	return new Promise ((res, rej) => {
		const specialHoursDocRef = usersRef.doc(busId).collection("technicians").doc(techId).collection("special_hours").doc(docId);
		specialHoursDocRef
		.set({
			hours: newHours
		}, {
			merge: true
		})
		.then(() => {
			res();
		})
		.catch((error) => {
			rej(error);
		})
	});
};

export { 
	busUserUpdate, 
	businessUpdateLocation, 
	businessRegisterFire, 
	businessDeregisterFire, 
	technicianRegister, 
	technicianDeregister,
	updateBusBusinessHoursFire,
	updateTechBusinessHoursFire,
	updateBusSpecialHoursDocHours,
	updateTechSpecialHoursDocHours
}
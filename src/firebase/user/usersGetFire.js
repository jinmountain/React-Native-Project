import Firebase from '../../firebase/config';
import firebase from 'firebase/app';
// import * as geolib from 'geolib';
import * as geofirestore from 'geofirestore';

const db = Firebase.firestore();
const usersRef = db.collection('users');

const currentUserFire = () => {
	return Firebase.auth().currentUser || {}
};

const getSearchUsersFire = (username, type = "all") => {
	return new Promise (async (res, rej) => {
    let usersRefWithType;

    if (type === 'all') {
      usersRefWithType = usersRef;
    }
    else {
      usersRefWithType = usersRef.where("type", "==", type);
    }

    usersRefWithType
		.orderBy("username")
		.startAt(username)
		.limit(10)
		.get()
    .then((querySnapshot) => {
    	const users = []
      querySnapshot.forEach(function(doc) {
        const userData = doc.data();
        delete userData['g']
        delete userData['coordinates']
        users.push(
        	userData
        );
      });
      res(users);
    })
    .catch((error) => {
      rej(error);
    });
	});
};

const getBusinessUsersNearFire = (currentLocation, distance, unit) => {
  // distacne in miles
  // convert it to km
  // geofirestore takes km
	return new Promise (async (res, rej) => {
    const MILE_TO_KM = 1.6;
    console.log("get bus near in: ", distance, unit);
    const distanceInKm = unit === "mile" ? distance * MILE_TO_KM : distance;
    console.log("distance in km: ", distanceInKm);
    const firestore = Firebase.firestore();
    // Create a GeoFirestore reference
    const GeoFirestore = geofirestore.initializeApp(firestore);
		const findBusinessRef = await GeoFirestore.collection("users").where("type", "==", "business");
		const geoQuery = findBusinessRef.near({ 
      center: new firebase.firestore.GeoPoint(currentLocation.latitude, currentLocation.longitude),
      radius: distanceInKm
    });
    geoQuery
    .get()
    .then(async (querySnapshot) => {
      const docLength = querySnapshot.docs.length;
      if (docLength > 0) {
        const userDocs = querySnapshot.docs.map((doc) => {
          const docId = doc.id;
          const docData = doc.data();
          const distance = unit === "mile" ? doc.distance : doc.distance/MILE_TO_KM;

          // sign
          // countRating
          // totalRating
          // username
          // photoURL
          // geometry
          
          if (docData && docData.g) {
            delete docData['g']
          };

          if (docData && docData.coordinates) {
            delete docData['coordinates']
          };

          const businessUser = {
            id: docId,
            data: docData,
            distance: distance
          };

          return businessUser;
        });

        const businessUsers = await Promise.all(userDocs);
        res(businessUsers);
      }
      else {
        res([]);
      }
    })
    .catch((error) => {
      rej(error);
    });
	});
};

const getUserInfoFire = (uid) => {
  return new Promise ((res, rej) => {
    usersRef
    .doc(uid)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        if (userData && userData.g) {
          delete userData['g']
        }
        if (userData && userData.coordinates) {
          delete userData['coordinates']
        }
        res(userData);
      } else {
        res(false);
      }
    })
    .catch((error) => {
      rej(error);
    })
  });
};

const getUserNotificationsRealtime = (uid, schedulePushNotification) => {
  const now = Date.now();
  console.log("start listening notifications");
  return usersRef
  .doc(uid)
  .collection('notifications')
  .where('createdAt', ">=", now)
  .onSnapshot((querySnapshot) => {
    if (querySnapshot.docs.length > 0) {
      const notificationsFirestore = querySnapshot
      .docChanges()
      .filter(({ type }) => type === 'added')
      .map(({ doc }) => {
        const docId = doc.id;
        const docData = doc.data();
        let newNotification;

        if (docData.collection === 'technicianRequests') {
          // technician request
          const getUser = usersRef.doc(docData.senderId).get();
          getUser
          .then((sender) => {
            const senderData = sender.data();
            newNotification = { 
              title: "✉️ You've got a new application from a technician",
              body: `${senderData.username} has applied to join your business`,
              data: {
                _id: docId,
                collection: docData.collection,
                docId: docData.docId, 
                createdAt: docData.createdAt,
                senderId: docData.senderId,
                username: senderData.username,
                photoURL: senderData.photoURL,
              },
              triggerTime: 1,
              repeats: false,
            }
            console.log(newNotification)
            schedulePushNotification(newNotification);
          })
        }
        else if (docData.collection === 'chats') {
          const getUser = usersRef.doc(docData.senderId).get();
          getUser
          .then((sender) => {
            const senderData = sender.data();
            newNotification = { 
              title: `✉️ You've got a message from ${senderData.username}`,
              body: docData.text,
              data: {
                _id: docId,
                collection: docData.collection,
                docId: docData.docId, 
                createdAt: docData.createdAt,
                senderId: docData.senderId,
                username: senderData.username,
                photoURL: senderData.photoURL,
              },
              triggerTime: 1,
              repeats: false,
            }
            console.log(newNotification)
            schedulePushNotification(newNotification);
          })
        }
      })
      .sort((a, b) => b.createdAt - a.createdAt)
    }
  });

  return () => unsubscribe();
};

const getUserDataRealtime = (uid, addCurrentUserData) => {
  console.log("start listening user data");
  let initState = true;
  const userDoc = usersRef.doc(uid);

  return userDoc.onSnapshot(docSnapshot => {
    const userData = docSnapshot.data();
    if (userData && userData.g) {
      delete userData['g']
    }
    if (userData && userData.coordinates) {
      delete userData['coordinates']
    }

    if (!initState) {
      console.log("added user's realtime data: ", userData.id);
      addCurrentUserData(userData);
    } else {
      initState = false;
    }
    // console.log("added user's realtime data: ", userData.id);
    // addCurrentUserData(userData);
  }, err => {
    console.log(`error: getUserDataRealtime: ${err}`);
  });

  return () => unsubscribe();
};

const getTheOtherUserChatStatusRealtime = (theOtherUserId) => {
  const now = Date.now();
  console.log("start listening notifications");
  const unsubscribe = usersRef
  .doc(uid)
  .collection('notifications')
  .where('createdAt', ">=", now)
  .onSnapshot((querySnapshot) => {
    if (querySnapshot.docs.length > 0) {
      const notificationsFirestore = querySnapshot
      .docChanges()
      .filter(({ type }) => type === 'added')
      .map(({ doc }) => {
        const docId = doc.id;
        const docData = doc.data();
        let newNotification;

        if (docData.collection === 'technicianRequests') {
          // technician request
          const getUser = usersRef.doc(docData.senderId).get();
          getUser
          .then((sender) => {
            const senderData = sender.data();
            newNotification = { 
              title: "✉️ You've got a new application from a technician",
              body: `${senderData.username} has applied to join your business`,
              data: {
                _id: docId,
                collection: docData.collection,
                docId: docData.docId, 
                createdAt: docData.createdAt,
                senderId: docData.senderId,
                username: senderData.username,
                photoURL: senderData.photoURL,
              },
              triggerTime: 1,
              repeats: false,
            }
            console.log(newNotification)
            schedulePushNotification(newNotification);
          })
        }
        else if (docData.collection === 'chats') {
          const getUser = usersRef.doc(docData.senderId).get();
          getUser
          .then((sender) => {
            const senderData = sender.data();
            newNotification = { 
              title: `✉️ You've got a message from ${senderData.username}`,
              body: docData.text,
              data: {
                _id: docId,
                collection: docData.collection,
                docId: docData.docId, 
                createdAt: docData.createdAt,
                senderId: docData.senderId,
                username: senderData.username,
                photoURL: senderData.photoURL,
              },
              triggerTime: 1,
              repeats: false,
            }
            console.log(newNotification)
            schedulePushNotification(newNotification);
          })
        }
      })
      .sort((a, b) => b.createdAt - a.createdAt)
    }
  });

  return () => unsubscribe();
};

const getUserPhotoURLFire = (userId) => {
  return new Promise ((res, rej) => {
    usersRef
    .doc(userId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        if (userData.photoURL) {
          res(userData.photoURL);
        } else {
          res(null);
        };
      } else {
        res(null);
      };
    })
    .catch((error) => {
      rej(error);
    })
  });
}

const getUserSearchHistoryFire = (userId) => {
  return new Promise ((res, rej) => {
    usersRef
    .doc(userId)
    .collection("user_search_history")
    .where("deleted", "==", false)
    .orderBy("searchedAt", "desc")
    .limit(10)
    .get()
    .then(async (querySnapshot) => {
      const docLength = querySnapshot.docs.length;
      // const lastVisible = querySnapshot.docs[docLength - 1];
      if (docLength > 0) {
        const searchDocs = querySnapshot.docs.map((doc) => {
          const docData = doc.data();

          return docData;
        });

        const searchHist = await Promise.all(searchDocs);
        res({ fetchedSearchHist: searchHist });
      } else {
        res({ fetchedSearchHist: [] });
      };
    })
    .catch((error) => {
      rej(error);
    });
  });
};


export { 
  getSearchUsersFire, 
  getBusinessUsersNearFire, 
  getUserInfoFire, 
  getUserNotificationsRealtime, 
  getUserDataRealtime,
  getUserPhotoURLFire,
  getUserSearchHistoryFire
};
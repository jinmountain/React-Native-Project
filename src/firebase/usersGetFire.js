import Firebase from '../firebase/config';
import firebase from 'firebase/app';
import { navigate } from '../navigationRef';
// import * as geolib from 'geolib';
import * as geofirestore from 'geofirestore';

const db = Firebase.firestore();
const usersRef = db.collection('users');

const currentUserFire = () => {
	return Firebase.auth().currentUser || {}
};

const getSearchUsersFire = (username, type) => {
	return new Promise (async (res, rej) => {
    let usersRefWithType;
		if (type === 'bus') {
      usersRefWithType = usersRef.where("type", "==", "business");
    }
    if (type === 'all') {
      usersRefWithType = usersRef;
    }
    usersRefWithType
		.orderBy('username')
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
    .catch(function(error) {
      console.log("Error occured during fetching business users: ", error);
    });
	});
};

const getBusinessUsersNearFire = (currentLocation, distance) => {
  // distacne in km
	return new Promise (async (res, rej) => {
    const firestore = Firebase.firestore();
    // Create a GeoFirestore reference
    const GeoFirestore = geofirestore.initializeApp(firestore);
		const findBusinessRef = await GeoFirestore.collection("users").where("type", "==", "business");
		const query = findBusinessRef.near({ 
      center: new firebase.firestore.GeoPoint(currentLocation.latitude, currentLocation.longitude),
      radius: distance
    });
    query
    .get()
    .then((querySnapshot) => {
      let businessUsers = []
      querySnapshot.forEach( async (userDoc) => {
        const user = userDoc
        const userData = user.data();
        // delete these attributes because they are geopoints in firebase and they are functions
        // they cause an error when they are in json object
        delete userData['g']
        delete userData['coordinates']
        // console.log({ "distance": user.distance, ...user.data() });
        businessUsers.push({ "distance": user.distance, ...userData });
      });
      res(businessUsers);
    })
    .catch(function(error) {
      console.log("Error occured during fetching business users in ", distance, ": ", error);
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
        console.log(userData);
        res(userData);
      } else {
        res(false);
        console.log(uid, "is not an existing user")
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
}

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
}

export default { getSearchUsersFire, getBusinessUsersNearFire, getUserInfoFire, getUserNotificationsRealtime };
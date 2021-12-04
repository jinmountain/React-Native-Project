import Firebase from '../../firebase/config'
import firebase from 'firebase/app';
// import { navigate } from '../../navigationRef';
const db = Firebase.firestore();
const batch = db.batch();
const postsRef = db.collection("posts");

const likePostFire = (postId, uid) => {
	return new Promise ((res, rej) => {
    const usersLikesRef = db.collection("users").doc(uid).collection("likes");
    const likeCountIncrement = firebase.firestore.FieldValue.increment(1);

    const getLike = usersLikesRef.doc(postId).get();
    getLike
    .then((doc) => {
      if (doc.exists) {
        // console.log("already liked: ", postId,)
        res(false);
      } else {
        const getPostData = postsRef.doc(postId).get();
        getPostData
        .then((post) => {
          const postData = post.data();
          // heat is like speed to me 
          // (60 * 1000) is a minute since the time is in ms
          // 1000 is a second
          const timePassedInSec = (Date.now() - postData.createdAt) / 1000;
          const newHeat = Number((postData.likeCount + 1) / timePassedInSec);
          // console.log("likeFire: " + postId + " like + 1 " + " new heat: ", newHeat);
          // make a new doc in linkes
          usersLikesRef.doc(postId).set({});
          // Posts Ref
          postsRef
          .doc(postId)
          .set(
            { 
              likeCount: likeCountIncrement,  
              // array of timestamps for the tag
              heat: newHeat
            }, 
            { merge: true }
          );

          res(true);
        })
        .catch((error) =>{
          rej(error);
        });
      }
    })
    .catch((error) => {
      rej(error);
    });
	});
};

const undoLikePostFire = (postId, uid) => {
  return new Promise ((res, rej) => {
    const usersLikesRef = db.collection("users").doc(uid).collection("likes");
    const likeCountDecrement = firebase.firestore.FieldValue.increment(-1);
    // write delete is cheaper than write wrtie in firestore 
    const getLike = usersLikesRef.doc(postId).get();
    getLike
    .then((doc) => {
      if (doc.exists) {
        const getPostData = postsRef.doc(postId).get();
        getPostData
        .then((post) => {
          const postData = post.data();
          // heat is like speed to me 
          // (60 * 1000) is a minute since the time is in ms
          // 1000 is a second
          const timePassedInSec = (Date.now() - postData.createdAt) / 1000;
          const newHeat = Number((postData.likeCount - 1) / timePassedInSec);
          // console.log("likeFire: " + postId + " like - 1 "+  "new heat: ", newHeat);
          // delete the doc in likes
          usersLikesRef.doc(postId).delete();

          // adjust the post doc

          postsRef
          .doc(postId)
          .set(
            { 
              likeCount: likeCountDecrement,  
              // array of timestamps for the tag
              heat: newHeat
            }, 
            { merge: true }
          );

          res(true);
        })
        .catch((error) => {
          rej(error);
        });
      } else {
        console.log("already undid like: ", postId);
        res(false);
      }
    })
    .catch((error) => {
      res(error);
    })
  });
};

export default { likePostFire, undoLikePostFire };
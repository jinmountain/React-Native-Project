import Firebase from '../../firebase/config'
import firebase from 'firebase/app';
// import { navigate } from '../../navigationRef';
const db = Firebase.firestore();
const postsRef = db.collection("posts");
const usersRef = db.collection("users");

const checkLikeFire = (postId, uid) => {
	return new Promise ((res, rej) => {
    const likesRef = usersRef.doc(uid).collection("likes").doc(postId);
    likesRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        res(true);
      } else {
        res(false);
      }
    })
    .catch((error) => {
      rej(false);
    });
	});
};

export default { checkLikeFire }; 
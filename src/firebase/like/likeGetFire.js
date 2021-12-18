import Firebase from '../../firebase/config'
import firebase from 'firebase/app';
const db = Firebase.firestore();
const postsRef = db.collection("posts");
const usersRef = db.collection("users");

const checkLikeFire = (postId, uid) => {
	return new Promise ((res, rej) => {
    const likesRef = postsRef.doc(postId).collection("whoLike").doc(uid);
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

const checkCommentLikeFire = (postId, commentId, uid) => {
  return new Promise ((res, rej) => {
    const likesRef = postsRef.doc(postId).collection("comments").doc(commentId).collection("whoLike").doc(uid);
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

const checkReplyLikeFire = (postId, commentId, replyId, uid) => {
  return new Promise ((res, rej) => {
    const likesRef = postsRef
    .doc(postId)
    .collection("comments")
    .doc(commentId)
    .collection("replies")
    .doc(replyId)
    .collection("whoLike")
    .doc(uid);

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


export default { checkLikeFire, checkCommentLikeFire, checkReplyLikeFire }; 
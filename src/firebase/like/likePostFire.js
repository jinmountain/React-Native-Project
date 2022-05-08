// note
// write delete is cheaper than write wrtie in firestore

import Firebase from '../../firebase/config'
import firebase from 'firebase/app';
const db = Firebase.firestore();
const batch = db.batch();
const postsRef = db.collection("posts");

const likePostFire = (postId, uid) => {
	return new Promise ((res, rej) => {
    const postsUserLikesRef = postsRef.doc(postId).collection("whoLike");
    const likeCountIncrement = firebase.firestore.FieldValue.increment(1);
    const getLike = postsUserLikesRef.doc(uid).get();
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
          // make a new doc in likes
          postsUserLikesRef
          .doc(uid)
          .set(
            {
              uid: uid,
              postId: postId,
              createdAt: Date.now()
            }
          );
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
    const postsUserLikesRef = postsRef.doc(postId).collection("whoLike");
    const likeCountDecrement = firebase.firestore.FieldValue.increment(-1);
     
    const getLike = postsUserLikesRef.doc(uid).get();
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
          postsUserLikesRef.doc(uid).delete();

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
        res(false);
      }
    })
    .catch((error) => {
      rej(error);
    })
  });
};

const likeCommentFire = (postId, commentId, currentUserId) => {
  return new Promise ((res, rej) => {
    const commentsWhoLikeRef = postsRef.doc(postId).collection("comments").doc(commentId).collection("whoLike");
    const likeCountIncrement = firebase.firestore.FieldValue.increment(1);

    const getLike = commentsWhoLikeRef.doc(currentUserId).get();
    getLike
    .then((doc) => {
      if (doc.exists) {
        // console.log("already liked: ", postId,)
        res(false);
      } else {
        const commentRef = postsRef.doc(postId).collection("comments").doc(commentId);
        commentRef
        .get()
        .then((comment) => {
          const commentData = comment.data();
          // heat is like speed to me 
          // (60 * 1000) is a minute since the time is in ms
          // 1000 is a second
          const timePassedInSec = (Date.now() - commentData.createdAt) / 1000;
          const newHeat = Number((commentData.count_likes + 1) / timePassedInSec);
          // console.log("likeFire: " + postId + " like + 1 " + " new heat: ", newHeat);
          // make a new doc in linkes
          commentsWhoLikeRef.doc(currentUserId).set({
            uid: currentUserId,
            postId: postId,
            commentId: commentId,
            createdAt: Date.now()
          });
          
          // comment ref
          commentRef
          .set(
            { 
              count_likes: likeCountIncrement,
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

const undoLikeCommentFire = (postId, commentId, currentUserId) => {
  return new Promise ((res, rej) => {
    const commentsWhoLikeRef = postsRef.doc(postId).collection("comments").doc(commentId).collection("whoLike");
    const likeCountDecrement = firebase.firestore.FieldValue.increment(-1);
    // write delete is cheaper than write wrtie in firestore 
    const getLike = commentsWhoLikeRef.doc(currentUserId).get();
    getLike
    .then((doc) => {
      if (doc.exists) {
        const commentRef = postsRef.doc(postId).collection("comments").doc(commentId);
        commentRef
        .get()
        .then((comment) => {
          const commentData = comment.data();
          // heat is like speed to me 
          // (60 * 1000) is a minute since the time is in ms
          // 1000 is a second
          const timePassedInSec = (Date.now() - commentData.createdAt) / 1000;
          const newHeat = Number((commentData.count_likes - 1) / timePassedInSec);
          // console.log("likeFire: " + postId + " like - 1 "+  "new heat: ", newHeat);
          // delete the doc in likes
          commentsWhoLikeRef.doc(currentUserId).delete();

          // adjust the comment doc
          commentRef
          .set(
            { 
              count_likes: likeCountDecrement,
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
        res(false);
      }
    })
    .catch((error) => {
      rej(error);
    })
  });
};

const likeReplyFire = (postId, commentId, replyId, currentUserId) => {
  return new Promise ((res, rej) => {
    const repliesWhoLikeRef = postsRef
    .doc(postId)
    .collection("comments")
    .doc(commentId)
    .collection("replies")
    .doc(replyId)
    .collection("whoLike");

    const likeCountIncrement = firebase.firestore.FieldValue.increment(1);

    const getLike = repliesWhoLikeRef.doc(currentUserId).get();
    getLike
    .then((doc) => {
      if (doc.exists) {
        // console.log("already liked: ", postId,)
        res(false);
      } else {
        const replyRef = postsRef.doc(postId).collection("comments").doc(commentId).collection("replies").doc(replyId);
        replyRef
        .get()
        .then((reply) => {
          const replyData = reply.data();
          // heat is like speed to me 
          // (60 * 1000) is a minute since the time is in ms
          // 1000 is a second
          const timePassedInSec = (Date.now() - replyData.createdAt) / 1000;
          const newHeat = Number((replyData.count_likes + 1) / timePassedInSec);
          // console.log("likeFire: " + postId + " like + 1 " + " new heat: ", newHeat);
          // make a new doc in linkes
          repliesWhoLikeRef.doc(currentUserId).set({
            uid: currentUserId,
            postId: postId,
            commentId: commentId,
            replyId: replyId
          });
          
          // reply ref
          replyRef
          .set(
            { 
              count_likes: likeCountIncrement,
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

const undoLikeReplyFire = (postId, commentId, replyId, currentUserId) => {
  return new Promise ((res, rej) => {
    const repliesWhoLikeRef = postsRef.doc(postId).collection("comments").doc(commentId).collection("whoLike");
    const likeCountDecrement = firebase.firestore.FieldValue.increment(-1);
    // write delete is cheaper than write wrtie in firestore 
    const getLike = repliesWhoLikeRef.doc(currentUserId).get();
    getLike
    .then((doc) => {
      if (doc.exists) {
        const replyRef = postsRef.doc(postId).collection("comments").doc(commentId).collection("replies").doc(replyId);
        replyRef
        .get()
        .then((reply) => {
          const replyData = reply.data();
          // heat is like speed to me 
          // (60 * 1000) is a minute since the time is in ms
          // 1000 is a second
          const timePassedInSec = (Date.now() - replyData.createdAt) / 1000;
          const newHeat = Number((replyData.count_likes - 1) / timePassedInSec);
          // console.log("likeFire: " + postId + " like - 1 "+  "new heat: ", newHeat);
          // delete the doc in likes
          repliesWhoLikeRef.doc(currentUserId).delete();

          // adjust the reply doc
          replyRef
          .set(
            { 
              count_likes: likeCountDecrement,
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
        res(false);
      }
    })
    .catch((error) => {
      rej(error);
    })
  });
};

export { 
  likePostFire, 
  undoLikePostFire, 
  likeCommentFire, 
  undoLikeCommentFire, 
  likeReplyFire, 
  undoLikeReplyFire 
};
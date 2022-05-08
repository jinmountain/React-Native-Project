import Firebase from '../../firebase/config'
import firebase from 'firebase/app';
const db = Firebase.firestore();
const postsRef = db.collection("posts");
const usersRef = db.collection("users");

const checkPostLikeFire = (postId, uid) => {
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

const getPostLikeCountFire = (postId) => {
  return new Promise ((res, rej) => {
    postsRef
    .doc(postId)
    .get()
    .then((postDoc) => {
      if (postDoc.exists) {
        const postData = postDoc.data();
        const likeCount = postData.likeCount;
        res({likeCount: likeCount});
      } else {
        rej("post does not exist");
      }
    })
    .catch((error) => {
      rej(error);
    })
  });
};

const getCommentLikeCountFire = (postId, commentId) => {
  return new Promise ((res, rej) => {
    postsRef
    .doc(postId)
    .collection("comments")
    .doc(commentId)
    .get()
    .then((commentDoc) => {
      if (commentDoc.exists) {
        const commentData = commentDoc.data();
        const likeCount = commentData.count_likes;
        res({count_likes: likeCount});
      } else {
        rej("comment does not exist");
      }
    })
    .catch((error) => {
      rej(error);
    })
  });
};

const getReplyLikeCountFire = (postId, commentId, replyId) => {
  return new Promise ((res, rej) => {
    postsRef
    .doc(postId)
    .collection("comments")
    .doc(commentId)
    .collection("replies")
    .doc(replyId)
    .get()
    .then((replyDoc) => {
      if (replyDoc.exists) {
        const replyData = replyDoc.data();
        const likeCount = replyData.count_likes;
        res({count_likes: likeCount});
      } else {
        rej("reply does not exist");
      }
    })
    .catch((error) => {
      rej(error);
    })
  });
}

export { 
  checkPostLikeFire, 
  checkCommentLikeFire, 
  checkReplyLikeFire,
  getPostLikeCountFire,
  getCommentLikeCountFire,
  getReplyLikeCountFire
}; 
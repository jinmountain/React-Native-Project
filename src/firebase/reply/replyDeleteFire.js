import Firebase from '../../firebase/config';
import firebase from 'firebase/app';

const usersRef = Firebase.firestore().collection("users");
const postsRef = Firebase.firestore().collection("posts");

const deleteReplyFire = (postId, commentId, replyId) => {
	return new Promise (async (res, rej) => {
		try {
			const replyCountDecrement = firebase.firestore.FieldValue.increment(-1);
			const repliesRef = postsRef.doc(postId).collection("comments").doc(commentId).collection("replies");

			repliesRef
			.doc(replyId)
			.delete();

			const commentRef = postsRef.doc(postId).collection("comments").doc(commentId);
			commentRef
			.set({
				count_replies: replyCountDecrement
			}, {
				merge: true
			});

			res();
		} catch (error) {
			rej(error);
		}
	});
};

export default { 
	deleteReplyFire
};
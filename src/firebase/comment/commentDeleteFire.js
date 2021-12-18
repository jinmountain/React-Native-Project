import Firebase from '../../firebase/config';
import firebase from 'firebase/app';

const usersRef = Firebase.firestore().collection("users");
const postsRef = Firebase.firestore().collection("posts");

const deleteCommentFire = (postId, commentId) => {
	return new Promise (async (res, rej) => {
		try {
			const commentCountDecrement = firebase.firestore.FieldValue.increment(-1);
			const commentsRef = postsRef.doc(postId).collection("comments");

			commentsRef
			.doc(commentId)
			.delete();

			const postRef = postsRef.doc(postId);
			postRef
			.set({
				commentCount: commentCountDecrement
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
	deleteCommentFire
};
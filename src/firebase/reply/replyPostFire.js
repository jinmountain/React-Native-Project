import Firebase from '../../firebase/config';
import firebase from 'firebase/app';

const usersRef = Firebase.firestore().collection("users");
const postsRef = Firebase.firestore().collection("posts");

const postReplyFire = (postId, commentId, currentUserId, newComment) => {
	return new Promise (async (res, rej) => {
		try {
			const replyCountIncrement = firebase.firestore.FieldValue.increment(1);

			const repliesRef = postsRef.doc(postId).collection("comments").doc(commentId).collection("replies");
			const id = await repliesRef.doc().id;
			const newReplyJson = { 
				text: newComment,
				count_likes: 0,
				createdAt: Date.now(),
				heat: 0,
				uid: currentUserId
			};
			repliesRef
			.doc(id)
			.set(newReplyJson);

			const commentRef = postsRef.doc(postId).collection("comments").doc(commentId);
			commentRef
			.set({
				count_replies: replyCountIncrement
			}, {
			 	merge: true
			});

			res({ id: id, data: newReplyJson });
		} catch (error) {
			rej(error);
		}
	});
};

const editReplyFire = (postId, commentId, replyId, editedText) => {
	return new Promise (async (res, rej) => {
		try {
			const repliesRef = postsRef.doc(postId).collection("comments").doc(commentId).collection("replies");
			repliesRef
			.doc(replyId)
			.set({
				text: editedText,
				edited: true
			}, { merge: true });

			res(true);
		} catch (error) {
			rej(error);
		}
	});
};

export default { 
	postReplyFire,
	editReplyFire
};
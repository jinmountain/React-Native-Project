import Firebase from '../../firebase/config';
import firebase from 'firebase/app';

const usersRef = Firebase.firestore().collection("users");
const postsRef = Firebase.firestore().collection("posts");

const postCommentFire = (postId, currentUserId, newText) => {
	return new Promise (async (res, rej) => {
		try {
			const commentCountIncrement = firebase.firestore.FieldValue.increment(1);

			const commentsRef = postsRef.doc(postId).collection("comments");
			const id = await commentsRef.doc().id;
			const newCommentJson = { 
				text: newText,
				count_likes: 0,
				count_replies: 0,
				createdAt: Date.now(),
				heat: 0,
				uid: currentUserId
			};
			commentsRef
			.doc(id)
			.set(newCommentJson);

			const postRef = postsRef.doc(postId);
			postRef
			.set({
				commentCount: commentCountIncrement
			}, {
			 	merge: true
			});

			res({ id: id, data: newCommentJson });
		} catch (error) {
			rej(error);
		}
	});
};

const editCommentFire = (postId, commentId, editedText) => {
	return new Promise (async (res, rej) => {
		try {
			const commentsRef = postsRef.doc(postId).collection("comments");
			commentsRef
			.doc(commentId)
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
	postCommentFire,
	editCommentFire
};
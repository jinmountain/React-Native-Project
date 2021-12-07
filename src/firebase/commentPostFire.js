import Firebase from '../firebase/config'
import { navigate } from '../navigationRef';

const usersRef = Firebase.firestore().collection("users");
const postsRef = Firebase.firestore().collection("posts");

const postCommentFire = (postId, currentUserId, newComment) => {
	return new Promise (async (res, rej) => {
		const commentsRef = postsRef.doc(postId).collection("comments");
		const id = await commentsRef.doc().id;
		const newCommentJson = { 
			comment: newComment,
			count_likes: 0,
			count_replies: 0,
			createdAt: Date.now(),
			heat: 0,
			uid: currentUserId
		};
		commentsRef
		.doc(id)
		.set(newCommentJson);

		res({ id: id, data: newCommentJson });
	});
}


export default { 
	postCommentFire
};
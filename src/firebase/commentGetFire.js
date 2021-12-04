import Firebase from '../firebase/config'
import { navigate } from '../navigationRef';

const usersRef = Firebase.firestore().collection("users");
const postsRef = Firebase.firestore().collection("posts");

const getTopComment = (postId) => {
	return new Promise (async (res, rej) => {
		const getTopCommentRef = postsRef.doc(postId).collection("comments").orderBy("heat", "desc").limit(1);
		
		let topComment = null;
		
		await getTopCommentRef
		.get()
		.then((commentQuerySnaphot) => {
			const commentQueryLen = commentQuerySnaphot.docs.length;
			if (commentQueryLen === 1) {
				commentQuerySnaphot.forEach((doc) => {
					topComment = doc.data();
				});
			}
		})
		.catch((error) => {
			rej(error);
		});

		const getTopCommentUser = topComment ? await usersRef.doc(topComment.uid).get() : null
		const topCommentUser = getTopCommentUser ? getTopCommentUser.data() : null

		const comment = {
			data: topComment,
  		user: 
  			topCommentUser 
  			? 
  			{ 
  				id: topCommentUser.id, 
  				photoURL: topCommentUser.photoURL 
  			} 
  			: null
		};

		res(comment);
	});
};


export default { 
	getTopComment 
};
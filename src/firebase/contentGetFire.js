import Firebase from '../firebase/config'
import { navigate } from '../navigationRef';

const currentUserFire = () => {
	return Firebase.auth().currentUser || {}
};

const usersRef = Firebase.firestore().collection("users");
const postsRef = Firebase.firestore().collection("posts");

// accept user as a parameter then use user data to merge in userPost
const getUserPostsFire = (lastPost, accountUserId, currentUserId) => {
	return new Promise ((res, rej) => {
		let postRef;
		if (lastPost) {
			postRef = postsRef
			.where("uid", "==", accountUserId)
			.where("display", "==", false)
			.orderBy("createdAt", "desc")
			.startAfter(lastPost)
			console.log("Start from the last post.");
		} else {
			postRef = postsRef
			.where("uid", "==", accountUserId)
			.where("display", "==", false)
			.orderBy("createdAt", "desc")
		};
		postRef
		.limit(27)
		.get()
		.then((querySnapshot) => {
			// querySnapshot.forEach((doc) => {
			// 	console.log(doc.id, " => ", doc.data());
			// });
			const userPosts = []
			var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
			const docLength = querySnapshot.docs.length;
			let docIndex = 0;
			if (docLength > 0) {
	      querySnapshot.forEach(async (doc) => {
	      	const docId = doc.id
	      	const docData = doc.data()

	      	const userPost = {
	      		id: docId, 
	      		data: docData, 
	      	};

					userPosts.push(userPost);

					docIndex += 1;

		  		if (docIndex === docLength) {
						res({ fetchedPosts: userPosts, lastPost: lastVisible });
					};
	      });
	    } else {
	    	res({ fetchedPosts: userPosts, lastPost: lastVisible });
	    };
		})
		.catch((error) => {
			console.log("Error occured while getting user posts: ", error);
		});
	})
};

const getBusinessDisplayPostsFire = (lastPost, businessUserId, currentUserId) => {
	return new Promise ((res, rej) => {
		let postRef;
		if (lastPost) {
			postRef = postsRef
			.where("uid", "==", businessUserId)
			.where("display", "==", true)
			.orderBy("createdAt", "desc")
			.startAfter(lastPost)
			console.log("getBusinessDisplayPostsFire: found startAfter");
		} else {
			postRef = postsRef
			.where("uid", "==", businessUserId)
			.where("display", "==", true)
			.orderBy("createdAt", "desc")
		};
		postRef
		.limit(7)
		.get()
		.then((querySnapshot) => {
			// querySnapshot.forEach((doc) => {
			// 	console.log(doc.id, " => ", doc.data());
			// });
			const userPosts = []
			var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
			const docLength = querySnapshot.docs.length;
			let docIndex = 0;
			if (docLength > 0) {
	      querySnapshot.forEach(async (doc) => {
	      	const docId = doc.id
	      	const docData = doc.data()

	      	const userPost = {
	      		id: docId, 
	      		data: docData, 
	      	};

					userPosts.push(userPost);

					docIndex += 1;

		  		if (docIndex === docLength) {
						res({fetchedPosts: userPosts, lastPost: lastVisible});
		  		};
	      });
	    } else {
	    	res({ fetchedPosts: userPosts, lastPost: lastVisible });
	    };
		})
		.catch((error) => {
			console.log("Error occured while getting user posts: ", error);
		});
	})
};

// posts that tagged the business user 
const getTaggedPostsFire = (lastPost, businessUserId, userId) => {
	return new Promise (async (res, rej) => {
		let postRef;
		if (lastPost) {
			postRef = postsRef
			.where("tid", "==", businessUserId)
			.orderBy("createdAt", "desc")
			.startAfter(lastPost)
			console.log("Start from the last post.");
		} else {
			postRef = postsRef
			.where("tid", "==", businessUserId)
			.orderBy("createdAt", "desc")
		};

		await postRef
		.limit(15)
		.get()
		.then(async (querySnapshot) => {
			let lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
			const businessPosts = []
			const docLength = querySnapshot.docs.length;
			let docIndex = 0;
			if (docLength > 0) {
				querySnapshot.forEach(async (doc) => {
					let docId = doc.id;
			  	let docData = doc.data();

		  		let businessPost = {
		  			id: docId, 
		  			data: docData, 
		  		};

					businessPosts.push(businessPost);

		  		docIndex += 1;

		  		if (docIndex === docLength) {
						res({ fetchedPosts: businessPosts, lastPost: lastVisible });
		  		};
				});
			} else {
				res({ fetchedPosts: businessPosts, lastPost: lastVisible });
			}
		})
		.catch((error) => {
			console.log("Error occured while getting business tagged posts: ", error);
		});
	});
};

const getHotPostsFire = (lastPost, userId) => {
	return new Promise ((res, rej) => {
		let postRef;
		if (lastPost) {
			postRef = postsRef
			.orderBy("heat", "desc")
			.startAfter(lastPost)
			console.log("Start from the last post.");
		} else {
			postRef = postsRef
			.orderBy("heat", "desc")
		};
		postRef
		.limit(6)
		.get()
		.then((querySnapshot) => {
			const hotPosts = [];
			var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
			const docLength = querySnapshot.docs.length;
			let docIndex = 0;
			if (docLength > 0) {
	      querySnapshot.forEach(async (doc) => {
	      	const docId = doc.id;
	      	const docData = doc.data();
	      	
	      	const post = {
	      		id: docId, 
	      		data: docData, 
	      	};
	      	
					hotPosts.push(post);

					docIndex += 1;

					if (docIndex === docLength) {
						//console.log("first hot post: ", hotPosts[0])
						res({fetchedPosts: hotPosts, lastPost: lastVisible});
		  		}
	      });
	    } else {
	    	res({fetchedPosts: hotPosts, lastPost: lastVisible});
	    }
		})
		.catch((error) => {
			rej(error);
		});
	})
};

const getPostFire = (postId) => {
	return new Promise ((res, rej) => {
		postsRef
		.doc(postId)
		.get()
		.then((postDoc) => {
			if (postDoc.exists) {
				const docId = postDoc.id;
				const postData = postDoc.data();
				const post = {
					id: docId,
					data: postData
				}
				res(post);
			} else {
				rej(false);
			}
		})
		.catch((error) => {
			rej(error);
		});
	})
}

export default { 
	getUserPostsFire, 
	getBusinessDisplayPostsFire, 
	getTaggedPostsFire, 
	getHotPostsFire,
	getPostFire
};
import Firebase from '../../firebase/config'

const currentUserFire = () => {
	return Firebase.auth().currentUser || {}
};

const usersRef = Firebase.firestore().collection("users");
const postsRef = Firebase.firestore().collection("posts");

// accept user as a parameter then use user data to merge in userPost
const getUserPostsFire = (lastPost, accountUserId) => {
	return new Promise ((res, rej) => {
		const LIMIT = 15;
		let postRef;
		if (lastPost) {
			postRef = postsRef
			.where("uid", "==", accountUserId)
			.where("display", "==", false)
			.where("isRated", "==", false)
			.orderBy("createdAt", "desc")
			.startAfter(lastPost)
			console.log("Start from the last post.");
		} else {
			postRef = postsRef
			.where("uid", "==", accountUserId)
			.where("display", "==", false)
			.where("isRated", "==", false)
			.orderBy("createdAt", "desc")
		};
		postRef
		.limit(LIMIT)
		.get()
		.then(async (querySnapshot) => {
			const docLength = querySnapshot.docs.length;
			const lastVisible = querySnapshot.docs[LIMIT - 1];
			if (docLength > 0) {
				const postDocs = querySnapshot.docs.map((doc) => {
					const docId = doc.id;
	      	const docData = doc.data();

	      	const postDoc = {
	      		id: docId, 
	      		data: docData, 
	      	};

	      	return postDoc;
				});

				const userPosts = await Promise.all(postDocs);

	    	res({ fetchedPosts: userPosts, lastPost: lastVisible });
	    } else {
	    	res({ fetchedPosts: [], lastPost: lastVisible });
	    };
		})
		.catch((error) => {
			rej(error);
		});
	})
};

const getBusinessDisplayPostsFire = (lastPost, businessUserId) => {
	return new Promise ((res, rej) => {
		const LIMIT = 10;
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
		.limit(LIMIT)
		.get()
		.then(async (querySnapshot) => {
			const docLength = querySnapshot.docs.length;
			var lastVisible = querySnapshot.docs[LIMIT - 1];
			if (docLength > 0) {
	      const postDocs = querySnapshot.docs.map((doc) => {
					const docId = doc.id;
	      	const docData = doc.data();

	      	const postDoc = {
	      		id: docId, 
	      		data: docData, 
	      	};

	      	return postDoc;
				});

				const userPosts = await Promise.all(postDocs);
	    	res({ fetchedPosts: userPosts, lastPost: lastVisible });
	    } else {
	    	res({ fetchedPosts: [], lastPost: lastVisible });
	    };
		})
		.catch((error) => {
			rej(error);
		});
	})
};

// posts that rated the business user 
const getBusRatedPostsFire = (lastPost, businessUserId) => {
	return new Promise (async (res, rej) => {
		const LIMIT = 15;
		let ratedPostsRef;
		if (lastPost) {
			ratedPostsRef = postsRef
			.where("ratedBusId", "==", businessUserId)
			.where("display", "==", false)
			.where("isRated", "==", true)
			.orderBy("createdAt", "desc")
			.startAfter(lastPost)
			console.log("-- start from the last post.");
		} else {
			ratedPostsRef = postsRef
			.where("ratedBusId", "==", businessUserId)
			.where("display", "==", false)
			.where("isRated", "==", true)
			.orderBy("createdAt", "desc")
		};

		ratedPostsRef
		.limit(LIMIT)
		.get()
		.then(async (querySnapshot) => {
			const docLength = querySnapshot.docs.length;
			let lastVisible = querySnapshot.docs[LIMIT - 1];
			
			if (docLength > 0) {
				const postDocs = querySnapshot.docs.map((doc) => {
					const docId = doc.id;
	      	const docData = doc.data();

	      	const businessPost = {
		  			id: docId, 
		  			data: docData, 
		  		};

		  		return businessPost
				});

				const ratedPosts = await Promise.all(postDocs);

				res({ fetchedPosts: ratedPosts, lastPost: lastVisible });
			} else {
				res({ fetchedPosts: [], lastPost: lastVisible });
			}
		})
		.catch((error) => {
			rej(error);
		});
	});
};

// get posts that user made to rate
const getUserRatedPostsFire = (lastPost, userId) => {
	return new Promise (async (res, rej) => {
		const LIMIT = 15;
		let ratedPostsRef;
		if (lastPost) {
			ratedPostsRef = postsRef
			.where("uid", "==", userId)
			.where("display", "==", false)
			.where("isRated", "==", true)
			.orderBy("createdAt", "desc")
			.startAfter(lastPost)
			console.log("-- start from the last post.");
		} else {
			ratedPostsRef = postsRef
			.where("uid", "==", userId)
			.where("display", "==", false)
			.where("isRated", "==", true)
			.orderBy("createdAt", "desc")
		};

		ratedPostsRef
		.limit(LIMIT)
		.get()
		.then(async (querySnapshot) => {
			const docLength = querySnapshot.docs.length;
			let lastVisible = querySnapshot.docs[LIMIT - 1];
			
			if (docLength > 0) {
				const postDocs = querySnapshot.docs.map((doc) => {
					const docId = doc.id;
	      	const docData = doc.data();

	      	const businessPost = {
		  			id: docId, 
		  			data: docData, 
		  		};

		  		return businessPost
				});

				const ratedPosts = await Promise.all(postDocs);

				res({ fetchedPosts: ratedPosts, lastPost: lastVisible });
			} else {
				res({ fetchedPosts: [], lastPost: lastVisible });
			}
		})
		.catch((error) => {
			rej(error);
		});
	});
};

const getHotPostsFire = (lastPost) => {
	return new Promise ((res, rej) => {
		const LIMIT = 6;
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
		.then(async (querySnapshot) => {
			const docLength = querySnapshot.docs.length;
			const lastVisible = querySnapshot.docs[LIMIT - 1];
			
			if (docLength > 0) {
				const postDocs = querySnapshot.docs.map((doc) => {
					const docId = doc.id;
	      	const docData = doc.data();
	      	
	      	const post = {
	      		id: docId, 
	      		data: docData, 
	      	};

	      	return post;
				});

				const hotPosts = await Promise.all(postDocs);
	      
	      res({fetchedPosts: hotPosts, lastPost: lastVisible});
	    } else {
	    	res({fetchedPosts: [], lastPost: lastVisible});
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
	getBusRatedPostsFire,
	getUserRatedPostsFire,
	getHotPostsFire,
	getPostFire
};
import Firebase from '../firebase/config'
import { navigate } from '../navigationRef';

const currentUserFire = () => {
	return Firebase.auth().currentUser || {}
};

const usersRef = Firebase.firestore().collection("users");

// accept user as a parameter then use user data to merge in userPost
const getUserPostsFire = (lastPost, targetUser, currentUserId) => {
	return new Promise ((res, rej) => {
		let postRef;
		if (lastPost) {
			postRef = Firebase
			.firestore()
			.collection("posts")
			.where("uid", "==", targetUser.id)
			.where("display", "==", false)
			.orderBy("createdAt", "desc")
			.startAfter(lastPost)
			console.log("Start from the last post.");
		} else {
			postRef = Firebase
			.firestore()
			.collection("posts")
			.where("uid", "==", targetUser.id)
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
	      	const getLike = await Firebase.firestore().collection("users").doc(currentUserId).collection("likes").doc(docId).get();
	      	const like = getLike.data();
	      	const userPost = {
	      		id: docId, 
	      		data: docData, 
	      		user: targetUser,
	      		like: like ? true : false
	      	};
					userPosts.push(userPost);
					docIndex += 1;
		  		if (docIndex === docLength) {
						res({ fetchedPosts: userPosts, lastPost: lastVisible });
					}
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

const getBusinessDisplayPostsFire = (lastPost, businessUser, currentUserId) => {
	return new Promise ((res, rej) => {
		let postRef;
		if (lastPost) {
			postRef = Firebase
			.firestore()
			.collection("posts")
			.where("uid", "==", businessUser.id)
			.where("display", "==", true)
			.orderBy("createdAt", "desc")
			.startAfter(lastPost)
			console.log("getBusinessDisplayPostsFire: found startAfter");
		} else {
			postRef = Firebase
			.firestore()
			.collection("posts")
			.where("uid", "==", businessUser.id)
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
	      	let getLike;
	      	let like;
	      	if (currentUserId) {
	      		getLike = await Firebase.firestore().collection("users").doc(currentUserId).collection("likes").doc(docId).get();
	      		like = getLike.data();
	      	}
	      	const userPost = {
	      		id: docId, 
	      		data: docData, 
	      		user: businessUser,
	      		like: like ? true : false
	      	};
					userPosts.push(userPost);

					docIndex += 1;
		  		if (docIndex === docLength) {
						res({fetchedPosts: userPosts, lastPost: lastVisible});
		  		}
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
			postRef = Firebase
			.firestore()
			.collection("posts")
			.where("tid", "==", businessUserId)
			.orderBy("createdAt", "desc")
			.startAfter(lastPost)
			console.log("Start from the last post.");
		} else {
			postRef = Firebase
			.firestore()
			.collection("posts")
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
					// const userData = await getUserInfoFire(doc.data().uid);
					let docId = doc.id;
			  	let docData = doc.data();
		  		const user = await usersRef.doc(docData.uid).get();
		  		const userData = user.data();

		  		if (userData && userData.g) {
            delete userData['g']
          }
          if (userData && userData.coordinates) {
            delete userData['coordinates']
          }

		  		// check whether the current user liked the post
	      	const getLike = await Firebase.firestore().collection("users").doc(userId).collection("likes").doc(docId).get();
	      	const like = getLike.data();
		  		let businessPost = {
		  			id: docId, 
		  			data: docData, 
		  			user: userData,
		  			like: like ? true : false
		  		};
					businessPosts.push(businessPost);

		  		docIndex += 1;
		  		if (docIndex === docLength) {
						res({ fetchedPosts: businessPosts, lastPost: lastVisible });
		  		}
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

const getUserInfoFire = (uid) => {
  return new Promise ((res, rej) => {
    const findUserRef = Firebase.firestore().collection("users");
    findUserRef
    .doc(uid)
    .get()
    .then((doc) => {
      if (doc.exists) {
      	const userData = doc.data();

      	delete userData['g'];
        delete userData['coordinates'];

        res(userData);
      } else {
        console.log(uid, "is not an existing user.")
      }
    })
    .catch((error) => {
      console.log("Error occured during getting an user info: ", error);
    })
  });
}

const getHotPostsFire = (lastPost, userId) => {
	return new Promise ((res, rej) => {
		let postRef;
		if (lastPost) {
			postRef = Firebase
			.firestore()
			.collection("posts")
			.orderBy("heat", "desc")
			.startAfter(lastPost)
			console.log("Start from the last post.");
		} else {
			postRef = Firebase
			.firestore()
			.collection("posts")
			.orderBy("heat", "desc")
		};
		postRef
		.limit(10)
		.get()
		.then((querySnapshot) => {
			// querySnapshot.forEach((doc) => {
			// 	console.log(doc.id, " => ", doc.data());
			// });
			const hotPosts = [];
			var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
			const docLength = querySnapshot.docs.length;
			let docIndex = 0;
			if (docLength > 0) {
	      querySnapshot.forEach(async (doc) => {
	      	const docId = doc.id;
	      	const docData = doc.data();
	      	const user = await usersRef.doc(docData.uid).get();
		  		const userData = user.data();

		  		if (userData.g) {
		  			delete userData['g'];
		  		}
		  		if (userData.coordinates) {
		  			delete userData['coordinates'];
		  		}
      		
		  		const getLike = await Firebase.firestore().collection("users").doc(userId).collection("likes").doc(docId).get();
	      	const like = getLike.data();
	      	const post = {
	      		id: docId, 
	      		data: docData, 
	      		user: userData,
	      		like: like ? true : false
	      	}
					hotPosts.push(post)
					docIndex += 1;
					if (docIndex === docLength) {
						res({fetchedPosts: hotPosts, lastPost: lastVisible});
		  		}
	      });
	    } else {
	    	res({fetchedPosts: hotPosts, lastPost: lastVisible});
	    }
		})
		.catch((error) => {
			console.log("Error occured while getting hot posts: ", error);
		});
	})
};

// const getDisplayPostDetailFire = (postId, currentUserId) => {
// 	return new Promise ((res, rej) => {
// 		const postRef = Firebase
// 		.firestore()
// 		.collection("posts")
// 		.doc(postId)

// 		postRef
// 		.get()
// 		.then((doc) => {
//     	const docId = doc.id
//     	const docData = doc.data()
//     	let getLike;
//     	let like;
//     	if (currentUserId) {
//     		getLike = await Firebase.firestore().collection("users").doc(currentUserId).collection("likes").doc(docId).get();
//     		like = getLike.data();
//     	}
//     	const displayPostDetail = {
//     		id: docId, 
//     		data: docData, 
//     		user: businessUser,
//     		like: like ? true : false
//     	};
//     	res(displayPostDetail);
// 		})
// 		.catch((error) => {
// 			rej(error);
// 		});
// 	})
// };

export default { 
	getUserPostsFire, 
	getBusinessDisplayPostsFire, 
	getTaggedPostsFire, 
	getHotPostsFire 
};
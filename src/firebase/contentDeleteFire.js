import Firebase from '../firebase/config'
import { navigate } from '../navigationRef';
import firebase from 'firebase/app';

const deletePostFire = (postId, postData) => {
	return new Promise (async (res, rej) => {
		try {
			// delete post
			// from posts, posts from users, and taggedPosts from users (if applicable)

			// from posts 
			const db = Firebase.firestore();
			const postsRef = db.collection("posts").doc(postId);

			// owner of the post
			const userRef = db
			.collection("users")
			.doc(postData.uid);

			const countRatingDecrement = firebase.firestore.FieldValue.increment(-1);
	    const totalRatingDecrement = firebase.firestore.FieldValue.increment(postData.rating * -1);
	    const postCountDecrement = firebase.firestore.FieldValue.increment(-1);

	    const batch = db.batch();
	    // Delete from posts collection
	    batch.delete(postsRef);

	    // decrement post count
	    batch.set(
	    	userRef,
	    	{ postCount: postCountDecrement },
	    	{ merge: true }
	    );

	    // when the post has a tagged user
			let taggedUserRef
			if (postData.tid) {
				taggedUserRef = db
				.collection("users")
				.doc(postData.tid);
	    	// decrement post count tagged post count
	    	batch.set(
	    		taggedUserRef,
	    		{ taggedPostCount: postCountDecrement },
	    		{ merge: true }
	    	);
	    }

			// decrement rating
			if (postData.rating) {
		    batch.set(
		      taggedUserRef,
		      { countRating: countRatingDecrement, totalRating: totalRatingDecrement }, 
		      { merge: true }
		    );
			};

			if (postData.taggedPostId) {
				const taggedPostRef = db.collection("posts").doc(postData.taggedPostId);
				batch.set(
					taggedPostRef,
					{ taggedCount: postCountDecrement },
					{ merge: true }
				);
			};

	    batch.commit();

	    console.log("Post successfully deleted.");
  	} catch {(error) => {
  		console.log("Error occured while deleting a post: ", error);
  	}}

  	try {
			// delete images from storage
			const imagesToDelete = postData.image;

			var i;
			for (i = 0; i < imagesToDelete.length; i++) {
				if (imagesToDelete[i]) {
		      const currentPhotoRef = await Firebase.storage().refFromURL(imagesToDelete[i]);
		      if (currentPhotoRef) {
		        currentPhotoRef
		        .delete()
		        .then(() => {
		          console.log("A photo is deleted.");
		        })
		        // when there is only url and not a file in storage then delete the url.
		        .catch(error => {
		          console.log('it has failed to delete the image in storage', error);
		          rej(error);
		        });
		      } else {
		        console.log("Current photo URL Ref does not exist.");
		      }
		    } else {
		      console.log("Current photo URL does not exist.");
		    }
			}
		} catch {(error) => {
			console.log("Error occured while deleting photos in a post: ", error);
		}}
		res(true);
	});
};

export default { deletePostFire };
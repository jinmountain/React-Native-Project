import Firebase from '../../firebase/config'
import firebase from 'firebase/app';

const deletePostFire = (postId, postData) => {
	return new Promise (async (res, rej) => {
		try {
			console.log("postId: ", postId, "postData: ", postData);
			const db = Firebase.firestore();
			const postsRef = db.collection("posts").doc(postId);

			// post owner ref
			const userRef = db
			.collection("users")
			.doc(postData.uid);

	    const postCountDecrement = firebase.firestore.FieldValue.increment(-1);

	    const batch = db.batch();
	    // Delete from posts collection
	    batch.delete(postsRef);

	    // decrement post count
	    if (postData.display) {
	    	batch.set(
		    	userRef,
		    	{ displayPostCount: postCountDecrement },
		    	{ merge: true }
		    );
	    } else {
	    	console.log(" normal post ");
	    	batch.set(
		    	userRef,
		    	{ postCount: postCountDecrement },
		    	{ merge: true }
		    );
	    }

	    if (
	    	postData.isRated &&
	    	postData.ratedBusId && 
	    	postData.ratedPostId && 
	    	postData.rating && 
	    	postData.ratedTechId
	    ) {
				const countRatingDecrement = firebase.firestore.FieldValue.increment(-1);
	    	const totalRatingDecrement = firebase.firestore.FieldValue.increment(postData.rating * -1);
	    	
	    	let ratedPostChange = { 
          countRating: countRatingDecrement, 
          totalRating: totalRatingDecrement, 
        };

	      if (postData.rating === 1) {
	        ratedPostChange = { ...ratedPostChange, ...{ countRatingOne: countRatingDecrement }}
	      };
	      if (postData.rating === 2) {
	        ratedPostChange = { ...ratedPostChange, ...{ countRatingTwo: countRatingDecrement }}
	      };
	      if (postData.rating === 3) {
	        ratedPostChange = { ...ratedPostChange, ...{ countRatingThree: countRatingDecrement }}
	      };
	      if (postData.rating === 4) {
	        ratedPostChange = { ...ratedPostChange, ...{ countRatingFour: countRatingDecrement }}
	      };
	      if (postData.rating === 5) {
	        ratedPostChange = { ...ratedPostChange, ...{ countRatingFive: countRatingDecrement }}
	      };

	    	// post
	    	const taggedPostRef = db.collection("posts").doc(postData.taggedPostId);
				batch.set(
					taggedPostRef,
					ratedPostChange,
					{ merge: true }
				);

	    	// bus
				const ratedUserRef = db
				.collection("users")
				.doc(postData.ratedBusId);
	    	// decrement post count tagged post count
	    	batch.set(
	    		ratedUserRef,
	    		ratedPostChange,
	    		{ merge: true }
	    	);

        // tech's post 
        batch.set(
          ratedUserRef.collection("technicians").doc(postData.ratedTechId).collection("post_ratings").doc(newPost.ratedPostId),
          ratedPostChange,
          { merge: true }
        );

        // tech in bus 
        // update the tech user doc in technicians in the business doc
        batch.set(
          ratedUserRef.collection("technicians").doc(postData.ratedTechId),
          ratedPostChange,
          { merge: true }
        );
	    }

	    batch.commit();

	    console.log("post successfully deleted");
  	} catch {(error) => {
  		console.log("Error occured while deleting a post: ", error);
  	}}

  	try {
			// delete images from storage
			const filesToDelete = postData.files;

			var i;
			for (i = 0; i < filesToDelete.length; i++) {
				if (filesToDelete[i]) {
		      const currentPhotoRef = await Firebase.storage().refFromURL(filesToDelete[i]);
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
import Firebase from '../firebase/config';
import firebase from 'firebase/app';
import { navigate } from '../navigationRef';

const uid = () => {
  return (Firebase.auth().currentUser || {}).uid
};

const timestamp = () => {
  return Date.now()
};

const addPostFire = (newPost) => {
  return new Promise(async (res, rej) => {
    try {
      console.log("newPost: ", newPost);
      // Increment tag count
      const tagCountIncrement = firebase.firestore.FieldValue.increment(1);
      
      // Create tags
      const tagsRef = Firebase.firestore().collection("tags");

      const db = Firebase.firestore();
      const batch = db.batch();

      // add each tag and its tid(timestamp) into tags collection
      let tagIndex; // tagIndex for the first level doc in tags
      let relatedTagIndex; // relatedTagIndex for the tags in related in tag docs
      for (tagIndex = 0; tagIndex < newPost.tags.length; tagIndex++) {
        const now = Date.now();
        const checkExistingTag = await tagsRef.doc(newPost.tags[tagIndex]).get();
        console.log("checkExistingTag: ", checkExistingTag.data());
        const existingTagData = checkExistingTag.data();
        if (existingTagData === undefined) {
          batch.set(
            tagsRef.doc(newPost.tags[tagIndex]),
            { 
              name: newPost.tags[tagIndex], 
              count: tagCountIncrement,  
              // array of timestamps for the tag
              createdAt: now,
              heat: 0
            }, 
            { merge: true }
          );
        } else {
          let tagCountPlusOne = existingTagData.count + 1;
          // the first timestamp
          let tagTimestamp = existingTagData.createdAt;
          
          let fullDay = (now - tagTimestamp) / (3600 * 1000 * 24);
          let newHeat = Number(tagCountPlusOne/fullDay);
          batch.set(
            tagsRef.doc(newPost.tags[tagIndex]),
            { 
              name: newPost.tags[tagIndex],
              count: tagCountIncrement,  
              // array of timestamps for the tag
              lastTime: now,
              heat: newHeat
            }, 
            { merge: true }
          );
        }
        
        for (relatedTagIndex = 0; relatedTagIndex < newPost.tags.length; relatedTagIndex++) {
          if (tagIndex !== relatedTagIndex) {
            batch.set(
              tagsRef.doc(newPost.tags[tagIndex]).collection('related').doc(newPost.tags[relatedTagIndex]),
              {
                name: newPost.tags[relatedTagIndex],
                count: tagCountIncrement,
              },
              { merge: true }
            );
          };
        };
      };

      // Create a post
      // make a new post with firebase refs before create a post
      const postRef = Firebase.firestore().collection("posts")
      const id = await postRef.doc().id;

      batch.set(
        postRef.doc(id),
        newPost
        // newPostWithRefs
      );

      // if the post is a display post
      const usersRef = db.collection("users").doc(newPost.uid);
      const postCountIncrement = firebase.firestore.FieldValue.increment(1);
      if (newPost.display) {
        batch.update(
          usersRef,
          { 
            displayPostCount: postCountIncrement,
            lastUpdated: Date.now()
          }
        );
      // if the post is a regular post without rating
      } else {
        batch.update(
          usersRef,
          { 
            postCount: postCountIncrement,
            lastUpdated: Date.now()
          }
        );
      }

      // if there are a tagged user, rating, and a tagged post
      //  - countRating +1
      //  - totalRating +rating
      //  - countRating(one, two, three, four, five)

      if (newPost.tid && newPost.ratedPostId && newPost.rating && newPost.ratedTechId) {
        const totalRatingIncrement = firebase.firestore.FieldValue.increment(newPost.rating);
        const countRatingIncrement = firebase.firestore.FieldValue.increment(1);

        const usersTaggedRef = db.collection("users").doc(newPost.tid);

        let ratedPostChange = { 
          countRating: countRatingIncrement, 
          totalRating: totalRatingIncrement, 
        };

        if (newPost.rating === 1) {
          ratedPostChange = { ...ratedPostChange, ...{ countRatingOne: countRatingIncrement }}
        };
        if (newPost.rating === 2) {
          ratedPostChange = { ...ratedPostChange, ...{ countRatingTwo: countRatingIncrement }}
        };
        if (newPost.rating === 3) {
          ratedPostChange = { ...ratedPostChange, ...{ countRatingThree: countRatingIncrement }}
        };
        if (newPost.rating === 4) {
          ratedPostChange = { ...ratedPostChange, ...{ countRatingFour: countRatingIncrement }}
        };
        if (newPost.rating === 5) {
          ratedPostChange = { ...ratedPostChange, ...{ countRatingFive: countRatingIncrement }}
        };

        // post rating
        // update the rated post doc
        batch.set(
          postRef.doc(newPost.ratedPostId),
          ratedPostChange,
          { merge: true }
        );

        // bus rating
        // update the business user doc
        batch.set(
          usersTaggedRef,
          ratedPostChange,
          { merge: true }
        );

        // tech post rating
        batch.set(
          usersTaggedRef.collection("technicians").doc(newPost.ratedTechId).collection("post_ratings").doc(newPost.ratedPostId),
          ratedPostChange,
          { merge: true }
        )

        // tech bus rating
        // update the tech user doc in technicians in the business doc
        batch.set(
          usersTaggedRef.collection("technicians").doc(newPost.ratedTechId),
          ratedPostChange,
          { merge: true }
        )
      };
      
      // final commit
      batch.commit();
      res({id: id, data: newPost});
    } catch {(error) => {
      console.log("Error occured: contentPostFire: addPostFire: ", error);
      res(false);
    }};
  });
};

const uploadFileAsyncFire = (userId, fileId, fileType, uri, changeProgress) => {
  return new Promise(async (res, rej) => {
    let path;

    if (fileType === 'video') {
      path = `${userId}/post/videos/${fileId}`;
    }
    else if (fileType === 'image') {
      path = `${userId}/post/photos/${fileId}`;
    } else {
      return
    };

    const response = await fetch(uri);
    const file = await response.blob();

    let upload = Firebase
      .storage()
      .ref(path)
      .put(file);

    upload.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      snapshot => {
        var progress = snapshot.bytesTransferred / snapshot.totalBytes
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
        let roundedProgress = Math.round(progress * 100);
        console.log('Upload is ' + roundedProgress + '% done');
        changeProgress(roundedProgress);
      },
      err => {
        switch (err.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            rej(err);
            break;
          case 'storage/canceled':
            // User canceled the upload
            rej(err);
            break;
          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            rej(err);
            break;
        }
      },
      async () => {
        upload.snapshot.ref.getDownloadURL()
        .then((URL) => {
          changeProgress(null);
          res(URL);
        });
      }
    );
  });
};

export default {
  addPostFire, 
  uploadFileAsyncFire, 
};
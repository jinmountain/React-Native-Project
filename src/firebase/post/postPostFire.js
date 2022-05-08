import Firebase from '../../firebase/config';
import firebase from 'firebase/app';

// hooks
import makeTagBridgeId from '../../hooks/makeTagBridgeId';
import useConvertTime from '../../hooks/useConvertTime';

const uid = () => {
  return (Firebase.auth().currentUser || {}).uid
};

const timestamp = () => {
  return Date.now()
};

const addPostFire = (newPost) => {
  return new Promise(async (res, rej) => {
    try {
      const now = Date.now();
      // console.log("newPost: ", newPost);
      // Increment tag count
      const tagCountIncrement = firebase.firestore.FieldValue.increment(1);
      
      // Create tags
      const tagsRef = Firebase.firestore().collection("tags");
      const tagBridgesRef = Firebase.firestore().collection("tag_bridges");

      const db = Firebase.firestore();
      const batch = db.batch();

      // add each tag and its tid(timestamp) into tags collection
      let tagIndex; // tagIndex for the first level doc in tags
      let relatedTagIndex; // relatedTagIndex for the tags in related in tag docs
      const postTags = newPost.tags;
      const tagLength = postTags.length;
      for (tagIndex = 0; tagIndex < tagLength; tagIndex++) {
        const currentTag = postTags[tagIndex];
        const smallCurrentTag = currentTag.toLowerCase()
        const checkExistingTag = await tagsRef.doc(smallCurrentTag).get();
        console.log("checkExistingTag: ", checkExistingTag.data());
        const existingTagData = checkExistingTag.data();
        if (existingTagData === undefined) {
          batch.set(
            tagsRef.doc(smallCurrentTag),
            { 
              name: postTags[tagIndex], 
              count: tagCountIncrement,  
              // array of timestamps for the tag
              createdAt: now,
              heat: 0
            }, 
            { merge: true }
          );
        } else {
          const tagCountPlusOne = existingTagData.count + 1;
          // the first timestamp
          const tagTimestamp = existingTagData.createdAt;
          
          const fullDayTag = (now - tagTimestamp) / (3600 * 1000 * 24);
          const newHeatTag = Number(tagCountPlusOne/fullDayTag);
          batch.set(
            tagsRef.doc(postTags[tagIndex]),
            { 
              name: postTags[tagIndex],
              count: tagCountIncrement,  
              // array of timestamps for the tag
              lastTime: now,
              heat: newHeatTag
            }, 
            { merge: true }
          );
        }
        
        // -- make bridges between each tag
        // until tag index is less than tagLength - 1
        if (tagIndex < tagLength - 1) {
          for (relatedTagIndex = tagIndex + 1; relatedTagIndex < tagLength; relatedTagIndex++) {
            console.log("relatedTagIndex: ", relatedTagIndex);

            const rootTag = postTags[tagIndex];
            const nextTag = postTags[relatedTagIndex]

            console.log("rootTag: ", rootTag, "nextTag: ", nextTag);

            const tagBridgeId = await makeTagBridgeId(rootTag, nextTag);

            console.log("tag brideg id: ", tagBridgeId);

            const checkExistingTagBridge = await tagBridgesRef.doc(tagBridgeId).get();
            const existingTagBridgeData = checkExistingTagBridge.data();

            console.log("existing tag brideg: ", existingTagBridgeData);

            if (existingTagBridgeData === undefined) {
              batch.set(
                tagBridgesRef.doc(tagBridgeId),
                {
                  tags: [rootTag, nextTag],
                  count: tagCountIncrement,
                  heat: 0,
                  createdAt: now
                },
                { merge: true }
              );
            } else {
              const tagBridgeCountPlusOne = existingTagBridgeData.count + 1;
              const tagBridgeTimestamp = existingTagBridgeData.createdAt;
            
              const fullDayTagBridge = (now - tagBridgeTimestamp) / (3600 * 1000 * 24);
              const newHeatTagBridge = Number(tagBridgeCountPlusOne/fullDayTagBridge);
              batch.set(
                tagBridgesRef.doc(tagBridgeId),
                {
                  tags: [rootTag, nextTag],
                  count: tagCountIncrement,
                  heat: newHeatTagBridge,
                  lastTime: now
                },
                { merge: true }
              );
            }
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
            last_display_post_update_at: Date.now()
          }
        );
      // if the post is a regular post without rating
      } else {
        batch.update(
          usersRef,
          { 
            postCount: postCountIncrement,
            last_post_update_at: Date.now()
          }
        );
      }

      // if there are a tagged user, rating, and a tagged post
      //  - countRating +1
      //  - totalRating +rating
      //  - countRating(one, two, three, four, five)

      if (
        newPost.isRated &&
        newPost.ratedBusId && 
        newPost.ratedPostId && 
        newPost.rating && 
        newPost.ratedTechId
      ) {
        const nowTime = useConvertTime.convertToTime(now);
        const nowMonthIndex = nowTime.monthIndex;
        const nowNormalMonth = nowTime.normalMonth;
        const nowYear = nowTime.year;
        const monthYearId = `${nowMonthIndex}_${nowYear}`;

        const totalRatingIncrement = firebase.firestore.FieldValue.increment(newPost.rating);
        const countRatingIncrement = firebase.firestore.FieldValue.increment(1);

        const ratedUserRef = db.collection("users").doc(newPost.ratedBusId);

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
          ratedUserRef,
          ratedPostChange,
          { merge: true }
        );

        const ratedPostChageMonthYear = { 
          ...ratedPostChange,
          monthIndex: nowMonthIndex,
          year: nowYear
        };

        // bus month rating
        batch.set(
          ratedUserRef.collection("rating_counts").doc(monthYearId),
          ratedPostChageMonthYear,
          { merge: true }
        );

        // tech post rating
        batch.set(
          ratedUserRef.collection("technicians").doc(newPost.ratedTechId).collection("post_ratings").doc(newPost.ratedPostId),
          ratedPostChange,
          { merge: true }
        );

        // tech bus rating
        // update the tech user doc in technicians in the business doc
        batch.set(
          ratedUserRef.collection("technicians").doc(newPost.ratedTechId),
          ratedPostChange,
          { merge: true }
        );

        // tech bus month rating
        batch.set(
          ratedUserRef.collection("technicians").doc(newPost.ratedTechId).collection("rating_counts").doc(monthYearId),
          ratedPostChageMonthYear,
          { merge: true }
        );
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

const uploadFileAsyncFire = (userId, fileId, fileType, uri) => {
  return new Promise(async (res, rej) => {
    let path;

    if (fileType === 'video') {
      path = `${userId}/post/videos/${fileId}`;
    }
    else if (fileType === 'photo') {
      path = `${userId}/post/images/${fileId}`;
    } 
    else if (fileType === 'image') {
      path = `${userId}/post/images/${fileId}`;
    }
    else {
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
        // let roundedProgress = Math.round(progress * 100);
        // console.log('Upload is ' + roundedProgress + '% done');
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
          res(URL);
        });
      }
    );
  });
};

export {
  addPostFire, 
  uploadFileAsyncFire, 
};
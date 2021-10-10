import Firebase from '../firebase/config'
import { navigate } from '../navigationRef';

export default () => {
  const uid = () => {
    return (Firebase.auth().currentUser || {}).uid
  };

  const timestamp = () => {
    return Date.now()
  };

  const nullUserPhotoURL = (userType, userId) => {
    const usersRef = Firebase.firestore().collection('users')
    usersRef
    .doc(userId)
    .update({photoURL: null})
    .then(() => {
      console.log("The photoURL on users is set to null.", error);
    })
    .catch((error) => {
      console.log(error);
    });
  };

  const deleteCurrentPhoto = (currentPhotoURL, currentUser) => {
    // delete the old photo using the ref saved
    return new Promise (async (res, rej) => {
      console.log("Deleting the following image: ", currentPhotoURL);
      if (currentPhotoURL) {
        const currentPhotoRef = await Firebase.storage().refFromURL(currentPhotoURL);
        currentPhotoRef
        .delete()
        .then(() => {
          console.log("The old photo is deleted.");
          res();
        })
        // when there is only url and not a file in storage then delete the url.
        .catch((error) => {
          if (error.code_ === "storage/object-not-found") {
            // nullUserPhotoURL(currentUser.userType, currentUser.userId);
            console.log("The photo is already deleted in storage");
            res();
          } else {
            console.log('it has failed to delete the image in storage', error);
            res();
          }
        });
      } else {
        console.log("Current photo URL does not exist.");
      }
    })
  };

  const updateNewImage = async (newImageURL, currentUser) => {
    // updating new image url on AUTH
    return new Promise ((res, rej) => {
      // updating FIRESTORE as well
      const usersRef = Firebase.firestore().collection('users')
      usersRef
      .doc(currentUser.userId)
      .set(newImageURL, {merge: true})
      .then(() => {
        console.log("new profile picture: ", newImageURL);
      })
      .catch((error) => {
        console.log(error);
      });
      res();
    });
  };
  
  const updateProfilePhotoFire = async (uri, currentUser) => {
    // save the url of the current photo
    const currentPhotoURL = currentUser.userCurrentPhotoURL;

    // new image url
  	const imageURL = await uploadPhotoAsyncFire(currentUser.userId, uri);
    console.log('found the new image URL: ', imageURL);

  	const newImageURL = {
  		photoURL: imageURL
  	};

  	try {
      // Update photoURL to the new URL
      await updateNewImage(newImageURL, currentUser);
      // delete the old photo using the ref saved
      if (currentPhotoURL !== undefined) {
        await deleteCurrentPhoto(currentPhotoURL, currentUser);
      }
      // navigate back to Account screen 
      navigate('Account', {refreshing: true});
  	} catch {(error) => {
  		console.log('Profile update has failed.', error);
  	}}
  };

  const uploadPhotoAsyncFire = async (userId, uri) => {
    return new Promise(async (res, rej) => {
      const path = `${userId}/profile/photos/${Date.now()}.jpg`;
      const response = await fetch(uri);
      const file = await response.blob();

      let upload = Firebase
        .storage()
        .ref(path)
        .put(file);

      upload.on(
        "state_changed",
        snapshot => {},
        err => {
          rej(err);
        },
        async () => {
          const url = await upload.snapshot.ref.getDownloadURL();
          res(url);
        }
      );
    });
  };

  return [updateProfilePhotoFire];
}
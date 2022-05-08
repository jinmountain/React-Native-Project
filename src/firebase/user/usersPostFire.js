import Firebase from '../../firebase/config';
import firebase from 'firebase/app';

import { authCheck } from '../../firebase/authFire';
import checkUsernameFire from '../../firebase/checkUsernameFire';

const db = Firebase.firestore();
const usersRef = db.collection('users');

const changeUserAppState = (userId, appState) => {
	usersRef
	.doc(userId)
	.set({
		appState: appState
	}, {
		merge: true
	});
};

const postUserCurrentChat = (userId, chatId) => {
	usersRef
	.doc(userId)
	.set({
		currentChatId: chatId
	}, {
		merge: true
	});
};


const timestamp = () => {
	return Date.now()
};

const firestoreUsersUpdate = (userId, newProfileInfo) => {
	usersRef
	.doc(userId)
	.update(newProfileInfo)
	.then((user) => {
		console.log("updated user data on firestore");
	})
	.catch((error) => {
		console.log(error);
	});
};

const profileUpdateFire = (newProfile) => {
	return new Promise (async (res, rej) => {
		const checkAuth = authCheck();
		checkAuth
		.then((currentUser) => {
			if (newProfile.username) {
				const checkUsernameUnique = checkUsernameFire.checkUniqueUsername(newProfile.username);
				checkUsernameUnique
				.then((result) => {
					// result true if the username is unique
					if (result) {
						console.log("changed user data with new username");
						let newProfileDataWithLastUsernameChangeAt = {...newProfile, ...{last_username_change_at: Date.now()}};
						try {
							firestoreUsersUpdate(currentUser.uid, newProfileDataWithLastUsernameChangeAt);
							res(true);
						} catch (error) {
							rej(error);
						};
					} else {
						rej(false);
					}
				})
				.catch((error) => {
					rej(error);
				});
			} else {
				console.log("change user data without new username");
				try {
					firestoreUsersUpdate(currentUser.uid, newProfile);
					res(true);
				} catch (error) {
					rej(error);
				};
			}
		})
		.catch((error) => {
			rej(error);
		});
	});
};

const nullUserPhotoURL = (userId, type) => {
	return new Promise ((res, rej) => {
		let field;
		if (type === 'cover') {
			field = { coverPhotoURL: null }
		} 
		if (type === 'main') {
			field = { photoURL: null }
		}
		
	  usersRef
	  .doc(userId)
	  .update(field)
	  .then(() => {
	    // console.log("user photo url is set to null");
	    res();
	  })
	  .catch((error) => {
	    rej(error);
	  });
	})
};

const deleteCurrentPhoto = (currentPhotoURL, currentUserId, type) => {
  // delete the old photo using the ref saved
  return new Promise (async (res, rej) => {
    // console.log("delete the following image: ", currentPhotoURL);
    if (currentPhotoURL) {
      const currentPhotoRef = await Firebase.storage().refFromURL(currentPhotoURL);
      currentPhotoRef
      .delete()
      .then(() => {
        // console.log("the previous photo is deleted");
        res();
      })
      // when there is only url and not a file in storage then delete the url.
      .catch((error) => {
        nullUserPhotoURL(currentUserId, type)
        .then(() => {
        	// console.log("photo was not in the storage so deleted url");
        	res();
        })
        .catch(() => {
        	rej(error);
        })
      });
    } else {
    	rej("photo url was not entered");
    }
  })
};

const updateProfilePhotoFire = (newImage, currentPhotoURL = null) => {
	return new Promise ((res, rej) => {
		const updateNewImage = (newImageURL, currentUserId) => {
		  return new Promise ((res, rej) => {
		    usersRef
		    .doc(currentUserId)
		    .set(newImageURL, {merge: true})
		    .then(() => {
		      // console.log("new profile picture: ", newImageURL);
		      res();
		    })
		    .catch((error) => {
		      rej(error);
		    });
		  });
		};

		const checkAuth = authCheck();
		checkAuth
		.then(async (currentUser) => {
		  // save the url of the current photo
		  const existingPhotoURL = currentPhotoURL;

		  // new image url
			const imageURL = await uploadPhotoAsyncFire(currentUser.uid, newImage);
		  // console.log('found the new image URL: ', imageURL);

			const newImageURL = {
				photoURL: imageURL
			};

			try {
				// delete the old photo using the ref saved
		    if (existingPhotoURL) {
		      await deleteCurrentPhoto(existingPhotoURL, currentUser.uid, "main");
		    }
		    // Update photoURL to the new URL
		    await updateNewImage(newImageURL, currentUser.uid);
		    res();
			} 
			catch {(error) => {
				rej(error);
			}}
		})
	});
};

const uploadPhotoAsyncFire = async (userId, newImage) => {
  return new Promise(async (res, rej) => {
    const path = `profile/photos/${userId}/${newImage.id}`;
    const response = await fetch(newImage.uri);
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

const updateProfileCoverPhotoFire = (newImage, currentCoverPhotoURL = null) => {
	return new Promise ((res, rej) => {
		const updateCoverPhoto = (newImageURL, currentUserId) => {
		  return new Promise ((res, rej) => {
		    usersRef
		    .doc(currentUserId)
		    .set(newImageURL, {merge: true})
		    .then(() => {
		      // console.log("new cover photo: ", newImageURL);
		      res();
		    })
		    .catch((error) => {
		      rej(error);
		    });
		  });
		};

		const checkAuth = authCheck();
		checkAuth
		.then(async (currentUser) => {
		  // save the url of the current photo
		  const existingCoverPhotoURL = currentCoverPhotoURL;

		  // new image url
			const imageURL = await uploadPhotoAsyncFire(currentUser.uid, newImage);
		  // console.log('found the new image URL: ', imageURL);

			const newImageURL = {
				coverPhotoURL: imageURL
			};

			try {
				// delete the old photo using the ref saved
		    if (existingCoverPhotoURL) {
		      await deleteCurrentPhoto(existingCoverPhotoURL, currentUser.uid, "cover");
		    }
		    // Update photoURL to the new URL
		    await updateCoverPhoto(newImageURL, currentUser.uid);
		    res();
			} 
			catch {(error) => {
				rej(error);
			}}
		})
	});
};

const postUserSearchHistoryFire = (currentUserId, searchUserId) => {
	return new Promise ((res, rej) => {
		console.log("currentUserId: ", currentUserId, "searchUserId: ", searchUserId);
		const dateNow = Date.now();

		usersRef
		.doc(currentUserId)
		.collection("user_search_history")
		.doc(searchUserId)
		.set( 
			{
				suid: searchUserId,
				searchedAt: dateNow,
				deleted: false
			},
			{
				merge: true
			}
		)
		.then(() => {
			res();
		})
		.catch((error) => {
			rej(error);
		});
	});
};

const updateUsernameSearchHistoryStatus = (currentUserId, suid, status) => {
	return new Promise ((res, rej) => {
		console.log("currentUserId: ", currentUserId, "searchUserId: ", suid);

		usersRef
		.doc(currentUserId)
		.collection("user_search_history")
		.doc(suid)
		.set( 
			{
				deleted: true
			},
			{
				merge: true
			}
		)
		.then(() => {
			res();
		})
		.catch((error) => {
			rej(error);
		});
	});
}

export { 
	changeUserAppState, 
	postUserCurrentChat, 
	profileUpdateFire,
	updateProfilePhotoFire,
	updateProfileCoverPhotoFire,
	postUserSearchHistoryFire,
	updateUsernameSearchHistoryStatus
};
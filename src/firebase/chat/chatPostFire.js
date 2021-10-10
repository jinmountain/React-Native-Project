import Firebase from '../../firebase/config';
import firebase from 'firebase/app';

const db = Firebase.firestore();
const chatsRef = db.collection('chats');
const usersRef = db.collection('users');
const batch = db.batch();

const openChat = (theOtherUserId, currentUserId) => {
	return new Promise ((res, rej) => {
		try {
			let firstUserId;
			let secondUserId;

			theOtherUserId > currentUserId 
			? (firstUserId = theOtherUserId, secondUserId = currentUserId)
			: (secondUserId = theOtherUserId, firstUserId = currentUserId)

			const chatId = chatsRef.doc().id;
			const chatData = {
				firstUserId: firstUserId,
				secondUserId: secondUserId,
				// firstUserRef: db.doc('users/' + firstUserId),
				// secondUserRef: db.doc('users/' + secondUserId),
				firstUserNotificationCount: 0,
				secondUserNotificationCount: 0,
				users: [firstUserId, secondUserId],
				createdAt: Date.now()
			};
			chatsRef
			.doc(chatId)
			.set(chatData)

			console.log("chatPostFire: openChat: made a new chat room");
			res({ id: chatId, data: chatData });
		} catch {(error) => {
			console.log("chatPostFire: openChat: ", error);
			res(false);
		}}
	});
};

const uploadFileAsyncFire = (userId, fileId, fileType, uri, changeProgress) => {
  return new Promise(async (res, rej) => {
    let path;

    if (fileType === 'video') {
      path = `${userId}/chat/videos/${fileId}`;
    }
    else if (fileType === 'image') {
      path = `${userId}/chat/photos/${fileId}`;
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
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
        changeProgress(progress);
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

const sendMessageFire = (
	chatId,
	firstUserId,
	secondUserId,
	theOtherUserId, 
	currentUserId, 
	message, 
	files, 
	chosenDisplayPostUrls, 
	theOtherUserActive, 
	changeProgress
) => {
	const now = Date.now();

	const getFileURL = new Promise (async (res, rej) => {
		const fileURLs = []
		var i;
		for (i = 0; i < files.length; i++) {
			try {
				const URL = await uploadFileAsyncFire(
					currentUserId,
					files[i].id,
					files[i].type,
					files[i].uri,
					changeProgress
				);
				fileURLs.push({ type: files[i].type, url: URL });
			} catch {(error) => {
				console.log("Error occured: firebase: chatPostFire: sendMessageFire: getURL: ", error);
			}}
		};
		res(fileURLs);
	});

	return new Promise ((res, rej) => {
		let docId;

		if (files.length > 0) {
			getFileURL
			.then((fileURLs) => {
				var i;
				for (i = 0; i < fileURLs.length; i++) { 
					if (fileURLs[i].type === 'image') {
						chatsRef
						.doc(chatId)
						.collection('messages')
						.add({ image: fileURLs[i].url, uid: currentUserId, createdAt: now });
					}

					if (fileURLs[i].type === 'video') {
						chatsRef
						.doc(chatId)
						.collection('messages')
						.add({ video: fileURLs[i].url, uid: currentUserId, createdAt: now });
					}
				}
				res(true);
			})
			.catch((error) => {
				console.log("Error occured: firebase: chat: chatPostFire: sendMessageFire: getFileURL: ", error);
				res(true);
			});
		} 

		if (chosenDisplayPostUrls.length > 0) {
			var i;
			for (i = 0; i < chosenDisplayPostUrls.length; i++) {
				if (chosenDisplayPostUrls[i].type === 'image') {
					chatsRef
					.doc(chatId)
					.collection('messages')
					.add({ image: chosenDisplayPostUrls[i].url, uid: currentUserId, createdAt: now });
				}

				if (chosenDisplayPostUrls[i].type === 'video') {
					chatsRef
					.doc(chatId)
					.collection('messages')
					.add({ video: chosenDisplayPostUrls[i].url, uid: currentUserId, createdAt: now });
				}
			}
		};

		if (message.length > 0) {
			chatsRef
			.doc(chatId)
			.collection('messages')
			.add({ text: message, uid: currentUserId, createdAt: now });
		};
		
		// set new last message time and last message on the  chat doc
		// when message exists
		if (message.length > 0) {
			chatsRef
			.doc(chatId)
			.set(
				{ lastMessageTime: now, lastMessage: message }, 
				{ merge: true }
			);
		// else lastMessage is "Image"
		} else {
			chatsRef
			.doc(chatId)
			.set(
				{ lastMessageTime: now, lastMessage: "Image" }, 
				{ merge: true }
			);
		};

		// send push notification or not
		// make this into a function and use it whenever add a doc to chatsRef
		if (theOtherUserActive === false) {
			const countIncrement = firebase.firestore.FieldValue.increment(1);
			if (theOtherUserId === firstUserId) {
				chatsRef
				.doc(chatId)
				.set(
					{ firstUserNotificationCount: countIncrement },
					{ merge: true }
				)
			} else {
				chatsRef
				.doc(chatId)
				.set(
					{ secondUserNotificationCount: countIncrement },
					{ merge: true }
				)
			}

			usersRef
			.doc(theOtherUserId)
			.collection("notifications")
			.add({ 
				collection: "chats", 
				docId: chatId,
				text: message,
				senderId: currentUserId,
				senderRef: db.doc('users/' + currentUserId),
				createdAt: now 
			});
		};

		res(true);
	});
};

const enterOrLeaveChat = (theOtherUserId, currentUserId, chatId, status) => {
	if (theOtherUserId > currentUserId) {
		chatsRef
		.doc(chatId)
		.set({
			secondUserActive: status
		}, { merge: true });
	} else {
		chatsRef
		.doc(chatId)
		.set({
			firstUserActive: status
		}, { merge: true });
	}
};

const readChat = (chatId, whichUser) => {
	if (whichUser === "first") {
		chatsRef
		.doc(chatId)
		.set({
			firstUserNotificationCount: 0
		}, { merge: true });
	}

	if (whichUser === "second") {
		chatsRef
		.doc(chatId)
		.set({
			secondUserNotificationCount: 0
		}, { merge: true });
	}
};

export default { openChat, sendMessageFire, enterOrLeaveChat, readChat };
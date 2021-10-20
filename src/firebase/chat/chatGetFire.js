import Firebase from '../../firebase/config';
import firebase from 'firebase/app';

const db = Firebase.firestore();
const chatsRef = db.collection('chats');
const usersRef = db.collection('users');

const giveDateToCompare = (timestamp) => {
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

	var getNewTimeDate = new Date(timestamp);
  var newTimeYear = getNewTimeDate.getFullYear();
  var newTimeMonthIndex = getNewTimeDate.getMonth();
  var newTimeMonth = months[getNewTimeDate.getMonth()];
  var newTimeDate = getNewTimeDate.getDate();
  var newTimeDayIndex = getNewTimeDate.getDay();
  var newTimeDay = days[getNewTimeDate.getDay()];

  return { 
		year: newTimeYear,
		monthIndex: newTimeMonthIndex,
		month: newTimeMonth,
		date: newTimeDate,
		dayIndex: newTimeDayIndex,
		day: newTimeDay,
		timestamp: timestamp
	};
}

const timeCompare = (newTime, previousTimeDate) => {
	const newTimeDate = giveDateToCompare(newTime);
	if (previousTimeDate.year > newTimeDate.year) {
		return previousTimeDate
	} 
	else if (
		previousTimeDate.year === newTimeDate.year 
		&& previousTimeDate.monthIndex > newTimeDate.monthIndex
	) {
  	return previousTimeDate
  } 
  else if (
		previousTimeDate.year === newTimeDate.year 
		&& previousTimeDate.monthIndex === newTimeDate.monthIndex 
		&& previousTimeDate.date > newTimeDate.date
	) {
		return previousTimeDate
	} else {
		return false;
	}
};

const getChat = (theOtherUserId, currentUserId) => {
	return new Promise ((res, rej) => {
		let firstUserId;
		let secondUserId;

		theOtherUserId > currentUserId 
		? (firstUserId = theOtherUserId, secondUserId = currentUserId)
		: (secondUserId = theOtherUserId, firstUserId = currentUserId)

		chatsRef
		.where("firstUserId", "==", firstUserId)
		.where("secondUserId", "==", secondUserId)
		.get()
		.then((querySnapshot) => {
			if (querySnapshot.docs.length > 0) {
				querySnapshot.forEach((doc) => {
					console.log("chatPostFire: openChat: chat: ", doc.id);
					const chatId = doc.id;
					const chatData = doc.data();
					res({ id: chatId, data: chatData });
				});
			} else {
				res(null);
			}
		})
		.catch((error) => {
			console.log("Error occured: firebase: chat: chatPostFire: openChat: ", error);
			res(false);
		})
	});
};

const getMessages = (
	chatId, 
	theOtherUserId, 
	theOtherUserName, 
	theOtherUserPhotoURL, 
	appendMessages,
	setMessageLast,
	setMessageFetchSwitch,
	messageLast,
	dateToCompare,
	addDateToCompare,
	chatDeletedAt
) => {
	return new Promise ((res, rej) => {
		let chatsStartAfterRef;
		if (chatDeletedAt) {
			if (messageLast) {
				chatsStartAfterRef = chatsRef
				.doc(chatId)
				.collection('messages')
				.where("createdAt", ">", chatDeletedAt)
				.orderBy("createdAt", "desc")
				.startAfter(messageLast)
				console.log("startAfter lastMessage");
			} else {
				chatsStartAfterRef = chatsRef
				.doc(chatId)
				.collection('messages')
				.where("createdAt", ">", chatDeletedAt)
				.orderBy("createdAt", "desc")
			};
		} else {
			if (messageLast) {
				chatsStartAfterRef = chatsRef
				.doc(chatId)
				.collection('messages')
				.orderBy("createdAt", "desc")
				.startAfter(messageLast)
				console.log("startAfter lastMessage");
			} else {
				chatsStartAfterRef = chatsRef
				.doc(chatId)
				.collection('messages')
				.orderBy("createdAt", "desc")
			};
		}
		const limit = 30;
		chatsStartAfterRef
		.limit(limit)
		.get()
		.then((querySnapshot) => {
			const docLength = querySnapshot.docs.length;
			var lastVisible = querySnapshot.docs[docLength - 1];
			if (lastVisible !== undefined) {
				setMessageLast(lastVisible);
			} 
			// when docLength is shorter than limit it means no more docs available
			if (docLength < limit) {
				setMessageFetchSwitch(false);
				console.log("messageFetchSwitch >> off.");
			}

			// map is faster than forEach
			let localDateToCompare = dateToCompare;
			// store current date of each doc
			let currentDate;

			const messagesFirestore = querySnapshot.docs.map((doc) => {
				const docId = doc.id;
	    	const docData = doc.data();

	      let newMessage;
	      newMessage = { 
		    	_id: docId, 
		    	createdAt: docData.createdAt,
		    	sent: true,
		    }

		    // add name and avatar if the id is same as the other user
		    if (docData.uid === theOtherUserId) {
		    	newMessage.user = { 
	    			_id: docData.uid,
	    			name: theOtherUserName,
	    			avatar: theOtherUserPhotoURL
	    		}
		    } else {
		    	newMessage.user = { 
	    			_id: docData.uid
	    		}
		    }
		    // add text, image, or video
		    if (docData.text) {
		    	newMessage = { ...newMessage, ...{text: docData.text}}
		    }
	    	if (docData.image) {
	    		newMessage = { ...newMessage, ...{image: docData.image}}
	    	} 
	    	if (docData.video) {
	    		newMessage = { ...newMessage, ...{video: docData.video}}
	    	}

	    	// current doc's createdAt
	    	currentDate = docData.createdAt;
	    	
	    	// if localDateToCompare is null because dateToCompare input was null
	    	// assign localDateToCompare with currentDate, which is docData's createdAt
	    	if (localDateToCompare === null) {
	    		localDateToCompare = giveDateToCompare(currentDate);
	    	}
	    	
	    	// compare the docData's createdAt with localDateToCompare
	    	const timeCompareResult = timeCompare(docData.createdAt, localDateToCompare);
	    	// timeCompareResult return two different results, a json or false
	    	// return a json if it founds the new doc's createdAt is past of localDateToCompare

	    	// when timeCompareResult is a json, add the json to newMessage as dateSign
	    	// if timeCompareResult was not false add currentDate which is the earlier date to localDateToCompare
	    	if (timeCompareResult)
	    	{
	    		// add date sign to newMessage
	    		console.log("timeCompareResult: ", timeCompareResult);
	    		newMessage = { ...newMessage, ...{ dateSign: timeCompareResult }};

	    		// after add the date
	    		// assign the new date to the current date that is earlier so can keep comparing
	    		localDateToCompare = giveDateToCompare(currentDate);
	    	}
	    	// store the last doc's date in case of fetching more previous messages
	    	addDateToCompare(giveDateToCompare(currentDate));

	    	return newMessage;
			});
			appendMessages(messagesFirestore);
			res(true);
		});
	});
};

const getMessagesRealtime = (
	now,
	chatId, 
	theOtherUserId, 
	theOtherUserName, 
	theOtherUserPhotoURL, 
	appendMessages, 
	shouldListen,
) => {
	return chatsRef
	.doc(chatId)
	.collection('messages')
	.where('createdAt', ">=", now)
	.orderBy('createdAt', 'desc')
	.onSnapshot((querySnapshot) => {
		const messagesFirestore = querySnapshot
    .docChanges()
    .filter(({ type }) => type === 'added')
    .map(({ doc }) => {
    	const docId = doc.id;
    	const docData = doc.data();

      let newMessage;
      newMessage = { 
	    	_id: docId, 
	    	createdAt: docData.createdAt,
	    	sent: true,
	    }

	    // add name and avatar if the id is same as the other user
	    if (docData.uid === theOtherUserId) {
	    	newMessage.user = { 
    			_id: docData.uid,
    			name: theOtherUserName,
    			avatar: theOtherUserPhotoURL
    		}
	    } else {
	    	newMessage.user = { 
    			_id: docData.uid
    		}
	    }
	    // add text, image, or video
	    if (docData.text) {
	    	newMessage = { ...newMessage, ...{text: docData.text}}
	    }
    	if (docData.image) {
    		newMessage = { ...newMessage, ...{image: docData.image}}
    	} 
    	if (docData.video) {
    		newMessage = { ...newMessage, ...{video: docData.video}}
    	}

      return newMessage;
    })
    .sort((a, b) => b.createdAt - a.createdAt)
    if (shouldListen) {
		  appendMessages(messagesFirestore)
    }
	});
};

const getChatRealtime = (theOtherUserId, currentUserId, chatId, setChatDoc, shouldListen) => {
	return chatsRef
	.doc(chatId)
	.onSnapshot((doc) => {
		let chatDoc;
		const chatId = doc.id;
		const docData = doc.data();
		chatDoc = docData;

		if (docData.firstUserActive === true) {
			if (docData.firstUserId === theOtherUserId) {
				chatDoc = { 
					...chatDoc, 
					...{ theOtherUserActive: true }
				};
			} 
			if (docData.firstUserId === currentUserId) {
				chatDoc = { 
					...chatDoc, 
					...{ currentUserActive: true }
				};
			}
		} else {
			if (docData.firstUserId === theOtherUserId) {
				chatDoc = { 
					...chatDoc, 
					...{ theOtherUserActive: false }
				};
			} 
			if (docData.firstUserId === currentUserId) {
				chatDoc = { 
					...chatDoc, 
					...{ currentUserActive: false }
				};
			}
		}

		if (docData.secondUserActive === true) {
			if (docData.secondUserId === theOtherUserId) {
				chatDoc = { 
					...chatDoc, 
					...{ theOtherUserActive: true }
				};
			} 
			if (docData.secondUserId === currentUserId) {
				chatDoc = { 
					...chatDoc, 
					...{ currentUserActive: true }
				};
			}
		} else {
			if (docData.secondUserId === theOtherUserId) {
				chatDoc = { 
					...chatDoc, 
					...{ theOtherUserActive: false }
				};
			} 
			if (docData.secondUserId === currentUserId) {
				chatDoc = { 
					...chatDoc, 
					...{ currentUserActive: false }
				};
			}
		}

		if (shouldListen) {
			console.log("getChatRealtime: chatId: ", chatId);
			setChatDoc(chatDoc);
		}
	});
}

const getChatsUserInRealtime = (now, userId, addChatList, updateChatList) => {
	return chatsRef
	.where("users", "array-contains", userId)
	.where("lastMessageTime", ">=", now)
	.onSnapshot((querySnapshot) => {
		querySnapshot
    .docChanges()
    // map function didn't work for what I want to do
    // - want to have the user doc in the chat before append
    .forEach(async (change) => {
    	const docId = change.doc.id;
  		const docData = change.doc.data();
			let theOtherUserRef;
			let notificationCount;

			// assign user ref to theOtherUser
    	if (docData.firstUserId === userId) {
    		// the current user is the first user so the other user is the second user
    		theOtherUserRef = usersRef.doc(docData.secondUserId);
    		notificationCount = docData.firstUserNotificationCount;
    	} else {
    		theOtherUserRef = usersRef.doc(docData.firstUserId);
    		notificationCount = docData.secondUserNotificationCount;
    	}
    	// get theOtherUser data
    	const getTheOtherUserData = await theOtherUserRef.get();
    	const theOtherUserData = getTheOtherUserData.data();

    	// gather the data to the variable chat
    	const chat = { 
	    	_id: docId, 
	    	createdAt: docData.createdAt,
	    	firstUserId: docData.firstUserId,
	    	secondUserId: docData.secondUserId,
	    	lastMessageTime: docData.lastMessageTime, 
	    	lastMessage: docData.lastMessage,
	    	notificationCount: notificationCount,
	    	theOtherUser: {
	    		id: theOtherUserData.id,
	    		username: theOtherUserData.username,
	    		photoURL: theOtherUserData.photoURL,
	    		type: theOtherUserData.type,
	    	}
	    }

    	if (change.type === 'added') {
    		console.log("chat added");
    		updateChatList(chat);
    	}

    	if (change.type === 'modified') {
    		console.log("chat modified");
    		updateChatList(chat); ///CHECK THIS OUT TMORRROW
    	}

    	// if (change.type === 'removed') {
    	// 	removeChats(chat);
    	// }
    });
	});
};

const getChatsUserIn = 
	(
		userId,  
		setChatLast,
		setChatFetchSwitch,
		chatLast,  
		isFocused
	) => {
	return new Promise ((res, rej) => {;
		const userChats = []
		const limit = 13;
		try {
			let chatsStartAfterRef;
			if (chatLast) {
				chatsStartAfterRef = chatsRef
				.where("users", "array-contains", userId)
				.orderBy("lastMessageTime", "desc")
				.startAfter(chatLast)
				console.log("chatGetFire: getChatsUser: chatLast found");
			} else {
				chatsStartAfterRef = chatsRef
				.where("users", "array-contains", userId)
				.orderBy("lastMessageTime", "desc")
			};
			chatsStartAfterRef
			.limit(limit)
			.get()
			.then((querySnapshot) => {
				let docIndex = 0;
				const docLength = querySnapshot.docs.length;
				console.log(docLength);
				var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
				if (lastVisible !== undefined) {
					setChatLast(lastVisible);
				} 

				if (docLength < limit) {
					setChatFetchSwitch(false);
					console.log("chatFetchSwitch >> off.");
				}

				if (docLength > 0) {
					querySnapshot.forEach(async (chatDoc) => {
						const docId = chatDoc.id;
			    	const docData = chatDoc.data();
			    	let theOtherUserRef;
			    	let notificationCount;
			    	let chatDeleted = false;

			    	// check if user deleted chat
			    	if (docData.firstUserId === userId) {
			    		if (docData.firstUserDeleted) {
			    			chatDeleted = true;
			    		}
			    	} else {
			    		if (docData.secondUserDeleted) {
			    			chatDeleted = true;
			    		}
			    	};

			    	// if deleted don't add to userChats
			    	if (!chatDeleted) {
			    		// assign user ref to theOtherUser
				    	if (docData.firstUserId === userId) {
				    		// the current user is the first user so the other user is the second user
				    		theOtherUserRef = usersRef.doc(docData.secondUserId);
				    		notificationCount = docData.firstUserNotificationCount;
				    	} else {
				    		theOtherUserRef = usersRef.doc(docData.firstUserId);
				    		notificationCount = docData.secondUserNotificationCount;
				    	}
				    	// get theOtherUser data
				    	const getTheOtherUserData = await theOtherUserRef.get();
				    	const theOtherUserData = getTheOtherUserData.data();

				    	// gather the data to the variable chat
				    	const chat = { 
					    	_id: docId, 
					    	createdAt: docData.createdAt,
					    	firstUserId: docData.firstUserId,
					    	secondUserId: docData.secondUserId,
					    	lastMessageTime: docData.lastMessageTime, 
					    	lastMessage: docData.lastMessage,
					    	notificationCount: notificationCount,
					    	theOtherUser: {
					    		id: theOtherUserData.id,
					    		username: theOtherUserData.username,
					    		photoURL: theOtherUserData.photoURL,
					    		type: theOtherUserData.type,
					    	}
					    }
				    	userChats.push(chat);
			    	}
			    	
			    	docIndex += 1;
			    	if (docIndex === docLength) {
			    		res(userChats);
						}
					});
				} 
				else {
					res(userChats);
				};
			});
		} catch {(error) => {
			console.log(error);
			res(userChats);
		}};
	})
};

export default { getChat, getMessages, getMessagesRealtime, getChatRealtime, getChatsUserInRealtime, getChatsUserIn };
import createDataContext from './createDataContext';

// Firebase
import chatGetFire from '../firebase/chat/chatGetFire';
import chatPostFire from '../firebase/chat/chatPostFire';

const socialReducer = (state, action) => {
	switch (action.type) {
		case 'change_progress':
			return { ...state, progress: action.payload };

		case 'add_chat':
			return { ...state, chat: action.payload };
		case 'clear_chat':
			return { ...state, chat: null };
		case 'add_messages': 
			return { ...state, messages: [ ...state.messages, action.payload ] };
		case 'add_file':
			return { ...state, files: [...state.files, action.payload]};
		case 'cancel_file':
			return { ...state, files: [...state.files.filter((file) => file.id !== action.payload)] };
		case 'clear_files':
			return { ...state, files: [] };
		
		// display post
		case 'add_chosen_display_post_url':
			return { ...state, chosenDisplayPostUrls: [ ...state.chosenDisplayPostUrls, action.payload ] };
		case 'cancel_chosen_display_post_url':
			return { ...state, chosenDisplayPostUrls: [ ...state.chosenDisplayPostUrls.filter((post) => post.url !== action.payload)] };
		case 'clear_chosen_display_post_urls':
			return { ...state, chosenDisplayPostUrls: [] };

		// Messaging
		case 'append_messages':
			return { ...state, messages: [ ...action.payload, ...state.messages ] };
		case 'append_earlier_messages':
			return { ...state, messages: [ ...state.messages, ...action.payload,  ] };
		case 'clear_messages':
			return { ...state, messages: [] };
		case 'add_date_sign':
			return { ...state, dateSign: action.payload };
		case 'clear_date_sign':
			return { ...state, dateSign: null };

		// ChatListScreen
		case 'clear_chat_list':
			return { ...state, chatList: [] };
		case 'add_chat_list':
			return { ...state, chatList: [ ...state.chatList, ...action.payload ] };
		case 'update_chat_list':
			return { ...state, chatList: [ action.payload, ...state.chatList.filter((chat) => chat._id !== action.payload._id) ] }

		// Technician and Businesss
		// Technician Application
		case 'add_tech_app':
			return { ...state, techApps: [ ...state.techApps, ...action.payload ] };
		case 'remove_tech_app':
			return { ...state, techApps: [...state.techApps.filter((techApp) => techApp.id !== action.payload)] };
		case 'clear_tech_app':
			return { ...state, techApps: [] };

		// App State
		case 'add_app_state':
			return { ...state, appStateSocial: action.payload };

		case 'add_received_notification_response':
			return { ...state, receivedNotificationResponse: action.payload };

		default:
			return state;
	}
};

const openChat = dispatch => (theOtherUserId, currentUserId, isMounted) => {
	const openChatRoom = chatPostFire.openChat(theOtherUserId, currentUserId);
	openChatRoom
	.then((chat) => {
		if (isMounted) {
			dispatch({ type: 'add_chat', payload: chat });
		}
	})
	.catch((error) => {
		console.log("Error occured: SocialContext: openChat: openChatRoom: ", error);
	});
};

const addChat = dispatch => (chat, isMounted) => {
	if (isMounted) {
		dispatch({ type: 'add_chat', payload: chat });
		console.log("chat >> ", chat.id);
	}
};

const clearChat = dispatch => () => {
	dispatch({ type: 'clear_chat' });
	console.log("chat >> ", null);
};

const getMessages = dispatch => (chatId) => {
	return new Promise ((res, rej) => {
		const getMessages = chatGetFire.getMessages(chatId);
		getMessages
		.then((messages) => {
			dispatch({ type: 'add_messages', payload: messages });
		})
		.catch((error) => {
			console.log("Error occured: SocialContext: getMessages: getMessages: ", error);
		});
	});
};

const setMessages = dispatch => (message) => {
	dispatch({ type: 'add_messages', payload: message });
};

const sendMessage = dispatch => (chatId, currentUserId, message) => {
	chatPostFire.sendMessageFire(chatId, currentUserId, message);
};

const addFileChat = dispatch => (id, type, uri) => {
	dispatch({ type: 'add_file', payload: {id: id, type: type, uri: uri} });
};

const cancelFileChat = dispatch => (id) => {
	dispatch({ type: 'cancel_file', payload: id})
};

const changeProgress = dispatch => (progress) => {
	dispatch({ type: 'change_progress', payload: progress});
	console.log('Upload progress: ', progress);
};

const clearFiles = dispatch => () => {
	dispatch({ type: 'clear_files' });
	console.log('files >> []');
};

// help sending a user to a screen related to the notification
const addReceivedNotificationResponse = dispatch => (notification) => {
	dispatch({ type: 'add_received_notification_response', payload: notification});
	console.log("receivedNotificationResponse >> ", notification);
};

const addAppStateSocial = dispatch => (userId, appState) => {
	dispatch({ type: 'add_app_state', payload: appState });
	console.log(userId, ": appStateSocial >> ", appState);
}

const addChosenDisplayPostUrl = dispatch => (url) => {
	dispatch({ type: 'add_chosen_display_post_url', payload: url });
	console.log("addChosenDisplayPostUrl: chosenDisplayPostUrls >> ", url);
};

const cancelChosenDisplayPostUrl = dispatch => (url) => {
	dispatch({ type: 'cancel_chosen_display_post_url', payload: url });
	console.log("cancelChosenDisplayPostUrl: chosenDisplayPostUrls >> ", url);
};

const clearChosneDisplayPostUrls = dispatch => () => {
	dispatch({ type: 'clear_chosen_display_post_urls' });
	console.log("chosenDisplayPostUrls >> []");
};

// Messaging
const appendMessages = dispatch => (newMessages) => {
	dispatch({ type: 'append_messages', payload: newMessages });
	console.log("messages >> appended to back");
};

const appendEarlierMessages = dispatch => (previousMessages) => {
	dispatch({ type: 'append_earlier_messages', payload: previousMessages });
	console.log("messages >> appended to front");
};

const clearMessages = dispatch => () => {
	dispatch({ type: 'clear_messages' });
	console.log("messages >> []");
};

const addDateToCompare = dispatch => (currentDate) => {
	dispatch({ type: 'add_date_sign', payload: currentDate });
	// console.log("dateSign >> ", currentDate);
};

const clearDateToCompare = dispatch => () => {
	dispatch({ type: 'clear_date_sign' });
};

// ChatListScreen
const clearChatList = dispatch => () => {
	dispatch({ type: 'clear_chat_list' });
	console.log("chatList >> []");
};

const addChatList = dispatch => (chats) => {
	dispatch({ type: 'add_chat_list', payload: chats });
	console.log("chatList >> add");
};

const updateChatList = dispatch => (chats) => {
	dispatch({ type: 'update_chat_list', payload: chats });
	console.log("chatList >> update");
};

// Technician and Businesss
// Technician Application

const addTechApp = dispatch => (applications) => {
	dispatch({ type: 'add_tech_app', payload: applications });
	console.log("techApps >> added");
};

const removeTechApp = dispatch => (techAppId) => {
	dispatch({ type: 'remove_tech_app', payload: techAppId });
	console.log("techApps removed: ", techAppId)
}

const clearTechApp = dispatch => (applications) => {
	dispatch({ type: 'clear_tech_app' });
	console.log("techApps >> []");
}

export const { Provider, Context } = createDataContext(
	socialReducer,
	{
		changeProgress,

		// ChatScreen
		openChat,
		addChat,
		clearChat,
		sendMessage,
		setMessages,
		addFileChat,
		cancelFileChat,
		clearFiles,
		// display post 
		addChosenDisplayPostUrl,
		cancelChosenDisplayPostUrl,
		clearChosneDisplayPostUrls,

		// Messaging
		appendMessages,
		appendEarlierMessages,
		clearMessages,
		addDateToCompare,
		clearDateToCompare,

		// ChatListScreen
		clearChatList,
		addChatList,
		updateChatList,

		// Technician and Business
		// technician application
		addTechApp,
		removeTechApp,
		clearTechApp, 

		addReceivedNotificationResponse,

		addAppStateSocial
	},
	{ 
		progress: null,
		chat: null,
		messages: [],
		files: [],
		chosenDisplayPostUrls: [],

		// Messaging
		messages: [],
		dateToCompare: null,

		// ChatListScreen
		chatList: [],

		// Technician and Business
		// technician application
		techApps: [],

		// business schedule
		scheduleChartGrids: [],
		scheduleChartGridsCount: 0,

		appStateSocial: 'active',

		// current screen
		receivedNotificationResponse: null,
	}
);
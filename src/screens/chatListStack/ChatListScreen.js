import React, { useContext, useEffect, useState, useCallback } from 'react';
import { 
	View, 
	StyleSheet,
	RefreshControl,
	Image, 
	Text,  
	TouchableOpacity,
	Dimensions,
	FlatList,
	ScrollView, } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

// NPMs
import { SafeAreaView, } from 'react-native-safe-area-context';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import MainTemplate from '../../components/MainTemplate';
import SpinnerFromActivityIndicator from '../../components/ActivityIndicator';
import UserAccountHeaderForm from '../../components/accountScreen/UserAccountHeaderForm';
import ChatListDefault from '../../components/defaults/ChatListDefault';
import DefaultUserPhoto from '../../components/defaults/DefaultUserPhoto';

// Context
import { Context as AuthContext } from '../../context/AuthContext';
import { Context as SocialContext } from '../../context/SocialContext';

// Firebase
import chatGetFire from '../../firebase/chat/chatGetFire';
import chatPostFire from '../../firebase/chat/chatPostFire';

// Designs
import { Entypo } from '@expo/vector-icons';

// Color
import color from '../../color';

// expo icons
import expoIcons from '../../expoIcons';

// Hooks
import count from '../../hooks/count';
import { wait } from '../../hooks/wait';
import { isCloseToBottom } from '../../hooks/isCloseToBottom';
import { useIsFocused } from '@react-navigation/native';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const getModifiedTime = (timestamp) => {
	// three cases
	// when years are different from today
	// when date and month are different
	// when date and month are same
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	
	var todayNewDate = new Date();
	var todayYear = todayNewDate.getFullYear();
	var todayMonth = months[todayNewDate.getMonth()];
	var todayDate = todayNewDate.getDate();

	let time
	var getDate = new Date(timestamp);
	var year = getDate.getFullYear();
	var month = months[getDate.getMonth()];
	var date = getDate.getDate();
	var day = days[getDate.getDay()];
	var hour = getDate.getHours();
  var min = getDate.getMinutes();

  if (todayYear != year) {
  	time = month + '/' + day + '/' + year
  }
  else if (todayMonth != month) {
  	time = day + ', ' + month + ' ' + date
  }
  else if (todayDate != date) {
  	time = day + ', ' + month + ' ' + date
  }
  else {
	  var pmOrAm;
	  var normalHour;
  	if (hour > 12) {
	  	pmOrAm = 'PM';
	  	normalHour = hour - 12;
	  } else {
	  	pmOrAm = 'AM';
	  	normalHour = hour;
	  }
  	time = normalHour + ':' + min + ' ' + pmOrAm;
  }

	return time;
}

const ChatListScreen = ({ navigation }) => {
	const isFocused = useIsFocused();

	// Screen Controls
	const [ screenReady, setScreenReady ] = useState(false);

	// const [ chats, setChats ] = useState([]);
	const { state: { user }, accountRefresh } = useContext(AuthContext);
	const { 
		state: { chatList }, 
		clearChatList, 
		addChatList, 
		updateChatList, 
		deleteChat 
	} = useContext(SocialContext);

	// states for getChatsUser
	const [ chatLast, setChatLast ] = useState(null);
	const [ chatFetchSwitch, setChatFetchSwitch ] = useState(true);
	const [ chatFetchState, setChatFetchState ] = useState(false);

	// delete chat states
	const [ selectChatToDelete, setSelectChatToDelete ] = useState(false);
	// for convenience made two states to delete chats
	// - ids to remove chats from context
	// - chat jsons to delete chats from firestore
	const [ selectedChatIdsToDelete, setSelectedChatIdsToDelete ] = useState([]);
	const [ selectedChatsToDelete, setSelectedChatsToDelete ] = useState([]);

	useEffect(() => {
		const now = Date.now();
		let unsubscribeChatsUserIn
		if (isFocused) {
			unsubscribeChatsUserIn = chatGetFire.getChatsUserInRealtime(
				now,
				user.id,
				addChatList,
				updateChatList,
			);
		};
		return () => {
			// must unsubscribe if not causes a warning saying "can't perform a React state update on an unmounted component"
			if (unsubscribeChatsUserIn) {
				console.log("ChatListScreen: unsubscribeChatsUserIn");
				unsubscribeChatsUserIn()
			}
		};
	}, [isFocused])

 	// useFocusEffect(
  //   useCallback(() => {
  //   	if (chatFetchState === false && chatFetchSwitch === true) {
  //   		setChatFetchSwitch(true);
  //   		const getChatsUserIn = chatGetFire.getChatsUserIn(
		// 			user.id, 
		// 			setChatLast,
		// 			setChatFetchSwitch,
		// 			chatLast,  
		// 			isFocused
		// 		)
		// 		getChatsUserIn
		// 		.then((chatsFetched) => {
		// 			addChatList(chatsFetched);
		// 			if (chatsFetched) {
		// 				setScreenReady(true);
		// 			}
		// 			setChatFetchState(false);
		// 		})
  //   	}
  //     return () => {
  //     	clearChatList();
  //     }
  //   }, [])
  // );

  useEffect(() => {
  	if (chatFetchState === false && chatFetchSwitch === true) {
  		setChatFetchSwitch(true);
  		const getChatsUserIn = chatGetFire.getChatsUserIn(
				user.id, 
				setChatLast,
				setChatFetchSwitch,
				chatLast,  
				isFocused
			)
			getChatsUserIn
			.then((chatsFetched) => {
				addChatList(chatsFetched);
				if (chatsFetched) {
					setScreenReady(true);
				}
				setChatFetchState(false);
			})
  	}
    return () => {
    	clearChatList();
    	setScreenReady(false);
    	setChatLast(null);
    	setChatFetchSwitch(true);
    	setChatFetchState(false);

    	setSelectChatToDelete(false);
    	setSelectedChatIdsToDelete([]);
    	setSelectedChatsToDelete([]);
    }
  }, []);

	return (
		screenReady && chatList.length > 0
		?
		<View style={styles.mainContainer}>
			{
				selectChatToDelete
				?
				<UserAccountHeaderForm
					addPaddingTop={true}
				  leftButtonTitle={`${selectedChatIdsToDelete.length} Selected`}
	      	leftButtonIcon={null}
				  leftButtonPress={null}
					username={null}
					title={null}
					firstIcon={
						"Delete"
					}
					secondIcon={
						"Cancel"
					}
					firstOnPress={() => {
						deleteChat(selectedChatIdsToDelete);
						setSelectedChatIdsToDelete([]);
						setSelectChatToDelete(false);

						chatPostFire.deleteChat(selectedChatsToDelete);
					}}
					secondOnPress={() => {
						setSelectChatToDelete(!selectChatToDelete);
					}}
				/>
				:
				<UserAccountHeaderForm
					addPaddingTop={true}
					leftButtonIcon={expoIcons.chevronBack(RFValue(27), color.black1)}
					leftButtonPress={() => { navigation.goBack() }}
					username={user.username}
					firstIcon={
						expoIcons.antdesignBars(RFValue(27), color.black1)
					}
					secondIcon={
						expoIcons.entypoNewMessage(RFValue(27), color.black1)
					}
					firstOnPress={() => {
						setSelectChatToDelete(!selectChatToDelete);
					}}
					secondOnPress={() => {
						navigation.navigate("WriteNewMessage");
					}}
				/>
			}
			<FlatList
        onEndReached={() => {
          if (chatFetchState === false && chatFetchSwitch === true) {
          	setChatFetchState(true);
          	const getChatsUserIn = chatGetFire.getChatsUserIn(
							user.id, 
							addChatList, 
							setChatLast,
							setChatFetchSwitch,
							chatLast,  
							isFocused
						)
						getChatsUserIn
						.then((chatsFetched) => {
							addChatList(chatsFetched);
							setChatFetchState(false);
						});
          }
        }}
        
        // JSON of chat
     		// const chat = { 
		    // 	_id: docId, 
		    // 	createdAt: docData.createdAt,
		    // 	firstUserId: docData.firstUserId,
		    // 	secondUserId: docData.secondUserId,
		    // 	lastMessageTime: docData.lastMessageTime, 
		    // 	lastMessage: docData.lastMessage,
		    // 	notificationCount: notificationCount,
		    // 	theOtherUser: {
		    // 		id: theOtherUserData.id,
		    // 		username: theOtherUserData.username,
		    // 		photoURL: theOtherUserData.photoURL,
		    // 		type: theOtherUserData.type,
		    // 	}
		    // }

        onEndReachedThreshold={0.01}
        vertical
        showsVerticalScrollIndicator={true}
        data={chatList}
        keyExtractor={(chat, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <View style={styles.chatContainer}>
            	{
            		selectChatToDelete &&
            		<View style={styles.selectChatButtonContainer}>
            			{
            				selectedChatIdsToDelete.includes(item._id)
            				?
	              		<TouchableOpacity
	              			style={styles.selectChatButton}
	              			onPress={() => {
	              				setSelectedChatIdsToDelete([ ...selectedChatIdsToDelete.filter((chatId) => chatId !== item._id) ]);
	              				setSelectedChatsToDelete([ ...selectedChatsToDelete.filter((chat) => item) ]);
	              			}}
	              		>
	              			{expoIcons.mcCheckCircle(RFValue(27), color.black1)}
	              		</TouchableOpacity>
	              		:
	              		<TouchableOpacity
	              			style={styles.selectChatButton}
	              			onPress={() => {
	              				setSelectedChatIdsToDelete([ ...selectedChatIdsToDelete, item._id ]);
	              				setSelectedChatsToDelete([ ...selectedChatsToDelete, item ]);
	              			}}
	              		>
	              			{expoIcons.mcCheckBoxBlankCircle(RFValue(27), color.black1)}
	              		</TouchableOpacity>
              		}
              	</View>
            	}
              <TouchableOpacity 
              	style={styles.enterChatContainer}
                onPress={() => {
                  navigation.navigate('Chat',
                  {
                    theOtherUser: item.theOtherUser
                  });
                }}
              >
                <View style={styles.userPhotoContainer}>
                  { 
                  	item.theOtherUser && item.theOtherUser.photoURL
                  	?
                    <Image 
                      source={{uri: item.theOtherUser.photoURL}}
                      style={styles.userPhoto}
                    />
                    :
                    <DefaultUserPhoto 
		                  customSizeBorder={RFValue(57)}
		                  customSizeUserIcon={RFValue(40)}
		                />
                  }
                </View>
                <View style={styles.chatInfoContainer}>
                	<View style={styles.upperCompartment}>
                		<View style={styles.usernameContainer}>
	                    { item.theOtherUser && 
	                      <Text 
		                      numberOfLines={1} 
		                      style={styles.usernameText}
		                    >
	                      	{item.theOtherUser.username}
	                      </Text>
	                    }
	                  </View>
	                  <View style={styles.lastTimeContainer}>
	                    { item.lastMessageTime && 
	                      <Text style={styles.timeText}>{getModifiedTime(item.lastMessageTime)}</Text>
	                    }
	                  </View>
                	</View>
                	<View style={styles.bottomCompartment}>
	                  <View style={styles.lastMessageContainer}>
	                    { 
	                    	item.lastMessage.length > 0 && 
	                      <Text 
	                      	style={styles.lastMessageText}
	                      	numberOfLines={1}
	                      >
	                      	{item.lastMessage}
	                      </Text>
	                    }
	                  </View>
	                  <View style={styles.notificationCountContainer}>
	                    { item.notificationCount > 0 && 
                    		<View style={styles.notificationCount}>
                      		<Text 
                      			style={styles.notificationCountText}
                      			numberOfLines={1}
                      		>
                      			{item.notificationCount}
                      		</Text>
                      	</View>
	                    }
	                  </View>
	                </View>
                </View>
              </TouchableOpacity>
            </View>
          )
        }}
      />
		</View>
		: screenReady
		?
		<View style={styles.mainContainer}>
			<UserAccountHeaderForm
				leftButtonIcon={expoIcons.ioniconsMdArrowBack(RFValue(27), color.black1)}
				leftButtonPress={() => { navigation.goBack() }}
				username={user.username}
				secondIcon={
					expoIcons.entypoNewMessage(RFValue(27), color.black1)
				}
				secondOnPress={() => {
					navigation.navigate("WriteNewMessage");
				}}
			/>
			<View style={styles.noChatMainContainer}>
				<View style={styles.noChatTitleContainer}>
					<Text style={styles.noChatTitleText}>Send a message,</Text>
					<Text style={styles.noChatTitleText}>Ask about a design</Text>
				</View>
				<View style={styles.noChatMessageContainer}>
					<Text style={styles.noChatMessageText}>Direct Messages are private converstaions between you and other people on Wonder. Ask about designs and more!</Text>
				</View>
				<View style={styles.writeNewMessageButtonContainer}>
					<TouchableOpacity
						style={styles.writeNewMessageButton}
						onPress={() => {
							navigation.navigate("WriteNewMessage");
						}}
					>
						<View style={styles.writeNewMessageButtonInner}>
							<Text style={styles.writeNewMessageButtonText}>Write a message</Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
		</View>
		: 
		<ChatListDefault />
	);
};

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		backgroundColor: color.white1,
	},
	chatContainer: {
		flexDirection: 'row',
		height: RFValue(77),
		backgroundColor: color.white2,
	},
	enterChatContainer: {
		flexDirection: 'row',
		flex: 1,
	},
	selectChatButtonContainer: {
		paddingHorizontal: RFValue(15),
		justifyContent: 'center',
		alignItems: 'center'
	},
	selectChatButton: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	userPhotoContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		height: RFValue(77),
		width: RFValue(77),
	},
	userPhoto: {
		height: RFValue(57),
		width: RFValue(57),
		borderRadius: RFValue(17),
	},
	chatInfoContainer: {
		flex: 1,
		justifyContent: 'center',
	},
	upperCompartment: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginRight: RFValue(3),
	},
	usernameText: {
		fontSize: RFValue(17),
		fontWeight: 'bold',
	},
	timeText: {
		fontSize: RFValue(13),
		color: color.grey3,
	},
	lastMessageText: {
		fontSize: RFValue(15)
	},
	notificationCountText: {
		fontSize: RFValue(13)
	},
	bottomCompartment: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginRight: RFValue(3),
	},
	notificationCountContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		width: RFValue(77),
	},
	notificationCount: {
		paddingHorizontal: RFValue(7),
		backgroundColor: color.yellow1,
		borderRadius: RFValue(33),
		justifyContent: 'center',
		alignItems: 'center',
	},

	deleteChatHeaderContainer: {
		justifyContent: 'center',
    backgroundColor: '#FFF',
    height: RFValue(70),
	},
	deleteChatHeaderInner: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	deleteChatNumSelected: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: RFValue(11)
	},
	deleteChatNumSelectedText: {
		fontSize: RFValue(17),
		fontWeight: 'bold'
	},

	deleteChatHeaderButtonContainer: {
		flexDirection: 'row',
	},
	deleteChatButton: {
		paddingHorizontal: RFValue(11),
		justifyContent: 'center',
		alignItems: 'center',
	},
	deleteChatButtonText: {
		fontSize: RFValue(17),
		fontWeight: 'bold'
	},

	noChatMainContainer: {
		flex: 1,
		backgroundColor: color.white1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	noChatTitleContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: RFValue(20),
		paddingVertical:RFValue(11)
	},
	noChatTitleText: {
		fontSize: RFValue(23),
		fontWeight: 'bold',
	},
	noChatMessageContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: RFValue(25),
	},
	noChatMessageText: {
		fontSize: RFValue(17),
		color: color.grey3
	},
	writeNewMessageButtonContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: RFValue(20),
	},
	writeNewMessageButton: {
		borderRadius: RFValue(30),
		height: RFValue(50),
		borderWidth: RFValue(0.5),
		borderColor: color.black2,
		backgroundColor: color.black2,
		justifyContent: 'center',
		alignItems: 'center',
		padding: RFValue(15)
	},
	writeNewMessageButtonText: {
		color: color.white1,
		fontSize: RFValue(17),
		fontWeight: 'bold'
	}
});

export default ChatListScreen;
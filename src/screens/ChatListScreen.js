import React, { useContext, useEffect, useState } from 'react';
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
import MainTemplate from '../components/MainTemplate';
import SpinnerFromActivityIndicator from '../components/ActivityIndicator';
import UserAccountHeaderForm from '../components/profilePage/UserAccountHeaderForm';
import ChatListDefault from '../components/defaults/ChatListDefault';

// Context
import { Context as AuthContext } from '../context/AuthContext';
import { Context as SocialContext } from '../context/SocialContext';

// Firebase
import chatGetFire from '../firebase/chat/chatGetFire';

// Designs
import { Entypo } from '@expo/vector-icons';

// Color
import color from '../color';

// Hooks
import { kOrNo } from '../hooks/kOrNo';
import { wait } from '../hooks/wait';
import { isCloseToBottom } from '../hooks/isCloseToBottom';
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
	const [ tryGetChats, setTryGetChats ] = useState(false);

	// const [ chats, setChats ] = useState([]);
	const { state: { user }, accountRefresh } = useContext(AuthContext);
	const { state: { chatList }, clearChatList, addChatList, updateChatList } = useContext(SocialContext);

	// states for getChatsUser
	const [ chatLast, setChatLast ] = useState(null);
	const [ chatFetchSwitch, setChatFetchSwitch ] = useState(true);
	const [ chatFetchState, setChatFetchState ] = useState(false);

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

 	useFocusEffect(
    React.useCallback(() => {
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
						setTryGetChats(true);
					}
					setChatFetchState(false);
				})
    	}
      return () => clearChatList();
    }, [])
  );

	return (
		<MainTemplate>
		{ 
			tryGetChats
			?
			<View style={styles.mainContainer}>
				<UserAccountHeaderForm
					goBack={() => { navigation.goBack() }}
					username={null}
					title={"Chats"}
				/>
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
              <TouchableOpacity 
                style={styles.chatContainer}
                onPress={() => {
                  navigation.navigate('Chat',
                  {
                    theOtherUser: item.theOtherUser
                  });
                }}
              >
                <View style={styles.userPhotoContainer}>
                  { item.theOtherUser && 
                    <Image 
                      source={{uri: item.theOtherUser.photoURL}}
                      style={styles.userPhoto}
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
	                    { item.lastMessage.length > 0 && 
	                      <Text numberOfLines={1}>{item.lastMessage}</Text>
	                    }
	                  </View>
	                  <View style={styles.notificationCountContainer}>
	                    { item.notificationCount > 0 && 
                    		<View style={styles.notificationCount}>
                      		<Text numberOfLines={1}>{item.notificationCount}</Text>
                      	</View>
	                    }
	                  </View>
	                </View>
                </View>
              </TouchableOpacity>
            )
          }}
        />
			</View>
			: 
			<ChatListDefault />
		}
		</MainTemplate>
	);
};

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},
	chatContainer: {
		flexDirection: 'row',
		height: RFValue(77),
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
		color: color.gray3,
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
});

export default ChatListScreen;
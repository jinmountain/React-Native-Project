import React, { useState, useContext, useEffect, useCallback } from 'react'
import { 
	View, 
	Text, 
	TouchableOpacity,
	TouchableHighlight,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	StyleSheet, 
	Platform, 
	Keyboard, 
	Image,
	FlatList,
	Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// NPMs
import { SafeAreaView, } from 'react-native-safe-area-context';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import SpinnerFromActivityIndicator from '../components/ActivityIndicator';
import MainTemplate from '../components/MainTemplate';
import { HeaderForm } from '../components/HeaderForm';
import ChatBox from '../components/chat/ChatBox';
import CancelButton from '../components/CancelButton';
import UserAccountHeaderForm from '../components/profilePage/UserAccountHeaderForm';
import MultiplePhotosIndicator from '../components/MultiplePhotosIndicator';
import ChatScreenDefault from '../components/defaults/ChatScreenDefault';
import DisplayPostsDefault from '../components/defaults/DisplayPostsDefault';
// Display Post
import DisplayPostImage from '../components/displayPost/DisplayPostImage';
import DisplayPostInfo from '../components/displayPost/DisplayPostInfo';
import DisplayPostLoading from '../components/displayPost/DisplayPostLoading';

// Context
import { Context as AuthContext } from '../context/AuthContext';
import { Context as SocialContext } from '../context/SocialContext';
import { Context as PostContext } from '../context/PostContext';

// Firebase
import chatGetFire from '../firebase/chat/chatGetFire';
import chatPostFire from '../firebase/chat/chatPostFire';
import contentGetFire from '../firebase/contentGetFire';

// Designs
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

// Hooks
import useImage from '../hooks/useImage';
// import useGetMessagesRealtime from '../hooks/useGetMessagesRealtime';
import { kOrNo } from '../hooks/kOrNo';
import { useIsFocused } from '@react-navigation/native';

// Color
import color from '../color';

// expo icons
import expoIcons from '../expoIcons';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const ChatScreen = ({ route, navigation }) => {
	const now = Date.now();
	const isFocused = useIsFocused();
	const [ pickImage ] = useImage();
	const { theOtherUser } = route.params;

	// Screen Controls
	const [ tryGetChat, setTryGetChat ] = useState(false);
	const [ chatExist, setChatExist ] = useState(false);
	// const [ chat, setChat ] = useState(null);

	const [ sendButtonColor, setSendButtonColor ] = useState(getRandomColor());
	// text input
	const [ message, setMessage ] = useState('');

	const [ messageLast, setMessageLast ] = useState(null);
	const [ messageFetchSwitch, setMessageFetchSwitch ] = useState(true);
	const [ messageFetchState, setMessageFetchState ] = useState(false);

	// realtime chat doc
	const [ chatDoc, setChatDoc ] = useState(null);

	// 
	const [ keyboardAvoidingViewFlex, setKeyboardAvoidingViewFlex ] = useState(false);
	const [ showExtendedActions, setShowExtendedActions ] = useState(false);
	const [ isKeyboardVisible, setIsKeyboardVisible ] = useState(false);

	// Contexts
	const { state: { user } } = useContext(AuthContext);

	// progress bar
	const [ progress, setProgress ] = useState(null);
	const { 
		state: { 
			chat,

			files,
			chosenDisplayPostUrls,

			appStateSocial,

			// Messaging
			messages,
			dateToCompare,
		}, 
		addChat,
		openChat, 
		clearChat,
		cancelFileChat, 
		// changeProgress, 
		clearFilesChat,
		// chosen display post urls
		addChosenDisplayPostUrl,
		cancelChosenDisplayPostUrl,
		clearChosenDisplayPostUrls,
		// Messaging
		appendMessages,
		appendEarlierMessages,
		clearMessages,
		addDateToCompare,
		clearDateToCompare,

	} = useContext(SocialContext);

	const { 
		state: { 
			chatScreenDisplayPostLast
		}, 
		addChatScreenDisplayPostLast,
		clearChatScreenDisplayPostLast,
	} = useContext(PostContext);

	const [ userAccountDisplayPosts, setUserAccountDisplayPosts ] = useState([]);
	const [ userAccountDisplayPostFetchSwitch, setUserAccountDisplayPostFetchSwtich ] = useState(true);
	const [ userAccountDisplayPostState, setUserAccountDisplayPostState ] = useState(false);
	// const [ chatId, setChatId ] = useState('');

	const [ displayPostsShown, setDisplayPostsShown ] = useState(false);
	// store chosen display post url
	// const [ chosenDisplayPostUrl, setChosenDisplayPostUrl ] = useState('');

	useEffect(() => {
		let isMounted = true;
		if (theOtherUser) {
			const getChat = chatGetFire.getChat(theOtherUser.id, user.id);
			getChat
			.then((chatFound) => {
				if (chatFound) {
					addChat(chatFound, isMounted)
					setChatExist(true);
					const getMessages = chatGetFire.getMessages(
		    		chatFound.id, 
		    		theOtherUser.id, 
		    		theOtherUser.name, 
		    		theOtherUser.photoURL, 
		    		appendEarlierMessages,
		    		setMessageLast,
						setMessageFetchSwitch,
						messageLast,
						dateToCompare,
						addDateToCompare,
		    	);
		    	if (messageFetchSwitch && messageFetchState === false) {
		    		setMessageFetchState(true);
		    		getMessages
			    	.then(() => {
			    		setMessageFetchState(false);
			    	});
		    	} else {
						console.log(
							"messageFetchSwitch: " 
							+ messageFetchSwitch
							+ "messageFetchState: "
							+ messageFetchState
						);
					}
		    	// find current user is first or second user 
		    	// check notification count if it is bigger than 0 then make it 0
		    	if (theOtherUser.id > user.id) {
		    		// current user is second
		    		if (chatFound.data.secondUserNotificationCount > 0) {
		    			chatPostFire.readChat(chatFound.id, "second");
		    		}
		    	} else {
		    		if (chatFound.data.firstUserNotificationCount > 0) {
		    			chatPostFire.readChat(chatFound.id, "first");
		    		}
		    	}

		    	// get theOtherUser's display posts if theOtherUser is business
		    	if (theOtherUser && theOtherUser.type === 'business' && userAccountDisplayPostFetchSwitch && !userAccountDisplayPostState) {
						isMounted && setUserAccountDisplayPostState(true);
						const getDisplayPosts = contentGetFire.getBusinessDisplayPostsFire(null, theOtherUser, user.id);
						getDisplayPosts
						.then((posts) => {
							isMounted && setUserAccountDisplayPosts([ ...userAccountDisplayPosts, ...posts.fetchedPosts ]);
							if (posts.lastPost !== undefined) {
								isMounted && addChatScreenDisplayPostLast(posts.lastPost);
							} else {
								isMounted && setUserAccountDisplayPostFetchSwtich(false);
							};
							isMounted && setUserAccountDisplayPostState(false);
						})
					}
				} else {
					addChat(null);
					setChatExist(false);
					setMessageFetchSwitch(false);
					console.log('ChatScreen: existing chat not found');
				}
				setTryGetChat(true);
			})
			.catch((error) => {
				console.log("ChatScreen: chatGetFire: getChat: ", error);
			});
		};
		return () => { 
    	isMounted = false
    	setMessage('');
    	clearMessages(); 
    	setMessageLast(null);
    	setMessageFetchSwitch(true);
    	setMessageFetchState(false);
    	clearDateToCompare();
    	clearFilesChat();
    	clearChosenDisplayPostUrls();
    	clearChat();

    	// diplay post states
    	setUserAccountDisplayPosts([]);
			setUserAccountDisplayPostFetchSwtich(true);
			setUserAccountDisplayPostState(false);
			clearChatScreenDisplayPostLast();
    }
	}, [theOtherUser]);

	// get new messages realtime and get the current chat doc realtime
	useEffect(() => {
		let unsubscribeMessages;
		if (isFocused && chat) {
			console.log("start listening messages");
			unsubscribeMessages = chatGetFire.getMessagesRealtime(
				now,
				chat.id, 
				theOtherUser.id, 
				theOtherUser.username, 
				theOtherUser.photoURL, 
				appendMessages,
				isFocused,
			);
		}

		return () => {
			// must unsubscribe if not causes a warning saying "can't perform a React state update on an unmounted component"
			if (unsubscribeMessages) {
				console.log("ChatScreen: unsubscribedMessages");
				unsubscribeMessages()
			}
		};
	}, [chat]);

	useEffect(() => {
		let unsubscribeChatDoc;
		if (isFocused && chat) {
			unsubscribeChatDoc = chatGetFire.getChatRealtime(
				theOtherUser.id, 
				user.id, 
				chat.id, 
				setChatDoc, 
				isFocused
			);
		}

		return () => {
			// must unsubscribe if not causes a warning saying "can't perform a React state update on an unmounted component"
			if (unsubscribeChatDoc) {
				console.log("ChatScreen: unsubscribeChatDoc");
				unsubscribeChatDoc()
			}
		};
	}, [chat]);

	// listen keyboard open close
	useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = () => {
  	setShowExtendedActions(false);
  	setIsKeyboardVisible(true);
  };

  const _keyboardDidHide = () => {
  	setIsKeyboardVisible(false);
  };

  // wrtie chat doc when appStateSocial and isFocused change
  useEffect(() => {
  	console.log("ChatScreen: appStateSocial: ", appStateSocial);
  	if (chat) {
  		if (isFocused && appStateSocial === 'active') {
	  		chatPostFire.enterOrLeaveChat(theOtherUser.id, user.id, chat.id, true);
	  		console.log("chat active");
	  	} else {
	  		chatPostFire.enterOrLeaveChat(theOtherUser.id, user.id, chat.id, false)
	  		console.log("chat inactive");
	  	}
  	}

  	return () => {
    	if (chat) {
		  	chatPostFire.enterOrLeaveChat(theOtherUser.id, user.id, chat.id, false);
    	}
    };
  }, [appStateSocial, chat]);

  if (tryGetChat) {
		return (
			<MainTemplate>
				<UserAccountHeaderForm
					leftButtonIcon={expoIcons.ioniconsMdArrowBack(RFValue(27), color.black1)}
					leftButtonPress={() => { navigation.goBack() }}
					userActiveState={
						chatDoc && chatDoc.theOtherUserActive
						?
						<Entypo name="dot-single" size={RFValue(27)} color={sendButtonColor} />
						:
						<Entypo name="dot-single" size={RFValue(27)} color={color.grey4} />
					}
					username={theOtherUser.username}
					title={null}
					firstIcon={
						theOtherUser.type === 'business'
						? <Feather name="menu" size={RFValue(23)} color={displayPostsShown ? color.blue1 : color.black1} />
						: null
					}
					secondIcon={
						theOtherUser.type === 'business'
						? <Feather name="shopping-bag" size={RFValue(28)} color={color.black1} />
						: null
					}
					firstOnPress={
						() => {
							setDisplayPostsShown(!displayPostsShown);
						}
					}
					secondOnPress={
						null
					}
				/>
				<KeyboardAvoidingView 
					style={{ flex: 1 }} 
					behavior={Platform.OS == "ios" ? "padding" : "height"}
				>
					{
						// progress bar
						progress &&
						<View style={{ width: '100%', minHeight: '1%' }}>
							<View style={{ 
								width: `${progress}%`, 
								minHeight: '1%', 
								backgroundColor: sendButtonColor,
								borderTopRightRadius: RFValue(3),
								borderBottomLeftRadius: RFValue(3)
							}}>
							</View>
						</View>
					}
					{
						// Message Fetch State
						// show loading spinner when getting earlier messages
						messageFetchState
						?
						<View style={styles.loadingSpinnerContainer}>
							<SpinnerFromActivityIndicator
								customColor={sendButtonColor}
							/>
						</View>
						:
						null
					}
					{ 
						// show display posts if the other user is business and displayPostsShown is true
						theOtherUser.type === 'business' && displayPostsShown && userAccountDisplayPosts.length > 0 
						?
						<View style={styles.displayPostsContainer}>
							<FlatList
								onEndReached={() => {
									let isMounted = true;
									if (theOtherUser && theOtherUser.type === 'business' && userAccountDisplayPostFetchSwitch && !userAccountDisplayPostState) {
										isMounted && setUserAccountDisplayPostState(true);
										const getDisplayPosts = contentGetFire.getBusinessDisplayPostsFire(chatScreenDisplayPostLast, theOtherUser, user.id);
										getDisplayPosts
										.then((posts) => {
											isMounted && setUserAccountDisplayPosts([ ...userAccountDisplayPosts, ...posts.fetchedPosts ]);
											if (posts.lastPost !== undefined) {
												isMounted && addChatScreenDisplayPostLast(posts.lastPost);
											} else {
												isMounted && setUserAccountDisplayPostFetchSwtich(false);
											};
											isMounted && setUserAccountDisplayPostState(false);
										})
									}
									return () => {
										isMounted = false;
									}
								}}
								onEndReachedThreshold={0.01}
		            horizontal
		            showsHorizontalScrollIndicator={false}
		            data={userAccountDisplayPosts}
		            keyExtractor={(displayPost, index) => index.toString()}
		            renderItem={({ item }) => {
		              return (
		                <TouchableOpacity 
		                  style={styles.postImageContainer}
		                  onPress={() => {
		                  	if (chosenDisplayPostUrls.includes(item.data.files[0])) {
		                  		cancelChosenDisplayPostUrl(item.data.files[0].url)
		                  	} else {
			                  	addChosenDisplayPostUrl(item.data.files[0]);
		                  	}
		                  }}
		                >
			                <DisplayPostImage
			                	type={item.data.files[0].type}
			                	url={item.data.files[0].url}
			                	imageWidth={windowWidth/2}
			                />
			                <DisplayPostInfo
			                	taggedCount={kOrNo(item.data.taggedCount)}
			                	title={item.data.title}
			                	likeCount={kOrNo(item.data.like)}
			                	etc={item.data.etc}
			                	price={item.data.price}
			                	containerWidth={windowWidth/2}
			                />
			                { item.data.files.length > 1
			                	? <MultiplePhotosIndicator
			                			size={RFValue(24)}
			                		/>
			                	: null
			                }
			                { 
			                	chosenDisplayPostUrls.includes(item.data.files[0])
			                	?
			                	<View style={styles.chosenStatus}>
				                	<View style={styles.chosenShadow}>
				                	
					                </View>
					                <View style={styles.chosenCheck}>
					                	<AntDesign name="checkcircle" size={RFValue(23)} color={color.blue1} />
					                </View>
					              </View>
					              : null
			                }
		                </TouchableOpacity>
		              )
		            }}
		          />
							{ 
								userAccountDisplayPostState
								?
								<View style={styles.displayPostLoadingContainer}>
									<DisplayPostLoading customColor={sendButtonColor}/>
								</View>
								: 
								null
							}
						</View>
						: theOtherUser.type === 'business' && displayPostsShown && userAccountDisplayPosts.length === 0
						?
							<DisplayPostsDefault/>
						: null
					}
					
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<View style={styles.innerContainer}>
							<ChatBox
								sendButtonColor={sendButtonColor}
								pickImage={() => {
									pickImage('chat');
								}}
								onPressShort={(item) => {
			    				item.image
			    				?
			    				navigation.navigate('ImageZoomin', 
                  {
                    file: {
                      type: "image",
                      url: item.image
                    }
                  })
                  : item.video
                  ?
                  navigation.navigate('ImageZoomin', 
                  {
                    file: {
                      type: "video",
                      url: item.video
                    }
                  })
                  : null
			    			}}
								showExtendedActions={showExtendedActions}
								setShowExtendedActions={setShowExtendedActions}
								isKeyboardVisible={isKeyboardVisible}
								files={files}
								messages={ messages }
								userId={ user.id }
								theOtherUserPhotoURL={ theOtherUser.photoURL }
								message={ message }
								setMessage={ setMessage }
								onSend={() => {
									// when chat does not exist make chat first then send
									if (message.length > 0 || files.length > 0 || chosenDisplayPostUrls.length > 0 ) {
										if (tryGetChat && chat === null) {
											const openChat = chatPostFire.openChat(theOtherUser.id, user.id)
											openChat
											.then((chat) => {
												addChat(chat, true);
												chatPostFire.sendMessageFire(
									 				chat.id,
									 				chat.data.firstUserId,
									 				chat.data.secondUserId,
									 				theOtherUser.id, 
									 				user.id, 
									 				message, 
									 				files, 
									 				chosenDisplayPostUrls, 
									 				false, // orignally, chatDoc.theOtherUserActive
									 				setProgress
									 			);
									 			clearFilesChat();
									 			setMessage('');
									 			clearChosenDisplayPostUrls();
									 			setDisplayPostsShown(false);
											})
											.catch((error) => {
												console.log("ChatScreen: chatPostFire: openChat: ", error);
											});
										} else {
											chatPostFire.sendMessageFire(
												chat.id,
												chat.data.firstUserId,
								 				chat.data.secondUserId,
												theOtherUser.id, 
												user.id, 
												message, 
												files, 
												chosenDisplayPostUrls, 
												chatDoc.theOtherUserActive, 
												setProgress
											);
											clearFilesChat();
											setMessage('');
											clearChosenDisplayPostUrls();
											setDisplayPostsShown(false);
										}
									} else {
										console.log("send button pushed");
									}
								}}
								loadMore={() => {
									if (chat) {
							    	if (messageFetchSwitch && messageFetchState === false) {
							    		setMessageFetchState(true);
							    		const getMessages = chatGetFire.getMessages(
								    		chatFound.id, 
								    		theOtherUser.id, 
								    		theOtherUser.name, 
								    		theOtherUser.photoURL, 
								    		appendEarlierMessages,
								    		setMessageLast,
												setMessageFetchSwitch,
												messageLast,
												dateToCompare,
												addDateToCompare,
								    	);
							    		getMessages
								    	.then(() => {
								    		setMessageFetchState(false);
								    	});
							    	} else {
											console.log(
												"messageFetchSwitch: " 
												+ messageFetchSwitch
												+ "messageFetchState: "
												+ messageFetchState
											);
										}
						    	}
								}}
							/>
							{
								files.length > 0
								?
								<View style={styles.pickImageContainer}>
							    <FlatList
							      horizontal
							      showsHorizontalScrollIndicator={false}
							      data={files}
							      keyExtractor={(image) => image.id}
							      renderItem={({ item }) => {
							        return (
							          <TouchableOpacity 
							            onPress={() => {navigation.navigate('ImageZoomin', 
							                {
							                  imageUri: item.uri,
							                  currentScreen: 'Chat',
							                }
							              );
							            }}
							            style={styles.imageContainer}
							          >
							            <CancelButton onPressFunction={() => cancelFileChat(item.id)}/>
							            <Image style={styles.chosenImage} source={{ uri: item.uri }}/>
							          </TouchableOpacity>
							        )
							      }}
							    />
							    { 
							    	files.length <= 4 && 
							      <TouchableHighlight 
							        style={styles.pickImageButton} 
							        onPress={() => {pickImage('chat');}}
							        underlayColor={color.grey1}
							      >
							        <AntDesign name="plus" size={RFValue(38)} color={color.grey2} />
							      </TouchableHighlight>
							    }
							  </View>
								: null
							}
						</View>
					</TouchableWithoutFeedback>
				</KeyboardAvoidingView>
			</MainTemplate>
		)
	} else {
		return (
			<MainTemplate>
				<UserAccountHeaderForm
					leftButtonIcon={expoIcons.ioniconsMdArrowBack(RFValue(27), color.black1)}
					leftButtonPress={() => { navigation.goBack() }}
					username={theOtherUser.username}
					title={null}
					firstIcon={
						theOtherUser.type === 'business'
						? <Feather name="menu" size={RFValue(23)} color={displayPostsShown ? color.blue1 : color.black1} />
						: null
					}
					secondIcon={
						theOtherUser.type === 'business'
						? <Feather name="shopping-bag" size={RFValue(28)} color={color.black1} />
						: null
					}
					firstOnPress={
						() => {setDisplayPostsShown(!displayPostsShown);}
					}
					secondOnPress={
						null
					}
				/>
        <ChatScreenDefault/>
      </MainTemplate>
		)
	}
}

const styles = StyleSheet.create({
	chatContainer: {
		flex: 1,
	},
	innerContainer: {
    flex: 1,
    backgroundColor: color.white1,
    justifyContent: "space-around"
  },
  loadingSpinnerContainer: {
  	position: 'absolute',
  	alignSelf: 'center',
  	marginTop: '17%',
  },
  displayPostsContainer: {
		elevation: 5,
		height: windowWidth/2 + RFValue(50),
		width: '100%',
		backgroundColor: '#fff',
		shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
	},
	displayPostLoadingContainer: {
		position: 'absolute',
		alignSelf: 'center',
	},
	postImageContainer: {
		height: windowWidth/2 + RFValue(50),
		alignItems: 'center',
		marginRight: 2,
	},
	actionContainer: {
		borderWidth: 1,
		flexDirection: 'row',
	},
	buttonContainer: {
		backgroundColor: '#fff',
		marginLeft: RFValue(7),
		marginTop: RFValue(7),
		marginBottom: RFValue(7),
		justifyContent: 'center',
		alignItems: 'center',
		width: RFValue(59),
		height: RFValue(59),
		borderWidth: 0.5,
		borderRadius: RFValue(7),
	},

	pickImageContainer: {
		position: 'absolute',
		alignSelf: 'flex-end',
    zIndex: 0,
    maxHeight: RFValue(100),
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 3,
    backgroundColor: color.white2
  },
  pickImageButton: {
    width: RFValue(100),
    height: RFValue(100),
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.4,
    borderRadius: 15
  },

	imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: RFValue(5),
  },
	chosenImage: {
    width: RFValue(100),
    height: RFValue(100)
  },
  chosenStatus: {
  	flex: 1, 
  	height: windowWidth/2 + RFValue(50), 
  	width: windowWidth/2 , 
  	position: 'absolute', 
  },
  chosenShadow: {
  	flex: 1, 
  	height: windowWidth/2 + RFValue(50), 
  	width: windowWidth/2 , 
  	position: 'absolute', 
  	backgroundColor: color.black1, 
  	opacity: 0.1 
  },
   chosenCheck: {
  	flex: 1, 
  	position: 'absolute', 
  	height: windowWidth/2 + RFValue(50), 
  	width: windowWidth/2, 
  	justifyContent: 'center', 
  	alignItems: 'center'
  },
  sendContainer: {
  	height: '100%',
  	paddingHorizontal: RFValue(11),
  	alignSelf: 'center',
  	backgroundColor: color.white1,
  	justifyContent: 'center',
  	alignItems: 'center',
  },
  iosPaddingTop: {
  	paddingTop: '9%'
  },
  androidPaddingTop: {
  	paddingTop: '7%'
  },
});

export default ChatScreen;
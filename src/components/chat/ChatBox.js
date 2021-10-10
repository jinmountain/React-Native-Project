import React from 'react'
import { 
	View, 
	FlatList,
	ScrollView,
	Text, 
	StyleSheet,
	Dimensions,
	KeyboardAvoidingView,
	Image,
	TextInput,
	Keyboard,
	TouchableHighlight,
	TouchableOpacity,
} from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';

// NPMs
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// Components

// Designs
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

// Color
import color from '../../color';

const { width, height } = Dimensions.get("window");

const getTime = (timestamp) => {
	var a = new Date(timestamp);
	var hour = a.getHours();
	var normalHour;
  var min = a.getMinutes();
  var pmOrAm;
  if (hour > 12) {
  	pmOrAm = 'PM';
  	normalHour = hour - 12;
  } else {
  	pmOrAm = 'AM';
  	normalHour = hour;
  }
  var time = normalHour + ':' + min + ' ' + pmOrAm;
  return time;
}

const timeConverter = (timestamp) => {
  var a = new Date(timestamp);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

const giveDateSign = (item) => {
	return (
		<View style={styles.dateSignContainer}>
			<View style={styles.dateSignInner}>
				<Text style={styles.dateSignText}>
					{item.dateSign.day},
				</Text>
				<Text style={styles.dateSignText}>
					{item.dateSign.month}
				</Text>
				<Text style={styles.dateSignText}>
					{item.dateSign.date},
				</Text>
				<Text style={styles.dateSignText}>
					{item.dateSign.year}
				</Text>
			</View>
		</View>
	)
};

const ChatBox = ({
	sendButtonColor,
	pickImage,
	onPressShort,
	showExtendedActions, 
	setShowExtendedActions,
	isKeyboardVisible,
	files, 
	messages, 
	userId, 
	theOtherUser, 
	message, 
	setMessage, 
	onSend,
	loadMore,
}) => {
	return (
		<View style={styles.mainContainer}>
			<View style={styles.chatContainer}>
				<FlatList
					onEndReached={loadMore}
					onEndReachedThreshold={0.01}
				  vertical
				  inverted={true}
				  showsVerticalScrollIndicator={true}
				  data={messages}
				  keyExtractor={(message) => message._id}
				  renderItem={({ item }) => {
				    return (
				    	// dateSign json attributes
			    		// addToMessage: true
			    		// year: previousDate.year
			    		// month: previousDate.month
			    		// date: previousDate.date
			    		item.user._id === userId
				    	?
				    	<View>
					    	<TouchableOpacity 
					    		style={styles.userMessageContainer}
					    		onPress={() => {
					    			onPressShort(item)
					    		}}
					    	>
					    		<View style={styles.userMesssageInnerContainer}>
						    		<View style={styles.userBodyContainer}>
							    		<View style={styles.contentContainer}>
							    			{ item.text
							    				?
							    				<Text style={styles.messageText}>
							    					{item.text} 
							    				</Text>
							            :item.video
							            ?
							            <View style={{width: RFValue(100), height: RFValue(100)}}>
							              <Video
							                // ref={video}
							                style={{backgroundColor: color.white2, borderWidth: 0, width: RFValue(100), height: RFValue(100)}}
							                source={{
							                  uri: item.video,
							                }}
							                useNativeControls={false}
							                resizeMode="contain"
							                shouldPlay={false}
							              />
							            </View>
							            : item.image
							            ?
							            <Image 
							              source={{uri: item.image}}
							              style={{width: RFValue(100), height: RFValue(100)}}
							            />
							            : null
							    			}
							    		</View>
							    		<View style={styles.timeContainer}>
							    			<Text style={styles.timeText}>
							    				{getTime(item.createdAt)}
							    			</Text>
							    		</View>
							    	</View>
							    </View>
					    	</TouchableOpacity>
					    	{item.dateSign && giveDateSign(item)}
					    </View>
				    	:
				    	<View>
					    	<TouchableOpacity style={styles.theOtherUserMessageContainer}>
					    		<View style={styles.theOtherUserMesssageInnerContainer}>
						    		{
						  				item.user.avatar
						  				?
						  				<View style={styles.headContainer}>
							        	<Image 
							        		defaultSource={require('../../../img/defaultImage.jpeg')}
										    	style={styles.userPhoto} 
										    	source={{ uri: item.user.avatar }}
										    />
										  </View>
									    :
									    null
								  	}
								  	<View style={styles.theOtherUserBodyContainer}>
							    		<View style={styles.contentContainer}>
							    			<Text style={styles.messageText}>{item.text} </Text>
							    		</View>
							    		<View style={styles.timeContainer}>
							    			<Text style={styles.timeText}>
							    				{getTime(item.createdAt)}
							    			</Text>
							    		</View>
							    	</View>
							    </View>
					      </TouchableOpacity>
					      {item.dateSign && giveDateSign(item)}
					    </View>
				    )
				  }}
				/>
			</View>
			<View	style={isKeyboardVisible ? { ...styles.chatBarContainer, ...{ marginBottom: RFValue(33) }} : styles.chatBarContainer}>
				{
					!showExtendedActions
					?
					<TouchableHighlight 
						style={styles.actionButtonContainer}
						onPress={() => {
							Keyboard.dismiss();
							setShowExtendedActions(!showExtendedActions);
						}}
						underlayColor={color.gray4}
					>
						<AntDesign name="plussquareo" size={RFValue(23)} color="black" />
					</TouchableHighlight>
					:
					<TouchableHighlight 
						style={styles.actionButtonContainer}
						onPress={() => {
							setShowExtendedActions(!showExtendedActions);
						}}
						underlayColor={color.gray4}
					>
						<AntDesign name="closesquareo" size={RFValue(23)} color="black" />
					</TouchableHighlight>
				}

				{
					showExtendedActions
					?
					<ScrollView 
						horizontal
						style={styles.extendedActionContainer}
					>
						<TouchableOpacity 
							style={styles.extendedActionButtonContainer}
							onPress={pickImage}
						>
							<Feather name="image" size={RFValue(27)} color="black" />
						</TouchableOpacity>
					</ScrollView>
					:
					null
				}
				
				<View style={styles.textInputContainer}>
					<TextInput
						onChangeText={text => setMessage(text)}
	      		value={message}
	      		multiline
	      		placeholder={"Message..."}
					/>
				</View>
				<TouchableHighlight
					style={styles.sendButtonContainer}
		      onPress={onSend}
		      underlayColor={color.gray5}
				>
					<View>
						<Ionicons name="send" size={RFValue(21)} color={sendButtonColor} />
					</View>
				</TouchableHighlight>
			</View>
		</View>
	)
};

const styles = StyleSheet.create({
	mainContainer: {
		backgroundColor: color.white1,
		flex: 1,
	},
	chatContainer: {
		flex: 1,
	},
	chatBarContainer: {
		marginVertical: RFValue(7),
		marginHorizontal: RFValue(7),
		backgroundColor: color.white1,
		alignItems: 'center',
		flexDirection: 'row',
		height: '9%', // solves the KeyboardAvodingView excessive padding
		minHeight: RFValue(50), // prevents keyboardAvoidingView shrink the textInput
		borderRadius: RFValue(13),
	}, 
	actionButtonContainer: {
		borderRadius: 100,
		padding: RFValue(9),
	},
	textInputContainer: {
		flex: 1,
		paddingVertical: RFValue(7),
	},

	dateSignContainer: {
		paddingVertical: RFValue(3),
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	dateSignInner: {
		width: RFValue(137),
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		borderRadius: RFValue(7),
		backgroundColor: color.gray1
	},
	dateSignText: {
		color: '#fff',
		paddingRight: RFValue(3),
		fontSize: RFValue(13),
	},

	userMessageContainer: {
		paddingLeft: RFValue(3),
		width: '100%',
	},
	userMesssageInnerContainer: {
		paddingVertical: RFValue(3),
		paddingRight: RFValue(3),
		alignSelf: 'flex-end',
	},
	userBodyContainer: {
		padding: RFValue(5),
		borderTopLeftRadius: RFValue(7),
		borderBottomLeftRadius: RFValue(7),
		backgroundColor: '#E7DDFF',
	},
	messageText: {
		// color: '#fff',
		fontSize: RFValue(17),
	},
	timeText: {
		fontSize: RFValue(11),
		color: color.gray3,
	},

	theOtherUserMessageContainer: {
		width: '100%',
	},
	theOtherUserMesssageInnerContainer: {
		paddingLeft: RFValue(3),
		paddingVertical: RFValue(1),
		flexDirection: 'row',
	},
	headContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: RFValue(3),
		paddingRight: RFValue(7),
	},
	theOtherUserBodyContainer: {
		padding: RFValue(5),
		borderTopRightRadius: RFValue(7),
		borderBottomRightRadius: RFValue(7),
		backgroundColor: color.gray4,
		borderRadius: RFValue(7),
	},

	userPhoto: {
		width: RFValue(37),
		height: RFValue(37),
		borderRadius: RFValue(100),
	},
	sendButtonContainer: {
		backgroundColor: '#fff',
		height: '100%',
		paddingHorizontal: RFValue(11),
		justifyContent: 'center',
		alignItems: 'center',
		borderTopRightRadius: RFValue(11),
		borderBottomRightRadius: RFValue(11),
		// position: 'absolute',
		// alignSelf: 'flex-end',
	},

	extendedActionContainer: {
		width: 0,
	},
	extendedActionButtonContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: RFValue(5),
	}
});

export default ChatBox;
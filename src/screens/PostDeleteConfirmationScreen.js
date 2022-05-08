import React from 'react';
import { 
	Text, 
	View,
	Animated, 
	StyleSheet,
	TouchableOpacity,
	TouchableHighlight,
	Dimensions,
	Pressable,
} from 'react-native';
import { SafeAreaView, } from 'react-native-safe-area-context';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import { useTheme } from '@react-navigation/native';
import { useCardAnimation } from '@react-navigation/stack';

// components
import HeaderBottomLine from '../components/HeaderBottomLine';
import DeleteConfirmation from '../components/DeleteConfirmation';

// Firebase
// delete post
import { deletePostFire } from '../firebase/post/postDeleteFire';
// cancel rsv
// import rsvPostFire from '../firebase/rsv/rsvPostFire';

// Color
import color from '../color';

// icon
// import expoIcons from '../expoIcons';

const { width, height } = Dimensions.get("window");

const PostDeleteConfirmationScreen = ({ route, navigation }) => {
	const { 
		headerText, 
    messageText, 
    postId, 
    postData,
    deletePostState,
    decrementPostCount
	} = route.params;

	const { current } = useCardAnimation();

	return (
		<View 
			style={styles.postConfirmDeletionContainer}
		>
			<DeleteConfirmation
        headerText={headerText}
        messageText={messageText}
        deleteAction={() => {
          const deletePost = postDeleteFire.deletePostFire(postId, postData);
          deletePost
          .then(() => { 
            deletePostState(); 
            // decrementPostCount();
            navigation.goBack();
          })
          .catch((error) => {
            console.log(error);
          });
        }}
      />	
		</View>
	);
};

const styles = StyleSheet.create({
	postConfirmDeletionContainer: {
		flex: 1,
	},
	confirmationContainer: {
		position: 'absolute',
		width: width * 0.7,
		height: height * 0.5,
		backgroundColor: '#fff',
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	headerContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: RFValue(10),
		paddingHorizontal: RFValue(10),
	},
	headerText: {
		fontSize: RFValue(22),
		fontWeight: 'bold',
	},
	buttonContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: RFValue(90),
		paddingHorizontal: RFValue(30),
		paddingVertical: RFValue(10),
	},
	deleteText: {
		color: color.black1,
		fontSize: RFValue(20),
		fontWeight: 'bold',
	},
	dontDeleteText: {
		fontSize: RFValue(20),
		fontWeight: 'bold',
	},
	button: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '100%',
		borderRadius: RFValue(50),
	},
	line: {
		width: '100%',
		borderWidth: 0.5,
		borderColor: color.grey1,
	},

	messageContainer: {
		paddingHorizontal: RFValue(10),
		paddingVertical: RFValue(10),
	},
	messageText: {
		color: color.grey3,
		fontSize: RFValue(15)
	},
});

export default PostDeleteConfirmationScreen;
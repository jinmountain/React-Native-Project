// note

import React, { useState, useRef } from 'react';
import { 
	Text, 
	View,  
	StyleSheet,
	TouchableOpacity,
	TouchableHighlight,
	Pressable,
  ScrollView,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import BottomSheet from 'reanimated-bottom-sheet';

// Components
import MainTemplate from '../../components/MainTemplate';
import HeaderBottomLine from '../../components/HeaderBottomLine';

// Designs
import { Feather } from '@expo/vector-icons';

// Color
import color from '../../color';

// hooks

// icon
import expoIcons from '../../expoIcons';

const RenderContent = ({ 
  navigation, 
  contentHeight, 
  postId, 
  commentId,
  replyId,
  replyData, 
  replyUser, 
  currentUserId,
  setCurrentReplyData,
  deleteCurrentReplyState,
  decrementReplyCount
}) => {
  return (
    <View
      style={{
        backgroundColor: color.white2,
        height: contentHeight,
      }}
    >
      <View style={{ 
        height: RFValue(57), 
        // backgroundColor: color.grey7,
        // alignItems: 'center' 
      }}>
        {/*{expoIcons.featherMoreHorizontal(RFValue(27), color.white2)}*/}
        <View style={{
          flexDirection: 'row',
          height: RFValue(57),
          alignItems: 'center',
        }}>
          <View style={{ flex: 1, paddingLeft: RFValue(27) }}>
            <Text>{expoIcons.featherMoreHorizontal(RFValue(27), color.black1)}</Text>
          </View>
          <TouchableHighlight
            style={{ 
              height: RFValue(50), 
              width: RFValue(50), 
              justifyContent: 'center', 
              alignItems: 'center',
              borderRadius: RFValue(100)
            }}
            onPress={() => {
              navigation.goBack();
            }}
            underlayColor={color.grey4}
          >
            <View>
              {expoIcons.evilIconsClose(RFValue(27), color.black1)}
            </View>
          </TouchableHighlight>
        </View>
      </View>
      <HeaderBottomLine />
      <ScrollView>
        <TouchableOpacity
          onPress={() => {

          }}
          style={styles.bsButtonTouch}
        >
          <View style={styles.bsButton}>
            <Text style={styles.bsButtonText}>Share</Text>
          </View>
        </TouchableOpacity>
        <HeaderBottomLine />

        {
          replyData.uid === currentUserId
          ? null
          : 
          <View>
            <TouchableOpacity
              onPress={() => {

              }}
              style={styles.bsButtonTouch}
            >
              <View style={styles.bsButton}>
                <Text style={styles.bsButtonText}>Block</Text>
              </View>
            </TouchableOpacity>
            <HeaderBottomLine />
            <TouchableOpacity
              onPress={() => {

              }}
              style={styles.bsButtonTouch}
            >
              <View style={styles.bsButton}>
                <Text style={styles.bsButtonText}>Report</Text>
              </View>
            </TouchableOpacity>
          </View>
        }
        {
        	replyData.uid === currentUserId
          ? null
          : <HeaderBottomLine />
  	    }

        {
        	replyData.uid === currentUserId 
          ?
        	<View>
  		      <TouchableOpacity
  		        onPress={() => {
                const goBackFirst = new Promise ((res, rej) => {
                  navigation.goBack();
                  res()
                });
                goBackFirst
                .then(() => {
                  navigation.navigate("ReplyEdit", {
                    postId: postId, 
                    commentId: commentId,
                    replyId: replyId,
                    replyData: replyData,
                    replyUser: replyUser,
                    currentUserId: currentUserId,
                    setCurrentReplyData: setCurrentReplyData
                  });
                });
  		        }}
  		        style={styles.bsButtonTouch}
  		      >
  		        <View style={styles.bsButton}>
  		          <Text style={styles.bsButtonText}>Edit</Text>
  		        </View>
  		      </TouchableOpacity>
  		      <HeaderBottomLine />
  		      <TouchableOpacity
  		        style={styles.bsButtonTouch}
  		        onPress={() => {
  							const goBackFirst = new Promise ((res, rej) => {
  								navigation.goBack();
  								res()
  							});
  							goBackFirst
  							.then(() => {
  								navigation.navigate(
  									"ReplyDeleteConfirmation",
  									{ 
                      headerText: "Delete Reply?",
                      messageText: "This can’t be undone and it will be removed from your account and snail search results.",
  										postId: postId,
                      commentId: commentId,
                      replyId: replyId,
                      setCurrentReplyData: setCurrentReplyData,
                      decrementReplyCount: decrementReplyCount
  		              }
  								);
  							});
  						}}
  		      >
  		        <View style={styles.bsButton}>
  		          <Text style={styles.bsButtonText}>Delete</Text>
  		        </View>
  		      </TouchableOpacity>
  		    </View>
          : null
  	    }
        {
          replyData.uid === currentUserId 
          ?
          <HeaderBottomLine />
          : null
        }
      </ScrollView>
    </View>
  )
};

const ReplyManagerScreen = ({ route, navigation }) => {
	const { postId, commentId, replyId, replyData, replyUser, currentUserId, setCurrentReplyData, decrementReplyCount } = route.params;

	const sheetRef = useRef(null);
  const [ bottomSheetHeight, setBottomSheetHeight ] = useState(RFValue(300));

	return (
		// Don't use SafeAreaView 
		// it leaves padding on iso when it is used within a modal screen and another SafeAreaView
		<View 
			style={{ flex: 1 }}
		>
			<Pressable 
				style={[
					StyleSheet.absoluteFill,
					{ backgroundColor: 'rgba(0, 0, 0, 0.5)' },
				]}
				onPress={() => { navigation.goBack() }}
			>
			</Pressable>
			<BottomSheet
        ref={sheetRef}
        snapPoints={[bottomSheetHeight, 0, 0]}
        borderRadius={RFValue(10)}
        renderContent={() => {
          return (
            <RenderContent
              navigation={navigation}
              contentHeight={bottomSheetHeight}
              postId={postId}
              commentId={commentId}
              replyId={replyId}
              replyData={replyData}
              replyUser={replyUser}
              currentUserId={currentUserId}
              setCurrentReplyData={setCurrentReplyData}
              decrementReplyCount={decrementReplyCount}
            />
          )
        }}
        initialSnap={0}
        // allow onPress inside bottom sheet
        enabledContentTapInteraction={false}
        enabledBottomClamp={true}
        onCloseEnd={() => {
          navigation.goBack();
        }}
      />
		</View>
	);
};

const styles = StyleSheet.create({
	bsButtonTouch: {
    justifyContent: 'center',
    alignItems: 'center',
    height: RFValue(60)
  },
  bsButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bsButtonText: {
    fontSize: RFValue(21),
  },
});

export default ReplyManagerScreen;
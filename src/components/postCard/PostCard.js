import React, { useContext, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Image,
  ScrollView,
  StyleSheet,  
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  Animated,
  Platform,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useIsFocused } from '@react-navigation/native';

// Hooks
import { useOrientation } from '../../hooks/useOrientation';

// Contexts

// Components
import { HeaderForm } from '../HeaderForm';
import VerticalSwipePostImage from './VerticalSwipePostImage';
import PostInfoBox from './PostInfoBox';
import PostBusinessUserInfoContainer from './PostBusinessUserInfoContainer';
import PostUserInfoContainer from './PostUserInfoContainer';
import LikeCommentButtonLine from './LikeCommentButtonLine';
import PostLikeCommentTimeInfo from './PostLikeCommentTimeInfo';

// Hooks
import { wait } from '../../hooks/wait';
import { isCloseToBottom } from '../../hooks/isCloseToBottom';
import { useNavigation } from '@react-navigation/native';

const PostCard = ({ 
	post,
	postId,
	postData,
	currentUserId,
	files,
	tags,
	totalRating,
	countRating,
	caption,
	defaultCaptionNumLines,
	postUserId,
	likeCount,
	postTimestamp,
	currentUserPhotoURL,
	isCardFocused,

  CARD_HEIGHT,
  CARD_WIDTH,
  CARD_MARGIN,

  cardIndex,
  // setShowCommentPostIndex
}) => {
	// const orientation = useOrientation();
	// const [ windowWidth, setWindowWidth ] = useState(Dimensions.get("window").width);
 //  const [ windowHeight, setWindowHeight ] = useState(Dimensions.get("window").height);
 //  const [ threePostsRowImageWH, setThreePostsRowImageWH ] = useState(Dimensions.get("window").width/3-2);

 //  const [ cardHeight, setCardHeight ] = useState( orientation === 'LANDSCAPE' ? Dimensions.get("window").width * 0.77 : Dimensions.get("window").height * 0.77 );
 //  const [ cardMargin, setCardMargin ] = useState( orientation === 'LANDSCAPE' ? Dimensions.get("window").width * 0.03 : Dimensions.get("window").height * 0.03 );
 //  const [ cardWidth, setCardWidth ] = useState( Dimensions.get("window").width );
 //  const [ infoBoxHeight, setInfoBoxHeight ] = useState( 
 //  	orientation === 'LANDSCAPE' 
 //  	? (Dimensions.get("window").width * 0.77) * 0.9 - Dimensions.get("window").width
 //  	: (Dimensions.get("window").height * 0.77) * 0.9 - Dimensions.get("window").width 
 //  );

 //  useEffect(() => {
 //    setThreePostsRowImageWH(Dimensions.get("window").width/3-2);
 //    setWindowWidth(Dimensions.get("window").width);
 //    setWindowHeight(Dimensions.get("window").height);

 //    if (orientation === 'LANDSCAPE') {
 //    	setCardHeight(Dimensions.get("window").width * 0.77);
 //    	setCardMargin(Dimensions.get("window").width * 0.03);
 //    	setInfoBoxHeight( (Dimensions.get("window").width * 0.77) * 0.9 - Dimensions.get("window").width );
 //    }
 //    if (orientation === 'PORTRAIT') {
 //    	setCardHeight(Dimensions.get("window").height * 0.77);
 //    	setCardMargin(Dimensions.get("window").height * 0.03);
 //    	setInfoBoxHeight( (Dimensions.get("window").height * 0.77) * 0.9 - Dimensions.get("window").width );
 //    }

 //    setCardWidth(Dimensions.get("window").width);
 //  }, [orientation]);
 	const isFocused = useIsFocused();
	const navigation = useNavigation();

  const [ expandInfoBox, setExpandInfoBox ] = useState(false);
	return (
		<View
      style={
        expandInfoBox
        ?
        { 
          ...styles.card, 
          ...{ width: CARD_WIDTH, marginBottom: CARD_MARGIN } 
        }
        :
        { 
          ...styles.card, 
          ...{ height: CARD_HEIGHT, width: CARD_WIDTH, marginBottom: CARD_MARGIN } 
        }
      }
    >
      <PostUserInfoContainer
    		postId={post.id}
    		postData={post.data}
    		currentUserId={currentUserId}
        postTimestamp={post.data.createdAt}
    	/>
      <VerticalSwipePostImage
        files={post.data.files}
        onFocus={isCardFocused}
        isDisplay={post.data.display}
        displayPrice={post.data.price}
        displayEtc={post.data.etc}
      />
      <PostInfoBox
        tags={post.data.tags}
        totalRating={post.data.totalRating}
        countRating={post.data.countRating}
        caption={post.data.caption}
        defaultCaptionNumLines={1}
        postId={post.id}
        postUserId={post.data.uid}
        likeCount={post.data.likeCount}
        commentCount={post.data.commentCount}
        postTimestamp={post.data.createdAt}
        currentUserPhotoURL={currentUserPhotoURL}
        currentUserId={currentUserId}
        expandInfoBox={expandInfoBox}
        setExpandInfoBox={setExpandInfoBox}
        cardIndex={cardIndex}
        // setShowCommentPostIndex={setShowCommentPostIndex}
      />
    </View>
  )
};

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
	},
	card: {
		flex: 1,
    elevation: 5, // for android
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { 
    	width: 0,
			height: 2, 
		},
  },
});
export default PostCard;
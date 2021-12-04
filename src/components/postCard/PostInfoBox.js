import React from 'react';
import { 
  StyleSheet, 
  View, 
} from 'react-native';

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import LikeCommentButtonLine from './LikeCommentButtonLine';
import TagLine from '../TagLine';
import PostCaptionMoreLess from './PostCaptionMoreLess';
import PostLikeCommentTimeInfo from './PostLikeCommentTimeInfo';
import PostCardCommentLine from "./PostCardCommentLine";

// color
import color from '../../color';

const PostInfoBox = ({
  tags, 
  totalRating, 
  countRating,

  caption,
  defaultCaptionNumLines,
  navigateToPostDetail,

  youLike, 
  postTimestamp,

  likeCount,
  commentCount,
  postId,
  postUserId,

  height,

  currentUserPhotoURL,
  currentUserId
}) => {
  return (
    <View style={
      // height
      // ?
      // {...styles.infoBoxContainer, ...{ height: height }}
      // : styles.infoBoxContainer
      styles.infoBoxContainer
    }>
      <View style={styles.infoBoxTop}>
        <LikeCommentButtonLine
          countRating={countRating}
          postId={postId}
          postUserId={postUserId}
          tags={tags}
          likeCount={likeCount}
          commentCount={commentCount}
          currentUserId={currentUserId}
        />
      </View>
      <View style={styles.infoBoxBody}>
        <PostCaptionMoreLess
          caption={caption}
          defaultCaptionNumLines={defaultCaptionNumLines}
          postId={postId}
        />
        <PostCardCommentLine
          postId={postId}
          currentUserPhotoURL={currentUserPhotoURL}
          commentCount={commentCount}
        />
      </View>
      <View style={styles.infoBoxBottom}>
        <PostLikeCommentTimeInfo 
          likeCount={likeCount}
          postTimestamp={postTimestamp}
        />
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  infoBoxContainer: {
    paddingHorizontal: RFValue(13),
    paddingVertical: RFValue(5),
    backgroundColor: color.white2
  },
  infoBoxTop: {
    // flex: 2
  },
  infoBoxBody: {
    borderWidth: 1,
  },
  infoBoxBottom: {
    // flex: 1, 
    justifyContent: 'flex-end', 
  },
});

export default PostInfoBox;
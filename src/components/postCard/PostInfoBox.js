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

// color
import color from '../../color';

const PostInfoBox = ({
  tags, 
  totalRating, 
  countRating,

  caption,
  defaultCaptionNumLines,
  rootScreen,
  navigateToPostDetail,

  youLike, 
  postTimestamp,

  likeCount,
  postId,
  uid,

  height,
}) => {
  return (
    <View style={
      height
      ?
      {...styles.InfoBoxContainer, ...{ height: height }}
      : styles.InfoBoxContainer
    }>
      <View style={styles.infoBoxHead}>
        <LikeCommentButtonLine
          countRating={countRating}
          youLike={youLike}
          postId={postId}
          uid={uid}
          tags={tags}
          likeCount={likeCount}
        />
      </View>
      <View style={styles.infoBoxBody}>
        <PostCaptionMoreLess
          caption={caption}
          defaultCaptionNumLines={defaultCaptionNumLines}
          rootScreen={rootScreen}
          navigateToPostDetail={navigateToPostDetail}
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
  InfoBoxContainer: {
    paddingHorizontal: RFValue(13),
    paddingVertical: RFValue(5),
    backgroundColor: color.white2
  },
  infoBoxHead: {
    flex: 1
  },
  infoBoxBody: {
    flex: 1,
  },
  infoBoxBottom: {
    flex: 1, 
    justifyContent: 'flex-end', 
  },
});

export default PostInfoBox;
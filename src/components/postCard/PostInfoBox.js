import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableWithoutFeedback
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import LikeCommentButtonLine from './LikeCommentButtonLine';
import TagLine from '../TagLine';
import ExpandableText from '../ExpandableText';
import PostLikeCommentTimeInfo from './PostLikeCommentTimeInfo';
import PostCardCommentLine from "./PostCardCommentLine";

// color
import color from '../../color';

// expo icons
// import expoIcons from '../../expoIcons';

const PostInfoBox = ({
  tags, 
  totalRating, 
  countRating,

  caption,
  defaultCaptionNumLines,

  youLike, 
  postTimestamp,

  likeCount,
  commentCount,
  postId,
  postUserId,

  POST_INFO_BOX_HEIGHT,

  currentUserPhotoURL,
  currentUserId,

  postDetail,

  expandInfoBox,
  setExpandInfoBox,

  cardIndex,
  postFiles,
  // setShowCommentPostIndex
}) => {
  const navigation = useNavigation();

  return (
    <View 
      style={styles.infoBoxContainer}
    >
      <View style={styles.infoBoxInner}>
        <View style={styles.infoBoxTop}>
          <LikeCommentButtonLine
            countRating={countRating}
            postId={postId}
            postUserId={postUserId}
            likeCount={likeCount}
            commentCount={commentCount}
            currentUserId={currentUserId}
            moreDetailExists={
              postDetail 
              ? false
              : commentCount > 0 || caption
              ? true 
              : false
            }
            expandInfoBox={expandInfoBox}
            setExpandInfoBox={setExpandInfoBox}
            cardIndex={cardIndex}
            postFiles={postFiles}
            // setShowCommentPostIndex={setShowCommentPostIndex}
          />
          {
            tags && tags.length > 0
            ?
            <TagLine 
              tags={tags}
            />
            : null
          }
        </View>
        {
          postDetail || expandInfoBox
          ?
          <View style={styles.infoBoxBody}>
            <ExpandableText
              caption={caption}
              defaultCaptionNumLines={defaultCaptionNumLines}
            />
            <PostCardCommentLine
              postId={postId}
              currentUserPhotoURL={currentUserPhotoURL}
              commentCount={commentCount}
            />
          </View>
          : null
        }
        {
          postDetail || expandInfoBox
          ?
          <View style={styles.infoBoxBottom}>
            <PostLikeCommentTimeInfo 
              likeCount={likeCount}
              postTimestamp={postTimestamp}
            />
          </View>
          : null
        }
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  infoBoxContainer: {
    backgroundColor: color.white2,
  },
  infoBoxInner: {
    justifyContent: 'center',
  },
  infoBoxTop: {
    // flex: 2
  },
  infoBoxBody: {
    paddingHorizontal: RFValue(13),
  },
  infoBoxBottom: {
    // flex: 1, 
    paddingHorizontal: RFValue(13),
    justifyContent: 'flex-end',
    paddingVertical: RFValue(5)
  },
});

export default PostInfoBox;
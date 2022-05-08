import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableWithoutFeedback,
  Text
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import LikeCommentButtonLine from './LikeCommentButtonLine';
import TagLine from '../TagLine';
import ExpandableText from '../ExpandableText';
import PostCardCommentLine from "./PostCardCommentLine";
import AnimHighlight from '../buttons/AnimHighlight';

// color
import color from '../../color';

// expo icons
import {
  antdesignClockCircleO
} from '../../expoIcons';

// hooks
import { timeDifference } from '../../hooks/timeDifference';
import {
  convertEtcToHourMin
} from '../../hooks/useConvertTime';

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
  incrementCommentCount,
  decrementCommentCount,
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
  postTitle,
  postPrice,
  postEtc
  // setShowCommentPostIndex
}) => {
  const navigation = useNavigation();

  const postTimeInfo = () => {
    return (
      <View style={styles.additionalTextContainer}>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>
            {timeDifference(Date.now(), postTimestamp)}
          </Text>
        </View>
      </View>
    )
  };

  return (
    <View style={styles.infoBoxContainer}>
      <View style={styles.infoBoxInner}>
        <View style={styles.infoBoxTop}>
          <LikeCommentButtonLine
            countRating={countRating}
            totalRating={totalRating}
            postId={postId}
            postUserId={postUserId}
            likeCount={likeCount}
            commentCount={commentCount}
            incrementCommentCount={incrementCommentCount}
            decrementCommentCount={decrementCommentCount}
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
            postCaption={caption}
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
        <View style={styles.infoBoxBody}>
          <AnimHighlight
            content={
              postTitle || postPrice || postEtc
              ?
              <View
                onPress={() => {
                  console.log('expand');
                }}
              >
                {
                  postTitle &&
                  <View style={styles.postTitleContainer}>
                    <Text style={styles.titleText}>{postTitle}</Text>
                  </View>
                }
                {
                  postPrice || postEtc
                  ?
                  <View style={styles.displayPostPriceEtcContainer}>
                    <View style={styles.priceContainer}>
                      <View style={styles.currencyContainer}>
                        <Text style={styles.currencyText}>$</Text>
                      </View>
                      <View style={styles.priceTextContainer}>
                        <Text style={styles.priceText}>{postPrice}</Text>
                      </View>
                    </View>
                    <View style={styles.etcContainer}>
                      <View style={styles.etcIconContainer}>
                        {antdesignClockCircleO(RFValue(13), color.black1)}
                      </View>
                      <View style={styles.etcTextContainer}>
                        <Text style={styles.etcText}>{convertEtcToHourMin(postEtc)}</Text>
                      </View>
                    </View>
                  </View>
                  : null
                }
              </View>
              : null
            }
            customStyles
            onPressOutAction={() => {console.log("expand")}}
          />
          
          {
            caption.length > 0
            ?
            <ExpandableText
              caption={caption}
              defaultCaptionNumLines={defaultCaptionNumLines}
            />
            : null
          }
          <PostCardCommentLine
            postId={postId}
            postFiles={postFiles}
            postCaption={caption}
            incrementCommentCount={incrementCommentCount}
            decrementCommentCount={decrementCommentCount}
            currentUserPhotoURL={currentUserPhotoURL}
            commentCount={commentCount}
          />
        </View>
        <View style={styles.infoBoxBottom}>
          {postTimeInfo()}
        </View>
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
  postTitleContainer: {
    justifyContent: 'center',
    paddingVertical: RFValue(5),
  },
  displayPostPriceEtcContainer: {
    flexDirection: 'row',
    paddingBottom: RFValue(10)
  },
  priceContainer: {
    flexDirection: 'row',
    paddingRight: RFValue(10)
  },
  currencyContainer: {
    paddingRight: RFValue(3)
  },
  priceTextContainer: {

  },
  currencyText: {
    fontSize: RFValue(15)
  },
  priceText: {
    fontSize: RFValue(15)
  },
  etcContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: RFValue(5)
  },
  etcIconContainer: {
    paddingRight: RFValue(3)
  },
  etcTextContainer: {

  },
  etcText: {
    fontSize: RFValue(15)
  },

  titleText: {
    fontWeight: 'bold',
    fontSize: RFValue(21),
    color: color.black1,
  },
  infoBoxBottom: {
    // flex: 1, 
    paddingHorizontal: RFValue(13),
    justifyContent: 'flex-end',
    paddingVertical: RFValue(5)
  },

  // post time info
  additionalTextContainer: {
    overflow: "hidden",
    justifyContent: 'center',
  },
  timeContainer: {
    justifyContent: 'center',
    paddingRight: 8,
  },
  timeText: {
    color: "#5A646A",
    fontSize: RFValue(13),
  },
});

export default PostInfoBox;
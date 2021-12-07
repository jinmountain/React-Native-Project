import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text,
} from 'react-native';

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Designs

// Hooks
import { timeDifference } from '../../hooks/timeDifference';
import count from '../../hooks/count';

const PostLikeCommentTimeInfo = ({likeCount, commentCount, postTimestamp}) => {
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

const styles = StyleSheet.create({
  additionalTextContainer: {
    overflow: "hidden",
    justifyContent: 'center',
  },

  // Like and comment
  likeCommentContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  likesContainer: {
    justifyContent: 'center',
    paddingRight: 8,
  },
  likesText: {
    color: '#5A646A',
    fontSize: RFValue(13),
  },
  commentsContainer: {
    justifyContent: 'center',
    paddingRight: 8,
  },
  commentsText: {
    color: '#5A646A',
    fontSize: RFValue(13), 
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

export default PostLikeCommentTimeInfo;
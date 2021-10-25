import React, { useState } from 'react';
import { 
  StyleSheet, 
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Designs
import { FontAwesome5 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

// Hooks
import { timeDifference } from '../../hooks/timeDifference';
import { kOrNo } from '../../hooks/kOrNo';
// Adapters
import likeFire from '../../firebase/like/likeFire.js'

// Color
import color from '../../color';

// Components
import THButtonWOBorder from '../buttons/THButtonWOBorder';
import TagLine from '../TagLine';

const PostLikeCommentTimeInfo = ({ 
  countRating, 
  youLike, 
  postId, 
  uid, 
  tags, 
  likeCount 
}) => {
  const [ likeCountState, setLikeCountState ] = useState(likeCount);
  const [liked, setLiked] = useState(youLike);
  return (
    <View 
      style={styles.likeCommentButtonContainer}
    >
      { liked
        ? <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              setLiked(false); 
              likeFire.undoLikePostFire(postId, uid);
              setLikeCountState(likeCountState - 1);
            }}
          >
            <AntDesign name="heart" size={styles.buttonSize} color="red" />
            <Text style={styles.buttonText}>{likeCountState}</Text>
          </TouchableOpacity>
        : <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              setLiked(true);
              likeFire.likePostFire(postId, uid);
              setLikeCountState(likeCountState + 1);
            }}
          >
            <AntDesign name="hearto" size={styles.buttonSize} color="black" />
            <Text style={styles.buttonText}>{likeCountState}</Text>
          </TouchableOpacity>
      }
      <TouchableOpacity
        style={styles.buttonContainer}
      >
        <AntDesign name="message1" size={styles.buttonSize} color="black" />
      </TouchableOpacity>
      { 
        countRating
        ?
        <TouchableOpacity
          style={styles.buttonContainer}
        >
          <AntDesign name="staro" size={styles.buttonSize} color={color.black1} />
          <Text style={styles.buttonText}>{kOrNo(countRating)}</Text>
        </TouchableOpacity>
        :
        null
      }
      <TagLine 
        tags={tags}
      />
    </View>
  )
};

// { liked
//         ? <TouchableOpacity
//             style={styles.buttonContainer}
//             onPress={() => {
//               setLiked(false); 
//               likeFire.undoLikePostFire(postId, uid, bid);
//               setUndoLike(true);
//             }}
//           >
//             <FontAwesome5 name="heart" size={styles.buttonSize} color="red" />
//           </TouchableOpacity>
//         : undoLike
//         ? <TouchableOpacity
//             style={styles.buttonContainer}
//             onPress={() => {
//               setLiked(true);
//               likeFire.likePostFire(postId, uid, bid);
//               setUndoLike(false);
//             }}
//           >
//             <FontAwesome5 name="heart" size={styles.buttonSize} color="black" />
//           </TouchableOpacity>
//         : youLike === true
//         ? <TouchableOpacity
//             style={styles.buttonContainer}
//             onPress={() => {
//               setLiked(false); 
//               likeFire.undoLikePostFire(postId, uid, bid);
//               setUndoLike(true);
//             }}
//           >
//             <FontAwesome5 name="heart" size={styles.buttonSize} color="red" />
//           </TouchableOpacity>
//         : <TouchableOpacity
//             style={styles.buttonContainer}
//             onPress={() => {
//               setLiked(true);
//               likeFire.likePostFire(postId, uid, bid);
//               setUndoLike(false);
//             }}
//           >
//             <FontAwesome5 name="heart" size={styles.buttonSize} color="black" />
//           </TouchableOpacity>
//       }
//       <TouchableOpacity
//         style={styles.buttonContainer}
//       >
//         <FontAwesome5 name="comment" size={styles.buttonSize} color="black" />
//       </TouchableOpacity>
//       { 
//         taggedCount
//         ?
//         <TouchableOpacity
//           style={{ ...styles.buttonContainer, ...{ borderWidth: 0.5 }}}
//         >
//           <Feather name="tag" size={styles.buttonSize} color={color.black1} />
//           <Text style={styles.buttonText}>{kOrNo(taggedCount)}</Text>
//         </TouchableOpacity>
//         :
//         null
//       }

const styles = StyleSheet.create({
  likeCommentButtonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: RFValue(3),
    height: RFValue(40),
    alignItems: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    marginRight: RFValue(11),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: RFValue(17),
    paddingHorizontal: RFValue(3),
  },
  buttonSize: RFValue(27),
});

export default PostLikeCommentTimeInfo;
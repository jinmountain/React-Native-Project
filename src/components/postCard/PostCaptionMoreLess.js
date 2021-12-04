import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Hooks

import color from '../../color';

const postTextContent = ({  postId, caption, defaultCaptionNumLines }) => {
  const [ textShown, setTextShown ] = useState(false); //To show ur remaining Text
  const [ lengthMore, setLengthMore ] = useState(false); //to show the "Read more & Less Line"

  const navigation = useNavigation();
  
  const toggleNumberOfLines = () => { 
    //To toggle the show text or hide it
    setTextShown(!textShown);
  }

  // const onTextLayout = useCallback(e => {
  //     setLengthMore(e.nativeEvent.lines.length >= defaultCaptionNumLines + 1); 
  //     //to check the text is more than 1 lines or not
  // },[]);

  useEffect(() => {
    let isMounted = true;
    const numOfLines = caption.split(/\r\n|\r|\n/).length;
    if (numOfLines > 1) {
      isMounted && setLengthMore(true);
    }
    return () => {
      isMounted = false;
      setLengthMore(false);
      setTextShown(false);
    };
  }, []);
    
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('PostDetail', {
            postId: postId
          });
        })}
      >
        <View style={styles.captionAndLineControlContainer}>
          <View style={styles.captionContainer}>
            <Text
              // onTextLayout={onTextLayout}
              numberOfLines={textShown ? undefined : defaultCaptionNumLines}
              style={styles.captionText}
            >
              {caption}
            </Text>
          </View>
          {
            lengthMore 
            ? 
            <TouchableHighlight
              style={styles.textLineControlButton}
              onPress={() => {
                toggleNumberOfLines()
              }}
              underlayColor={color.grey4}
            >
              <Text
                numberOfLines={1}
                style={styles.moreLessText}
              >
                {textShown ? "hide" : "show"}
              </Text>
            </TouchableHighlight>
            : null
          }
        </View>
      </TouchableOpacity>
    </View>
  )
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    borderWidth: 1,
  },
  captionAndLineControlContainer: {
    borderWidth: 1,
    height: '100%',
    flexDirection: 'row',
  },
  captionContainer: {
    flex: 1
  },
  captionText: {
    justifyContent: 'center',
    fontSize: RFValue(17),
  },
  moreLessText: {
    justifyContent: 'center',
    fontSize: RFValue(17),
    color: color.grey3
  }, 
  textLineControlButton: {
    width: RFValue(65),
    height: RFValue(30),
    padding: RFValue(5),
    borderRadius: RFValue(3),
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default postTextContent;
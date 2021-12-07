import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Hooks

import color from '../color';

const ExpandableText = ({ caption, defaultCaptionNumLines }) => {
  const [ textShown, setTextShown ] = useState(false); //To show ur remaining Text
  const [ lengthMore, setLengthMore ] = useState(false); //to show the "Read more & Less Line"

  const navigation = useNavigation();
  
  const toggleNumberOfLines = () => { 
    //To toggle the show text or hide it
    setTextShown(!textShown);
  }

  // const onTextLayout = useCallback(e => {
  //   setLengthMore(e.nativeEvent.lines.length >= defaultCaptionNumLines + 1); 
  //   //to check the text is more than 1 lines or not
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
      <View style={styles.captionAndLineControlContainer}>
        {
          lengthMore 
          ? 
          <TouchableWithoutFeedback
            style={styles.textLineControlButton}
            onPress={() => {
              toggleNumberOfLines()
            }}
          >
            <View style={styles.captionContainer}>
              <Text
                // onTextLayout={onTextLayout}
                numberOfLines={textShown ? undefined : defaultCaptionNumLines}
                style={styles.captionText}
              >
                {caption}
              </Text>
              <Text
                numberOfLines={1}
                style={styles.moreLessText}
              >
                {textShown ? "hide" : "read more"}
              </Text>
            </View>
            
          </TouchableWithoutFeedback>
          : 
          <View style={styles.captionContainer}>
            <Text
              // onTextLayout={onTextLayout}
              numberOfLines={textShown ? undefined : defaultCaptionNumLines}
              style={styles.captionText}
            >
              {caption}
            </Text>
          </View>
        }
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  captionAndLineControlContainer: {
    height: '100%',
    flexDirection: 'row',
  },
  captionContainer: {
    justifyContent: 'center'
  },
  captionText: {
    justifyContent: 'center',
    fontSize: RFValue(17),
    color: color.black1
  },
  moreLessText: {
    justifyContent: 'center',
    fontSize: RFValue(17),
    color: color.grey3
  }, 
});

export default ExpandableText;
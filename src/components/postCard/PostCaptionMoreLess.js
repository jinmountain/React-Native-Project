import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity,
  StyleSheet 
} from 'react-native';

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Hooks


const postTextContent = ({ caption, defaultCaptionNumLines, rootScreen, navigateToPostDetail }) => {
  const [ textShown, setTextShown ] = useState(false); //To show ur remaining Text
  const [ lengthMore, setLengthMore ] = useState(false); //to show the "Read more & Less Line"
  const toggleNumberOfLines = () => { 
    //To toggle the show text or hide it
    setTextShown(!textShown);
  }

  const onTextLayout = useCallback(e => {
      setLengthMore(e.nativeEvent.lines.length >= defaultCaptionNumLines + 1); 
      //to check the text is more than 1 lines or not
  },[]);
    
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        onPress={navigateToPostDetail}
      >
        <Text
          onTextLayout={onTextLayout}
          numberOfLines={textShown ? undefined : defaultCaptionNumLines}
          style={styles.captionText}
        >
          {caption}
        </Text>
      </TouchableOpacity>
      {
        lengthMore 
        ? 
        <View>
          <Text
            numberOfLines={1}
            onPress={() => {
              // if rootScreen is one of them press navigation to detail screen
              if (rootScreen === 'hot' 
                || rootScreen === 'account' 
                || rootScreen === 'businessTagged' 
                || rootScreen === 'userAccount'
              ) {
                navigateToPostDetail()
              }
              // when it is not one of them it is detail screen so use toggleNumberOfLines
              else {
                toggleNumberOfLines()
              }
            }}
            style={styles.moreLessText}
          >
            {textShown ? 'less' : 'more'}
          </Text>
        </View>
        :null
      }
    </View>
  )
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  captionText: {
    justifyContent: 'center',
    fontSize: RFValue(17),
  },
  moreLessText: {
    paddingLeft: RFValue(7),
    justifyContent: 'center',
    fontSize: RFValue(17),
    color: '#5A646A',
  }
});

export default postTextContent;
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Hooks

import color from '../color';

const ExpandableText = ({ caption, defaultCaptionNumLines }) => {
  const [ textShown, setTextShown ] = useState(false); //To show ur remaining Text
  const [ lengthMore, setLengthMore ] = useState(false); //to show the "Read more & Less Line"

  const [ loadMore, setLoadMore ] = useState(false);
  const [ numOfLines, setNumOfLines ] = useState(0);

  const navigation = useNavigation();

  const onLoadMoreToggle = () => {
    setLoadMore(!loadMore);
  }
  const onTextLayout = useCallback(e => {
      if(numOfLines == 0) {
        setNumOfLines(e.nativeEvent.lines.length);
      }
  });

  const backgroundColorAnim = useRef(new Animated.Value(0)).current;

  const dimBackground = Animated.timing(backgroundColorAnim, {
    toValue: 100,
    duration: 100,
    useNativeDriver: false,
  });

  const lightBackground = Animated.timing(backgroundColorAnim, {
    toValue: 0,
    duration: 300,
    useNativeDriver: false,
  });

  const borderColorAnim = useRef(new Animated.Value(0)).current;

  const dimBorderColor = Animated.timing(borderColorAnim, {
    toValue: 100,
    duration: 100,
    useNativeDriver: false,
  });

  const lightBorderColor = Animated.timing(borderColorAnim, {
    toValue: 0,
    duration: 500,
    useNativeDriver: false,
  });

  return (
    <View style={styles.mainContainer}>
      <View style={styles.captionAndLineControlContainer}>
        <Pressable
          style={styles.textLineControlButton}
          onPressIn={() => {
            dimBackground.start();
            dimBorderColor.start();
          }}
          onPressOut={() => {
            lightBackground.start();
            lightBorderColor.start();
            onLoadMoreToggle();
          }}
        >
          <Animated.View 
            style={[
              styles.captionContainer,
              {
                backgroundColor: backgroundColorAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: [color.white2, color.grey4],
                }),
                borderWidth: 1,
                borderColor: borderColorAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: [color.white2, color.grey4],
                })
              }
            ]}
          >
            <Text
              numberOfLines={numOfLines == 0 ? null : loadMore ? numOfLines : defaultCaptionNumLines} 
              onTextLayout={onTextLayout}
              style={styles.captionText}
            >
              {caption}
            </Text>
            {
              numOfLines > defaultCaptionNumLines 
              &&
              <Text
                numberOfLines={1}
                style={styles.moreLessText}
              >
                {loadMore ? 'Show less' :'Read more'}
              </Text>
            }
          </Animated.View>
        </Pressable>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  mainContainer: {

  },
  captionAndLineControlContainer: {
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
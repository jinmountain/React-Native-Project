import React, { useRef } from 'react';
import { 
  View, 
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';

// color
import color from '../../color';

const CustomHighlightButton = ({ content, customStyles, onPress }) => {
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
		<Pressable
      onPressIn={() => {
        dimBackground.start();
        dimBorderColor.start();
      }}
      onPressOut={() => {
        lightBackground.start();
        lightBorderColor.start();
      }}
    >
      <Animated.View 
        style={[
        	{
	        	justifyContent: 'center',
	          backgroundColor: backgroundColorAnim.interpolate({
	            inputRange: [0, 100],
	            outputRange: [color.white2, color.grey4],
	          }),
	          borderWidth: 1,
	          borderColor: borderColorAnim.interpolate({
	            inputRange: [0, 100],
	            outputRange: [color.white2, color.grey4],
	          })
	        },
	        customStyles
        ]}
      >
        {content}
      </Animated.View>
    </Pressable>
	)
};

export default CustomHighlightButton;
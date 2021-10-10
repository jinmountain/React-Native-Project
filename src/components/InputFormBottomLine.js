import React from 'react';
import { View, } from 'react-native';

// Color
import color from '../color';

// #5A646A
const InputFormBottomLine = ({customStyles}) => {
	const defaultStyles = {
    backgroundColor: color.black1,
    height: 0.5, // when it's 0.3 the top input button's bottom line disappears
    opacity: 0.3,
    width: '100%',
  }
	return <View style={[defaultStyles, customStyles]}></View>
};

export { InputFormBottomLine };
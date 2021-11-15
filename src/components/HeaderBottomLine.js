import React from 'react';
import { View, } from 'react-native';

// Color
import color from '../color';

// #5A646A
const HeaderBottomLine = ({customStyles}) => {
	const defaultStyles = {
    backgroundColor: color.black1,
    maxHeight: 1,
    minHeight: 1,
    opacity: 0.3,
    width: '100%',
  }
	return <View style={[defaultStyles, customStyles]}></View>
};

export default HeaderBottomLine;
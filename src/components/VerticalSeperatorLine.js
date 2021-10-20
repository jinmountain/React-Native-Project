import React from 'react';
import { View, } from 'react-native';

// Color
import color from '../color';

// #5A646A
const VerticalSeperatorLine = ({customStyles}) => {
	const defaultStyles = {
    backgroundColor: color.black1,
    minWidth: 1,
    opacity: 0.3,
    height: '90%',
    alignSelf: 'center'
  }
	return <View style={[defaultStyles, customStyles]}></View>
};

export default VerticalSeperatorLine;

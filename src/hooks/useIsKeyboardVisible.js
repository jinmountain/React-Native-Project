import React, { useState, useEffect } from 'react';

import {  
  Keyboard
} from 'react-native';

export default () => {
  const [ isKeyboardVisible, setIsKeyboardVisible ] = useState(false);
  // listen keyboard open close
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = () => {
    setIsKeyboardVisible(true);
  };

  const _keyboardDidHide = () => {
    setIsKeyboardVisible(false);
  };

  return [isKeyboardVisible]
}
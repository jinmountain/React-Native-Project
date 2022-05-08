import React, { useState, useRef, useEffect } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  Pressable,
  Animated,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Designs

// Contexts

// Hooks
import { wait } from '../../hooks/wait';
// Components

// Color
import color from '../../color';

// expo icons
import {
  antdesignHearto,
  antdesignHeart
} from '../../expoIcons';

const PostLikeButton = ({ buttonSize }) => {
  const scaleAnimValue = useRef(new Animated.Value(1)).current;

  const springScaleAnim = (value) => {
    return new Promise ((res, rej) => {
      Animated.spring(scaleAnimValue, {
        toValue: value,
        friction: 1,
        useNativeDriver: false
      }).start(res());
    });
  };

  const timingScaleAnim = (value) => {
    return new Promise ((res, rej) => {
      Animated.timing(scaleAnimValue, {
        toValue: value,
        duration: 500,
        useNativeDriver: false,
      }).start(res());
    })
  }

  const likeAnim = async () => {
    timingScaleAnim(1.5)
    .then(() => {
      wait(300)
      .then(() => {
        springScaleAnim(1);
      })
      
    })
    // await 
    // await ;
  };

  useEffect(() => {
    likeAnim();
  }, []);

  return (
    <Animated.View
      style={[
        {
          justifyContent: 'center',
          alignItems: 'center',
          transform: [
            {
              scale: scaleAnimValue
            }
          ]
        },
      ]}
    >
      {antdesignHeart(RFValue(25), color.red2)}
    </Animated.View>
  )
};

export default PostLikeButton;


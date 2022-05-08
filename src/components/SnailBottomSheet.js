import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView,
  FlatList,
  Text, 
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView,
  Platform,
  StatusBar,
  Pressable
} from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  useDerivedValue,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
} from "react-native-reanimated";

import { PanGestureHandler } from "react-native-gesture-handler";
import { clamp } from "react-native-redash";
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from '@react-navigation/native';

// Components
import MainTemplate from '../components/MainTemplate';
import HeaderBottomLine from '../components/HeaderBottomLine';
import { HeaderForm } from '../components/HeaderForm';
import BottomSheetHeader from '../components/BottomSheetHeader';

// Design

// Hooks
import { useOrientation } from '../hooks/useOrientation';

// color
import color from '../color';

// icon
import expoIcons from '../expoIcons';

const { width: wWidth, height: wHeight } = Dimensions.get("window");

const SnailBottomSheet = ({ 
  header, 
  content, 
  snapPoints,
  snapSwitchs,
  onClickBackground,
  onCloseEnd,
  bottomSheetContainerStyle
}) => {
  const navigation = useNavigation();

  const iosStatusBarHeight = getStatusBarHeight();
  const SafeStatusBar = Platform.select({
    ios: iosStatusBarHeight,
    android: StatusBar.currentHeight,
  });

  // -- orientation and state
    const [ safeWindowHeight, setSafeWindowHeight ] = useState(wHeight - SafeStatusBar);

    const orientation = useOrientation();

    useEffect(() => {
      const safeWindowHeight = wHeight - SafeStatusBar;
      setSafeWindowHeight(safeWindowHeight);

    }, [orientation]);

  // const snapPoints = [ 0, 0.75, 1 ];
  const initialSnapIndex = 1

  const firstSnapSwitch = snapSwitchs[0];
  const thirdSnapSwitch = snapSwitchs[1];

  const firstSnapHeight = safeWindowHeight * snapPoints[0];
  const secondSnapHeight = safeWindowHeight * snapPoints[1];
  const thirdSnapHeight = safeWindowHeight * snapPoints[2];

  const firstSnapAbsY = safeWindowHeight * (1 - snapPoints[0]); // bigger and lower
  const secondSnapAbsY = safeWindowHeight * (1 - snapPoints[1]);
  const thirdSnapAbsY = safeWindowHeight * (1 - snapPoints[2]);
  const bottomAbsY = safeWindowHeight;

  const bottomFirstSnapDistAvg = firstSnapHeight / 2;
  const firstSecondSnapDistAvg = (secondSnapHeight - firstSnapHeight) / 2;
  const secondThirdSnapDistAvg = (thirdSnapHeight - secondSnapHeight) / 2;

  const thirdSnapTranslateY = -(safeWindowHeight * snapPoints[2] - safeWindowHeight * snapPoints[1]);
  const firstSnapTranslateY = safeWindowHeight * snapPoints[1] - safeWindowHeight * snapPoints[0];

  const btwSecondAndThirdAbsY = (secondSnapAbsY + thirdSnapAbsY)/2;
  const btwFirstAndSecondAbsY = (secondSnapAbsY + firstSnapAbsY)/2;

  const bottomSheetHeight = useSharedValue(secondSnapHeight);
  const translateY = useSharedValue(0);
  const snapIndex = useSharedValue(1);

  const goBack = () => {
    navigation.goBack()
  };

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.offsetY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateY.value = event.translationY;

      if (!thirdSnapSwitch) {
        bottomSheetHeight.value = clamp(
          secondSnapHeight - (ctx.offsetY + event.translationY), 
          0, 
          secondSnapHeight + 30
        );
      } 
      else if (!firstSnapSwitch) {
        bottomSheetHeight.value = clamp(
          secondSnapHeight - (ctx.offsetY + event.translationY), 
          secondSnapHeight - 30, 
          safeWindowHeight
        );
      } else if (!firstSnapSwitch && !thirdSnapSwitch) {
        bottomSheetHeight.value = clamp(
          secondSnapHeight - (ctx.offsetY + event.translationY), 
          secondSnapHeight - 30, 
          secondSnapHeight + 30
        );
      } else {
        bottomSheetHeight.value = secondSnapHeight - (ctx.offsetY + event.translationY);
      }
    },
    onEnd: (event, ctx) => {
      if (snapIndex.value === 2) {
        // only go down
        if (event.velocityY > 900 || event.translationY > secondThirdSnapDistAvg) {
          bottomSheetHeight.value = withTiming(secondSnapHeight, {
            duration: 500
          });
          translateY.value = 0;
          snapIndex.value = 1
        } 
        // go back to the third snap 
        else {
          bottomSheetHeight.value = withTiming(thirdSnapHeight, {
            duration: 500
          });
          translateY.value = thirdSnapTranslateY;
          snapIndex.value = 2
        }
      }
      else if (snapIndex.value === 1) {
        // go down
        if (event.velocityY > 900 || event.translationY > firstSecondSnapDistAvg) {
          if (event.velocityY > 1500 || !firstSnapSwitch) {
            runOnJS(onCloseEnd)();
          } else {
            bottomSheetHeight.value = withTiming(firstSnapHeight, {
              duration: 500
            });
            translateY.value = firstSnapTranslateY;
            snapIndex.value = 0
          }
        }
        // go up
        else if (event.velocityY < -900 || event.translationY < -secondThirdSnapDistAvg) {
          if (thirdSnapSwitch) {
            bottomSheetHeight.value = withTiming(thirdSnapHeight, {
              duration: 500
            });
            translateY.value = thirdSnapTranslateY;
            snapIndex.value = 2
          } else {
            bottomSheetHeight.value = withTiming(secondSnapHeight, {
              duration: 500
            });
            translateY.value = 0;
            snapIndex.value = 1
          }
        } 
        // go back to the second snap
        else {
          bottomSheetHeight.value = withTiming(secondSnapHeight, {
            duration: 500
          });
          translateY.value = 0;
          snapIndex.value = 1
        }
      }
      else if (snapIndex.value === 0) {
        // go down
        if (event.velocityY > 900 || event.translationY > bottomFirstSnapDistAvg) {
          runOnJS(onCloseEnd)();
        }
        // go up
        else if (event.velocityY < -900 || event.translationY < -firstSecondSnapDistAvg) {
          bottomSheetHeight.value = withTiming(secondSnapHeight, {
            duration: 500
          });
          translateY.value = 0;
          snapIndex.value = 1
        }
        else {
          bottomSheetHeight.value = withTiming(firstSnapHeight, {
            duration: 500
          });
          translateY.value = firstSnapTranslateY;
          snapIndex.value = 0;
        }
      } else {
        bottomSheetHeight.value = withTiming(secondSnapHeight, {
          duration: 500
        });
        translateY.value = 0;
        snapIndex.value = 1
      }
    }
  });

  const bottomSheetAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: bottomSheetHeight.value
    };
  });

  return (
    <View style={{ 
      position: 'absolute', 
      width: '100%', 
      height: '100%', 
      justifyContent: 'flex-end',
      zIndex: 6,
    }}>
      <Pressable
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
        ]}
        onPress={
          onClickBackground
          ?
          onClickBackground
          :
          null
        }
      />
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View
          style={[
            styles.bottomSheetContainer,
            bottomSheetAnimatedStyle,
            bottomSheetContainerStyle,
          ]}
        >
          {header}
          {content}
        </Animated.View>
      </PanGestureHandler>
    </View>
  )
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    backgroundColor: color.white2,
  },
});

export default SnailBottomSheet;
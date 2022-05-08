import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableHighlight,
  Animated,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { 
  State,
  PanGestureHandler, 
} from "react-native-gesture-handler";

// npms

// Components
import HeaderBottomLine from './HeaderBottomLine';

// Design
// color
import color from '../color';

// icon
import {
  antClose,
  entypoList,
} from '../expoIcons';

const BottomSheetHeader = ({ 
  headerText, 
  settingButton,
  closeButtonOnPress,
}) => {
  const [ showSetting, setShowSetting ] = useState(false);

  const onSingleTap = (event: TapGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      console.log("I'm touched");
      console.log("event: ", event);
    }
  };

  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const onGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    {useNativeDriver: true},
  );

  return (
    <>
      <View 
        style={styles.bottomSheetHeaderContainer}
      > 
        <View style={styles.bottomSheetHeaderInner}>
          <View style={styles.sliderIndicatorContainer}>
            <View style={styles.sliderIndicator}/>
          </View>
          <View style={styles.bottomSheetHeaderBottomContainer}>
            <View style={styles.bottomSheetHeaderTitleContainer}>
              <Text style={styles.bottomSheetHeaderTitleText}>
                {
                  headerText
                }
              </Text>
            </View>
            <View style={styles.buttonsContainer}>
              <PanGestureHandler
                onGestureEvent={onGestureEvent}
              >
                <Animated.View>
                  <TouchableHighlight
                    style={styles.bottomSheetHeaderCloseButton}
                    underlayColor={color.grey4}
                    onPress={() => {
                      setShowSetting(!showSetting);
                    }}
                  >
                    {entypoList(RFValue(21), color.black1)}
                  </TouchableHighlight>
                </Animated.View>
              </PanGestureHandler>
              <TouchableHighlight
                style={styles.bottomSheetHeaderCloseButton}
                underlayColor={color.grey4}
                onPress={closeButtonOnPress}
              >
                {antClose(RFValue(21), color.black1)}
              </TouchableHighlight>
            </View>
          </View>
        </View>
        <HeaderBottomLine />
      </View>
      {
        showSetting &&
        <Animated.View 
          style={[
            { 
              position: 'absolute', 
              zIndex: 10 
            },
            {
              transform: [
                  { translateX: translateX },
                  { translateY: translateY },
              ],
            }
          ]}
        >
          <Text>Top Comments</Text>
        </Animated.View>
      }
    </>
  )
};

const styles = StyleSheet.create({
  bottomSheetHeaderContainer: {
    backgroundColor: color.white2,
    height: RFValue(55),
    width: "100%", 
    borderTopLeftRadius: RFValue(9),
    borderTopRightRadius: RFValue(9),
  },
  bottomSheetHeaderInner: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomSheetHeaderTitleText: {
    fontSize: RFValue(19),
    color: color.black1,
    fontWeight: 'bold'
  },
  sliderIndicatorContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  sliderIndicator: {
    width: 50,
    height: 5,
    backgroundColor: color.grey1,
    borderRadius: 100
  },
  bottomSheetHeaderBottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: RFValue(15),
  },
  bottomSheetHeaderTitleContainer: {
    paddingLeft: RFValue(10),
    justifyContent: 'center',
  },
  bottomSheetHeaderCloseButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: RFValue(10),
    width: RFValue(35),
    height: RFValue(35),
    borderRadius: RFValue(35)
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: 'center',
  },
});

export default BottomSheetHeader;
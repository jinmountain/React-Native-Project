import React, { useRef, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  TouchableHighlight, 
  Text, 
  Platform, 
  Animated 
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const platform = Platform.OS;

// Designs
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

// Color
import color from '../color';

// sizes
import sizes from '../sizes';

// Components
import HeaderBottomLine from './HeaderBottomLine';
import AnimHighlight from './buttons/AnimHighlight';

const headerBoxHeight = sizes.headerBoxHeight;

const HeaderForm = (
  {
    leftButtonTitle, 
    leftButtonIcon,
    leftCustomButtonIcon,
    headerTitle,
    rightButtonTitle,
    rightButtonIcon,
    rightCustomButtonIcon,
    rightButtonIconTextCustomStyle,
    leftButtonPress,
    rightButtonPress,
    headerCustomStyle,
    customTextColor,
    middleTitleTextCustomStyle,
    customUnderlayColor
  }
) => {

  const [ isPad, setIsPad ] = useState(Platform.isPad);

  return (
    <View style={[ styles.headerContainer, headerCustomStyle ]}>
      <View style={styles.compartmentOuter}>
        <View style={styles.leftCompartmentContainer}>
          <View style={styles.leftCompartmentInnerContainer}>
            {
              leftCustomButtonIcon
              ? leftCustomButtonIcon
              :
              leftButtonIcon &&
              <AnimHighlight 
                customStyles={
                  styles.compartmentHighlight
                }
                onPressOutAction={leftButtonPress}
                // deplayPressIn={500}
                // onPressIn={() => {
                //   console.log("HAHA");
                // }}
                underlayColor={
                  customUnderlayColor
                  ?
                  customUnderlayColor
                  :
                  color.grey4
                }
                content={
                  <View style={styles.compartmentIconContainer}>
                    <Text style={styles.buttonIconText}>{leftButtonIcon}</Text>
                  </View>
                }
              >
              </AnimHighlight>
            }
            {
              leftButtonTitle &&
              <View style={styles.compartmentTextContainer}>
                <Text style={styles.compartmentText}>{leftButtonTitle}</Text>
              </View>
            }
          </View>
        </View>
        <View style={styles.middleCompartmentContainer}>
          <View
            style={styles.middleTitleTextContainer}
          >
            <Text 
              style={
                middleTitleTextCustomStyle
                ?
                [ styles.headerTitle, middleTitleTextCustomStyle]
                :
                styles.headerTitle
              }
            >
              {headerTitle}
            </Text>
          </View>
        </View>
        <View style={styles.rightCompartmentContainer}>
          <View style={styles.rightCompartmentInnerContainer}>
            {
              rightButtonTitle &&
              <View style={styles.compartmentTextContainer}>
                <Text style={styles.compartmentText}>
                  {rightButtonTitle}
                </Text>
              </View>
            }
            { 
              rightCustomButtonIcon
              ? rightCustomButtonIcon
              :
              rightButtonIcon &&
              <AnimHighlight 
                customStyles={
                  styles.compartmentHighlight
                }
                onPressOutAction={rightButtonPress}
                // deplayPressIn={500}
                // onPressIn={() => {
                //   console.log("HAHA");
                // }}
                underlayColor={
                  customUnderlayColor
                  ?
                  customUnderlayColor
                  :
                  color.grey4
                }
                content={
                  <View style={styles.compartmentIconContainer}>
                    <Text style={[styles.buttonIconText, rightButtonIconTextCustomStyle]}>
                      {rightButtonIcon}
                    </Text>
                  </View>
                }
              >
              </AnimHighlight>
            }
          </View>
        </View>
      </View>
      {/*<HeaderBottomLine />*/}
    </View>
  )
};

const styles = StyleSheet.create({
  headerContainer: {
    height: headerBoxHeight,
    justifyContent: "center",
    backgroundColor: color.white2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    // for android
    elevation: 5,
    // for ios
    zIndex: 5,
  },

  compartmentOuter: {
    flex: 1, 
    height: headerBoxHeight,
  },

  compartmentIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  compartmentTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  compartmentText: {
    fontSize: RFValue(17),
  },

  leftCompartmentContainer: {
    position: 'absolute',
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  middleCompartmentContainer: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: headerBoxHeight
  },
  middleTitleTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightCompartmentContainer: {
    position: 'absolute',
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  leftCompartmentInnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  rightCompartmentInnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  compartmentHighlight: {
    justifyContent: 'center',
    alignItems: 'center',
    width: headerBoxHeight,
    height: headerBoxHeight,
    borderRadius: RFValue(100),
  },
  headerTitle: {
    fontSize: RFValue(17),
    color: color.black1,
  },
  buttonIconText: {
    fontSize: RFValue(15)
  },
});

export { HeaderForm };
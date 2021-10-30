import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableHighlight, Text, Platform, Animated } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const platform = Platform.OS;

// Designs
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

// Color
import color from '../color';

// Components
import HeaderBottomLine from './HeaderBottomLine';

const headerIconFinder = (iconName) => {
  if (iconName === 'Back') {
    return <Ionicons name="md-arrow-back" size={RFValue(24)} color={color.black1} />
  } 
  else if (iconName === 'Cancel') {
    return <Feather name="x" size={RFValue(24)} color={color.black1} />
  }
  else if (iconName === 'Confirm') {
    return <AntDesign name="check" size={RFValue(24)} color={color.black1} />
  }
  else {
    return <Text style={styles.customText}>{iconName}</Text>
  }
}

const HeaderForm = (
  {
    leftButtonTitle, 
    leftButtonIcon,
    headerTitle,
    headerIcon,
    rightButtonTitle,
    rightButtonIcon,
    leftButtonPress,
    rightButtonPress,
    customBackgroundColor,
    customTextColor
  }
) => {

  return (
    <View 
      style={
        customBackgroundColor
        ?
        [styles.headerContainer, { backgroundColor: customBackgroundColor }]
        :
        styles.headerContainer
      }
    >
      <View style={styles.compartmentOuter}>
        <View style={styles.leftCompartmentContainer}>
          <View style={styles.leftCompartmentInnerContainer}>
            <TouchableHighlight 
              style={ 
                styles.compartmentHighlight 
              }
              onPress={leftButtonPress}
              // deplayPressIn={500}
              // onPressIn={() => {
              //   console.log("HAHA");
              // }}
              underlayColor={color.grey4}
            >
              <View style={styles.compartment}>
                {
                  leftButtonIcon &&
                  <View style={styles.compartmentIconContainer}>
                    {leftButtonIcon}
                  </View>
                }
                {
                  leftButtonTitle &&
                  <View style={styles.compartmentTextContainer}>
                    <Text style={styles.compartmentText}>{leftButtonTitle}</Text>
                  </View>
                }
              </View>
            </TouchableHighlight>
          </View>
        </View>
        <View style={styles.middleCompartmentContainer}>
          <View
            style={styles.headerCompartmentContainer}
          >
            <Text 
              style={
                customTextColor
                ?
                [ styles.headerTitle, { color: customTextColor }]
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
            <TouchableHighlight 
              style={styles.compartmentHighlight}
              onPress={rightButtonPress}
              underlayColor={color.grey4}
            >
              <View style={styles.compartment}>
                {
                  rightButtonIcon &&
                  <View style={styles.compartmentIconContainer}>
                    {rightButtonIcon}
                  </View>
                }
                {
                  rightButtonTitle &&
                  <View style={styles.compartmentTextContainer}>
                    <Text style={styles.compartmentText}>{rightButtonTitle}</Text>
                  </View>
                }
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </View>
      {/*<HeaderBottomLine />*/}
    </View>
  )
};

const styles = StyleSheet.create({
  headerContainer: {
    height: RFValue(70),
    justifyContent: "center",
    backgroundColor: color.white2,
    // ...Platform.select({
    //   android: {
    //     marginTop: '7%',
    //   },
    //   ios: {
    //     marginTop: '11%',
    //   },
    //   default: {
    //     marginTop: '7%',
    //   }
    // })
    shadowColor: "#000",
    shadowRadius: 3,
    shadowOpacity: 0.3,
    shadowOffset: { 
      width: 0,
      height: 3, 
    },
  },

  compartment: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compartmentIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(13),
  },
  compartmentTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  compartmentText: {
    fontSize: RFValue(17),
  },

  compartmentOuter: {
    flex: 1, 
    justifyContent: 'center'
  },

  leftCompartmentContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  middleCompartmentContainer: {
    position: 'absolute',
    alignSelf: 'center',
  },
  rightCompartmentContainer: {
    position: 'absolute',
    alignSelf: 'flex-end',
  },
  leftCompartmentInnerContainer: {
    paddingLeft: RFValue(65),
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightCompartmentInnerContainer: {
    paddingRight: RFValue(65),
    justifyContent: 'center',
    alignItems: 'center',
  },
  compartmentHighlight: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: RFValue(70),
    height: RFValue(70),
    borderRadius: RFValue(100),
  },
  headerTitle: {
    fontSize: RFValue(18),
    color: color.black1,
  },
  customText: {
    fontSize: RFValue(16),
    color: color.black1,
  },
});

export { HeaderForm };
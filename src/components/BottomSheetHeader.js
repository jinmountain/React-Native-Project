import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableHighlight,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// npms

// Components
import HeaderBottomLine from './HeaderBottomLine';

// Design
// color
import color from '../color';

// icon
import {antClose} from '../expoIcons';

const BottomSheetHeader = ({ headerText, closeButtonOnPress }) => {
  return (
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
          <TouchableHighlight
            style={styles.bottomSheetHeaderCloseButton}
            underlayColor={color.grey4}
            onPress={closeButtonOnPress}
          >
            {antClose(RFValue(19), color.black1)}
          </TouchableHighlight>
        </View>
      </View>
      <HeaderBottomLine />
    </View>
  )
};

const styles = StyleSheet.create({
  bottomSheetHeaderContainer: {
    height: RFValue(55),
    width: "100%", 
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
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
    width: 35,
    height: 7,
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
});

export default BottomSheetHeader;
import React from 'react';
import { 
	Text, 
	View, 
	TextInput, 
	StyleSheet, 
	TouchableHighlight
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import color from '../../color';

const THButtonWithBorder = ({ icon, text, onPress, value, valueEffect, valueEffectTextStyle, valueEffectIcon }) => {
	return (
    value
    ?
    <TouchableHighlight
      style={{ ...styles.buttonContainer, ...valueEffect }}
      onPress={onPress}
      underlayColor={color.grey4}
    >
      <View style={styles.button}>
        {valueEffectIcon}
        <Text style={[ styles.buttonText, valueEffectTextStyle ]}>
          {text}
        </Text>
      </View>
    </TouchableHighlight>
    :
    <TouchableHighlight
      style={styles.buttonContainer}
      onPress={onPress}
      underlayColor={color.grey4}
    >
      <View style={styles.button}>
        {icon}
        <Text style={styles.buttonText}>
          {text}
        </Text>
      </View>
    </TouchableHighlight>
	)
};

const styles = StyleSheet.create({
  buttonContainer: {
    height: RFValue(37),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#FFF",
    borderRadius: RFValue(10),
    borderWidth: RFValue(1),
    borderColor: color.grey1,
    paddingHorizontal: RFValue(13),
    paddingVertical: RFValue(9),
    marginHorizontal: RFValue(3),
  },
  button: {
  	flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: color.black1,
  	paddingHorizontal: RFValue(3),
    fontSize: RFValue(17),
  }
});

export default THButtonWithBorder;
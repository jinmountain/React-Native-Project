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

const THButtonWithBorder = ({ icon, text, onPress, value, valueEffect }) => {
	return (
    value
    ?
    <TouchableHighlight
      style={{ ...styles.buttonContainer, ...valueEffect }}
      onPress={onPress}
      underlayColor={color.gray4}
    >
      <View style={styles.button}>
        {icon}
        <Text style={styles.buttonText}>
          {text}
        </Text>
      </View>
    </TouchableHighlight>
    :
    <TouchableHighlight
      style={styles.buttonContainer}
      onPress={onPress}
      underlayColor={color.gray4}
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
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: color.gray1,
    paddingHorizontal: RFValue(13),
    paddingVertical: RFValue(9),
    marginHorizontal: RFValue(3),
  },
  button: {
  	flexDirection: 'row',
  },
  buttonText: {
  	paddingHorizontal: RFValue(3),
    fontSize: RFValue(17),
  }
});

export default THButtonWithBorder;
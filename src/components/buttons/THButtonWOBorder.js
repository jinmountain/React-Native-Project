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

const THButtonWOBorder = ({ icon, text, onPress }) => {
	return (
		<TouchableHighlight
			style={styles.buttonContainer}
      onPress={onPress}
      underlayColor={color.grey4}
		>
      <View style={styles.button}>
      	{icon}
        { 
          text
          ?
          <Text style={styles.buttonText}>
            {text}
          </Text>
          : null
        }
      </View>
    </TouchableHighlight>
	)
};

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RFValue(10),
    paddingHorizontal: RFValue(11),
    paddingVertical: RFValue(9),
    marginHorizontal: RFValue(3),
  },
  button: {
  	flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
  	paddingHorizontal: RFValue(13),
    fontSize: RFValue(17),
    color: color.black1,
  }
});

export default THButtonWOBorder;
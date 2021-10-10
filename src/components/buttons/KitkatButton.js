import React from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  TouchableHighlight,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Designs

// Contexts

// Hooks

// Components

// Color
import color from '../../color';

const KitkatButton = ({ icon, text, onPress }) => {
	return (
		<TouchableHighlight
      style={styles.buttonContainer}
      onPress={onPress}
      underlayColor={color.grey4}
    >
      <View style={styles.button}>
        <View style={styles.buttonIconContainer}>
          {icon}
        </View>
        <Text style={styles.buttonText}>
          {text}
        </Text>
      </View>
    </TouchableHighlight>
	)
}

const styles = StyleSheet.create({
  buttonContainer: {
    height: RFValue(57),
    justifyContent: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(21),
  },
  buttonText: {
    fontSize: RFValue(15),
  },
});

export default KitkatButton;
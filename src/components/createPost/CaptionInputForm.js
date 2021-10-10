import React, { useContext }from 'react';
import { Text, View, TextInput, StyleSheet, } from 'react-native';
import Spacer from '../Spacer';
import { Context as PostContext } from '../../context/PostContext';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import { InputFormBottomLine } from '../InputFormBottomLine';

// Color
import color from '../../color';

const CaptionInputForm = ({caption, changeCaption}) => {
	// const { 
	// 	state: { caption,}, 
	// 	changeCaption 
	// } = useContext(PostContext);

	return (
		<View style={styles.captionInputFormContainer}>
			<View style={styles.textInputLabelContainer}>
				{ caption 
					? <Text style={styles.textInputLabel}>Caption</Text>
					: null
				}
			</View>
			<TextInput 
				style={styles.captionInput}
				value={caption} 
				onChangeText={changeCaption} 
				placeholderTextColor={color.gray3}
				placeholder="Write about your new post."
				multiline={true}
				maxLength={300}
				autoCapitalize="none"
      	autoCorrect={false}
      	underlineColorAndroid="transparent"
			/>
			<InputFormBottomLine customStyles={{borderColor: color.gray1, marginTop: RFValue(3)}}/>
		</View>
	);
};

const styles = StyleSheet.create({
	captionInputFormContainer: {
		marginHorizontal: RFValue(10),
	},
	textInputLabelContainer: {
		minHeight: RFValue(25),
		paddingVertical: RFValue(11),
	},
  textInputLabel: {
	  fontSize: RFValue(12),
	  marginTop: RFValue(10),
	  color: color.gray3,
  },
  captionInput: {
    fontSize: RFValue(17),
  	paddingHorizontal: 10,
  	height: RFValue(75),
  },
});

export default CaptionInputForm;
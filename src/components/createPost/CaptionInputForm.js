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
			<View style={styles.textInputContainer}>
				<View style={styles.verticalLine}/>
				<TextInput 
					style={styles.captionInput}
					value={caption} 
					onChangeText={changeCaption} 
					placeholderTextColor={color.grey1}
					placeholder="Write about your new post."
					multiline={true}
					maxLength={300}
					autoCapitalize="none"
	      	autoCorrect={false}
	      	underlineColorAndroid="transparent"
				/>
				<View style={styles.verticalLine}/>
			</View>
			{/*<InputFormBottomLine customStyles={{backgroundColor: color.black1, marginTop: RFValue(3)}}/>*/}
		</View>
	);
};

const styles = StyleSheet.create({
	captionInputFormContainer: {
		marginHorizontal: RFValue(10),
	},
	textInputLabelContainer: {
		minHeight: RFValue(40),
	},
  textInputLabel: {
	  fontSize: RFValue(12),
	  marginTop: RFValue(10),
	  color: color.black1,
  },
  captionInput: {
  	width: '100%',
    fontSize: RFValue(17),
    paddingLeft: RFValue(10),
  	height: RFValue(90),
  	borderRadius: RFValue(15),
  },
  textInputContainer: {
  	flexDirection: 'row'
  },
  verticalLine: {
  	width: 1,
  	backgroundColor: color.black1,
  },
});

export default CaptionInputForm;
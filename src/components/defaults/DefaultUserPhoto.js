import React from 'react';
import { StyleSheet, View, } from 'react-native';

// Designs
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
// NPMs
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// color
import color from '../../color';

const DefaultUserPhoto = ({customSizeBorder, customSizeUserIcon, customColor}) => {
	return (
		<View 
			style={{ 
				...styles.defaultPhotoContainer, 
				...{ 
					borderColor: customColor ? customColor : color.grey1,
					width: customSizeBorder ? customSizeBorder : RFValue(77),
					height: customSizeBorder ? customSizeBorder : RFValue(77),
				} 
			}}
		>
			<Feather 
				name="user" 
				size={ customSizeUserIcon ? customSizeUserIcon : RFValue(48) } 
				color={ customColor ? customColor : color.grey1 }
			/>
		</View>
	)
};

const styles = StyleSheet.create({ 
	defaultPhotoContainer: {
		borderWidth: RFValue(1),
		borderRadius: RFValue(100),
		justifyContent: 'center',
		alignItems: 'center',
	} 
});

export default DefaultUserPhoto;
import React from 'react';
import { 
	Text, 
	View, 
	TextInput, 
	StyleSheet,
	TouchableOpacity,
} from 'react-native';

const ManagerDropDown = ({ customStyles}) => {

	return (
		<View style={[styles.managerDropDownContainer, customStyles]}>
			<View>
				<TouchableOpacity>
					<Text>Edit</Text>
				</TouchableOpacity>
			</View>
				<TouchableOpacity>
					<Text>Delete</Text>
				</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	managerDropDownContainer: {
		alignSelf: 'flex-start',
		elevation: 8,
		position: 'absolute',
		borderWidth: 1,
		backgroundColor: '#fff',
		width: 150,
		height: 100,
    shadowColor: "#000",
    shadowRadius: 2,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
	}
});

export default ManagerDropDown;
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import { NavigationBar } from './NavigationBar';

// Hooks
import { useOrientation } from '../hooks/useOrientation';

const MainTemplate = ({ children, disableMarginTop }) => {
	const orientation = useOrientation();
	return (
		<View style={
			disableMarginTop
			? styles.safeAreaContainer
			:
			{ 
				...styles.safeAreaContainer, 
				...{ ...Platform.select({
		      android: {
		        paddingTop: orientation === 'LANDSCAPE' ? '3.5%' : '7%' ,
		      },
		      ios: {
		        paddingTop: '11%',
		      },
		      default: {
		        paddingTop: '7%',
		      }
		    })} 
			}
		}>
			{children}
		</View>
  );
};

const styles = StyleSheet.create({
	safeAreaContainer: {
		backgroundColor: 'white',
		flex: 1,
		elevation: 6
	},
});

export default MainTemplate;
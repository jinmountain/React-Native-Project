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
		        marginTop: orientation === 'LANDSCAPE' ? '3.5%' : '7%' ,
		      },
		      ios: {
		        marginTop: '11%',
		      },
		      default: {
		        marginTop: '7%',
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
		flex: 1,
	},
});

export default MainTemplate;
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { NavigationBar, currentUser } from '../components/NavigationBar';
import { SafeAreaView, } from 'react-native-safe-area-context';

const ListSearchScreen = () => {
	return (
		<SafeAreaView>
			<View>
				<Text>List Search Screen</Text>
			</View>
			<View>
				<NavigationBar />
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({});
export default ListSearchScreen;
import React from 'react';
import { Text, StyleSheet } from 'react-native';

const SearchDetailScreen = ({ route, navigation }) => {
	const { uri } = route.params;
	console.log(uri);
	return (
		<ContentCreateForm />
	)
};

const styles = StyleSheet.create({});
export default SearchDetailScreen;
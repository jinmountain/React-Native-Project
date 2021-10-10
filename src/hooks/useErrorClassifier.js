import React from 'react'
import { navigate } from '../navigationRef';

export default () => {
	const errorClassifier = (errorType) => {
		if (errorType === 'location') {
			navigate('Error', { message: 'Enable your location service.' })
		}
	};

	return [errorClassifier];
};
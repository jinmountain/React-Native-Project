import { useState, useEffect } from 'react';
import { 
	Accuracy, 
	//requestPermissionsAsync,
	requestForegroundPermissionsAsync, 
	watchPositionAsync 
} from 'expo-location';
import useErrorClassifier from './useErrorClassifier';

export default (shouldTrack, callback) => {
	const [errorClassifier] = useErrorClassifier();
	const [locationError, setLocationError] = useState(null);

	useEffect(() => {
		let subscriber;
		const startWatching = async () => {
			try {
				await requestForegroundPermissionsAsync();
				subscriber = await watchPositionAsync({
					accuracy: Accuracy.BestForNavigation,
					timeInterval: 3600000, // 1 hour
					distacneInterval: 1000
				}, 
				callback
				);
			} catch (e) {
				setLocationError(e);
			}
		}

		if (shouldTrack) {
			startWatching();
		} else {
			if (subscriber) {
				subscriber.remove();
			}
			subscriber = null;
		}

		return () => {
			if(subscriber) {
				subscriber.remove();
			}
		};
	}, [shouldTrack]);

	return [locationError];
};
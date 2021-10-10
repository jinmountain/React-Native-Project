import { keys } from "../config/keys";
import Geocoder from 'react-native-geocoding';

Geocoder.init(keys.googleAPIKey.APIKey);

const getAddressWithCoords = (currentLocation) => {
	return new Promise ((res, rej) => {
		Geocoder.from(currentLocation.latitude, currentLocation.longitude)
	  .then(json => {
			var addressComponent = json.results;
			res(addressComponent);
	  })
	  .catch(error => console.warn(error));
	});
};

// SKU: Geocoding
// A Geocoding SKU is charged for requests to the Geocoding API or the Maps JavaScript API’s Geocoding service.

// MONTHLY VOLUME RANGE
// (Price per REQUEST)
// 0–100,000	        100,001–500,000	     500,000+
// 0.005 USD per each   0.004 USD per each   Contact Sales for volume pricing
// (5.00 USD per 1000)  (4.00 USD per 1000)  


const getAddressWithAddress = (address) => {
	return new Promise ((res, rej) => {
		Geocoder.from(address)
		.then(json => {
			var addressComponent = json.results;
			res(addressComponent);
		})
		.catch(error => console.warn(error));
	});
};

export default {
	getAddressWithCoords,
	getAddressWithAddress
};
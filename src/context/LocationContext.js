import createDataContext from './createDataContext';

const locationReducer = (state, action) => {
	switch(action.type) {
		case 'add_location_type':
			return { ...state, locationType: action.payload };
		case 'clear_location_type':
			return { ...state, locationType: null };

		case 'add_current_location':
			return { ...state, currentLocation: action.payload };
		case 'add_search_location':
			return { ...state, searchLocation: action.payload };
		case 'clear_location':
			return { ...state, currentLocation: null };
		case 'add_business_location':
			return { ...state, businessLocation: action.payload };
		case 'drag_add_location':
			return { ...state, businessLocation: action.payload };
		case 'clear_business_location':
			return { ...state, businessLocation: null };

		case 'reset_locations_address':
			return { 
				...state,
				locationType: null,
				currentLocation: null, 
				businessLocation: null, 
			};

		default:
			return state;
	}
};

const addLocationType = dispatch => (locationType) => {
	dispatch({ type: 'add_location_type', payload: locationType });
	console.log(locationType);
};

const clearLocationType = dispatch => () => {
	dispatch({ type: 'clear_location_type' });
}

const addLocation = dispatch => (location) => {
	dispatch({ 
		type: 'add_current_location', 
		payload: 
		{ 
			latitude: location.coords.latitude, 
			longitude: location.coords.longitude 
		}
	});
	console.log("Current location added: ", { 
		latitude: location.coords.latitude, 
		longitude: location.coords.longitude 
	});
};

const addSearchLocation = dispatch => (location) => {
	dispatch({
		type: 'add_search_location',
		payload: location
	});
	console.log("Added a search location: ", location);
};

const clearLocation = dispatch => () => {
	dispatch({ type: 'clear_location' });
	console.log('Cleared the location.');
};

const addBusinessLocation = dispatch => (location) => {
	dispatch({ type: 'add_business_location', payload: location });
	console.log('Added business location: ', location);
};

const dragAddBusinessLocation = dispatch => (location) => {
	console.log("Dragged to: ", location);
	dispatch({ type: 'drag_add_location', payload: location });
};

const clearBusinessLocation = dispatch => () => {
	dispatch({ type: 'clear_business_location' });
	console.log('Cleared the location.');
};

const resetLocationsAddress = dispatch => () => {
	dispatch({ type: 'reset_locations_address'});
	console.log('Reset location and address context data.');
};

export const { Context, Provider } = createDataContext(
	locationReducer,
	{
		addLocationType,
		clearLocationType,

		addLocation,
		addSearchLocation,
		clearLocation, 
		addBusinessLocation, 
		dragAddBusinessLocation, 
		clearBusinessLocation,
		resetLocationsAddress, 
	},
	{ 
		locationType: null,
		currentLocation: null, 
		searchLocation: null,
		businessLocation: null, 
	}
);
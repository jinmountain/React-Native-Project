import createDataContext from './createDataContext';

const authReducer = (state, action) => {
	switch (action.type) {
		// navigation status
		case 'tab_home':
			return { ...state, homeTab: true, searchTab: false, activityTab: false, accountTab: false };
		case 'tab_search':
			return { ...state, homeTab: false, searchTab: true, activityTab: false, accountTab: false };
		case 'tab_activity':
			return { ...state, homeTab: false, searchTab: false, activityTab: true, accountTab: false };
		case 'tab_account':
			return { ...state, homeTab: false, searchTab: false, activityTab: false, accountTab: true };

		default:
			return state;
	}
};

const trimmer = (string) => {
	return string.trim();
};

// navigation bar status
const tabHome = dispatch => () => {
	dispatch({ type: 'tab_home' });
};

const tabSearch = dispatch => () => {
	dispatch({ type: 'tab_search' });
};

const tabActivity = dispatch => () => {
	dispatch({ type: 'tab_activity' });
};

const tabAccount = dispatch => () => {
	dispatch({ type: 'tab_account' });
};

export const { Provider, Context } = createDataContext(
	authReducer,
	{
		// navigation bar status
		tabHome,
		tabSearch,
		tabActivity,
		tabAccount,
	},
	{ 
		// navigation bar status
		homeTab: true,
		searchTab: false,
		activityTab: false,
		accountTab: false,
	}
);
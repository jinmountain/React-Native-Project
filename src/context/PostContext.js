import createDataContext from './createDataContext';
// get users
import usersGetFire from '../firebase/usersGetFire';

const timestamp = () => {
  return Date.now()
};

const hasWhiteSpace = (s) => {
  if (/\s/g.test(s) === true) {
    return true;
  } else {
  	return false;
  }
};

const postReducer = (state, action) => {
	switch (action.type) {
		// Search Screen
		// Add a business user to pull its posts
		case 'add_business_user_search':
			return { ...state, businessUserSearch: action.payload };
		// Search businesses around a selected location
		case 'search_business_users_near':
			return { ...state, businessUsersNear: action.payload };
		case 'switch_initial_search':
			return { ...state, initialSearchSwitch: action.payload };
		// Search screen get tagged posts
		case 'add_business_tagged_posts':
			return { ...state, businessTaggedPosts: [...state.businessTaggedPosts, ...action.payload] };
		case 'add_business_tagged_post_last':
			return { ...state, businessTaggedPostLast: action.payload };
		case 'switch_business_tagged_post_fetch':
			return { ...state, businessTaggedPostFetchSwitch: action.payload };
		case 'change_business_tagged_post_state':
			return { ...state, businessTaggedPostState: action.payload };
		// Search screen get user posts
		case 'add_business_user_posts':
			return { ...state, businessUserPosts: [...state.businessUserPosts, ...action.payload] };
		case 'add_business_user_post_last':
			return { ...state, businessUserPostLast: action.payload };
		case 'switch_businss_user_post_fetch':
			return { ...state, businessUserPostFetchSwitch: action.payload };
		case 'change_business_user_post_state':
			return { ...state, businessUserPostState: action.payload };

		case 'reset_business_posts':
			return { ...state, 
				businessTaggedPosts: [],
				businessUserPosts: [],
				businessTaggedPostLast: null,
				businessUserPostLast: null,
			};
		
		// Account Screen
		case 'add_account_post_last':
			return { ...state, accountPostLast: action.payload };

		// account screen display post
		case 'add_account_display_post_last':
			return { ...state, accountDisplayPostLast: action.payload };

		// Hot Post
		case 'add_hot_post_last':
			return { ...state, hotPostLast: action.payload };

		// User account screen
		case 'add_user_account_post_last':
			return { ...state, userAccountPostLast: action.payload };

		// User account screen display post
		case 'add_user_account_display_post_last':
			return { ...state, userAccountDisplayPostLast: action.payload };

		// Activity screen add last reservation from query
		case 'add_upcoming_rsv_last':
			return { ...state, upcomingRsvLast: action.payload };
		case 'add_previous_rsv_last':
			return { ...state, previousRsvLast: action.payload };

		case 'clear_upcoming_rsv_last':
			return { ...state, upcomingRsvLast: null };
		case 'clear_previous_rsv_last':
			return { ...state, previousRsvLast: null };

		// chat screen display post
		case 'add_chat_display_post_last':
			return { ...state, chatScreenDisplayPostLast: action.payload };
		case 'clear_chat_display_post_last':
			return { ...state, chatScreenDisplayPostLast: null };

		default:
			return state;
	}
};

// search screen
const getBusinessUsersNear = dispatch => async (currentLocation, searchDistance) => {
	getUsers = usersGetFire.getBusinessUsersNearFire(currentLocation, searchDistance);
	getUsers
	.then((users) => {
		console.log("Business users in distance: ", users.length);
		dispatch({ type: 'search_business_users_near', payload: users });
	})
	.catch((error) => {
		console.log("Error occured: postContext: getBusinessUsersNear: ", error);
	});
};

const switchInitialSearch = dispatch => (switchButton) => {
	dispatch({
		type: 'switch_initial_search',
		payload: switchButton
	});
	console.log("Search near businesses switch: ", switchButton);
};

const addBusinessUserSearch = dispatch => (businessUser) => {
	dispatch({ type: 'add_business_user_search', payload: businessUser });
	console.log("businessUser >> ", businessUser);
};

// account screen

// home screen hot posts

// user account screen

// Activity Screen
const addUpcomingRsvLast = dispatch => (rsvLast) => {
	dispatch({ type: 'add_upcoming_rsv_last', payload: rsvLast });
};

const addPreviousRsvLast = dispatch => (rsvLast) => {
	dispatch({ type: 'add_previous_rsv_last', payload: rsvLast });
};

const clearUpcomingRsvLast = dispatch => () => {
	dispatch({ type: 'clear_upcoming_rsv_last' });
};

const clearPreviousRsvLast = dispatch => () => {
	dispatch({ type: 'clear_previous_rsv_last' });
}

// chat screen display post
const addChatScreenDisplayPostLast = dispatch => (lastDisplayPost) => {
	dispatch({ type: 'add_chat_display_post_last', payload: lastDisplayPost });
};

const clearChatScreenDisplayPostLast = dispatch => () => {
	dispatch({ type: 'clear_chat_display_post_last' });
}

export const { Provider, Context } = createDataContext(
	postReducer,
	{ 
		// Search
		// Add business user
		addBusinessUserSearch,
		// Search business near
		getBusinessUsersNear,
		switchInitialSearch,
		// Search Posts
		
		// Account

		// Home Screen Hot Post

		// User account

		// activity screen
		addUpcomingRsvLast,
		addPreviousRsvLast,

		clearUpcomingRsvLast,
		clearPreviousRsvLast,

		// Like
		// likePostJson,
		// undolikePostJson

		// chat screen display post
		addChatScreenDisplayPostLast,
		clearChatScreenDisplayPostLast
	},
	{ 
		// Search Screen
		// businessUser
		businessUserSearch: null,
		// from users | taggedPosts

		// from users | posts

		// from businesses
		businessUsersNear: [],
		initialSearchSwitch: true,

		// Account Screen

		// account screen display posts

		// Home Hot Post

		// User account Screen

		// User account screen display posts

		// Activity Screen
		// last reservation for upcoming, uncompleted, and completed
		uncomingRsvLast: null,
		previousRsvLast: null,

		// chat screen display post last
		chatScreenDisplayPostLast: null,
	}
);
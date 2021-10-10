import createDataContext from './createDataContext';
// get users
import usersGetFire from '../firebase/usersGetFire';

// post Contents
import contentPostFire from '../firebase/contentPostFire';

// get Contents
import contentGetFire from '../firebase/contentGetFire';

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
		// Create Post
		case 'change_progress':
			return { ...state, progress: action.payload };
		case 'make_new_tag': 
			return { ...state, tags: [...state.tags, action.payload]};
		case 'delete_tag':
			return { ...state, tags: [...state.tags.filter((tag) => tag !== action.payload)]};
		case 'add_file':
			return { ...state, files: [...state.files, action.payload]};
		case 'cancel_file':
			return { ...state, files: [...state.files.filter((file) => file.id !== action.payload)] };
		case 'change_user_username_input':
			return { ...state, userUsernameInput: action.payload };
		case 'clear_user_username_input':
			return { ...state, userUsernameInput: '' };
		case 'search_users':
			return { ...state, usersFound: action.payload };
		case 'clear_search':
			return { ...state, usersFound: null};
		case 'choose_user':
			return { ...state, chosenUser: action.payload };
		case 'clear_chosen_user':
			return { ...state, chosenUser: null };
		case 'change_caption':
			return { ...state, caption: action.payload };
		case 'change_rating':
			return { ...state, rating: action.payload };
		case 'clear_rating':
			return { ...state, rating: null };
		case 'set_display':
			return { ...state, display: action.payload };
		// display posts
		case 'add_cp_display_posts':
			return { ...state, cpDisplayPosts: [...state.cpDisplayPosts, ...action.payload] };
		case 'add_cp_display_post_last':
			return { ...state, cpDisplayPostLast: action.payload };
		case 'switch_cp_display_post_fetch':
			return { ...state, cpDisplayPostFetchSwitch: action.payload };
		case 'change_cp_display_post_state':
			return { ...state, cpDisplayPostState: action.paylod };
		case 'clear_cp_display_posts':
			return { ...state, cpDisplayPosts: [], cpDisplayPostLast: null, cpDisplayPostFetchSwitch: true, selectedDisplayPost: null }
		case 'select_display_post':
			return { ...state, selectedDisplayPost: action.payload };
		case 'clear_display_post':
			return { ...state, selectedDisplayPost: null };
		case 'reset_create_post':
			return { ...state, 
				caption: '', 
				userUsernameInput: '', 
				chosenUser: null, 
				usersFound: null, 
				tags: [], 
				files: [], 
				rating: null,
				display: null,
			};
		
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

		default:
			return state;
	}
};

const makeNewTag = dispatch => (tag) => {
	console.log(tag);
	dispatch({ type: 'make_new_tag', payload: tag});
};

const deleteTag = dispatch => (tag) => {
	console.log('Deleted tag: ', tag);
	dispatch({ type: 'delete_tag', payload: tag});
}

const changeCaption = dispatch => (caption) => {
	dispatch({ type: 'change_caption', payload: caption });
};

const changeProgress = dispatch => (progress) => {
	dispatch({ type: 'change_progress', payload: progress});
	console.log('Upload progress: ', progress);
};

const addPost = dispatch => async (
	goBack, 
	userId, 
	files, 
	tags, 
	caption, 

	taggedUser,
	selectedDisplayPost,
	rateTech,
	rating,

	display,
	postService,
	postTitle,
	postPrice,
	postETC,
	selectedTechs,

	changeProgress
) => {
	dispatch({ type: 'change_progress', payload: true});
	const getFileURL = new Promise (async (res, rej) => {
		const fileURLs = []
		var i;
		for (i = 0; i < files.length; i++) {
			const URL = await contentPostFire.uploadFileAsyncFire(
				userId, 
				files[i].id,
				files[i].type,
				files[i].uri, 
				changeProgress
			);
			if (files[i].type === 'video') {
				fileURLs.push({ type: 'video', url: URL });
			}
			else if (files[i].type === 'image') {
				fileURLs.push({ type: 'image', url: URL });
			} else {
				return
			}
		};
		res(fileURLs);
	});

	// After we get the photo URLs...
	getFileURL
	.then((fileURLs) => {
		console.log("File URLs: ", fileURLs);
		let newPost;

		newPost = {
      uid: userId,
      createdAt: timestamp(),
      files: fileURLs,
      tags: tags,
      caption: caption,
      likeCount: 0,
      heat: 0,
    }

    // if the post is a dipslay post
    if (display) {
    	newPost = { 
    		...newPost, 
    		...{ 
    			display: true, 
    			service: postService, 
    			title: postTitle, 
    			price: Number(postPrice), 
    			etc: Number(postETC), 
    			techs: selectedTechs 
    		}
    	}
    } else {
    	newPost = { ...newPost, ...{ display: false }}
    }

    // if the post is to rate another post
		if (taggedUser) {
			newPost = { 
				...newPost, 
				...{ 
					tid: taggedUser.id,
					ratedPostId: selectedDisplayPost.id,
					ratedTechId: rateTech.techData.id,
					rating: rating
				}
			}
		}
    
    // Firestore | posts | post.id | newPost
    // await until the post is made.
		const addPost = contentPostFire.addPostFire(newPost);
		addPost
		.then((post) => {
			if (post) {
				console.log("added new post: ", post.id);
			}

			dispatch({ type: 'reset_create_post' });
			dispatch({ type: 'clear_cp_display_posts' });
			dispatch({ type: 'change_progress', payload: false});

			console.log("Post process complete");
			goBack();
		})
		.catch((error) => {
			console.log("Error occured: postContext: contentPostFire: addPostFire: ", error);
		});
	})
	.catch((error) => {
		console.log("Error occured: postContext: ", error);
		dispatch({ type: 'change_progress', payload: false});
	});
};

const addFile = dispatch => (id, type, uri) => {
	dispatch({ type: 'add_file', payload: {id: id, type: type, uri: uri} });
};

const cancelFile = dispatch => (id) => {
	dispatch({ type: 'cancel_file', payload: id})
};

// Create Post
const changeUserUsernameInput = dispatch => (username) => {
	dispatch({ type: 'change_user_username_input', payload: username });
};

const clearUserUsernameInput = dispatch => () => {
	dispatch({ type: 'clear_user_username_input' });
};

const searchUsers = dispatch => async (username) => {
	const users = await usersGetFire.getSearchUsersFire(username, "bus");
	console.log('Search users: ', users.length);
	if (users.length < 1) {
		console.log('An user not found.');
		// when there isn't a user clear the previous list for an update
		dispatch({ type: 'clear_search'});
	} else {
		dispatch({ type: 'search_users', payload: users});
	};
};

const clearSearchUser = dispatch => () => {
	dispatch({ type: 'clear_search'})
};

const chooseUser = dispatch => (userInfo) => {
	dispatch({ type: 'choose_user', payload: userInfo });
};

const clearChosenUser = dispatch => () => {
	dispatch({ type: 'clear_chosen_user' });
	console.log("cleared: chosenUser");
	dispatch({ type: 'clear_cp_display_posts' });
	console.log("cleared: cpDisplayPosts");
};

const changeRating = dispatch => (rating) => {
	console.log("Business rating change: ", rating);
	dispatch({ type: 'change_rating', payload: rating });
};

const clearRating = dispatch => () => {
	console.log("Cleared the rating.");
	dispatch({ type: 'clear_rating' });
};

const setDisplay = dispatch => (value) => {
	dispatch({ type: 'set_display', payload: value})
};

const getCpDisplayPosts = dispatch => (preLastPost, businessUser, currentUserId) => {
	return new Promise ((res, rej) => {
		dispatch({ type: 'change_cp_display_post_state', payload: true });
		const getPosts = contentGetFire.getBusinessDisplayPostsFire(preLastPost, businessUser, currentUserId);
		getPosts
		.then((posts) => {
			dispatch({ type: 'add_cp_display_posts', payload: posts.fetchedPosts })
			if (posts.lastPost) {
				dispatch({ type: 'add_cp_display_post_last', payload: posts.lastPost });
			} else {
				dispatch({ type: 'switch_cp_display_post_fetch', payload: false });
				console.log("cpPostFetchSwitch >> off");
			}
			dispatch({ type: 'change_cp_display_post_state', payload: false });
		})
		.catch((error) => {
			console.log("Error occured: postContext: getCpDisplayPosts: ", error);
			dispatch({ type: 'change_cp_display_post_state', payload: false });
		})
		res(true);
	});
};

const clearFirstAndGetCpDisplayPosts = dispatch => (
		businessUser,
		currentUserId
	) => {
	const clearFirst = new Promise ((res, rej) => {
		dispatch({ type: 'switch_cp_display_post_fetch', payload: true });
		console.log("cpPostFetchSwitch >> on");
		dispatch({ type: 'clear_cp_display_posts'});
		console.log("cleared state: cpDisplayPosts");
		res();
	});
	clearFirst
	.then(() => {
		dispatch({ type: 'change_cp_display_post_state', payload: true });
		const getPosts = contentGetFire.getBusinessDisplayPostsFire(null, businessUser, currentUserId);
		getPosts
		.then((posts) => {
			dispatch({ type: 'add_cp_display_posts', payload: posts.fetchedPosts });
			console.log("fetched posts: cpDisplayPosts", posts.fetchedPosts.length);
			if (posts.lastPost !== undefined) {
				dispatch({ type: 'add_cp_display_post_last', payload: posts.lastPost });
			} else {
				dispatch({ type: 'switch_cp_display_post_fetch', payload: false });
				console.log("cpPostFetchSwitch >> off");
			};
			dispatch({ type: 'change_cp_display_post_state', payload: false });
		})
		.catch((error) => {
			console.log("Error occured: postContext: clearFirstAndGetCpDisplayPosts: ", error);
			dispatch({ type: 'change_cp_display_post_state', payload: false });
		});
	})
	.catch((err) => {
		console.log("Error occured: postContext: clearFirstAndGetCpDisplayPosts: ", err);
	});
};

// select disply post
const selectDisplayPost = dispatch => (post) => {
	console.log("selectedDisplayPost: ", post.id);
	dispatch({ type: 'select_display_post', payload: post});
};
// clear selected display post
const clearDisplayPost = dispatch => () => {
	console.log("selectDisplayPost: null");
	dispatch({ type: 'clear_display_post' });
};

const resetPost = dispatch => () => {
	console.log('Reset post complete.');
	dispatch({ type: 'reset_create_post' });
	
	dispatch({ type: 'clear_chosen_user' });
	console.log("cleared: chosenUser");
	dispatch({ type: 'clear_cp_display_posts' });
	console.log("cleared: cpDisplayPosts");
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

export const { Provider, Context } = createDataContext(
	postReducer,
	{ 
		// Create Post
		makeNewTag, 
		deleteTag,
		changeCaption, 
		addFile, 
		cancelFile,
		changeProgress,
		addPost,
		changeUserUsernameInput,
		clearUserUsernameInput,
		searchUsers,
		clearSearchUser,
		chooseUser,
		clearChosenUser,
		changeRating,
		clearRating,
		setDisplay,
		// display posts
		getCpDisplayPosts,
		clearFirstAndGetCpDisplayPosts,
		selectDisplayPost,
		clearDisplayPost,
		resetPost,
		
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
		clearPreviousRsvLast

		// Like
		// likePostJson,
		// undolikePostJson
	},
	{ 
		// Create Post
		progress: false,
		caption: '', 
		userUsernameInput: '', 
		chosenUser: null,
		files: [], 
		tags: [], 
		display: null, // default display null
		// display posts
		cpDisplayPosts: [],
		cpDisplayPostLast: null,
		cpDisplayPostFetchSwitch: true,
		cpDisplayPostState: false,
		// default rating null
		rating: null,
		// User Search (In Create Post)
		usersFound: null,
		// selected display post
		selectedDisplayPost: null,

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
		previousRsvLast: null
	}
);
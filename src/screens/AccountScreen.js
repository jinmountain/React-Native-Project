import React, { useContext, useEffect, useState, useCallback } from 'react';
import { 
	View, 
	StyleSheet,
	RefreshControl,
	Image, 
	Text,  
	TouchableOpacity,
	TouchableWithoutFeedback,
	Dimensions,
	FlatList,
	ScrollView, } from 'react-native';

// NPMs
import { SafeAreaView, } from 'react-native-safe-area-context';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import ThreePostsRow from '../components/ThreePostsRow';
import ButtonA from '../components/ButtonA';
import ProfileCardUpper from '../components/profilePage/ProfileCardUpper';
import ProfileCardBottom from '../components/profilePage/ProfileCardBottom';
import MainTemplate from '../components/MainTemplate';
import MultiplePhotosIndicator from '../components/MultiplePhotosIndicator';
import SpinnerFromActivityIndicator from '../components/ActivityIndicator';
import DisplayPostsDefault from '../components/defaults/DisplayPostsDefault';
// Display Post
import DisplayPostImage from '../components/displayPost/DisplayPostImage';
import DisplayPostInfo from '../components/displayPost/DisplayPostInfo';
import DisplayPostLoading from '../components/displayPost/DisplayPostLoading';
// Loading Containers
import GetPostLoading from '../components/GetPostLoading';
// horizontal line
import HeaderBottomLine from '../components/HeaderBottomLine';

// Last Page Sign
import PostEndSign from '../components/PostEndSign';
import DisplayPostEndSign from '../components/DisplayPostEndSign';
// Header
import UserAccountHeaderForm from '../components/profilePage/UserAccountHeaderForm';

// Context
import { Context as AuthContext } from '../context/AuthContext';
import { Context as PostContext } from '../context/PostContext';

// Firebase
import contentGetFire from '../firebase/contentGetFire';

// Designs
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';

// Color
import color from '../color';

// expo icons
import expoIcons from '../expoIcons';

// Hooks
import count from '../hooks/count';
import { wait } from '../hooks/wait';
import { isCloseToBottom } from '../hooks/isCloseToBottom';
import { useOrientation } from '../hooks/useOrientation';

const AccountScreen = ({ navigation }) => {
	const [ windowWidth, setWindowWidth ] = useState(Dimensions.get("window").width);
  const [ windowHeight, setWindowHeight ] = useState(Dimensions.get("window").height);
  const [ threePostsRowImageWH, setThreePostsRowImageWH ] = useState(Dimensions.get("window").width/3-2);

  const orientation = useOrientation();

  useEffect(() => {
  	setThreePostsRowImageWH(Dimensions.get("window").width/3-2);
  	setWindowWidth(Dimensions.get("window").width);
  	setWindowHeight(Dimensions.get("window").height);
  }, [orientation]);

	const [refreshing, setRefreshing] = useState(false);
	const [ screenReady, setScreenReady ] = useState(false);

	const { state: { user }, accountRefresh } = useContext(AuthContext);

	const [ accountPosts, setAccountPosts ] = useState([]);
	const [ accountPostLast, setAccountPostLast ] = useState(null);
	const [ accountPostFetchSwitch, setAccountPostFetchSwtich ] = useState(true);
	const [ accountPostState, setAccountPostState ] = useState(false);

	const [ accountDisplayPosts, setAccountDisplayPosts ] = useState([]);
	const [ accountDisplayPostLast, setAccountDisplayPostLast ] = useState(null);
	const [ accountDisplayPostFetchSwitch, setAccountDisplayPostFetchSwtich ] = useState(true);
	const [ accountDisplayPostState, setAccountDisplayPostState ] = useState(false);

	useEffect(() => {
		console.log("account screen user: ", user.id);

		let mounted = true;
		const getScreenReady = new Promise ((res, rej) => {
			if(accountPostFetchSwitch && !accountPostState && mounted) {
				mounted && setAccountPostState(true);
				const getUserPosts = contentGetFire.getUserPostsFire(null, user.id);
				getUserPosts
				.then((posts) => {
					mounted && setAccountPosts(posts.fetchedPosts);
					// if lastPost is undefined turn off fetch switch
					mounted && setAccountPostLast(posts.lastPost);
					if (!posts.lastPost) {
						console.log("turn off switch");
						mounted && setAccountPostFetchSwtich(false);
					}
					mounted && setAccountPostState(false);
				})
			}

			if (user.type === 'business' && accountDisplayPostFetchSwitch && !accountDisplayPostState && mounted) {
				mounted && setAccountDisplayPostState(true);
				const getDisplayPosts = contentGetFire.getBusinessDisplayPostsFire(null, user.id);
				getDisplayPosts
				.then((posts) => {
					mounted && setAccountDisplayPosts(posts.fetchedPosts);
					if (posts.lastPost) {
						mounted && setAccountDisplayPostLast(posts.lastPost);
					} else {
						mounted && setAccountDisplayPostFetchSwtich(false);
					};
					mounted && setAccountDisplayPostState(false);
				})
			}
			res(true);
		});

		getScreenReady
		.then(() => {
			mounted && setScreenReady(true);
		})
		.catch((error) => {
			console.log(error);
		});

		return () => {
			mounted = false;

			setAccountPosts([]);
			setAccountPostLast(null);
			setAccountPostFetchSwtich(true);
			setAccountPostState(false);

			setAccountDisplayPosts([]);
			setAccountDisplayPostLast(null);
			setAccountDisplayPostFetchSwtich(true);
			setAccountDisplayPostState(false);
		}
	}, []);

  const onRefresh = useCallback(() => {
  	let mounted = true;
    setRefreshing(true);
    accountRefresh();

    const clearState = new Promise((res, rej) => {
    	setAccountPosts([]);
			setAccountPostLast(null);
			setAccountPostFetchSwtich(true);
			setAccountPostState(false);

			setAccountDisplayPosts([]);
			setAccountDisplayPostLast(null);
			setAccountDisplayPostFetchSwtich(true);
			setAccountDisplayPostState(false);

			res(true);
    });

    clearState
    .then(() => {
    	if(accountPostFetchSwitch && !accountPostState && mounted) {
				mounted && setAccountPostState(true);
				const getUserPosts = contentGetFire.getUserPostsFire(null, user.id);
				getUserPosts
				.then((posts) => {
					mounted && setAccountPosts([ ...accountPosts, ...posts.fetchedPosts ]);
					if (posts.lastPost !== undefined && mounted) {
						mounted && setAccountPostLast(posts.lastPost);
					} else {
						mounted && setAccountPostFetchSwtich(false);
					};
					mounted && setAccountPostState(false);
				})
			}

			if (user.type === 'business' && accountDisplayPostFetchSwitch && !accountDisplayPostState && mounted) {
				mounted && setAccountDisplayPostState(true);
				const getDisplayPosts = contentGetFire.getBusinessDisplayPostsFire(null, user.id);
				getDisplayPosts
				.then((posts) => {
					mounted && setAccountDisplayPosts([ ...accountDisplayPosts, ...posts.fetchedPosts ]);
					if (posts.lastPost !== undefined) {
						mounted && setAccountDisplayPostLast(posts.lastPost);
					} else {
						mounted && setAccountDisplayPostFetchSwtich(false);
					};
					mounted && setAccountDisplayPostState(false);
				})
			}
    });

    wait(2000).then(() => setRefreshing(false));

    return () => {
    	mounted = false;
    }
  }, []);

  const [status, setStatus] = useState({});

	return (
		screenReady
		?
		<View style={styles.mainContainer}>
			<UserAccountHeaderForm
				leftButtonTitle={null} 
			  leftButtonIcon={null}
			  leftButtonPress={null}
				username={user.username}
				title={null}
				firstIcon={<AntDesign name="plus" size={RFValue(27)} color={color.black1} />}
				secondIcon={<AntDesign name="message1" size={RFValue(27)} color={color.black1} />}
				thirdIcon={<Feather name="menu" size={RFValue(27)} color={color.black1} />}
				firstOnPress={() => {
					navigation.navigate("ContentCreate");
				}}
				secondOnPress={() => {
					navigation.navigate("ChatListStack");
				}}
				thirdOnPress={() => {
					navigation.navigate("AccountManagerStack");
				}}
				addPaddingTop={true}
			/>
			<View
				contentContainerStyle={styles.accountInfoAndContentContainer}
			>
				<ScrollView
					refreshControl={
	          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
	        }
	        onScroll={({nativeEvent}) => {
	        	let mounted = true;
			      if (isCloseToBottom(nativeEvent) && accountPostFetchSwitch && !accountPostState && mounted) {
			      	mounted && setAccountPostState(true);
							const getUserPosts = contentGetFire.getUserPostsFire(accountPostLast, user.id);
							getUserPosts
							.then((posts) => {
								mounted && setAccountPosts([ ...accountPosts, ...posts.fetchedPosts ]);
								if (posts.lastPost !== undefined && mounted) {
									mounted && setAccountPostLast(posts.lastPost);
								} else {
									mounted && setAccountPostFetchSwtich(false);
								};
								mounted && setAccountPostState(false);
							})
			      }
			      return () => {
							mounted = false;
						}
			    }}
			    scrollEventThrottle={1000}
			    style={styles.userPostsContainer}
				>
					<ProfileCardUpper 
						photoURL={user.photoURL}
						postCount={user.postCount}
					/>
					<ProfileCardBottom
						locationType={user.type === 'business' && user.locationType}
						address={user.type === 'business' && user.formatted_address}
						googleMapUrl={user.type === 'business' && user.googlemapsUrl}
						sign={user.sign}
						websiteAddress={user.website}
					/>
					<View style={styles.accountManagerContainer}>
						<View style={styles.managerButtonContainer}>
							<TouchableOpacity onPress={() => navigation.navigate('UpdateProfileStack')}>
								<ButtonA 
									text="Edit Profile"
									customStyles={{
										fontSize: RFValue(15), 
										color: color.black1,
									}}
								/>
							</TouchableOpacity>
						</View>
						<View style={styles.managerButtonContainer}>
							{ user.type === 'business'
								?
								<TouchableOpacity onPress={() => navigation.navigate('BusinessMain')}>
									<ButtonA 
										text="Manage Shop"
										customStyles={{
											fontSize: RFValue(15), 
											color: color.black1,
										}}
									/>
								</TouchableOpacity>
								: null
							}
						</View>
					</View>
					{ 
						user.type === 'business'
						?
						<View style={styles.userPostsLabelContainer}>
							<Text style={styles.userPostsLabelText}>
								<Feather name="menu" size={RFValue(23)} color={color.black1} />
							</Text>
							<TouchableOpacity 
								style={styles.showTwoColumnButtonContainer}
								onPress={() => {
									console.log("two");
								}}
							>
								{expoIcons.featherColumns(RFValue(23), color.black1)}
							</TouchableOpacity>
						</View>
						:
						null
					}
					{ 
						// don't use the loading spinner for display posts
						// already has a spinner for whole account screen
						screenReady && user.type === 'business' && accountDisplayPosts.length > 0
						?
						<View style={styles.displayPostsContainer}>
							<FlatList
								onEndReached={() => {
									let mounted = true;
									if (user.type === 'business' && accountDisplayPostFetchSwitch && !accountDisplayPostState && mounted) {
										mounted && setAccountDisplayPostState(true);
										const getDisplayPosts = contentGetFire.getBusinessDisplayPostsFire(accountDisplayPostLast, user.id);
										getDisplayPosts
										.then((posts) => {
											mounted && setAccountDisplayPosts([ ...accountDisplayPosts, ...posts.fetchedPosts ]);
											if (posts.lastPost !== undefined) {
												mounted && setAccountDisplayPostLast(posts.lastPost);
											} else {
												mounted && setAccountDisplayPostFetchSwtich(false);
											};
											mounted && setAccountDisplayPostState(false);
										})
									} else {
										console.log("accountScreen: FlatList: onEndReached: display switch: " + accountDisplayPostFetchSwitch + " display state: " + accountDisplayPostState );
									}
									return () => {
										mounted = false;
									}
								}}
								onEndReachedThreshold={0.01}
		            horizontal
		            showsHorizontalScrollIndicator={false}
		            data={accountDisplayPosts}
		            keyExtractor={(displayPost, index ) => index.toString()}
		            renderItem={({ item, index }) => {
		              return (
		                <TouchableWithoutFeedback 
		                  style={{ ...styles.postImageContainer, ...{ height: windowWidth/2 + RFValue(50), width: windowWidth/2 } }}
		                  onPress={() => {
		                  	// navigation.navigate('PostDetail', {
		                  	// 	post: item,
		                  	// 	postSource: 'account'
		                  	// });
		                  	navigation.navigate(
		                  		'PostsSwipe',
		                  		{
		                  			postSource: 'accountDisplay',
		                  			cardIndex: index,
		                  			posts: accountDisplayPosts,
        										postState: accountDisplayPostState,
														postFetchSwitch: accountDisplayPostFetchSwitch,
														postLast: accountDisplayPostLast,
		                  		}
		                  	);
		                  }}
		                >
		                	<View>
				                <DisplayPostImage
				                	type={item.data.files[0].type}
				                	url={item.data.files[0].url}
				                	imageWidth={windowWidth/2}
				                />
				                <DisplayPostInfo
				                	containerWidth={windowWidth/2}
				                	taggedCount={count.kOrNo(item.data.taggedCount)}
				                	title={item.data.title}
				                	likeCount={count.kOrNo(item.data.likeCount)}
				                	price={item.data.price}
				                	etc={item.data.etc}
				                />
			                  { item.data.files.length > 1
			                  	? <MultiplePhotosIndicator
			                  			size={RFValue(24)}
			                  		/>
			                  	: null
			                  }
			                </View>
		                </TouchableWithoutFeedback>
		              )
		            }}
		          />
							{ 
								accountDisplayPostState
								?
								<DisplayPostLoading />
								: 
								null
							}
						</View>
						: screenReady && user.type === 'business' && accountDisplayPosts.length === 0
						? <DisplayPostsDefault />
						: null
					}
					<View style={styles.userPostsLabelContainer}>
						<Text style={styles.userPostsLabelText}>
							<AntDesign name="picture" size={RFValue(23)} color={color.black1} />
						</Text>
					</View>
					<ThreePostsRow
						navigate={navigation.navigate}
						screen={"account"}
						targetUser={null}
						posts={accountPosts} 
						postState={accountPostState}
					  postFetchSwitch={accountPostFetchSwitch}
					  postLast={accountPostLast}
						threePostsRowImageWH={threePostsRowImageWH}
					/>
					{ 
						accountPostState 
						?
						<GetPostLoading />
						: 
						null
					}
					{ 
						accountPostFetchSwitch === false && accountPosts.length > 27
						?
						<PostEndSign />
						: null
					}
				</ScrollView>
			</View>
		</View>
		: 
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<SpinnerFromActivityIndicator/>
		</View>
	);
};

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},
  accountInfoAndContentContainer: {
  	flex: 1,
  },
  userPostsContainer: {

  },
	accountManagerContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: color.white2,
	},
	managerButtonContainer: {
		backgroundColor: color.white2,
		marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: RFValue(15),
	},
	// zIndex shadow 5
	userPostsLabelContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#ccc',
		backgroundColor: '#fff',
    padding: RFValue(10),
    height: RFValue(57),
	},
	userPostsLabelText: {
		fontSize: RFValue(15),
	},
	showTwoColumnButtonContainer: {
		position: 'absolute',
		alignSelf: 'flex-end',
		paddingRight: RFValue(10)
	},

	displayPostsContainer: {
		flex: 1,
		backgroundColor: color.white2,
	},
	postImageContainer: {
		alignItems: 'center',
		marginRight: 2,
	},
	multiplePhotosSymbol: {
		position: 'absolute',
		alignSelf: 'flex-end',
		paddingRight: 10,
		marginTop: 10,
	},
});

export default AccountScreen;
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { 
	View, 
	StyleSheet,
	RefreshControl,
	Image, 
	Text,  
	TouchableOpacity,
	TouchableHighlight,
	Dimensions,
	FlatList,
	ScrollView, } from 'react-native';

// NPMs
import { SafeAreaView, } from 'react-native-safe-area-context';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import Spacer from '../../components/Spacer';
import { NavigationBar } from '../../components/NavigationBar';
import ThreePostsRow from '../../components/ThreePostsRow';
import ButtonA from '../../components/ButtonA';
import ProfileCardUpper from '../../components/profilePage/ProfileCardUpper';
import ProfileCardBottom from '../../components/profilePage/ProfileCardBottom';
import MainTemplate from '../../components/MainTemplate';
import MultiplePhotosIndicator from '../../components/MultiplePhotosIndicator';
import SpinnerFromActivityIndicator from '../../components/ActivityIndicator';
import UserAccountHeaderForm from '../../components/profilePage/UserAccountHeaderForm';
import TwoButtonAlert from '../../components/TwoButtonAlert';
// Display Post
import DisplayPostImage from '../../components/displayPost/DisplayPostImage';
import DisplayPostInfo from '../../components/displayPost/DisplayPostInfo';
import DisplayPostLoading from '../../components/displayPost/DisplayPostLoading';
// Loading Containers
import GetPostLoading from '../../components/GetPostLoading';

// Last Page Sign
import PostEndSign from '../../components/PostEndSign';
import DisplayPostEndSign from '../../components/DisplayPostEndSign';

// Context
import { Context as SocialContext } from '../../context/SocialContext';
import { Context as AuthContext } from '../../context/AuthContext';
import { Context as PostContext } from '../../context/PostContext';

// Firebase
import busTechPostFire from '../../firebase/busTechPostFire';
import busTechGetFire from '../../firebase/busTechGetFire';
import contentGetFire from '../../firebase/contentGetFire';

// Designs
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

// Color
import color from '../../color';

// Hooks
import { kOrNo } from '../../hooks/kOrNo';
import { wait } from '../../hooks/wait';
import { isCloseToBottom } from '../../hooks/isCloseToBottom';
import { useOrientation } from '../../hooks/useOrientation';

const UserAccountScreen = ({ route, navigation }) => {
	const [ windowWidth, setWindowWidth ] = useState(Dimensions.get("window").width);
  const [ windowHeight, setWindowHeight ] = useState(Dimensions.get("window").height);
  const [ threePostsRowImageWH, setThreePostsRowImageWH ] = useState(Dimensions.get("window").width/3-2);

  const orientation = useOrientation();

  useEffect(() => {
  	setThreePostsRowImageWH(Dimensions.get("window").width/3-2);
  	setWindowWidth(Dimensions.get("window").width);
  	setWindowHeight(Dimensions.get("window").height);
  }, [orientation]);

	const { targetUser } = route.params;
	const [ refreshing, setRefreshing ] = React.useState(false);
	const [ screenReady, setScreenReady ] = useState(false);
	//
	const [ sentTechApp, setSentTechApp ] = useState(false);
	const [ sentTechLeave, setSentTechLeave ] = useState(false);

	const [ tbaStatus, setTbaStatus ] = useState(false);

	const { state: { user }, accountRefresh, signout } = useContext(AuthContext);

	const [ userAccountPosts, setUserAccountPosts ] = useState([]);
	const [ userAccountPostLast, setUserAccountPostLast ] = useState(null);
	const [ userAccountPostFetchSwitch, setUserAccountPostFetchSwtich ] = useState(true);
	const [ userAccountPostState, setUserAccountPostState ] = useState(false);

	const [ userAccountDisplayPosts, setUserAccountDisplayPosts ] = useState([]);
	const [ userAccountDisplayPostLast, setUserAccountDisplayPostLast ] = useState(null);
	const [ userAccountDisplayPostFetchSwitch, setUserAccountDisplayPostFetchSwtich ] = useState(true);
	const [ userAccountDisplayPostState, setUserAccountDisplayPostState ] = useState(false);

	useEffect(() => {
		let mounted = true;
		const getScreenReady = new Promise ((res, rej) => {
			if(targetUser && userAccountPostFetchSwitch && !userAccountPostState && mounted) {
				mounted && setUserAccountPostState(true);
				const getUserPosts = contentGetFire.getUserPostsFire(userAccountPostLast, targetUser, user.id);
				getUserPosts
				.then((posts) => {
					mounted && setUserAccountPosts([ ...userAccountPosts, ...posts.fetchedPosts ]);
					if (posts.lastPost !== undefined && mounted) {
						mounted && setUserAccountPostLast(posts.lastPost);
					} else {
						mounted && setUserAccountPostFetchSwtich(false);
					};
					mounted && setUserAccountPostState(false);
				})
			}

			if (targetUser && targetUser.type === 'business' && userAccountDisplayPostFetchSwitch && !userAccountDisplayPostState && mounted) {
				mounted && setUserAccountDisplayPostState(true);
				const getDisplayPosts = contentGetFire.getBusinessDisplayPostsFire(userAccountDisplayPostLast, targetUser, user.id);
				getDisplayPosts
				.then((posts) => {
					mounted && setUserAccountDisplayPosts([ ...userAccountDisplayPosts, ...posts.fetchedPosts ]);
					if (posts.lastPost !== undefined) {
						mounted && setUserAccountDisplayPostLast(posts.lastPost);
					} else {
						mounted && setUserAccountDisplayPostFetchSwtich(false);
					};
					mounted && setUserAccountDisplayPostState(false);
				})
			}
			res(true);
		});

		getScreenReady
		.then(() => {
			setScreenReady(true);
		})
		.catch((error) => {
			console.log(error);
		});

		return () => {
			mounted = false;

			setUserAccountPosts([]);
			setUserAccountPostLast(null);
			setUserAccountPostFetchSwtich(true);
			setUserAccountPostState(false);

			setUserAccountDisplayPosts([]);
			setUserAccountDisplayPostLast(null);
			setUserAccountDisplayPostFetchSwtich(true);
			setUserAccountDisplayPostState(false);
		}
	}, [targetUser]);

	const appendAccountPosts = useCallback((fetchedPosts) => {
      setUserAccountPosts([ ...userAccountPosts, ...fetchedPosts ]);
    },
    []
	);

  const onRefresh = useCallback(() => {
  	let mounted = true;
    setRefreshing(true);
    accountRefresh();

    const clearState = new Promise((res, rej) => {
    	setUserAccountPosts([]);
			setUserAccountPostLast(null);
			setUserAccountPostFetchSwtich(true);
			setUserAccountPostState(false);

			setUserAccountDisplayPosts([]);
			setUserAccountDisplayPostLast(null);
			setUserAccountDisplayPostFetchSwtich(true);
			setUserAccountDisplayPostState(false);

			res(true);
    });

    clearState
    .then(() => {
    	if(targetUser && userAccountPostFetchSwitch && !userAccountPostState && mounted) {
				mounted && setUserAccountPostState(true);
				const getUserPosts = contentGetFire.getUserPostsFire(userAccountPostLast, targetUser, user.id);
				getUserPosts
				.then((posts) => {
					mounted && setUserAccountPosts([ ...userAccountPosts, ...posts.fetchedPosts ]);
					if (posts.lastPost !== undefined && mounted) {
						mounted && setUserAccountPostLast(posts.lastPost);
					} else {
						mounted && setUserAccountPostFetchSwtich(false);
					};
					mounted && setUserAccountPostState(false);
				})
			}

			if (targetUser && targetUser.type === 'business' && userAccountDisplayPostFetchSwitch && !userAccountDisplayPostState && mounted) {
				mounted && setUserAccountDisplayPostState(true);
				const getDisplayPosts = contentGetFire.getBusinessDisplayPostsFire(userAccountDisplayPostLast, targetUser, user.id);
				getDisplayPosts
				.then((posts) => {
					mounted && setUserAccountDisplayPosts([ ...userAccountDisplayPosts, ...posts.fetchedPosts ]);
					if (posts.lastPost !== undefined) {
						mounted && setUserAccountDisplayPostLast(posts.lastPost);
					} else {
						mounted && setUserAccountDisplayPostFetchSwtich(false);
					};
					mounted && setUserAccountDisplayPostState(false);
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
		<MainTemplate>
		{ 
			screenReady === true
			?
			<View style={styles.mainContainer}>
				{/*Header*/}
				<UserAccountHeaderForm
				  leftButtonTitle={null}
        	leftButtonIcon={<Ionicons name="md-arrow-back" size={RFValue(27)} color={color.black1} />}
				  leftButtonPress={() => { navigation.goBack() }}
					username={targetUser.username}
					title={null}
					firstIcon={
						<Feather name="send" size={RFValue(27)} color={color.black1} />
					}
					secondIcon={
						targetUser.type === 'business'
						? <Feather name="shopping-bag" size={RFValue(27)} color={color.black1} />
						: null
					}
					firstOnPress={() => {
						navigation.navigate('Chat', { theOtherUser: targetUser });
					}}
					secondOnPress={
						targetUser.type === 'business'
						? null
						: null
					}
				/>

				<View
					contentContainerStyle={styles.accountInfoAndContentContainer}
				>
					<ScrollView
						refreshControl={
		          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
		        }
		        onScroll={({nativeEvent}) => {
				      if (
				      	isCloseToBottom(nativeEvent) && 
				      	screenReady && 
				      	userAccountPostState === false && 
				      	userAccountPostFetchSwitch
				      ) {
				      	setUserAccountPostState(true);
				      	const getUserPosts = contentGetFire.getUserPostsFire(userAccountPostLast, targetUser, user.id);
				      	getUserPosts
				      	.then((posts) => {
				      		setUserAccountPosts([ ...userAccountPosts, ...posts.fetchedPosts ]);
									if (posts.lastPost !== undefined) {
										setUserAccountPostLast(posts.lastPost);
									} else {
										setUserAccountPostFetchSwtich(false);
									};
									setUserAccountPostState(false);
				      	})
				      } else {
				      	console.log("UserAccountScreen: scrollView: onScroll: post switch: " + userAccountPostFetchSwitch + " post state: " + userAccountPostState );
				      };
				    }}
				    scrollEventThrottle={1000}
				    style={styles.userPostsContainer}
					>
						<ProfileCardUpper 
							photoURL={targetUser.photoURL}
							postCount={targetUser.postCount}
						/>
						<ProfileCardBottom
							locationType={targetUser.type === 'business' ? targetUser.locationType : null}
							address={targetUser.type === 'business' ?  targetUser.formatted_address : null}
							googleMapUrl={targetUser.type === 'business' ?  targetUser.googlemapsUrl : null}
							sign={targetUser.sign}
							websiteAddress={targetUser.website}
						/>

						{/*account communication tools*/}
						<View style={styles.accountManagerContainer}>
							{ // when target user is a business
								targetUser.type === 'business'
								?
								<View style={styles.managerButtonContainer}>
									<TouchableOpacity onPress={() => {
										navigation.navigate('ShopStack', 
										{	
											screen: 'BusinessSchedule',
											params: {
                				businessUser: targetUser
                			},
                		});
									}}>
										<ButtonA 
											text="Shop"
											customStyles={{
												fontSize: RFValue(15), 
												color: color.black1,
											}}
											icon={<Feather name="shopping-bag" size={RFValue(23)} color={color.black1} />}
										/>
									</TouchableOpacity>
								</View>
								: null
							}
							{ // when user is a technician, target user is a business which user isn't part of 
								user.type === 'technician' &&
								targetUser.techs.includes(user.id) === false &&
								targetUser.type === 'business' && 
								sentTechApp === false
								?
								<View style={styles.managerButtonContainer}>
									<TouchableOpacity 
										onPress={() => {
											setTbaStatus("apply");
										}}
									>
										<ButtonA 
											text={`Join ${targetUser.username}`}
											customStyles={{
												fontSize: RFValue(15), 
												color: color.black1,
											}}
										/>
									</TouchableOpacity>
								</View>
								:
								user.type === 'technician' && 
								targetUser.techs.includes(user.id) === false &&
								targetUser.type === 'business' && 
								sentTechApp === true
								?
								<View style={styles.managerButtonContainer}>
									<View>
										<ButtonA 
											text={"Request Sent"}
											customStyles={{
												fontSize: RFValue(15), 
												color: color.blue1,
											}}
											icon={<AntDesign name="checkcircleo" size={RFValue(11)} color={color.blue1} />}
										/>
									</View>
								</View>
								: null
							}

							{	// when user is a technician, target user is a business which use is part of
								user.type === 'technician' &&
								targetUser.techs.includes(user.id) &&
								targetUser.type === 'business' &&
								sentTechLeave === false 
								?
								<View style={styles.managerButtonContainer}>
									<TouchableOpacity 
										onPress={() => {
											setTbaStatus("leave");
										}}
									>
										<ButtonA 
											text={`Request Leave to ${targetUser.username}`}
											customStyles={{
												fontSize: RFValue(15), 
												color: color.black1,
											}}
										/>
									</TouchableOpacity>
								</View>
								: null
							}
						</View>
						{ 
							targetUser.type === 'business'
							?
							<View style={styles.userPostsLabelContainer}>
								<Text style={styles.userPostsLabelText}>
									<Feather name="menu" size={RFValue(23)} color={color.black1} />
								</Text>
							</View>
							:
							null
						}
						{ 
							targetUser.type === 'business' && userAccountDisplayPosts.length > 0
							?
							<View style={styles.displayPostsContainer}>
								<FlatList
									onEndReached={() => {
										if (
											screenReady && 
											userAccountDisplayPostFetchSwitch && 
											!userAccountDisplayPostState
										) {
											setUserAccountDisplayPostState(true);
											const getDisplayPosts = contentGetFire.getBusinessDisplayPostsFire(userAccountDisplayPostLast, user, user.id);
											getDisplayPosts
											.then((posts) => {
												setUserAccountDisplayPosts([ ...userAccountDisplayPosts, ...posts.fetchedPosts ]);
												if (posts.lastPost !== undefined) {
													setUserAccountDisplayPostLast(posts.lastPost);
												} else {
													setUserAccountPostFetchSwtich(false);
												};
												setUserAccountDisplayPostState(false);
											})
										}
									}}
									onEndReachedThreshold={0.01}
			            horizontal
			            showsHorizontalScrollIndicator={false}
			            data={userAccountDisplayPosts}
			            keyExtractor={(displayPost, index) => index.toString()}
			            renderItem={({ item, index }) => {
			              return (
			                <TouchableOpacity 
			                  style={{ ...styles.postImageContainer, ...{ height: windowWidth/2 + RFValue(50), width: windowWidth/2 } }}
			                  onPress={() => {
			                  	navigation.navigate('PostsSwipeStack', {
			                  		screen: 'PostsSwipe',
			                  		params: {
			                  			postSource: 'userAccountDisplay',
			                  			cardIndex: index,
			                  			targetUser: targetUser,
			                  			posts: userAccountDisplayPosts,
          										postState: userAccountDisplayPostState,
															postFetchSwitch: userAccountDisplayPostFetchSwitch,
															postLast: userAccountDisplayPostLast,
			                  		}
			                  	});
			                  }}
			                >
				                <DisplayPostImage
				                	type={item.data.files[0].type}
				                	url={item.data.files[0].url}
				                	imageWidth={windowWidth/2}
				                />
				                <DisplayPostInfo
				                	taggedCount={kOrNo(item.data.taggedCount)}
				                	title={item.data.title}
				                	likeCount={kOrNo(item.data.like)}
				                	etc={item.data.etc}
				                	price={item.data.price}
				                	containerWidth={windowWidth/2}
				                />
			                  { item.data.files.length > 1
			                  	? <MultiplePhotosIndicator
			                  			size={RFValue(24)}
			                  		/>
			                  	: null
			                  }
			                </TouchableOpacity>
			              )
			            }}
			          />
								{ 
									userAccountDisplayPostState
									?
									<DisplayPostLoading />
									: 
									null
								}
							</View>
							: null
						}
						<View style={styles.userPostsLabelContainer}>
							<Text style={styles.userPostsLabelText}>
								<AntDesign name="picture" size={RFValue(23)} color={color.black1} />
							</Text>
						</View>
						<ThreePostsRow
							navigate={navigation.navigate}
							screen={"userAccount"}
							targetUser={targetUser}
							posts={userAccountPosts} 
							postState={userAccountPostState}
							postFetchSwitch={userAccountPostFetchSwitch}
							postState={userAccountPostState}
							postLast={userAccountPostLast}
							threePostsRowImageWH={threePostsRowImageWH}
						/>
						{ 
							userAccountPostState
							?
							<GetPostLoading />
							: 
							null
						}
						{ 
							userAccountPostFetchSwitch === false && userAccountPosts.length > 27
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
		}
		{ 
      tbaStatus
      && 
      <TwoButtonAlert 
        title={<Ionicons name="alert-circle-outline" size={RFValue(27)} color={color.black1} />}
        message={`Do you want to send an application to ${targetUser.username} to join as a technician?`}
        buttonOneText={"Yes"}
        buttonTwoText={"No"}
        buttonOneAction={() => {
        	if (tbaStatus === "leave") {
        		const sendLeaveRequest = busTechPostFire.sentTechLeave(targetUser.id, user.id);
						sendLeaveRequest
						.then((response) => {
							if (response === false) {
								setSentTechLeave(true);
							}
							else if (response === 'sent') {
								setSentTechLeave(true);
							} 
						})
						.catch((error) => {
							console.log("Error occured: UserAccountScreen: sentLeaveRequest: ", error);
						});
        	}
        	
        	if (tbaStatus === "apply") {
        		const sendRequest = busTechPostFire.sendTechApp(targetUser.id, user.id);
						sendRequest
						.then((response) => {
							if (response === true) {
								setSentTechApp(true);
							}
							else if (response === 'sent') {
								setSentTechApp(true);
							}
							setTbaStatus(false);
						})
						.catch((error) => {
							console.log("Error occured: UserAccountScreen: sendRequest: ", error);
						});
        	}
        	
        }}
        buttonTwoAction={() => { 
        	setTbaStatus(false)
        }}
      />
    }
		</MainTemplate>
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
	},
	managerButtonContainer: {
		marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: RFValue(15),
	},

	userPostsLabelContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#ccc',
		backgroundColor: '#fff',
		elevation: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    padding: 10,
    shadowColor: "#000",
	},
	userPostsLabelText: {
		fontSize: RFValue(15),
	},

	displayPostsContainer: {
		flex: 1,
		backgroundColor: color.white2,
	},
	postImageContainer: {
		alignItems: 'center',
		marginRight: 2,
	},
});

export default UserAccountScreen;
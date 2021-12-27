import React, { useContext, useEffect, useState, useCallback } from 'react';
import { 
	View,
	SafeAreaView,
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
// import { SafeAreaView, } from 'react-native-safe-area-context';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Video, AVPlaybackStatus } from 'expo-av';

// Components
import Spacer from '../components/Spacer';
import { NavigationBar } from '../components/NavigationBar';
import ThreePostsRow from '../components/ThreePostsRow';
import ButtonA from '../components/ButtonA';
import ProfileCardUpper from '../components/profilePage/ProfileCardUpper';
import ProfileCardBottom from '../components/profilePage/ProfileCardBottom';
import MainTemplate from '../components/MainTemplate';
import MultiplePhotosIndicator from '../components/MultiplePhotosIndicator';
import SpinnerFromActivityIndicator from '../components/ActivityIndicator';
import UserAccountHeaderForm from '../components/profilePage/UserAccountHeaderForm';
import TwoButtonAlert from '../components/TwoButtonAlert';
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

// Context
import { Context as AuthContext } from '../context/AuthContext';

// Firebase
import busTechPostFire from '../firebase/busTechPostFire';
import contentGetFire from '../firebase/contentGetFire';
import usersGetFire from '../firebase/usersGetFire';

// Designs
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

// Color
import color from '../color';

// expo icons
import expoIcons from '../expoIcons';

// Hooks
import count from '../hooks/count';
import { wait } from '../hooks/wait';
import { isCloseToBottom } from '../hooks/isCloseToBottom';
import { useOrientation } from '../hooks/useOrientation';

const UserAccountScreen = ({ route, navigation }) => {
	const [ windowWidth, setWindowWidth ] = useState(Dimensions.get("window").width);
  const [ windowHeight, setWindowHeight ] = useState(Dimensions.get("window").height);
  const [ threePostsRowImageWH, setThreePostsRowImageWH ] = useState(Dimensions.get("window").width/3-2);

  const orientation = useOrientation();

  useEffect(() => {
  	let isMounted = true;
  	isMounted && setThreePostsRowImageWH(Dimensions.get("window").width/3-2);
  	isMounted && setWindowWidth(Dimensions.get("window").width);
  	isMounted && setWindowHeight(Dimensions.get("window").height);

  	return () => {
  		isMounted = false;
  	}
  }, [orientation]);

	const { accountUserId } = route.params;
	const [ refreshing, setRefreshing ] = React.useState(false);
	const [ screenReady, setScreenReady ] = useState(false);
	//
	const [ sentTechApp, setSentTechApp ] = useState(false);
	const [ sentTechLeave, setSentTechLeave ] = useState(false);

	const [ tbaStatus, setTbaStatus ] = useState(false);

	const { state: { user }, accountRefresh, signout } = useContext(AuthContext);

	const [ accountUserData, setAccountUserData ] = useState(null);

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
			const getAccountUserData = usersGetFire.getUserInfoFire(accountUserId);
			getAccountUserData
			.then((userData) => {
				if (userData) {
					let accountUserData = {
						id: userData.id,
						username:userData.username,
						name:userData.name,
						photoURL:userData.photoURL,
						postCount:userData.postCount,
						type: userData.type,
						sign:userData.sign,
						website:userData.website,
					};
					if (userData.type === "business") {
						accountUserData = { ...accountUserData, ...{
							business_hours: userData.business_hours,
							locationType:userData.locationType,
							locality: userData.locality,
							formatted_address:userData.formatted_address,
							googlemapsUrl:userData.googlemapsUrl,
							techs:userData.techs,
							displayPostCount:userData.displayPostCount,
							countRating:userData.countRating,
							businessRegisterdAt:userData.businessRegisteredAt,
							geometry: userData.geometry
						}}
					};
					mounted && setAccountUserData(accountUserData);

					// get account user's posts
					if(userAccountPostFetchSwitch && !userAccountPostState && mounted) {
						mounted && setUserAccountPostState(true);
						const getUserPosts = contentGetFire.getUserPostsFire(null, accountUserId);
						getUserPosts
						.then((posts) => {
							mounted && setUserAccountPosts(posts.fetchedPosts);
							if (posts.lastPost !== undefined && mounted) {
								mounted && setUserAccountPostLast(posts.lastPost);
							} else {
								mounted && setUserAccountPostFetchSwtich(false);
							};
							mounted && setUserAccountPostState(false);
						})
						.catch((error) => {
							rej(error);
						});
					}
					// get account user's display posts
					if (userData.type === 'business' && userAccountDisplayPostFetchSwitch && !userAccountDisplayPostState && mounted) {
						mounted && setUserAccountDisplayPostState(true);
						const getDisplayPosts = contentGetFire.getBusinessDisplayPostsFire(null, accountUserId);
						getDisplayPosts
						.then((posts) => {
							mounted && setUserAccountDisplayPosts(posts.fetchedPosts);
							if (posts.lastPost !== undefined) {
								mounted && setUserAccountDisplayPostLast(posts.lastPost);
							} else {
								mounted && setUserAccountDisplayPostFetchSwtich(false);
							};
							mounted && setUserAccountDisplayPostState(false);
						})
						.catch((error) => {
							rej(error);
						});
					}
					res(true);
				}
			})
			.catch((error) => {
				rej(error);
			});
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
	}, [accountUserId]);

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
    	const getAccountUserData = usersGetFire.getUserInfoFire(accountUserId);
			getAccountUserData
			.then((userData) => {
				if (userData) {
					let accountUserData = {
						id: userData.id,
						username:userData.username,
						name:userData.name,
						photoURL:userData.photoURL,
						postCount:userData.postCount,
						type: userData.type,
						sign:userData.sign,
						website:userData.website,
					};
					if (userData.type === "business") {
						accountUserData = { ...accountUserData, ...{
							locationType:userData.locationType,
							locality: userData.locality,
							formatted_address:userData.formatted_address,
							googlemapsUrl:userData.googlemapsUrl,
							techs:userData.techs,
							displayPostCount:userData.displayPostCount,
							countRating:userData.countRating,
							businessRegisterdAt:userData.businessRegisteredAt,
							geometry: userData.geometry
						}}
					};
					mounted && setAccountUserData(accountUserData);

					// get account user's posts
					if(userAccountPostFetchSwitch && !userAccountPostState && mounted) {
						mounted && setUserAccountPostState(true);
						const getUserPosts = contentGetFire.getUserPostsFire(null, accountUserId);
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
						.catch((error) => {

						});
					}
					// get account user's display posts
					if (userData.type === 'business' && userAccountDisplayPostFetchSwitch && !userAccountDisplayPostState && mounted) {
						mounted && setUserAccountDisplayPostState(true);
						const getDisplayPosts = contentGetFire.getBusinessDisplayPostsFire(null, accountUserId);
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
						.catch((error) => {

						});
					}
				}
			})
			.catch((error) => {
				// handle error
			});
    });

    wait(2000).then(() => setRefreshing(false));

    return () => {
    	mounted = false;
    }
  }, []);

  const [status, setStatus] = useState({});

	return (
		screenReady === true
		?
		<View style={styles.mainContainer}>
			{/*Header*/}
			<UserAccountHeaderForm
				addPaddingTop={true}
			  leftButtonTitle={null}
      	leftButtonIcon={expoIcons.chevronBack(RFValue(27), color.black1)}
			  leftButtonPress={() => { navigation.goBack() }}
				username={accountUserData.username}
				title={null}
				firstIcon={
					<Feather name="send" size={RFValue(25)} color={color.black1} />
				}
				secondIcon={
					accountUserData.type === 'business'
					? <Feather name="shopping-bag" size={RFValue(25)} color={color.black1} />
					: null
				}
				firstOnPress={() => {
					navigation.navigate('Chat', { theOtherUser: accountUserData });
				}}
				secondOnPress={
					accountUserData.type === 'business'
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
			      	const getUserPosts = contentGetFire.getUserPostsFire(userAccountPostLast, accountUserId);
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
			      	// console.log("UserAccountScreen: scrollView: onScroll: post switch: " + userAccountPostFetchSwitch + " post state: " + userAccountPostState );
			      };
			    }}
			    scrollEventThrottle={1000}
			    style={styles.userPostsContainer}
				>
					<ProfileCardUpper 
						photoURL={accountUserData.photoURL}
						postCount={accountUserData.postCount}
					/>
					<ProfileCardBottom
						locationType={accountUserData.type === 'business' ? accountUserData.locationType : null}
						address={accountUserData.type === 'business' ?  accountUserData.formatted_address : null}
						googleMapUrl={accountUserData.type === 'business' ?  accountUserData.googlemapsUrl : null}
						sign={accountUserData.sign}
						websiteAddress={accountUserData.website}
					/>

					{/*account communication tools*/}
					<View style={styles.accountManagerContainer}>
						{ // when target user is a business
							accountUserData.type === 'business'
							?
							<View style={styles.managerButtonContainer}>
								<TouchableOpacity onPress={() => {
									navigation.navigate('ShopStack', 
									{	
										screen: 'BusinessSchedule',
										params: {
              				businessUser: accountUserData
              			},
              		});
								}}>
									<ButtonA 
										text="Shop"
										buttonContainerCustomStyle={
											{ borderColor: color.red2 }
										}
										customStyles={{
											fontSize: RFValue(15), 
											color: color.red2,
										}}
										icon={<Feather name="shopping-bag" size={RFValue(23)} color={color.red2} />}
									/>
								</TouchableOpacity>
							</View>
							: null
						}
						{ // when user is a technician, target user is a business which user isn't part of 
							user.type === 'technician' &&
							accountUserData.techs.includes(user.id) === false &&
							accountUserData.type === 'business' && 
							sentTechApp === false
							?
							<View style={styles.managerButtonContainer}>
								<TouchableOpacity 
									onPress={() => {
										setTbaStatus("apply");
									}}
								>
									<ButtonA 
										text={`Join ${accountUserData.username}`}
										customStyles={{
											fontSize: RFValue(15), 
											color: color.black1,
										}}
									/>
								</TouchableOpacity>
							</View>
							:
							user.type === 'technician' && 
							accountUserData.techs.includes(user.id) === false &&
							accountUserData.type === 'business' && 
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
							accountUserData.techs.includes(user.id) &&
							accountUserData.type === 'business' &&
							sentTechLeave === false 
							?
							<View style={styles.managerButtonContainer}>
								<TouchableOpacity 
									onPress={() => {
										setTbaStatus("leave");
									}}
								>
									<ButtonA 
										text={`Request Leave to ${accountUserData.username}`}
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
						accountUserData.type === 'business'
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
						accountUserData.type === 'business' && userAccountDisplayPosts.length > 0
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
										const getDisplayPosts = contentGetFire.getBusinessDisplayPostsFire(userAccountDisplayPostLast, user.id);
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
		                <TouchableWithoutFeedback 
		                  style={{ ...styles.postImageContainer, ...{ height: windowWidth/2 + RFValue(50), width: windowWidth/2 } }}
		                  onPress={() => {
		                  	navigation.navigate(
		                  		'PostsSwipe',
		                  		{
		                  			postSource: 'userAccountDisplay',
		                  			cardIndex: index,
		                  			accountUserId: accountUserId,
		                  			posts: userAccountDisplayPosts,
        										postState: userAccountDisplayPostState,
														postFetchSwitch: userAccountDisplayPostFetchSwitch,
														postLast: userAccountDisplayPostLast,
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
				                	taggedCount={count.kOrNo(item.data.taggedCount)}
				                	title={item.data.title}
				                	likeCount={count.kOrNo(item.data.like)}
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
			                </View>
		                </TouchableWithoutFeedback>
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
						accountUserId={accountUserId}
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
			{ 
		    tbaStatus
		    && 
		    <TwoButtonAlert 
		      title={<Ionicons name="alert-circle-outline" size={RFValue(27)} color={color.black1} />}
		      message={`Do you want to send an application to ${accountUserData.username} to join as a technician?`}
		      buttonOneText={"Yes"}
		      buttonTwoText={"No"}
		      buttonOneAction={() => {
		      	if (tbaStatus === "leave") {
		      		const sendLeaveRequest = busTechPostFire.sentTechLeave(accountUserId, user.id);
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
		      		const sendRequest = busTechPostFire.sendTechApp(accountUserId, user.id);
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
		marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: RFValue(15),
	},

	userPostsLabelContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff',
    padding: RFValue(10),
    height: RFValue(57)
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
});

export default UserAccountScreen;
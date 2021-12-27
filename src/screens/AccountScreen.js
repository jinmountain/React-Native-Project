import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { 
	View,
	SafeAreaView,
	StatusBar,
	StyleSheet,
	Image,
	ImageBackground,
	Text,  
	TouchableOpacity,
	TouchableWithoutFeedback,
	Dimensions,
	FlatList,
	Animated,
	Pressable
} from 'react-native';

// NPMs
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Video, AVPlaybackStatus } from 'expo-av';

// Components
import BusRatePosts from '../components/accountScreen/BusRatePosts';
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
import CollapsibleTabView from '../components/CollapsibleTabView';

// Last Page Sign
import PostEndSign from '../components/PostEndSign';
import DisplayPostEndSign from '../components/DisplayPostEndSign';
// Header
import UserAccountHeaderForm from '../components/profilePage/UserAccountHeaderForm';

// Context
import { Context as AuthContext } from '../context/AuthContext';

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

	const [ userPostLabelValue, setUserPostLabelValue ] = useState("userPost");
	const [ enableScroll, setEnableScroll ] = useState(true);

	useEffect(() => {
		console.log("account screen user: ", user.id);

		let mounted = true;
		const getScreenReady = new Promise ((res, rej) => {
			if (accountPostFetchSwitch && !accountPostState && mounted) {
				mounted && setAccountPostState(true);
				const getUserPosts = contentGetFire.getUserPostsFire(null, user.id);
				getUserPosts
				.then((posts) => {
					mounted && setAccountPosts(posts.fetchedPosts);
					if (posts.lastPost !== undefined) {
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
					mounted && setAccountDisplayPosts(posts.fetchedPosts);
					if (posts.lastPost !== undefined) {
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

    return () => {
    	mounted = false;
    }
  }, []);

  const TabHeader = () => {
  	return (
  		<View>
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
					<View style={styles.displayPostLabelContainer}>
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
					screenReady && user.type === 'business'
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
							ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
	            horizontal
	            showsHorizontalScrollIndicator={false}
	            data={accountDisplayPosts}
	            keyExtractor={(displayPost, index ) => index.toString()}
	            renderItem={({ item, index }) => {
	              return (
	                <TouchableWithoutFeedback 
	                  style={styles.displayPostContainer}
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
	                	<View style={styles.displayPostInner}>
			                <DisplayPostImage
			                	type={item.data.files[0].type}
			                	url={item.data.files[0].url}
			                	imageWidth={RFValue(150)}
			                />
			                <DisplayPostInfo
			                	containerWidth={RFValue(150)}
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
	          <View style={styles.displayLoadingContainer}>
							{ 
								accountDisplayPostState
								?
								<DisplayPostLoading />
								: 
								null
							}
						</View>
					</View>
					: <DisplayPostsDefault />
				}
  		</View>
  	)
  }

  const renderFirstTabItem = ({ item, index }) => {
    return (
      <View
        key={item.id}
        style={[styles.imageContainer, 
          index % 3 !== 0 ? { paddingLeft: 2 } : { paddingLeft: 0 }
        ]}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate(
              'PostsSwipe',
              { 
                postSource: 'account',
                cardIndex: index,
                accountUserId: user.id,
                posts: accountPosts,
                postState: accountPostState,
                postFetchSwitch: accountPostFetchSwitch,
                postLast: accountDisplayPostLast,
              }
            );
          }}
        > 
          <View>
            { 
              item.data.files[0].type === 'video'
              ?
              <View style={{width: threePostsRowImageWH, height: threePostsRowImageWH}}>
                <Video
                  // ref={video}
                  style={{backgroundColor: color.white2, borderWidth: 0, width: threePostsRowImageWH, height: threePostsRowImageWH}}
                  source={{
                    uri: item.data.files[0].url,
                  }}
                  useNativeControls={false}
                  resizeMode="contain"
                  shouldPlay={false}
                />
              </View>
              : item.data.files[0].type === 'image'
              ?
              <ImageBackground 
                // defaultSource={require('../../img/defaultImage.jpeg')}
                source={{uri: item.data.files[0].url}}
                style={{width: threePostsRowImageWH, height: threePostsRowImageWH}}
              />
              : null
            }
            { item.data.files.length > 1
              ? <MultiplePhotosIndicator size={16}/>
              : null
            }
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

	return (
		screenReady
		?
		<View style={{ flex: 1, backgroundColor: color.white1 }}>
			<View style={styles.headerBarContainer}>
				<SafeAreaView />
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
				/>
			</View>
			<View style={styles.mainContainer}>
				<CollapsibleTabView
					TabHeader={<TabHeader />}
					tabRoutes={[
				    {key: 'tab1', title: 'Tab1'},
				    {key: 'tab2', title: 'Tab2'},
  				]}
  				tabIcons={[ 
  					expoIcons.antdesignPicture(RFValue(23), color.black1),
  					expoIcons.antdesignStaro(RFValue(23), color.yellow2)
  				]}
  				firstTabData={accountPosts}
  				renderFirstTabItem={renderFirstTabItem}
  				onRefresh={onRefresh}
				/>
			</View>
		</View>
		: 
		<SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<SpinnerFromActivityIndicator/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},
	headerBarContainer: { 
		backgroundColor: color.white2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    // for android
    elevation: 5,
    // for ios
    zIndex: 5
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
	displayPostLabelContainer: {
		backgroundColor: color.white2,
		justifyContent: 'center',
		alignItems: 'center',
    padding: RFValue(10),
    height: RFValue(57),
	},

	userPostLabelContainer: {
		height: RFValue(60),
		backgroundColor: color.white2,
	},
	userPostLabelIndicatorContainer: {
		height: RFValue(3)
	},
	userPostLabelButtonsContainer: {
		backgroundColor: color.white2,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
    padding: RFValue(10),
    height: RFValue(57),
	},
	userPostLabelButton: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
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
		backgroundColor: color.white2,
	},
	displayLoadingContainer: {
		position: 'absolute',
		width: '100%',
		justifyContent: 'center',
		paddingTop: 30
	},
	displayPostContainer: {
		alignItems: 'center',
		height: RFValue(200),
		width: RFValue(15),
		marginRight: 2,
	},
	displayPostInner: { 
		height: RFValue(200),
	},
	multiplePhotosSymbol: {
		position: 'absolute',
		alignSelf: 'flex-end',
		paddingRight: 10,
		marginTop: 10,
	},

	imageContainer: {
    alignItems: 'center',
    marginBottom: 2,
  },
  emptyPostContainer: {
    marginVertical: RFValue(7),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyPostText: {
    fontSize: RFValue(17),
    color: color.grey3,
  },
});

export default AccountScreen;
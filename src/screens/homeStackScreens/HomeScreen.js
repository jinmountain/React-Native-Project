import React, { useState, useContext, useEffect, useRef } from 'react';
import { 
	Text, 
	FlatList,
	ScrollView,
	View, 
	Button, 
	StyleSheet, 
	TouchableOpacity,
	Image,
	Dimensions,
} from 'react-native';
import { SafeAreaView, } from 'react-native-safe-area-context';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Video, AVPlaybackStatus } from 'expo-av';

// Contexts
import { Context as PostContext } from '../../context/PostContext';
import { Context as AuthContext } from '../../context/AuthContext';
import { Context as SocialContext } from '../../context/SocialContext';

// Hooks
import contentGetFire from '../../firebase/contentGetFire';

// Designs
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

// Adapters
import tagGetFire from '../../firebase/tags/tagGetFire';

// Components
import { HeaderForm } from '../../components/HeaderForm';
import MainTemplate from '../../components/MainTemplate';
import MultiplePhotosIndicator from '../../components/MultiplePhotosIndicator';

// I18n
import i18n from '../../i18n/i18n';

// Color
import color from '../../color';

const { width, height } = Dimensions.get("window");

// every row has 2 paddingLeft on post of index % 3 === 0
// so total 4 and divide it by 3 it leads to each post width/3-4/3
const oneThirdWindow = width/3-(4/3);
const twoThirdWindow = width-(2 + width/3-(4/3));

const CARD_HEIGHT = height * 0.8;
const cardMargin = height * 0.02;
const CARD_WIDTH = width;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const HomeScreen = ({ navigation }) => {
	// Auth Context
	const {
		state: {
			user
		},
  } = useContext(AuthContext);

	// Home Hot Post
	// Hot Post States
	const [ hotPosts, setHotPosts ] = useState([]);
	const [ hotPostLast, setHotPostLast ] = useState(null);
	const [ hotPostFetchSwitch, setHotPostFetchSwitch ] = useState(true);
	const [ hotPostState, setHotPostState ] = useState(false);
	
	useEffect(() => {
		let isMounted = true;
		if( hotPostFetchSwitch && !hotPostState) {
			isMounted && setHotPostState(true);
			const getHotPosts = contentGetFire.getHotPostsFire(hotPostLast, user.id);
			getHotPosts
			.then((posts) => {
				isMounted && setHotPosts([ ...hotPosts, ...posts.fetchedPosts ]);
				if (posts.lastPost !== undefined) {
					isMounted && setHotPostLast(posts.lastPost);
				} else {
					isMounted && setHotPostFetchSwitch(false);
				};
				isMounted && setHotPostState(false);
			})
		}

		const tagsHot = tagGetFire.getTagsHotFire();
		tagsHot
		.then((tags) => {
			isMounted && setTrendingTags(tags);
			console.log("fetched hot tags", trendingTags);
		})
		.catch((error) => {
			console.log("failed to fetch tags hot: ", error);
		});

		return () => {
			isMounted = false;
			setHotPosts([]);
			setHotPostLast(null);
			setHotPostFetchSwitch(true);
			setHotPostState(false);

			setTrendingTags([]);
		}
	}, []);

	// const {
	// 	state: {
	// 		hotPosts,
	// 	},
	// 	// when use back on adroid on createPostScreen 
	// 	// send to HomeScreen and resetPost to delete the states on createPostScreen
 //    clearFirstAndGetHotPosts,
 //  } = useContext(PostContext);

  const {
		state: {
			receivedNotificationResponse
		},
  } = useContext(SocialContext);

	const [trendingTags, setTrendingTags] = useState([]);

	// useEffect(() => {
	// 	// Good Here
	// 	// const tagsHot = tagGetFire.getTagsHotFire();
	// 	// tagsHot
	// 	// .then((tags) => {
	// 	// 	setTrendingTags(tags);
	// 	// 	console.log("fetched hot tags", trendingTags);
	// 	// })
	// 	// .catch((error) => {
	// 	// 	console.log("failed to fetch tags hot: ", error);
	// 	// });

	// 	// clearFirstAndGetHotPosts(user.id);
	// }, []);

	// when received new notification
	useEffect(() => {
		if (receivedNotificationResponse && receivedNotificationResponse.collection === 'chats') {
			navigation.navigate('Chat',
  		{
  			theOtherUser: { 
  				id: receivedNotificationResponse.senderId, 
  				username: receivedNotificationResponse.username,
  				photoURL: receivedNotificationResponse.photoURL,
  			}
  		})
		}
	}, [receivedNotificationResponse])

	// const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  
	return (
		<View style={{ flex: 1 }}>
			<View>
				<Text>
					{i18n.t('greeting')}
				</Text>
			</View>
		  <Text>Boundless Designs of Nails</Text>
		  <Text>Carry Messages in your little world</Text>
		  <ScrollView>
			  <View style={styles.trendingTagContainer}>
					<FlatList
			      horizontal
			      showsHorizontalScrollIndicator={false}
			      contentInset={{
		          top: 0,
		          left: SPACING_FOR_CARD_INSET,
		          bottom: 0,
		          right: SPACING_FOR_CARD_INSET
		        }}
			      data={trendingTags}
			      keyExtractor={(tag, index) => index.toString()}
			      renderItem={({ item }) => {
			        return (
			          <TouchableOpacity 
			            onPress={() => {
			            }}
			          >
			            <View style={styles.unitContainer}>
			              <View style={styles.tagsContainer}>
			                <Text style={styles.tagText}>
			                  {item.name}
			                </Text>
			              </View>
			            </View>
			          </TouchableOpacity>
			        )
			      }}
			    />
				</View>

				<View style={styles.trendingPostsContainer}>
					<View style={styles.trendingPostLabelContainer}>
						<Text style={styles.tredningPostText}>
							Trending Posts <Ionicons name="ios-heart" size={24} color="black" />
						</Text>
					</View>
					
					<View style={styles.topPostContainer}>
					{ 
						hotPosts[0] &&
						<View 
							style={styles.imageContainer}
						>
							<TouchableOpacity
		            onPress={() => {
		              navigation.navigate( 'PostsSwipeStack', {
	              		screen: 'PostsSwipe',
	                	params: {
		                	postSource: "hot",
		                  cardIndex: 0,
                			posts: hotPosts,
  										postState: hotPostState,
											postFetchSwitch: hotPostFetchSwitch,
											postLast: hotPostLast,
		                } 
		              });
		            }}
		          > 
		          	{ 
		          		hotPosts[0].data.files[0].type === 'video'
		          		?
		          		<View style={{width: twoThirdWindow, height: twoThirdWindow}}>
							      <Video
							        // ref={video}
							        style={{backgroundColor: color.white2, borderWidth: 0, width: twoThirdWindow, height: twoThirdWindow}}
							        source={{
							          uri: hotPosts[0].data.files[0].url,
							        }}
							        useNativeControls={false}
							        resizeMode="contain"
							        shouldPlay={false}
							        onPlaybackStatusUpdate={status => setStatus(() => status)}
							      />
							    </View>
		          		: hotPosts[0].data.files[0].type === 'image'
		          		?
		          		<Image 
		          			defaultSource={require('../../../img/defaultImage.jpeg')}
			              source={{uri: hotPosts[0].data.files[0].url}}
			              style={{width: twoThirdWindow, height: twoThirdWindow}}
			            />
			            : null
		          	}
		            { hotPosts[0].data.files.length > 1
		              ? <MultiplePhotosIndicator size={16}/>
		              : null
		            }
		          </TouchableOpacity>
						</View>
					}
						<View style={styles.twoPostsBesideTop}>
						{
							hotPosts.slice(1, 3).map((item, index) => 
							(
								<View 
									key={index}
									style={[styles.imageContainer, 
									 { paddingLeft: 2 }
				          ]}
								>
									<TouchableOpacity
				            onPress={() => {
				              navigation.navigate("PostsSwipeStack", {
				              	screen: 'PostsSwipe',
          							params: {
          								postSource: 'hot',
				                  cardIndex: 1 + index
				                }
				              });
				            }}
				          > 
			          	{ 
			          		item.data.files[0].type === 'video'
			          		?
			          		<View style={{width: oneThirdWindow, height: oneThirdWindow}}>
								      <Video
								        // ref={video}
								        style={{backgroundColor: color.white2, borderWidth: 0, width: oneThirdWindow, height: oneThirdWindow}}
								        source={{
								          uri: item.data.files[0].url,
								        }}
								        useNativeControls={false}
								        resizeMode="contain"
								        shouldPlay={false}
								        onPlaybackStatusUpdate={status => setStatus(() => status)}
								      />
								    </View>
			          		: item.data.files[0].type === 'image'
			          		?
			          		<Image 
			          			defaultSource={require('../../../img/defaultImage.jpeg')}
				              source={{uri: item.data.files[0].url}}
				              style={{width: oneThirdWindow, height: oneThirdWindow}}
				            />
				            : null
			          	}
			            { item.data.files.length > 1
			              ? <MultiplePhotosIndicator size={16}/>
			              : null
			            }
				          </TouchableOpacity>
								</View>
							))
						}
						</View>
					</View>
					<View style={styles.hotPostsContainer}>
					{
			      hotPosts.slice(3,6).map((item, index) => 
			      (
			        <View
			          key={item.id}
			          style={[styles.imageContainer, 
			          	// index === 0 || index === 1 
			          	// ? { paddingLeft: 2 }
			            index % 3 !== 0 
			            ? { paddingLeft: 2 } 
			            : { paddingLeft: 0 }
			          ]}
			        >
			          <TouchableOpacity
			            onPress={() => {
			              navigation.navigate( 'PostsSwipeStack', {
		              		screen: 'PostsSwipe',
		                	params: {
			                	postSource: "hot",
			                  cardIndex: 3 + index
			                } 
			              });
			            }}
			          > 
			          { 
		          		item.data.files[0].type === 'video'
		          		?
		          		<View style={{width: oneThirdWindow, height: oneThirdWindow}}>
							      <Video
							        // ref={video}
							        style={{backgroundColor: color.white2, borderWidth: 0, width: oneThirdWindow, height: oneThirdWindow}}
							        source={{
							          uri: item.data.files[0].url,
							        }}
							        useNativeControls={false}
							        resizeMode="contain"
							        shouldPlay={false}
							        onPlaybackStatusUpdate={status => setStatus(() => status)}
							      />
							    </View>
		          		: item.data.files[0].type === 'image'
		          		?
		          		<Image 
		          			defaultSource={require('../../../img/defaultImage.jpeg')}
			              source={{uri: item.data.files[0].url}}
			              style={{width: oneThirdWindow, height: oneThirdWindow}}
			            />
			            : null
		          	}
		            { item.data.files.length > 1
		              ? <MultiplePhotosIndicator size={16}/>
		              : null
		            }
			          </TouchableOpacity>
			        </View>
			      ))
			    }
			    </View>
				</View>
			</ScrollView>
		</View>
  );
};

const styles = StyleSheet.create({
	unitContainer: {
    borderWidth: 1,
    borderRadius: RFValue(8),
    marginLeft: 5,
    paddingVertical: RFValue(5),
    paddingHorizontal: RFValue(5),
    marginVertical: RFValue(3),
  },
  trendingTagContainer: {

  },
  tagsContainer: {
  	justifyContent: 'center',
  	paddingVertical: RFValue(10),
  },
  tagsText: {
  	fontSize: RFValue(15),
  },

  tagsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: "row",
  },
  tagText: {
    marginHorizontal: 3,
    fontSize: RFValue(18),
  },

  hotPostContainer: {
  	width: "100%",
  	height: width,
  	marginBottom: 10,
  	paddingVertical: 10,
  },
  hotPostPhotoContainer: {
  	width: "100%",
  	height: width,
  },
  hotPostPhoto: {
  	width: "100%",
  	height: width,
  },

  scrollView: {
  	bottom: 0,
    left: 0,
    right: 0,
  },
  card: {
    // padding: 10,
    elevation: 5,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
    marginBottom: cardMargin,
    marginRight: 20,
    marginTop: 20,
    justifyContent: 'center',
  },
  hotPostsContainer: {
  	flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 2,
  },
  topPostContainer: {
  	flexDirection: 'row',
    flexWrap: 'wrap',
  },
  twoPostsBesideTop: {
  	flexWrap: 'wrap',
  },
  trendingPostLabelContainer: {
  	justifyContent: 'center',
  	borderWidth: 1,
  },
  tredningPostText: {
  	fontWeight: 'bold',
  	fontSize: RFValue(18),
  },
});

export default HomeScreen;
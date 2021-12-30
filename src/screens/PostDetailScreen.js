import React, { useContext, useEffect, useState } from 'react';
import { 
	View, 
	StyleSheet,
	RefreshControl,
	Image, 
	Text,  
	TouchableOpacity,
	Dimensions,
	FlatList,
	ScrollView, } from 'react-native';

// NPMs
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useIsFocused } from '@react-navigation/native';

// Components
import MainTemplate from '../components/MainTemplate';
import MultiplePhotosIndicator from '../components/MultiplePhotosIndicator';
import SpinnerFromActivityIndicator from '../components/ActivityIndicator';
import DisplayPostsDefault from '../components/defaults/DisplayPostsDefault';
import { HeaderForm } from '../components/HeaderForm';
import VerticalSwipePostImage from '../components/postCard/VerticalSwipePostImage';
import DefaultUserPhoto from '../components/defaults/DefaultUserPhoto';
import PostUserInfoContainer from '../components/postCard/PostUserInfoContainer';
import PanX from '../components/PanX';

import PostInfoBox from '../components/postCard/PostInfoBox';

// Context
import { Context as AuthContext } from '../context/AuthContext';

// Header
import UserAccountHeaderForm from '../components/profilePage/UserAccountHeaderForm';

// Firebase
import businessGetFire from '../firebase/businessGetFire';
import postGetFire from '../firebase/post/postGetFire';

// Designs
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

// Color
import color from '../color';

// expo icons
import expoIcons from '../expoIcons';

// Hooks

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const techBoxWidth = windowWidth/3;

const PostDetailScreen = ({ route, navigation }) => {
	const isFocused = useIsFocused();
	const { postId } = route.params;

	const { state: { user }} = useContext(AuthContext);

	const [refreshing, setRefreshing] = React.useState(false);
	const [ screenReady, setScreenReady ] = useState(false);

	// techs states
	const [ displayPostTechs, setDisplayPostTechs ] = useState([]);
	const [ displayPostTechsState, setDisplayPostTechsState ] = useState(false);

	const [ post, setPost ] = useState(null);

	useEffect(() => {
		let isMounted = true
		const getScreenReady = new Promise ((res, rej) => {
			// post data
			const getPostData = contentGetFire.getPostFire(postId);
			getPostData
			.then((post) => {
				setPost(post);
				// fetch techs when the post is a display post
				if (!displayPostTechsState && post.data.display) {
					isMounted && setDisplayPostTechsState(true);
					const getDisplayPostTechs = businessGetFire.getTechsRating(post.data.techs, post.data.uid, post.id);
					getDisplayPostTechs
					.then((techs) => {
						console.log(techs);
						if (isMounted) {
							setDisplayPostTechs(techs);
							setDisplayPostTechsState(false);
						};
						res(true);
					})
					.catch((error) => {
						console.log(error);
						if (isMounted) {
							setDisplayPostTechsState(false);
						};
						res(true);
					})
				} else {
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
			// handle error
		});

		return () => {
			isMounted = false;
			setScreenReady(false);
			setDisplayPostTechs([]);
			setDisplayPostTechsState(false);
		}
	}, [])

	return (
		<PanX 
      panXAction={() => navigation.goBack()}
      content={
				<View style={styles.mainContainer}>
					<HeaderForm 
						addPaddingTop={true}
		        leftButtonTitle={null}
		        leftButtonIcon={expoIcons.chevronBack(RFValue(27), color.black1)}
		        headerTitle={null} 
		        rightButtonTitle={null} 
		        leftButtonPress={() => {
		          navigation.goBack();
		        }}
		        rightButtonPress={() => {
		          null
		        }}
		      />
					{ 
						screenReady
						?
						<ScrollView style={styles.scrollView}>
							<PostUserInfoContainer
			      		postId={ post.id }
			      		postData={ post.data }
			      		currentUserId={ user.id }
			      	/>
							{
								post.data.display
								?
								<View style={styles.displayPostInfoContainer}>
									<View style={styles.labelContainer}>
										<Text style={styles.labelText}>Technicians</Text>
									</View>
									{
										screenReady && displayPostTechs.length > 0
										?
										<FlatList
						          horizontal
						          showsHorizontalScrollIndicator={false}
						          data={displayPostTechs}
						          keyExtractor={(tech, index) => index.toString()}
						          renderItem={({ item }) => {
						            return (
						              <TouchableOpacity style={styles.techContainer}>
						                <View style={styles.techInnerContainer}>
						                  { 
						                    item.techData.photoURL
						                    ?
						                    <Image style={styles.techImage} source={{ uri: item.techData.photoURL }}/>
						                    : 
						                    <DefaultUserPhoto 
						                      customSizeBorder={RFValue(57)}
						                      cutomSizeUserIcon={RFValue(37)}
						                    />
						                  }
						                  <View style={styles.techInfoContainer}>
						                    <Text style={styles.techUsernameText}>
						                      {item.techData.username}
						                    </Text>
						                    <View style={styles.techRatingContainer}>
						                    	{ 
						                    		// tech rating in the business
						                    		item.techRatingBus.totalRating && item.techRatingBus.countRating
						                    		?
						                    		<View style={styles.techInfoInner}>
						                    			<Text stlye={styles.techInfoText}>
						                    			mean
						                    			</Text>
						                    			<View style={styles.techInfoIcon}>
							                    			<AntDesign name="staro" size={RFValue(13)} color={color.black1} />
							                    		</View>
							                    		<Text stlye={styles.techInfoText}>{(Math.round(item.techRatingBus.totalRating/item.techRatingBus.countRating * 10) / 10).toFixed(1)}</Text>
							                    	</View>
						                    		:
						                    		<View style={styles.techInfoInner}>
						                    			<Text stlye={styles.techInfoText}>
						                    			mean
						                    			</Text>
						                    			<View style={styles.techInfoIcon}>
							                    			<AntDesign name="staro" size={RFValue(13)} color={color.black1} />
							                    		</View>
							                    		<Text stlye={styles.techInfoText}>-</Text>
							                    	</View>
						                    	}

						                    	{
						                    		// tech rating in the business of the post
						                    		item.techRatingPost && item.techRatingPost.totalRating && item.techRatingPost.countRating
						                    		?
						                    		<View style={styles.techInfoInner}>
						                    			<View style={styles.techInfoIcon}>
							                    			<AntDesign name="staro" size={RFValue(13)} color={color.black1} />
							                    		</View>
							                    		<Text stlye={styles.techInfoText}>{(Math.round(item.techRatingPost.totalRating/item.techRatingPost.countRating * 10) / 10).toFixed(1)}</Text>
							                    	</View>
						                    		:
						                    		<View style={styles.techInfoInner}>
						                    			<View style={styles.techInfoIcon}>
							                    			<AntDesign name="staro" size={RFValue(13)} color={color.black1} />
							                    		</View>
							                    		<Text stlye={styles.techInfoText}>-</Text>
							                    	</View>
						                    	}
						                    	
						                    </View>
						                  </View>
						                </View>
						              </TouchableOpacity>
						            )
						          }}
						        />
										:
										<TouchableOpacity style={styles.techDefaultContainer}>
			                <View style={styles.techInnerContainer}>
			                	<AntDesign name="rest" size={24} color="black" /><Text>Something went wrong</Text>
			                </View>
			              </TouchableOpacity>
									}
								</View>
								: null
							}
							<VerticalSwipePostImage
				        files={post.data.files}
				        onFocus={true}
				      />
				      <PostInfoBox
				        tags={post.data.tags}
				        totalRating={post.data.totalRating}
				        countRating={post.data.countRating}
				        caption={post.data.caption}
				        defaultCaptionNumLines={1}
				        postId={post.id}
				        postUserId={post.data.uid}
				        likeCount={post.data.likeCount}
				        commentCount={post.data.comment_count}
				        postTimestamp={post.data.createdAt}
				        currentUserPhotoURL={user.photoURL}
		        		currentUserId={user.id}
		        		postDetail={true}
				      />
							<View>
							</View>
						</ScrollView>
						:
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							<SpinnerFromActivityIndicator/>
						</View>
					}
				</View>
			}
		/>
	);
};

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		backgroundColor: color.white2,
	},
	scrollView: {
		flex: 1,
	},
	displayPostInfoContainer: {
		backgroundColor: color.white2,
		paddingVertical: RFValue(3),
	},
	techDefaultContainer: {
		height: techBoxWidth, 
    width: "100%", 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(3),
	},
  techContainer: {
    height: techBoxWidth, 
    width: techBoxWidth, 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(3),
  },
  techImage: {
    height: RFValue(57),
    width: RFValue(57),
    borderRadius: RFValue(100),
  },
  techInnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  techInfoContainer: {
  	borderWidth: 1,
  	borderColor: color.red2,
  	backgroundColor: color.white2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: RFValue(3),
    paddingHorizontal: RFValue(3),
    borderRadius: RFValue(7)
  },
	techInfoInner: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: RFValue(3),
	},
	techInfoIcon: {
		paddingHorizontal: RFValue(3),
	},
	techInfoText: {
		fontSize: RFValue(13),
	},
  techUsernameText: {
    fontSize: RFValue(15),
  },

  labelContainer: {
  	justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: RFValue(7),
  },
  labelText: {
  	fontSize: RFValue(15),
  	fontWeight: 'bold',
  },
});

export default PostDetailScreen;
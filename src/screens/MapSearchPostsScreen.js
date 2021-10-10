import React, { useContext, useState, useEffect } from 'react';
import { 
	Text, 
	View, 
	Button, 
	StyleSheet, 
	TouchableOpacity,
	FlatList,
	Dimensions, 
	ScrollView,
	Image,
	Animated,
} from 'react-native';
import { SafeAreaView, } from 'react-native-safe-area-context';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Designs
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

// Contexts
import { Context as PostContext } from '../context/PostContext';
import { Context as AuthContext } from '../context/AuthContext';

// Components
import ThreePostsRow from '../components/ThreePostsRow';
import { HeaderForm } from '../components/HeaderForm';
import MultiplePhotosIndicator from '../components/MultiplePhotosIndicator';
import SpinnerFromActivityIndicator from '../components/ActivityIndicator';
import DisplayPostsDefault from '../components/defaults/DisplayPostsDefault';
// Display Post
import DisplayPostImage from '../components/displayPost/DisplayPostImage';
import DisplayPostInfo from '../components/displayPost/DisplayPostInfo';
import DisplayPostLoading from '../components/displayPost/DisplayPostLoading';
// Loading Containers
import GetPostLoading from '../components/GetPostLoading';
// Last Page Sign
import PostEndSign from '../components/PostEndSign';
import DisplayPostEndSign from '../components/DisplayPostEndSign';

// Color
import color from '../color';

// Hooks
import { kOrNo } from '../hooks/kOrNo';
import { wait } from '../hooks/wait';
import { isCloseToBottom } from '../hooks/isCloseToBottom';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const MapSearchPostsScreen = ({ route, navigation }) => {
	const { businessUser } = route.params;

	const {
		state: { user }
	} = useContext(AuthContext);

	// controls
	const [ tryGetBusinessTaggedPosts, setTryGetBusinessTaggedPosts ] = useState(false);
	const [ tryGetBusinessUserPosts, setTryGetBusinessUserPosts ] = useState(false);

	const [ businessTaggedPosts, setBusinessTaggedPosts ] = useState([]);
	const [ businessUserPosts, setBusinessUserPosts ] = useState([]);

  // const { 
  //   state: { 
  //   	businessTaggedPosts, 
  //   	businessUserPosts,
  //   	// for getHomeBusinessPosts
  //   	businessTaggedPostFetchSwitch,
		// 	businessTaggedPostLast,
		// 	businessTaggedPostState,

		// 	businessUserPostFetchSwitch,
		// 	businessUserPostLast,
		// 	businessUserPostState,
  //   }, 
  //   getBusinessTaggedPosts,
		// getBusinessUserPosts,
		// resetBusinessPosts
  // } = useContext(PostContext);

	// useEffect(() => {
	// 	getBusinessTaggedPosts(
	// 		businessTaggedPostFetchSwitch,
	// 		businessTaggedPostLast,
	// 		businessUser.id,
	// 		user.id
	// 	)
	// 	.then(() => {
	// 		setTryGetBusinessTaggedPosts(true);
	// 	});
	// 	getBusinessUserPosts(
	// 		businessUserPostFetchSwitch,
	// 		businessUserPostLast, 
	// 		businessUser,
	// 		user.id
	// 	)
	// 	.then(() => {
	// 		setTryGetBusinessUserPosts(true);
	// 	});

	// 	return () => {
	// 		resetBusinessPosts();
	// 	}
	// }, []);

	return (
		<SafeAreaView style={styles.homePostsScreenContainer}>
			<HeaderForm 
        leftButtonTitle='Back'
        headerTitle={businessUser.username} 
        rightButtonTitle={null} 
        leftButtonPress={() => {
          navigation.goBack(); 
        }}
        rightButtonPress={() => {
          null
        }}
      />
			<ScrollView
				onScroll={({nativeEvent}) => {
					if (isCloseToBottom(nativeEvent) && businessTaggedPostState === false) {
		      	getBusinessTaggedPosts(
							businessTaggedPostFetchSwitch,
							businessTaggedPostLast,
							businessUser.id
						);
		      };
		    }}
		    scrollEventThrottle={400}
			>
				<View style={styles.userPostsLabelContainer}>
					<Text style={styles.userPostsLabelText}>
						<Feather name="menu" size={RFValue(23)} color={color.black1} />
					</Text>
				</View>
				<View style={styles.userPostsContainer}>
				{ 
					businessUserPostState && businessUserPosts.length === 0
					?
					<View style={styles.businessUserPostLoadingContainer}>
						<SpinnerFromActivityIndicator customColor={color.gray1}/>
					</View>
					: tryGetBusinessUserPosts && businessUserPosts.length === 0
					? <DisplayPostsDefault />
					:
					<FlatList
						onEndReached={() => {
							if(!businessUserPostState && businessUserPostFetchSwitch) {
								getBusinessUserPosts(
									businessUserPostFetchSwitch, 
									businessUserPostLast, 
									businessUser,
									user.id
								)
							}
						}}
						onEndReachedThreshold={0.01}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={businessUserPosts}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity 
                  style={styles.postImageContainer}
                  onPress={() => {
                  	navigation.navigate('PostsSwipeStack', {
                  		screen: 'PostsSwipe',
                  		params: {	
                  			postSource: 'businessUser',
                  			cardIndex: index,
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
				}
				{ 
					businessUserPostState && businessUserPosts.length !== 0
					?
					<DisplayPostLoading />
					: 
					null
				}
				</View>
				<View style={styles.businessTaggedPostsLabelContainer}>
					<Text style={styles.businessTaggedPostsLabelText}>
						<Feather name="tag" size={RFValue(23)} color={color.black1} />
					</Text>
				</View>
				<ThreePostsRow
					navigate={navigation.navigate}
					posts={businessTaggedPosts} 
					screen={"businessTagged"} 
					state={businessTaggedPostState}
					threePostsRowImageWH={windowWidth/3 - 2}
				/>
				{ 
					businessTaggedPostState
					?
					<GetPostLoading />
					: 
					null
				}
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	homePostsScreenContainer: {
		backgroundColor: '#fff',
		flex: 1,
	},
	userPostsContainer: {
		flex: 1,
	},
	postImageContainer: {
		height: windowWidth/2 + RFValue(30),
		alignItems: 'center',
		marginRight: 2,
	},
	postImage: {
		width: windowWidth/2, 
		height: windowWidth/2
	},
	multiplePhotosSymbol: {
		position: 'absolute',
		alignSelf: 'flex-end',
		paddingRight: 10,
		marginTop: 10,
	},
	userPostsLabelContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#ccc',
		backgroundColor: '#fff',
		elevation: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    padding: 10,
    marginTop: 2,
    marginBottom: 2,
	},
	userPostsLabelText: {
		fontSize: RFValue(15),
	},
	businessTaggedPostsLabelContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#ccc',
		backgroundColor: '#fff',
		elevation: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    padding: 10,
    marginTop: 2,
    marginBottom: 2,
	},
	businessTaggedPostsLabelText: {
		fontSize: RFValue(15),
	},
	businessUserPostLoadingContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		height: windowWidth/2,
	},
	businessUserPostLoading: {
		width: windowWidth/2-1, 
		height: windowWidth/2-1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: color.gray4,
		borderWidth: 0.5,
		borderColor: color.white1,
	}
});

export default MapSearchPostsScreen;
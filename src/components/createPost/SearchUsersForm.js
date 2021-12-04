import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Image,
  View, 
  Text, 
  StyleSheet, 
  TouchableHighlight,
  Dimensions,
  // TouchableOpacity,
} from "react-native";
// TouchableOpacity from rngh works on both ios and android
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Video, AVPlaybackStatus } from 'expo-av';

// Components
import { StarRating } from '../StarRating';
import { SearchBarChosenUser } from './SearchBarChosenUser';
import { SearchBar } from './SearchBar';
import THButtonWithBorder from '../../components/buttons/THButtonWithBorder';
import THButtonWOBorder from '../../components/buttons/THButtonWOBorder';
import { InputFormBottomLine } from '../../components/InputFormBottomLine';
import SpinnerFromActivityIndicator from '../../components/ActivityIndicator';
import DefaultUserPhoto from '../../components/defaults/DefaultUserPhoto';
import VerticalSeperatorLine from '../../components/VerticalSeperatorLine';

// Display Post
import DisplayPostImage from '../../components/displayPost/DisplayPostImage';
import DisplayPostInfo from '../../components/displayPost/DisplayPostInfo';
import DisplayPostLoading from '../../components/displayPost/DisplayPostLoading';

// Hooks
import businessGetFire from '../../firebase/businessGetFire';
// import { navigate } from '../../navigationRef';
import { kOrNo } from '../../hooks/kOrNo';

// firebase
import contentGetFire from '../../firebase/contentGetFire';

// Designs
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

// Color
import color from '../../color';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const selectedDisplayAndTechWidth = windowWidth/3;

const SearchUsersForm = ({
  userId,
  usersFound,
  setUsersFound,
  rating,
  setRating,
  chosenUser,
  setChosenUser,
  searchUserUsername,
  setSearchUserUsername,
  chosenDisplayPost,
  setChosenDisplayPost,
  chosenTech,
  setChosenTech,

  displayPostTechs, 
  setDisplayPostTechs,
  displayPostTechsState,
  setDisplayPostTechsState,

  chosenUserDisplayPosts,
  setChosenUserDisplayPosts,
  chosenUserDisplayPostLast,
  setChosenUserDisplayPostLast,
  chosenUserDisplayPostFetchSwitch,
  setChosenUserDisplayPostFetchSwtich,
  chosenUserDisplayPostState,
  setChosenUserDisplayPostState
}) => {
  const ResetRatingProcess = () => {
    setChosenUser(null);
    setChosenTech(null);
    setChosenDisplayPost(null);
    setRating(null);
    setDisplayPostTechs([]);
    setDisplayPostTechsState(false);
    setChosenUserDisplayPosts([]);
    setChosenUserDisplayPostLast(null);
    setChosenUserDisplayPostFetchSwtich(true);
    setChosenUserDisplayPostState(false);
  };

  useEffect(() => {
    let mounted = true;
    if (
      chosenUser && 
      chosenUser.type === "business" && 
      chosenUserDisplayPostFetchSwitch && 
      !chosenUserDisplayPostState
    ) {
      const getChosenUserDisplayPosts = contentGetFire.getBusinessDisplayPostsFire(null, chosenUser, null);
      getChosenUserDisplayPosts
      .then((posts) => {
        mounted && setChosenUserDisplayPosts([ ...posts.fetchedPosts ]);
        if (posts.lastPost !== undefined) {
          mounted && setChosenUserDisplayPostLast(posts.lastPost);
        } else {
          mounted && setChosenUserDisplayPostFetchSwtich(false);
        };
        mounted && setChosenUserDisplayPostState(false);
      })
    };
    return () => {
      mounted = false;
    }
  }, [chosenUser]);

  return (
    <View style={styles.userSearchFormContainer}>
      <View style={styles.searchBarContainer}>
        { chosenUser
          ?
          <SearchBarChosenUser
            chosenUser={chosenUser}
            setChosenUser={setChosenUser} 
            setRating={setRating}
            ResetRatingProcess={ResetRatingProcess}
          /> 
          :
          <SearchBar
            searchUserUsername={searchUserUsername}
            setSearchUserUsername={setSearchUserUsername}
            setUsersFound={setUsersFound}
          />
        }
      </View>
      {
        chosenUser && chosenDisplayPost && chosenTech && rating 
        ?
        <TouchableOpacity 
          style={{ flexDirection: 'row', justifyContent: 'center' }}
          onPress={() => {
            ResetRatingProcess();
          }}
        >
          <View style={styles.summaryElementContainer}>
            <View style={styles.summaryLabelContainer}>
              <Text style={styles.summaryLabelText}>
                Design
              </Text>
            </View>
            <View style={styles.summaryInfoContainer}>
              { 
                chosenDisplayPost.data.files[0].type === 'video'
                ?
                <View style={styles.selectedPostImage}>
                  <Video
                    // ref={video}
                    style={styles.selectedPostImage}
                    source={{
                      uri: chosenDisplayPost.data.files[0].url,
                    }}
                    useNativeControls={false}
                    resizeMode="contain"
                    shouldPlay={false}
                  />
                </View>
                : chosenDisplayPost.data.files[0].type === 'image'
                ?
                <Image 
                  style={styles.selectedPostImage} 
                  source={{ uri: chosenDisplayPost.data.files[0].url }}
                />
                : null
              }
            </View>
          </View>
          <VerticalSeperatorLine />
          <View style={styles.summaryElementContainer}>
            <View style={styles.summaryLabelContainer}>
              <Text style={styles.summaryLabelText}>
                Technician
              </Text>
            </View>
            <View style={styles.summaryInfoContainer}>
              <View style={styles.techInnerContainer}>
                { 
                  chosenTech.techData.photoURL
                  ?
                  <Image style={styles.techImage} source={{ uri: chosenTech.techData.photoURL }}/>
                  : 
                  <DefaultUserPhoto 
                    customSizeBorder={RFValue(57)}
                    cutomSizeUserIcon={RFValue(37)}
                  />
                }
              </View>
            </View>
          </View>
          <VerticalSeperatorLine />
          <View style={styles.summaryElementContainer}>
            <View style={styles.summaryLabelContainer}>
              <Text style={styles.summaryLabelText}>
                Rate
              </Text>
            </View>
            <View style={styles.summaryInfoContainer}>
              <StarRating 
                rating={rating} 
                changeRating={setRating} 
              />
            </View>
          </View>
        </TouchableOpacity>
        :
        <View>
          { // tag display post 
            chosenUser 
            && chosenUser.type === "business" 
            && chosenUserDisplayPosts.length > 0 
            && chosenDisplayPost === null
            ? 
            <View style={styles.rateAndTagContainer}>
              <View style={styles.labelContainer}>
                <View style={styles.guideTextContainer}>
                  <Text style={styles.guideText}>Pick a {chosenUser.username}'s Post</Text>
                </View>
              </View>
              <View style={styles.displayPostsContainer}>
                <FlatList
                  onEndReached={() => {
                    if (chosenUserDisplayPostFetchSwitch && !chosenUserDisplayPostState) {
                      const getChosenUserDisplayPosts = contentGetFire.getBusinessDisplayPostsFire(chosenUserDisplayPostLast, chosenUser, null);
                      getChosenUserDisplayPosts
                      .then((posts) => {
                        setChosenUserDisplayPosts([ ...chosenUserDisplayPosts, ...posts.fetchedPosts ]);
                        if (posts.lastPost !== undefined) {
                          setChosenUserDisplayPostLast(posts.lastPost);
                        } else {
                          setChosenUserDisplayPostFetchSwtich(false);
                        };
                        setChosenUserDisplayPostState(false);
                      });
                    }
                  }}
                  onEndReachedThreshold={0.01}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={chosenUserDisplayPosts}
                  keyExtractor={(displayPost, index) => index.toString()}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity 
                        style={styles.postImageContainer}
                        onPress={() => {
                          setChosenDisplayPost(item);
                          if (!displayPostTechsState) {
                            const getDisplayPostTechs = businessGetFire.getTechniciansByIds(item.data.techs);
                            getDisplayPostTechs
                            .then((techs) => {
                              setDisplayPostTechs(techs);
                              setDisplayPostTechsState(false);
                            })
                            .catch((error) => {
                              console.log("Error occured: BusinessScheduleScreen: getDisplayPostTechs: ", error);
                              setDisplayPostTechsState(false);
                            })
                          }
                        }}
                      >
                        <DisplayPostImage
                          type={item.data.files[0].type}
                          url={item.data.files[0].url}
                          imageWidth={windowWidth/2}
                        />
                        <DisplayPostInfo
                          containerWidth={windowWidth/2}
                          taggedCount={kOrNo(item.data.taggedCount)}
                          title={item.data.title}
                          likeCount={kOrNo(item.data.likeCount)}
                          price={item.data.price}
                          etc={item.data.etc}
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
                  chosenUserDisplayPostState
                  ?
                  <GetDisplayPostLoading />
                  : 
                  null
                }
              </View>
            </View>
            : chosenDisplayPost
            ? 
            <View style={styles.rateAndTagContainer}>
              <View style={styles.chosenDisplayPostContainer}>
                <TouchableOpacity 
                  style={styles.selectedPostImageContainer}
                  onPress={() => {
                    setChosenDisplayPost(null);
                    setRating(null);
                    setChosenTech(null);
                  }}
                >
                { 
                  chosenDisplayPost.data.files[0].type === 'video'
                  ?
                  <View style={styles.selectedPostImage}>
                    <Video
                      // ref={video}
                      style={styles.selectedPostImage}
                      source={{
                        uri: chosenDisplayPost.data.files[0].url,
                      }}
                      useNativeControls={false}
                      resizeMode="contain"
                      shouldPlay={false}
                    />
                  </View>
                  : chosenDisplayPost.data.files[0].type === 'image'
                  ?
                  <Image 
                    style={styles.selectedPostImage} 
                    source={{ uri: chosenDisplayPost.data.files[0].url }}
                  />
                  : null
                }
                  <View style={styles.chosenStatus}>
                    <View style={styles.chosenShadow}>
                    
                    </View>
                    <View style={styles.chosenCheck}>
                      <AntDesign name="checkcircle" size={RFValue(23)} color={color.red2} />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.chosenDisplayPostCheckContainer}>
              </View>
            </View>
            :
            null
          }

          {
            chosenDisplayPost && 
            chosenUser && 
            chosenUser.type === "business" && 
            !displayPostTechsState && 
            !chosenTech
            ?
            <View style={styles.labelContainer}>
              <View style={styles.guideTextContainer}>
                <Text style={styles.guideText}>Choose a technician</Text>
              </View>
            </View>
            : null
          }

          { // rate
            chosenDisplayPost && 
            chosenUser && 
            chosenUser.type === "business" && 
            !displayPostTechsState && 
            !chosenTech
            ? 
            <View style={styles.pickTechContainer}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={displayPostTechs}
                keyExtractor={(tech, index) => index.toString()}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableHighlight 
                      onPress={() => { setChosenTech(item) }}
                      style={styles.techContainer}
                      underlayColor={color.grey4}
                    >
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
                        </View>
                      </View>
                    </TouchableHighlight>
                  )
                }}
              />
            </View>
            : chosenDisplayPost && chosenUser && chosenUser.type === "business" && !displayPostTechsState && chosenTech
            ? 
            <View style={styles.pickTechContainer}>
              <TouchableOpacity 
                onPress={() => { 
                  setChosenTech(null) 
                }}
                style={styles.techContainer}
              >
                <View style={styles.techInnerContainer}>
                  { 
                    chosenTech.techData.photoURL
                    ?
                    <Image style={styles.techImage} source={{ uri: chosenTech.techData.photoURL }}/>
                    : 
                    <DefaultUserPhoto 
                      customSizeBorder={RFValue(57)}
                      cutomSizeUserIcon={RFValue(37)}
                    />
                  }
                  <View style={styles.techInfoContainer}>
                    <Text style={styles.techUsernameText}>
                      {chosenTech.techData.username}
                    </Text>
                  </View>
                </View>
                <View style={styles.chosenStatus}>
                  <View style={styles.chosenShadow}>
                  
                  </View>
                  <View style={styles.chosenCheck}>
                    <AntDesign name="checkcircle" size={RFValue(23)} color={color.red2} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            : chosenDisplayPost && chosenUser && chosenUser.type === "business" && displayPostTechsState
            ?
            <View style={styles.techsLoadingContainer}>
              <SpinnerFromActivityIndicator/>
            </View>
            : null
          }
          
          { // rate
            chosenDisplayPost && chosenUser && chosenUser.type === "business" && chosenTech
            ? 
            <View style={styles.rateAndTagContainer}>
              <InputFormBottomLine customStyles={{borderColor: color.gray1, backgroundColor: '#fff'}}/>
              <View style={styles.labelContainer}>
                <View style={styles.guideTextContainer}>
                  <Text style={styles.guideText}>Rate your experience</Text>
                </View>
              </View>
              <StarRating 
                rating={rating} 
                changeRating={setRating} 
              />
              <View style={{ paddingBottom: RFValue(13) }}>
              </View>
            </View>
            : null
          }
        </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  userSearchFormContainer: {
    backgroundColor: "#fff",
  },
  searchBarContainer: {
    marginVertical: RFValue(7),
  },
  rateAndTagContainer: {
    backgroundColor: "#fff",
    minHeight: selectedDisplayAndTechWidth,
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: RFValue(43),
  },
  guideTextContainer: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  guideText: {
    color: color.black1,
    paddingHorizontal: RFValue(3),
    fontSize: RFValue(17),
  },
  buttonText: {
    fontSize: RFValue(17),
  },
  closeButtonContainer: {
    position: 'absolute',
    alignSelf: "flex-end",
  },
  cancelButton: {
    padding: RFValue(7),
    borderRadius: RFValue(10),
  },

  // tagPost
  displayPostsContainer: {
    width: '100%',
    shadowColor: '#ccc',
    backgroundColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  postImageContainer: {
    height: windowWidth/2 + RFValue(50),
    width: windowWidth/2,
    alignItems: 'center',
    marginRight: 2,
  },
  chosenDisplayPostContainer: {
    height: windowWidth/5,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: RFValue(7),
  },
  selectedPostImageContainer: {
    width: selectedDisplayAndTechWidth,
    height: selectedDisplayAndTechWidth,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 2,
  },
  selectedPostImage: {
    width: windowWidth/5,
    height: windowWidth/5
  },

  pickTechContainer: {
    width: '100%',
    // height: selectedDisplayAndTechWidth,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: RFValue(15),
  },
  techContainer: {
    height: selectedDisplayAndTechWidth, 
    width: selectedDisplayAndTechWidth, 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RFValue(15)
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: RFValue(3),
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
  techsLoadingContainer: {
    width: '100%',
    height: selectedDisplayAndTechWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },

  chosenStatus: {
    flex: 1, 
    height: selectedDisplayAndTechWidth, 
    width: selectedDisplayAndTechWidth, 
    position: 'absolute',
  },
  chosenShadow: {
    flex: 1, 
    height: selectedDisplayAndTechWidth, 
    width: selectedDisplayAndTechWidth, 
    position: 'absolute', 
    backgroundColor: color.black1, 
    opacity: 0.1,
  },
  chosenCheck: {
    flex: 1, 
    position: 'absolute', 
    height: selectedDisplayAndTechWidth, 
    width: selectedDisplayAndTechWidth, 
    justifyContent: 'center', 
    alignItems: 'center'
  },

  summaryElementContainer: {
    padding: RFValue(7),
  },
  summaryInfoContainer: {
    height: RFValue(73),
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryLabelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: RFValue(7),
  },
  summaryLabelText: {
    fontWeight: 'bold',
  },
});

export { SearchUsersForm };
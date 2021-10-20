import React, { useState } from 'react';
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
  rating,
  chosenUser,
  userUsernameInput,

  getCpDisplayPosts,
  cpDisplayPosts,
  selectDisplayPost,
  selectedDisplayPost,
  clearDisplayPost,
  cpDisplayPostState,
  cpDisplayPostFetchSwitch,
  cpDisplayPostLast,

  clearChosenUser,
  rateTech,
  setRateTech,
  clearRating,
  changeRating,
  clearUserUsernameInput,
  clearSearchUser,
  changeUserUsernameInput,
}) => {
  const [ hideWTRBox, setHideWTRBox ] = useState(false);

  // techs states
  const [ displayPostTechs, setDisplayPostTechs ] = useState([]);
  const [ displayPostTechsState, setDisplayPostTechsState ] = useState(false);

  return (
    <View style={styles.userSearchFormContainer}>
      <View style={styles.searchBarContainer}>
        { chosenUser
          ?
          <SearchBarChosenUser
            chosenUser={chosenUser}
            clearChosenUser={clearChosenUser} 
            clearRating={clearRating}
          /> 
          :
          <SearchBar
            usersFound={usersFound}
            clearUserUsernameInput={clearUserUsernameInput} 
            clearSearchUser={clearSearchUser}
            changeUserUsernameInput={changeUserUsernameInput}
            userUsernameInput={userUsernameInput}
          />
        }
      </View>
      {
        chosenUser && selectedDisplayPost && rateTech && rating 
        ?
        <TouchableOpacity 
          style={{ flexDirection: 'row', justifyContent: 'center' }}
          onPress={() => {
            clearDisplayPost();
            setRateTech(null);
            clearRating();
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
                selectedDisplayPost.data.files[0].type === 'video'
                ?
                <View style={styles.selectedPostImage}>
                  <Video
                    // ref={video}
                    style={styles.selectedPostImage}
                    source={{
                      uri: selectedDisplayPost.data.files[0].url,
                    }}
                    useNativeControls={false}
                    resizeMode="contain"
                    shouldPlay={false}
                  />
                </View>
                : selectedDisplayPost.data.files[0].type === 'image'
                ?
                <Image 
                  style={styles.selectedPostImage} 
                  source={{ uri: selectedDisplayPost.data.files[0].url }}
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
                  rateTech.techData.photoURL
                  ?
                  <Image style={styles.techImage} source={{ uri: rateTech.techData.photoURL }}/>
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
                changeRating={changeRating} 
              />
            </View>
          </View>
        </TouchableOpacity>
        :
        <View>
          { // tag display post 
            chosenUser 
            && chosenUser.type === "business" 
            && cpDisplayPosts.length > 0 
            && selectedDisplayPost === null
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
                    if (cpDisplayPostFetchSwitch && !cpDisplayPostState) {
                      getCpDisplayPosts(cpDisplayPostLast, chosenUser, userId);
                    } else {
                      null
                    }
                  }}
                  onEndReachedThreshold={0.01}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={cpDisplayPosts}
                  keyExtractor={(displayPost, index) => index.toString()}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity 
                        style={styles.postImageContainer}
                        onPress={() => {
                          selectDisplayPost(item);
                          if (!displayPostTechsState) {
                            const getDisplayPostTechs = businessGetFire.getTechniciansByIds(item.data.techs);
                            getDisplayPostTechs
                            .then((techs) => {
                              console.log(techs);
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
                  cpDisplayPostState
                  ?
                  <GetDisplayPostLoading />
                  : 
                  null
                }
              </View>
            </View>
            : selectedDisplayPost
            ? 
            <View style={styles.rateAndTagContainer}>
              <View style={styles.selectedDisplayPostContainer}>
                <TouchableOpacity 
                  style={styles.selectedPostImageContainer}
                  onPress={() => {
                    clearDisplayPost();
                    clearRating();
                    setRateTech(null);
                  }}
                >
                { 
                  selectedDisplayPost.data.files[0].type === 'video'
                  ?
                  <View style={styles.selectedPostImage}>
                    <Video
                      // ref={video}
                      style={styles.selectedPostImage}
                      source={{
                        uri: selectedDisplayPost.data.files[0].url,
                      }}
                      useNativeControls={false}
                      resizeMode="contain"
                      shouldPlay={false}
                    />
                  </View>
                  : selectedDisplayPost.data.files[0].type === 'image'
                  ?
                  <Image 
                    style={styles.selectedPostImage} 
                    source={{ uri: selectedDisplayPost.data.files[0].url }}
                  />
                  : null
                }
                  <View style={styles.chosenStatus}>
                    <View style={styles.chosenShadow}>
                    
                    </View>
                    <View style={styles.chosenCheck}>
                      <AntDesign name="checkcircle" size={RFValue(23)} color={color.blue1} />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.selectedDisplayPostCheckContainer}>
              </View>
            </View>
            :
            null
          }

          {
            selectedDisplayPost && 
            chosenUser && 
            chosenUser.type === "business" && 
            !displayPostTechsState && 
            !rateTech
            ?
            <View style={styles.labelContainer}>
              <View style={styles.guideTextContainer}>
                <Text style={styles.guideText}>Choose a technician</Text>
              </View>
            </View>
            : null
          }

          { // rate
            selectedDisplayPost && 
            chosenUser && 
            chosenUser.type === "business" && 
            !displayPostTechsState && 
            !rateTech
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
                      onPress={() => { setRateTech(item) }}
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
            : selectedDisplayPost && chosenUser && chosenUser.type === "business" && !displayPostTechsState && rateTech
            ? 
            <View style={styles.pickTechContainer}>
              <TouchableOpacity 
                onPress={() => { 
                  setRateTech(null) 
                }}
                style={styles.techContainer}
              >
                <View style={styles.techInnerContainer}>
                  { 
                    rateTech.techData.photoURL
                    ?
                    <Image style={styles.techImage} source={{ uri: rateTech.techData.photoURL }}/>
                    : 
                    <DefaultUserPhoto 
                      customSizeBorder={RFValue(57)}
                      cutomSizeUserIcon={RFValue(37)}
                    />
                  }
                  <View style={styles.techInfoContainer}>
                    <Text style={styles.techUsernameText}>
                      {rateTech.techData.username}
                    </Text>
                  </View>
                </View>
                <View style={styles.chosenStatus}>
                  <View style={styles.chosenShadow}>
                  
                  </View>
                  <View style={styles.chosenCheck}>
                    <AntDesign name="checkcircle" size={RFValue(23)} color={color.blue1} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            : selectedDisplayPost && chosenUser && chosenUser.type === "business" && displayPostTechsState
            ?
            <View style={styles.techsLoadingContainer}>
              <SpinnerFromActivityIndicator/>
            </View>
            : null
          }
          
          { // rate
            selectedDisplayPost && chosenUser && chosenUser.type === "business" && rateTech
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
                changeRating={changeRating} 
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
    elevation: 10,
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
  selectedDisplayPostContainer: {
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
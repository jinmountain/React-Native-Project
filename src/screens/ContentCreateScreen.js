import React, { useContext, useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  Button, 
  Image, 
  View, 
  Platform,
  TouchableOpacity,
  FlatList,
  Text,
  TouchableHighlight,
  Alert
} from 'react-native';
import { SafeAreaView, } from 'react-native-safe-area-context';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// Components
import CancelButton from '../components/CancelButton';
import TagInputForm from '../components/createPost/TagInputForm';
import { HeaderForm } from '../components/HeaderForm';
import { SearchUsersForm } from '../components/createPost/SearchUsersForm';
import CaptionInputForm from '../components/createPost/CaptionInputForm';
import { InputFormBottomLine } from '../components/InputFormBottomLine';
import LoadingAlert from '../components/LoadingAlert';
import { UsersFoundListForm } from '../components/createPost/UsersFoundListForm';
import ButtonA from '../components/ButtonA';
import THButtonWithBorder from '../components/buttons/THButtonWithBorder';
import THButtonWOBorder from '../components/buttons/THButtonWOBorder';
import AlertBoxTop from '../components/AlertBoxTop'; 
import TwoButtonAlert from '../components/TwoButtonAlert';
import MainTemplate from '../components/MainTemplate';
import DisplayPostInfoInputForm from '../components/createPost/DisplayPostInfoInputForm';

// Contexts
import { Context as LocationContext } from '../context/LocationContext';
import { Context as PostContext } from '../context/PostContext';
import { Context as AuthContext } from '../context/AuthContext';

// Hooks
import useLocation from '../hooks/useLocation';
import useImage from '../hooks/useImage';
import { navigate } from '../navigationRef';

// Designs
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';

// Firebase
import businessGetFire from '../firebase/businessGetFire';

// Color
import color from '../color';

const ratingCheck = (rating, chosenBusiness) => {
  if (chosenBusiness !== null) {
    if (rating === null) {
      return false;
    } else {
      return true;
    }
  }
};

const createTwoButtonAlert = (title, message, okAction, cancelAction, navigate) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      { text: "OK", onPress: () => { 
        okAction(); 
        if (navigate) {
          navigate();
        }
      }}
    ],
    { cancelable: false }
  );
};

const ContentCreateScreen = ({ route, navigation }) => {
  const [ pickImage ] = useImage();
  
  const [ alertBoxStatus, setAlertBoxStatus ] = useState(false);
  const [ alertBoxText, setAlertBoxText ] = useState(null);

  // TBA => TwoButtonAlert
  const [ tbaStatus, setTbaStatus ] = useState(false);
  // const [ tbaTitle, setTbaTitle ] = useState(null);
  // const [ tbaMessage, setTbaMessage ] = useState(null);

  // Display Post States
  const [ postService, setPostService ] = useState(null);
  const [ postTitle, setPostTitle ] = useState(null);
  const [ postPrice, setPostPrice ] = useState(null);
  const [ postETC, setPostETC ] = useState(null);
  // Technicians for the nail design of this post
  const [ selectedTechs, setSelectedTechs ] = useState([]);
  // 
  const [ rateTech, setRateTech ] = useState(null);

  const { 
    state: { 
      // post
      caption, 
      files, 
      tags, 
      // progress,
      display,
      // display posts
      cpDisplayPosts,
      cpDisplayPostLast,
      cpDisplayPostFetchSwitch,
      cpDisplayPostState,

      selectedDisplayPost,

      // user search
      usersFound,
      rating,
      chosenUser,
      userUsernameInput, 
    }, 
    // post
    changeCaption,
    addPost,
    addImage,
    cancelFile,
    setDisplay,
    // get display posts
    getCpDisplayPosts,
    clearFirstAndGetCpDisplayPosts,
    selectDisplayPost,
    clearDisplayPost,

    resetPost,

    // user search
    chooseUser,
    clearSearchUser,
    searchUsers,
    clearChosenUser,
    changeRating,
    clearRating,
    changeUserUsernameInput,
    clearUserUsernameInput,
    // changeProgress,

  } = useContext(PostContext);

  const {
    state: { user },
  } = useContext(AuthContext);

  useEffect(() => {
    if (files.length === 0) {
      pickImage('nav');
    }
    return () => {
      setPostTitle(null);
      setPostPrice(null);
      setPostETC(null);
      setSelectedTechs([]);
      setRateTech(null);
      resetPost();
    }
  }, [])

  useEffect(() => {
    if (userUsernameInput.length >= 1) {
      console.log("length: ", userUsernameInput.length, " input: ", userUsernameInput);
      searchUsers(userUsernameInput);
    } else {
      // Clear when the input length became 0 from 1
      clearUserUsernameInput();
      clearSearchUser();
    }
  }, [userUsernameInput])

  useEffect(() => {
    if (
      chosenUser && 
      chosenUser.type === "business" && 
      cpDisplayPostFetchSwitch && 
      !cpDisplayPostState
    ) {
      clearFirstAndGetCpDisplayPosts(chosenUser, user.id);
    } else {
      return;
    }
  }, [chosenUser]);

  // check price is number
  useEffect(() => {
    if (postPrice) {
      if (isNaN(Number(postPrice))) {
        setPostPrice('')
      } 
    }
  }, [postPrice]);
  // get the list of techs when display is true
  
  // get current techs
  const [ techFetchLast, setTechFetchLast ] = useState(null);
  const [ techFetchState, setTechFetchState ] = useState(false);
  const [ techFetchSwitch, setTechFetchSwitch ] = useState(true);
  const [ currentTechs, setCurrentTechs ] = useState([]);
  const appendTechs = useCallback((techs) => {
      setCurrentTechs([ ...currentTechs, ...techs ]);
    },
    []
  );
  useEffect(() => {
    if (display) {
      // get current technicians
    if (techFetchSwitch && !techFetchState) {
      setTechFetchState(true);
        const getTechnicians = businessGetFire.getTechnicians(
          user.id, 
          setTechFetchLast,
          setTechFetchSwitch,
          techFetchLast,
        );
        getTechnicians
        .then((techs) => {
          console.log(techs);
          appendTechs(techs);
          setTechFetchState(false);
        });
      } else {
        console.log(
          "techFetchSwitch: "
          + techFetchSwitch
          + "techFetchState: "
          + techFetchState
        );
      }
    }
  }, [display]);

  // Progress
  const [ progress, setProgress ] = useState(null);

  const changeProgress = useCallback((progress) => {
      setProgress(progress);
  },[]);

  return (
    <MainTemplate>
      <View style={styles.screenContainer}>
        { progress
          ? <LoadingAlert progress={progress}/>
          : null
        }
        <HeaderForm 
          leftButtonTitle={null}
          leftButtonIcon={<EvilIcons name="close" size={RFValue(27)} color={color.black1}/>}
          headerTitle='Create Post' 
          rightButtonTitle='Done' 
          leftButtonPress={() => {
            navigation.goBack();
          }}
          rightButtonPress={() => {
            {
              files.length < 1
              ? (setAlertBoxStatus(true), setAlertBoxText("There must be at least one file"))
              : chosenUser && !selectedDisplayPost 
              ? (setAlertBoxStatus(true), setAlertBoxText(`Select the nail design you got at ${chosenUser.username}`))
              : chosenUser && !rateTech
              ? (setAlertBoxStatus(true), setAlertBoxText(`Choose your technician at ${chosenUser.username}`))
              : chosenUser && !rating
              ? (setAlertBoxStatus(true), setAlertBoxText(`Rate your experience at ${chosenUser.username}`))

              : display && ! postService
              ? (setAlertBoxStatus(true), setAlertBoxText("Choose the service type of your post"))
              : display && !postTitle
              ? (setAlertBoxStatus(true), setAlertBoxText("Fill in the title of your post"))
              : display && !postPrice
              ? (setAlertBoxStatus(true), setAlertBoxText("Write the price of your post"))
              : display && !postETC
              ? (setAlertBoxStatus(true), setAlertBoxText("Choose the time of your post"))
              : display && !selectedTechs.length > 0
              ? (setAlertBoxStatus(true), setAlertBoxText("Choose a technician for this display post"))
              :
              addPost(
                navigation.goBack, 
                user.id,  
                files, 
                tags, 
                caption,

                chosenUser,
                selectedDisplayPost,
                rateTech,
                rating,
                
                display,
                postService,
                postTitle,
                postPrice,
                postETC,
                selectedTechs,

                changeProgress,
              )
            }
          }}
        />
        { 
          display === true
          ? null
          :
          <SearchUsersForm 
            userId={user.id}
            usersFound={usersFound ? true : false }
            rating={rating}
            chosenUser={chosenUser}
            userUsernameInput={userUsernameInput}

            getCpDisplayPosts={getCpDisplayPosts}
            cpDisplayPosts={cpDisplayPosts}
            selectDisplayPost={selectDisplayPost}
            selectedDisplayPost={selectedDisplayPost}
            clearDisplayPost={clearDisplayPost}
            cpDisplayPostState={cpDisplayPostState}
            cpDisplayPostFetchSwitch={cpDisplayPostFetchSwitch}
            cpDisplayPostLast={cpDisplayPostLast}

            clearChosenUser={clearChosenUser}
            rateTech={rateTech}
            setRateTech={setRateTech}
            clearRating={clearRating}
            changeRating={changeRating}
            clearUserUsernameInput={clearUserUsernameInput}
            clearSearchUser={clearSearchUser}
            changeUserUsernameInput={changeUserUsernameInput}
          />
        }
        { usersFound
          ? 
          <UsersFoundListForm
            usersFound={usersFound}
            clearSearchUser={clearSearchUser}
            clearUserUsernameInput={clearUserUsernameInput}
            chooseUser={chooseUser}
          />
          :
          <KeyboardAwareScrollView>
            {
              user.type === "business" && chosenUser === null
              ?
              <View style={styles.optionContainer}>
                {
                  postTitle && postPrice && postETC && selectedTechs.length > 0
                  ? <AntDesign name="checkcircleo" size={RFValue(23)} color={color.blue1} />
                  : <AntDesign name="checkcircleo" size={RFValue(23)} color={color.black1} />
                }
                <Text style={styles.optionText}>
                  Is this a display post?
                </Text>
                <THButtonWithBorder
                  onPress={() => {
                    setDisplay(true);
                  }}
                  text={"Yes"}
                  value={display === true}
                  valueEffect={{ borderWidth: RFValue(2), borderColor: color.blue1 }}
                />
                <THButtonWithBorder
                  onPress={() => {
                    setDisplay(false);
                  }}
                  text={"No"}
                  value={display === false}
                  valueEffect={{ borderWidth: RFValue(2), borderColor: color.blue1 }}
                />
              </View>
              :
              null
            }
            {
              display &&
              <DisplayPostInfoInputForm 
                postPrice={postPrice}
                setPostPrice={setPostPrice}
                postETC={postETC}
                setPostETC={setPostETC}
                currentTechs={currentTechs}
                selectedTechs={selectedTechs}
                setSelectedTechs={setSelectedTechs}
                postTitle={postTitle}
                setPostTitle={setPostTitle}
                postService={postService}
                setPostService={setPostService}
              />
            }
            <InputFormBottomLine customStyles={{borderColor: color.grey1, marginBottom: 15,}}/>
            
            {/*content upload box*/}
            <View style={styles.pickImageContainer}>
              {files && 
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={files}
                  keyExtractor={(image) => image.id}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity 
                        onPress={() => {
                          navigation.navigate('ImageZoomin', 
                            {
                              file: {
                                type: item.type,
                                url: item.uri
                              }
                            }
                          );
                          // setModalImage([{uri: item.uri, type: item.type}]);
                          // setImageZoomModalVisible(true);
                        }}
                        style={styles.imageContainer}
                      >
                        <CancelButton onPressFunction={() => cancelFile(item.id)}/>
                        <Image style={styles.chosenImage} source={{ uri: item.uri }}/>
                      </TouchableOpacity>
                    )
                  }}
                />
              }
              { files.length <= 4 && 
                <TouchableHighlight 
                  style={styles.pickImageButton} 
                  onPress={() => {pickImage('post');}}
                  underlayColor={color.grey1}
                >
                  <AntDesign name="plus" size={RFValue(38)} color={color.grey2} />
                </TouchableHighlight>
              }
            </View>
            { files.length >= 5 &&
              <View style={styles.limitWarningContainer}>
                <Text style={{fontSize: 15,}}>The limit is {files.length} of pictures or videos.</Text>
              </View>
            }
            <InputFormBottomLine customStyles={{marginTop: 15, borderColor: color.grey1}}/>
            <View style={styles.tagCaptionInputContainer}>
              <TagInputForm />
              <CaptionInputForm caption={caption} changeCaption={changeCaption} />
            </View>
            <View style={[ styles.buttonContainer, { paddingTop: RFValue(30) }]}>
              <TouchableOpacity
                onPress={() => {
                  files.length < 1
                  ? (setAlertBoxStatus(true), setAlertBoxText("There must be at least one file"))
                  : chosenUser && !selectedDisplayPost 
                  ? (setAlertBoxStatus(true), setAlertBoxText(`Choose a post of ${chosenUser.username}`))
                  : chosenUser && !rating
                  ? (setAlertBoxStatus(true), setAlertBoxText(`Rate the post of ${chosenUser.username}`))
                  : display && !postTitle
                  ? (setAlertBoxStatus(true), setAlertBoxText("Write the title of your post"))
                  : display && !postPrice
                  ? (setAlertBoxStatus(true), setAlertBoxText("Write the price of your post"))
                  : display && !postETC
                  ? (setAlertBoxStatus(true), setAlertBoxText("Choose the time of your post"))
                  : display && !selectedTechs.length > 0
                  ? (setAlertBoxStatus(true), setAlertBoxText("Choose a technician for this display post"))
                  :
                  addPost(
                    navigation.goBack, 
                    user.id,  
                    files, 
                    tags, 
                    caption,

                    chosenUser,
                    selectedDisplayPost,
                    rateTech,
                    rating,
                    
                    display,
                    postService,
                    postTitle,
                    postPrice,
                    postETC,
                    selectedTechs,
                    
                    changeProgress,
                  )
                }}
              >
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Submit</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  setTbaStatus(true);
                }}
              >
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Reset</Text>
                </View>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        }
        { 
          // put this at the last so it can be on the top of others
          alertBoxStatus
          ?
          <AlertBoxTop 
            setAlert={setAlertBoxStatus}
            alertText={alertBoxText}
          />
          : null
        }
        { 
          tbaStatus
          && 
          <TwoButtonAlert 
            title={<Ionicons name="alert-circle-outline" size={RFValue(27)} color={color.black1} />}
            message={"Reset the posting process?"}
            buttonOneText={"Yes"}
            buttonTwoText={"No"}
            buttonOneAction={() => { 
              setPostTitle(null);
              setPostPrice(null);
              setPostETC(null);
              setSelectedTechs([]);
              setRateTech(null);
              resetPost();
              setTbaStatus(false); 
            }}
            buttonTwoAction={() => { setTbaStatus(false)}}
          />
        }
      </View>
    </MainTemplate>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: color.white2,
  },
  contentCreateScreenHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: "8%",
    marginTop: '7%',
    borderWidth: 1,
  },
  pickImageContainer: {
    zIndex: 0,
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: RFValue(3),
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: RFValue(5),
  },
  chosenImage: {
    width: RFValue(100),
    height: RFValue(100)
  },
  pickImageButton: {
    width: RFValue(100),
    height: RFValue(100),
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.4,
    margin: 5,
    borderRadius: 15
  },
  limitWarningContainer: {
    margin: 5,
    justifyContent: "center",
  },
  createDetailInputSection: {
    flex: 2
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 5
  },
  tagCaptionInputContainer: {
    marginLeft: RFValue(28),
    marginRight: RFValue(28),
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: RFValue(7),
    marginBottom: RFValue(7),
  },
  button: {
    borderColor: color.grey1,
    borderWidth: 0.5,
    borderRadius: 5,
    backgroundColor: '#fff',
    width: RFValue(200),
    height: RFValue(38),
    justifyContent: 'center',
    alignItems: 'center',
    padding: RFValue(10),
  },
  buttonText: {
    backgroundColor: '#fff',
    color: color.black1,
    fontSize: RFValue(17),
  },
  optionContainer: {
    flexDirection: 'row',
    marginLeft: RFValue(23),
    marginRight: RFValue(23),
    justifyContent: 'center',
    alignItems: 'center',
    padding: RFValue(3),
    marginVertical: RFValue(7),
  },
  displayResultContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(5),
    paddingVertical: RFValue(11),
  },
  displayResult: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: RFValue(17),
    paddingHorizontal: RFValue(1),
    marginHorizontal: RFValue(7),
  },
});

export default ContentCreateScreen;
import React, { useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
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

// npms
import { SafeAreaView, } from 'react-native-safe-area-context';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';

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
import HeaderBottomLine from '../components/HeaderBottomLine';
import Picker from '../components/Picker';

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
import usersGetFire from '../firebase/usersGetFire';
import contentPostFire from '../firebase/contentPostFire';
import authFire from '../firebase/authFire';

// Color
import color from '../color';

// business' services
const services = [
  {
    label: "Nail",
    value: "nail"
  },
  {
    label: "Hair",
    value: "hair",
  },
  {
    label: "Eyelash",
    value: "eyelash",
  }
];

// display posts' etc
const times = [
  {
    label: "10 minutes",
    value: 10
  },
  {
    label: "15 minutes",
    value: 15
  },
  {
    label: "20 minutes",
    value: 20
  },
  {
    label: "25 minutes",
    value: 25
  },
  {
    label: "30 minutes",
    value: 30
  },
  {
    label: "35 minutes",
    value: 35
  },
  {
    label: "40 minutes",
    value: 40
  },
  {
    label: "45 minutes",
    value: 45
  },
  {
    label: "50 minutes",
    value: 50
  },
  {
    label: "55 minutes",
    value: 55
  },
  {
    label: "1 hour",
    value: 60
  },
  {
    label: "1 hour 5 minutes",
    value: 65
  },
  {
    label: "1 hour 10 minutes",
    value: 70
  },
  {
    label: "1 hour 15 minutes",
    value: 75
  },
  {
    label: "1 hour 20 minutes",
    value: 80
  },
  {
    label: "1 hour 25 minutes",
    value: 85
  },
  {
    label: "1 hour 30 minutes",
    value: 90
  },
  {
    label: "1 hour 35 minutes",
    value: 95
  },
  {
    label: "1 hour 40 minutes",
    value: 100
  },
  {
    label: "1 hour 45 minutes",
    value: 105
  },
  {
    label: "1 hour 50 minutes",
    value: 110
  },
  {
    label: "1 hour 55 minutes",
    value: 115
  },
  {
    label: "2 hours",
    value: 120
  },
];

const AddPost = (  
  files, 
  tags, 
  caption,
  chosenUser,
  chosenDisplayPost,
  chosenTech,
  rating,
  display,
  postService,
  postTitle,
  postPrice,
  postETC,
  selectedTechs,
  changeProgress,
  setPostState
) => {
  return new Promise((res, rej) => {
    setPostState(true);
    const authCheck = authFire.authCheck();
    authCheck
    .then((currentUser) => {
      const userId = currentUser.uid;
      const getFileURL = new Promise (async (res, rej) => {
        const fileURLs = []
        let fileIndex = 0;
        for (fileIndex; fileIndex < files.length; fileIndex++) {
          const URL = await contentPostFire.uploadFileAsyncFire(
            userId, 
            files[fileIndex].id,
            files[fileIndex].type,
            files[fileIndex].uri, 
            changeProgress
          );
          if (files[fileIndex].type === 'video') {
            fileURLs.push({ type: 'video', url: URL });
          }
          else if (files[fileIndex].type === 'image') {
            fileURLs.push({ type: 'image', url: URL });
          } else {
            return
          }
        };
        res(fileURLs);
      });

      // After we get the photo URLs...
      getFileURL
      .then((fileURLs) => {
        console.log("File URLs: ", fileURLs);
        let newPost;

        newPost = {
          uid: userId,
          createdAt: Date.now(),
          files: fileURLs,
          tags: tags,
          caption: caption,
          likeCount: 0,
          heat: 0,
        }

        // if the post is a dipslay post
        if (display) {
          newPost = { 
            ...newPost, 
            ...{ 
              display: true, 
              service: postService, 
              title: postTitle, 
              price: Number(postPrice), 
              etc: Number(postETC), 
              techs: selectedTechs 
            }
          }
        } else {
          newPost = { ...newPost, ...{ display: false }}
        }

        // if the post is to rate another post
        if (chosenUser) {
          newPost = { 
            ...newPost, 
            ...{ 
              tid: chosenUser.id,
              ratedPostId: chosenDisplayPost.id,
              ratedTechId: chosenTech.techData.id,
              rating: rating
            }
          }
        }
        
        // Firestore | posts | post.id | newPost
        // await until the post is made.
        const addPost = contentPostFire.addPostFire(newPost);
        addPost
        .then((post) => {
          if (post) {
            res(post);
            console.log("added new post: ", post.id);
          }
          //setPostState(false);
        })
        .catch((error) => {
          rej(error);
        });
      })
      .catch((error) => {
        rej(error);
      });
    })
    .catch((error) => {
      console.log(error);
    });
  });
};

const ContentCreateScreen = ({ route, navigation }) => {
  const [ pickImage ] = useImage();
  
  const [ alertBoxStatus, setAlertBoxStatus ] = useState(false);
  const [ alertBoxText, setAlertBoxText ] = useState(null);
  // Bottom Sheet  and Picker
  const [ isModalVisible, setIsModalVisible ] = useState(false);
  const [ pickerType, setPickerType ] = useState(null);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => 
    // [height-RFValue(95)-width-RFValue(55), height-RFValue(95)-RFValue(55)],
    ['50%'],
    []
  );
  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      setIsModalVisible(false);
    } 
    // console.log('handleSheetChanges', index);
  }, []);

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
  const resetDisplayPostInfo = () => {
    setPostService(null);
    setPostTitle(null);
    setPostPrice(null);
    setPostETC(null);
    setSelectedTechs([]);
    setIsModalVisible(false);
  }
  const [ chosenTech, setChosenTech ] = useState(null);
  const [ rating, setRating ] = useState(null);
  const [ chosenUser, setChosenUser ] = useState(null);
  const [ chosenDisplayPost, setChosenDisplayPost ] = useState(null);
  const [ searchUserUsername, setSearchUserUsername ] = useState(null);
  const [ usersFound, setUsersFound ] = useState(null);
  const [ tags, setTags ] = useState([]);
  const [ caption, setCaption ] = useState('');
  const [ files, setFiles ] = useState([]);
  const [ display, setDisplay ] = useState(false);
  // Progress
  const [ progress, setProgress ] = useState(null);
  const [ postState, setPostState ] = useState(false);
  const changeProgress = useCallback((progress) => {
      setProgress(progress);
  },[]);

  // display post techs states
  const [ displayPostTechs, setDisplayPostTechs ] = useState([]);
  const [ displayPostTechsState, setDisplayPostTechsState ] = useState(false);
  // chosen user display posts
  const [ chosenUserDisplayPosts, setChosenUserDisplayPosts ] = useState([]);
  const [ chosenUserDisplayPostLast, setChosenUserDisplayPostLast ] = useState(null);
  const [ chosenUserDisplayPostFetchSwitch, setChosenUserDisplayPostFetchSwtich ] = useState(true);
  const [ chosenUserDisplayPostState, setChosenUserDisplayPostState ] = useState(false);


  const Reset = () => {
    setAlertBoxStatus(false);
    setAlertBoxText(null);
    setTbaStatus(false);

    resetDisplayPostInfo();

    setChosenTech(null);
    setRating(null);
    setChosenUser(null);
    setChosenDisplayPost(null);
    setSearchUserUsername(null);
    setUsersFound(null);
    setTags([]);
    setCaption('');
    setFiles([]);
    setDisplay(false);
    setProgress(null);
    setPostState(false);

    setDisplayPostTechs([]);
    setDisplayPostTechsState(false);
    setChosenUserDisplayPosts([]);
    setChosenUserDisplayPostLast(null);
    setChosenUserDisplayPostFetchSwtich(true);
    setChosenUserDisplayPostState(false);
  };

  const {
    state: { user },
  } = useContext(AuthContext);

  useEffect(() => {
    return () => {
      Reset();
    }
  }, [])

  // user search
  useEffect(() => {
    if (searchUserUsername && searchUserUsername.length >= 1) {
      setUsersFound(null);
      console.log("length: ", searchUserUsername.length, " input: ", searchUserUsername);
      const searchUsers = usersGetFire.getSearchUsersFire(searchUserUsername, "bus");
      searchUsers
      .then((users) => {
        console.log('Search users: ', users.length);
        if (users.length < 1) {
          setUsersFound(null);
          console.log('An user not found.');
          // when there isn't a user clear the previous list for an update
          // dispatch({ type: 'clear_search'});
        } else {
          setUsersFound(users);
          // dispatch({ type: 'search_users', payload: users});
        };
      });

    } else {
      setSearchUserUsername(null);
      setUsersFound(null);
      // Clear when the input length became 0 from 1
      // clearUserUsernameInput();
      // clearSearchUser();
    }
  }, [searchUserUsername])

  // check price is number
  useEffect(() => {
    if (postPrice) {
      if (isNaN(Number(postPrice))) {
        setPostPrice('')
      } 
    }
  }, [postPrice]);
  // get the list of techs when display is true

  return (
    <View style={styles.screenContainer}>
      { progress
        ? <LoadingAlert progress={progress}/>
        : null
      }
      
      <HeaderForm 
        leftButtonTitle={null}
        // leftButtonIcon={null}
        leftButtonIcon={<EvilIcons name="close" size={RFValue(27)} color={color.black1}/>}
        headerTitle={"Create Post"}
        rightButtonTitle={null}
        rightButtonIcon={"Done"}
        leftButtonPress={() => {
          navigation.goBack();
        }}
        rightButtonPress={() => {
          {
            files.length < 1
            ? (setAlertBoxStatus(true), setAlertBoxText("There must be at least one file"))
            : chosenUser && !chosenDisplayPost 
            ? (setAlertBoxStatus(true), setAlertBoxText(`Select the nail design you got at ${chosenUser.username}`))
            : chosenUser && !chosenTech
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
            AddPost(
              files, 
              tags, 
              caption,

              chosenUser,
              chosenDisplayPost,
              chosenTech,
              rating,
              
              display,
              postService,
              postTitle,
              postPrice,
              postETC,
              selectedTechs,

              changeProgress,
              setPostState
            )
          }
        }}
        addPaddingTop={true}
        // paddingTopCustomStyle={{backgroundColor: color.red2}}
      />
      { usersFound
        ? 
        <UsersFoundListForm
          usersFound={usersFound}
          setUsersFound={setUsersFound}
          setSearchUserUsername={setSearchUserUsername}
          setChosenUser={setChosenUser}
        />
        :
        <KeyboardAwareScrollView>
          { 
            display === true
            ? null
            :
            <SearchUsersForm 
              userId={user.id}
              usersFound={usersFound ? true : false }
              setUsersFound={setUsersFound}
              rating={rating}
              setRating={setRating}
              chosenUser={chosenUser}
              setChosenUser={setChosenUser}
              searchUserUsername={searchUserUsername}
              setSearchUserUsername={setSearchUserUsername}
              chosenDisplayPost={chosenDisplayPost}
              setChosenDisplayPost={setChosenDisplayPost}
              chosenTech={chosenTech}
              setChosenTech={setChosenTech}

              displayPostTechs={displayPostTechs}
              setDisplayPostTechs={setDisplayPostTechs}
              displayPostTechsState={displayPostTechsState}
              setDisplayPostTechsState={setDisplayPostTechsState}

              chosenUserDisplayPosts={chosenUserDisplayPosts}
              setChosenUserDisplayPosts={setChosenUserDisplayPosts}
              chosenUserDisplayPostLast={chosenUserDisplayPostLast}
              setChosenUserDisplayPostLast={setChosenUserDisplayPostLast}
              chosenUserDisplayPostFetchSwitch={chosenUserDisplayPostFetchSwitch}
              setChosenUserDisplayPostFetchSwtich={setChosenUserDisplayPostFetchSwtich}
              chosenUserDisplayPostState={chosenUserDisplayPostState}
              setChosenUserDisplayPostState={setChosenUserDisplayPostState}
            />
          }
          {
            user.type === "business" && chosenUser === null
            ?
            <View style={styles.optionContainer}>
              {
                postTitle && postPrice && postETC && selectedTechs.length > 0
                ? <AntDesign name="checkcircleo" size={RFValue(19)} color={color.blue1} />
                : <AntDesign name="checkcircleo" size={RFValue(19)} color={color.black1} />
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
                valueEffectText={{ color: color.blue1 }}
              />
              <THButtonWithBorder
                onPress={() => {
                  setDisplay(false);
                  resetDisplayPostInfo();
                }}
                text={"No"}
                value={display === false}
                valueEffect={{ borderWidth: RFValue(2), borderColor: color.blue1 }}
                valueEffectText={{ color: color.blue1 }}
              />
            </View>
            :
            null
          }
          {
            display &&
            <DisplayPostInfoInputForm
              currentUserId={user.id}
              postPrice={postPrice}
              setPostPrice={setPostPrice}
              postETC={postETC}
              setPostETC={setPostETC}
              selectedTechs={selectedTechs}
              setSelectedTechs={setSelectedTechs}
              postTitle={postTitle}
              setPostTitle={setPostTitle}
              postService={postService}
              setPostService={setPostService}
              setIsModalVisible={setIsModalVisible}
              setPickerType={setPickerType}
            />
          }
          <InputFormBottomLine customStyles={{backgroundColor: color.black1, marginBottom: RFValue(15),}}/>
          
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
                      <CancelButton 
                        onPressFunction={() => 
                          setFiles([ ...files.filter((file) => file.id !== item.id) ])
                        }
                      />
                      <Image style={styles.chosenImage} source={{ uri: item.uri }}/>
                    </TouchableOpacity>
                  )
                }}
              />
            }
            { files.length <= 4 && 
              <TouchableHighlight 
                style={styles.pickImageButton} 
                onPress={() => {
                  const getFile = pickImage();
                  getFile
                  .then((file) => {
                    setFiles([ ...files, {id: file.id, type: file.type, uri: file.uri}])
                  })
                  .catch((error) => {
                    console.log(error);
                  });
                }}
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
          <InputFormBottomLine customStyles={{marginTop: RFValue(15), backgroundColor: color.black1}}/>
          <View style={styles.tagCaptionInputContainer}>
            <TagInputForm 
              tags={tags}
              setTags={setTags}
            />
            <CaptionInputForm caption={caption} changeCaption={setCaption} />
          </View>
          <View style={[ styles.buttonContainer, { paddingTop: RFValue(30) }]}>
            <TouchableOpacity
              onPress={() => {
                files.length < 1
                ? (setAlertBoxStatus(true), setAlertBoxText("There must be at least one file"))
                : chosenUser && !chosenDisplayPost 
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
                AddPost(
                  files, 
                  tags, 
                  caption,

                  chosenUser,
                  chosenDisplayPost,
                  chosenTech,
                  rating,
                  
                  display,
                  postService,
                  postTitle,
                  postPrice,
                  postETC,
                  selectedTechs,
                  
                  changeProgress,
                  setPostState
                )
              }}
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}>Send</Text>
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
          <View style={{ height: RFValue(50) }}/>
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
            Reset();
            setTbaStatus(false); 
          }}
          buttonTwoAction={() => { setTbaStatus(false)}}
        />
      }
      {
        isModalVisible &&
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enablePanDownToClose={true}
          handleComponent={() => {
            return (
              <View 
                style={styles.bottomSheetHeaderContainer}
              > 
                <View style={styles.sliderIndicatorContainer}>
                  <View style={styles.sliderIndicator}/>
                </View>
              </View>
            )
          }}
        >
          {
            pickerType === 'time'
            ?
            <Picker 
              content={times}
              setValue={setPostETC}
              setIsModalVisible={setIsModalVisible}
              defaultLabel={"Choose Estimated Time to Complete"}
              defaultValue={null}
            />
            : pickerType === 'service'
            ?
            <Picker 
              content={services}
              setValue={setPostService}
              setIsModalVisible={setIsModalVisible}
              defaultLabel={"Choose Service Type"}
              defaultValue={null}
            />
            : null
          }
        </BottomSheet>
      }
    </View>
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
    borderColor: color.black1,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    width: RFValue(250),
    height: RFValue(50),
    justifyContent: 'center',
    alignItems: 'center',
    padding: RFValue(10),
  },
  buttonText: {
    backgroundColor: '#fff',
    color: color.black1,
    fontSize: RFValue(23),
  },
  optionContainer: {
    flexDirection: 'row',
    marginLeft: RFValue(23),
    marginRight: RFValue(23),
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: RFValue(7)
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
    paddingHorizontal: RFValue(5),
  },

  bottomSheetHeaderContainer: {
    paddingLeft: RFValue(15),
    height: RFValue(55),
    width: "100%", 
    justifyContent: 'center',
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9
  },
  bottomSheetHeaderTitleText: {
    fontSize: RFValue(19),
    color: color.black1,
    fontWeight: 'bold'
  },
  sliderIndicatorContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  sliderIndicator: {
    width: 35,
    height: 7,
    backgroundColor: color.black1,
    borderRadius: 100
  },
});

export default ContentCreateScreen;
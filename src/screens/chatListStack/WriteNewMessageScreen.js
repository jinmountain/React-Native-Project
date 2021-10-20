import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  Dimensions,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import MainTemplate from '../../components/MainTemplate';
import HeaderBottomLine from '../../components/HeaderBottomLine';
import { HeaderForm } from '../../components/HeaderForm';
import DefaultUserPhoto from '../../components/defaults/DefaultUserPhoto';

// firebase
import usersGetFire from '../../firebase/usersGetFire';

// Design
import { AntDesign } from '@expo/vector-icons';

// Hooks

// color
import color from '../../color';

// icon
import expoIcons from '../../expoIcons';

const WriteNewMessageScreen = ({ navigation }) => {

  // screen control
  const [ screenReady, setScreenReady ] = useState(false);

  // states
  const [ usersFound, setUsersFound ] = useState([]);
  const [ usernameTextInput, setUsernameTextInput ] = useState('');

  useEffect(() => {
    let mounted = true;
    // username must be longer than 4 characters
    if (usernameTextInput.length > 4) {
      const trimmedInput = usernameTextInput.trim();
    }

    return () => {
      mounted = false;
    }
  }, [usernameTextInput]);

  return (
    <MainTemplate>
      <HeaderForm 
        leftButtonIcon={expoIcons.ioniconsMdArrowBack(RFValue(27), color.black1)}
        headerTitle={"New message"}
        leftButtonPress={() => { navigation.goBack() }}
      />
      <View style={styles.mainContainer}>
        <View style={styles.searchBarTextInputContainer}>
          <TextInput 
            style={[styles.searchBarTextInput, 
              usernameTextInput
              ? {width: '80%'}
              : {width: '94%'}
            ]}
            placeholder="Search a user"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setUsernameTextInput(text.trim())}
            value={usernameTextInput}
            maxLength={30}
            multiline={false}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          { usernameTextInput 
            ? 
            <TouchableHighlight
              style={styles.closeButtonContainer}
              onPress={() => {
                setUsernameTextInput('');
                setUsersFound([]);
                // clearUserUsernameInput();
                // clearSearchUser();
              }}
              underlayColor={color.grey4}
            >
              <AntDesign name="closecircleo" size={RFValue(27)} color={color.black1} />
            </TouchableHighlight>
            : null
          }
        </View>
        <View style={styles.usersFoundContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={usersFound}
            keyExtractor={( user, index ) => index.toString()}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={styles.usersList}
                  onPress={() => {
                    setUsersFound([]);
                    setUsernameTextInput('');
                    console.log("chose user: ", item.id);
                    navigation.navigate("ChatScreen", {
                      theOtherUser: item
                    });
                  }} 
                >
                  <View style={styles.userPhotoContainer}>
                    { 
                      item.photoURL
                      ?
                      <Image style={styles.userPhoto} source={{ uri: item.photoURL }}/>
                      : <DefaultUserPhoto customSizeBorder={RFValue(68)}/>
                    }
                  </View>
                  <View style={styles.userInfoContainer}>
                    <Text style={styles.usernameText}>{item.username}</Text>
                  </View>
                </TouchableOpacity>
              )
            }}
          />
        </View>
      </View>
    </MainTemplate>
  )
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: color.white2,
  },
  searchBarTextInputContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: RFValue(5),
    marginRight: RFValue(3),
    borderRadius: 100,
  },
  searchBarTextInput: {
    fontSize: RFValue(15),
    height: RFValue(45),
    overflow: 'hidden',
    paddingLeft: RFValue(15),
    backgroundColor: "#F1F1F1",
    borderRadius: RFValue(15),
    justifyContent: 'center',
    marginHorizontal: "3%",
  },

  usersFoundContainer: {
    backgroundColor: color.white2,
    flex: 1,
    opacity: 1,
    paddingHorizontal: "3%",
    paddingVertical: 10,
  },

  usersList:{
    flexDirection: 'row',
    height: RFValue(80),
  },

  usernameText: {
    color: color.black1,
    fontSize: RFValue(18),
  },
  userPhotoContainer:{
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    paddingHorizontal: 5,
  },
  userPhoto: {
    width: RFValue(68),
    height: RFValue(68),
    borderRadius: RFValue(100),
  },
  userInfoContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});

export default WriteNewMessageScreen;
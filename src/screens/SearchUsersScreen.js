import React, { useState, useEffect, useContext, } from 'react';
import {
  FlatList,
  Image,
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  StatusBar,
  // TouchableOpacity,
} from "react-native";
// TouchableOpacity from rngh works on both ios and android
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Context as PostContext } from '../context/PostContext';
import { SafeAreaView, } from 'react-native-safe-area-context';

// Components
import { HeaderForm } from '../components/HeaderForm';

const SearchUsersScreen = ({ navigation }) => {
  const {
    state: { 
      userUsernameInput, 
      usersFound, 
      chosenUser,
    },
    changeUserUsernameInput,
    searchUsers,
    chooseUser,
    clearSearchUser,
    clearUserUsernameInput,
  } = useContext(PostContext);

  useEffect(() => {
    if (userUsernameInput.length >= 1) {
      console.log("length: ", userUsernameInput.length, " input: ", userUsernameInput);
      searchUsers(userUsernameInput);
      console.log("users found: ", searchUsers);
    } else {
      // Clear when the input length became 0 from 1
      clearUserUsernameInput();
      clearSearchUser();
    }
  }, [userUsernameInput])

  return (
    <SafeAreaView style={styles.searchUsersScreenContainer}>
      <HeaderForm 
        leftButtonTitle='Back'
        headerTitle='Create Post' 
        rightButtonTitle={null} 
        leftButtonPress={() => {
          navigation.goBack();
        }}
        rightButtonPress={null}
      />
      <View style={styles.businessUserSearchFormContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput 
            style={styles.searchBarEmpty}
            placeholder="Search a shop using the username."
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => changeUserUsernameInput(text)}
            value={userUsernameInput}
            maxLength={30}
            multiline={false}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
        </View>
        { usersFound 
          ? <View style={styles.usersFoundContainer}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={usersFound}
                keyExtractor={(user) => user.id}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      style={styles.businessUsersInDropdown}
                      onPress={() => {
                        clearSearchUser();
                        clearUserUsernameInput();
                        console.log("chose the user: ", item.id);
                        chooseUser(item);
                        navigation.navigate("ContentCreate");
                      }} 
                    >
                      <View style={styles.userPhotoContainer}>
                        <Image 
                          style={styles.userPhoto}
                          source={{ uri: item.photoURL }}
                        />
                      </View>
                      <View style={styles.userInfoContainer}>
                        <Text style={styles.usernameText}>{item.username}</Text>
                      </View>
                    </TouchableOpacity>
                  )
                }}
              />
            </View>
          : null
        }
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchUsersScreenContainer: {
    flex: 1,
    backgroundColor: "#fff"
  },
  businessUserSearchFormContainer: {
    zIndex: 1,
  },
  searchInputContainer: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  searchBarEmpty: {
    fontSize: RFValue(15),
    height: RFValue(45),
    overflow: 'hidden',
    paddingLeft: RFValue(15),
    backgroundColor: "#F1F1F1",
    borderRadius: 15,
  },
  usersFoundContainer: {
    backgroundColor: "#FFF",
    width: '100%',
    opacity: 1,
    paddingLeft: 5,
    paddingVertical: 10,
  },
  businessUsersInDropdown:{
    flexDirection: 'row',
    width: '100%',
    height: RFValue(80),
  },
  usernameText: {
    fontSize: RFValue(18),
  },
  userPhotoContainer:{
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    paddingHorizontal: 5,
  },
  userPhoto: {
    width: RFValue(80),
    height: RFValue(80),
    borderRadius: RFValue(100),
  },
  userInfoContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  chosenBusinessContainer: {
    flexDirection: 'row',
  },
  chosenBusinessPhoto: {
    width: RFValue(30),
    height: RFValue(30),
    borderRadius: RFValue(18),
  }
});

export default SearchUsersScreen;
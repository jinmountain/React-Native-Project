import React, { useState, useEffect, useContext, } from 'react';
import {
  FlatList,
  Image,
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  StatusBar,
  TouchableHighlight,
  // TouchableOpacity,
} from "react-native";
// TouchableOpacity from rngh works on both ios and android
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Context as PostContext } from '../../context/PostContext';

// Components
import { StarRating } from '../StarRating';
import { SearchBarChosenUser } from './SearchBarChosenUser';

// Hooks
import { navigate } from '../../navigationRef';

// Designs
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

// Color
import color from '../../color';

const SearchBar = ({ 
  usersFound, 
  clearUserUsernameInput, 
  clearSearchUser, 
  changeUserUsernameInput,
  userUsernameInput
}) => {
  return (
    <View style={styles.searchBarTextInputContainer}>
      <TextInput 
        style={[styles.searchBarTextInput, 
          userUsernameInput
          ? {width: '80%'}
          : {width: '94%'}
        ]}
        placeholder="Search a shop"
        placeholderTextColor="#aaaaaa"
        onChangeText={(text) => changeUserUsernameInput(text.trim())}
        value={userUsernameInput}
        maxLength={30}
        multiline={false}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
      />
      { userUsernameInput 
        ? 
        <TouchableHighlight
          style={styles.closeButtonContainer}
          onPress={() => {
            clearUserUsernameInput();
            clearSearchUser();
          }}
          underlayColor={color.gray4}
        >
          <AntDesign name="closecircleo" size={RFValue(27)} color={color.black1} />
        </TouchableHighlight>
        : null
      }
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export { SearchBar };


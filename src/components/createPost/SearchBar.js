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
  searchUserUsername,
  setSearchUserUsername,
  setUsersFound,
  customPlaceholderText
}) => {
  return (
    <View style={styles.searchBarTextInputContainer}>
      <TextInput 
        style={[styles.searchBarTextInput, 
          searchUserUsername
          ? {width: '80%'}
          : {width: '94%'}
        ]}
        placeholder={
          customPlaceholderText
          ? customPlaceholderText
          : "Search a shop"
        }
        placeholderTextColor={color.grey2}
        onChangeText={(text) => setSearchUserUsername(text.trim())}
        value={searchUserUsername}
        maxLength={30}
        multiline={false}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
      />
      { 
        searchUserUsername 
        ? 
        <TouchableHighlight
          style={styles.closeButtonContainer}
          onPress={() => {
            setSearchUserUsername('');
            setUsersFound([]);
          }}
          underlayColor={color.grey4}
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
    fontSize: RFValue(19),
    height: RFValue(55),
    overflow: 'hidden',
    paddingLeft: RFValue(15),
    backgroundColor: "#F1F1F1",
    borderRadius: RFValue(15),
    justifyContent: 'center',
    marginHorizontal: "3%",
  },
});

export { SearchBar };


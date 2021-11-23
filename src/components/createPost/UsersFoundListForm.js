import React from 'react';
import {
  FlatList,
  Image,
  View, 
  Text, 
  StyleSheet, 
  // TouchableOpacity,
} from "react-native";
// TouchableOpacity from rngh works on both ios and android
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import DefaultUserPhoto from '../../components/defaults/DefaultUserPhoto';

// Hooks
// import { navigate } from '../../navigationRef';
// Designs

// Color
import color from '../../color';

const UsersFoundListForm = ({ 
  usersFound,
  setUsersFound,
  setSearchUserUsername,
  setChosenUser,
}) => {
  return (
    <View style={styles.usersFoundContainer}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={usersFound}
        keyExtractor={(user) => user.id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={
                item.displayPostCount > 0
                ?
                styles.usersList
                : { ...styles.usersList, ...{ opacity: 0.3 } }
              }
              onPress={() => {
                if (item.displayPostCount > 0) {
                  setUsersFound([]);
                  setSearchUserUsername(null);
                  setChosenUser(item);
                } else {
                  null
                }
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
                <Text style={styles.usernameText}>@{item.username}</Text>
              </View>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  usersFoundContainer: {
    backgroundColor: color.white1,
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

export { UsersFoundListForm };

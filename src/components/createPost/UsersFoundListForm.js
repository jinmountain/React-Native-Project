import React, { useContext } from 'react';
import {
  FlatList,
  Image,
  View, 
  Text, 
  StyleSheet, 
  // TouchableOpacity,
} from "react-native";

import { useNavigation } from '@react-navigation/native';

// TouchableOpacity from rngh works on both ios and android
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import DefaultUserPhoto from '../../components/defaults/DefaultUserPhoto';

// Hooks
// import { navigate } from '../../navigationRef';
// Designs

// firebase
import { postUserSearchHistoryFire } from '../../firebase/user/usersPostFire';

// Contexts
import { Context as AuthContext } from '../../context/AuthContext';

// Color
import color from '../../color';

const UserBox = ({
  item,
  enablePress,
  setUsersFound,
  setSearchUserUsername,
  setChosenUser,
  navigateToAccount,
  enableSearchHistory,
  pressEnabled,
  pressUnabled,
  currentUserId
}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={
        enablePress
        ?
        styles.usersList
        : { ...styles.usersList, ...{ opacity: 0.3 } }
      }
      onPress={() => {
        if (enablePress) {
          setUsersFound([]);
          setSearchUserUsername('');
          setChosenUser && setChosenUser(item);
          navigateToAccount && navigation.navigate('UserAccountStack', {
            screen: 'UserAccount',
            params: {
              accountUserId: item.id
            }
          });
          // enableSearchHistory && save the account user id to search history
          if (enableSearchHistory) {
            // save the account user id to to the user's user search history
            const postUserSearchHistory = postUserSearchHistoryFire(currentUserId, item.id);
            postUserSearchHistory
            .then(() => {
              console.log("good")
            })
            .catch((error) => {

            });
          }
        } else {
          pressUnabled && pressUnabled()
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
}

const UsersFoundListForm = ({ 
  usersFound,
  setUsersFound,
  setSearchUserUsername,
  setChosenUser,
  enablePressCondition,
  enableSearchHistory,
  navigateToAccount,
  pressEnabled,
  pressUnabled,
}) => {
  const { state: { user }} = useContext(AuthContext);

  return (
    <View style={styles.usersFoundContainer}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={usersFound}
        keyExtractor={(user) => user.id}
        renderItem={({ item }) => {
          return (
            <UserBox
              item={item}
              enablePress={
                enablePressCondition === "displayPostCount"
                ? item.displayPostCount > 0
                : true
              }
              enableSearchHistory={enableSearchHistory}
              setUsersFound={setUsersFound}
              setSearchUserUsername={setSearchUserUsername}
              setChosenUser={setChosenUser}
              navigateToAccount={navigateToAccount}
              pressEnabled={pressEnabled}
              pressUnabled={pressUnabled}
              currentUserId={user.id}
            />
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
    paddingVertical: RFValue(10),
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
    marginRight: RFValue(10),
    paddingHorizontal: RFValue(5),
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

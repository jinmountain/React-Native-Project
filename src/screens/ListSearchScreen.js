import React, { useState, useEffect } from 'react';
import { 
	Text, 
	StyleSheet, 
	View,
	SafeAreaView 
} from 'react-native';
import { NavigationBar, currentUser } from '../components/NavigationBar';

import {
  getSearchUsersFire
} from '../firebase/user/usersGetFire';

const ListSearchScreen = () => {
  // user search
  useEffect(() => {
    if (searchUserUsername && searchUserUsername.length >= 1) {
      setUsersFound(null);
      console.log("length: ", searchUserUsername.length, " input: ", searchUserUsername);
      const searchUsers = getSearchUsersFire(searchUserUsername, "bus");
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

	return (
		<View>
			<View>
				<Text>List Search Screen</Text>
			</View>
			<View>
				<NavigationBar />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	
	
});
export default ListSearchScreen;
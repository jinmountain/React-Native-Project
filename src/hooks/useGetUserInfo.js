import { useState, useEffect } from 'react';
import {
  getUserInfoFire
} from '../firebase/user/usersGetFire';

export default (userId) => {
	const [ userInfo, setUserInfo ] = useState(null);

	useEffect(() => {
    let isMounted = false;
    const getUserInfo = getUserInfoFire(userId);
    getUserInfo
    .then((user) => {
    	let postUserData;

      postUserData = {
        id: user.id,
        photoURL: user.photoURL,
        type: user.type,
        username: user.username,
        name: user.name
      };

      if (user.type === 'business') {
      	postUserData = {
      		...postUserData,
      		...{
      			countRating: user.countRating,
      			totalRating: user.totalRating
      		}
      	}
      };
      setUserInfo(postUserData);
    })
    .catch((error) => {
      // handle error;
    });
    
    return () => {
      isMounted = false;
    };
	}, []);

	return [userInfo];
}
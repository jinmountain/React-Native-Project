import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Contexts
import { Context as SocialContext } from '../context/SocialContext';

// import * as Notifications from 'expo-notifications';

// export default function App() {
//   const lastNotificationResponse = Notifications.useLastNotificationResponse();
  
//   React.useEffect(() => {
//     if (
//       lastNotificationResponse &&
//       lastNotificationResponse.notification.request.content.data['someDataToCheck'] &&
//       lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
//     ) {
//       // navigate to your desired screen
//     }
//   }, [lastNotificationResponse]);

//   return (
//     /*
//      * your app
//      */
//   );
// }

export default () => {
	Notifications.setNotificationHandler({
	  handleNotification: async () => ({
	    shouldShowAlert: true,
	    shouldPlaySound: false,
	    shouldSetBadge: false,
	  }),
	});

	const { 
		state: { 
			receivedNotificationResponse
		}, 
		addReceivedNotificationResponse
	} = useContext(SocialContext);

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);

  const [ screen, setScreen ] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    	addReceivedNotificationResponse(response.notification.request.content.data);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  const schedulePushNotification = async (newNotification) => {
		await Notifications.scheduleNotificationAsync({
	    content: {
	      title: newNotification.title,
	      body: newNotification.body,
	      data: newNotification.data,
	    },
	    trigger: { 
	    	seconds: newNotification.triggerTime,
	    	repeats: newNotification.repeats
	    },
	  });
	}

	const registerForPushNotificationsAsync = async () => {
		let token;
	  if (Constants.isDevice) {
	    const { status: existingStatus } = await Notifications.getPermissionsAsync();
	    let finalStatus = existingStatus;
	    if (existingStatus !== 'granted') {
	      const { status } = await Notifications.requestPermissionsAsync();
	      finalStatus = status;
	    }
	    if (finalStatus !== 'granted') {
	      alert('Failed to get push token for push notification!');
	      return;
	    }
	    token = (await Notifications.getExpoPushTokenAsync()).data;
	    console.log(token);
	  } else {
	    alert('Must use physical device for Push Notifications');
	  }

	  if (Platform.OS === 'android') {
	    Notifications.setNotificationChannelAsync('default', {
	      name: 'default',
	      importance: Notifications.AndroidImportance.MAX,
	      vibrationPattern: [0, 250, 250, 250],
	      lightColor: '#FF231F7C',
	    });
	  }

	  return token;
	}

	return [schedulePushNotification]
}



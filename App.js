import React, { useEffect, useState, useContext, useRef } from 'react';
import 'react-native-gesture-handler';
import { LogBox, AppState } from 'react-native';
LogBox.ignoreLogs(['Setting a timer']);
// import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import { createBottomTabNavigator } from 'react-navigation-tabs';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import * as ScreenOrientation from 'expo-screen-orientation';
// import { createStackNavigator } from 'react-navigation-stack';

// Sign in Sign up
import SigninScreen from './src/screens/SigninScreen';
import SignupScreen from './src/screens/SignupScreen';
import PasswordResetScreen from './src/screens/PasswordResetScreen';
import EmailVerificationScreen from './src/screens/EmailVerificationScreen';
import ResolveAuthScreen from './src/screens/ResolveAuthScreen';
import CameraScreen from './src/screens/CameraScreen';
import ImageUploadMethodModal from './src/screens/ImageUploadMethodModal';
import ImageZoominScreen from './src/screens/ImageZoominScreen';
import ChatScreen from './src/screens/ChatScreen';
import PostDetailScreen from './src/screens/PostDetailScreen';

// navigation stacks
import ChatListStack from './src/navigations/ChatListStack';
import UserAccountStack from './src/navigations/UserAccountStack';
import PostsSwipeStack from './src/navigations/PostsSwipeStack';

// Navigations
import MainBottomTab from './src/navigations/MainBottomTab';
import BusinessBottomTab from './src/navigations/BusinessBottomTab';

// Context Providers
import { Provider as PostProvider } from './src/context/PostContext';
import { Provider as LocationProvider } from './src/context/LocationContext';
import { Provider as AuthProvider } from './src/context/AuthContext';
import { Provider as SocialProvider } from './src/context/SocialContext';

// Contexts
import { Context as AuthContext } from './src/context/AuthContext';
import { Context as SocialContext } from './src/context/SocialContext';

// Navigate
import { navigationRef, isReadyRef } from './src/navigationRef';

// Hooks
import { wait } from './src/hooks/wait';
import useAppState from './src/hooks/useAppState';

const Stack = createStackNavigator();

const LoginFlow = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen} 
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="Signin" 
        component={SigninScreen} 
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="PasswordReset" 
        component={PasswordResetScreen} 
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}

const MainFlow = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Main" 
        component={MainBottomTab}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen  
        name="UserAccountStack" 
        component={UserAccountStack}
        options={{ 
          headerShown: false,
        }}
      />
    {/* PostDetailScreen is here for Activity Tab's navigation to PostDetailScreen*/}
      <Stack.Screen 
        name="PostDetail" 
        component={PostDetailScreen} 
        options={{ 
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="ChatListStack" 
        component={ChatListStack}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="ImageUploadMethodModal" 
        component={ImageUploadMethodModal}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="Camera" 
        component={CameraScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="ImageZoomin" 
        component={ImageZoominScreen}
        options={{
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="BusinessMain" 
        component={BusinessBottomTab}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

// Firebase
import authFire from './src/firebase/authFire';
import usersGetFire from './src/firebase/usersGetFire';
import usersPostFire from './src/firebase/usersPostFire';

// Hooks
import useNotifications from './src/hooks/useNotifications';
// import {useRoute} from '@react-navigation/native';

const App = () => {
  const [ splash, setSplash ] = useState(true);
  const [ schedulePushNotification ] = useNotifications();
  // const route = useRoute();
  // console.log(route.name);
  const { 
    state: { user },
    localSignin,
  } = useContext(AuthContext);

  const { 
    state: { appStateSocial },
    addAppStateSocial,
  } = useContext(SocialContext);

  useEffect(() => {
    return () => {
      isReadyRef.current = false
    };
  }, []);

  // listen appState and post to users ref
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  useEffect(() => {
    if (user && user.emailVerified) {
      usersPostFire.changeUserAppState(user.id, appStateVisible);
      addAppStateSocial(user.id, appStateVisible);
    }
  }, [appStateVisible]);

  const handleAppStateChange = (nextAppState) => {
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  // start local sign in
  useEffect(() => {
    const tryLoginFirst = localSignin();
    tryLoginFirst
    .then((userData) => {
      wait(1000).then(() => {
        setSplash(false);
      });
    })
    .catch((error) => {
      console.log("Error occured: App: localSignin: ", error);
      wait(1000).then(() => {
        setSplash(false);
      });
    });

    return () => {
    };
  }, []);

  // user notification listener
  useEffect(() => {
    let notificationListener;
    if (user) {
      notificationListener = usersGetFire.getUserNotificationsRealtime(user.id, schedulePushNotification);
    }

    return () => {
      // must unsubscribe when not in effect
      if (notificationListener) {
        console.log("App: unsubscribe: notificationListener");
        notificationListener()
      }
    };
  }, [user])

  return (
    <NavigationContainer 
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
        console.log("READY");
      }}
    >
      {
        splash
        ? <ResolveAuthScreen />
        : user
        ? <MainFlow />
        : <LoginFlow />
        // USE WHEN USE REAL EMAILS
        // ? <ResolveAuthScreen />
        // : user && user.emailVerified === true
        // ? <MainFlow />
        // : user && user.emailVerified === false
        // ? <EmailVerificationScreen />
        // : <LoginFlow />
      }
    </NavigationContainer>
  );
};

export default () => {
  return (
  //  <SafeAreaProvider>
      <SocialProvider>
        <PostProvider>
          <LocationProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </LocationProvider>
        </PostProvider>
      </SocialProvider>
  //  </SafeAreaProvider>
  );
};
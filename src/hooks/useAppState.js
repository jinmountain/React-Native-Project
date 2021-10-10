import React, { useRef, useState, useEffect, useContext } from 'react';
import { AppState } from 'react-native';

// Contexts
import { Context as AuthContext } from '../context/AuthContext';

export default () => {
  const { 
    state: { user },
  } = useContext(AuthContext);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log('AppState', appState.current);
  };

  useEffect(() => {
    if (user) {
      usersPostFire.changeUserAppState(user.id, appStateVisible);
    }
  }, [appStateVisible]);
};

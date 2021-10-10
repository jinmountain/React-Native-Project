import { useEffect } from 'react';
import { 
  BackHandler, 
} from 'react-native';

export default (navigation, previousScreenBackHandler, actionBeforeGoBack) => {
  const backAction = () => {
    if (previousScreenBackHandler === null) {
      navigation.goBack();
      return true;
    } else {
      navigation.navigate(previousScreenBackHandler);
      return true;
    }
  };

  useEffect(() => {
    // Android backhandler to go back to previous screen
    BackHandler.addEventListener("hardwareBackPress", backAction);
    
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    }
  }, []);
};
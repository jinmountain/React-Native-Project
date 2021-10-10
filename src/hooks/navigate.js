import * as React from 'react';
import { useNavigation } from '@react-navigation/native';

const navigate = () => {
  const { navigate } = useNavigation();
  return navigate
}

export default navigate;
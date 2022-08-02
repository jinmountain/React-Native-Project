import {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';

export const useOrientation = () => {
  const [orientation, setOrientation] = useState("PORTRAIT");

  useEffect(() => {
    const dimensionsListener = Dimensions.addEventListener('change', ({window:{width,height}})=>{
      if (width < height) {
        setOrientation("PORTRAIT")
      } else {
        setOrientation("LANDSCAPE")
      }
    })
    return () => {
      dimensionsListener.remove();
    }
  }, []);

  return orientation;
}
import React from 'react';
import {
  Dimensions,
  ImageBackground,
  TouchableHighlight,
  View,
} from 'react-native';

const {width} = Dimensions.get('window');

const ImageBox = ({ 
  item, 
  index, 
  selected, 
  selectImage, 
  selectedItemNumber, 
  renderSelectedComponent, 
  renderExtraComponent 
}) => {

  if (!item) return null;
  return (
    <TouchableHighlight
      style={{ opacity: selected ? 0.5 : 1 }}
      underlayColor='transparent'
      onPress={() => selectImage(index)} >
      <View style={{ position: 'relative' }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ImageBackground
            style={{ width: width / 4, height: width / 4 }}
            source={{ uri: item.uri }} >
            {selected && renderSelectedComponent && renderSelectedComponent(selectedItemNumber)}
            {renderExtraComponent && renderExtraComponent(item)}
          </ImageBackground>
        </View>
      </View>
    </TouchableHighlight>
  )
}

export default ImageBox;
import React, { useState, useEffect } from 'react';
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
  selectImage,
  isSelected,
  selectedItemNumber,
  fileImageWidth, 
  renderSelectedComponent, 
  renderExtraComponent 
}) => {
  if (!item) return null;
  return (
    <TouchableHighlight
      style={[
        { 
          opacity: isSelected ? 0.5 : 1,
          backgroundColor: '#000',
          marginBottom: 1,
        },
        index % 4 !== 0 ? { paddingLeft: 2 } : { paddingLeft: 0 }
      ]}
      underlayColor='transparent'
      onPress={() => {selectImage(item)}}>
      <View style={{ position: 'relative' }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ImageBackground
            style={{ width: fileImageWidth, height: fileImageWidth }}
            source={{ uri: item.uri }} >
            {isSelected && renderSelectedComponent && renderSelectedComponent(selectedItemNumber)}
            {renderExtraComponent && renderExtraComponent(item)}
          </ImageBackground>
        </View>
      </View>
    </TouchableHighlight>
  )
}

export default ImageBox;
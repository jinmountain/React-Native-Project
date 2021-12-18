import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableHighlight,
} from "react-native";
// TouchableOpacity from rngh works on both ios and android
// import { TouchableOpacity } from 'react-native-gesture-handler';

// npms
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import DefaultUserPhoto from './defaults/DefaultUserPhoto';
import { InputFormBottomLine } from './InputFormBottomLine';

// Designs
import { AntDesign } from '@expo/vector-icons';

// Hooks
import useConvertTime from '../hooks/useConvertTime';
import { capitalizeFirstLetter } from '../hooks/capitalizeFirstLetter';

// Color
import color from '../color';

// expo icons
import expoIcons from '../expoIcons';

const VerticalScrollModalButton = ({ label, value, setValue, setIsModalVisible }) => {
  return (
    <TouchableHighlight
      style={{ height: RFValue(53), justifyContent: 'center', alignItems: 'center' }}
      onPress={() => {
        setValue(value);
        setIsModalVisible(false);
      }}
      underlayColor={color.grey4}
    >
      <View style={{ justifyContent: 'center', alignItems: 'center', width: "100%" }}>
        <Text style={{ fontSize: RFValue(17) }}>{label}</Text>
      </View>
    </TouchableHighlight>
  )
};

const VerticalScrollPicker = ({ content, setValue, setIsModalVisible, defaultLabel, defaultValue }) => {
  return (
    <ScrollView>
      <TouchableHighlight
        style={{ height: RFValue(53), justifyContent: 'center', alignItems: 'center' }}
        onPress={() => {
          setValue(defaultValue);
          setIsModalVisible(false);
        }}
        underlayColor={color.grey4}
      >
        <View style={{ justifyContent: 'center', alignItems: 'center', width: "100%", flexDirection: 'row'}}>
          <View style={styles.modalCloseContainer}>
            {expoIcons.chevronBack(RFValue(27), color.black1)}
          </View>
          <View>
            <Text style={{ fontSize: RFValue(17) }}>{defaultLabel}</Text>
          </View>
        </View>
      </TouchableHighlight>
      
      {
        content.map((item, index) => (
          <VerticalScrollModalButton
            label={item.label}
            value={item.value}
            setValue={setValue}
            setIsModalVisible={setIsModalVisible}
          />
        ))
      }
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  
});

export default VerticalScrollPicker
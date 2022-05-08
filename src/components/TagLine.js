import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Image,
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native';

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Designs
// import { Feather } from '@expo/vector-icons';

// Hooks
import { colorByRating } from '../hooks/colorByRating';

// Color
import color from '../color';

// icons
import {snailShell} from '../expoIcons';

const TagLine = ({ tags }) => {
  return (
    <View style={styles.tagBoxContainer}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={tags}
        keyExtractor={(tag, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity 
              onPress={() => {

              }}
              style={{ justifyContent: 'center' }}
            >
              <View style={styles.unitContainer}>
                <View style={styles.tagsContainer}>
                  {snailShell(RFValue(15), color.red2)}
                  <Text style={styles.tagText}>
                    {item}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // Tags
  tagBoxContainer: {
    height: RFValue(50),
    paddingHorizontal: RFValue(9),
  },
  unitContainer: {
    borderWidth: 0.5,
    borderRadius: RFValue(8),
    marginRight: RFValue(5),
    paddingVertical: RFValue(3),
    paddingHorizontal: RFValue(7),
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: "row",
  },
  tagText: {
    fontSize: RFValue(17),
  },
});

export default TagLine;
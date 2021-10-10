import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  FlatList,
  Animated,
  Image,
  Dimensions,
  View, 
  Text, 
  StyleSheet, 
  TouchableHighlight,
  // TouchableOpacity,
} from "react-native";
// TouchableOpacity from rngh works on both ios and android
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import BarGraphBar from './BarGraphBar';
import HeaderBottomLine from './HeaderBottomLine';

// Designs
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

// Hooks
import useConvertTime from '../hooks/useConvertTime';

// Color
import color from '../color';

// window height
// max value among elements

const { width, height } = Dimensions.get("window");
const barGraphHeight = height/2;

const GraphGuideLine = () => {
  return (
    <View style={{ height: RFValue(20), justifyContent: 'center', alignItems: 'center', borderWidth: 1 }}>
      <View 
        style={{
          backgroundColor: color.black1,
          height: 0.3,
          opacity: 0.3,
          width: '100%',
        }}
      ></View>
    </View>
  )
};

const GraphYLabelText = ({ maxCount, count }) => {
  return (
    <View style={{ height: RFValue(20), justifyContent: 'center', alignItems: 'center'}}>
      <Text>{count}</Text>  
    </View>
  )
};

const BarGraph = ({ counts, maxCount }) => {
  return (
    <View style={{ height: barGraphHeight + RFValue(100), flex: 1 }}>
      <View style={{ height: RFValue(50), justifyContent: 'center', alignItems: 'center' }}>
        <Text>Title</Text>
      </View>
      <View style={{ borderWidth: 1, height: barGraphHeight + RFValue(50)}}>
        <View style={{ flexDirection: 'row', height: barGraphHeight + RFValue(50) }}>
          <View style={{ width: RFValue(50) }}>
            <GraphYLabelText count={maxCount} />
            <View style={{ flex: 1 }}>
            </View>
            <GraphYLabelText count={Math.round((maxCount/4*3) * 10) / 10} />
            <View style={{ flex: 1 }}>
            </View>
            <GraphYLabelText count={Math.round((maxCount/4*2) * 10) / 10} />
            <View style={{ flex: 1 }}>
            </View>
            <GraphYLabelText count={Math.round((maxCount/4*1) * 10) / 10} />
            <View style={{ flex: 1 }}>
            </View>
            <GraphYLabelText count={0} />
            <View style={{ width: RFValue(50), height: RFValue(30) }}>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <GraphGuideLine />
            <View style={{ flex: 1 }}>
            </View>
            <GraphGuideLine />
            <View style={{ flex: 1 }}>
            </View>
            <GraphGuideLine />
            <View style={{ flex: 1 }}>
            </View>
            <GraphGuideLine />
            <View style={{ flex: 1 }}>
            </View>
            <GraphGuideLine />
            <View style={{ width: RFValue(50), height: RFValue(30) }}>
            </View>
          </View>
        </View>
        <View style={{ position: 'absolute', height: barGraphHeight + RFValue(50), paddingLeft: RFValue(50), borderWidth: 1 }}>
          <FlatList
            horizontal
            // contentContainerStyle={{  }} 
            data={counts}
            keyExtractor={(post, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <View style={{ justifyContent: 'flex-end', alignItems: 'center', height: barGraphHeight + RFValue(50), marginHorizontal: RFValue(3) }}>
                  <View style={{ height: RFValue(10) }}>
                  </View>
                  <BarGraphBar maxCount={maxCount} count={item.count} height={barGraphHeight}/>
                  <View style={{ height: RFValue(10) }}>
                  </View>
                  <View style={{ height: RFValue(30), borderWidth: 1, borderColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
                    <Text>{useConvertTime.convertToMonthly(item.time)}</Text>
                  </View>
                </View>
              )
            }}
          />
        </View>
      </View>
    </View>
  )
};

export default BarGraph;
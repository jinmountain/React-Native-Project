import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  Animated,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import MainTemplate from '../components/MainTemplate';
import HeaderBottomLine from '../components/HeaderBottomLine';
import { HeaderForm } from '../components/HeaderForm';
import HeaderScrollExpandAnim from '../components/HeaderScrollExpandAnim';

// Design

// Hooks

// color
import color from '../color';

// icon
import expoIcons from '../expoIcons';


const UserLikeScreen = ({ navigation }) => {

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: 'white', zIndex: 7 }}
        contentContainerStyle={{
          paddingBottom: RFValue(77),
        }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        // onScroll={Animated.event(
        //   [{ nativeEvent: { contentOffset: { y: offset } } }],
        //   { useNativeDriver: false }
        // )}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
        stickyHeaderIndices={[0]}
      >
{/*        <HeaderScrollExpandAnim 
          animValue={offset}
          headerTitle={"Reservations"}
          maxHeaderHeight={RFValue(190)}
          minHeaderHeight={RFValue(50)}
          maxHeaderTitleSize={RFValue(45)}
          minHeaderTitleSize={RFValue(17)}
          backgroundColor={color.white2}
        />*/}
      </ScrollView>
      {
        showAlertBoxTop &&
        <AlertBoxTop 
          setAlert={setShowAlertBoxTop}
          alertText={alertBoxTopText}
        />
      }
    </View>
  )
};

const styles = StyleSheet.create({

});

export default UserLikeScreen;
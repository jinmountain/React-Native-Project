import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView,
  FlatList,
  Animated,
  Text, 
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  Modal,
  PanResponder,
  TouchableWithoutFeedback
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from '@react-navigation/native';

// Components
import MainTemplate from '../components/MainTemplate';
import HeaderBottomLine from '../components/HeaderBottomLine';
import { HeaderForm } from '../components/HeaderForm';

// Design

// Hooks

// color
import color from '../color';

// icon
import expoIcons from '../expoIcons';

const { width, height } = Dimensions.get("window");

const SnailBottomSheet = ({ header, content, initialSnap, snapPoints, setShowBottomSheet }) => {
  const navigation = useNavigation();

  // panY is the height of background area
  const panY = useRef(new Animated.Value(height)).current;

  const resetPositionAnim =
  Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: false
  });

  // const resetToCurrentPositionAnim = 
  // Animated.timing(panY, {
  //   toValue: height - snapPoints[currentSnapIndex],
  //   duration: 300,
  //   useNativeDriver: false
  // });

  // const goToSecondSnapPoint =
  // Animated.timing(panY, {
  //   toValue: height - snapPoints[1],
  //   duration: 300,
  //   useNativeDriver: false
  // });

  // const goToThirdSnapPoint =
  // Animated.timing(panY, {
  //   toValue: height - snapPoints[2],
  //   duration: 300,
  //   useNativeDriver: false
  // });

  const closeAnim =
  Animated.timing(panY, {
    toValue: height,
    duration: 500,
    useNativeDriver: false
  });

  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
    // when y goes positive panY is 1 when y goes to 0 or negative pnaY goes to 0
  });

  const handleDismiss = () => closeAnim.start(setShowBottomSheet(false));

  // const [ currentSheetHeight, setCurrentSheetHeight ] = useState(snapPoints[initialSnap]);
  // const [ currentSnapIndex, setCurrentSnapIndex ] = useState(initialSnap);

  const panResponders = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: Animated.event([
        null, {dy: panY}
      ],
      {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gs) => {
        console.log("gs.vy: ", gs.vy);
        console.log("gs.dy: ", gs.dy);
        // if (gs.dy > 0 && gs.vy > 0) {
        //   return handleDismiss();
        // }
        //when current snap point is 0, which is the first snap point
        // if (
        //   gs.dy > 0 && 
        //   gs.vy > 0 &&
        //   gs.vy <= 2 &&
        //   snapPoints[1] !== 0 &&
        //   currentSnapIndex === 0
        // ) {
        //   console.log("go to second snap point")
        //   return goToSecondSnapPoint.start(() => {
        //     setCurrentSheetHeight(snapPoints[1]);
        //     setCurrentSnapIndex(1);
        //   });
        // }
        // when current snap point is 1, which is the second snap point
        // if (
        //   gs.dy > 0 && 
        //   gs.vy > 0 && 
        //   gs.vy <= 2 &&
        //   snapPoints [2] !== 0 &&
        //   currentSnapIndex === 1
        // ) {
        //   return goToThirdSnapPoint.start(setCurrentSnapIndex(2));
        // }

        if (gs.dy > 0 && gs.vy > 2) {
          console.log("dismiss");
          return handleDismiss();
        }

        resetPositionAnim.start();
      },
    })
  ).current;

  useEffect(() => {
    resetPositionAnim.start();
  }, []);

  return (
    <Modal
      animated
      animationType="fade"
      visible={true}
      transparent
      onRequestClose={handleDismiss}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.goBack();
        }}
      >
        <View style={styles.overlay}>
          <Animated.View
            style={{
              ...styles.container,
              transform: [{translateY: translateY}],
              ...{ height: height - RFValue(100) }
            }}
            {...panResponders.panHandlers}
          >
            <View style={styles.sliderIndicatorRow}>
              <View style={styles.sliderIndicator} />
            </View>
            <View style={{ flex: 1 }}>
              {content}
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    flex: 1,
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: 'red'
  },
  container: {
    backgroundColor: 'white',
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
  },
  sliderIndicatorRow: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderIndicator: {
    backgroundColor: '#CECECE',
    height: 4,
    width: 45,
  },
});

export default SnailBottomSheet;
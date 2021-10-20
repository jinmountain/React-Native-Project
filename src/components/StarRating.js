import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
} from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Color
import color from '../color';

// Design
import { AntDesign } from '@expo/vector-icons';

// function getRandomColor() {
//   var letters = '0123456789ABCDEF';
//   var color = '#';
//   for (var i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// };

const StarRating = ({rating, changeRating}) => {
  // const [ randomColor, setRandomColor ] = useState(getRandomColor());
	return (
		<View style={styles.ratingContainer}>
      <View style={styles.actionContainer}>
        <TouchableHighlight 
          underlayColor={color.grey4}
          style={styles.buttonContainer}
          onPress={() => { changeRating(1) }}
        >
          { 
            rating !== null && rating >= 1
            ?
            <AntDesign 
              name="star" 
              size={RFValue(23)} 
              color={
                rating >= 1
                ?
                color.yellow2
                : color.rating0
              }
            />
            :
            <AntDesign name="staro" size={RFValue(23)} color={color.rating0} />
          }
        </TouchableHighlight>
        <TouchableHighlight 
          underlayColor={color.grey4}
          style={styles.buttonContainer}
          onPress={() => { changeRating(2) }}
        >
          { 
            rating !== null && rating >= 2
            ?
            <AntDesign 
              name="star" 
              size={RFValue(23)} 
              color={
                rating >= 2
                ?
                color.yellow2
                : color.rating0
              }
            />
            :
            <AntDesign name="staro" size={RFValue(23)} color={color.rating0} />
          }
        </TouchableHighlight>
        <TouchableHighlight 
          underlayColor={color.grey4}
          style={styles.buttonContainer}
          onPress={() => { changeRating(3) }}
        >
          { 
            rating !== null && rating >= 3
            ?
            <AntDesign 
              name="star" 
              size={RFValue(23)} 
              color={
                rating >= 3
                ?
                color.yellow2
                : color.rating0
              }
            />
            :
            <AntDesign name="staro" size={RFValue(23)} color={color.rating0} />
          }
        </TouchableHighlight>
        <TouchableHighlight 
          underlayColor={color.grey4}
          style={styles.buttonContainer}
          onPress={() => { changeRating(4) }}
        >
          { 
            rating !== null && rating >= 4
            ?
            <AntDesign 
              name="star" 
              size={RFValue(23)} 
              color={
                rating >= 4
                ?
                color.yellow2
                : color.rating0
              }
            />
            :
            <AntDesign name="staro" size={RFValue(23)} color={color.rating0} />
          }
        </TouchableHighlight>
        <TouchableHighlight 
          underlayColor={color.grey4}
          style={styles.buttonContainer}
          onPress={() => { changeRating(5) }}
        >
          { 
            rating !== null && rating == 5
            ?
            <AntDesign 
              name="star" 
              size={RFValue(23)} 
              color={
                rating >= 5
                ?
                color.yellow2
                : color.rating0
              }
            />
            :
            <AntDesign name="staro" size={RFValue(23)} color={color.rating0} />
          }
        </TouchableHighlight>
        {
          rating
          ?
          <Text style={styles.ratingText}>
            {rating}
          </Text>
          : null
        }
      </View>
    </View>
	);
};

const styles = StyleSheet.create({
	ratingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
	},
  buttonContainer: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(3),
    paddingVertical: RFValue(3),
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingText: {
    color: color.black1,
    paddingHorizontal: RFValue(7),
  },
});

export { StarRating };


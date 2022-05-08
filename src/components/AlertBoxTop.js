import React, { useRef, useEffect } from 'react';
import { 
	View, 
	Text, 
	StyleSheet,
	TouchableHighlight,
	TouchableOpacity,
	SafeAreaView,
	Animated,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import { useTheme } from '@react-navigation/native';
import { useCardAnimation } from '@react-navigation/stack';

// Designs
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

// hooks
import { wait } from '../hooks/wait';

// Color
import color from '../color';

// icon
import {evilIconsClose} from '../expoIcons';

const AlertBoxTop = ({ setAlert, alertText }) => {
	const { current } = useCardAnimation();

	const moveY = useRef(new Animated.Value(0)).current;
	const fadeAnim = useRef(new Animated.Value(1)).current;

	const pullUp = () => {
		return new Promise((res, rej) => {
	    Animated.timing(moveY, {
	      toValue: -50,
	      duration: 300,
	      useNativeDriver: false
	    }).start();
	    res(true);
		});
  };

  const drop = () => {
  	return new Promise((res, rej) => {
  		Animated.timing(moveY, {
	  		toValue: 50,
	  		duration: 100,
	  		useNativeDriver: false
	  	}).start();
	  	res(true);
  	})
  };

  const fadeOut = () => {
  	return new Promise((res, rej) => {
  		Animated.timing(fadeAnim, {
	      toValue: 0,
	      duration: 300,
	      useNativeDriver: false
	    }).start();
	    res(true);
  	})
  };

  const resetAnimValues = () => {
  	moveY.setValue(0);
  	fadeAnim.setValue(1);
  };

  useEffect(() => {
  	drop() // initiate drop
  	.then(() => {
  		wait(3000) // wait 3 sec
	  	.then(() => {
	      pullUp() // start pullUp
	      .then(() => {
	      	fadeOut();
	      	wait(190) // wait
	      	.then(() => {
	      		setAlert(false); // disappear the box
	      	});
	      });
	    });
  	})
  }, []);

	return (
		<SafeAreaView style={styles.screenContainer}>
			<Animated.View 
				style={
					{ opacity: fadeAnim },
					{ transform: [{ translateY: moveY }] }
				}
			>
				<TouchableOpacity 
					style={styles.warningContainer}
					onPress={() => {
						setAlert(false);
						resetAnimValues();
					}}
					// underlayColor={color.grey4}
				>
					<View style={styles.warningInnerContainer}>
		    		<Text style={styles.text}>
		    			{alertText}
		    		</Text>
		    	</View>
		    	<View style={styles.signContainer}>
	    			{evilIconsClose(RFValue(27), color.white2)}
	    		</View>
	    	</TouchableOpacity>
	    </Animated.View>
	  </SafeAreaView>
	)
}

const styles = StyleSheet.create({
  screenContainer: {
  	flex: 1,
  	zIndex: 6,
  	position: 'absolute',
  	width: '100%',
  	backgroundColor: 'transparent',
  	justifyContent: 'flex-end',
  	alignItems:'center',
  },
  warningContainer: {
  	zIndex: 6,
  	alignItems: 'center',
  	justifyContent: 'center',
    backgroundColor: color.red2,
    shadowColor: "#000",
    shadowRadius: 3,
    shadowOpacity: 0.3,
    shadowOffset: { 
    	width: 0,
			height: 5, 
		},
		width: RFValue(330),
		borderRadius: RFValue(10),
		paddingVertical: RFValue(10),
		flexDirection: 'row',
  },
  warningInnerContainer: {
    flex: 1,
    paddingLeft: RFValue(10)
  },
  signContainer: {
  	padding: RFValue(10),
  	alignItems: 'center',
  	justifyContent: 'center',
  },
  text: {
  	fontSize: RFValue(17),
  	fontWeight: 'bold',
  	color: color.white2,
  }
});

export default AlertBoxTop;
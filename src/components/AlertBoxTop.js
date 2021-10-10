import React, { useRef, useEffect } from 'react';
import { 
	View, 
	Text, 
	StyleSheet,
	TouchableHighlight,
	TouchableOpacity,
	Animated,
} from 'react-native';
import { SafeAreaView, } from 'react-native-safe-area-context';
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
import expoIcons from '../expoIcons';

const AlertBoxTop = ({ setAlert, alertText }) => {
	const { current } = useCardAnimation();

	const topToBotAnim = useRef(new Animated.Value(RFValue(70))).current;
	const fadeAnim = useRef(new Animated.Value(1)).current;

	const pullUp = () => {
		return new Promise((res, rej) => {
	    Animated.timing(topToBotAnim, {
	      toValue: 0,
	      duration: 300,
	      useNativeDriver: false
	    }).start();
	    res(true);
		});
  };

  const drop = () => {
  	return new Promise((res, rej) => {
  		Animated.timing(topToBotAnim, {
	  		toValue: RFValue(70),
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
  }

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
		<Animated.View style={[styles.screenContainer, { height: topToBotAnim, opacity: fadeAnim }]}>
			<TouchableOpacity 
				style={styles.warningContainer}
				onPress={() => {
					setAlert(false);
				}}
				// underlayColor={color.grey4}
			>
				<View style={styles.warningInnerContainer}>
	    		<Text style={styles.text}>
	    			{alertText}
	    		</Text>
	    		<View style={styles.signContainer}>
	    			{expoIcons.evilIconsClose(RFValue(27), color.white2)}
	    		</View>
	    	</View>
    	</TouchableOpacity>
    </Animated.View>
	)
}

const styles = StyleSheet.create({
  screenContainer: {
  	elevation: 10, // for android
  	position: 'absolute',
  	width: '100%',
  	backgroundColor: 'transparent',
  	justifyContent: 'flex-end',
  	alignItems:'center',
  },
  warningContainer: {
  	zIndex: 0,
  	alignItems: 'center',
  	justifyContent: 'center',
    backgroundColor: color.skyblue2,
    shadowColor: "#000",
    shadowRadius: 3,
    shadowOpacity: 0.3,
    shadowOffset: { 
    	width: 0,
			height: 5, 
		},
		height: RFValue(50),
		width: RFValue(330),
		borderRadius: RFValue(10),
  },
  warningInnerContainer: {
    flex: 1,
  	flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: RFValue(20),
  },
  signContainer: {
  	flex: 1,
  	padding: RFValue(3),
  	alignItems: 'center',
  	justifyContent: 'center',
  },
  text: {
  	flex: 5,
  	fontSize: RFValue(17),
  	fontWeight: 'bold',
  	color: color.white2
  }
});

export default AlertBoxTop;
import React from 'react';
import { 
	View, 
	StyleSheet,
	Text,  
	TouchableOpacity,
	TouchableHighlight,
  SafeAreaView,
  ImageBackground,
  Platform,
  Pressable
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { getStatusBarHeight } from 'react-native-status-bar-height';

// Designs
// import { AntDesign } from '@expo/vector-icons';
// import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

// Color
import color from '../../color';

// sizes
import sizes from '../../sizes';

// Hooks
import count from '../../hooks/count';
import { useOrientation } from '../../hooks/useOrientation';

// Components
import HeaderBottomLine from '../../components/HeaderBottomLine';
import AnimScaleButton from '../../components/buttons/AnimScaleButton';

const headerBoxHeight = sizes.headerBoxHeight + RFValue(10);

const UserAccountHeaderForm = ({ 
  userActiveState,
  leftButtonTitle, 
  leftButtonIcon,
  leftButtonPress,
  coverPhotoMode,
  username, 
  usernameTextStyle,
  title, 
  firstIcon, 
  secondIcon,
  thirdIcon, 
  firstOnPress, 
  secondOnPress,
  thirdOnPress,
}) => {
  const orientation = useOrientation();
	return (
		<View style={styles.accountScreenHeaderContainer}>
      <View style={styles.compartmentOuter}>
        <View style={styles.leftCompartmentContainer}>
          <View style={styles.leftCompartmentInnerContainer}>
            {
              leftButtonIcon
              ?
              <AnimScaleButton
                icon={leftButtonIcon}
                onPress={leftButtonPress}
                customButtonContainerStyle={
                  coverPhotoMode
                  ?
                  [ styles.leftIconContainer, { backgroundColor: 'rgba(0, 0, 0, 0.3)' } ]
                  : styles.leftIconContainer
                }
                customScaleValue={1.1}
              />
              :
              <View style={{ width: RFValue(17) }}/>
            }
            {
              leftButtonTitle &&
              <View style={styles.compartmentTextContainer}>
                <Text style={styles.compartmentText}>{leftButtonTitle}</Text>
              </View>
            }
            <View style={
              coverPhotoMode
              ?
              [ styles.usernameContainer, { backgroundColor: 'rgba(0, 0, 0, 0.3)' } ]
              :styles.usernameContainer
            }>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={[styles.compartmentText, usernameTextStyle]}>{username}</Text>
              </View>
              {
                userActiveState
                ?
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  {userActiveState}
                </View>
                :
                null
              }
            </View>
          </View>
        </View>

  		  <View style={styles.rightCompartmentContainer}>
  		    <View style={styles.headerCompartmentContainer}>
  					<View style={styles.headerElementsInRow}>
              { firstIcon &&
                <Pressable 
                  onPress={firstOnPress}
                >
                  <View style={
                    coverPhotoMode
                    ?
                    [styles.headerElement, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]
                    : styles.headerElement
                  }>
                    <Text style={styles.iconText}>{firstIcon}</Text>
                  </View>
                </Pressable>
              }
              { secondIcon &&
                <Pressable 
                  onPress={secondOnPress}
                >
                  <View style={
                    coverPhotoMode
                    ?
                    [styles.headerElement, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]
                    : styles.headerElement
                  }>
                    <Text style={styles.iconText}>{secondIcon}</Text>
                  </View>
                </Pressable>
              }
  						{
                thirdIcon &&
                <Pressable 
                  onPress={thirdOnPress}
                >
                  <View style={
                    coverPhotoMode
                    ?
                    [styles.headerElement, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]
                    : styles.headerElement
                  }>
                    <Text style={styles.iconText}>{thirdIcon}</Text>
                  </View>
                </Pressable>
              }
  					</View>
  				</View>
  		  </View>
      </View>
		</View>
	)
};

const styles = StyleSheet.create({
	accountScreenHeaderContainer: {
    justifyContent: 'center',
    height: headerBoxHeight,
    // backgroundColor: color.white2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    // for android
    elevation: 5,
    // for ios
    zIndex: 5,
  },
  compartmentOuter: {
    flex: 1,
    justifyContent: 'center',
  },
  leftCompartmentContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  leftCompartmentInnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  leftTitleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftTitleText: {
    fontSize: RFValue(19)
  },
  usernameContainer: {
    paddingHorizontal: RFValue(10),
    paddingVertical: RFValue(5),
    borderRadius: RFValue(10),
    flexDirection: 'row',
  },

  middleCompartmentContainer: {
    position: 'absolute',
    alignSelf: 'center',
  },

  rightCompartmentContainer: {
    alignSelf: 'flex-end',
  },
  headerTitle: {
    fontSize: RFValue(17),
    color: color.black1,
    justifyContent: 'center',
  	alignItems: 'center',
  },
  headerCompartmentContainer: {
  	justifyContent: 'center',
  	alignItems: 'center',
  },
  headerElementsInRow: {
  	flexDirection: 'row',
  	justifyContent: 'space-around',
    alignItems: 'center',
  },
  headerElement: {
    marginHorizontal: RFValue(3),
  	padding: RFValue(5),
  	borderRadius: RFValue(100),
  	justifyContent: 'center',
  	alignItems: 'center',
  },

  leftIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: RFValue(10),
    borderRadius: RFValue(100),
  },
  compartment: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compartmentTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  compartmentText: {
    fontSize: RFValue(17),
  },

  safeAreaPadding: {
    height: RFValue(30)
  },

  iconText: {
    color: color.white2,
    fontSize: RFValue(19)
  },
});

export default UserAccountHeaderForm;
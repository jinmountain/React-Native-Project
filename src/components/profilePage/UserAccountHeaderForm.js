import React from 'react';
import { 
	View, 
	StyleSheet,
	Text,  
	TouchableOpacity,
	TouchableHighlight,
  Platform,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

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

const headerBoxHeight = sizes.headerBoxHeight;

const UserAccountHeaderForm = ({ 
  userActiveState,
  leftButtonTitle, 
  leftButtonIcon,
  leftButtonPress,
  username, 
  title, 
  firstIcon, 
  secondIcon,
  thirdIcon, 
  firstOnPress, 
  secondOnPress,
  thirdOnPress,
  addPaddingTop,
  paddingTopCustomStyle
}) => {
  const orientation = useOrientation();
	return (
    <View style={styles.headerShadow}>
      {
        addPaddingTop &&
        <View 
          style={
            paddingTopCustomStyle
            ?
            [styles.safeAreaPadding, paddingTopCustomStyle]
            :
            styles.safeAreaPadding
          }
        />
      }
  		<View 
        // style={{ ...styles.accountScreenHeaderContainer, ...{ 
        //   height: orientation === 'LANDSCAPE' ? headerBoxHeight : RFValue(70), 
        //   minHeight: orientation === 'LANDSCAPE' ? headerBoxHeight : RFValue(70), } 
        // }}
        style={styles.accountScreenHeaderContainer}
      >
        <View style={styles.compartmentOuter}>
          <View style={styles.leftCompartmentContainer}>
            <View style={styles.leftCompartmentInnerContainer}>
              {
                leftButtonIcon
                ?
                <TouchableHighlight 
                  style={ 
                    styles.compartmentHighlight 
                  }
                  onPress={leftButtonPress}
                  // deplayPressIn={500}
                  // onPressIn={() => {
                  //   console.log("HAHA");
                  // }}
                  underlayColor={color.grey4}
                >
                  <View style={styles.compartmentIconContainer}>
                    {leftButtonIcon}
                  </View>
                </TouchableHighlight>
                :
                <View style={{ width: RFValue(17) }}/>
              }
              {
                leftButtonTitle &&
                <View style={styles.compartmentTextContainer}>
                  <Text style={styles.compartmentText}>{leftButtonTitle}</Text>
                </View>
              }
              <View style={styles.usernameContainer}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={styles.compartmentText}>{username}</Text>
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
                  <TouchableOpacity 
                    onPress={firstOnPress}
                    style={styles.headerElement}
                  >
                    <Text style={styles.iconText}>{firstIcon}</Text>
                  </TouchableOpacity>
                }
                { secondIcon &&
                  <TouchableOpacity 
                    onPress={secondOnPress}
                    style={styles.headerElement}
                  >
                    <Text style={styles.iconText}>{secondIcon}</Text>
                  </TouchableOpacity>
                }
    						{
                  thirdIcon &&
                  <TouchableOpacity 
                    onPress={thirdOnPress}
                    style={styles.headerElement}
                  >
                    <Text style={styles.iconText}>{thirdIcon}</Text>
                  </TouchableOpacity>
                }
    					</View>
    				</View>
    		  </View>
        </View>
        {/*<HeaderBottomLine />*/}
  		</View>
    </View>
	)
};

const styles = StyleSheet.create({
  headerShadow: {
    backgroundColor: color.white2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // for android
    elevation: 10,
    // for ios
    zIndex: 5,
  },
	accountScreenHeaderContainer: {
    justifyContent: 'center',
    // same % as the header form 
    backgroundColor: '#FFF',
    // ...Platform.select({
    //   android: {
    //     marginTop: '7%',
    //   },
    //   ios: {
    //     marginTop: '11%',
    //   },
    //   default: {
    //     marginTop: '7%',
    //   }
    // })
    height: headerBoxHeight,
  },
  compartmentOuter: {
    flex: 1, 
    justifyContent: 'center'
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
  	flex: 1,
  },
  headerElement: {
  	marginHorizontal: RFValue(3),
  	padding: RFValue(5),
  	borderRadius: RFValue(100),
  	justifyContent: 'center',
  	alignItems: 'center',
  },

  compartmentHighlight: {
    justifyContent: 'center',
    alignItems: 'center',
    width: headerBoxHeight,
    height: headerBoxHeight,
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
    color: color.black1,
    fontSize: RFValue(19)
  },
});

export default UserAccountHeaderForm;
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

// Hooks
import { kOrNo } from '../../hooks/kOrNo';
import { useOrientation } from '../../hooks/useOrientation';

// Components
import HeaderBottomLine from '../../components/HeaderBottomLine';


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
  		<View style={{ ...styles.accountScreenHeaderContainer, ...{ 
        height: orientation === 'LANDSCAPE' ? RFValue(50) : RFValue(70), 
        minHeight: orientation === 'LANDSCAPE' ? RFValue(50) : RFValue(70), } 
      }}>
        <View style={styles.compartmentOuter}>
          <View style={styles.leftCompartmentContainer}>
            {
              leftButtonPress &&
              <View style={styles.leftCompartmentInnerContainer}>
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
                  <View style={styles.compartment}>
                    {
                      leftButtonIcon &&
                      <View style={styles.compartmentIconContainer}>
                        {leftButtonIcon}
                      </View>
                    }
                    {
                      leftButtonTitle &&
                      <View style={styles.compartmentTextContainer}>
                        <Text style={styles.compartmentText}>{leftButtonTitle}</Text>
                      </View>
                    }
                  </View>
                </TouchableHighlight>
              </View>
            }
            <View style={
              leftButtonPress
              ?
              styles.usernameContainer
              :
              [ styles.usernameContainer, { paddingLeft: RFValue(17) } ]
            }>
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

    		  <View style={styles.rightCompartmentContainer}>
    		    <View style={styles.headerCompartmentContainer}>
    					<View style={styles.headerElementsInRow}>
                { firstIcon &&
                  <TouchableOpacity 
                    onPress={firstOnPress}
                    style={styles.headerElement}
                  >
                    {firstIcon}
                  </TouchableOpacity>
                }
                { secondIcon &&
                  <TouchableOpacity 
                    onPress={secondOnPress}
                    style={styles.headerElement}
                  >
                    {secondIcon}
                  </TouchableOpacity>
                }
    						{
                  thirdIcon &&
                  <TouchableOpacity 
                    onPress={thirdOnPress}
                    style={styles.headerElement}
                  >
                    {thirdIcon}
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
    height: RFValue(70),
  },
  compartmentOuter: {
    flex: 1, 
    justifyContent: 'center'
  },
  leftCompartmentContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
  },
  leftCompartmentInnerContainer: {
    paddingLeft: RFValue(65),
    justifyContent: 'center',
    alignItems: 'center',
  },
  usernameContainer: {
    flexDirection: 'row',
  },

  middleCompartmentContainer: {
    position: 'absolute',
    alignSelf: 'center',
  },

  rightCompartmentContainer: {
    position: 'absolute',
    alignSelf: 'flex-end',
    paddingRight: '3%',
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
  	padding: RFValue(3),
  	borderRadius: RFValue(100),
  	justifyContent: 'center',
  	alignItems: 'center',
  },

  compartmentHighlight: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: RFValue(50),
    height: RFValue(50),
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
});

export default UserAccountHeaderForm;
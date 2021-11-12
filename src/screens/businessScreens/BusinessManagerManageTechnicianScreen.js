import React, { useRef, useState } from 'react';
import { 
	Text, 
	View, 
	Button, 
	StyleSheet, 
	TouchableOpacity,
	TouchableHighlight,
	Pressable,
	Dimensions
} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Designs

// Contexts

// Hooks

// Components
import MainTemplate from '../../components/MainTemplate';
import { HeaderForm } from '../../components/HeaderForm';
import HeaderBottomLine from '../../components/HeaderBottomLine';

// Color
import color from '../../color';

// icon
import expoIcons from '../../expoIcons';

const RenderContent = ({ navigation, contentHeight, techId }) => {
  return (
    <View
      style={{
        backgroundColor: color.white2,
        height: contentHeight,
      }}
    >
      <View style={{ 
        height: RFValue(57), 
        // backgroundColor: color.grey7,
        // alignItems: 'center' 
      }}>
        {/*{expoIcons.featherMoreHorizontal(RFValue(27), color.white2)}*/}
        <View style={{
          flexDirection: 'row',
          height: RFValue(57),
          alignItems: 'center',
        }}>
          <View style={{ flex: 1, paddingLeft: RFValue(27) }}>
            <Text>{expoIcons.setting(RFValue(27), color.black1)}</Text>
          </View>
          <TouchableHighlight
            style={{ 
              height: RFValue(50), 
              width: RFValue(50), 
              justifyContent: 'center', 
              alignItems: 'center',
              borderRadius: RFValue(100)
            }}
            onPress={() => {
              navigation.goBack();
            }}
            underlayColor={color.grey4}
          >
            <View>
              {expoIcons.evilIconsClose(RFValue(27), color.black1)}
            </View>
          </TouchableHighlight>
        </View>
      </View>
      <HeaderBottomLine />
      <TouchableOpacity
        onPress={() => {
          // const goBackFirst = new Promise ((res, rej) => {
          //   navigation.goBack();
          //   res();
          // });
          navigation.navigate('SetBusinessHoursStack', {
            screen: 'SetBusinessHours',
            params: { 
              userType: 'tech',
              techId: techId
            }
          });
        }}
        style={styles.bsButtonTouch}
      >
        <View style={styles.bsButton}>
          <Text style={styles.bsButtonText}>Set Schedule</Text>
        </View>
      </TouchableOpacity>
      <HeaderBottomLine />
			<TouchableOpacity
        onPress={() => {
          // const goBackFirst = new Promise ((res, rej) => {
          //   navigation.goBack();
          //   res();
          // });
          navigation.navigate('SetSpecialHoursStack', {
            screen: 'SetSpecialHours',
            params: { 
              userType: 'tech',
              techId: techId
            }
          });
        }}
        style={styles.bsButtonTouch}
      >
        <View style={styles.bsButton}>
          <Text style={styles.bsButtonText}>Add Special Hours</Text>
        </View>
      </TouchableOpacity>
      <HeaderBottomLine />
			<TouchableOpacity
        onPress={() => {

        }}
        style={styles.bsButtonTouch}
      >
        <View style={styles.bsButton}>
          <Text style={styles.bsButtonText}>Visit Profile</Text>
        </View>
      </TouchableOpacity>
      <HeaderBottomLine />
			<TouchableOpacity
        onPress={() => {

        }}
        style={styles.bsButtonTouch}
      >
        <View style={styles.bsButton}>
          <Text style={styles.bsButtonText}>Delete</Text>
        </View>
      </TouchableOpacity>
      <HeaderBottomLine />
    </View>
  )
};

const BusinessManagerManageTechnicianScreen = ({ navigation, route }) => {
	// const [ windowWidth, setWindowWidth ] = useState(Dimensions.get("window").width);
 //  const [ windowHeight, setWindowHeight ] = useState(Dimensions.get("window").height);
  const {
    techId
  } = route.params;
	const sheetRef = useRef(null);
  const [ bottomSheetHeight, setBottomSheetHeight ] = useState(Dimensions.get("window").height * 0.7);
	return (
		<View style={styles.mainContainer}>
			<Pressable 
				style={[
					StyleSheet.absoluteFill,
					{ backgroundColor: 'rgba(0, 0, 0, 0.5)' },
				]}
				onPress={() => { navigation.goBack() }}
			>
			</Pressable>
			<BottomSheet
        ref={sheetRef}
        snapPoints={[bottomSheetHeight, 0, 0]}
        borderRadius={RFValue(10)}
        renderContent={() => {
          return (
            <RenderContent
              navigation={navigation}
              contentHeight={bottomSheetHeight}
              techId={techId}
            />
          )
        }}
        initialSnap={0}
        // allow onPress inside bottom sheet
        enabledContentTapInteraction={false}
        enabledBottomClamp={true}
        onCloseEnd={() => {
          navigation.goBack();
        }}
      />
		</View>
  );
};

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},

	bsButtonTouch: {
    height: RFValue(77),
    justifyContent: 'center',
    alignItems: 'center'
  },
  bsButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bsButtonText: {
    fontSize: RFValue(21),
  },
});

export default BusinessManagerManageTechnicianScreen;
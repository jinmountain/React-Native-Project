import React, { useRef, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Animated,
  Pressable,
  Text, 
  TouchableOpacity,
  TouchableHighlight,
  Dimensions
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import BottomSheet from 'reanimated-bottom-sheet';

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

const RenderContent = ({ 
  navigation, 
  contentHeight,
  requestType,
  rsvId, 
  busId,
  busLocationType,
  busLocality,
  cusId,
  postServiceType
}) => {
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
            <Text>{expoIcons.featherMoreHorizontal(RFValue(27), color.black1)}</Text>
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
          const goBackFirst = new Promise ((res, rej) => {
            navigation.goBack();
            res()
          });
          goBackFirst
          .then(() => {
            navigation.navigate( 
              "DeletionConfirmationScreen", 
              {
                requestType: requestType,
                rsvId: rsvId,
                busId: busId,
                busLocationType: busLocationType,
                busLocality: busLocality,
                cusId: cusId,
                postServiceType: postServiceType
              }
            );
          });
        }}
        style={styles.bsButtonTouch}
      >
        <View style={styles.bsButton}>
          <Text style={styles.bsButtonText}>Cancel Reservation</Text>
        </View>
      </TouchableOpacity>
      <HeaderBottomLine />
      <TouchableOpacity
        style={styles.bsButtonTouch}
      >
        <View style={styles.bsButton}>
          <Text style={styles.bsButtonText}>Share</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
};

const RsvDetailManagerScreen = ({ route, navigation }) => {
  const sheetRef = useRef(null);
  const { 
    requestType,
    rsvId, 
    busId,
    busLocationType,
    busLocality,
    cusId,
    postServiceType
  } = route.params;

  const [ bottomSheetHeight, setBottomSheetHeight ] = useState(RFValue(300));

  return (
    <View style={{ flex: 1 }}>
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
              // for cancel reservation
              requestType={requestType}
              rsvId={rsvId}
              busId={busId}
              busLocationType={busLocationType}
              busLocality={busLocality}
              cusId={cusId}
              postServiceType={postServiceType}
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
  )
};

const styles = StyleSheet.create({
  bsButtonTouch: {
    flex: 1,
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

export default RsvDetailManagerScreen;
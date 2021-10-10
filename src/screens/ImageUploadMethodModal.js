import React from 'react';
import { 
  Text, 
  StyleSheet, 
  TouchableHighlight, 
  View,
  TouchableOpacity
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import useImage from '../hooks/useImage';

const ImageUploadMethodModal = ({ navigation }) => {
  const screen = navigation.getParam('screen');
  const currentUser = navigation.getParam('currentUser');
  const [pickImage] = useImage();

  return (
    <View style={styles.modalScreenContainer}>
      <View style={styles.modalScreenEmpty}>
        <TouchableOpacity style={styles.modalScreenEmptyGoBack} onPress={() => navigation.goBack()}/>
      </View>
      <View style={styles.modalContainer}>
        <View style={styles.buttonsContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTextStyle}>
              Image Upload Methods
            </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign name="closecircleo" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <TouchableHighlight
            style={styles.openButton}
            // pickImage in useImage in hooks
            onPress={() => pickImage(screen, currentUser)}
            underlayColor="#61DAFB"
          >
            <Text style={styles.textStyle}>Open Gallery</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.openButton}
            onPress={() => navigation.navigate('Camera')}
          >
            <Text style={styles.textStyle}>Camera</Text>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalScreenContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  modalScreenEmpty: {
    flex: 4,
  },
  modalScreenEmptyGoBack: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: 2 },
  },
  buttonsContainer: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 10,
    backgroundColor:"#FFFFFF",
    paddingBottom: RFValue(10),
  },
  headerContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    margin: RFValue(10),
  },
  headerTextStyle: {
    fontSize: RFValue(20),
    alignSelf: 'center'
  },
  openButton: {
    backgroundColor: '#F194FF',
    padding: RFValue(10),
    marginVertical: RFValue(6),
    marginHorizontal: RFValue(6),
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    textAlign: 'center',
  },
});

ImageUploadMethodModal.navigationOptions = {
  cardStyle: {
    backgroundColor: 'transparent',
    opacity: 1
  }
};

export default ImageUploadMethodModal;
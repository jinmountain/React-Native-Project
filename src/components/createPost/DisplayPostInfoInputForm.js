import React, { useState } from 'react';
import {
  FlatList,
  Image,
  View,
  ScrollView, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableHighlight,
  Dimensions,
  TouchableOpacity,
  Picker,
} from "react-native";
// TouchableOpacity from rngh works on both ios and android
// import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Video, AVPlaybackStatus } from 'expo-av';

// Components
import DefaultUserPhoto from '../defaults/DefaultUserPhoto';
import { InputFormBottomLine } from '../InputFormBottomLine';

// Designs
import { AntDesign } from '@expo/vector-icons';

// Hooks
import useConvertTime from '../../hooks/useConvertTime';

// Color
import color from '../../color';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const techBoxWidth = windowWidth/3;

const VerticalScrollModal = ({ children }) => {
  return (
    <View style={{ height: '100%', width: '100%' }}>
      <ScrollView>
        {children}
      </ScrollView>
    </View>
  )
};

const VerticalScrollModalButton = ({ label, value, onPress, setModalVisible }) => {
  return (
    <TouchableHighlight
      style={{ height: RFValue(53), justifyContent: 'center', alignItems: 'center', }}
      onPress={() => {
        onPress(value);
        setModalVisible(false);
      }}
      underlayColor={color.grey4}
    >
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: RFValue(17) }}>{label}</Text>
      </View>
    </TouchableHighlight>
  )
};

const ChooseServiceModal = ({ setValue, setModalVisible }) => {
  return (
    <VerticalScrollModal>
      <VerticalScrollModalButton label="Choose Service Type" value={null} onPress={setValue} setModalVisible={setModalVisible} />
      <VerticalScrollModalButton label="Nail" value="nail" onPress={setValue} setModalVisible={setModalVisible} />
      <VerticalScrollModalButton label="Hair" value="hair" onPress={setValue} setModalVisible={setModalVisible} />
      <VerticalScrollModalButton label="Eyelash" value="eyelash" onPress={setValue} setModalVisible={setModalVisible} />
      <VerticalScrollModalButton label="Facial" value="facial" onPress={setValue} setModalVisible={setModalVisible} />
    </VerticalScrollModal>
  )
}

const ChooseTimeModal = ({setValue, setModalVisible}) => {
  return (
    <VerticalScrollModal>
      <VerticalScrollModalButton label="Choose Time" value={null} onPress={setValue} setModalVisible={setModalVisible} />
      <VerticalScrollModalButton label="10 mins" value="10" onPress={setValue} setModalVisible={setModalVisible} />
      <VerticalScrollModalButton label="15 mins" value="15" onPress={setValue} setModalVisible={setModalVisible} />
      <VerticalScrollModalButton label="20 mins" value="20" onPress={setValue} setModalVisible={setModalVisible} />
      <VerticalScrollModalButton label="25 mins" value="25" onPress={setValue} setModalVisible={setModalVisible} />
      <VerticalScrollModalButton label="30 mins" value="30" onPress={setValue} setModalVisible={setModalVisible} />
      <VerticalScrollModalButton label="35 mins" value="35" onPress={setValue} setModalVisible={setModalVisible} />
      <VerticalScrollModalButton label="45 mins" value="45" onPress={setValue} setModalVisible={setModalVisible} />
      <VerticalScrollModalButton label="50 mins" value="50" onPress={setValue} setModalVisible={setModalVisible} />
      <VerticalScrollModalButton label="55 mins" value="55" onPress={setValue} setModalVisible={setModalVisible} />
      <VerticalScrollModalButton label="60 mins" value="60" onPress={setValue} setModalVisible={setModalVisible} />
      <VerticalScrollModalButton label="1 hour 5 mins" value="65" onPress={setValue} setModalVisible={setModalVisible} />
      <VerticalScrollModalButton label="1 hour 10 mins" value="70" onPress={setValue} setModalVisible={setModalVisible} />
      <VerticalScrollModalButton label="1 hour 15 mins" value="75" onPress={setValue} setModalVisible={setModalVisible} />
      <VerticalScrollModalButton label="1 hour 20 mins" value="80" onPress={setValue} setModalVisible={setModalVisible} />
      <VerticalScrollModalButton label="1 hour 25 mins" value="85" onPress={setValue} setModalVisible={setModalVisible} />
      <VerticalScrollModalButton label="1 hour 30 mins" value="90" onPress={setValue} setModalVisible={setModalVisible} />
      <VerticalScrollModalButton label="1 hour 35 mins" value="95" onPress={setValue} setModalVisible={setModalVisible} />
      <VerticalScrollModalButton label="1 hour 40 mins" value="100" onPress={setValue} setModalVisible={setModalVisible} />
      <VerticalScrollModalButton label="1 hour 45 mins" value="105" onPress={setValue} setModalVisible={setModalVisible} />
      <VerticalScrollModalButton label="1 hour 50 mins" value="110" onPress={setValue} setModalVisible={setModalVisible} />
      <VerticalScrollModalButton label="1 hour 55 mins" value="115" onPress={setValue} setModalVisible={setModalVisible} />
      <VerticalScrollModalButton label="2 hours" value="120" onPress={setValue} setModalVisible={setModalVisible} />
    </VerticalScrollModal>
  )
};

const DisplayPostInfoInputForm = ({ 
  postPrice,
  setPostPrice,
  postETC,
  setPostETC,
  currentTechs,
  selectedTechs,
  setSelectedTechs,
  postTitle,
  setPostTitle,
  postService,
  setPostService,
}) => {
  const [ clickedAll, setClickedAll ] = useState(false);
  const [ modalVisible,setModalVisible ] = useState(false);
  return (
    modalVisible === 'time'
    ?
    <ChooseTimeModal setValue={setPostETC} setModalVisible={setModalVisible} />
    : modalVisible === 'service'
    ?
    <ChooseServiceModal setValue={setPostService} setModalVisible={setModalVisible} />
    :
    <View style={styles.infoInputFormContainer}>
      <InputFormBottomLine />
      <View style={styles.inputFormContainer}>
        { postService 
          ?
          <View style={styles.textInputLabelContainer}>
            <View style={styles.textInputLabelInner}>
              <View style={styles.textInputLabelInnerIcon}>
                <AntDesign name="clockcircleo" size={RFValue(11)} color={color.black1} />
              </View>
              <Text style={styles.textInputLabelText}>Service Type</Text>
            </View>
          </View>
          : null
        }
        <TouchableOpacity
          onPress={() => {
            setModalVisible('service');
            setPostETC(null);
          }}
        >
          <View>
            {
              postService
              ?
              <View style={styles.timeInputContainer}>
                <Text style={styles.timeInputText}>{postService}</Text>
              </View>
              :
              <View style={styles.timeInputContainer}>
                <Text style={styles.timeInputText}>Choose Service Type</Text>
              </View>
            }
          </View>
        </TouchableOpacity>
      </View>
      <InputFormBottomLine />
      <View style={styles.inputFormContainer}>
        { postTitle 
          ? 
          <View style={styles.textInputLabelContainer}>
            <Text style={styles.textInputLabelText}>Title</Text>
          </View>
          : null
        }
        <TextInput 
          style={styles.titleInput}
          value={postTitle} 
          onChangeText={setPostTitle} 
          placeholderTextColor={color.grey3}
          placeholder="Title"
          multiline={false}
          maxLength={50}
          autoCapitalize="none"
          autoCorrect={false}
          underlineColorAndroid="transparent"
        />
      </View>
      <InputFormBottomLine />
      <View style={styles.inputFormContainer}>
        { postPrice 
          ? 
          <View style={styles.textInputLabelContainer}>
            <Text style={styles.textInputLabelText}>Price</Text>
          </View>
          : null
        }
        <View style={styles.priceInputContainer}>
          <View style={styles.currencyTag}>
            <Text style={styles.currencyText}>$</Text>
          </View>
          <TextInput 
            style={styles.priceInput}
            value={postPrice}
            onChangeText={setPostPrice}
            placeholderTextColor={color.grey3}
            placeholder={"Price"}
            spellCheck={false}
            multiline={false}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
        </View>
      </View>
      <InputFormBottomLine />
      <View style={styles.inputFormContainer}>
        { postETC 
          ? 
          <View style={styles.textInputLabelContainer}>
            <View style={styles.textInputLabelInner}>
              <View style={styles.textInputLabelInnerIcon}>
                <AntDesign name="clockcircleo" size={RFValue(11)} color={color.black1} />
              </View>
              <Text style={styles.textInputLabelText}>Time</Text>
            </View>
          </View>
          : null
        }
        <TouchableOpacity
          onPress={() => {
            setModalVisible('time');
            setPostETC(null);
          }}
        >
          <View>
            {
              postETC
              ?
              <View style={styles.timeInputContainer}>
                <Text style={styles.timeInputText}>{useConvertTime.convertEtcToHourMin(postETC)}</Text>
              </View>
              :
              <View style={styles.timeInputContainer}>
                <Text style={styles.timeInputText}>Choose Time</Text>
              </View>
            }
          </View>
        </TouchableOpacity>
      </View>
      <InputFormBottomLine />
      <View style={styles.pickTechLabelContainer}>
        <Text style={styles.pickTechLabelText}>
          Pick the best technicians for the display post
        </Text>
      </View>

      <View style={styles.pickTechContainerOuter}>
      {
        currentTechs.length > 0
        ?
        <View style={styles.pickTechContainer}>
          { 
            clickedAll
            ?
            <TouchableOpacity 
              onPress={() => {
                setSelectedTechs([]);
                setClickedAll(!clickedAll);
              }}
              style={styles.pickAllTechs}
            >
              <View>
                <AntDesign name="check" size={RFValue(27)} color={color.red2} />
              </View>
            </TouchableOpacity>
            :
            <TouchableOpacity 
              onPress={() => {
                let i;
                let currentTechsId = [];
                for (i = 0; i < currentTechs.length; i++) {
                  currentTechsId.push(currentTechs[i].techData.id);
                }
                setSelectedTechs(currentTechsId);
                setClickedAll(!clickedAll);
              }}
              style={styles.pickAllTechs}
            >
              <View>
                <Text>
                  ALL
                </Text>
              </View>
            </TouchableOpacity>
          }
          
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={currentTechs}
            keyExtractor={(tech, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity 
                  onPress={() => {
                    console.log(item.techData.id);
                    if (selectedTechs.includes(item.techData.id)) {
                      setSelectedTechs([
                        ...selectedTechs.filter((techId) => techId !== item.techData.id)
                      ])
                    } else {
                      setSelectedTechs([...selectedTechs, item.techData.id]);
                    }
                  }}
                  style={styles.techContainer}
                >
                  <View style={styles.techInnerContainer}>
                    { 
                      item.techData.photoURL
                      ?
                      <Image style={styles.techImage} source={{ uri: item.techData.photoURL }}/>
                      : 
                      <DefaultUserPhoto 
                        customSizeBorder={RFValue(57)}
                        cutomSizeUserIcon={RFValue(37)}
                      />
                    }
                    <View style={styles.techInfoContainer}>
                      <Text style={styles.techUsernameText}>
                        {item.techData.username}
                      </Text>
                    </View>
                  </View>
                  { 
                    selectedTechs.includes(item.techData.id)
                    ?
                    <View style={styles.chosenStatus}>
                      <View style={styles.chosenShadow}>
                      
                      </View>
                      <View style={styles.chosenCheck}>
                        <AntDesign name="checkcircle" size={RFValue(23)} color={color.red2} />
                      </View>
                    </View>
                    : null
                  }
                  
                </TouchableOpacity>
              )
            }}
          />
        </View>
        :
        <View style={styles.techDefaultContainer}>
          <Text>Your technicians are not found</Text>
        </View>
      }
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  infoInputFormContainer: {
    justifyContent: 'center',
  },
  labelContainer: {
    marginRight: RFValue(7),
  },
  priceInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  currencyTag: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencyText: {
    fontSize: RFValue(17),
  },
  priceInput: {
    fontSize: RFValue(17),
    paddingHorizontal: RFValue(17),
  },
  labelText: {
    fontSize: RFValue(19),
  },
  picker: {
    height: RFValue(50),
    width: RFValue(177),
  },
  pickTechLabelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: RFValue(13),
    paddingVertical: RFValue(3),
  },
  pickTechLabelText: {
    fontWeight: 'bold',
    fontSize: RFValue(15),
  },
  pickTechContainer: {
    height: techBoxWidth,
    flexDirection: 'row',
    width: '100%',
  },
  pickAllTechs: {
    width: RFValue(57),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.grey1,
  },

  pickTechContainerOuter: {
    width: '100%',
    height: techBoxWidth,
  },
  techDefaultContainer: {
    width: '100%',
    height: techBoxWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  techContainer: {
    height: techBoxWidth, 
    width: techBoxWidth, 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(3),
  },
  techImage: {
    height: RFValue(57),
    width: RFValue(57),
    borderRadius: RFValue(100),
  },
  techInnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  techInfoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: RFValue(3),
  },
  techUsernameText: {
    fontSize: RFValue(15),
  },

  chosenStatus: {
    flex: 1, 
    height: techBoxWidth, 
    width: techBoxWidth, 
    position: 'absolute', 
  },
  chosenShadow: {
    flex: 1, 
    height: techBoxWidth, 
    width: techBoxWidth, 
    position: 'absolute', 
    backgroundColor: color.black1, 
    opacity: 0.1 
  },
   chosenCheck: {
    flex: 1, 
    position: 'absolute', 
    height: techBoxWidth, 
    width: techBoxWidth, 
    justifyContent: 'center', 
    alignItems: 'center'
  },

  // Title
  inputFormContainer: {
    height: RFValue(67),
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputLabelContainer: {
    minHeight: RFValue(25),
  },
  textInputLabelInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputLabelInnerIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(3),
  },
  textInputLabelText: {
    fontSize: RFValue(13),
    color: color.grey3,
  },
  titleInput: {
    fontSize: RFValue(17),
    paddingHorizontal: 10,
  },

  // Time Input
  timeInputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeInputText: {
    fontSize: RFValue(17),
  },
});

export default DisplayPostInfoInputForm;
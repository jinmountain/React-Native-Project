import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View,
  ScrollView, 
  Text,
  Switch,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import MainTemplate from '../../components/MainTemplate';
import HeaderBottomLine from '../../components/HeaderBottomLine';
import { HeaderForm } from '../../components/HeaderForm';

// Design

// Hooks

// color
import color from '../../color';

// icon
import expoIcons from '../../expoIcons';

const checkOpensEarlierThanCloses = (opens, closes) => {
  return new Promise ((res, rej) => {
    // covert to military hour
    let opensHour;
    let closesHour;

    if (opens.meridiem === 'PM') {
      if (opens.hour === 12) {
        opensHour = 12;
      } else {
        opensHour = opens.hour + 12;
      }
    } 
    if (opens.meridiem === 'AM') {
      if (opens.hour === 12) {
        opensHour = 0;
      } else {
        opensHour = opens.hour;
      }
    }

    if (closes.meridiem === 'PM') {
      if (closes.hour === 12) {
        closesHour = 12;
      } else {
        closesHour = closes.hour + 12;
      }
    } 
    if (closes.meridiem === 'AM') {
      if (closes.hour === 12) {
        closesHour = 0;
      } else {
        closesHour = closes.hour;
      }
    }

    console.log("closesHour: ", closesHour, "opensHour: ", opensHour);

    if (closesHour > opensHour) {
      res(true);
    };

    if (closes.hour === opens.hour) {
      if (closes.min > opens.min) {
        res(true);
      } else {
        res(false);
      }
    }
  });
}

const SetHourButton = ({ buttonText, onPress, currentValue, conditionalValue }) => {
  return (
    <TouchableHighlight
      style={
        currentValue === conditionalValue
        ?
        [ styles.setHourButtonContainer, { backgroundColor: color.red2 }]
        :
        styles.setHourButtonContainer
      }
      onPress={onPress}
      underlayColor={color.grey4}
    >
      <View style={styles.buttonTextContainer}>
        <Text style={
          styles.buttonText
        }>
          {buttonText}
        </Text>
      </View>
    </TouchableHighlight>
  )
}

const UBSetHoursScreen = ({ navigation, route }) => {
  const { dayType } = route.params;

  const [ startHour, setStartHour ] = useState(null);
  const [ startMin, setStartMin ] = useState(null);
  const [ startMeridiem, setStartMeridiem ] = useState('AM');

  const [ endHour, setEndHour ] = useState(null);
  const [ endMin, setEndMin ] = useState(null);
  const [ endMeridiem, setEndMeridiem ] = useState('PM');

  const [ hoursReady, setHoursReady ] = useState(false);

  useEffect(() => {
    if (
      startHour &&
      startMin !== null &&
      startMeridiem &&
      endHour &&
      endMin !== null &&
      endMeridiem
    ) {
      const startHours = {
        hour: startHour,
        min: startMin,
        meridiem: startMeridiem
      };

      const endHours = {
        hour: endHour,
        min: endMin,
        meridiem: endMeridiem
      };

      checkOpensEarlierThanCloses(startHours, endHours)
      .then((result) => {
        // result is true when its opens is earlier
        console.log(result);
        setHoursReady(result);
      })
    }
  }, [startHour, startMin, startMeridiem, endHour, endMin, endMeridiem]);

  return (
    <MainTemplate>
      <View style={styles.mainContainer}>
        <HeaderForm 
          leftButtonTitle={"Cancel"}
          leftButtonIcon={null}
          headerTitle={"Hours"} 
          rightButtonTitle={"Save"} 
          leftButtonPress={() => {
            navigation.goBack();
          }}
          rightButtonPress={() => {
            console.log("save");
          }}
        />
        <View style={styles.timeContainer}>
          <View style={styles.labelContainer}>
            <View style={styles.labelTitleContainer}>
              <Text style={styles.labelText}>Opens</Text>
            </View>
            {
              startHour && startMin !== null && startMeridiem
              ?
              <View style={styles.labelTimeContainer}>
                <Text style={styles.labelTimeText}>{startHour} : {startMin < 10 ? `0${startMin}` : startMin} {startMeridiem}</Text>
              </View>
              : null
            }
          </View>
          <View style={styles.startTimeContainer}>
            <View style={styles.hourContainer}>
              <ScrollView fadingEdgeLength={100}>
                <SetHourButton
                  buttonText={"12"}
                  onPress={() => {
                    setStartHour(12);
                  }}
                  currentValue={startHour}
                  conditionalValue={12}
                />
                <SetHourButton
                  buttonText={"1"}
                  onPress={() => {
                    setStartHour(1);
                  }}
                  currentValue={startHour}
                  conditionalValue={1}
                />
                <SetHourButton
                  buttonText={"2"}
                  onPress={() => {
                    setStartHour(2);
                  }}
                  currentValue={startHour}
                  conditionalValue={2}
                />
                <SetHourButton
                  buttonText={"3"}
                  onPress={() => {
                    setStartHour(3);
                  }}
                  currentValue={startHour}
                  conditionalValue={3}
                />
                <SetHourButton
                  buttonText={"4"}
                  onPress={() => {
                    setStartHour(4);
                  }}
                  currentValue={startHour}
                  conditionalValue={4}
                />
                <SetHourButton
                  buttonText={"5"}
                  onPress={() => {
                    setStartHour(5);
                  }}
                  currentValue={startHour}
                  conditionalValue={5}
                />
                <SetHourButton
                  buttonText={"6"}
                  onPress={() => {
                    setStartHour(6);
                  }}
                  currentValue={startHour}
                  conditionalValue={6}
                />
                <SetHourButton
                  buttonText={"7"}
                  onPress={() => {
                    setStartHour(7);
                  }}
                  currentValue={startHour}
                  conditionalValue={7}
                />
                <SetHourButton
                  buttonText={"8"}
                  onPress={() => {
                    setStartHour(8);
                  }}
                  currentValue={startHour}
                  conditionalValue={8}
                />
                <SetHourButton
                  buttonText={"9"}
                  onPress={() => {
                    setStartHour(9);
                  }}
                  currentValue={startHour}
                  conditionalValue={9}
                />
                <SetHourButton
                  buttonText={"10"}
                  onPress={() => {
                    setStartHour(10);
                  }}
                  currentValue={startHour}
                  conditionalValue={10}
                />
                <SetHourButton
                  buttonText={"11"}
                  onPress={() => {
                    setStartHour(11);
                  }}
                  currentValue={startHour}
                  conditionalValue={11}
                />
              </ScrollView>
            </View>
            <View style={styles.minContainer}>
              <ScrollView fadingEdgeLength={100}>
                <SetHourButton
                  buttonText={"0"}
                  onPress={() => {
                    setStartMin(0);
                  }}
                  currentValue={startMin}
                  conditionalValue={0}
                />
                <SetHourButton
                  buttonText={"15"}
                  onPress={() => {
                    setStartMin(15);
                  }}
                  currentValue={startMin}
                  conditionalValue={15}
                />
                <SetHourButton
                  buttonText={"30"}
                  onPress={() => {
                    setStartMin(30);
                  }}
                  currentValue={startMin}
                  conditionalValue={30}
                />
                <SetHourButton
                  buttonText={"45"}
                  onPress={() => {
                    setStartMin(45);
                  }}
                  currentValue={startMin}
                  conditionalValue={45}
                />
              </ScrollView>
            </View>
            <View style={styles.meridiemContainer}>
              <ScrollView 
                fadingEdgeLength={100}
                contentContainerStyle={styles.buttonScrollView}
              >
                <SetHourButton
                  buttonText={"AM"}
                  onPress={() => {
                    setStartMeridiem('AM');
                  }}
                  currentValue={startMeridiem}
                  conditionalValue={'AM'}
                />
                <SetHourButton
                  buttonText={"PM"}
                  onPress={() => {
                    setStartMeridiem('PM');
                  }}
                  currentValue={startMeridiem}
                  conditionalValue={'PM'}
                />
              </ScrollView>
            </View>
          </View>
          <View style={styles.labelContainer}>
            <View style={styles.labelTimeContainer}>
              <Text style={styles.labelText}>Closes</Text>
            </View>
            {
              endHour && endMin !== null && endMeridiem
              ?
              <View style={styles.labelTimeContainer}>
                <Text style={styles.labelTimeText}>
                  {endHour} : {endMin < 10 ? `0${endMin}` : endMin} {endMeridiem}
                </Text>
              </View>
              : null
            }
          </View>
          <View style={styles.endTimeContainer}>
            <View style={styles.hourContainer}>
              <ScrollView fadingEdgeLength={100}>
                <SetHourButton
                  buttonText={"12"}
                  onPress={() => {
                    setEndHour(12);
                  }}
                  currentValue={endHour}
                  conditionalValue={12}
                />
                <SetHourButton
                  buttonText={"1"}
                  onPress={() => {
                    setEndHour(1);
                  }}
                  currentValue={endHour}
                  conditionalValue={1}
                />
                <SetHourButton
                  buttonText={"2"}
                  onPress={() => {
                    setEndHour(2);
                  }}
                  currentValue={endHour}
                  conditionalValue={2}
                />
                <SetHourButton
                  buttonText={"3"}
                  onPress={() => {
                    setEndHour(3);
                  }}
                  currentValue={endHour}
                  conditionalValue={3}
                />
                <SetHourButton
                  buttonText={"4"}
                  onPress={() => {
                    setEndHour(4);
                  }}
                  currentValue={endHour}
                  conditionalValue={4}
                />
                <SetHourButton
                  buttonText={"5"}
                  onPress={() => {
                    setEndHour(5);
                  }}
                  currentValue={endHour}
                  conditionalValue={5}
                />
                <SetHourButton
                  buttonText={"6"}
                  onPress={() => {
                    setEndHour(6);
                  }}
                  currentValue={endHour}
                  conditionalValue={6}
                />
                <SetHourButton
                  buttonText={"7"}
                  onPress={() => {
                    setEndHour(7);
                  }}
                  currentValue={endHour}
                  conditionalValue={7}
                />
                <SetHourButton
                  buttonText={"8"}
                  onPress={() => {
                    setEndHour(8);
                  }}
                  currentValue={endHour}
                  conditionalValue={8}
                />
                <SetHourButton
                  buttonText={"9"}
                  onPress={() => {
                    setEndHour(9);
                  }}
                  currentValue={endHour}
                  conditionalValue={9}
                />
                <SetHourButton
                  buttonText={"10"}
                  onPress={() => {
                    setEndHour(10);
                  }}
                  currentValue={endHour}
                  conditionalValue={10}
                />
                <SetHourButton
                  buttonText={"11"}
                  onPress={() => {
                    setEndHour(11);
                  }}
                  currentValue={endHour}
                  conditionalValue={11}
                />
              </ScrollView>
            </View>
            <View style={styles.minContainer}>
              <ScrollView fadingEdgeLength={100}>
                <SetHourButton
                  buttonText={"0"}
                  onPress={() => {
                    setEndMin(0);
                  }}
                  currentValue={endMin}
                  conditionalValue={0}
                />
                <SetHourButton
                  buttonText={"15"}
                  onPress={() => {
                    setEndMin(15);
                  }}
                  currentValue={endMin}
                  conditionalValue={15}
                />
                <SetHourButton
                  buttonText={"30"}
                  onPress={() => {
                    setEndMin(30);
                  }}
                  currentValue={endMin}
                  conditionalValue={30}
                />
                <SetHourButton
                  buttonText={"45"}
                  onPress={() => {
                    setEndMin(45);
                  }}
                  currentValue={endMin}
                  conditionalValue={45}
                />
              </ScrollView>
            </View>
            <View style={styles.meridiemContainer}>
              <ScrollView fadingEdgeLength={100}>
                <SetHourButton
                  buttonText={"AM"}
                  onPress={() => {
                    setEndMeridiem('AM');
                  }}
                  currentValue={endMeridiem}
                  conditionalValue={'AM'}
                />
                <SetHourButton
                  buttonText={"PM"}
                  onPress={() => {
                    setEndMeridiem('PM');
                  }}
                  currentValue={endMeridiem}
                  conditionalValue={'PM'}
                />
              </ScrollView>
            </View>
          </View>
        </View>
        <TouchableHighlight
          style={
            hoursReady
            ?
            [ styles.saveHourButtonContainer, { backgroundColor: color.red2 }]
            : styles.saveHourButtonContainer
          }
          underlayColor={color.grey4}
          onPress={() => {
            if (hoursReady) {
              let militaryStartHour;
              let militaryEndHour;

              if (startMeridiem === 'AM') {
                if (startHour === 12) {
                  militaryStartHour = 0
                } else {
                  militaryStartHour = startHour
                }
              }
              if (startMeridiem === 'PM') {
                militaryStartHour = startHour + 12
              }

              if (endMeridiem === 'AM') {
                if (endHour === 12) {
                  militaryEndHour = 0
                } else {
                  militaryEndHour = endHour;
                }
              } 
              if (endMeridiem === 'PM') {
                militaryEndHour = endHour + 12;
              }
              console.log(militaryEndHour);
              navigation.navigate('UBSetBusinessHours', {
                newHours: {
                  opens: {
                    hour: militaryStartHour,
                    min: startMin
                  },
                  closes: {
                    hour: militaryEndHour,
                    min:  endMin
                  }
                },
                dayType: dayType
              })
            }
          }}
        >
          <View style={styles.saveTextContainer}>
            <Text style={styles.saveText}>Save</Text>
          </View>
        </TouchableHighlight>
      </View>
    </MainTemplate>
  )
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: color.white2
  },

  timeContainer: {
    flex: 1,
  },

  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: RFValue(30),
    paddingLeft: RFValue(15),
    justifyContent: 'space-between'
  },
  labelTitleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelText: {
    fontSize: RFValue(20),
  },
  labelTimeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: RFValue(30)
  },
  labelTimeText: {
    fontSize: RFValue(20),
  },

  startTimeContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  endTimeContainer: {
    flexDirection: 'row',
    flex: 1
  },

  hourContainer: {
    flex: 1,
  },
  minContainer: {
    flex: 1,
  },
  meridiemContainer: {
    width: RFValue(70)
  },

  setHourButtonContainer: {
    height: RFValue(57),
  },
  saveHourButtonContainer: {
    borderRadius: RFValue(30),
    backgroundColor: color.grey1,
    height: RFValue(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: {
    color: color.white2,
    fontSize: RFValue(25),
    fontWeight: 'bold'
  },

  buttonTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  buttonText: {
    fontSize: RFValue(17),
    fontWeight: 'bold'
  },

  buttonScrollView: {

  },
});

export default UBSetHoursScreen;
import React, { useState, useEffect, useContext } from 'react';
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

// firebase
import businessUpdateFire from '../../firebase/businessUpdateFire';

// Context
import { Context as AuthContext } from '../../context/AuthContext';

// Hooks
import useConvertTime from '../../hooks/useConvertTime';

// color
import color from '../../color';

// icon
import expoIcons from '../../expoIcons';

const SettingHoursDayContainer = ({ navigation, dayText, dayOpen, setDayOpen, hours, dayType, setHours }) => {
  return (
    <View style={styles.settingContainer}>
      <View style={styles.settingTopContainer}>
        <View style={styles.dayContainer}>
          <View style={styles.clockIconContainer}>
            {expoIcons.clockIcon(RFValue(20), color.black1)}
          </View>
          <View style={styles.dayTextContainer}>
            <Text style={styles.dayText}>{dayText}</Text>
          </View>
        </View>
        <View style={styles.switchContainer}>
          <View style={styles.onOffStatusConatiner}>
            { dayOpen === false
              ? <Text style={[styles.onOffText, { color: color.grey8 }]}>Closed</Text>
              : <Text style={[styles.onOffText, { color: color.red2 }]}>Open</Text>
            }
          </View>
          <Switch
            trackColor={{ false: color.grey8, true: color.red2 }}
            thumbColor={dayOpen ? '#f4f3f4' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setDayOpen}
            value={dayOpen}
          />
        </View>
      </View>
      {
        dayOpen &&
        <View style={styles.settingBottomContainer}>
          {
            // newHours: {
            //  opens: {
            //    hour: militaryStartHour,
            //    min: startMin
            //  },
            //  closes: {
            //    hour: militaryEndHour,
            //    min:  endMin
            //  }
            // }
            hours.map(( item, index ) => {
              return (

                  <View 
                    key={index}
                    style={styles.addNewHoursContainer}
                  >
                    <View style={styles.startContainer}>
                      <View style={styles.timeLabelContainer}>
                        <Text style={styles.timelabelText}>
                          Opens
                        </Text>
                      </View>
                      <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>
                          {useConvertTime.convertMilitaryToStandard(item.opens.hour, item.opens.min)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.crossContainer}>
                      <View 
                        style={[styles.cross, { transform: [{ rotate: "-25deg" }], marginTop: RFValue(1.5) }]} 
                      />
                      <View
                        style={[styles.cross, { transform: [{ rotate: "25deg" }], marginTop: RFValue(26.5) }]}
                      />
                    </View>
                    <View style={styles.endContainer}>
                      <View style={styles.timeLabelContainer}>
                        <Text style={styles.timelabelText}>
                          Closes
                        </Text>
                      </View>
                      <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>
                          {useConvertTime.convertMilitaryToStandard(item.closes.hour, item.closes.min)}
                        </Text>
                      </View>
                    </View>
                    <TouchableHighlight
                      style={styles.deleteHoursButton}
                      onPress={() => {
                        console.log('delete');
                        setHours([ ...hours.filter((hour) => hour !== item ) ]) 
                      }}
                      underlayColor={color.grey4}
                    >
                      <View style={styles.addButtonTextContainer}>
                        <Text style={styles.addButtonText}>{expoIcons.antClose(RFValue(23), color.black1)}</Text>
                      </View>
                    </TouchableHighlight>
                  </View>
              )
            })
          }
          <TouchableHighlight
            style={styles.addOpenHoursButtonContainer}
            onPress={() => {
              navigation.navigate("UBSetHours", {
                dayType: dayType
              })
            }}
            underlayColor={color.grey4}
          >
            <View style={styles.addOpenHoursButtonInner}>
              <View style={styles.addOpenHoursIconContainer}>
                {expoIcons.featherPlus(RFValue(19), color.red2)}
              </View>
              <View style={styles.addOpenHoursTextContainer}>
                <Text style={styles.addOpenHoursText}>Add open hours</Text>
              </View>
            </View>
          </TouchableHighlight>
        </View>
      }
    </View>
  )
}

const UBSetBusinessHoursScreen = ({ route, navigation }) => {
  const { 
    state: {
      user
    }
  } = useContext(AuthContext);
  const [ businessHours, setBusinessHours ] = useState(user.business_hours ? user.business_hours : []); // business user's business hours
  // businessHours structure
  // [
  //   [ boolean, boolean, ... ] all the days
  //   // sun
  //   [ 
  //     hour: number,
  //     min: number
  //   ],
  //   [
  //   // mon
  //     hour: number,
  //     min: number
  //   ],
  //   // ...
  // ]
  const [ sunOpen, setSunOpen ] = useState(false);
  const [ sunHours, setSunHours ] = useState([]);
  const [ monOpen, setMonOpen ] = useState(false);
  const [ monHours, setMonHours ] = useState([]);
  const [ tueOpen, setTueOpen ] = useState(false);
  const [ tueHours, setTueHours ] = useState([]);
  const [ wedOpen, setWedOpen ] = useState(false);
  const [ wedHours, setWedHours ] = useState([]);
  const [ thuOpen, setThuOpen ] = useState(false);
  const [ thuHours, setThuHours ] = useState([]);
  const [ friOpen, setFriOpen ] = useState(false);
  const [ friHours, setFriHours ] = useState([]);
  const [ satOpen, setSatOpen ] = useState(false);
  const [ satHours, setSatHours ] = useState([]);

  const [ readyToSave, setReadyToSave ] = useState(false);

  const { 
    newHours,
    dayType
  } = route.params;

  useEffect(() => {
    if (newHours && dayType) {
      if (dayType === 'sun') {
        setSunHours([ ...sunHours, newHours ]);
        navigation.setParams({ 
          newHours: null, 
          dayType: null, 
        });
      }
    }
  }, [newHours]);

  // detect hours change and set readyToSave to true
  // useEffect(() => {
  //   if (businessHours === [sunHours, monHours]) {
  //     setReadyToSave(true);
  //   }
  // }, [sunHours, monHours]);

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
            const newBusinessHours = [
              [ sunOpen, monOpen, tueOpen, wedOpen, thuOpen, friOpen, satOpen ],
              sunHours, 
              monHours,
              tueHours,
              wedHours,
              thuHours,
              friHours,
              satHours,
            ];

            if (businessHours === newBusinessHours) {
              console.log('nothing to save');
            } else {
              businessUpdateFire.busUserUpdate({
                business_hours: newBusinessHours
              });
              console.log("ready to save");
            }
          }}
        />
        <ScrollView>
          <SettingHoursDayContainer
            navigation={navigation} 
            dayText={"Sunday"}
            dayOpen={sunOpen}
            setDayOpen={setSunOpen}
            hours={sunHours}
            dayType={'sun'}
            setHours={setSunHours}
          />
          <SettingHoursDayContainer
            navigation={navigation} 
            dayText={"Monday"}
            dayOpen={monOpen}
            setDayOpen={setMonOpen}
            hours={monHours}
            dayType={'mon'}
            setHours={setMonHours}
          />
          <SettingHoursDayContainer
            navigation={navigation} 
            dayText={"Tuesday"}
            dayOpen={tueOpen}
            setDayOpen={setTueOpen}
            hours={tueHours}
            dayType={'tue'}
            setHours={setTueHours}
          />
          <SettingHoursDayContainer
            navigation={navigation} 
            dayText={"Wednesday"}
            dayOpen={wedOpen}
            setDayOpen={setWedOpen}
            hours={wedHours}
            dayType={'wed'}
            setHours={setWedHours}
          />
          <SettingHoursDayContainer
            navigation={navigation} 
            dayText={"Thursday"}
            dayOpen={thuOpen}
            setDayOpen={setThuOpen}
            hours={thuHours}
            dayType={'thu'}
            setHours={setThuHours}
          />
          <SettingHoursDayContainer
            navigation={navigation} 
            dayText={"Friday"}
            dayOpen={friOpen}
            setDayOpen={setFriOpen}
            hours={friHours}
            dayType={'fri'}
            setHours={setFriHours}
          />
          <SettingHoursDayContainer
            navigation={navigation} 
            dayText={"Saturday"}
            dayOpen={satOpen}
            setDayOpen={setSatOpen}
            hours={satHours}
            dayType={'sat'}
            setHours={setSatHours}
          />
        </ScrollView>
      </View>
    </MainTemplate>
  )
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: color.white2
  },

  settingContainer: {
    backgroundColor: color.white2,
  },
  settingTopContainer: {
    flexDirection: 'row',
    height: RFValue(57),
  },
  settingBottomContainer: {
    backgroundColor: color.white2,
  },

  dayContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  clockIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: RFValue(50),
  },
  dayTextContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  dayText: {
    fontSize: RFValue(19),
    fontWeight: 'bold'
  },

  switchContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: RFValue(7),
  },
  onOffStatusConatiner: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(7),
  },
  onOffText: {
    fontWeight: 'bold',
    fontSize: RFValue(15),
  },

  addOpenHoursButtonContainer: {
    height: RFValue(57),
    justifyContent: 'center',
    paddingLeft: RFValue(50)
  },
  addOpenHoursButtonInner: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  addOpenHoursIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addOpenHoursTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addOpenHoursText: {
    fontSize: RFValue(19),
    color: color.red2
  },

  addNewHoursContainer: {
    height: RFValue(57),
    alignItems: 'center',
    paddingLeft: RFValue(50),
    flexDirection: 'row',
  },
  startContainer: {
    flex: 1,
  },
  endContainer: {
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeLabelContainer: {
    justifyContent: 'center'
  },
  timeLabelText: {
    fontSize: RFValue(17)
  },
  timeText: {
    fontSize: RFValue(19)
  },

  deleteHoursButton: {
    height: RFValue(57),
    width: RFValue(57),
    justifyContent: 'center',
    alignItems: 'center'
  },
  addButtonTextContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  addButtonText: {
    fontSize: RFValue(17)
  },

  setHoursContainer: {
    position: 'absolute'
  },
  crossContainer: {
    width: RFValue(57),
    height: RFValue(57),
    alignItems: "center",
  },
  cross: {
    position: 'absolute',
    width: RFValue(1),
    height: RFValue(28.5),
    backgroundColor: color.black1,
  },
});

export default UBSetBusinessHoursScreen;
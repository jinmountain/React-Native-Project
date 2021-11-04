// developer summary
// ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
// this screen is for a business to change its business hours.
// if they make any change and click save a two button alert 
// will pop and ask again to confirm.

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
import TwoButtonAlert from '../../components/TwoButtonAlert';

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
  
  const [ showTba, setShowTba ] = useState(false);

  const [ businessHours, setBusinessHours ] = useState(user.business_hours ? user.business_hours : null); // business user's business hours
  // businessHours structure
  // [
  //   {
  //      sun_open: boolean,
  //      mon_open: boolean,
  //      ...
  //      sat_open: boolean,
  //      sun_hours: array,
  //      mon_hours: array,
  //      ...
  //      sat_hours: array
  //   } 

  //   sun_hours example below
  //   [ 
  //     {
  //       opens: {
  //         hour: militaryStartHour,
  //         min: startMin
  //       },
  //       closes: {
  //         hour: militaryEndHour,
  //         min:  endMin
  //       }
  //     }
  //   ]

  const [ sunOpen, setSunOpen ] = useState(user.business_hours && user.business_hours.sun_open ? user.business_hours.sun_open : false );
  const [ sunHours, setSunHours ] = useState(user.business_hours && user.business_hours.sun_hours ? user.business_hours.sun_hours : []);
  const [ monOpen, setMonOpen ] = useState(user.business_hours && user.business_hours.mon_open ? user.business_hours.mon_open : false);
  const [ monHours, setMonHours ] = useState(user.business_hours && user.business_hours.mon_hours ? user.business_hours.mon_hours : []);
  const [ tueOpen, setTueOpen ] = useState(user.business_hours && user.business_hours.tue_open ? user.business_hours.tue_open : false);
  const [ tueHours, setTueHours ] = useState(user.business_hours && user.business_hours.tue_hours ? user.business_hours.tue_hours : []);
  const [ wedOpen, setWedOpen ] = useState(user.business_hours && user.business_hours.wed_open ? user.business_hours.wed_open : false);
  const [ wedHours, setWedHours ] = useState(user.business_hours && user.business_hours.wed_hours ? user.business_hours.wed_hours : []);
  const [ thuOpen, setThuOpen ] = useState(user.business_hours && user.business_hours.thu_open ? user.business_hours.thu_open : false);
  const [ thuHours, setThuHours ] = useState(user.business_hours && user.business_hours.thu_hours ? user.business_hours.thu_hours : []);
  const [ friOpen, setFriOpen ] = useState(user.business_hours && user.business_hours.fri_open ? user.business_hours.fri_open : false);
  const [ friHours, setFriHours ] = useState(user.business_hours && user.business_hours.fri_hours ? user.business_hours.fri_hours : []);
  const [ satOpen, setSatOpen ] = useState(user.business_hours && user.business_hours.sat_open ? user.business_hours.sat_open : false);
  const [ satHours, setSatHours ] = useState(user.business_hours && user.business_hours.sat_hours ? user.business_hours.sat_hours : []);

  const [ readyToSave, setReadyToSave ] = useState(false);

  const { 
    newHours,
    dayType
  } = route.params;

  useEffect(() => {
    if (newHours && dayType) {
      if (dayType === 'sun') {
        setSunHours([ ...sunHours, newHours ]);
      };
      if (dayType === 'mon') {
        setMonHours([ ...monHours, newHours ]);
      };
      if (dayType === 'tue') {
        setTueHours([ ...tueHours, newHours ]);
      };
      if (dayType === 'wed') {
        setWedHours([ ...wedHours, newHours ]);
      };
      if (dayType === 'thu') {
        setThuHours([ ...thuHours, newHours ]);
      };
      if (dayType === 'fri') {
        setFriHours([ ...friHours, newHours ]);
      };
      if (dayType === 'sat') {
        setSatHours([ ...satHours, newHours ]);
      };
      navigation.setParams({ 
        newHours: null, 
        dayType: null, 
      });
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
            const newBusinessHours = 
            { 
              sun_open: sunOpen, 
              mon_open: monOpen, 
              tue_open: tueOpen, 
              wed_open: wedOpen, 
              thu_open: thuOpen, 
              fri_open: friOpen, 
              sat_open: satOpen,
              sun_hours: sunHours,
              mon_hours: monHours,
              tue_hours: tueHours,
              wed_hours: wedHours,
              thu_hours: thuHours,
              fri_hours: friHours,
              sat_hours: satHours
            };

            console.log("businessHours: ", businessHours);
            console.log("newBusinessHours: ", newBusinessHours);

            let readyToSave = false;

            const sunHoursLen = businessHours.sun_hours.length;
            const monHoursLen = businessHours.mon_hours.length;
            const tueHoursLen = businessHours.tue_hours.length;
            const wedHoursLen = businessHours.wed_hours.length;
            const thuHoursLen = businessHours.thu_hours.length;
            const friHoursLen = businessHours.fri_hours.length;
            const satHoursLen = businessHours.sat_hours.length;

            const compareHours = (currentHours, newHours) => {
              let hoursIndex = 0;
              const currentHoursLen = currentHours.length;
              const newHoursLen = newHours.length;
              // when the two hours have different length then return false
              if (currentHoursLen !== newHoursLen) {
                return true
              }
              // if not compare each hours in the two arrays
              for ( hoursIndex; hoursIndex < currentHoursLen; hoursIndex++ ) {
                if (
                  currentHours[hoursIndex].hour !== newHours[hoursIndex].hour ||
                  currentHours[hoursIndex].min !== newHours[hoursIndex].min 
                ) {
                  return true
                }
              }
              return false;
            };

            if ( 
              // when one of the days is changed from open to close or vice versa
              businessHours.sun_open !== newBusinessHours.sun_open ||
              businessHours.mon_open !== newBusinessHours.mon_open ||
              businessHours.tue_open !== newBusinessHours.tue_open ||
              businessHours.wed_open !== newBusinessHours.wed_open ||
              businessHours.thu_open !== newBusinessHours.thu_open ||
              businessHours.fri_open !== newBusinessHours.fri_open ||
              businessHours.sat_open !== newBusinessHours.sat_open
            ) {
              readyToSave = true;
            }
            else if (
              compareHours(businessHours.sun_hours, newBusinessHours.sun_hours) ||
              compareHours(businessHours.mon_hours, newBusinessHours.mon_hours) ||
              compareHours(businessHours.tue_hours, newBusinessHours.tue_hours) ||
              compareHours(businessHours.wed_hours, newBusinessHours.wed_hours) ||
              compareHours(businessHours.thu_hours, newBusinessHours.thu_hours) ||
              compareHours(businessHours.fri_hours, newBusinessHours.fri_hours) ||
              compareHours(businessHours.sat_hours, newBusinessHours.sat_hours)
            ) {
              readyToSave = true;
            };

            if (readyToSave) {
              console.log("ready to save");
              setShowTba(true);
            } else {
              console.log('nothing to save');
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
      { showTba && 
        <TwoButtonAlert 
          title={"Ready to Save?"}
          message={
            "Please, make sure all the hours are correct."
          }
          buttonOneText={"Save"}
          buttonTwoText={"No"} 
          buttonOneAction={() => {
            console.log("save");
            const newBusinessHours = 
            { 
              sun_open: sunOpen, 
              mon_open: monOpen, 
              tue_open: tueOpen, 
              wed_open: wedOpen, 
              thu_open: thuOpen, 
              fri_open: friOpen, 
              sat_open: satOpen,
              sun_hours: sunHours,
              mon_hours: monHours,
              tue_hours: tueHours,
              wed_hours: wedHours,
              thu_hours: thuHours,
              fri_hours: friHours,
              sat_hours: satHours
            };
            const updateBusUser = businessUpdateFire.busUserUpdate({
              business_hours: newBusinessHours
            });
            updateBusUser
            .then(() => {
              setShowTba(false);
            })
            .catch((error) => {
              console.log("error: updateBusUser: ", error);
            })
          }} 
          buttonTwoAction={() => {
            setShowTba(false);
          }}
        />
      }
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
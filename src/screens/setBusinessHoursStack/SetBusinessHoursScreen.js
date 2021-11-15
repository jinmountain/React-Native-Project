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
import AlertBoxTop from '../../components/AlertBoxTop';

// Design

// firebase
import businessUpdateFire from '../../firebase/businessUpdateFire';
import businessGetFire from '../../firebase/businessGetFire';

// Context
import { Context as AuthContext } from '../../context/AuthContext';

// Hooks
import useConvertTime from '../../hooks/useConvertTime';

// color
import color from '../../color';

// icon
import expoIcons from '../../expoIcons';

const SettingHoursDayContainer = ({ navigation, dayText, dayOpen, setDayOpen, hours, businessDay, setHours, userType, techId }) => {
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
              navigation.navigate("SetHours", {
                userType: userType,
                hoursType: 'business',
                businessDay: businessDay,
                techId: techId
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

const SetBusinessHoursScreen = ({ route, navigation }) => {
  const {
    userType,
    newHours,
    businessDay,
    // for tech
    techId
  } = route.params;

  const { 
    state: {
      user
    }
  } = useContext(AuthContext);
  
  const [ showTba, setShowTba ] = useState(false);
  const [ alertBoxText, setAlertBoxText ] = useState('');
  const [ alertBoxStatus, setAlertBoxStatus ] = useState(false);

  const [ businessHours, setBusinessHours ] = useState(
    userType === 'bus' && user.business_hours 
    ? user.business_hours 
    : []
  ); // business user's business hours
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

  const [ sunOpen, setSunOpen ] = useState(
    userType === 'bus' && user.business_hours && user.business_hours.sun_open 
    ? user.business_hours.sun_open
    : false 
  );
  const [ sunHours, setSunHours ] = useState(
    userType === 'bus' && user.business_hours && user.business_hours.sun_hours
    ? user.business_hours.sun_hours
    : []
  );
  const [ monOpen, setMonOpen ] = useState(
    userType === 'bus' && user.business_hours && user.business_hours.mon_open 
    ? user.business_hours.mon_open
    : false
  );
  const [ monHours, setMonHours ] = useState(
    userType === 'bus' && user.business_hours && user.business_hours.mon_hours
    ? user.business_hours.mon_hours
    : []
  );
  const [ tueOpen, setTueOpen ] = useState(
    userType === 'bus' && user.business_hours && user.business_hours.tue_open 
    ? user.business_hours.tue_open
    : false
  );
  const [ tueHours, setTueHours ] = useState(
    userType === 'bus' && user.business_hours && user.business_hours.tue_hours
    ? user.business_hours.tue_hours
    : []
  );
  const [ wedOpen, setWedOpen ] = useState(
    userType === 'bus' && user.business_hours && user.business_hours.wed_open 
    ? user.business_hours.wed_open
    : false
  );
  const [ wedHours, setWedHours ] = useState(
    userType === 'bus' && user.business_hours && user.business_hours.wed_hours
    ? user.business_hours.wed_hours
    : []
  );
  const [ thuOpen, setThuOpen ] = useState(
    userType === 'bus' && user.business_hours && user.business_hours.thu_open 
    ? user.business_hours.thu_open
    : false
  );
  const [ thuHours, setThuHours ] = useState(
    userType === 'bus' && user.business_hours && user.business_hours.thu_hours
    ? user.business_hours.thu_hours
    : []
  );
  const [ friOpen, setFriOpen ] = useState(
    userType === 'bus' && user.business_hours && user.business_hours.fri_open 
    ? user.business_hours.fri_open
    : false
  );
  const [ friHours, setFriHours ] = useState(
    userType === 'bus' && user.business_hours && user.business_hours.fri_hours
    ? user.business_hours.fri_hours
    : []
  );
  const [ satOpen, setSatOpen ] = useState(
    userType === 'bus' && user.business_hours && user.business_hours.sat_open 
    ? user.business_hours.sat_open
    : false
  );
  const [ satHours, setSatHours ] = useState(
    userType === 'bus' && user.business_hours && user.business_hours.sat_hours
    ? user.business_hours.sat_hours
    : []
  );

  const [ readyToSave, setReadyToSave ] = useState(false);

  // get technician business hours and set to the states
  useEffect(() => {
    let isMounted = true;
    if (userType === 'tech' && techId) {
      // get tech business hours
      const getTechBusinessHours = businessGetFire.getTechBusinessHours(user.id, techId);
      getTechBusinessHours
      .then((currentBusinessHours) => {
        // set to the states
        if (currentBusinessHours && currentBusinessHours.sun_open) {
          isMounted && setBusinessHours(currentBusinessHours);
          isMounted && setSunOpen(currentBusinessHours.sun_open);
          isMounted && setSunHours(currentBusinessHours.sun_hours);
          isMounted && setMonOpen(currentBusinessHours.mon_open);
          isMounted && setMonHours(currentBusinessHours.mon_hours);
          isMounted && setTueOpen(currentBusinessHours.tue_open);
          isMounted && setTueHours(currentBusinessHours.tue_hours);
          isMounted && setWedOpen(currentBusinessHours.wed_open);
          isMounted && setWedHours(currentBusinessHours.wed_hours);
          isMounted && setThuOpen(currentBusinessHours.thu_open);
          isMounted && setThuHours(currentBusinessHours.thu_hours);
          isMounted && setFriOpen(currentBusinessHours.fri_open);
          isMounted && setFriHours(currentBusinessHours.fri_hours);
          isMounted && setSatOpen(currentBusinessHours.sat_open);
          isMounted && setSatHours(currentBusinessHours.sat_hours);
        }
      })
      .catch((error) => {
        console.log("error: ", error);
      });
    } 
    return () => {
      isMounted = false;
      // navigation.setParams({ 
      //   userType: null, 
      // });
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (newHours && businessDay) {
      if (businessDay === 'sun') {
        isMounted && setSunHours([ ...sunHours, newHours ]);
      };
      if (businessDay === 'mon') {
        isMounted && setMonHours([ ...monHours, newHours ]);
      };
      if (businessDay === 'tue') {
        isMounted && setTueHours([ ...tueHours, newHours ]);
      };
      if (businessDay === 'wed') {
        isMounted && setWedHours([ ...wedHours, newHours ]);
      };
      if (businessDay === 'thu') {
        isMounted && setThuHours([ ...thuHours, newHours ]);
      };
      if (businessDay === 'fri') {
        isMounted && setFriHours([ ...friHours, newHours ]);
      };
      if (businessDay === 'sat') {
        isMounted && setSatHours([ ...satHours, newHours ]);
      };
      navigation.setParams({ 
        newHours: null, 
        businessDay: null, 
      });
    }
    return () => {
      isMounted = false;
    }
  }, [newHours]);

  // detect hours change and set readyToSave to true
  // useEffect(() => {
  //   if (businessHours === [sunHours, monHours]) {
  //     setReadyToSave(true);
  //   }
  // }, [sunHours, monHours]);

  return (
    <View style={styles.mainContainer}>
      <HeaderForm 
        addPaddingTop={userType === 'tech' ? false : true}
        leftButtonTitle={null}
        leftButtonIcon={expoIcons.evilIconsClose(RFValue(27), color.black1)}
        headerTitle={"Hours"} 
        rightButtonIcon={"Save"}
        rightButtonTitle={null} 
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

          let readyToSave = false;

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

          if (businessHours.sun_open) {
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
          } else {
            readyToSave = true;
          }
          
          if (readyToSave) {
            console.log("ready to save");
            setShowTba(true);
          } else {
            setAlertBoxStatus(true);
            setAlertBoxText("Change has not made.");
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
          businessDay={'sun'}
          setHours={setSunHours}
          userType={userType}
          techId={techId}
        />
        <HeaderBottomLine/>
        <SettingHoursDayContainer
          navigation={navigation} 
          dayText={"Monday"}
          dayOpen={monOpen}
          setDayOpen={setMonOpen}
          hours={monHours}
          businessDay={'mon'}
          setHours={setMonHours}
          userType={userType}
          techId={techId}
        />
        <HeaderBottomLine/>
        <SettingHoursDayContainer
          navigation={navigation} 
          dayText={"Tuesday"}
          dayOpen={tueOpen}
          setDayOpen={setTueOpen}
          hours={tueHours}
          businessDay={'tue'}
          setHours={setTueHours}
          userType={userType}
          techId={techId}
        />
        <HeaderBottomLine/>
        <SettingHoursDayContainer
          navigation={navigation} 
          dayText={"Wednesday"}
          dayOpen={wedOpen}
          setDayOpen={setWedOpen}
          hours={wedHours}
          businessDay={'wed'}
          setHours={setWedHours}
          userType={userType}
          techId={techId}
        />
        <HeaderBottomLine/>
        <SettingHoursDayContainer
          navigation={navigation} 
          dayText={"Thursday"}
          dayOpen={thuOpen}
          setDayOpen={setThuOpen}
          hours={thuHours}
          businessDay={'thu'}
          setHours={setThuHours}
          userType={userType}
          techId={techId}
        />
        <HeaderBottomLine/>
        <SettingHoursDayContainer
          navigation={navigation} 
          dayText={"Friday"}
          dayOpen={friOpen}
          setDayOpen={setFriOpen}
          hours={friHours}
          businessDay={'fri'}
          setHours={setFriHours}
          userType={userType}
          techId={techId}
        />
        <HeaderBottomLine/>
        <SettingHoursDayContainer
          navigation={navigation} 
          dayText={"Saturday"}
          dayOpen={satOpen}
          setDayOpen={setSatOpen}
          hours={satHours}
          businessDay={'sat'}
          setHours={setSatHours}
          userType={userType}
          techId={techId}
        />
      </ScrollView>
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
            console.log(userType);
            console.log(techId);
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
            if (userType === 'bus') {
              const updateBusUser = businessUpdateFire.busUserUpdate({
                business_hours: newBusinessHours
              });
              updateBusUser
              .then(() => {
                setBusinessHours(newBusinessHours);
                setShowTba(false);
              })
              .catch((error) => {
                console.log("error: updateBusUser: ", error);
              });
            }
            if (userType === 'tech' && techId) {
              const updateTechBusinessHours = businessUpdateFire.updateTechBusinessHours(user.id, techId, newBusinessHours);
              updateTechBusinessHours
              .then(() => {
                setBusinessHours(newBusinessHours);
                setShowTba(false);
              })
              .catch((error) => {
                console.log("error: ", error);
              });
            }
          }} 
          buttonTwoAction={() => {
            setShowTba(false);
          }}
        />
      }
      {
        alertBoxStatus &&
        <AlertBoxTop
          alertText={alertBoxText}
          setAlert={setAlertBoxStatus}
        />
      }
    </View>
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

export default SetBusinessHoursScreen;
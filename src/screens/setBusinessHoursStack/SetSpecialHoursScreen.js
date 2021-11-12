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
  FlatList,
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
import { FontAwesome } from '@expo/vector-icons';

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

const SpecialHoursContainer = ({ navigation, index, specialDates, date, setDates, userType }) => {
  return (
    <View style={styles.settingContainer}>
      <View style={styles.settingTopContainer}>
        <View style={styles.dayContainer}>
          <View style={styles.specialDayIconContainer}>
            {expoIcons.fontAwesomeCalendarO(RFValue(23), color.black1)}
          </View>
          <View style={styles.specialDateTextContainer}>
            <Text style={styles.specialDateText}>{useConvertTime.getDayMonthDateYear(date.date_in_ms)}</Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View style={styles.statusTextContainer}>
            { date.status === false
              ? <Text style={[styles.onOffText, { color: color.grey8 }]}>Closed</Text>
              : <Text style={[styles.onOffText, { color: color.red2 }]}>Open</Text>
            }
          </View>
        </View>
        <TouchableHighlight
          style={styles.deleteHoursButton}
          onPress={() => {
            console.log('delete');
            const specialDatesLen = specialDates.length;
            const newSpecialDates = specialDates.filter((item) => item !== date );
            /// only one
            if (specialDatesLen === 1) {
              setDates(newSpecialDates);
            };
            // more than one
            if (specialDatesLen > 1) {
              setDates([
                ...specialDates.slice(0, index),
                ...specialDates.slice(index + 1, specialDatesLen)
              ]);
            };
          }}
          underlayColor={color.grey4}
        >
          <View style={styles.addButtonTextContainer}>
            <Text style={styles.addButtonText}>
              <FontAwesome name="calendar-minus-o" size={RFValue(23)} color={color.black1} />
            </Text>
          </View>
        </TouchableHighlight>
      </View>
      {
        date.status &&
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
            date.hours.map(( item, hourIndex ) => {
              return (
                <View 
                  key={hourIndex}
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
                      const specialDatesLen = specialDates.length;
                      console.log('delete');

                      const newHours = date.hours.filter((hour) => hour !== item);
                      let newSpecialDate = date 
                      newSpecialDate.hours = newHours;

                      console.log("newSpecialDate: ", newSpecialDate);

                      // only one
                      if (specialDatesLen === 1) {
                        setDates([newSpecialDate]);
                      };
                      // more than one
                      if (specialDatesLen > 1) {
                        setDates([
                          ...specialDates.slice(0, index),
                          newSpecialDate,
                          ...specialDates.slice(index + 1, specialDatesLen)
                        ]);
                      };
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
                hoursType: 'special',
                specialDateIndex: index,
                userType: userType
              })
            }}
            underlayColor={color.grey4}
          >
            <View style={styles.addOpenHoursTextContainer}>
              <Text style={styles.addOpenHoursText}>
                {expoIcons.featherPlus(RFValue(19), color.red2)} Add open hours
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      }
    </View>
  )
}

const SetSpecialHoursScreen = ({ route, navigation }) => {
  const { 
    state: {
      user
    }
  } = useContext(AuthContext);

  const { 
    userType,
    // from SetAnotherDayScreen
    newSpecialDate,
    newSpecialDateStatus,
    // from SetHoursScreen
    newHours,
    specialDateIndex,
    // for tech
    techId
  } = route.params;
  
  const [ showTba, setShowTba ] = useState(false);
  const [ alertBoxText, setAlertBoxText ] = useState('');
  const [ alertBoxStatus, setAlertBoxStatus ] = useState(false);
  // spcialHours structure
  // [
  //   special day
  //   {
  //      date_in_ms: number,
  //      status: boolean,
  //      hours: array
  //   } 

  //   hours example below
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
  // ]

  // business user's special hours
  const [ currentSpecialHours, setCurrentSpecialHours ] = useState(
    userType === 'bus' && user.special_hours ? user.special_hours : null
  );
  // seperated into three for date_in_ms, status, and hours
  const [ specialDates, setSpecialDates ] = useState(
    []
  );

  // if userType is tech
  useEffect(() => {
    let isMounted = true;
    if (userType === 'tech' && techId) {
      // get tech business hours
      const getTechSpecialHours = businessGetFire.getTechSpecialHours(user.id, techId);
      getTechSpecialHours
      .then((currentSpecialHours) => {
        // set to the states
        if (currentSpecialHours) {
          isMounted && setCurrentSpecialHours(currentSpecialHours);
          isMounted && setSpecialDates(currentSpecialHours);
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
    console.log("user speical hours: ", user.special_hours);
    if (newSpecialDate) {
      isMounted && setSpecialDates([ ...specialDates, { date_in_ms: newSpecialDate, status: newSpecialDateStatus, hours: [] } ]);
      navigation.setParams({ 
        newSpecialDate: null, 
        newSpecialDateStatus: null, 
      });
    }

    if (newHours) {
      let newSpecialDate = specialDates[specialDateIndex];
      let newSpecialDateHours = [ ...newSpecialDate.hours, newHours ];
      newSpecialDate.hours = newSpecialDateHours;

      console.log(newSpecialDate);

      const specialDatesLen = specialDates.length;
      // only one
      if (specialDatesLen === 1) {
        isMounted && setSpecialDates([newSpecialDate]);
      }
      // more than one
      if (specialDatesLen > 1) {
        isMounted && setSpecialDates([
          ...specialDates.slice(0, specialDateIndex),
          newSpecialDate,
          ...specialDates.slice(specialDateIndex + 1, specialDatesLen)
        ]);
      }

      navigation.setParams({ 
        newHours: null, 
        specialDateIndex: null, 
      });
    }

    return () => {
      isMounted = false;
      setShowTba(false);
      user.special_hours && setSpecialDates(user.special_hours);
    }
  }, [ newSpecialDate, newHours ]);

  return (
    <MainTemplate disableMarginTop={userType === 'tech' ? true : false}>
      <View style={styles.mainContainer}>
        <HeaderForm 
          leftButtonTitle={"Cancel"}
          leftButtonIcon={null}
          headerTitle={"Special Hours"} 
          rightButtonTitle={"Save"} 
          leftButtonPress={() => {
            navigation.goBack();
          }}
          rightButtonPress={() => {
            console.log(specialDates);
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

            let readyToSave = false;

            if (currentSpecialHours) {
              // compare length 
              const currentSpecialHoursLen = currentSpecialHours.length;
              if (currentSpecialHoursLen !== specialDates.length ) {
                readyToSave = true;
              } else {
                let specialHoursIndex = 0;
                for (specialHoursIndex; specialHoursIndex < currentSpecialHoursLen; specialHoursIndex++) {
                  if (currentSpecialHours[specialHoursIndex].date_in_ms !== specialDates[specialHoursIndex].date_in_ms) {
                    readyToSave = true;
                    break
                  };

                  if (currentSpecialHours[specialHoursIndex].status !== specialDates[specialHoursIndex].status) {
                    readyToSave = true;
                    break
                  }

                  if (compareHours(currentSpecialHours[specialHoursIndex].hours, specialDates[specialHoursIndex]).hours) {
                    readyToSave = true;
                    break
                  };
                }
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
        <HeaderBottomLine/>
        <View style={styles.specialDayHoursContainer}>
          <ScrollView>
            {/*existing or new special dates*/}
            {
              specialDates.map((item, index) => {
                return (
                  <SpecialHoursContainer 
                    key={index}
                    navigation={navigation}
                    index={index}
                    specialDates={specialDates}
                    date={item}
                    setDates={setSpecialDates}
                    userType={userType}
                  />
                )
              })
            }
            {/*upcoming holidays*/}
          </ScrollView>
        </View>
        <View style={styles.addAnotherDayContainer}>
          <HeaderBottomLine />
          <TouchableHighlight
            style={styles.addAnotherDayButton}
            onPress={() => {
              navigation.navigate("SetAnotherDay", {
                userType: userType
              });
            }}
            underlayColor={color.grey4}
          >
            <View style={styles.addAnotherDayTextContainer}>
              <Text style={styles.addAnotherDayText}>
                {expoIcons.fontAwesomeCalendarPlusO(RFValue(23), color.black1)} Add Another Day
              </Text>
            </View>
          </TouchableHighlight>
        </View>
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
            const updateBusUser = businessUpdateFire.busUserUpdate({
              special_hours: specialDates
            });
            updateBusUser
            .then(() => {
              setCurrentSpecialHours(specialDates);
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
      {
        alertBoxStatus &&
        <AlertBoxTop
          alertText={alertBoxText}
          setAlert={setAlertBoxStatus}
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
  specialDayIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: RFValue(50),
  },
  specialDateTextContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  specialDateText: {
    fontSize: RFValue(19),
    fontWeight: 'bold'
  },

  statusContainer: {
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
  addOpenHoursTextContainer: {
    justifyContent: 'center',
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

  specialDayHoursContainer: {
    flex: 1
  },

  addAnotherDayContainer: {
    height: RFValue(59),
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  addAnotherDayButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: RFValue(57),
    width: '100%'
  },
  addAnotherDayTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addAnotherDayText: {
    fontSize: RFValue(19)
  }
});

export default SetSpecialHoursScreen;
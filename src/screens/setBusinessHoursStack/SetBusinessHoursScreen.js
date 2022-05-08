// developer summary
// ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
// this screen is for a business to change its business hours.
// if they make any change and click save a two button alert 
// will pop and ask again to confirm.

import React, { useState, useEffect, useContext, useRef, useMemo, useCallback } from 'react';
import { 
  StyleSheet, 
  View,
  ScrollView,
  Pressable,
  Text,
  Switch,
  TouchableOpacity,
  TouchableHighlight,
  SafeAreaView,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import BottomSheet from '@gorhom/bottom-sheet';

// Components
import MainTemplate from '../../components/MainTemplate';
import HeaderBottomLine from '../../components/HeaderBottomLine';
import { HeaderForm } from '../../components/HeaderForm';
import TwoButtonAlert from '../../components/TwoButtonAlert';
import AlertBoxTop from '../../components/AlertBoxTop';
import BottomSheetHeader from '../../components/BottomSheetHeader';

// Design

// firebase
import {
  updateBusBusinessHoursFire,
  updateTechBusinessHoursFire
} from '../../firebase/business/businessUpdateFire';
import {
  getTechBusinessHoursFire
} from '../../firebase/business/businessGetFire';

// Context
import { Context as AuthContext } from '../../context/AuthContext';

// Hooks
import {
  convertMilitaryToStandard,
} from '../../hooks/useConvertTime';

// color
import color from '../../color';

// icon
import {
  chevronBack,
  clockIcon,
  featherPlus,
  antClose,
  evilIconsClose,
} from '../../expoIcons';

// timezone
import timezoneList from '../../timezoneList';

const VerticalScrollModalButton = ({ 
  index,
  label, 
  timezoneValue, 
  timezoneOffsetValue,
  setTimezone,
  setTimezoneOffset,
  setIsModalVisible 
}) => {
  return (
    <View 
      key={label} 
      style={{ height: RFValue(53) }}
    >
      {
        index > 0 &&
        <HeaderBottomLine />
      }
      <TouchableHighlight
        
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        onPress={() => {
          setTimezone(timezoneValue);
          setTimezoneOffset(timezoneOffsetValue);
          setIsModalVisible(false);
        }}
        underlayColor={color.grey4}
      >
        <View style={{ justifyContent: 'center', alignItems: 'center', width: "100%" }}>
          <Text style={{ fontSize: RFValue(17) }}>{label}</Text>
        </View>
      </TouchableHighlight>
    </View>
  )
};

const VerticalScrollPicker = ({ 
  content,
  setTimezone,
  setTimezoneOffset,
  setIsModalVisible,
  defaultLabel, 
  defaultValue,
  currentTimzeoneLabel,
  currentTimezone,
  currentTimezoneOffset,
}) => {
  return (
    <ScrollView>
      { defaultLabel &&
        <TouchableHighlight
          style={{ height: RFValue(53), justifyContent: 'center', alignItems: 'center' }}
          onPress={() => {
            setIsModalVisible(false);
          }}
          underlayColor={color.grey4}
        >
          <View style={{ justifyContent: 'center', alignItems: 'center', width: "100%", flexDirection: 'row'}}>
            <View style={styles.modalCloseContainer}>
              {chevronBack(RFValue(27), color.black1)}
            </View>
            <View>
              <Text style={{ fontSize: RFValue(17) }}>{defaultLabel}</Text>
            </View>
          </View>
        </TouchableHighlight>
      }
      <View>
        <TouchableHighlight
          style={styles.currentTimezoneContainer}
          onPress={() => {
            setIsModalVisible(false);
            setTimezone(currentTimezone);
            setTimezoneOffset(currentTimezoneOffset);
          }}
          underlayColor={color.grey4}
        >
          <View style={styles.currentTimezoneTextContainer}>
            <Text style={styles.currentTimezoneTextTop}>Current Timezone</Text>
            <Text style={styles.currentTimezoneText}>{currentTimzeoneLabel}</Text>
          </View>
        </TouchableHighlight>
        <HeaderBottomLine />
      </View>
      {
        content.map((item, index) => {
          return (
            <VerticalScrollModalButton
              key={index}
              index={index}
              label={item.gmt}
              timezoneValue={item.timezone}
              timezoneOffsetValue={item.offset}
              setTimezone={setTimezone}
              setTimezoneOffset={setTimezoneOffset}
              setIsModalVisible={setIsModalVisible}
            />
          )
        })
      }
    </ScrollView>
  )
};

const SettingHoursDayContainer = ({ navigation, dayText, dayOpen, setDayOpen, hours, businessDay, setHours, userType, techId }) => {
  return (
    <View style={styles.settingContainer}>
      <View style={styles.settingTopContainer}>
        <View style={styles.dayContainer}>
          <View style={styles.clockIconContainer}>
            {clockIcon(RFValue(20), color.black1)}
          </View>
          <View style={styles.dayTextContainer}>
            <Text style={styles.dayText}>{dayText}</Text>
          </View>
        </View>
        <View style={styles.switchContainer}>
          <View style={styles.onOffStatusConatiner}>
            { dayOpen === false
              ? <Text style={[styles.onOffText, { color: color.grey8 }]}>Closed</Text>
              : <Text style={[styles.onOffText, { color: color.blue1 }]}>Open</Text>
            }
          </View>
          <Switch
            trackColor={{ false: color.grey8, true: color.blue1 }}
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
                        {convertMilitaryToStandard(item.opens.hour, item.opens.min)}
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
                        {convertMilitaryToStandard(item.closes.hour, item.closes.min)}
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
                      <Text style={styles.addButtonText}>{antClose(RFValue(23), color.black1)}</Text>
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
                techId: techId,
                currentHours: hours,
              })
            }}
            underlayColor={color.grey4}
          >
            <View style={styles.addOpenHoursButtonInner}>
              <View style={styles.addOpenHoursIconContainer}>
                {featherPlus(RFValue(19), color.red2)}
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

  // businessHours structure
  // [
  //   {
  //      timezone: string,
  //      timezoneOffset: number,
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
  const [ businessHours, setBusinessHours ] = useState(
    userType === 'bus' && user.business_hours
    ? user.business_hours
    : null 
  )

  const [ userTimezone, setUserTimezone ] = useState(
    user.business_hours && user.business_hours.timezone 
    ? user.business_hours.timezone
    : null
  );
  const [ userTimezoneOffset, setUserTimezoneOffset ] = useState(
    user.business_hours && user.business_hours.timezoneOffset 
    ? user.business_hours.timezoneOffset
    : null
  );
  const [ userGmt, setUserGmt ] = useState(null);

  const [ currentTimezoneOffset, setCurrentTimezoneOffset ] = useState(null);
  const [ currentTimezone, setCurrentTimezone ] = useState(null); 
  const [ currentGmt, setCurrentGmt ] = useState(null);
  
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
    // only for tech
    if (userType === 'tech' && techId) {
      // get tech business hours
      const getTechBusinessHours = getTechBusinessHoursFire(user.id, techId);
      getTechBusinessHours
      .then((currentBusinessHours) => {
        // set to the states
        if (currentBusinessHours && currentBusinessHours.sun_open && isMounted) {
          setBusinessHours(currentBusinessHours);
          setSunOpen(currentBusinessHours.sun_open);
          setSunHours(currentBusinessHours.sun_hours);
          setMonOpen(currentBusinessHours.mon_open);
          setMonHours(currentBusinessHours.mon_hours);
          setTueOpen(currentBusinessHours.tue_open);
          setTueHours(currentBusinessHours.tue_hours);
          setWedOpen(currentBusinessHours.wed_open);
          setWedHours(currentBusinessHours.wed_hours);
          setThuOpen(currentBusinessHours.thu_open);
          setThuHours(currentBusinessHours.thu_hours);
          setFriOpen(currentBusinessHours.fri_open);
          setFriHours(currentBusinessHours.fri_hours);
          setSatOpen(currentBusinessHours.sat_open);
          setSatHours(currentBusinessHours.sat_hours);
        }
      })
      .catch((error) => {
        console.log("error: ", error);
      });
    };

    // for business, get current timezone
    if (userType === 'bus') {
      const date = new Date();
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const diff = date.getTimezoneOffset();

      const getGmt = timezoneList.filter((zone) => zone.timezone == tz);

      const gmt = getGmt[0].gmt;

      isMounted && setCurrentTimezone(tz);
      isMounted && setCurrentTimezoneOffset(diff)
      isMounted && setCurrentGmt(getGmt[0].gmt);
    }

    return () => {
      isMounted = false;
    }
  }, []);

  // timezone and timezone offset
  useEffect(() => {
    let isMounted = true;

    const getUserGmt = timezoneList.filter((zone) => zone.timezone == userTimezone);
    isMounted && setUserGmt(getUserGmt[0].gmt);

    return () => {
      isMounted = false;
    }
  }, [userTimezone]);

  // new input to status and hours
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

  const [ isModalVisible, setIsModalVisible ] = useState(false);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => 
    // [height-RFValue(95)-width-RFValue(55), height-RFValue(95)-RFValue(55)],
    ['50%'],
    []
  );
  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      setIsModalVisible(false);
    } 
    // console.log('handleSheetChanges', index);
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerBarContainer}>
        <SafeAreaView/>
        <HeaderForm 
          addPaddingTop={userType === 'tech' ? false : true}
          leftButtonTitle={null}
          leftButtonIcon={evilIconsClose(RFValue(27), color.black1)}
          headerTitle={"Hours"} 
          rightButtonIcon={"Save"}
          rightButtonTitle={null} 
          leftButtonPress={() => {
            navigation.goBack();
          }}
          rightButtonPress={() => {
            const newBusinessHours = 
            { 
              timezone: userTimezone,
              timezoneOffset: userTimezoneOffset,
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
            // compare timezone and timezoneOffset
            if (businessHours.timezone && businessHours.timezoneOffset) {
              console.log("existing: ", businessHours.timezone, businessHours.timezoneOffset);
              console.log("newBusinessHours: ", newBusinessHours.timezone, newBusinessHours.timezoneOffset);
              if (
                businessHours.timezone !== newBusinessHours.timezone ||
                businessHours.timezoneOffset !== newBusinessHours.timezoneOffset
              ) {
                readyToSave = true;
              }
            } else {
              if (newBusinessHours.timezone && newBusinessHours.timezoneOffset) {
                readyToSave = true;
              }
            }

            // compare status and hours
            if (businessHours) {
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
              if (
                newBusinessHours.sun_open ||
                newBusinessHours.mon_open ||
                newBusinessHours.tue_open ||
                newBusinessHours.wed_open ||
                newBusinessHours.thu_open ||
                newBusinessHours.fri_open ||
                newBusinessHours.sat_open
              ) {
                readyToSave = true;
              };

              if (
                newBusinessHours.sun_hours ||
                newBusinessHours.mon_hours ||
                newBusinessHours.tue_hours ||
                newBusinessHours.wed_hours ||
                newBusinessHours.thu_hours ||
                newBusinessHours.fri_hours ||
                newBusinessHours.sat_hours
              ) {
                readyToSave = true;
              };
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
      </View>
      <View>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: RFValue(150)
          }}
        >
          { 
            userType === 'bus'
            ?
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(true);
              }}
            >
              <View style={styles.timezoneSetting}>
                <Text style={styles.timezoneLabelText}>Timezone:</Text>
                <Text style={styles.timezoneText}>{userGmt}</Text> 
              </View>
            </TouchableOpacity>
            :
            <TouchableOpacity
              onPress={() => {
                
              }}
            >
              <View style={styles.timezoneSetting}>
                <Text style={styles.timezoneLabelText}>Timezone:</Text>
                <Text style={styles.timezoneText}>{userGmt}</Text> 
              </View>
            </TouchableOpacity>
          }

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
                timezone: userTimezone,
                timezoneOffset: userTimezoneOffset,
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
                const updateBusBusinessHours = updateBusBusinessHoursFire(newBusinessHours);
                updateBusBusinessHours
                .then(() => {
                  setBusinessHours(newBusinessHours);
                  setShowTba(false);
                })
                .catch((error) => {
                  console.log("error: updateBusUser: ", error);
                });
              }
              if (userType === 'tech' && techId) {
                const updateTechBusinessHours = updateTechBusinessHoursFire(techId, newBusinessHours);
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
      {
        isModalVisible &&
        <View style={{ position: 'absolute', width: "100%", height: "100%", zIndex: 6 }}>
          <Pressable
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
            ]}
            onPress={() => setIsModalVisible(false)}
          >
          </Pressable>
          <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            enablePanDownToClose={true}
            handleComponent={() => {
              return (
                <BottomSheetHeader 
                  headerText={"Timezones"}
                  closeButtonOnPress={() => {
                    setIsModalVisible(false);
                  }}
                />
              )
            }}
          >
            {
              <VerticalScrollPicker
                content={timezoneList}
                setTimezone={setUserTimezone}
                setTimezoneOffset={setUserTimezoneOffset}
                setIsModalVisible={setIsModalVisible}
                currentTimzeoneLabel={currentGmt}
                currentTimezone={currentTimezone}
                currentTimezoneOffset={currentTimezoneOffset}
              />
            }
          </BottomSheet>
        </View>
      }
    </View>
  )
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: color.white2
  },

  headerBarContainer: { 
    backgroundColor: color.white2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    // for android
    elevation: 5,
    // for ios
    zIndex: 5
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
    color: color.black1
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

  currentTimezoneContainer: { 
    height: RFValue(65),
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  currentTimezoneTextContainer: { 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: "100%" 
  },
  currentTimezoneText: {
    fontSize: RFValue(17),
  },
  currentTimezoneTextTop: {
    fontSize: RFValue(17),
    fontWeight: 'bold'
  },

  timezoneSetting: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingLeft: RFValue(15),
    paddingVertical: RFValue(15),
  },
  timezoneLabelText: {
    fontSize: RFValue(19),
    fontWeight: 'bold',
    color: color.black1
  },
  timezoneText: {
    justifyContent: 'center',
    paddingLeft: RFValue(9),
    color: color.black1,
    fontSize: RFValue(13)
  },
});

export default SetBusinessHoursScreen;
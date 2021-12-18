import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View,
  ScrollView, 
  Text, 
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  Switch
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import MainTemplate from '../../components/MainTemplate';
import HeaderBottomLine from '../../components/HeaderBottomLine';
import { HeaderForm } from '../../components/HeaderForm';
import LoadingAlert from '../../components/LoadingAlert';

// Designs
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Hooks
import { getCalendarDates } from '../../hooks/getCalendarDates';
import useConvertTime from '../../hooks/useConvertTime';
// Calendar
import MonthCalendar from '../../components/businessSchedule/MonthCalendar';

// firebase
import businessUpdateFire from '../../firebase/businessUpdateFire';
import businessPostFire from '../../firebase/businessPostFire';

// color
import color from '../../color';

// icon
import expoIcons from '../../expoIcons';

const SetAnotherDayScreen = ({ navigation, route }) => {
  const {
    userType,
    techId,
    busId,
  } = route.params;

  console.log(userType);
  // calendar 
  const [ calendarDate, setCalendarDate ] = useState(useConvertTime.convertToMonthInMs(Date.now()));
  const [ calendarMove, setCalendarMove ] = useState(0);
  const [ dateNow, setDateNow ] = useState(Date.now());
  const [ endTime, setEndTime ] = useState(17);
  const [ datesOnCalendar, setDatesOnCalendar ] = useState([]);

  // speical date and status 
  const [ specialDate, setSpecialDate ] = useState(null);
  const [ specialDateStatus, setSpecialDateStatus ] = useState(false);
  
  // loading screen state
  const [ showLoadingAlert, setShowLoadingAlert ] = useState(false);

  // get calendar dates
  getCalendarDates(calendarDate, dateNow, endTime, setDatesOnCalendar);

  useEffect(() => {
    return () => {
      setShowLoadingAlert(false);
    }
  }, []);

  const [ timezone, setTimezone ] = useState(null);
  const [ timezoneOffset, setTimezoneOffset ] = useState(null);

  useEffect(() => {
    const date = new Date();
    const split = date.toString().split(" ");
    const timezoneFormatted = Intl.DateTimeFormat().resolvedOptions().timeZone + " " + split[split.length - 2] + " " + split[split.length - 1];

    const diff = date.getTimezoneOffset();

    setTimezone(timezoneFormatted);
    setTimezoneOffset(diff)
  }, [specialDateStatus]);

  return (
    <View style={styles.mainContainer}>
      <HeaderForm 
        addPaddingTop={userType === 'tech' ? false : true}
        leftButtonTitle={null}
        leftButtonIcon={expoIcons.evilIconsClose(RFValue(27), color.black1)}
        headerTitle={"Speical Date"} 
        rightButtonIcon={"Save"} 
        leftButtonPress={() => {
          navigation.goBack();
        }}
        rightButtonPress={() => {
          if (specialDate) {
            if (userType === 'bus') {
              // save on firestore and get doc id
              setShowLoadingAlert(true);
              const postBusSpecialDate = businessPostFire.postBusSpecialDate(busId, timezoneOffset, specialDate, specialDateStatus);
              postBusSpecialDate
              .then((posted) => {
                setShowLoadingAlert(false);
                // and then navigate back
                navigation.navigate("SetSpecialHours", {
                  newSpecialDateId: posted.id,
                  newSpecialDate: posted.date_in_ms,
                  newSpecialDateStatus: posted.status,
                  userType: userType,
                  busId: busId
                });
              })
              .catch((error) => {
                console.log(error);
              });
            }

            if (userType === 'tech') {
              setShowLoadingAlert(true);
              const postTechSpecialDate = businessPostFire.postTechSpecialDate(busId, techId, timezoneOffset, specialDate, specialDateStatus);
              postTechSpecialDate
              .then((posted) => {
                setShowLoadingAlert(false);
                // and then navigate back
                navigation.navigate("SetSpecialHours", {
                  newSpecialDateId: posted.id,
                  newSpecialDate: posted.date_in_ms,
                  newSpecialDateStatus: posted.status,
                  userType: userType,
                  busId: busId,
                  techId: techId
                });
              })
              .catch((error) => {
                console.log(error);
              });
            }
          }
          
          console.log("newSpeicalDate: ", specialDate, "newSpecialDateStatus: ", specialDateStatus);
        }}
      />
      <ScrollView style={styles.screenScrollView}>
        <View style={styles.labelContainer}>
          <Text style={styles. labelText}> Select Date and Status</Text>
        </View>
        <HeaderBottomLine />
        <View style={styles.openCloseSettingContainer}>
          <View style={styles.speicalDateContainer}>
            <Text style={styles.specialDateText}>
              { specialDate
                ?
                `Date: ${useConvertTime.getDayMonthDateYear(specialDate)}`
                : 
                "Date: (choose a date using the calendar below)"
              }
            </Text>
          </View>
          <View style={styles.switchContainer}>
            <Switch
              trackColor={{ false: color.grey8, true: color.red2 }}
              thumbColor={specialDateStatus ? '#f4f3f4' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={setSpecialDateStatus}
              value={specialDateStatus}
            />
            <View style={styles.onOffStatusConatiner}>
              { specialDateStatus === false
                ? <Text style={[styles.onOffText, { color: color.grey8 }]}>Closed</Text>
                : <Text style={[styles.onOffText, { color: color.red2 }]}>Open</Text>
              }
            </View>
          </View>
        </View>
        <HeaderBottomLine />
        <View style={styles.timezoneSetting}>
          <Text style={styles.timezoneLabelText}>Timezone:</Text>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
          > 
            <Text style={styles.timezoneText}>{timezone} {timezoneOffset}</Text> 
          </ScrollView>
        </View>
        <View style={styles.controllerContainer}>
          <View style={styles.topControllerContainer}>
            <View style={styles.topControllerLeftCompartment}>
              {
                // new calendar date => useConvertTime.moveMonthInMs(calendarDate, -1)
                // dateNow's month in miliseconds => useConvertTime.convertToMonthInMs(dateNow)
                useConvertTime.convertToMonthInMs(dateNow) <= useConvertTime.moveMonthInMs(calendarDate, -1)
                ?
                <TouchableOpacity
                  onPress={() => {
                    setCalendarDate(useConvertTime.moveMonthInMs(calendarDate, -1));
                    setCalendarMove(calendarMove - 1);
                  }}
                >
                  <AntDesign name="leftcircleo" size={RFValue(27)} color="black" />
                </TouchableOpacity>
                :
                <View>
                  <AntDesign name="leftcircleo" size={RFValue(27)} color={color.grey1} />
                </View>
              }
            </View>
            <View style={styles.calendarControllerCenterCompartment}>
              <TouchableOpacity
                onPress={() => {

                }}
              >
                <Text style={styles.calendarDateText}>
                  {useConvertTime.convertToMonthly(calendarDate)}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.topControllerRightCompartment}>
              <TouchableOpacity
                onPress={() => {
                  setCalendarDate(useConvertTime.moveMonthInMs(calendarDate, +1)),
                  setCalendarMove(calendarMove + 1)
                }}
              >
                <AntDesign name="rightcircleo" size={RFValue(27)} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          <HeaderBottomLine />
        </View>
        <MonthCalendar 
          chosenDate={specialDate}
          dateNow={dateNow}
          datesOnCalendar={datesOnCalendar}
          setChosenDate={setSpecialDate}
          setCalendarMove={setCalendarMove}
          canSelectPast={false}
        />
        <View style={{height: RFValue(30)}}>
        </View>
      </ScrollView>
      {
        showLoadingAlert &&
        <LoadingAlert />
      }
    </View>
  )
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: color.white2
  },
  screenScrollView: {
    flex: 1,
    backgroundColor: color.white2
  },

  // Controller
  controllerContainer: {
    backgroundColor: color.white2,
  },
  topControllerContainer: {
    paddingVertical: RFValue(7),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  calendarControllerCenterCompartment: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topControllerLeftCompartment: {
    paddingLeft: RFValue(9),
    justifyContent: 'center',
    alignItems: 'center',
  },
  topControllerRightCompartment: {
    paddingRight: RFValue(9),
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDateText: {
    fontSize: RFValue(19)
  },

  openCloseSettingContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: RFValue(5),
  },
  onOffStatusConatiner: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(3),
  },
  onOffText: {
    fontWeight: 'bold',
    fontSize: RFValue(13),
  },

  speicalDateContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: RFValue(9),
  },
  specialDateText: {
    fontSize: RFValue(19)
  },

  labelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: RFValue(15),
    paddingVertical: RFValue(15),
  },
  labelText: {
    fontSize: RFValue(19),
    fontWeight: 'bold'
  },

  switchContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(3),
  },

  timezoneSetting: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: RFValue(9),
    height: RFValue(57)
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

export default SetAnotherDayScreen;
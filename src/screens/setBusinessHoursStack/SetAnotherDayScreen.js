import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
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

// Designs
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Hooks
import { getCalendarDates } from '../../hooks/getCalendarDates';
import useConvertTime from '../../hooks/useConvertTime';
// Calendar
import MonthCalendar from '../../components/businessSchedule/MonthCalendar';

// color
import color from '../../color';

// icon
import expoIcons from '../../expoIcons';

const SetAnotherDayScreen = ({ navigation }) => {
  const [ dateNow, setDateNow ] = useState(Date.now());
  // date
  const [ specialDate, setSpecialDate ] = useState( useConvertTime.convertToDateInMs( Date.now() ));
  const [ dateMoveFromToday, setDateMoveFromToday ] = useState(0);
  // calendar 
  const [ calendarDate, setCalendarDate ] = useState(useConvertTime.convertToMonthInMs(Date.now()));
  const [ calendarMove, setCalendarMove ] = useState(0);

  const [ endTime, setEndTime ] = useState(17);

  const [ datesOnCalendar, setDatesOnCalendar ] = useState([]);

  // status switch
  const [ status, setStatus ] = useState(false);
  // get calendar dates
  getCalendarDates(calendarDate, dateNow, endTime, setDatesOnCalendar);

  return (
    <MainTemplate>
      <View style={styles.mainContainer}>
        <HeaderForm 
          leftButtonTitle={"Cancel"}
          leftButtonIcon={null}
          headerTitle={"Speical Date"} 
          rightButtonTitle={"Save"} 
          leftButtonPress={() => {
            navigation.goBack();
          }}
          rightButtonPress={() => {
          }}
        />
        <View style={styles.labelContainer}>
          <Text style={styles. labelText}>Select Date</Text>
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
                <Text style={styles.rsvDateText}>
                  {useConvertTime.convertToMonthly(calendarDate)}
                </Text>
              </TouchableOpacity>
              <View style={{ minHeight: 2, maxHeight: 1, backgroundColor: color.black2, width: '77%', marginTop: RFValue(7) }}>
              </View>
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
          selectedDate={specialDate}
          dateNow={dateNow}
          datesOnCalendar={datesOnCalendar}
          setDate={setSpecialDate}
          setDateMoveFromToday={setDateMoveFromToday}
          setCalendarMove={setCalendarMove}
          canSelectPast={false}
        />
        <View style={{height: RFValue(30)}}>
        </View>
        <View style={styles.labelContainer}>
          <Text style={styles. labelText}> Choose Open or Close</Text>
        </View>
        <View style={styles.switchContainer}>
          <View style={styles.speicalDateContainer}>
            <Text style={styles.specialDateText}>
              Selected Date: {useConvertTime.getDayMonthDateYear(specialDate)}
            </Text>
          </View>
          <View style={styles.onOffStatusConatiner}>
            { status === false
              ? <Text style={[styles.onOffText, { color: color.grey8 }]}>Closed</Text>
              : <Text style={[styles.onOffText, { color: color.red2 }]}>Open</Text>
            }
          </View>
          <Switch
            trackColor={{ false: color.grey8, true: color.red2 }}
            thumbColor={status ? '#f4f3f4' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setStatus}
            value={status}
          />
        </View>
      </View>
    </MainTemplate>
  )
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: color.white2
  },

  // Controller
  controllerContainer: {
    backgroundColor: color.white2,
    height: RFValue(57)
  },
  topControllerContainer: {
    flex: 1,
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
    padding: RFValue(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  topControllerRightCompartment: {
    padding: RFValue(15),
    justifyContent: 'center',
    alignItems: 'center',
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

  speicalDateContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: RFValue(15)
  },
  specialDateText: {
    fontSize: RFValue(19)
  },

  labelContainer: {
    justifyContent: 'center',
    paddingLeft: RFValue(15),
    paddingVertical: RFValue(7),
  },
  labelText: {
    fontSize: RFValue(19),
    fontWeight: 'bold'
  },
});

export default SetAnotherDayScreen;
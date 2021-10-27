import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useIsFocused } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

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

// crypto
import CryptoJS from "react-native-crypto-js";

const aesSecretKey = "secretkey123"

const SetPhoneNumberScreen = ({ navigation }) => {
  const isFocused = useIsFocused();

  // screen control
  const [ numberVerificationRequest, setNumberVerificationRequest ] = useState(false);
  
  // timer control
  const [ validCodeTimeLeft, setValidCodeTimeLeft ] = useState(180) // 3 mins
  const [ validCodeTimeStartAt, setValidCodeTimeStartAt ] = useState(null);
  const [ timerInterval, setTimerInterval ] = useState(null);

  // Encrypt
  const [ aesEncryptedNumber, setAesEncryptedNumber ] = useState(null);
  const [ userCodeInput, setUserCodeInput ] = useState('');

  useEffect(() => {
    return () => {
      console.log("left SetPhoneNumberScreen");
      setNumberVerificationRequest(false);
      setValidCodeTimeLeft(180);
      setAesEncryptedNumber(null);
      setPhoneNumber(null);
      setUserCodeInput('');
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (numberVerificationRequest) {
      const codeTimerStartAt = Date.now();
      const refreshIntervalId = setInterval(() => {
        console.log("now: ", Date.now(), "start at: ", codeTimerStartAt);
        var delta = Date.now() - codeTimerStartAt; // milliseconds elapsed since start
        const inSecond = Math.floor(delta / 1000); // in seconds
        // // alternatively just show wall clock time:
        // output(new Date().toUTCString());
        if( validCodeTimeLeft > 0 ) {
          isMounted && setValidCodeTimeLeft(validCodeTimeLeft - inSecond);
        } else {
          console.log("code time out");
        }
      }, 1000);
      isMounted && setTimerInterval(refreshIntervalId);
    }

    return () => {
      isMounted = false;
      console.log('clear timerInterval');
      clearInterval(timerInterval);
    }
  }, [numberVerificationRequest])

  useFocusEffect(
    useCallback(() => {
      console.log("focused");

      return () => {
        // clearInterval(timerInterval);
        console.log("not focused");
      }
    }, [])
  );

  // phone number
  const [ phoneNumber, setPhoneNumber ] = useState(null);

  return (
    <MainTemplate>
      {
        !numberVerificationRequest
        ?
        <View style={styles.setPhoneNumberContainer}>
          <View>
            <Text>Enter Your Phone Number</Text>
          </View>
          <View>
            <TextInput 
              maxLength={10}
              autoCorrect={false}
              value={phoneNumber}
              placeholder={"1234567890"}
              onChangeText={(text) => {
                setPhoneNumber(text);
              }}
            />
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                // set random 6 digit number
                const ranSixDigitNum = String(Math.floor(100000 + Math.random() * 900000));
                console.log("random number: ", ranSixDigitNum);
                let ciphertext = CryptoJS.AES.encrypt(ranSixDigitNum, aesSecretKey).toString();
                setAesEncryptedNumber(ciphertext);
                
                // send text message
                const sendCode = new Promise((res, rej) => {
                  // setValidCodeTimeLeft(180);
                  // setValidCodeTimeStartAt(Date.now());
                  console.log("code sent");
                  res(true);
                });

                sendCode
                .then(() => {
                  setNumberVerificationRequest(true);
                  // const codeTimerStartAt = Date.now();
                  // const refreshIntervalId = setInterval(() => {
                  //   console.log("now: ", Date.now(), "start at: ", codeTimerStartAt);
                  //   var delta = Date.now() - codeTimerStartAt; // milliseconds elapsed since start
                  //   const inSecond = Math.floor(delta / 1000); // in seconds
                  //   // // alternatively just show wall clock time:
                  //   // output(new Date().toUTCString());
                  //   if( validCodeTimeLeft > 0 ) {
                  //     setValidCodeTimeLeft(validCodeTimeLeft - inSecond);
                  //   } else {
                  //     console.log("code time out");
                  //   }
                  // }, 1000);
                  // setTimerInterval(refreshIntervalId);
                })
                .catch((error) => {
                  console.log("error: sendCode: ", error);
                });
              }}
            >
              <View>
                <Text>Request Code</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        :
        <View style={styles.verifiyCodeContainer}>
          <View style={styles.timeLeftContainer}>
            <Text>{validCodeTimeLeft}</Text>
          </View>
          <View>
            <Text>Enter the code you received</Text>
          </View>
          <View>
            <TextInput 
              maxLength={6}
              autoCorrect={false}
              value={userCodeInput}
              placeholder={"123456"}
              onChangeText={(text) => {
                setUserCodeInput(text);
              }}
            />
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                // check user code must be positive 6 digit number
                if (userCodeInput.length === 6 && validCodeTimeLeft > 0) {
                  const decryptedCode = CryptoJS.AES.decrypt(aesEncryptedNumber, aesSecretKey);
                  const originalCode = decryptedCode.toString(CryptoJS.enc.Utf8);

                  if (originalCode === userCodeInput) {
                    clearInterval(timerInterval);
                    console.log("code is verified");
                  }
                } else {
                  setUserCodeInput('');
                  console.log("user code input is not 6 digit long");
                }
              }}
            >
              <View>
                <Text>Submit Code</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                clearInterval(timerInterval);
              }}
            >
              <Text>CLEAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
    </MainTemplate>
  )
};

const styles = StyleSheet.create({
  setPhoneNumberContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default SetPhoneNumberScreen;
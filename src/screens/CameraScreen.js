import React, { useEffect, useState, useRef } from 'react';
import { 
  Text,
  StyleSheet, 
  Dimensions,
  Button, 
  Image, 
  View,
  TouchableOpacity
} from 'react-native';
import { Camera } from 'expo-camera';
import { Video } from "expo-av";
import { Audio } from 'expo-av';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CancelButton from '../components/CancelButton';

import { SafeAreaView, } from 'react-native-safe-area-context';

// Componeㅜts
import { HeaderForm } from '../components/HeaderForm';

const WINDOW_HEIGHT = Dimensions.get("window").height;
const captureSize = Math.floor(WINDOW_HEIGHT * 0.09);

const CameraScreen = ({ isFocused, navigation }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flashType, setFlashType] = useState(Camera.Constants.FlashMode.off);
  const [isPreview, setIsPreview] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [videoSource, setVideoSource] = useState(null);
  const cameraRef = useRef();
  
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      console.log(status);
      setHasCameraPermission(status === 'granted');
    })();
  }, [isFocused]);

  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      setHasAudioPermission(status === 'granted');
    })();
  }, [isFocused]);

  const onCameraReady = () => {
    setIsCameraReady(true);
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true, skipProcessing: true };
      const data = await cameraRef.current.takePictureAsync(options);
      const source = data.uri;
      if (source) {
        await cameraRef.current.pausePreview();
        setIsPreview(true);
        console.log("picture source", source);
      }
    }
  };

  const recordVideo = async () => {
    if (hasAudioPermission === null || hasAudioPermission === false) {
      console.warn("need audio permission for video recording");
    }
    if (cameraRef.current) {
      try {
        const videoRecordPromise = cameraRef.current.recordAsync();
        if (videoRecordPromise) {
          setIsVideoRecording(true);
          const data = await videoRecordPromise;
          const source = data.uri;
          if (source) {
            setIsPreview(true);
            console.log("video source", source);
            setVideoSource(source);
          }
        }
      } catch (error) {
        console.warn(error);
      }
    }
  };

  const stopVideoRecording = () => {
    if (cameraRef.current) {
      setIsPreview(false);
      setIsVideoRecording(false);
      cameraRef.current.stopRecording();
    }
  };

  const switchCamera = () => {
    if (isPreview) {
      return;
    }
    setCameraType((prevCameraType) =>
      prevCameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const switchFlash = () => {
    if (isPreview) {
      return;
    }
    setFlashType((prevFlashType) =>
      prevFlashType === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.on
        : Camera.Constants.FlashMode.off
    );
  };

  const cancelPreview = async () => {
    await cameraRef.current.resumePreview();
    setIsPreview(false);
    setVideoSource(null);
  };

  const renderVideoPlayer = () => (
    <View style={styles.videoPlayerContainer}>
      <Video
        source={{ uri: videoSource }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        shouldPlay={true}
        style={{flex: 1}}
      />
    </View>
  );

  const renderVideoRecordIndicator = () => (
    <View style={styles.recordIndicatorContainer}>
      <View style={styles.recordDot} />
      <Text style={styles.recordTitle}>{"Recording..."}</Text>
    </View>
  );

  const renderCaptureControl = () => (
    <View style={styles.captureControlContainerTwo}>
      <View style={styles.flipButtonContainer}>
        <TouchableOpacity 
          disabled={!isCameraReady} 
          onPress={switchCamera}
          style={styles.flipButton}
        >
          <MaterialCommunityIcons 
            name="camera-switch" 
            color="#0C0D0E" 
            size={RFValue(30)} 
          />
          <Text style={styles.flipText}>Flip</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.captureButtonContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          disabled={!isCameraReady}
          onLongPress={recordVideo}
          onPressOut={stopVideoRecording}
          onPress={takePicture}
          style={styles.captureButton}
        >
        </TouchableOpacity>
      </View>
      <View style={styles.flashButtonContainer}>
        <TouchableOpacity onPress={switchFlash}>
        {
          flashType === Camera.Constants.FlashMode.off 
            ? <MaterialCommunityIcons name="flash-outline" size={24} color="black" />
            : <MaterialCommunityIcons name="flash" size={24} color="black" />
        }
        </TouchableOpacity>
        <Text style={styles.flipText}>{"Flash"}</Text>
      </View>
    </View>
  );

  const renderNoCamera = () => {
    <Text>No access to camera</Text>;
  };

  if (hasCameraPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.cameraScreenContainer}>
      <HeaderForm 
        leftButtonTitle='Back'
        headerTitle={null} 
        rightButtonTitle={null} 
        leftButtonPress={() => {
          navigation.goBack();
        }}
        rightButtonPress={() => {
          null
        }}
      />
      <Camera 
        ref={cameraRef}
        type={cameraType}
        style={styles.cameraContainer}
        flashMode={flashType}
        onCameraReady={onCameraReady}
        onMountError={(error) => {
          console.log("cammera error", error);
        }}
      >
      </Camera>
      {videoSource && 
        <Video
          source={{ uri: videoSource }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          shouldPlay={true}
          resizeMode="cover"
          isLooping
          style={styles.videoPlayerContainer}
        />
      }
      {isVideoRecording && renderVideoRecordIndicator()}
      {isPreview && 
        <View style={styles.closeButtonContainer}>
          <CancelButton onPressFunction={cancelPreview} />
        </View>
      }
      <View style={styles.captureControlContainer}>
        {!videoSource && !isPreview && renderCaptureControl()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cameraScreenContainer: {
    flex: 1,
    borderColor: 'blue',
    borderWidth: RFValue(5),
  },
  cameraContainer: {
    flex: 4,
    borderWidth: RFValue(3),
    borderColor: 'yellow',
  },
  captureControlContainer: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: RFValue(3),
    borderColor: "red",
  },
  captureControlContainerTwo: {
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  captureButtonContainer: {
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: RFValue(5),
    height: captureSize,
    width: captureSize,
    borderRadius: Math.floor(captureSize / 2),
    marginHorizontal: RFValue(31),
    borderWidth: RFValue(6),
    borderColor: "#DDDDDD"
  },
  flipButtonContainer: {
  },
  flipButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashButtonContainer: {
    alignItems: 'center',
  },
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  closeButtonContainer: {
    ...StyleSheet.absoluteFillObject, 
    alignItems: 'flex-end', 
    marginTop: RFValue(10), 
    marginRight: RFValue(10), 
    borderWidth: RFValue(5), 
    borderColor: 'red',
  },
  videoPlayerContainer: {
    ...StyleSheet.absoluteFillObject,
    flex: 4,
  },
  recordIndicatorContainer: {
    flexDirection: "row",
    position: "absolute",
    top: RFValue(25),
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    opacity: 0.7,
  },
  recordTitle: {
    fontSize: RFValue(15),
    color: "#ffffff",
    textAlign: "center",
  },
  recordDot: {
    borderRadius: RFValue(3),
    height: RFValue(6),
    width: RFValue(6),
    backgroundColor: "#ff0000",
    marginHorizontal: RFValue(5),
  },
  flipText: {
    color: "#0C0D0E",
    fontSize: RFValue(16),
  },
});

CameraScreen.navigationOptions = {
  headerShown: true,
}

export default CameraScreen;
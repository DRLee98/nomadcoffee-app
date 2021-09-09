import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components/native";
import ScreenLayout from "../components/ScreenLayout";
import { Alert, FlatList, Platform, useWindowDimensions } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { RootPhotoTabParamList } from "../navigators/PhotoNavi";
import Slider from "@react-native-community/slider";
import { CameraType, FlashMode } from "expo-camera/build/Camera.types";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Camera } from "expo-camera";
import { useReactiveVar } from "@apollo/client";
import { darkModeVar } from "../apollo";
import { darkTheme, lightTheme } from "../styles";

const Container = styled.View`
  flex: 1;
`;

const Box = styled.View`
  background-color: ${(props) => props.theme.wrapperBg};
`;

const RowBox = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;

const Touchable = styled.TouchableOpacity``;

const Icon = styled(Ionicons)`
  color: ${(props) => props.theme.accent};
`;

const TakePhotoBtn = styled.TouchableOpacity`
  width: 80px;
  height: 80px;
  background-color: ${(props) => props.theme.bgColor};
  border: 5px solid ${(props) => props.theme.accent};
  border-radius: 40px;
`;

const Image = styled.Image`
  flex: 1;
`;

const Text = styled.Text`
  font-weight: bold;
  font-size: 24px;
  padding: 15px;
  color: ${(props) => props.theme.accent};
  background-color: ${(props) => props.theme.hoverColor};
`;

interface ImageProps {
  selected: boolean;
}

interface TakePhotoProps {
  navigation: NavigationProp<RootPhotoTabParamList, "TakePhoto">;
  route: RouteProp<RootPhotoTabParamList, "TakePhoto">;
}

const TakePhoto: React.FC<TakePhotoProps> = ({ navigation, route }) => {
  const darkMode = useReactiveVar(darkModeVar);
  const camera = useRef<Camera>();
  const [takenPhoto, setTakenPhoto] = useState<string>("");
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(0);
  const [flashMode, setFlashMode] = useState<FlashMode>(
    Camera.Constants.FlashMode.off,
  );
  const [cameraType, setCameraType] = useState<CameraType>(
    Camera.Constants.Type.front,
  );

  const getPermissions = async () => {
    const { granted, status } = await Camera.requestPermissionsAsync();
    console.log(granted, status);
  };

  const onCameraSwitch = () => {
    if (cameraType === Camera.Constants.Type.front) {
      setCameraType(Camera.Constants.Type.back);
    } else {
      setCameraType(Camera.Constants.Type.front);
    }
  };

  const onZoomValueChange = (e: React.SetStateAction<number>) => {
    setZoom(e);
  };

  const onFlashChange = () => {
    if (flashMode === Camera.Constants.FlashMode.off) {
      setFlashMode(Camera.Constants.FlashMode.on);
    } else if (flashMode === Camera.Constants.FlashMode.on) {
      setFlashMode(Camera.Constants.FlashMode.off);
    }
  };

  const goToUpload = async (save: boolean) => {
    const screenName = route.params.callbackScreen;
    if (save) {
      await MediaLibrary.saveToLibraryAsync(takenPhoto);
    }
    if (screenName === "SignUp" || screenName === "EditProfile") {
      navigation.navigate(screenName, {
        avatarUri: takenPhoto,
      });
    } else {
      navigation.navigate(screenName, {
        images: [takenPhoto],
        id: route.params.id,
      });
    }
  };

  const onUpload = () => {
    Alert.alert("Save photo?", "Save photo & upload or just upload", [
      {
        text: "Save & Upload",
        onPress: () => goToUpload(true),
      },
      {
        text: "Just Upload",
        onPress: () => goToUpload(false),
      },
    ]);
  };

  const onCameraReady = () => setCameraReady(true);

  const takePhoto = async () => {
    if (camera.current && cameraReady) {
      const { uri } = await camera.current.takePictureAsync({
        quality: 1,
        exif: true,
      });
      setTakenPhoto(uri);
    }
  };

  const onDismiss = () => setTakenPhoto("");

  useEffect(() => {
    if (Platform.OS !== "web") {
      getPermissions();
    }
  }, []);
  return (
    <Container>
      {takenPhoto === "" ? (
        <Camera
          ref={camera}
          style={{ flex: 1 }}
          type={cameraType}
          zoom={zoom}
          flashMode={flashMode}
          onCameraReady={onCameraReady}
        />
      ) : (
        <Image source={{ uri: takenPhoto }} />
      )}
      <Box style={{ flex: 0.4, padding: 15 }}>
        {takenPhoto === "" ? (
          <>
            <Box style={{ alignItems: "center", marginBottom: 5 }}>
              <Slider
                style={{ width: 200, height: 40 }}
                value={zoom}
                onValueChange={onZoomValueChange}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor={
                  darkMode ? darkTheme.accent : lightTheme.accent
                }
                maximumTrackTintColor={lightTheme.grayColor}
              />
            </Box>
            <RowBox>
              <Touchable onPress={onFlashChange}>
                <Icon
                  name={
                    flashMode === Camera.Constants.FlashMode.on
                      ? "flash"
                      : "flash-off-outline"
                  }
                  size={40}
                />
              </Touchable>
              <TakePhotoBtn onPress={takePhoto} />
              <Touchable onPress={onCameraSwitch}>
                <Icon name={"camera-reverse-outline"} size={40} />
              </Touchable>
            </RowBox>
          </>
        ) : (
          <RowBox style={{ height: "100%" }}>
            <Touchable onPress={onDismiss}>
              <Text>취소</Text>
            </Touchable>
            <Touchable onPress={onUpload}>
              <Text>업로드</Text>
            </Touchable>
          </RowBox>
        )}
      </Box>
    </Container>
  );
};

export default TakePhoto;

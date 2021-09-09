import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useReactiveVar } from "@apollo/client";
import { darkModeVar } from "../apollo";
import { darkTheme, lightTheme } from "../styles";
import { RouteProp } from "@react-navigation/native";
import { RootSharedStackParamList } from "./SharedStackNav";
import SelectPhoto from "../screens/SelectPhoto";
import TakePhoto from "../screens/TakePhoto";

export type RootPhotoTabParamList = RootSharedStackParamList & {
  SelectPhoto: {
    callbackScreen: keyof RootSharedStackParamList;
    photoLimit: number;
    id?: number;
  };
  TakePhoto: { callbackScreen: keyof RootSharedStackParamList; id?: number };
};

const Tab = createMaterialTopTabNavigator<RootPhotoTabParamList>();

interface PhotoNaviProps {
  route: RouteProp<RootSharedStackParamList, "Photo">;
}

const PhotoNavi: React.FC<PhotoNaviProps> = ({ route }) => {
  const darkMode = useReactiveVar(darkModeVar);
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: {
          backgroundColor: darkMode ? darkTheme.accent : lightTheme.accent,
        },
        tabBarActiveTintColor: darkMode
          ? darkTheme.fontColor
          : lightTheme.fontColor,
        tabBarStyle: {
          borderColor: darkMode ? darkTheme.accent : lightTheme.accent,
          backgroundColor: darkMode ? darkTheme.bgColor : lightTheme.bgColor,
        },
      }}
    >
      <Tab.Screen
        name="SelectPhoto"
        options={{ tabBarLabel: "사진" }}
        initialParams={{
          callbackScreen: route.params.callbackScreen,
          photoLimit: route.params.photoLimit,
          id: route.params.id,
        }}
        component={SelectPhoto}
      />
      <Tab.Screen
        name="TakePhoto"
        options={{ tabBarLabel: "카메라" }}
        initialParams={{
          callbackScreen: route.params.callbackScreen,
          id: route.params.id,
        }}
        component={TakePhoto}
      />
    </Tab.Navigator>
  );
};

export default PhotoNavi;

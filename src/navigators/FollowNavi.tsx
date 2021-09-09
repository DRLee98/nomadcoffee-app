import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useReactiveVar } from "@apollo/client";
import { darkModeVar } from "../apollo";
import { darkTheme, lightTheme } from "../styles";
import Followers from "../screens/Followers";
import Following from "../screens/Following";
import { RouteProp } from "@react-navigation/native";
import { RootSharedStackParamList } from "./SharedStackNav";

export type RootFollowTabParamList = {
  Followers: { id: number };
  Following: { id: number };
};

const Tab = createMaterialTopTabNavigator<RootFollowTabParamList>();

interface FollowNaviProps {
  route: RouteProp<RootSharedStackParamList, "Follow">;
}

const FollowNavi: React.FC<FollowNaviProps> = ({ route }) => {
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
        name="Followers"
        options={{ tabBarLabel: "팔로워" }}
        initialParams={{ id: route.params.id }}
        component={Followers}
      />
      <Tab.Screen
        name="Following"
        options={{ tabBarLabel: "팔로잉" }}
        initialParams={{ id: route.params.id }}
        component={Following}
      />
    </Tab.Navigator>
  );
};

export default FollowNavi;

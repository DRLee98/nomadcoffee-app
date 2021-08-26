import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Text } from "react-native";
import Profile from "../screens/Profile";

export type RootLoggedInUserStackParamList = {
  Profile: undefined;
};

const Stack = createStackNavigator<RootLoggedInUserStackParamList>();

const LoggedInUserStackNavi = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
};

export default LoggedInUserStackNavi;

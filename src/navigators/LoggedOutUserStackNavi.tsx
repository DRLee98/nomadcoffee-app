import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import Logo from "../components/Logo";

export type RootLoggedOutUserStackParamList = {
  Login: { username: string; password: string } | undefined;
  SignUp: undefined;
};

const Stack = createStackNavigator<RootLoggedOutUserStackParamList>();

const LoggedOutUserStackNavi = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerTitle: Logo,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
};

export default LoggedOutUserStackNavi;

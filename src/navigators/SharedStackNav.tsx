import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import Logo from "../components/Logo";
import Home from "../screens/Home";
import Search from "../screens/Search";
import MyProfile from "../screens/MyProfile";
import Profile from "../screens/Profile";
import { useReactiveVar } from "@apollo/client";
import { darkModeVar, isLoggedInVar } from "../apollo";

export type RootSharedStackParamList = {
  Home: undefined;
  Search: undefined;
  Profile: undefined;
  MyProfile: undefined;
  Login: { username: string; password: string } | undefined;
  SignUp: undefined;
};

const Stack = createStackNavigator<RootSharedStackParamList>();

interface SharedStackNavProps {
  screenName: string;
}

const SharedStackNav: React.FC<SharedStackNavProps> = ({ screenName }) => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const darkMode = useReactiveVar(darkModeVar);
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerTitle: Logo,
        headerBackTitleVisible: false,
      }}
    >
      {screenName === "Home" ? (
        <Stack.Screen name="Home" component={Home} />
      ) : null}
      {screenName === "Search" ? (
        <Stack.Screen name="Search" component={Search} />
      ) : null}
      {screenName === "Profile" && !isLoggedIn ? (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
        </>
      ) : (
        <Stack.Screen name="MyProfile" component={MyProfile} />
      )}
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
};

export default SharedStackNav;

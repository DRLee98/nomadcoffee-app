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
import DarkModeBtn from "../components/DarkMode";
import { darkTheme, lightTheme } from "../styles";
import EditProfile from "../screens/EditProfile";
import FollowNavi from "./FollowNavi";
import Category from "../screens/Category";
import Detail from "../screens/Detail";
import AddShop from "../screens/AddShop";
import EditShop from "../screens/EditShop";
import PhotoNavi from "./PhotoNavi";

export type RootSharedStackParamList = {
  Home: undefined;
  Search: undefined;
  Profile: { id: number };
  MyProfile: undefined;
  EditProfile: {
    id: number;
    avatarUri?: string;
    username?: string;
    email?: string;
    name?: string;
    location?: string;
    currentAvatar?: string;
  };
  Login: { username: string; password: string } | undefined;
  SignUp: { avatarUri: string } | undefined;
  Category: { name: string; slug: string };
  Detail: { id: number };
  AddShop: { images?: string[] } | undefined;
  EditShop: {
    id: number;
    name?: string;
    categories?: string;
    address?: string | null;
    images?: string[];
    currentImages?: string[];
  };
  Follow: { id: number };
  Photo: {
    id?: number;
    callbackScreen: keyof RootSharedStackParamList;
    photoLimit: number;
  };
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
        headerTitleStyle: { fontWeight: "bold" },
        headerTintColor: darkMode ? darkTheme.fontColor : lightTheme.fontColor,
        headerBackTitleVisible: false,
        headerRight: DarkModeBtn,
        headerStyle: {
          borderBottomColor: darkMode ? darkTheme.bgColor : lightTheme.bgColor,
          backgroundColor: darkMode ? darkTheme.bgColor : lightTheme.bgColor,
        },
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
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="Follow" component={FollowNavi} />
      <Stack.Screen name="Photo" component={PhotoNavi} />
      <Stack.Screen name="Detail" component={Detail} />
      <Stack.Screen
        name="Category"
        options={{
          headerTitle: "카테고리",
        }}
        component={Category}
      />
      <Stack.Screen
        name="AddShop"
        options={{
          headerTitle: "커피숍 추가",
        }}
        component={AddShop}
      />
      <Stack.Screen
        name="EditShop"
        options={{
          headerTitle: "커피숍 수정",
        }}
        component={EditShop}
      />
    </Stack.Navigator>
  );
};

export default SharedStackNav;

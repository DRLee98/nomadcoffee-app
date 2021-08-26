import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import routes from "../routes";
import TabIcon from "../components/nav/TabIcon";
import UserStackNavi from "./LoggedOutUserStackNavi";
import { useReactiveVar } from "@apollo/client";
import { darkModeVar, isLoggedInVar } from "../apollo";
import LoggedInUserStackNavi from "./LoggedInUserStackNavi";
import LoggedOutUserStackNavi from "./LoggedOutUserStackNavi";
import Search from "../screens/Search";
import { darkTheme, lightTheme } from "../styles";

export type RootTabParamList = {
  Home: undefined;
  Search: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const TabsNavi = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const darkMode = useReactiveVar(darkModeVar);
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        tabBarShowLabel: false,
        tabBarActiveTintColor: darkMode ? darkTheme.accent : lightTheme.accent,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon iconName={"home"} color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon iconName={"search"} color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={isLoggedIn ? LoggedInUserStackNavi : LoggedOutUserStackNavi}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              iconName={"person-circle"}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabsNavi;

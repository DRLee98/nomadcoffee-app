import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabIcon from "../components/nav/TabIcon";
import { useReactiveVar } from "@apollo/client";
import { darkModeVar } from "../apollo";
import { darkTheme, lightTheme } from "../styles";
import SharedStackNav from "./SharedStackNav";

export type RootTabParamList = {
  Home: undefined;
  Search: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const TabsNavi = () => {
  const darkMode = useReactiveVar(darkModeVar);
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: darkMode ? darkTheme.accent : lightTheme.accent,
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon iconName={"home"} color={color} focused={focused} />
          ),
        }}
      >
        {() => <SharedStackNav screenName="Home" />}
      </Tab.Screen>
      <Tab.Screen
        name="Search"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon iconName={"search"} color={color} focused={focused} />
          ),
        }}
      >
        {() => <SharedStackNav screenName="Search" />}
      </Tab.Screen>
      <Tab.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              iconName={"person-circle"}
              color={color}
              focused={focused}
            />
          ),
        }}
      >
        {() => <SharedStackNav screenName="Profile" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default TabsNavi;

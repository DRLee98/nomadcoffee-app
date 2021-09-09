import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabIcon from "../components/nav/TabIcon";
import { useReactiveVar } from "@apollo/client";
import { darkModeVar } from "../apollo";
import { darkTheme, lightTheme } from "../styles";
import SharedStackNav from "./SharedStackNav";

export type RootTabParamList = {
  TabHome: undefined;
  TabSearch: undefined;
  TabProfile: undefined;
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
        tabBarStyle: {
          borderTopColor: darkMode ? darkTheme.bgColor : lightTheme.bgColor,
          backgroundColor: darkMode ? darkTheme.bgColor : lightTheme.bgColor,
        },
      }}
    >
      <Tab.Screen
        name="TabHome"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon iconName={"home"} color={color} focused={focused} />
          ),
        }}
      >
        {() => <SharedStackNav screenName="Home" />}
      </Tab.Screen>
      <Tab.Screen
        name="TabSearch"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon iconName={"search"} color={color} focused={focused} />
          ),
        }}
      >
        {() => <SharedStackNav screenName="Search" />}
      </Tab.Screen>
      <Tab.Screen
        name="TabProfile"
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

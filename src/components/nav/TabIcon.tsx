import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

export interface TabIconProps {
  iconName: any;
  color: string;
  focused: boolean;
}

export default function TabIcon({ iconName, color, focused }: TabIconProps) {
  return (
    <Ionicons
      name={focused ? iconName : `${iconName}-outline`}
      color={color}
      size={22}
    />
  );
}

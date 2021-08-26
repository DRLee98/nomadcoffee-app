import React from "react";
import { ActivityIndicator, View } from "react-native";

interface ScreenLayoutProps {
  loading: Boolean;
  children: React.ReactChild;
}

export default function ScreenLayout({ loading, children }: ScreenLayoutProps) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: 900,
        margin: "auto",
      }}
    >
      {loading ? <ActivityIndicator color="gray" /> : children}
    </View>
  );
}
